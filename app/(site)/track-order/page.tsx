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
    <section className="section-wrap py-10">
      <h1 className="text-4xl font-semibold text-forest">Track Your Order</h1>
      <p className="mt-3 mb-6 max-w-2xl text-lg leading-8">Use the order number from checkout and the same mobile number. Another customer’s order will not open.</p>
      <Suspense fallback={<p>Loading the tracker…</p>}>
        <Tracker searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
