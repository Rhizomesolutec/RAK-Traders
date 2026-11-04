import type { Metadata } from "next";
import { Suspense } from "react";
import { RateTable } from "@/components/RateTable";
import { formatDateTime } from "@/lib/dates";
import { getPublicProducts, getSettings } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Today's Arecanut Rates",
  description: "Transparent wholesale arecanut prices from RAK TRADERS.",
};

async function Rates() {
  const [products, settings] = await Promise.all([getPublicProducts(), getSettings()]);
  const updated = products
    .filter((product) => product.todayRatePerKgPaise != null && product.rateUpdatedAt)
    .map((product) => product.rateUpdatedAt as string)
    .sort()
    .at(-1);
  return (
    <>
      <p className="mt-3 text-base text-muted">Last updated: {updated ? formatDateTime(new Date(updated)) : "Not yet published"}</p>
      <div className="mt-8">
        <RateTable products={products} whatsappNumber={settings.whatsappNumber} />
      </div>
    </>
  );
}

export default function TodayRatePage() {
  return (
    <section className="section-wrap py-10">
      <h1 className="text-3xl font-semibold text-forest">Today&apos;s Arecanut Rates</h1>
      <p className="mt-3 max-w-2xl text-lg leading-8">Transparent wholesale prices from RAK TRADERS.</p>
      <Suspense fallback={<p className="mt-6">Loading today’s rates…</p>}>
        <Rates />
      </Suspense>
    </section>
  );
}
