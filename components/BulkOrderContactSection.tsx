import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, PackageCheck } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const BULK_WHATSAPP_MESSAGE =
  "Hello RAK TRADERS INTERNATIONAL, I would like to enquire about bulk wholesale arecanut orders (65 kg bags / Chips Cut / Salli Cut). Please share today's best wholesale quote.";

const bulkPerks = [
  "Direct Mangalore & Kerala wholesale trade pricing on 65 kg bags & bulk lots",
  "Custom Chips Cut & Salli Cut bulk packaging available on order",
  "Fast WhatsApp confirmation with live transport & dispatch schedule",
];

export function BulkOrderContactSection({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <section id="bulk-orders" className="section-wrap py-12 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl border border-[#2a241e] bg-[#13110f] text-white shadow-[0_24px_60px_-20px_rgba(19,17,15,0.45)]">
        {/* Ambient golden glow */}
        <div className="pointer-events-none absolute -top-28 -right-24 h-80 w-80 rounded-full bg-[#c9a24b]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#b45309]/15 blur-3xl" />

        <div className="relative grid items-center gap-8 p-5 sm:gap-10 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14">
          {/* Left: Bulk Order Copy & WhatsApp Redirect */}
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a24b]/40 bg-[#c9a24b]/12 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-[#e7c97a] uppercase">
              <PackageCheck size={14} />
              Wholesale Trade Desk
            </span>

            <h2 className="font-display mt-4 text-2xl leading-tight font-semibold text-white sm:text-4xl">
              Contact for{" "}
              <span className="bg-gradient-to-r from-[#f3d78e] to-[#d4af37] bg-clip-text text-transparent">
                Bulk Orders
              </span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75 sm:mt-4 sm:text-base">
              Looking for bulk 65 kg wholesale trade bags or signature black-pack Chips Cut &amp; Salli Cut assortments? Connect directly with our Mangalore &amp; Kerala trade desk on WhatsApp for priority wholesale rates and pan-India dispatch.
            </p>

            <ul className="mt-5 space-y-2 text-xs text-white/80 sm:mt-6 sm:space-y-2.5 sm:text-sm">
              {bulkPerks.map((perk) => (
                <li key={perk} className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#e7c97a]" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5">
              <WhatsAppButton
                number={whatsappNumber}
                message={BULK_WHATSAPP_MESSAGE}
                label="Contact on WhatsApp for Bulk Order"
              />
              <Link
                href="/today-rate"
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white transition-colors hover:border-[#e7c97a]/60 hover:bg-white/10"
              >
                View Today&apos;s Rates
                <ArrowUpRight size={15} className="text-[#e7c97a]" />
              </Link>
            </div>
          </div>

          {/* Right: 2 Signature Black Pack Showcase */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:col-span-6">
            {COMPANY.bulkCutPacks.map((pack) => (
              <div
                key={pack.name}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-3 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c9a24b]/50 hover:shadow-[0_18px_40px_-14px_rgba(201,162,75,0.28)] sm:p-5"
              >
                <span className="self-end rounded-full border border-[#c9a24b]/40 bg-[#13110f]/80 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-[#e7c97a] uppercase sm:px-2.5 sm:text-[10px]">
                  {pack.badge}
                </span>

                <div className="relative mx-auto my-2 aspect-[3/4] w-full max-w-[200px] transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src={pack.image}
                    alt={`${pack.name} bulk pack`}
                    fill
                    sizes="(max-width: 640px) 42vw, 240px"
                    className="object-contain drop-shadow-[0_16px_26px_rgba(0,0,0,0.65)]"
                  />
                </div>

                <div className="mt-1.5 border-t border-white/10 pt-2.5 text-center sm:mt-2 sm:pt-3">
                  <h3 className="font-display text-sm font-semibold text-white sm:text-lg">
                    {pack.name}
                  </h3>
                  <p className="mt-0.5 text-[10px] leading-snug text-white/60 sm:text-[11px]">
                    {pack.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
