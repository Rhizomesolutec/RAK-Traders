import type { Metadata } from "next";
import { Suspense } from "react";
import { COMPANY } from "@/lib/company";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getSettings } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact RAK TRADERS INTERNATIONAL in Ponnani, Kerala for wholesale arecanut orders.",
};

async function ContactDetails() {
  const settings = await getSettings();
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <article className="panel p-6">
        <h2 className="text-2xl font-semibold text-forest">{settings.companyName || COMPANY.legalName}</h2>
        <address className="mt-4 text-lg leading-8 not-italic whitespace-pre-line">{settings.address}</address>
        {settings.supportEmail ? <p className="mt-4 text-lg">Email: {settings.supportEmail}</p> : null}
        {settings.supportNote ? <p className="mt-3 text-base leading-7">{settings.supportNote}</p> : null}
      </article>
      <article className="panel p-6">
        <h2 className="text-2xl font-semibold text-forest">WhatsApp</h2>
        <p className="mt-3 mb-5 text-lg leading-8">Send the grade, quantity, and PIN code. The message opens in WhatsApp for you to send.</p>
        <WhatsAppButton number={settings.whatsappNumber} label="Chat with us" />
      </article>
    </div>
  );
}

export default function ContactPage() {
  return (
    <section className="section-wrap py-12 sm:py-16">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#9a7332] uppercase">Trade Desk</p>
      <h1 className="font-display mt-2 mb-8 text-3xl font-semibold text-ink sm:text-4xl">Contact Us</h1>
      <Suspense fallback={<p className="text-muted">Loading contact details…</p>}>
        <ContactDetails />
      </Suspense>
    </section>
  );
}
