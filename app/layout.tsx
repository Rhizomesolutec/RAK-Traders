import type { Metadata } from "next";
import "./globals.css";

const description =
  "RAK TRADERS INTERNATIONAL supplies wholesale arecanut from Ponnani, Kerala since 1980. Compare MOTI, VACHRAS, MORO, JAM, JEENI, and FATTOR grades, sample packs, and 65 kg bulk rates.";

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
      ? { images: [{ url: "/images/hero/hero-luxury.webp", alt: "RAK TRADERS premium graded arecanuts" }] }
      : {}),
  },
  icons: { icon: "/images/logo/logo-transparent.webp" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#faf8f5] text-ink selection:bg-[#c9a24b]/25 selection:text-ink">
        {children}
      </body>
    </html>
  );
}
