"use client";

import Link from "next/link";
import { formatInr } from "@/lib/money";
import type { PublicProduct } from "@/lib/types";

function Offer({ product, hidden = false }: { product: PublicProduct; hidden?: boolean }) {
  const priced = product.todayRatePerKgPaise != null && product.todayBulkPackPaise != null;
  return (
    <Link
      href={`/products/${product.slug}`}
      className="rate-offer"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      <span className="rate-offer-name">{product.name}</span>
      <span>{product.gradeLabel}</span>
      {priced ? (
        <>
          <strong>{formatInr(product.todayRatePerKgPaise as number)} / KG</strong>
          <span>{formatInr(product.todayBulkPackPaise as number)} / 65 kg</span>
        </>
      ) : (
        <span>Price not set</span>
      )}
    </Link>
  );
}

export function RateStrip({ products }: { products: PublicProduct[] }) {
  return (
    <div className="rate-strip" aria-label="Today's arecanut rates">
      <Link href="/today-rate" className="rate-strip-label">Today&apos;s rates</Link>
      <div className="rate-strip-window">
        {products.length === 0 ? (
          <p className="px-4 py-3">Rates are not published yet.</p>
        ) : (
          <div className="rate-strip-track">
            <div className="rate-strip-group">
              {products.map((product) => (
                <Offer key={product.id} product={product} />
              ))}
            </div>
            <div className="rate-strip-group" aria-hidden="true">
              {products.map((product) => (
                <Offer key={`${product.id}-copy`} product={product} hidden />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
