import { connection } from "next/server";
import { COMPANY } from "@/lib/company";
import { findActiveProductBySlug, listProducts, listSettings, type ProductView } from "@/lib/store";
import type { PublicProduct, SiteSettings } from "@/lib/types";

export function parseGallery(value: string | null | undefined, fallback: string[] = []): string[] {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      const paths = parsed.filter((item): item is string => typeof item === "string" && item.startsWith("/"));
      if (paths.length > 0) return paths;
    }
  } catch {
    const lines = value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.startsWith("/"));
    if (lines.length > 0) return lines;
  }
  return fallback;
}

const DEFAULT_SETTINGS: SiteSettings = {
  companyName: COMPANY.legalName,
  address: COMPANY.addressLines.join("\n"),
  whatsappNumber: "",
  supportEmail: "",
  supportNote: "",
  deliveryNote:
    "Orders can be sent across India after confirmation. Delivery charges are confirmed for your PIN code and are not added unless a charge has been set.",
};

const DEMO_PRICES: Record<string, { rate: number; pack: number; s250: number; s500: number; s1000: number }> = {
  moti: { rate: 63900, pack: 4153500, s250: 22000, s500: 42000, s1000: 80000 },
  vachras: { rate: 59900, pack: 3893500, s250: 20000, s500: 38000, s1000: 74000 },
  moro: { rate: 65900, pack: 4283500, s250: 23000, s500: 44000, s1000: 84000 },
  jam: { rate: 54900, pack: 3568500, s250: 18000, s500: 34000, s1000: 66000 },
  jeeni: { rate: 56900, pack: 3698500, s250: 19000, s500: 36000, s1000: 70000 },
  fattor: { rate: 60900, pack: 3958500, s250: 21000, s500: 40000, s1000: 76000 },
};

export function toPublicProduct(product: ProductView): PublicProduct {
  const rate = product.rate;
  const demo = DEMO_PRICES[product.slug];
  const savedRate = rate?.ratePerKgPaise ?? demo?.rate ?? null;
  const savedPack = rate?.bulkPackPaise ?? demo?.pack ?? null;
  const missingBulk = rate?.ratePerKgPaise == null || rate?.bulkPackPaise == null;
  const published = missingBulk ? demo != null && savedRate != null && savedPack != null : Boolean(rate?.published) && savedRate != null && savedPack != null;
  const pack = product.packImagePath || product.imagePath || COMPANY.packImage;
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    gradeLabel: product.gradeLabel,
    description: product.description,
    nutSize: product.nutSize,
    imagePath: pack,
    packImagePath: pack,
    gallery: parseGallery(product.galleryPaths, [pack]),
    isActive: product.isActive,
    sampleAvailable: product.sampleAvailable,
    bulkAvailable: product.bulkAvailable,
    sample250Paise: product.sample250Paise ?? demo?.s250 ?? null,
    sample500Paise: product.sample500Paise ?? demo?.s500 ?? null,
    sample1000Paise: product.sample1000Paise ?? demo?.s1000 ?? null,
    ratePerKgPaise: savedRate,
    rateEffectiveDate: rate?.effectiveDate ?? null,
    rateUpdatedAt: rate?.updatedAt ? new Date(rate.updatedAt).toISOString() : null,
    rateNote: rate?.note ?? (missingBulk && demo ? "Demo price" : null),
    todayRatePerKgPaise: published ? savedRate : null,
    todayBulkPackPaise: published ? savedPack : null,
  };
}

export async function getSettings(): Promise<SiteSettings> {
  await connection();
  try {
    const rows = await listSettings();
    const map = new Map(rows.map((row) => [row.key, row.value]));
    return {
      companyName: map.get("companyName") || DEFAULT_SETTINGS.companyName,
      address: map.get("address") || DEFAULT_SETTINGS.address,
      whatsappNumber: map.get("whatsappNumber") || "",
      supportEmail: map.get("supportEmail") || "",
      supportNote: map.get("supportNote") || "",
      deliveryNote: map.get("deliveryNote") || DEFAULT_SETTINGS.deliveryNote,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getPublicProducts(): Promise<PublicProduct[]> {
  await connection();
  const products = await listProducts({ activeOnly: true });
  return products.map((product) => toPublicProduct(product));
}

export async function getPublicProduct(slug: string): Promise<PublicProduct | null> {
  await connection();
  const product = await findActiveProductBySlug(slug);
  return product ? toPublicProduct(product) : null;
}

export function samplePrice(product: PublicProduct, grams: 250 | 500 | 1000): number | null {
  if (grams === 250) return product.sample250Paise;
  if (grams === 500) return product.sample500Paise;
  return product.sample1000Paise;
}

export function hasTodayRates(products: PublicProduct[]): boolean {
  return products.some((product) => product.todayRatePerKgPaise != null);
}
