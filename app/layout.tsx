import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const description =
  "RAK TRADERS INTERNATIONAL supplies wholesale arecanut from Ponnani, Kerala. Compare MOTI, VACHRAS, and MORO grades, sample packs, and 65 kg bulk rates.";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: {
    default: "RAK TRADERS | Premium Quality Arecanut",
    template: "%s | RAK TRADERS",
  },
  description,
  applicationName: "RAK TRADERS",
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  alternates: siteUrl ? { canonical: "/" } : undefined,
  openGraph: {
    title: "RAK TRADERS | Premium Quality Arecanut",
    description,
    locale: "en_IN",
    type: "website",
    siteName: "RAK TRADERS",
    ...(siteUrl
      ? { images: [{ url: "/images/hero/plantation.jpg", alt: "Arecanut plantation" }] }
      : {}),
  },
  icons: { icon: "/images/logo/logo.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-ink">{children}</body>
    </html>
  );
}
