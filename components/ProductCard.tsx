import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AddBulkButton } from "@/components/cart/AddToCart";
import { PackPhoto } from "@/components/PackPhoto";
import { formatInr } from "@/lib/money";
import type { PublicProduct } from "@/lib/types";

const closedPack = "/images/products/rak-65kg-pack.jpg";

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

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#9a7332] uppercase">
              {product.gradeLabel}
            </p>
            <h3 className="font-display mt-0.5 text-xl font-semibold tracking-tight text-ink">
              {product.name}
            </h3>
          </div>
          {rate != null ? (
            <span className="shrink-0 rounded-lg bg-[#faf4ea] px-2.5 py-1 text-xs font-semibold text-[#92400e] tabular-nums">
              {formatInr(rate)}/kg
            </span>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-xl border border-[#eee7dc] bg-[#faf8f5] p-3">
          <div>
            <p className="text-[11px] font-medium tracking-wide text-muted uppercase">25 kg Pack</p>
            <p className="mt-0.5 text-sm font-bold text-ink tabular-nums sm:text-[0.95rem]">
              {pack25 == null ? <span className="font-normal text-muted">On request</span> : formatInr(pack25)}
            </p>
          </div>
          <div className="border-l border-[#e6dfd5] pl-2.5">
            <p className="text-[11px] font-medium tracking-wide text-muted uppercase">65 kg Bag</p>
            <p className="mt-0.5 text-sm font-bold text-forest tabular-nums sm:text-[0.95rem]">
              {pack65 == null ? <span className="font-normal text-muted">On request</span> : formatInr(pack65)}
            </p>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2.5 pt-5">
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
  if (products.length === 0) {
    return (
      <div className="panel p-8 text-center">
        <p className="text-lg font-medium text-ink">No grades match this search.</p>
        <p className="mt-1 text-sm text-muted">Try MOTI, VACHRAS, MORO, JAM, JEENI, or FATTOR.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
