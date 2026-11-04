"use client";

import { useState } from "react";
import { trackOrder, type TrackResult } from "@/app/actions/public";
import { OrderStatusTimeline } from "@/components/OrderStatusTimeline";
import type { OrderStatus } from "@/lib/company";

export function TrackOrderForm({ initialOrder = "" }: { initialOrder?: string }) {
  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [mobile, setMobile] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      setResult(await trackOrder(orderNumber, mobile));
    } catch {
      setResult({ ok: false, message: "Order not found. Please check your order number and mobile number." });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <form onSubmit={onSubmit} className="panel grid gap-4 self-start p-5">
        <label className="field"><span>Order Number</span><input value={orderNumber} onChange={(event) => setOrderNumber(event.target.value)} placeholder="RAK-2026-00001" /></label>
        <label className="field"><span>Mobile Number</span><input inputMode="numeric" value={mobile} onChange={(event) => setMobile(event.target.value)} placeholder="10-digit mobile" /></label>
        <button className="btn btn-primary" type="submit" disabled={pending}>{pending ? "Checking…" : "Track Order"}</button>
      </form>
      <div>
        {!result ? <p className="text-lg leading-8 text-muted">Enter the order number and the mobile number used at checkout.</p> : null}
        {result && !result.ok ? <p className="panel p-5 text-lg">{result.message}</p> : null}
        {result && result.ok ? (
          <div className="panel p-5">
            <p className="text-sm font-semibold tracking-wide text-gold uppercase">{result.orderType}</p>
            <h2 className="mt-1 text-3xl font-semibold text-forest">{result.orderNumber}</h2>
            <p className="mt-2">Status: {result.statusLabel}</p>
            <p>Order date: {result.orderDate}</p>
            <p>Last updated: {result.updatedAt}</p>
            {result.trackingNumber ? <p>Tracking number: {result.trackingNumber}</p> : null}
            {result.transportInfo ? <p>Transport: {result.transportInfo}</p> : <p>Transport details will appear after dispatch.</p>}
            <ul className="mt-4 space-y-2">
              {result.items.map((item) => (
                <li key={`${item.name}-${item.detail}`} className="rounded-xl bg-cream px-4 py-3">
                  <strong>{item.name}</strong> · {item.grade}<br />{item.detail} · {item.total}
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <OrderStatusTimeline
                current={result.status as OrderStatus}
                events={result.timeline.filter((item) => item.at).map((item) => ({ status: item.status, at: item.at }))}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
