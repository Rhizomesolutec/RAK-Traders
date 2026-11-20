"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
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

function HeaderFallback() {
  return (
    <header className="w-full border-b border-white/10 bg-[#13110f]/95 text-white backdrop-blur-md">
      <div className="section-wrap flex h-20 items-center justify-between gap-6">
        <div className="flex items-center">
          <Logo size={66} />
        </div>

        <nav className="desktop-nav items-center gap-1" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-lg px-3.5 py-2 text-[0.92rem] font-medium tracking-wide text-white/80 transition-colors duration-200 hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
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
            aria-label="Cart"
          >
            <ShoppingBag size={19} />
            <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-br from-[#d97706] to-[#b45309] px-1 text-[11px] font-bold text-white shadow-sm ring-2 ring-[#13110f]">
              0
            </span>
          </Link>

          <button
            className="menu-button h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-[#c9a24b]/60 hover:bg-white/10"
            type="button"
            aria-label="Open menu"
            aria-expanded={false}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

function HeaderContent() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="w-full border-b border-[#e6e6e6] bg-white">
      <div className="section-wrap flex h-16 items-center gap-4">
        <Logo />
        <nav className="desktop-nav ml-4 items-center gap-5" aria-label="Main">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-base text-ink hover:text-forest">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/cart" className="btn icon-btn btn-secondary relative" aria-label={`Cart, ${count} items`}>
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center bg-forest px-1 text-xs text-white">
              {count}
            </span>
          </Link>
          <button className="menu-button btn icon-btn btn-secondary" type="button" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="mobile-panel section-wrap flex flex-col gap-1 pb-6" aria-label="Mobile">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="border-b border-[#e6e6e6] px-1 py-3 text-lg" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

export function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderContent />
    </Suspense>
  );
}
