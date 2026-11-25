import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  MapPin,
  MoveRight,
  PackageCheck,
  Scale,
  ShieldCheck,
  Sprout,
  Truck,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getSettings } from "@/lib/catalog";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about RAK TRADERS INTERNATIONAL — supplying hand-graded Mangalore & Kerala arecanut (MOTI, VACHRAS, MORO, JAM, JEENI, FATTOR) since 1980.",
};

const processSteps = [
  {
    step: "01",
    icon: Sprout,
    title: "Direct Estate Sourcing",
    description:
      "We procure mature arecanut harvests directly from trusted family estates across Mangalore & Kerala, ensuring traceable origin and peak seasonal maturity.",
  },
  {
    step: "02",
    icon: Award,
    title: "Natural Curing & Sun-Drying",
    description:
      "Each harvest undergoes disciplined sun-drying and moisture monitoring so every nut develops its signature rich aroma, firm texture, and wholesale shelf stability.",
  },
  {
    step: "03",
    icon: ShieldCheck,
    title: "Precision Hand-Grading",
    description:
      "Experienced graders sort every lot by diameter, weight, and marbled interior into distinct trade grades — MOTI, VACHRAS, MORO, JAM, JEENI, and FATTOR.",
  },
  {
    step: "04",
    icon: Truck,
    title: "Moisture-Locked Packaging & Dispatch",
    description:
      "Packed in sealed cream sample pouches (250 g, 500 g, 1 kg), signature Chips/Salli cut packs, or 65 kg wholesale trade bags ready for reliable pan-India transport.",
  },
];

const values = [
  {
    icon: Scale,
    title: "Honest, Transparent Daily Rates",
    description:
      "We publish clear per-kilogram and 65 kg bag pricing directly from our Mangalore & Kerala trade desk with no hidden markups.",
  },
  {
    icon: PackageCheck,
    title: "Sample-First Confidence",
    description:
      "New and returning buyers can evaluate sealed sample pouches before booking bulk loads — what you test is exactly what arrives.",
  },
  {
    icon: MapPin,
    title: "45+ Years in Mangalore & Kerala",
    description:
      "Operating continuously since 1980 across the Mangalore & Kerala arecanut corridor, backed by multi-generational trade relationships.",
  },
];

async function AboutWhatsAppCta() {
  const settings = await getSettings();
  return (
    <WhatsAppButton
      number={settings.whatsappNumber}
      message="Hello RAK TRADERS INTERNATIONAL, I would like to know more about your wholesale arecanut grades and bulk supply."
      label="Connect on WhatsApp"
    />
  );
}

export default function AboutPage() {
  return (
    <div className="pb-12">
      {/* Editorial Hero Banner */}
      <section className="relative isolate overflow-hidden bg-[#13110f] py-12 text-white sm:py-24">
        <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-[#c9a24b]/12 blur-3xl" />
        <div className="section-wrap grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a24b]/40 bg-[#c9a24b]/12 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[#e7c97a] uppercase sm:px-4 sm:text-xs sm:tracking-[0.2em]">
              Since 1980 · Mangalore &amp; Kerala
            </span>
            <h1 className="font-display mt-4 text-3xl leading-tight font-semibold text-white sm:mt-5 sm:text-5xl">
              The Story Behind{" "}
              <span className="bg-gradient-to-r from-[#f3d78e] to-[#d4af37] bg-clip-text text-transparent">
                RAK Traders International
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:mt-5 sm:text-lg">
              For over four decades, RAK TRADERS INTERNATIONAL has stood for uncompromising quality in Mangalore &amp; Kerala arecanut (supari) wholesale trading — uniting traditional grading craftsmanship with modern, transparent B2B supply.
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5">
              <Link href="/products" className="btn btn-gold min-h-12 w-full px-6 sm:w-auto">
                Explore Our Grades
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/today-rate"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:border-[#e7c97a]/60 hover:bg-white/10 sm:w-auto"
              >
                Today&apos;s Live Rates
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
              <Image
                src="/images/hero/hero-luxury.jpg"
                alt="Hand-graded arecanuts from RAK TRADERS INTERNATIONAL"
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-right"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Heritage & Mission (with New Our Legacy Image) */}
      <section className="section-wrap py-12 sm:py-20">
        <Reveal>
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#9a7332] uppercase">
                Our Legacy
              </p>
              <h2 className="font-display mt-2 text-2xl font-semibold text-ink sm:text-4xl">
                Rooted in Mangalore &amp; Kerala&apos;s Finest Arecanut Tradition
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                Established in 1980 across the Mangalore &amp; Kerala arecanut belt, our trading house grew from a deep respect for South Indian farmers. Over generations, we perfected the art of identifying superior harvests — focusing on clean husking, natural curing, and strict uniformity across every sack.
              </p>
              <p className="mt-3.5 text-sm leading-relaxed text-muted sm:text-base">
                Today, wholesalers, regional distributors, and processors across India rely on RAK TRADERS INTERNATIONAL for dependable year-round availability across six flagship grades: <strong className="font-semibold text-ink">MOTI, VACHRAS, MORO, JAM, JEENI, and FATTOR</strong>, alongside custom <strong className="font-semibold text-ink">Chips Cut</strong> and <strong className="font-semibold text-ink">Salli Cut</strong> bulk packs.
              </p>

              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                {[
                  "100% Natural, Hand-Sorted Lots",
                  "Consistent Cut & Kernel Marbling",
                  "Direct Farm-to-Wholesaler Pricing",
                  "Pan-India Verified Transport",
                ].map((point) => (
                  <li key={point} className="flex items-center gap-2 text-sm font-medium text-ink">
                    <CheckCircle2 size={16} className="shrink-0 text-forest" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#e6dfd5] shadow-[0_18px_45px_-16px_rgba(28,25,23,0.16)]">
                <Image
                  src="/images/about/our-legacy.jpg"
                  alt="Traditional Mangalore and Kerala arecanut warehouse with woven grading baskets and brass balance scale"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 4-Step Quality Process — Single-line horizontal swipe on mobile, 4-col grid on lg+ */}
      <section className="border-y border-[#e8e1d7] bg-[#f4efe7]/70 py-12 sm:py-20">
        <div className="section-wrap">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#9a7332] uppercase">
                From Estate to Dispatch
              </p>
              <h2 className="font-display mt-2 text-2xl font-semibold text-ink sm:text-4xl">
                Our 4-Step Quality Process
              </h2>
              <p className="mt-2.5 text-sm text-muted sm:text-base">
                Every single bag leaving our Mangalore &amp; Kerala network passes through four disciplined stages of inspection.
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[#9a7332] uppercase md:hidden">
                Swipe to explore steps
                <MoveRight size={13} />
              </p>
            </div>
          </Reveal>

          <div className="mobile-product-row mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:mt-12 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 lg:grid-cols-4">
            {processSteps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Reveal
                  key={item.step}
                  delay={idx * 80}
                  className="w-[78vw] max-w-[290px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink"
                >
                  <article className="premium-card flex h-full flex-col p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#faf4ea] text-[#92400e]">
                        <Icon size={20} />
                      </div>
                      <span className="font-display text-2xl font-bold text-[#d6c3a1]">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-display mt-4 text-lg font-semibold text-ink sm:mt-5">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                      {item.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Wholesale Buyers Trust Us — Single-line swipe on mobile, 3-col grid on md+ */}
      <section className="section-wrap py-12 sm:py-20">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#9a7332] uppercase">
              Why Partner With Us
            </p>
            <h2 className="font-display mt-2 text-2xl font-semibold text-ink sm:text-4xl">
              Built for Long-Term Wholesale Partnerships
            </h2>
          </div>
        </Reveal>

        <div className="mobile-product-row mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:mt-12 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
          {values.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Reveal
                key={item.title}
                delay={idx * 90}
                className="w-[78vw] max-w-[290px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink"
              >
                <article className="premium-card h-full p-6 sm:p-7">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#13110f] text-[#e7c97a] sm:h-12 sm:w-12">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display mt-4 text-lg font-semibold text-ink sm:mt-5 sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted sm:mt-2.5 sm:text-sm">
                    {item.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Head Office & Trade Desk CTA */}
      <section className="section-wrap">
        <Reveal>
          <div className="rounded-3xl border border-[#2a241e] bg-[#13110f] p-6 text-white sm:p-12">
            <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-7">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#e7c97a] uppercase">
                  Visit or Contact Our Trade Desk
                </p>
                <h2 className="font-display mt-2 text-2xl font-semibold text-white sm:text-3xl">
                  {COMPANY.legalName}
                </h2>
                <address className="mt-3.5 flex items-start gap-2.5 text-sm leading-relaxed text-white/75 not-italic sm:mt-4 sm:text-base">
                  <MapPin size={18} className="mt-1 shrink-0 text-[#e7c97a]" />
                  <span>
                    {COMPANY.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </address>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-5 lg:justify-end">
                <Suspense fallback={null}>
                  <AboutWhatsAppCta />
                </Suspense>
                <Link
                  href="/sample-orders"
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white transition-colors hover:border-[#e7c97a]/60 hover:bg-white/10"
                >
                  Order Sample Pack
                  <ArrowRight size={15} className="text-[#e7c97a]" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
