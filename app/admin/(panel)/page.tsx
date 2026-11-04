import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/dates";
import { formatInr } from "@/lib/money";
import { STATUS_LABELS, type OrderStatus } from "@/lib/company";

async function Dashboard() {
  const [total, sample, bulk, pending, dispatched, recent] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { orderType: "SAMPLE" } }),
    prisma.order.count({ where: { orderType: "BULK" } }),
    prisma.order.count({ where: { status: { in: ["RECEIVED", "CONFIRMED", "PROCESSING"] } } }),
    prisma.order.count({ where: { status: { in: ["DISPATCHED", "IN_TRANSIT", "OUT_FOR_DELIVERY"] } } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { customer: true } }),
  ]);
  const cards = [
    ["Total orders", total],
    ["Sample orders", sample],
    ["Bulk orders", bulk],
    ["Pending orders", pending],
    ["Dispatched orders", dispatched],
  ];
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value]) => (
          <article key={String(label)} className="panel p-4">
            <p className="text-sm text-muted">{label}</p>
            <p className="text-3xl font-semibold text-forest">{value}</p>
          </article>
        ))}
      </div>
      <section className="panel mt-6 overflow-hidden">
        <h2 className="border-b border-sand px-4 py-3 text-xl font-semibold">Recent orders</h2>
        {recent.length === 0 ? <p className="p-4">No orders yet.</p> : (
          <ul>
            {recent.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-sand px-4 py-3">
                <div>
                  <Link href={`/admin/orders/${order.id}`} className="font-semibold text-forest underline">{order.orderNumber}</Link>
                  <p className="text-sm text-muted">{order.customer.name} · {order.customer.mobile} · {formatDateTime(order.createdAt)}</p>
                </div>
                <p>{STATUS_LABELS[order.status as OrderStatus]} · {formatInr(order.totalPaise)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default function AdminHomePage() {
  return (
    <section>
      <h1 className="mb-5 text-3xl font-semibold text-forest">Dashboard</h1>
      <Suspense fallback={<p>Loading orders…</p>}><Dashboard /></Suspense>
    </section>
  );
}
