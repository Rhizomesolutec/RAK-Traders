import { formatInr } from "@/lib/money";
import type { PublicProduct } from "@/lib/types";

export function PriceBlock({ product }: { product: PublicProduct; compact?: boolean }) {
  if (product.todayRatePerKgPaise != null && product.todayBulkPackPaise != null) {
    return (
      <div>
        <p className="text-3xl font-semibold text-forest">{formatInr(product.todayBulkPackPaise)} <span className="text-lg font-medium text-muted">/ 65 kg</span></p>
        <p className="mt-1 text-xl">{formatInr(product.todayRatePerKgPaise)} <span className="text-base text-muted">/ KG</span></p>
      </div>
    );
  }

  return <p className="text-base text-muted">Price not set</p>;
}
