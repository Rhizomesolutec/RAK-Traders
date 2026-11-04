import { Suspense } from "react";
import { CartProvider } from "@/components/cart/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RateStrip } from "@/components/RateStrip";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getPublicProducts, getSettings } from "@/lib/catalog";

async function SiteHeader() {
  const settings = await getSettings();
  return <Header whatsappNumber={settings.whatsappNumber} />;
}

async function SiteRates() {
  const products = await getPublicProducts();
  return <RateStrip products={products} />;
}

async function SiteFooter() {
  const settings = await getSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WholesaleStore",
    name: "RAK TRADERS INTERNATIONAL",
    description: "Wholesale arecanut supplier in Ponnani, Kerala.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Biyyam, Near Cheriya Palam Bridge",
      addressLocality: "Ponnani",
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Footer whatsappNumber={settings.whatsappNumber} />
      <WhatsAppButton number={settings.whatsappNumber} floating />
    </>
  );
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-full w-full min-w-0 max-w-full flex-col">
        <div className="sticky top-0 z-30">
          <Suspense fallback={<div className="h-16 border-b border-[#e4e7ec] bg-white" />}>
            <SiteHeader />
          </Suspense>
          <Suspense fallback={<div className="h-12 bg-[#1f2933]" />}>
            <SiteRates />
          </Suspense>
        </div>
        <main className="w-full min-w-0 max-w-full flex-1 pb-24">{children}</main>
        <Suspense fallback={null}>
          <SiteFooter />
        </Suspense>
      </div>
    </CartProvider>
  );
}
