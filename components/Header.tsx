"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
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
