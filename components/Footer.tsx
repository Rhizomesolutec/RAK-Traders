import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { COMPANY } from "@/lib/company";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const links = [
  { href: "/products", label: "Our Grades" },
  { href: "/today-rate", label: "Today's Rates" },
  { href: "/sample-orders", label: "Sample Orders" },
  { href: "/about", label: "About Us" },
  { href: "/track-order", label: "Track Order" },
  { href: "/contact", label: "Contact Us" },
];

export function Footer({ whatsappNumber, year }: { whatsappNumber: string; year: number }) {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#13110f] text-white/80">
      <div className="section-wrap grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo size={88} />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
            {COMPANY.legalName} — Trusted wholesale supplier of hand-graded Mangalore &amp; Kerala arecanut since 1980. Supplying 65 kg trade bags and curated sample pouches across India.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#c9a24b]/30 bg-[#c9a24b]/10 px-3.5 py-1.5 text-xs font-medium text-[#e7c97a]">
            <ShieldCheck size={14} />
            Direct Mangalore &amp; Kerala Wholesale House
          </div>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-xs font-semibold tracking-[0.18em] text-[#e7c97a] uppercase">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/75 transition-colors hover:text-[#e7c97a]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h3 className="text-xs font-semibold tracking-[0.18em] text-[#e7c97a] uppercase">
            Head Office
          </h3>
          <address className="mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-white/75 not-italic">
            <MapPin size={16} className="mt-1 shrink-0 text-[#c9a24b]" />
            <span>
              {COMPANY.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </span>
          </address>
          <div className="mt-6">
            <WhatsAppButton number={whatsappNumber} label="WhatsApp Trade Desk" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-wrap flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {year} {COMPANY.legalName}. All rights reserved.</p>
          <p>Est. 1980 · Mangalore &amp; Kerala, India</p>
        </div>
      </div>
    </footer>
  );
}
