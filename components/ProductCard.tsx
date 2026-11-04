import Link from "next/link";
import { AddBulkButton } from "@/components/cart/AddToCart";
import { CardSlider } from "@/components/CardSlider";
import { PackPhoto } from "@/components/PackPhoto";
import { formatInr } from "@/lib/money";
import type { PublicProduct } from "@/lib/types";

const closedPack = "/images/products/rak-65kg-pack.jpg";

export function ProductCard({ product }: { product: PublicProduct }) {
  const samples = [
    product.sample250Paise != null ? `250 g ${formatInr(product.sample250Paise)}` : "250 g",
    product.sample500Paise != null ? `500 g ${formatInr(product.sample500Paise)}` : "500 g",
    product.sample1000Paise != null ? `1 kg ${formatInr(product.sample1000Paise)}` : "1 kg",
  ];
  const image = product.packImagePath || closedPack;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#e4e7ec] bg-white">
      <PackPhoto src={image} slug={product.slug} alt={`${product.name} closed 65 kg pack`} />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="text-sm text-muted">{product.gradeLabel}</p>
          <h3 className="text-lg font-semibold">{product.name}</h3>
        </div>
        {product.todayBulkPackPaise != null && product.todayRatePerKgPaise != null ? (
          <div>
            <p className="text-base font-semibold text-forest">{formatInr(product.todayRatePerKgPaise)} / KG</p>
            <p className="text-sm text-muted">{formatInr(product.todayBulkPackPaise)} / 65 kg</p>
          </div>
        ) : (
          <p className="text-sm text-muted">Price not set</p>
        )}
        <p className="text-sm text-muted">Samples: {product.sampleAvailable ? samples.join(" · ") : "Not available"}</p>
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
