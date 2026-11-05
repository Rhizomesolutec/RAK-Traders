import Link from "next/link";
import { AddBulkButton } from "@/components/cart/AddToCart";
import { CardSlider } from "@/components/CardSlider";
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
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#e4e7ec] bg-white">
      <PackPhoto src={image} slug={product.slug} alt={`${product.name} closed 65 kg pack`} />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="text-sm text-muted">{product.gradeLabel}</p>
          <h3 className="text-lg font-semibold">{product.name}</h3>
        </div>
        <div className="text-sm">
          <p>25 kg · {pack25 == null ? <span className="text-muted">Price not set</span> : <span className="font-semibold text-forest">{formatInr(pack25)}</span>}</p>
          <p className="mt-1">
            65 kg · {pack65 == null ? <span className="text-muted">Price not set</span> : <span className="font-semibold text-forest">{formatInr(pack65)}</span>}
          </p>
        </div>
        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          <Link href={`/products/${product.slug}`} className="btn btn-secondary flex-1">View Details</Link>
          <AddBulkButton product={product} label="Order Now" />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: PublicProduct[] }) {
  if (products.length === 0) {
    return <p className="text-lg">No grades match this search. Try MOTI, VACHRAS, or MORO.</p>;
  }
  return (
    <CardSlider label="Arecanut grades">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </CardSlider>
  );
}
