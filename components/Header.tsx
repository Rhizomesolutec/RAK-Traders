"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, ShoppingBag, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useCart } from "@/components/cart/CartProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/today-rate", label: "Today's Rates" },
  { href: "/sample-orders", label: "Sample Orders" },
  { href: "/track-order", label: "Track Order" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useCart();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="w-full border-b border-white/10 bg-[#13110f]/95 text-white backdrop-blur-md">
      <div className="section-wrap flex h-20 items-center justify-between gap-6">
        <div className="flex items-center">
          <Logo size={66} />
        </div>

        <nav className="desktop-nav items-center gap-1" aria-label="Main">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-3.5 py-2 text-[0.92rem] font-medium tracking-wide transition-colors duration-200 ${
                  active
                    ? "text-[#e7c97a]"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-3.5 -bottom-[1px] h-[2px] rounded-full bg-gradient-to-r from-[#c9a24b] to-[#e7c97a] transition-all duration-300 ${
                    active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/today-rate"
            className="hidden items-center gap-1.5 rounded-full border border-[#c9a24b]/45 bg-[#c9a24b]/10 px-4 py-2 text-xs font-semibold tracking-wider text-[#f3d78e] uppercase transition-all duration-200 hover:border-[#e7c97a] hover:bg-[#c9a24b]/20 xl:inline-flex"
          >
            Live Rates
            <ArrowUpRight size={14} />
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-200 hover:border-[#c9a24b]/60 hover:bg-white/10"
            aria-label={`Cart, ${count} items`}
          >
            <ShoppingBag size={19} />
            <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-br from-[#d97706] to-[#b45309] px-1 text-[11px] font-bold text-white shadow-sm ring-2 ring-[#13110f]">
              {count}
            </span>
          </Link>

          <button
            className="menu-button h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-[#c9a24b]/60 hover:bg-white/10"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          className="mobile-panel border-t border-white/10 bg-[#171411] px-4 pt-2 pb-6"
          aria-label="Mobile"
        >
          <div className="section-wrap flex flex-col gap-1 px-0">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                    active
                      ? "bg-[#c9a24b]/15 text-[#e7c97a]"
                      : "text-white/85 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <span>{link.label}</span>
                  {active ? <span className="h-1.5 w-1.5 rounded-full bg-[#e7c97a]" /> : null}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
