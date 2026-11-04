"use client";

import { useState } from "react";
import { COMPANY } from "@/lib/company";
import { formatInr } from "@/lib/money";
import { whatsappHref } from "@/lib/whatsapp";
import { AddBulkButton } from "@/components/cart/AddToCart";
import { PackPhoto } from "@/components/PackPhoto";
import type { PublicProduct } from "@/lib/types";

export function BulkOrderSelector({ product, whatsappNumber }: { product: PublicProduct; whatsappNumber: string }) {
  const [bags, setBags] = useState(1);
  const rate = product.todayRatePerKgPaise;
  const pack = product.todayBulkPackPaise;
  const total = pack == null ? null : pack * bags;
  const message = `Hello RAK TRADERS, I want ${bags} bag${bags > 1 ? "s" : ""} (${bags * COMPANY.bulkKg} kg) of ${product.name} ${product.gradeLabel}.`;
  const href = whatsappHref(whatsappNumber, message);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#e4e7ec] bg-white">
      <PackPhoto src={product.packImagePath} slug={product.slug} alt={`${product.name} closed 65 kg pack`} />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="text-sm text-muted">{product.gradeLabel}</p>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-muted">65 kg bag</p>
        </div>
        {rate != null && pack != null && total != null ? (
          <div>
            <p className="text-lg font-semibold text-forest">{formatInr(pack)}</p>
            <p className="text-sm">{formatInr(rate)} / KG</p>
          </div>
        ) : (
          <p className="text-sm text-muted">Price not set</p>
        )}
        <div className="flex items-center gap-3">
          <span className="font-semibold">Bags</span>
          <button className="btn btn-secondary h-11 w-11 px-0" type="button" onClick={() => setBags((value) => Math.max(1, value - 1))} aria-label="Fewer bags">−</button>
          <span className="min-w-6 text-center text-xl font-semibold">{bags}</span>
          <button className="btn btn-secondary h-11 w-11 px-0" type="button" onClick={() => setBags((value) => Math.min(100, value + 1))} aria-label="More bags">+</button>
        </div>
        <p className="text-base">
          {bags} bag{bags > 1 ? "s" : ""} · {bags * COMPANY.bulkKg} kg
          {total != null ? <span className="font-semibold text-forest"> · {formatInr(total)}</span> : null}
        </p>
        <div className="mt-auto flex flex-col gap-2">
          <AddBulkButton product={product} bags={bags} mode="set" label="Order Now" wide />
          {href ? (
            <a className="btn btn-secondary" href={href} target="_blank" rel="noopener noreferrer">WhatsApp inquiry</a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
