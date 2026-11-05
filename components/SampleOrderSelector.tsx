"use client";

import { AddSampleButton } from "@/components/cart/AddToCart";
import { CardSlider } from "@/components/CardSlider";
import { PackPhoto } from "@/components/PackPhoto";
import { COMPANY } from "@/lib/company";
import { formatInr } from "@/lib/money";
import type { PublicProduct, SampleWeight } from "@/lib/types";

const weights: SampleWeight[] = [250, 500, 1000];

function priceFor(product: PublicProduct, grams: SampleWeight) {
  if (grams === 250) return product.sample250Paise;
  if (grams === 500) return product.sample500Paise;
  return product.sample1000Paise;
}

function weightLabel(grams: SampleWeight) {
  return grams === 1000 ? "1 kg" : `${grams} g`;
}

export function SampleOrderSelector({ products }: { products: PublicProduct[] }) {
  const visible = products.filter((product) => product.sampleAvailable);
  if (visible.length === 0) {
    return <p className="text-base">Sample orders are not open right now.</p>;
  }

  return (
    <CardSlider label="Sample packs" auto>
      {visible.flatMap((product) =>
        weights.map((grams) => {
          const price = priceFor(product, grams);
          const pouch = COMPANY.samplePouchImages[grams === 500 ? 1 : 0];
          const otherPouch = COMPANY.samplePouchImages[grams === 500 ? 0 : 1];
          return (
            <article key={`${product.id}-${grams}`} className="flex flex-col overflow-hidden rounded-lg border border-[#e4e7ec] bg-white">
              <PackPhoto src={pouch} back={otherPouch} slug={product.slug} alt={`${product.name} ${weightLabel(grams)} sample pack`} />
              <div className="flex flex-1 flex-col gap-1 p-3">
                <p className="text-sm text-muted">{product.gradeLabel}</p>
                <h3 className="text-base font-semibold">{product.name}</h3>
                <p className="text-sm">{weightLabel(grams)}</p>
                {price == null ? (
                  <p className="mt-auto pt-2 text-sm text-muted">Price not set</p>
                ) : (
                  <>
                    <p className="text-lg font-semibold text-forest">{formatInr(price)}</p>
                    <div className="mt-auto pt-2">
                      <AddSampleButton product={product} grams={grams} pricePaise={price} />
                    </div>
                  </>
                )}
              </div>
            </article>
          );
        }),
      )}
    </CardSlider>
  );
}
