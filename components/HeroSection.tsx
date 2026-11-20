import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, PackageCheck, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

const highlights = [
  { icon: Award, title: "Est. 1980", sub: "45+ Years of Heritage" },
  { icon: Sparkles, title: "6 Graded Varieties", sub: "MOTI to FATTOR Precision" },
  { icon: PackageCheck, title: "65 kg Trade Bags", sub: "Direct Wholesale Supply" },
  { icon: ShieldCheck, title: "Sample First", sub: "250g · 500g · 1kg Pouches" },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#110f0d] text-white">
      {/* Full-bleed luxury photography with subtle slow Ken Burns motion */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <Image
          src="/images/hero/hero-luxury.jpg"
          alt="Hand-graded Kerala arecanuts in a hammered brass bowl on rustic jute burlap"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="animate-ken-burns object-cover object-center sm:object-[65%_center]"
        />
      </div>

      {/* Multi-layered editorial gradient for razor-sharp text contrast */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#110f0d] via-[#110f0d]/82 to-[#110f0d]/25" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#110f0d] via-transparent to-[#110f0d]/35" />

      {/* Subtle ambient gold glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 -z-10 h-96 w-96 rounded-full bg-[#c9a24b]/10 blur-3xl" />

      <div className="section-wrap relative flex min-h-[78svh] flex-col justify-between pt-14 pb-8 sm:pt-20 sm:pb-10 lg:min-h-[640px] lg:pt-24">
        {/* Main Editorial Content */}
        <div className="max-w-2xl py-6 lg:py-10">
          <div
            className="animate-hero-up inline-flex items-center gap-2 rounded-full border border-[#c9a24b]/40 bg-[#1c1814]/80 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#e7c97a] uppercase backdrop-blur-md"
            style={{ animationDelay: "60ms" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#e7c97a]" />
            Since 1980 · Ponnani, Kerala
          </div>

          <h1
            className="animate-hero-up font-display mt-6 text-4xl leading-[1.08] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "160ms" }}
          >
            Kerala&apos;s Finest{" "}
            <span className="bg-gradient-to-r from-[#f3d78e] via-[#d4af37] to-[#e09f3e] bg-clip-text text-transparent">
              Graded Arecanut
            </span>
            , Direct Wholesale.
          </h1>

          <p
            className="animate-hero-up mt-5 max-w-xl text-base leading-relaxed text-white/78 sm:text-lg"
            style={{ animationDelay: "260ms" }}
          >
            Four decades of trusted sourcing and precision hand-sorting. Compare live daily rates across MOTI, VACHRAS, MORO, JAM, JEENI &amp; FATTOR — from curated sample pouches to 65 kg wholesale bags.
          </p>

          <div
            className="animate-hero-up mt-8 flex flex-wrap items-center gap-3.5"
            style={{ animationDelay: "360ms" }}
          >
            <Link
              href="/products"
              className="btn btn-gold min-h-12 rounded-xl px-6 text-sm font-bold tracking-wide sm:text-[0.95rem]"
            >
              Explore Our Grades
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/today-rate"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:border-[#e7c97a]/70 hover:bg-white/15 sm:text-[0.95rem]"
            >
              <TrendingUp size={16} className="text-[#e7c97a]" />
              Today&apos;s Live Rates
            </Link>

            <Link
              href="#samples"
              className="inline-flex min-h-12 items-center gap-1.5 px-3 text-sm font-medium text-[#e7c97a] underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Order Sample Pack
            </Link>
          </div>
        </div>

        {/* Integrated Heritage & Trust Strip */}
        <div
          className="animate-hero-up mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-white/12 bg-[#161310]/80 p-4 backdrop-blur-md sm:gap-4 sm:p-5 lg:grid-cols-4"
          style={{ animationDelay: "460ms" }}
        >
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#c9a24b]/30 bg-[#c9a24b]/12 text-[#e7c97a]">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                  <p className="truncate text-xs text-white/60">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
