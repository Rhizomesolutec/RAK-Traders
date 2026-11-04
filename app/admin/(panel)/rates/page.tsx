import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/dates";
import { formatInr } from "@/lib/money";
import { RateEditor } from "@/components/admin/RateEditor";

async function Rates() {
  const products = await prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
    include: { rate: { include: { updatedBy: true } }, rateHistory: { orderBy: { recordedAt: "desc" }, take: 5, include: { updatedBy: true } } },
  });
  return (
    <>
      <RateEditor
        products={products.map((product) => ({
          id: product.id,
          name: product.name,
          ratePerKgPaise: product.rate?.ratePerKgPaise ?? null,
          bulkPackPaise: product.rate?.bulkPackPaise ?? null,
          published: product.rate?.published ?? false,
          effectiveDate: product.rate?.effectiveDate ?? null,
          note: product.rate?.note ?? null,
          sample250Paise: product.sample250Paise,
          sample500Paise: product.sample500Paise,
          sample1000Paise: product.sample1000Paise,
          sampleAvailable: product.sampleAvailable,
          bulkAvailable: product.bulkAvailable,
        }))}
      />
      <section className="mt-8">
        <h2 className="mb-3 text-2xl font-semibold">Rate history</h2>
        <div className="grid gap-4">
          {products.map((product) => (
            <article key={product.id} className="panel p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              {product.rateHistory.length === 0 ? <p className="mt-2 text-muted">No rate has been published.</p> : (
                <ul className="mt-2 space-y-2">
                  {product.rateHistory.map((entry) => (
                    <li key={entry.id} className="text-base">
                      {entry.effectiveDate} · {entry.published ? "Published" : "Hidden"} · {entry.ratePerKgPaise == null ? "No per kg rate" : `${formatInr(entry.ratePerKgPaise)} / kg`} · {entry.bulkPackPaise == null ? "No pack price" : `${formatInr(entry.bulkPackPaise)} / 65 kg`} · {formatDateTime(entry.recordedAt)}
                      {entry.updatedBy ? ` · ${entry.updatedBy.name}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default function AdminRatesPage() {
  return (
    <section>
      <h1 className="mb-5 text-3xl font-semibold text-forest">Today’s Rates</h1>
      <Suspense fallback={<p>Loading rates…</p>}><Rates /></Suspense>
    </section>
  );
}
