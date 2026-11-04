import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { ProductEditor } from "@/components/admin/ProductEditor";

async function Products() {
  const products = await prisma.product.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="grid gap-5">
      <ProductEditor />
      {products.map((product) => (
        <ProductEditor key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <section>
      <h1 className="mb-5 text-3xl font-semibold text-forest">Products</h1>
      <Suspense fallback={<p>Loading products…</p>}><Products /></Suspense>
    </section>
  );
}
