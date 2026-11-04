import Image from "next/image";
import Link from "next/link";
import { AddBulkButton } from "@/components/cart/AddToCart";
import { formatInr } from "@/lib/money";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import type { PublicProduct } from "@/lib/types";

export function RateTable({ products, whatsappNumber }: { products: PublicProduct[]; whatsappNumber: string }) {
  return (
    <>
      <div className="hidden overflow-hidden border border-[#e4ddd0] lg:block">
        <table className="w-full text-left">
          <caption className="sr-only">Today’s arecanut rates</caption>
          <thead className="bg-[#f7f3ea] text-forest">
            <tr>
              {["S.No.", "Product Grade", "Product Name", "Weight", "Bulk Pack Price", "Rate Per KG", "Availability", "Order"].map((heading) => (
                <th key={heading} className="px-3 py-4 text-sm font-semibold">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className="border-t border-[#e4ddd0] align-middle">
                <td className="px-3 py-4">{index + 1}</td>
                <td className="px-3 py-4">
                  <div className="flex items-center gap-3">
                    <Image src={product.packImagePath || product.imagePath} alt="" width={56} height={56} className="h-14 w-14 rounded-lg bg-[#f4f5f7] object-contain" />
                    <span>{product.gradeLabel}</span>
                  </div>
                </td>
                <td className="px-3 py-4 font-semibold">{product.name}</td>
                <td className="px-3 py-4">65 kg</td>
                <td className="px-3 py-4 text-lg font-semibold">{product.todayBulkPackPaise != null ? formatInr(product.todayBulkPackPaise) : "—"}</td>
                <td className="px-3 py-4 text-lg font-semibold text-forest">{product.todayRatePerKgPaise != null ? formatInr(product.todayRatePerKgPaise) : "—"}</td>
                <td className="px-3 py-4">{product.bulkAvailable ? "Available" : "Unavailable"}</td>
                <td className="px-3 py-4">
                  <div className="flex flex-col gap-2">
                    <AddBulkButton product={product} label="Order" />
                    <Link href={`/products/${product.slug}`} className="text-center text-sm font-semibold text-forest underline">View</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-8 lg:hidden">
        {products.map((product, index) => (
          <article key={product.id} className="border-t border-[#e4ddd0] pt-5">
            <div className="flex gap-3">
              <Image src={product.packImagePath || product.imagePath} alt="" width={72} height={72} className="h-16 w-16 rounded-lg bg-[#f4f5f7] object-contain" />
              <div>
                <p className="text-sm text-muted">S.No. {index + 1}</p>
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p>{product.gradeLabel} · 65 kg · {product.bulkAvailable ? "Available" : "Unavailable"}</p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <dt className="text-sm text-muted">Bulk pack price</dt>
                <dd className="text-2xl font-semibold">{product.todayBulkPackPaise != null ? formatInr(product.todayBulkPackPaise) : "—"}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Rate per KG</dt>
                <dd className="text-2xl font-semibold text-forest">{product.todayRatePerKgPaise != null ? formatInr(product.todayRatePerKgPaise) : "—"}</dd>
              </div>
            </dl>
            <div className="mt-4">
              <AddBulkButton product={product} wide label="Order" />
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8">
        <WhatsAppButton number={whatsappNumber} message="Hello RAK TRADERS, I would like to enquire about today's arecanut rates." label="WhatsApp inquiry" />
      </div>
    </>
  );
}
