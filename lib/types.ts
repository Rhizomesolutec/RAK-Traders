export type SampleWeight = 250 | 500 | 1000;

export type PublicProduct = {
  id: string;
  slug: string;
  name: string;
  gradeLabel: string;
  description: string;
  nutSize: string;
  imagePath: string;
  packImagePath: string;
  gallery: string[];
  isActive: boolean;
  sampleAvailable: boolean;
  bulkAvailable: boolean;
  sample250Paise: number | null;
  sample500Paise: number | null;
  sample1000Paise: number | null;
  ratePerKgPaise: number | null;
  rateEffectiveDate: string | null;
  rateUpdatedAt: string | null;
  rateNote: string | null;
  todayRatePerKgPaise: number | null;
  todayBulkPackPaise: number | null;
};

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  gradeLabel: string;
  imagePath: string;
  orderType: "SAMPLE" | "BULK";
  sampleWeightG: SampleWeight | null;
  quantity: number;
  unitPricePaise: number;
  ratePerKgPaise: number | null;
};

export type SiteSettings = {
  companyName: string;
  address: string;
  whatsappNumber: string;
  supportEmail: string;
  supportNote: string;
  deliveryNote: string;
};

export type PinCheckResult =
  | { status: "invalid"; message: string }
  | {
      status: "available";
      message: string;
      area: string;
      chargePaise: number | null;
      estimateNote: string | null;
    }
  | { status: "confirm"; message: string };
