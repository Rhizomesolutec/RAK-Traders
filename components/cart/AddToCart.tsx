"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { COMPANY } from "@/lib/company";
import type { PublicProduct, SampleWeight } from "@/lib/types";

export function AddSampleButton({
  product,
  grams,
  pricePaise,
}: {
  product: PublicProduct;
  grams: SampleWeight;
  pricePaise: number;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      className="btn btn-secondary w-full"
      type="button"
      onClick={() => {
        addItem({
          key: `${product.id}-SAMPLE-${grams}`,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          gradeLabel: product.gradeLabel,
          imagePath: COMPANY.samplePackImage,
          orderType: "SAMPLE",
          sampleWeightG: grams,
          quantity: 1,
          unitPricePaise: pricePaise,
          ratePerKgPaise: null,
        });
        setAdded(true);
      }}
    >
      {added ? "Added to cart" : "Add to Cart"}
    </button>
  );
}

export function AddBulkButton({
  product,
  bags = 1,
  wide = false,
  mode = "add",
  label = "Add to Cart",
}: {
  product: PublicProduct;
  bags?: number;
  wide?: boolean;
  mode?: "add" | "set";
  label?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const disabled = product.todayBulkPackPaise == null || !product.bulkAvailable;
  return (
    <button
      className={`btn btn-primary ${wide ? "w-full" : ""}`}
      type="button"
      disabled={disabled}
      onClick={() => {
        if (product.todayBulkPackPaise == null || product.todayRatePerKgPaise == null) return;
        addItem({
          key: `${product.id}-BULK`,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          gradeLabel: product.gradeLabel,
          imagePath: product.packImagePath,
          orderType: "BULK",
          sampleWeightG: null,
          quantity: bags,
          unitPricePaise: product.todayBulkPackPaise,
          ratePerKgPaise: product.todayRatePerKgPaise,
        }, mode);
        setAdded(true);
      }}
    >
      {disabled ? "Price not set" : added ? "Added to cart" : label}
    </button>
  );
}
