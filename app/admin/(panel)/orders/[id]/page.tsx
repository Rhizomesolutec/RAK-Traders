import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { updateOrder } from "@/app/actions/admin";
import { ORDER_STATUSES, STATUS_LABELS, type OrderStatus } from "@/lib/company";
import { findOrderById } from "@/lib/store";
import { formatDateTime } from "@/lib/dates";
import { formatInr } from "@/lib/money";
import { formatWeight } from "@/lib/weight";

async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await findOrderById(id);
  if (!order) notFound();
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <article className="panel p-5">
        <Link href="/admin/orders" className="text-sm font-semibold underline">All orders</Link>
        <h2 className="mt-2 text-2xl font-semibold">{order.orderNumber}</h2>
        <p>{order.customer.name} · {order.customer.mobile} · WhatsApp {order.customer.whatsapp}</p>
        {order.customer.email ? <p>{order.customer.email}</p> : null}
        <p className="mt-3 whitespace-pre-line">{order.addressLine}{"\n"}{order.city}, {order.district}, {order.state} - {order.pinCode}</p>
        <p className="mt-3">Type: {order.orderType}</p>
        <p>Products: {formatInr(order.subtotalPaise)}</p>
        <p>{order.deliveryChargePaise == null ? "Delivery charge to be confirmed." : `Delivery charge: ${formatInr(order.deliveryChargePaise)}`}</p>
        <p className="text-xl font-semibold">Total recorded: {formatInr(order.totalPaise)}</p>
        <ul className="mt-4 space-y-2">
          {order.items.map((item) => (
            <li key={item.id} className="rounded-xl bg-cream px-3 py-2">
              {item.productName} · {item.gradeLabel} · {item.orderType} · {formatWeight(item.weightGrams)} · Qty {item.quantity} · {formatInr(item.lineTotalPaise)}
            </li>
          ))}
        </ul>
      </article>
      <div className="grid gap-5">
        <form action={updateOrder} className="panel grid gap-3 p-5">
          <input type="hidden" name="id" value={order.id} />
          <label className="field">
            <span>Status</span>
            <select name="status" defaultValue={order.status}>
              {ORDER_STATUSES.map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
            </select>
          </label>
          <label className="field"><span>Tracking number</span><input name="trackingNumber" defaultValue={order.trackingNumber ?? ""} /></label>
          <label className="field"><span>Courier or transport</span><input name="transportInfo" defaultValue={order.transportInfo ?? ""} /></label>
          <label className="field"><span>Internal notes</span><textarea name="internalNotes" defaultValue={order.internalNotes ?? ""} /></label>
          <label className="field"><span>Update note</span><input name="note" placeholder="Optional note for this status change" /></label>
          <button className="btn btn-primary" type="submit">Save dispatch details</button>
        </form>
        <article className="panel p-5">
          <h3 className="text-lg font-semibold">Status history</h3>
          <ul className="mt-3 space-y-2">
            {order.events.map((event) => (
              <li key={event.id}>
                <strong>{STATUS_LABELS[event.status as OrderStatus] ?? event.status}</strong>
                <span className="text-muted"> · {formatDateTime(event.createdAt)}</span>
                {event.note ? <span className="block">{event.note}</span> : null}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}

export default function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <section>
      <h1 className="mb-5 text-3xl font-semibold text-forest">Order</h1>
      <Suspense fallback={<p>Loading order…</p>}><OrderDetail params={params} /></Suspense>
    </section>
  );
}
