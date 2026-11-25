"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
import { AddBulkButton } from "@/components/cart/AddToCart";
import { PackPhoto } from "@/components/PackPhoto";
import { formatInr } from "@/lib/money";
import type { PublicProduct } from "@/lib/types";

const closedPack = "/images/products/rak-65kg-pack.webp";

export function ProductCard({ product }: { product: PublicProduct }) {
  const image = product.packImagePath || closedPack;
  const rate = product.todayRatePerKgPaise;
  const pack25 = rate == null ? null : rate * 25;
  const pack65 = product.todayBulkPackPaise;

  return (
    <article className="premium-card group flex h-full flex-col overflow-hidden">
      <PackPhoto
        src={image}
        slug={product.slug}
        alt={`${product.name} closed 65 kg pack`}
        badge={product.gradeLabel}
      />

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#9a7332] uppercase">
              {product.gradeLabel}
            </p>
            <h3 className="font-display mt-0.5 truncate text-xl font-semibold tracking-tight text-ink">
              {product.name}
            </h3>
          </div>
          {rate != null ? (
            <span className="shrink-0 rounded-lg border border-[#e7d6b8] bg-[#faf4ea] px-2.5 py-1 text-xs font-bold text-[#92400e] tabular-nums">
              {formatInr(rate)}/kg
            </span>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-xl border border-[#eee7dc] bg-[#faf8f5] p-3">
          <div>
            <p className="text-[10px] font-semibold tracking-wider text-muted uppercase">25 kg Pack</p>
            <p className="mt-0.5 text-sm font-bold text-ink tabular-nums sm:text-[0.95rem]">
              {pack25 == null ? <span className="font-normal text-muted">On request</span> : formatInr(pack25)}
            </p>
          </div>
          <div className="border-l border-[#e6dfd5] pl-2.5">
            <p className="text-[10px] font-semibold tracking-wider text-muted uppercase">65 kg Bag</p>
            <p className="mt-0.5 text-sm font-bold text-forest tabular-nums sm:text-[0.95rem]">
              {pack65 == null ? <span className="font-normal text-muted">On request</span> : formatInr(pack65)}
            </p>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2.5 pt-4 sm:pt-5">
          <Link href={`/products/${product.slug}`} className="btn btn-secondary w-full text-sm">
            Details
            <ArrowUpRight size={15} />
          </Link>
          <AddBulkButton product={product} label="Order Now" wide />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: PublicProduct[] }) {
  const scroller = useRef<HTMLDivElement>(null);

  if (products.length === 0) {
    return (
      <div className="panel p-8 text-center">
        <p className="text-lg font-medium text-ink">No grades match this search.</p>
        <p className="mt-1 text-sm text-muted">Try MOTI, VACHRAS, MORO, JAM, JEENI, or FATTOR.</p>
      </div>
    );
  }

  function swipe(direction: number) {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(":scope > *");
    const distance = card ? card.offsetWidth + 16 : el.clientWidth * 0.82;
    el.scrollBy({ left: direction * distance, behavior: "smooth" });
  }

  return (
    <div>
      {/* Mobile-only swipe bar */}
      <div className="mb-3 flex items-center justify-between md:hidden">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e6dfd5] bg-white px-3 py-1 text-[11px] font-semibold tracking-wider text-[#9a7332] uppercase shadow-xs">
          Swipe left to explore
          <MoveRight size={13} />
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => swipe(-1)}
            aria-label="Previous product"
            className="grid h-8 w-8 place-items-center rounded-full border border-[#dfd7cc] bg-white text-ink shadow-xs active:scale-95"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => swipe(1)}
            aria-label="Next product"
            className="grid h-8 w-8 place-items-center rounded-full bg-[#13110f] text-[#e7c97a] shadow-xs active:scale-95"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Single-line horizontal swipe on mobile, symmetrical multi-column grid on md+ */}
      <div
        ref={scroller}
        className="mobile-product-row flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 lg:grid-cols-3"
        aria-label="Our Arecanut Grades"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[80vw] max-w-[310px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
