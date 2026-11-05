import Image from "next/image";
import { Suspense } from "react";
import { BulkOrderSelector } from "@/components/BulkOrderSelector";
import { CardSlider } from "@/components/CardSlider";
import { DeliveryChecker } from "@/components/DeliveryChecker";
import { ProductGrid } from "@/components/ProductCard";
import { SampleOrderSelector } from "@/components/SampleOrderSelector";
import { COMPANY } from "@/lib/company";
import { getPublicProducts, getSettings } from "@/lib/catalog";

const trust = ["Premium Quality", "Pan-India Delivery", "Transparent Daily Rates"];

async function HomeCatalog() {
  const [products, settings] = await Promise.all([getPublicProducts(), getSettings()]);
  return (
    <>
      <section className="section-wrap border-t border-[#e4e7ec] py-8">
        <h2 className="text-2xl font-semibold">Our Arecanut Grades</h2>
        <p className="mt-2 max-w-2xl text-lg">Choose from our carefully selected arecanut grades for your wholesale requirements.</p>
        <div className="mt-6">
          <ProductGrid products={products} />
        </div>
      </section>
      <section id="samples" className="border-t border-[#e4e7ec] bg-[#f7f8fa] py-8">
        <div className="section-wrap">
          <h2 className="text-2xl font-semibold">Try Before You Buy</h2>
          <p className="mt-2 mb-6 max-w-2xl text-lg">Experience the quality of our arecanut before placing your wholesale order.</p>
          <SampleOrderSelector products={products} />
        </div>
      </section>
      <section id="bulk-orders" className="section-wrap border-t border-[#e4e7ec] py-8">
        <h2 className="text-2xl font-semibold">65 kg bulk orders</h2>
        <p className="mt-2 mb-6 max-w-2xl text-lg">One bag is 65 kg. Two bags are 130 kg. Three bags are 195 kg.</p>
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
      <section className="relative isolate flex min-h-[calc(100svh-7.25rem)] flex-col overflow-hidden lg:h-[calc(100svh-7.25rem)] lg:flex-row">
        <Image
          src="/images/products/moti/Cutout_Moti.png"
          alt=""
          fill
          priority
          className="object-contain object-center scale-[0.82]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#1f2933]/60" />
        <div className="section-wrap relative z-10 flex flex-col justify-center py-8 text-white lg:w-1/2 lg:py-12">
          <p className="text-sm font-semibold tracking-wide uppercase">{COMPANY.legalName}</p>
          <h1 className="mt-3 max-w-xl text-4xl leading-tight font-semibold md:text-6xl">{COMPANY.tagline}</h1>
          <p className="mt-4 max-w-xl text-lg leading-8">
            Your trusted wholesale arecanut supplier from Kerala. Explore premium supari grades, check transparent daily prices, and order samples or bulk quantities with delivery across India.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {trust.map((item) => (
              <li key={item} className="rounded-full bg-white/15 px-3 py-1 text-sm">{item}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href="#bulk-orders" className="btn btn-primary">Order a 65 kg bag</a>
            <a href="#samples" className="btn border border-white bg-white text-[#1f2933]">Try a sample</a>
          </div>
        </div>
        <div className="relative z-10 flex min-h-80 flex-1 items-center justify-center px-4 pb-6 lg:min-h-0 lg:w-1/2 lg:px-10 lg:py-8">
          <div className="relative h-[min(52vh,520px)] w-full max-w-lg lg:h-full lg:max-h-full">
            <Image
              src="/images/products/moti/Cutout_Moti.png"
              alt="Closed RAK TRADERS Moti 65 kg pack"
              fill
              priority
              className="object-contain object-center scale-[0.86]"
              sizes="(max-width: 1024px) 90vw, 50vw"
            />
          </div>
        </div>
      </section>
      <Suspense fallback={<p className="section-wrap py-10 text-lg">Loading grades and rates…</p>}>
        <HomeCatalog />
      </Suspense>
      <section className="section-wrap border-t border-[#e4e7ec] py-8">
        <h2 className="mb-3 text-2xl font-semibold">Delivery</h2>
        <p className="mb-6 max-w-2xl text-lg leading-8">
          Wholesale orders can be arranged across India after confirmation. A PIN code is shown as available only when it is enabled for delivery. Other PIN codes can still be submitted and are confirmed before dispatch.
        </p>
        <DeliveryChecker />
      </section>
    </>
  );
}
