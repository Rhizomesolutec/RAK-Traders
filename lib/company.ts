export const COMPANY = {
  legalName: "RAK TRADERS INTERNATIONAL",
  brand: "RAK TRADERS",
  tagline: "Premium Quality Arecanut",
  business: "Wholesale Arecanut / Supari Trading",
  addressLines: [
    "Biyyam, Near Cheriya Palam Bridge,",
    "Ponnani, Malappuram, Kerala, India.",
  ],
  bulkKg: 65,
  packImage: "/images/products/moti/Cutout_Moti.webp",
  samplePackImage: "/images/sample/MOTI.webp",
  samplePouchImages: [
    "/images/sample/MOTI.webp",
    "/images/sample/Vachras.webp",
    "/images/sample/MORA.webp",
    "/images/sample/JAM.webp",
    "/images/sample/JEENI.webp",
  ],
  bulkCutPacks: [
    {
      name: "Chips Cut",
      badge: "No. 1 Grade",
      subtitle: "Mangalore Quality · Bulk & Custom Packs",
      image: "/images/sample/CHIPS CUT MOCKUP.webp",
    },
    {
      name: "Salli Cut",
      badge: "No. 1 Grade",
      subtitle: "Mangalore Quality · Bulk & Custom Packs",
      image: "/images/sample/SALLI CUT MOCKUP 2.webp",
    },
  ],
  sampleWeights: [250, 500, 1000] as const,
} as const;

const SAMPLE_CREAM_PACKS: Record<string, string> = {
  moti: "/images/sample/MOTI.webp",
  vachras: "/images/sample/Vachras.webp",
  moro: "/images/sample/MORA.webp",
  mora: "/images/sample/MORA.webp",
  jam: "/images/sample/JAM.webp",
  jeeni: "/images/sample/JEENI.webp",
};

export function samplePackImageFor(slug: string): string {
  return SAMPLE_CREAM_PACKS[slug.toLowerCase()] ?? COMPANY.samplePackImage;
}

export const ORDER_STATUSES = [
  "RECEIVED",
  "CONFIRMED",
  "PROCESSING",
  "DISPATCHED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  RECEIVED: "Order Received",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  DISPATCHED: "Dispatched",
  IN_TRANSIT: "In Transit",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;
