"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getPublicProducts } from "@/lib/catalog";
import { cartOrderType, priceCart } from "@/lib/orders";
import { formatWeight } from "@/lib/weight";
import { validateCustomer, isValidPin, type FieldErrors } from "@/lib/validators";
import type { CartItem, PinCheckResult } from "@/lib/types";
import { ORDER_STATUSES, STATUS_LABELS, type OrderStatus } from "@/lib/company";
import { formatDateTime } from "@/lib/dates";
import { formatInr } from "@/lib/money";

const UNAVAILABLE = "Delivery availability for your location needs confirmation. Contact us on WhatsApp.";
const AVAILABLE = "Delivery is available to your PIN code. Contact us for delivery details.";
const INVALID_PIN = "Please enter a valid 6-digit Indian PIN code.";

export async function checkPin(code: string): Promise<PinCheckResult> {
  const pin = code.trim();
  if (!isValidPin(pin)) return { status: "invalid", message: INVALID_PIN };

  const row = await prisma.pinCode.findUnique({ where: { code: pin } });
  if (!row || !row.deliveryEnabled || !row.verified) {
    return { status: "confirm", message: UNAVAILABLE };
  }
  return {
    status: "available",
    message: AVAILABLE,
    area: `${row.area}, ${row.district}, ${row.state}`,
    chargePaise: row.chargePaise,
    estimateNote: row.estimateNote,
  };
}

export type CheckoutInput = {
  name: string;
  mobile: string;
  whatsapp: string;
  email: string;
  addressLine: string;
  state: string;
  district: string;
  city: string;
  pinCode: string;
  items: CartItem[];
};

export type CheckoutResult =
  | { ok: true; orderNumber: string; totalPaise: number; deliveryChargePaise: number | null }
  | { ok: false; message: string; fieldErrors?: FieldErrors };

export async function placeOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const fieldErrors = validateCustomer(input);
  if (!input.items?.length) fieldErrors.items = "Your cart is empty.";
  if (Object.keys(fieldErrors).length) {
    return { ok: false, message: "Please check the details below.", fieldErrors };
  }

  const products = await getPublicProducts();
  const priced = priceCart(input.items, products);
  if (priced.error || priced.lines.length === 0) {
    return { ok: false, message: priced.error ?? "Your cart could not be priced." };
  }
  const changed = priced.lines.find((line) => line.unitPricePaise !== line.item.unitPricePaise);
  if (changed) {
    return {
      ok: false,
      message: `The price for ${changed.product.name} has changed. Remove it from the cart and add it again.`,
    };
  }

  const subtotalPaise = priced.lines.reduce((sum, line) => sum + line.lineTotalPaise, 0);
  const pin = await prisma.pinCode.findUnique({ where: { code: input.pinCode.trim() } });
  const deliveryKnown = Boolean(pin?.deliveryEnabled && pin.verified);
  const deliveryChargePaise = deliveryKnown ? pin?.chargePaise ?? null : null;
  const totalPaise = subtotalPaise + (deliveryChargePaise ?? 0);
  const orderType = cartOrderType(priced.lines.map((line) => line.item));
  const year = Number(
    new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric" }).format(new Date()),
  );

  const order = await prisma.$transaction(async (tx) => {
    const sequence = await tx.orderSequence.upsert({
      where: { year },
      create: { year, last: 1 },
      update: { last: { increment: 1 } },
    });
    const orderNumber = `RAK-${year}-${String(sequence.last).padStart(5, "0")}`;
    const customer = await tx.customer.create({
      data: {
        name: input.name.trim(),
        mobile: input.mobile.trim(),
        whatsapp: input.whatsapp.trim(),
        email: input.email.trim() || null,
      },
    });
    return tx.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        orderType,
        status: "RECEIVED",
        addressLine: input.addressLine.trim(),
        state: input.state,
        district: input.district.trim(),
        city: input.city.trim(),
        pinCode: input.pinCode.trim(),
        deliveryChargePaise,
        deliveryNote: deliveryChargePaise == null ? "Delivery charge to be confirmed." : null,
        subtotalPaise,
        totalPaise,
        items: {
          create: priced.lines.map((line) => ({
            productId: line.product.id,
            productName: line.product.name,
            gradeLabel: line.product.gradeLabel,
            orderType: line.item.orderType,
            sampleWeightG: line.item.sampleWeightG,
            quantity: line.item.quantity,
            weightGrams: line.weightGrams,
            unitPricePaise: line.unitPricePaise,
            lineTotalPaise: line.lineTotalPaise,
          })),
        },
        events: { create: { status: "RECEIVED", note: "Order received from the website." } },
      },
    });
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  return { ok: true, orderNumber: order.orderNumber, totalPaise, deliveryChargePaise };
}

export type TrackResult =
  | {
      ok: true;
      orderNumber: string;
      orderDate: string;
      updatedAt: string;
      status: OrderStatus;
      statusLabel: string;
      orderType: string;
      trackingNumber: string | null;
      transportInfo: string | null;
      items: { name: string; grade: string; detail: string; quantity: number; total: string }[];
      timeline: { status: string; label: string; at: string; reached: boolean }[];
    }
  | { ok: false; message: string };

export async function trackOrder(orderNumber: string, mobile: string): Promise<TrackResult> {
  const number = orderNumber.trim().toUpperCase();
  const phone = mobile.trim();
  if (!/^RAK-\d{4}-\d{5}$/.test(number) || !/^[6-9]\d{9}$/.test(phone)) {
    return { ok: false, message: "Order not found. Please check your order number and mobile number." };
  }

  const order = await prisma.order.findFirst({
    where: { orderNumber: number, customer: { mobile: phone } },
    include: { items: true, events: { orderBy: { createdAt: "asc" } } },
  });
  if (!order || !ORDER_STATUSES.includes(order.status as OrderStatus)) {
    return { ok: false, message: "Order not found. Please check your order number and mobile number." };
  }

  const status = order.status as OrderStatus;
  const currentIndex = ORDER_STATUSES.indexOf(status);
  const timeline = ORDER_STATUSES.filter((item) => item !== "CANCELLED").map((item) => ({
    status: item,
    label: STATUS_LABELS[item],
    at: order.events.find((event) => event.status === item)
      ? formatDateTime(order.events.find((event) => event.status === item)!.createdAt)
      : "",
    reached: status === "CANCELLED" ? item === "RECEIVED" : ORDER_STATUSES.indexOf(item) <= currentIndex,
  }));

  return {
    ok: true,
    orderNumber: order.orderNumber,
    orderDate: formatDateTime(order.createdAt),
    updatedAt: formatDateTime(order.updatedAt),
    status,
    statusLabel: STATUS_LABELS[status],
    orderType: order.orderType === "MIXED" ? "Sample and bulk" : order.orderType === "BULK" ? "Bulk order" : "Sample order",
    trackingNumber: order.trackingNumber,
    transportInfo: order.transportInfo,
    items: order.items.map((item) => ({
      name: item.productName,
      grade: item.gradeLabel,
      detail:
        item.orderType === "BULK"
          ? `${item.quantity} bag${item.quantity > 1 ? "s" : ""} · ${formatWeight(item.weightGrams)}`
          : `${formatWeight(item.sampleWeightG ?? 0)} sample · ${item.quantity} pack${item.quantity > 1 ? "s" : ""}`,
      quantity: item.quantity,
      total: formatInr(item.lineTotalPaise),
    })),
    timeline,
  };
}
