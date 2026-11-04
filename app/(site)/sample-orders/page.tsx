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
    <section className="section-wrap py-14">
      <h1 className="text-4xl font-semibold text-forest">Try Before You Buy</h1>
      <p className="mt-3 mb-8 max-w-2xl text-lg leading-8">Experience the quality of our arecanut before placing your wholesale order.</p>
      <Suspense fallback={<p>Loading sample options…</p>}>
        <Samples />
      </Suspense>
    </section>
  );
}
