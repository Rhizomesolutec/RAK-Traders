import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { STATUS_LABELS, type OrderStatus } from "@/lib/company";
import { formatDateTime } from "@/lib/dates";

async function DispatchList() {
  const orders = await prisma.order.findMany({
    where: { status: { notIn: ["DELIVERED", "CANCELLED"] } },
    include: { customer: true },
    orderBy: { updatedAt: "desc" },
  });
  if (orders.length === 0) return <p className="panel p-5">No open orders to dispatch.</p>;
  return (
    <ul className="panel divide-y divide-sand">
      {orders.map((order) => (
        <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="font-semibold">{order.orderNumber} · {STATUS_LABELS[order.status as OrderStatus]}</p>
            <p className="text-sm text-muted">{order.customer.name} · {order.customer.mobile} · Updated {formatDateTime(order.updatedAt)}</p>
            <p className="text-sm">{order.trackingNumber || "No tracking number"}{order.transportInfo ? ` · ${order.transportInfo}` : ""}</p>
          </div>
          <Link className="btn btn-secondary" href={`/admin/orders/${order.id}`}>Update</Link>
        </li>
      ))}
    </ul>
  );
}

export default function DispatchPage() {
  return (
    <section>
      <h1 className="mb-5 text-3xl font-semibold text-forest">Dispatch Tracking</h1>
      <Suspense fallback={<p>Loading dispatch list…</p>}><DispatchList /></Suspense>
    </section>
  );
}
