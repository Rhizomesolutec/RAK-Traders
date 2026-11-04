import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProductGrid } from "@/components/ProductCard";
import { getPublicProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Our Arecanut Grades",
  description: "Wholesale MOTI, VACHRAS, and MORO arecanut grades from RAK TRADERS, with sample packs and 65 kg bags.",
};

const grades = [
  { href: "/products", label: "All", slug: "" },
  { href: "/products?grade=moti", label: "MOTI", slug: "moti" },
  { href: "/products?grade=vachras", label: "VACHRAS", slug: "vachras" },
  { href: "/products?grade=moro", label: "MORO", slug: "moro" },
];

async function Catalog({ searchParams }: { searchParams: Promise<{ q?: string; grade?: string }> }) {
  const params = await searchParams;
  const query = (params.q ?? "").trim().toLowerCase();
  const requested = (params.grade ?? "").trim().toLowerCase();
  const grade = requested === "mora" ? "moro" : requested;
  const products = (await getPublicProducts()).filter((product) => {
    const matchesGrade = !grade || product.slug === grade;
    const haystack = `${product.name} ${product.gradeLabel} ${product.description}`.toLowerCase();
    return matchesGrade && (!query || haystack.includes(query));
  });
  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {grades.map((item) => (
          <Link key={item.label} href={item.href} className={`btn ${grade === item.slug ? "btn-primary" : "btn-secondary"}`}>
            {item.label}
          </Link>
        ))}
      </div>
      <ProductGrid products={products} />
    </>
  );
}

export default function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; grade?: string }> }) {
  return (
    <section className="section-wrap py-10">
      <h1 className="text-3xl font-semibold text-forest">Our Arecanut Grades</h1>
      <p className="mt-3 max-w-2xl text-lg leading-8">Choose from our carefully selected arecanut grades for your wholesale requirements.</p>
      <div className="mt-8">
        <Suspense fallback={<p>Loading products…</p>}>
          <Catalog searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}
