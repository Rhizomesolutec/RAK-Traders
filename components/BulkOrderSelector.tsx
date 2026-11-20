"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { formatInr } from "@/lib/money";
import { whatsappHref } from "@/lib/whatsapp";
import { AddBulkButton } from "@/components/cart/AddToCart";
import { PackPhoto } from "@/components/PackPhoto";
import type { PublicProduct } from "@/lib/types";

export function BulkOrderSelector({
  product,
  whatsappNumber,
}: {
  product: PublicProduct;
  whatsappNumber: string;
}) {
  const [bags, setBags] = useState(1);
  const rate = product.todayRatePerKgPaise;
  const pack = product.todayBulkPackPaise;
  const total = pack == null ? null : pack * bags;
  const message = `Hello RAK TRADERS, I want ${bags} bag${bags > 1 ? "s" : ""} (${bags * COMPANY.bulkKg} kg) of ${product.name} ${product.gradeLabel}.`;
  const href = whatsappHref(whatsappNumber, message);

  return (
    <article className="premium-card group flex h-full flex-col overflow-hidden">
      <PackPhoto
        src={product.packImagePath}
        slug={product.slug}
        badge="65 kg Bag"
        alt={`${product.name} closed 65 kg pack`}
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#9a7332] uppercase">
              {product.gradeLabel}
            </p>
            <h3 className="font-display mt-0.5 text-xl font-semibold text-ink">{product.name}</h3>
          </div>
          {rate != null ? (
            <span className="shrink-0 rounded-lg bg-[#faf4ea] px-2.5 py-1 text-xs font-semibold text-[#92400e] tabular-nums">
              {formatInr(rate)}/kg
            </span>
          ) : null}
        </div>

        {/* Quantity Stepper */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-[#eee7dc] bg-[#faf8f5] px-3 py-2.5">
          <div>
            <p className="text-[11px] font-semibold tracking-wider text-muted uppercase">Quantity</p>
            <p className="text-xs text-muted tabular-nums">{bags * COMPANY.bulkKg} kg total</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-[#dfd7cc] bg-white text-ink transition-colors hover:border-[#c9a24b] hover:bg-[#faf7f2]"
              type="button"
              onClick={() => setBags((value) => Math.max(1, value - 1))}
              aria-label="Fewer bags"
            >
              <Minus size={15} />
            </button>
            <span className="min-w-8 text-center text-base font-bold text-ink tabular-nums">
              {bags}
            </span>
            <button
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-[#dfd7cc] bg-white text-ink transition-colors hover:border-[#c9a24b] hover:bg-[#faf7f2]"
              type="button"
              onClick={() => setBags((value) => Math.min(100, value + 1))}
              aria-label="More bags"
            >
              <Plus size={15} />
            </button>
          </div>
        </div>

        {/* Live Total */}
        <div className="mt-3 flex items-baseline justify-between border-t border-[#efe9df] pt-3">
          <span className="text-xs font-medium text-muted">
            {bags} bag{bags > 1 ? "s" : ""} × 65 kg
          </span>
          {total != null ? (
            <span className="text-xl font-bold text-forest tabular-nums">{formatInr(total)}</span>
          ) : (
            <span className="text-sm text-muted">Price on request</span>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-4">
          <AddBulkButton product={product} bags={bags} mode="set" label="Add Bulk Order" wide />
          {href ? (
            <a
              className="btn btn-secondary w-full text-sm"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Inquiry
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
