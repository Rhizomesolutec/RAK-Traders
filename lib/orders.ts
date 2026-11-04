import type { CartItem } from "@/lib/types";
import type { PublicProduct } from "@/lib/types";
import { COMPANY } from "@/lib/company";
import { samplePrice } from "@/lib/catalog";

export type PricedLine = {
  item: CartItem;
  product: PublicProduct;
  unitPricePaise: number;
  lineTotalPaise: number;
  weightGrams: number;
};

export function priceCart(items: CartItem[], products: PublicProduct[]): { lines: PricedLine[]; error?: string } {
  const byId = new Map(products.map((product) => [product.id, product]));
  const lines: PricedLine[] = [];

  for (const item of items) {
    const product = byId.get(item.productId);
    if (!product || !product.isActive) {
      return { lines: [], error: `${item.name} is no longer available. Remove it from the cart and try again.` };
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
      return { lines: [], error: "Check the quantities in your cart." };
    }

    if (item.orderType === "BULK") {
      if (!product.bulkAvailable || product.todayRatePerKgPaise == null || product.todayBulkPackPaise == null) {
        return {
          lines: [],
          error: `The bulk price for ${product.name} is not available. Remove that bag or contact us on WhatsApp.`,
        };
      }
      const unit = product.todayBulkPackPaise;
      lines.push({
        item,
        product,
        unitPricePaise: unit,
        lineTotalPaise: unit * item.quantity,
        weightGrams: item.quantity * COMPANY.bulkKg * 1000,
      });
      continue;
    }

    if (!product.sampleAvailable || !item.sampleWeightG) {
      return { lines: [], error: `Samples are not available for ${product.name}.` };
    }
    const unit = samplePrice(product, item.sampleWeightG);
    if (unit == null) {
      return { lines: [], error: `The ${item.sampleWeightG} g sample price for ${product.name} is not set.` };
    }
    lines.push({
      item,
      product,
      unitPricePaise: unit,
      lineTotalPaise: unit * item.quantity,
      weightGrams: item.quantity * item.sampleWeightG,
    });
  }

  return { lines };
}

export function cartOrderType(items: CartItem[]): "SAMPLE" | "BULK" | "MIXED" {
  const types = new Set(items.map((item) => item.orderType));
  if (types.size > 1) return "MIXED";
  return types.has("BULK") ? "BULK" : "SAMPLE";
}
