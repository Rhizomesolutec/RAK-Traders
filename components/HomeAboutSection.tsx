import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, MapPin, ShieldCheck } from "lucide-react";

const stats = [
  { value: "1980", label: "Est. Heritage" },
  { value: "6+", label: "Sorted Grades" },
  { value: "Pan-India", label: "Supply Network" },
];

export function HomeAboutSection() {
  return (
    <section className="section-wrap py-12 sm:py-20">
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
        {/* Left Image Frame */}
        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#e6dfd5] shadow-[0_20px_50px_-18px_rgba(28,25,23,0.18)]">
            <Image
              src="/images/about/our-legacy.webp"
              alt="Traditional Malabar arecanut grading baskets, jute wholesale sacks, and brass balance scale"
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#13110f]/70 via-transparent to-transparent" />
            <div className="absolute right-3.5 bottom-3.5 left-3.5 flex items-center justify-between gap-2 rounded-2xl border border-white/15 bg-[#13110f]/82 px-3.5 py-2.5 text-white backdrop-blur-md sm:right-4 sm:bottom-4 sm:left-4 sm:px-4 sm:py-3">
              <div className="flex min-w-0 items-center gap-2">
                <MapPin size={15} className="shrink-0 text-[#e7c97a]" />
                <span className="truncate text-xs font-medium tracking-wide sm:text-sm">
                  Mangalore &amp; Kerala
                </span>
              </div>
              <span className="shrink-0 rounded-full bg-[#c9a24b]/20 px-2.5 py-0.5 text-[10px] font-semibold text-[#e7c97a] sm:text-[11px]">
                Est. 1980
              </span>
            </div>
          </div>
        </div>

        {/* Right Editorial Copy */}
        <div className="lg:col-span-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#9a7332] uppercase">
            About RAK Traders International
          </p>
          <h2 className="font-display mt-2 text-2xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl">
            Four Decades of Pure Mangalore &amp; Kerala Arecanut Heritage
          </h2>
          <p className="mt-3.5 text-sm leading-relaxed text-muted sm:mt-4 sm:text-base">
            Founded in 1980 across the historic trading belt of Mangalore &amp; Kerala,{" "}
            <strong className="font-semibold text-ink">RAK TRADERS INTERNATIONAL</strong> connects South India&apos;s finest arecanut estates directly with wholesale buyers across the country.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Every lot is hand-inspected for uniform size, rich marbled kernel density, and clean moisture levels — giving traders transparent daily pricing and consistent quality from first sample pouch to full bulk dispatch.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2.5 rounded-2xl border border-[#e7e0d6] bg-white p-3.5 shadow-xs sm:mt-6 sm:gap-3 sm:p-4">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={idx > 0 ? "border-l border-[#eee7dc] pl-2.5 sm:pl-3" : ""}
              >
                <p className="font-display text-lg font-bold text-forest sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-muted sm:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link href="/about" className="btn btn-primary min-h-11 w-full px-6 sm:w-auto">
              Read Our Full Story
              <ArrowRight size={16} />
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-muted sm:justify-start">
              <ShieldCheck size={15} className="text-[#9a7332]" />
              <span>Direct Estate Sourcing</span>
              <span className="text-[#d6c3a1]">·</span>
              <Award size={15} className="text-[#9a7332]" />
              <span>Export-Grade Sorting</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
