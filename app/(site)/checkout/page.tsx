import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/CheckoutForm";
import { getSettings } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Send a wholesale arecanut order to RAK TRADERS for confirmation.",
};

async function Checkout() {
  const settings = await getSettings();
  return <CheckoutForm whatsappNumber={settings.whatsappNumber} />;
}

export default function CheckoutPage() {
  return (
    <section className="section-wrap py-10">
      <h1 className="mb-6 text-4xl font-semibold text-forest">Checkout</h1>
      <Suspense fallback={<p>Loading checkout…</p>}>
        <Checkout />
      </Suspense>
    </section>
  );
}
