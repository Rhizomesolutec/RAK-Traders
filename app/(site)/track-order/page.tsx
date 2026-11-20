import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackOrderForm } from "@/components/TrackOrderForm";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track a RAK TRADERS arecanut order with the order number and mobile number.",
};

async function Tracker({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const params = await searchParams;
  return <TrackOrderForm initialOrder={params.order ?? ""} />;
}

export default function TrackOrderPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  return (
    <section className="section-wrap py-12 sm:py-16">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#9a7332] uppercase">Order Status</p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-ink sm:text-4xl">Track Your Order</h1>
      <p className="mt-3 mb-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">Use the order number from checkout and the same mobile number. Another customer’s order will not open.</p>
      <Suspense fallback={<p className="text-muted">Loading the tracker…</p>}>
        <Tracker searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
