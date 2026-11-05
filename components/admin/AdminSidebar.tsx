"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/app/actions/admin";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/rates", label: "Today’s Rates" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/dispatch", label: "Dispatch Tracking" },
  { href: "/admin/pincodes", label: "PIN Codes" },
];

export function AdminSidebar({ name }: { name: string }) {
  const pathname = usePathname();
  return (
    <aside className="border-b border-sand bg-forest-deep text-white md:min-h-screen md:w-64 md:border-r md:border-b-0">
      <div className="px-5 py-6">
        <p className="text-sm tracking-wide text-sand uppercase">Admin</p>
        <p className="text-xl font-semibold">RAK TRADERS</p>
        <p className="mt-1 text-sm text-sand">{name}</p>
      </div>
      <nav className="flex gap-2 overflow-auto px-3 pb-4 md:flex-col">
        {links.map((link) => {
          const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} className={`rounded-lg px-3 py-3 text-base whitespace-nowrap ${active ? "bg-white text-forest" : "hover:bg-white/10"}`}>
              {link.label}
            </Link>
          );
        })}
        <Link href="/" className="rounded-lg border border-white/30 px-3 py-3 text-center text-base whitespace-nowrap hover:bg-white/10">
          View site
        </Link>
        <form action={logoutAdmin}>
          <button className="w-full rounded-lg px-3 py-3 text-left text-base hover:bg-white/10" type="submit">Logout</button>
        </form>
      </nav>
    </aside>
  );
}
