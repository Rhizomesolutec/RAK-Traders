import { connection } from "next/server";
import type { Prisma } from "@prisma/client";
import { COMPANY } from "@/lib/company";
import { prisma } from "@/lib/db";
import type { PublicProduct, SiteSettings } from "@/lib/types";

const productInclude = { rate: true } satisfies Prisma.ProductInclude;

type ProductWithRate = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

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

export function toPublicProduct(product: ProductWithRate): PublicProduct {
  const rate = product.rate;
  const savedRate = rate?.ratePerKgPaise ?? null;
  const savedPack = rate?.bulkPackPaise ?? null;
  const published = Boolean(rate?.published) && savedRate != null && savedPack != null;
  const pack = COMPANY.packImage;
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    gradeLabel: product.gradeLabel,
    description: product.description,
    nutSize: product.nutSize,
    imagePath: pack,
    packImagePath: pack,
    gallery: [pack],
    isActive: product.isActive,
    sampleAvailable: product.sampleAvailable,
    bulkAvailable: product.bulkAvailable,
    sample250Paise: product.sample250Paise,
    sample500Paise: product.sample500Paise,
    sample1000Paise: product.sample1000Paise,
    ratePerKgPaise: savedRate,
    rateEffectiveDate: rate?.effectiveDate ?? null,
    rateUpdatedAt: rate?.updatedAt.toISOString() ?? null,
    rateNote: rate?.note ?? null,
    todayRatePerKgPaise: published ? savedRate : null,
    todayBulkPackPaise: published ? savedPack : null,
  };
}

export async function getSettings(): Promise<SiteSettings> {
  await connection();
  try {
    const rows = await prisma.setting.findMany();
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
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: productInclude,
    orderBy: { sortOrder: "asc" },
  });
  return products.map((product) => toPublicProduct(product));
}

export async function getPublicProduct(slug: string): Promise<PublicProduct | null> {
  await connection();
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: productInclude,
  });
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
