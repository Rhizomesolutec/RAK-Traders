import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { BulkOrderSelector } from "@/components/BulkOrderSelector";
import { PriceBlock } from "@/components/PriceBlock";
import { ProductGallery } from "@/components/ProductGallery";
import { SampleOrderSelector } from "@/components/SampleOrderSelector";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getPublicProduct, getSettings } from "@/lib/catalog";

type ProductParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductParams): Promise<Metadata> {
  const { slug } = await params;
  const name = (slug === "mora" ? "moro" : slug).replace(/-/g, " ").toUpperCase();
  return {
    title: name,
    description: `${name} wholesale arecanut from RAK TRADERS. 65 kg trade bags and sample sizes.`,
  };
}

async function ProductView({ params }: ProductParams) {
  const { slug } = await params;
  if (slug === "mora") redirect("/products/moro");
  const [product, settings] = await Promise.all([getPublicProduct(slug), getSettings()]);
  if (!product) notFound();
  const enquiry = `Hello RAK TRADERS, I would like to enquire about ${product.name} (${product.gradeLabel}).`;
  return (
    <article className="section-wrap py-12">
      <Link href="/products" className="text-base font-semibold text-forest underline">All grades</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.gallery} name={product.name} />
        <div>
          <p className="text-sm tracking-wide text-muted uppercase">{product.gradeLabel}</p>
          <h1 className="mt-2 text-4xl font-semibold text-forest">{product.name}</h1>
          <p className="mt-4 text-lg leading-8">{product.description}</p>
          <div className="mt-6">
            <PriceBlock product={product} />
          </div>
          <p className="mt-4 text-base">Bulk packing: 65 kg trade bag.</p>
          <p className="text-base">Sample weights: 250 g, 500 g, 1 kg.</p>
          <div className="mt-6">
            <WhatsAppButton number={settings.whatsappNumber} message={enquiry} label="WhatsApp inquiry" />
          </div>
        </div>
      </div>
      <section className="mt-14">
        <h2 className="text-3xl font-semibold text-forest">Sample order</h2>
        <div className="mt-6">
          <SampleOrderSelector products={[product]} />
        </div>
      </section>
      <section className="mt-14">
        <h2 className="mb-6 text-3xl font-semibold text-forest">Bulk order</h2>
        <BulkOrderSelector product={product} whatsappNumber={settings.whatsappNumber} />
      </section>
      <section className="mt-14 max-w-2xl">
        <h2 className="text-3xl font-semibold text-forest">Product information</h2>
        <dl className="mt-4 grid gap-3 text-lg">
          <div className="flex justify-between gap-6 border-t border-[#e4ddd0] pt-3"><dt>Product grade</dt><dd>{product.gradeLabel}</dd></div>
          <div className="flex justify-between gap-6 border-t border-[#e4ddd0] pt-3"><dt>Nut size</dt><dd>{product.nutSize}</dd></div>
          <div className="flex justify-between gap-6 border-t border-[#e4ddd0] pt-3"><dt>Packaging weight</dt><dd>65 kg</dd></div>
          <div className="flex justify-between gap-6 border-t border-[#e4ddd0] pt-3"><dt>Order types</dt><dd className="text-right">Sample 250 g, 500 g, 1 kg · Bulk 65 kg bag</dd></div>
          <div className="border-t border-[#e4ddd0] pt-3"><dt className="font-semibold">Delivery</dt><dd className="mt-1">{settings.deliveryNote}</dd></div>
        </dl>
      </section>
    </article>
  );
}

export default function ProductPage(props: ProductParams) {
  return (
    <Suspense fallback={<p className="section-wrap py-12 text-lg">Loading this grade…</p>}>
      <ProductView {...props} />
    </Suspense>
  );
}
