import Image from "next/image";
import Link from "next/link";
import { AddBulkButton } from "@/components/cart/AddToCart";
import { formatInr } from "@/lib/money";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import type { PublicProduct } from "@/lib/types";

export function RateTable({
  products,
  whatsappNumber,
}: {
  products: PublicProduct[];
  whatsappNumber: string;
}) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-[#e6dfd5] bg-white shadow-[0_10px_30px_-14px_rgba(28,25,23,0.1)] lg:block">
        <table className="w-full text-left">
          <caption className="sr-only">Today’s arecanut rates</caption>
          <thead className="bg-[#13110f] text-[#e7c97a]">
            <tr>
              {[
                "S.No.",
                "Product Grade",
                "Product Name",
                "Weight",
                "Bulk Pack Price",
                "Rate Per KG",
                "Availability",
                "Order",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-4 text-xs font-semibold tracking-wider uppercase"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#efe9df]">
            {products.map((product, index) => (
              <tr
                key={product.id}
                className="align-middle transition-colors hover:bg-[#faf8f5]"
              >
                <td className="px-4 py-4 text-sm text-muted tabular-nums">{index + 1}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.packImagePath || product.imagePath}
                      alt=""
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-xl border border-[#eee7dc] bg-[#f7f3ec] object-contain p-1"
                    />
                    <span className="text-sm font-medium text-ink">{product.gradeLabel}</span>
                  </div>
                </td>
                <td className="font-display px-4 py-4 text-lg font-semibold text-ink">
                  {product.name}
                </td>
                <td className="px-4 py-4 text-sm text-muted">65 kg</td>
                <td className="px-4 py-4 text-base font-bold text-ink tabular-nums">
                  {product.todayBulkPackPaise != null
                    ? formatInr(product.todayBulkPackPaise)
                    : "—"}
                </td>
                <td className="px-4 py-4 text-base font-bold text-forest tabular-nums">
                  {product.todayRatePerKgPaise != null
                    ? formatInr(product.todayRatePerKgPaise)
                    : "—"}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      product.bulkAvailable
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {product.bulkAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1.5">
                    <AddBulkButton product={product} label="Order" />
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-center text-xs font-semibold text-forest underline-offset-2 hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {products.map((product, index) => (
          <article key={product.id} className="premium-card p-5">
            <div className="flex items-center gap-3.5">
              <Image
                src={product.packImagePath || product.imagePath}
                alt=""
                width={72}
                height={72}
                className="h-16 w-16 rounded-xl border border-[#eee7dc] bg-[#f7f3ec] object-contain p-1.5"
              />
              <div>
                <p className="text-xs font-semibold tracking-wider text-[#9a7332] uppercase">
                  #{index + 1} · {product.gradeLabel}
                </p>
                <h3 className="font-display text-xl font-semibold text-ink">{product.name}</h3>
                <p className="text-xs text-muted">
                  65 kg · {product.bulkAvailable ? "Available" : "Unavailable"}
                </p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#faf8f5] p-3">
              <div>
                <dt className="text-[11px] font-medium text-muted uppercase">65 kg Bag</dt>
                <dd className="mt-0.5 text-lg font-bold text-ink tabular-nums">
                  {product.todayBulkPackPaise != null
                    ? formatInr(product.todayBulkPackPaise)
                    : "—"}
                </dd>
              </div>
              <div className="border-l border-[#e6dfd5] pl-3">
                <dt className="text-[11px] font-medium text-muted uppercase">Rate / KG</dt>
                <dd className="mt-0.5 text-lg font-bold text-forest tabular-nums">
                  {product.todayRatePerKgPaise != null
                    ? formatInr(product.todayRatePerKgPaise)
                    : "—"}
                </dd>
              </div>
            </dl>
            <div className="mt-4">
              <AddBulkButton product={product} wide label="Order Now" />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8">
        <WhatsAppButton
          number={whatsappNumber}
          message="Hello RAK TRADERS, I would like to enquire about today's arecanut rates."
          label="WhatsApp Trade Inquiry"
        />
      </div>
    </>
  );
}
