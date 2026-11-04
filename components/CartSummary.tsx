"use client";

import Image from "next/image";
import Link from "next/link";
import { COMPANY } from "@/lib/company";
import { formatInr } from "@/lib/money";
import { formatWeight } from "@/lib/weight";
import { useCart } from "@/components/cart/CartProvider";
import type { CartItem } from "@/lib/types";

function Line({ item }: { item: CartItem }) {
  const { setQuantity, removeItem } = useCart();
  const unitGrams = item.orderType === "BULK" ? COMPANY.bulkKg * 1000 : item.sampleWeightG ?? 0;
  const weight = unitGrams * item.quantity;
  return (
    <article className="panel grid gap-4 p-4 sm:grid-cols-[88px_1fr]">
      <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-sand">
        <Image src={item.imagePath} alt="" fill className="object-contain" sizes="88px" />
      </div>
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p className="text-muted">{item.gradeLabel} · {item.orderType === "BULK" ? "Bulk order" : "Sample order"}</p>
            <p className="mt-1 text-base">
              {item.orderType === "BULK" ? "Bulk" : "Sample"} · {formatWeight(weight)} · Qty {item.quantity}
            </p>
            <p className="text-base">Unit price {formatInr(item.unitPricePaise)} · Total {formatInr(item.unitPricePaise * item.quantity)}</p>
          </div>
          <p className="text-lg font-semibold">{formatInr(item.unitPricePaise * item.quantity)}</p>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button className="btn btn-secondary h-11 w-11 px-0" type="button" onClick={() => setQuantity(item.key, item.quantity - 1)} aria-label="Decrease quantity">−</button>
          <span className="min-w-8 text-center text-lg font-semibold">{item.quantity}</span>
          <button className="btn btn-secondary h-11 w-11 px-0" type="button" onClick={() => setQuantity(item.key, Math.min(100, item.quantity + 1))} aria-label="Increase quantity">+</button>
          <button className="btn btn-secondary" type="button" onClick={() => removeItem(item.key)}>Remove</button>
        </div>
      </div>
    </article>
  );
}

export function CartSummary({ checkout = false }: { checkout?: boolean }) {
  const { items, ready, subtotalPaise } = useCart();
  if (!ready) return <p className="text-lg">Loading your cart…</p>;
  if (items.length === 0) {
    return (
      <div className="panel p-8">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <p className="mt-2 text-base leading-7 text-muted">Add a sample or a 65 kg bag when the price is published.</p>
        <Link href="/products" className="btn btn-primary mt-5">Explore Products</Link>
      </div>
    );
  }
  const samples = items.filter((item) => item.orderType === "SAMPLE");
  const bulk = items.filter((item) => item.orderType === "BULK");
  const totalGrams = items.reduce(
    (sum, item) => sum + (item.orderType === "BULK" ? item.quantity * COMPANY.bulkKg * 1000 : item.quantity * (item.sampleWeightG ?? 0)),
    0,
  );
  return (
    <div className="grid gap-4">
      {samples.length ? (
        <section>
          <h2 className="mb-3 text-2xl font-semibold text-forest">Sample orders</h2>
          <div className="grid gap-3">{samples.map((item) => <Line key={item.key} item={item} />)}</div>
        </section>
      ) : null}
      {bulk.length ? (
        <section>
          <h2 className="mb-3 text-2xl font-semibold text-forest">Bulk orders</h2>
          <div className="grid gap-3">{bulk.map((item) => <Line key={item.key} item={item} />)}</div>
        </section>
      ) : null}
      <aside className="panel p-5">
        <p className="text-base">Total quantity: {formatWeight(totalGrams)}</p>
        <p className="mt-2 text-2xl font-semibold text-forest">Product total: {formatInr(subtotalPaise)}</p>
        <p className="mt-2 text-base leading-7 text-muted">Delivery charge is confirmed from the PIN code. It is not added unless a charge has been set.</p>
        {checkout ? null : <Link href="/checkout" className="btn btn-primary mt-4">Continue to checkout</Link>}
      </aside>
    </div>
  );
}
