import type { Metadata } from "next";
import { Suspense } from "react";
import { SampleOrderSelector } from "@/components/SampleOrderSelector";
import { getPublicProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Sample Orders",
  description: "Order 250 g, 500 g, or 1 kg arecanut samples from RAK TRADERS.",
};

async function Samples() {
  const products = await getPublicProducts();
  return <SampleOrderSelector products={products} />;
}

export default function SampleOrdersPage() {
  return (
    <section className="section-wrap py-12 sm:py-16">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#9a7332] uppercase">Quality First</p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-ink sm:text-4xl">Try Before You Buy</h1>
      <p className="mt-3 mb-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">Experience the quality of our arecanut before placing your wholesale order.</p>
      <Suspense fallback={<p className="text-muted">Loading sample options…</p>}>
        <Samples />
      </Suspense>
    </section>
  );
}
