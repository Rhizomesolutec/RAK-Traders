"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Award, PackageCheck, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

const slides = [
  {
    src: "/images/hero/hero-luxury.jpg",
    alt: "Hand-graded arecanuts in a hammered brass bowl on rustic jute burlap",
  },
  {
    src: "/images/hero/hero-slide-2.jpg",
    alt: "Graded whole dried MOTI arecanuts overflowing from a wholesale jute trade sack",
  },
  {
    src: "/images/hero/hero-slide-3.jpg",
    alt: "Finely sliced Chips Cut and Salli Cut arecanuts in handcrafted brass and ceramic bowls",
  },
];

const highlights = [
  { icon: Award, title: "Est. 1980", sub: "45+ Years Heritage" },
  { icon: Sparkles, title: "6 Grades", sub: "MOTI to FATTOR" },
  { icon: PackageCheck, title: "65 kg Bags", sub: "Direct Wholesale" },
  { icon: ShieldCheck, title: "Sample First", sub: "250g · 500g · 1kg" },
];

export function HeroSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-[#110f0d] text-white">
      {/* 3-Slide Crossfading Luxury Product Backgrounds (changes every 3 seconds) */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {slides.map((slide, index) => {
          const isCurrent = index === active;
          return (
            <div
              key={slide.src}
              aria-hidden={!isCurrent}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isCurrent ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                unoptimized
                sizes="100vw"
                className={`object-cover object-[72%_center] transition-transform duration-[3200ms] ease-out md:object-[64%_center] ${
                  isCurrent ? "scale-105" : "scale-100"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Mobile: airy top so product shines, rich bottom scrim for text. Desktop: left-to-right editorial scrim */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#110f0d] via-[#110f0d]/55 to-[#110f0d]/15 md:bg-gradient-to-r md:from-[#110f0d] md:via-[#110f0d]/80 md:to-[#110f0d]/20" />
      <div className="pointer-events-none absolute inset-0 -z-10 hidden bg-gradient-to-t from-[#110f0d] via-transparent to-[#110f0d]/30 md:block" />

      <div className="section-wrap relative flex min-h-[calc(100svh-7.75rem)] flex-col justify-end pt-20 pb-8 sm:pt-24 sm:pb-10 md:min-h-[640px] md:justify-between md:pt-18 lg:pt-22">
        {/* Main Editorial Content */}
        <div className="max-w-2xl md:py-6 lg:py-8">
          <div
            className="animate-hero-up inline-flex items-center gap-2 rounded-full border border-[#c9a24b]/40 bg-[#181411]/75 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-[#e7c97a] uppercase backdrop-blur-md sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.2em]"
            style={{ animationDelay: "60ms" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#e7c97a]" />
            Since 1980 · Mangalore &amp; Kerala
          </div>

          <h1
            className="animate-hero-up font-display mt-3.5 text-[1.85rem] leading-[1.14] font-semibold tracking-tight text-white sm:mt-5 sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "150ms" }}
          >
            Mangalore&apos;s Finest{" "}
            <span className="bg-gradient-to-r from-[#f3d78e] via-[#d4af37] to-[#e09f3e] bg-clip-text text-transparent">
              Graded Arecanut
            </span>
            , Direct Wholesale.
          </h1>

          {/* Rich desktop description only — mobile stays ultra-clean */}
          <p
            className="animate-hero-up mt-5 hidden max-w-xl text-base leading-relaxed text-white/80 md:block lg:text-lg"
            style={{ animationDelay: "240ms" }}
          >
            Four decades of trusted sourcing and precision hand-sorting across Mangalore &amp; Kerala. Compare live daily rates across MOTI, VACHRAS, MORO, JAM, JEENI &amp; FATTOR — from sample pouches to bulk wholesale supply.
          </p>

          {/* Single clean button on mobile; full action bar on md+ */}
          <div
            className="animate-hero-up mt-5 flex flex-wrap items-center gap-3.5 sm:mt-7 md:mt-8"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/products"
              className="btn btn-gold min-h-11 rounded-xl px-5 text-xs font-bold tracking-wide sm:min-h-12 sm:px-6 sm:text-[0.95rem]"
            >
              <span>Explore Grades</span>
              <ArrowRight size={15} className="shrink-0" />
            </Link>

            <Link
              href="/today-rate"
              className="hidden min-h-12 items-center justify-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-6 text-[0.95rem] font-semibold text-white backdrop-blur-md transition-all duration-200 hover:border-[#e7c97a]/70 hover:bg-white/15 md:inline-flex"
            >
              <TrendingUp size={15} className="shrink-0 text-[#e7c97a]" />
              <span>Today&apos;s Rates</span>
            </Link>

            <Link
              href="#samples"
              className="hidden min-h-12 items-center gap-1.5 px-3 text-sm font-medium text-[#e7c97a] underline-offset-4 transition-colors hover:text-white hover:underline md:inline-flex"
            >
              Order Sample Pack
            </Link>
          </div>

          {/* Minimalist Slide Progress Indicators */}
          <div className="mt-5 flex items-center gap-2 sm:mt-6" role="tablist" aria-label="Hero showcase slides">
            {slides.map((slide, index) => {
              const isCurrent = index === active;
              return (
                <button
                  key={slide.src}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  aria-label={`Show slide ${index + 1}`}
                  onClick={() => setActive(index)}
                  className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                    isCurrent
                      ? "w-8 bg-[#e7c97a]"
                      : "w-2.5 bg-white/30 hover:bg-white/55"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Integrated Heritage & Trust Strip — desktop/tablet only so mobile hero stays clean and airy */}
        <div
          className="animate-hero-up mt-8 hidden grid-cols-2 gap-4 rounded-2xl border border-white/12 bg-[#161310]/85 p-5 backdrop-blur-md md:grid lg:grid-cols-4"
          style={{ animationDelay: "420ms" }}
        >
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#c9a24b]/30 bg-[#c9a24b]/12 text-[#e7c97a]">
                  <Icon size={17} />
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
