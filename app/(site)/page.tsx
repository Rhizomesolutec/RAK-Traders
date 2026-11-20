import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Award, Scale, ShieldCheck } from "lucide-react";
import { BulkOrderSelector } from "@/components/BulkOrderSelector";
import { DeliveryChecker } from "@/components/DeliveryChecker";
import { HeroSection } from "@/components/HeroSection";
import { ProductGrid } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SampleOrderSelector } from "@/components/SampleOrderSelector";
import { getPublicProducts, getSettings } from "@/lib/catalog";

const pillars = [
  {
    icon: Award,
    title: "Precision Hand-Sorting",
    text: "Every batch is graded for uniform nut size, rich marbled interior, and consistent moisture levels before packing.",
  },
  {
    icon: Scale,
    title: "Transparent Daily Rates",
    text: "Live per-kilogram and 65 kg wholesale bag pricing published directly from our Ponnani trade desk.",
  },
  {
    icon: ShieldCheck,
    title: "Sample Before Bulk",
    text: "Inspect quality firsthand with 250 g, 500 g, or 1 kg sample pouches before committing to full wholesale loads.",
  },
];

async function HomeCatalog() {
  const [products, settings] = await Promise.all([getPublicProducts(), getSettings()]);
  return (
    <>
      {/* Our Arecanut Grades */}
      <section className="section-wrap py-16 sm:py-20">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#9a7332] uppercase">
                Curated Collection
              </p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Our Arecanut Grades
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
                Hover the golden preview ring on any pack to inspect the cross-section nut quality.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest transition-colors hover:text-forest-deep"
            >
              View All Grades
              <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-10">
          <ProductGrid products={products} />
        </Reveal>
      </section>

      {/* Craft & Heritage Pillars */}
      <section className="border-y border-[#e8e1d7] bg-[#13110f] py-16 text-white sm:py-20">
        <div className="section-wrap">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold tracking-[0.22em] text-[#e7c97a] uppercase">
                The RAK Standard
              </p>
              <h2 className="font-display mt-2 text-3xl font-semibold text-white sm:text-4xl">
                Built on Trust Since 1980
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={idx * 100} className="h-full">
                  <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-7 transition-colors duration-300 hover:border-[#c9a24b]/40 hover:bg-white/[0.06]">
                    <div className="grid h-12 w-12 place-items-center rounded-xl border border-[#c9a24b]/35 bg-[#c9a24b]/12 text-[#e7c97a]">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-display mt-5 text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-white/65">{item.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Try Before You Buy */}
      <section id="samples" className="border-b border-[#e8e1d7] bg-[#f4efe7]/70 py-16 sm:py-20">
        <div className="section-wrap">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-[#9a7332] uppercase">
                  Quality First
                </p>
                <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Try Before You Buy
                </h2>
                <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
                  Order sealed 250 g, 500 g, or 1 kg sample pouches to evaluate aroma, cut, and finish before placing bulk orders.
                </p>
              </div>
              <Link
                href="/sample-orders"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest transition-colors hover:text-forest-deep"
              >
                All Sample Packs
                <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={100} className="mt-6">
            <SampleOrderSelector products={products} />
          </Reveal>
        </div>
      </section>

      {/* 65 kg Bulk Orders */}
      <section id="bulk-orders" className="section-wrap py-16 sm:py-20">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#9a7332] uppercase">
                Wholesale Trade Bags
              </p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                65 kg Bulk Orders
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
                Select bag quantities for instant wholesale totals, or send a direct WhatsApp inquiry to our trade desk.
              </p>
            </div>
            <Link
              href="/today-rate"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest transition-colors hover:text-forest-deep"
            >
              Full Rate Sheet
              <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-10">
          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <BulkOrderSelector
                key={product.id}
                product={product}
                whatsappNumber={settings.whatsappNumber}
              />
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense
        fallback={
          <div className="section-wrap py-20 text-center">
            <p className="text-base text-muted">Loading grades and live rates…</p>
          </div>
        }
      >
        <HomeCatalog />
      </Suspense>
      <section className="section-wrap pb-8">
        <Reveal>
          <DeliveryChecker />
        </Reveal>
      </section>
    </>
  );
}
