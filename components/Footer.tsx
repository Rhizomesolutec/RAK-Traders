import Link from "next/link";
import { COMPANY } from "@/lib/company";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const links = [
  { href: "/products", label: "Products" },
  { href: "/today-rate", label: "Today's Rates" },
  { href: "/sample-orders", label: "Sample Orders" },
  { href: "/track-order", label: "Track Order" },
  { href: "/contact", label: "Contact Us" },
];

export function Footer({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <footer className="mt-auto border-t border-[#e4e7ec] bg-[#f7f8fa] text-ink">
      <div className="section-wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-lg font-semibold text-forest">{COMPANY.legalName}</p>
          <p className="mt-1">{COMPANY.tagline}</p>
          <address className="mt-4 text-base leading-7 not-italic">
            {COMPANY.addressLines.map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
          </address>
        </div>
        <div>
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-base hover:text-forest">{link.label}</Link>
              </li>
            ))}
            <li>
              <WhatsAppButton number={whatsappNumber} label="WhatsApp" />
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#e6e6e6]">
        <p className="section-wrap py-4 text-sm text-muted">© {new Date().getFullYear()} {COMPANY.legalName}</p>
      </div>
    </footer>
  );
}
