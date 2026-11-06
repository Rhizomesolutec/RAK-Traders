import Image from "next/image";
import { Suspense } from "react";
import { BulkOrderSelector } from "@/components/BulkOrderSelector";
import { CardSlider } from "@/components/CardSlider";
import { DeliveryChecker } from "@/components/DeliveryChecker";
import { ProductGrid } from "@/components/ProductCard";
import { SampleOrderSelector } from "@/components/SampleOrderSelector";
import { getPublicProducts, getSettings } from "@/lib/catalog";
import { COMPANY } from "@/lib/company";

async function HomeCatalog() {
  const [products, settings] = await Promise.all([getPublicProducts(), getSettings()]);
  return (
    <>
      <section className="section-wrap border-t border-[#e4e7ec] py-8">
        <h2 className="text-2xl font-semibold">Our Arecanut Grades</h2>
        <div className="mt-6">
          <ProductGrid products={products} />
        </div>
      </section>
      <section id="samples" className="border-t border-[#e4e7ec] bg-[#f7f8fa] py-8">
        <div className="section-wrap">
          <h2 className="mb-4 text-2xl font-semibold">Try Before You Buy</h2>
          <SampleOrderSelector products={products} />
        </div>
      </section>
      <section id="bulk-orders" className="section-wrap border-t border-[#e4e7ec] py-8">
        <h2 className="mb-6 text-2xl font-semibold">65 kg bulk orders</h2>
        <CardSlider label="65 kg bags">
          {products.map((product) => (
            <BulkOrderSelector key={product.id} product={product} whatsappNumber={settings.whatsappNumber} />
          ))}
        </CardSlider>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="relative isolate h-[calc(100svh-7.25rem)] overflow-hidden lg:h-[68vh] lg:max-h-[36rem] lg:min-h-[22rem]">
        <Image
          src="/images/hero/plantation.jpg"
          alt="Arecanut palms with fruit in a grove"
          fill
          priority
          unoptimized
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1f2933]/70 to-transparent" />
        <div className="section-wrap absolute inset-x-0 bottom-0 z-10 pb-5 text-white sm:pb-7">
          <p className="text-xs font-medium tracking-[0.18em] uppercase">{COMPANY.brand}</p>
          <h1 className="mt-1 text-xl font-medium sm:text-2xl">{COMPANY.tagline}</h1>
        </div>
      </section>
      <Suspense fallback={<p className="section-wrap py-10 text-lg">Loading grades and rates…</p>}>
        <HomeCatalog />
      </Suspense>
      <section className="section-wrap border-t border-[#e4e7ec] py-8">
        <h2 className="mb-4 text-2xl font-semibold">Delivery</h2>
        <DeliveryChecker />
      </section>
    </>
  );
}
