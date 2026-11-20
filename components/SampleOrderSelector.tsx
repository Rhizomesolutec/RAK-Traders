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
    return (
      <div className="panel p-8 text-center">
        <p className="text-base text-muted">Sample orders are not open right now.</p>
      </div>
    );
  }

  const cards = visible.flatMap((product) =>
    weights.map((grams) => {
      const price = priceFor(product, grams);
      const pouch = COMPANY.samplePouchImages[grams === 500 ? 1 : 0];
      const otherPouch = COMPANY.samplePouchImages[grams === 500 ? 0 : 1];
      return (
        <article
          key={`${product.id}-${grams}`}
          className="premium-card group flex h-full flex-col overflow-hidden"
        >
          <PackPhoto
            compact
            src={pouch}
            back={otherPouch}
            slug={product.slug}
            badge={weightLabel(grams)}
            alt={`${product.name} ${weightLabel(grams)} sample pack`}
          />
          <div className="flex flex-1 flex-col p-4">
            <p className="text-[10px] font-semibold tracking-[0.14em] text-[#9a7332] uppercase">
              {product.gradeLabel}
            </p>
            <h3 className="font-display mt-0.5 text-base font-semibold text-ink">
              {product.name}
            </h3>
            <p className="mt-0.5 text-xs text-muted">Sample Pouch · {weightLabel(grams)}</p>

            {price == null ? (
              <p className="mt-auto pt-4 text-xs text-muted">Price on request</p>
            ) : (
              <>
                <p className="mt-3 text-lg font-bold text-forest tabular-nums">
                  {formatInr(price)}
                </p>
                <div className="mt-auto pt-3">
                  <AddSampleButton product={product} grams={grams} pricePaise={price} />
                </div>
              </>
            )}
          </div>
        </article>
      );
    }),
  );

  if (cards.length <= 3) {
    return (
      <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-3">
        {cards}
      </div>
    );
  }

  return (
    <CardSlider label="Sample packs" continuous compact>
      {cards}
    </CardSlider>
  );
}
