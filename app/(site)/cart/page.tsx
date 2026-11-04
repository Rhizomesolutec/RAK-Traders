import type { Metadata } from "next";
import { CartSummary } from "@/components/CartSummary";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review sample packs and 65 kg arecanut bags before checkout.",
};

export default function CartPage() {
  return (
    <section className="section-wrap py-10">
      <h1 className="mb-6 text-4xl font-semibold text-forest">Cart</h1>
      <CartSummary />
    </section>
  );
}
