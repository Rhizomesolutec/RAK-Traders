import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Award, MoveRight, Scale, ShieldCheck } from "lucide-react";
import { BulkOrderContactSection } from "@/components/BulkOrderContactSection";
import { DeliveryChecker } from "@/components/DeliveryChecker";
import { HeroSection } from "@/components/HeroSection";
import { HomeAboutSection } from "@/components/HomeAboutSection";
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
    text: "Live per-kilogram and 65 kg wholesale bag pricing published directly from our Mangalore & Kerala trade desk.",
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
      <section className="section-wrap py-12 sm:py-20">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end sm:gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#9a7332] uppercase">
                Curated Collection
              </p>
              <h2 className="font-display mt-1.5 text-2xl font-semibold tracking-tight text-ink sm:mt-2 sm:text-4xl">
                Our Arecanut Grades
              </h2>
              <p className="mt-1.5 max-w-xl text-sm text-muted sm:mt-2 sm:text-base">
                Tap or hover the golden preview ring on any pack to inspect the cross-section nut quality.
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

        <Reveal delay={100} className="mt-6 sm:mt-10">
          <ProductGrid products={products} />
        </Reveal>
      </section>

      {/* Craft & Heritage Pillars — Single-line horizontal swipe on mobile, 3-col grid on md+ */}
      <section className="border-y border-[#e8e1d7] bg-[#13110f] py-12 text-white sm:py-20">
        <div className="section-wrap">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold tracking-[0.22em] text-[#e7c97a] uppercase">
                The RAK Standard
              </p>
              <h2 className="font-display mt-2 text-2xl font-semibold text-white sm:text-4xl">
                Built on Trust Since 1980
              </h2>
              <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-white/55 uppercase md:hidden">
                Swipe to view standards
                <MoveRight size={13} className="text-[#e7c97a]" />
              </p>
            </div>
          </Reveal>

          <div className="mobile-product-row mt-7 flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-2 sm:mt-12 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Reveal
                  key={item.title}
                  delay={idx * 90}
                  className="w-[78vw] max-w-[290px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink"
                >
                  <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors duration-300 hover:border-[#c9a24b]/40 hover:bg-white/[0.06] sm:p-7">
                    <div className="grid h-11 w-11 place-items-center rounded-xl border border-[#c9a24b]/35 bg-[#c9a24b]/12 text-[#e7c97a] sm:h-12 sm:w-12">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-display mt-4 text-lg font-semibold text-white sm:mt-5 sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/65 sm:mt-2.5 sm:text-sm">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Try Before You Buy — Cream Sample Packets */}
      <section id="samples" className="border-b border-[#e8e1d7] bg-[#f4efe7]/70 py-12 sm:py-20">
        <div className="section-wrap">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end sm:gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-[#9a7332] uppercase">
                  Quality First
                </p>
                <h2 className="font-display mt-1.5 text-2xl font-semibold tracking-tight text-ink sm:mt-2 sm:text-4xl">
                  Try Before You Buy
                </h2>
                <p className="mt-1.5 max-w-xl text-sm text-muted sm:mt-2 sm:text-base">
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

          <Reveal delay={100} className="mt-5 sm:mt-6">
            <SampleOrderSelector products={products} />
          </Reveal>
        </div>
      </section>

      {/* Contact for Bulk Orders (WhatsApp redirect & 2 black packs) */}
      <Reveal>
        <BulkOrderContactSection whatsappNumber={settings.whatsappNumber} />
      </Reveal>

      {/* Neat About Section */}
      <div className="border-t border-[#e8e1d7] bg-[#f4efe7]/45">
        <Reveal>
          <HomeAboutSection />
        </Reveal>
      </div>
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
      <section className="section-wrap pt-4 pb-8">
        <Reveal>
          <DeliveryChecker />
        </Reveal>
      </section>
    </>
  );
}
