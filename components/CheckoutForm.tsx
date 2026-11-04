"use client";

import { useState } from "react";
import Link from "next/link";
import { INDIAN_STATES } from "@/lib/company";
import { formatInr } from "@/lib/money";
import { formatWeight } from "@/lib/weight";
import { whatsappHref } from "@/lib/whatsapp";
import { placeOrder, type CheckoutResult } from "@/app/actions/public";
import { CartSummary } from "@/components/CartSummary";
import { useCart } from "@/components/cart/CartProvider";

const empty = {
  name: "",
  mobile: "",
  whatsapp: "",
  email: "",
  addressLine: "",
  state: "Kerala",
  district: "",
  city: "",
  pinCode: "",
};

export function CheckoutForm({ whatsappNumber }: { whatsappNumber: string }) {
  const { items, clear, subtotalPaise } = useCart();
  const [form, setForm] = useState(empty);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<CheckoutResult | null>(null);

  function set<K extends keyof typeof empty>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const orderType = items.some((item) => item.orderType === "BULK") && items.some((item) => item.orderType === "SAMPLE")
    ? "Sample and bulk order"
    : items.some((item) => item.orderType === "BULK")
      ? "Bulk order"
      : "Sample order";

  const message = [
    "Hello RAK TRADERS, I would like to place this order.",
    `Name: ${form.name}`,
    `Mobile: ${form.mobile}`,
    `WhatsApp: ${form.whatsapp}`,
    form.email ? `Email: ${form.email}` : "",
    `Order type: ${orderType}`,
    ...items.map((item) => {
      const weight = item.orderType === "BULK" ? `${item.quantity * 65} kg` : formatWeight((item.sampleWeightG ?? 0) * item.quantity);
      return `${item.name} (${item.gradeLabel}) · ${item.orderType === "BULK" ? "Bulk" : "Sample"} · ${weight} · Qty ${item.quantity} · ${formatInr(item.unitPricePaise * item.quantity)}`;
    }),
    `Product total: ${formatInr(subtotalPaise)}`,
    `Address: ${form.addressLine}, ${form.city}, ${form.district}, ${form.state} - ${form.pinCode}`,
    "Please confirm the rate and delivery charge.",
  ].filter(Boolean).join("\n");

  const href = whatsappHref(whatsappNumber, message);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      const response = await placeOrder({ ...form, items });
      setResult(response);
      if (response.ok) clear();
    } catch {
      setResult({ ok: false, message: "The order could not be submitted. Please try again." });
    } finally {
      setPending(false);
    }
  }

  if (result?.ok) {
    const followUp = whatsappHref(
      whatsappNumber,
      `Hello RAK TRADERS, I submitted order ${result.orderNumber}. Please confirm it.`,
    );
    return (
      <div className="panel p-6">
        <h2 className="text-3xl font-semibold text-forest">Order received</h2>
        <p className="mt-3 text-lg">Your order number is <strong>{result.orderNumber}</strong>.</p>
        <p className="mt-2 text-base leading-7">Product total: {formatInr(result.totalPaise - (result.deliveryChargePaise ?? 0))}. {result.deliveryChargePaise == null ? "Delivery charge will be confirmed." : `Delivery charge: ${formatInr(result.deliveryChargePaise)}.`} Keep the order number and the mobile number used at checkout to track dispatch.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href={`/track-order?order=${result.orderNumber}`} className="btn btn-primary">Track this order</Link>
          {followUp ? <a className="btn btn-primary" href={followUp} target="_blank" rel="noopener noreferrer">Send on WhatsApp</a> : null}
        </div>
        <p className="mt-4 text-sm text-muted">WhatsApp opens a message for you to send. It is not sent automatically.</p>
      </div>
    );
  }

  const errors = result && !result.ok ? result.fieldErrors : undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
      <form onSubmit={onSubmit} className="grid gap-4">
        <h2 className="text-2xl font-semibold text-forest">Delivery details</h2>
        {result && !result.ok ? <p className="rounded-xl bg-[#f8ece4] px-4 py-3">{result.message}</p> : null}
        <label className="field"><span>Full Name</span><input value={form.name} onChange={(event) => set("name", event.target.value)} required /></label>
        {errors?.name ? <p className="text-sm text-[#8a3b1d]">{errors.name}</p> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="field"><span>Mobile Number</span><input inputMode="numeric" value={form.mobile} onChange={(event) => set("mobile", event.target.value)} required /></label>
          <label className="field"><span>WhatsApp Number</span><input inputMode="numeric" value={form.whatsapp} onChange={(event) => set("whatsapp", event.target.value)} required /></label>
        </div>
        {errors?.mobile ? <p className="text-sm text-[#8a3b1d]">{errors.mobile}</p> : null}
        {errors?.whatsapp ? <p className="text-sm text-[#8a3b1d]">{errors.whatsapp}</p> : null}
        <label className="field"><span>Email (optional)</span><input type="email" value={form.email} onChange={(event) => set("email", event.target.value)} /></label>
        {errors?.email ? <p className="text-sm text-[#8a3b1d]">{errors.email}</p> : null}
        <label className="field"><span>Delivery Address</span><textarea value={form.addressLine} onChange={(event) => set("addressLine", event.target.value)} required /></label>
        {errors?.addressLine ? <p className="text-sm text-[#8a3b1d]">{errors.addressLine}</p> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="field">
            <span>State</span>
            <select value={form.state} onChange={(event) => set("state", event.target.value)}>
              {INDIAN_STATES.map((state) => <option key={state}>{state}</option>)}
            </select>
          </label>
          <label className="field"><span>District</span><input value={form.district} onChange={(event) => set("district", event.target.value)} required /></label>
          <label className="field"><span>City</span><input value={form.city} onChange={(event) => set("city", event.target.value)} required /></label>
          <label className="field"><span>PIN Code</span><input inputMode="numeric" maxLength={6} value={form.pinCode} onChange={(event) => set("pinCode", event.target.value)} required /></label>
        </div>
        <p className="text-base"><span className="font-semibold">Order Type:</span> {items.length ? orderType : "Add products before checkout"}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="btn btn-primary" type="submit" disabled={pending || items.length === 0}>{pending ? "Submitting…" : "Submit Order"}</button>
          {href && items.length ? (
            <a className="btn btn-primary" href={href} target="_blank" rel="noopener noreferrer">Order on WhatsApp</a>
          ) : (
            <p className="text-sm text-muted">WhatsApp opens only after a company number is configured and the cart has items.</p>
          )}
        </div>
        <p className="text-sm text-muted">Submit Order saves the order and gives you a tracking number. Order on WhatsApp only opens a message. It is not sent automatically.</p>
      </form>
      <CartSummary checkout />
    </div>
  );
}
