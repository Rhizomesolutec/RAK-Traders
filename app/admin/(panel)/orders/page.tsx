import Link from "next/link";
import { Suspense } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { ORDER_STATUSES, STATUS_LABELS, type OrderStatus } from "@/lib/company";
import { formatDateTime } from "@/lib/dates";
import { formatInr } from "@/lib/money";

async function Orders({ searchParams }: { searchParams: Promise<{ q?: string; type?: string; status?: string }> }) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const where: Prisma.OrderWhereInput = {};
  if (params.type === "SAMPLE" || params.type === "BULK" || params.type === "MIXED") where.orderType = params.type;
  if (params.status && ORDER_STATUSES.includes(params.status as OrderStatus)) where.status = params.status;
  if (q) {
    where.OR = [
      { orderNumber: { contains: q.toUpperCase() } },
      { customer: { mobile: { contains: q } } },
    ];
  }
  const orders = await prisma.order.findMany({
    where,
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <form className="panel mb-4 grid gap-3 p-4 md:grid-cols-4">
        <label className="field"><span>Order or mobile</span><input name="q" defaultValue={q} /></label>
        <label className="field">
          <span>Type</span>
          <select name="type" defaultValue={params.type ?? ""}>
            <option value="">All</option>
            <option value="SAMPLE">Sample</option>
            <option value="BULK">Bulk</option>
            <option value="MIXED">Mixed</option>
          </select>
        </label>
        <label className="field">
          <span>Status</span>
          <select name="status" defaultValue={params.status ?? ""}>
            <option value="">All</option>
            {ORDER_STATUSES.map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
          </select>
        </label>
        <button className="btn btn-primary self-end" type="submit">Search</button>
      </form>
      {orders.length === 0 ? <p className="panel p-5">No orders match this search.</p> : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-forest text-white">
              <tr>{["Order", "Customer", "Type", "Status", "Total", ""].map((heading) => <th key={heading || "open"} className="px-3 py-3">{heading}</th>)}</tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-sand">
                  <td className="px-3 py-3">
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted">{formatDateTime(order.createdAt)}</p>
                  </td>
                  <td className="px-3 py-3">{order.customer.name}<br />{order.customer.mobile}</td>
                  <td className="px-3 py-3">{order.orderType}</td>
                  <td className="px-3 py-3">{STATUS_LABELS[order.status as OrderStatus]}</td>
                  <td className="px-3 py-3">{formatInr(order.totalPaise)}</td>
                  <td className="px-3 py-3"><Link className="font-semibold text-forest underline" href={`/admin/orders/${order.id}`}>Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string; status?: string }> }) {
  return (
    <section>
      <h1 className="mb-5 text-3xl font-semibold text-forest">Orders</h1>
      <Suspense fallback={<p>Loading orders…</p>}><Orders searchParams={searchParams} /></Suspense>
    </section>
  );
}
