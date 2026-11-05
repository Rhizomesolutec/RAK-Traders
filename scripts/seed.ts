import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { COMPANY } from "../lib/company";
import { closeDb } from "../lib/db";
import { kolkataDateKey } from "../lib/dates";
import { VERIFIED_PONNANI_PINS } from "../lib/data/pincodes";
import { hashPassword } from "../lib/password";
import { createAdmin, ensureSetting, fillMissingPrices, findAdminByEmail, renameProductSlug, upsertCatalogProduct, upsertPin } from "../lib/store";

function loadEnv() {
  const text = readFileSync(resolve(process.cwd(), ".env"), "utf8");
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^"|"$/g, "");
  }
}

function pack(path: string) {
  return { imagePath: path, packImagePath: path, galleryPaths: JSON.stringify([path]) };
}

const products = [
  {
    slug: "moti",
    name: "MOTI",
    gradeLabel: "Large Nut",
    nutSize: "Large whole nuts.",
    description:
      "MOTI is the large arecanut grade. It is packed in a 65 kg trade bag for wholesale orders, with 250 g, 500 g, and 1 kg samples when a sample price is set.",
    ...pack("/images/products/moti/Cutout_Moti.png"),
    sortOrder: 1,
    ratePerKgPaise: 63900 as number | undefined,
    bulkPackPaise: 4153500 as number | undefined,
  },
  {
    slug: "vachras",
    name: "VACHRAS",
    gradeLabel: "Medium Nut",
    nutSize: "Medium whole nuts.",
    description:
      "VACHRAS is the medium arecanut grade. It is packed in a 65 kg trade bag for wholesale orders, with 250 g, 500 g, and 1 kg samples when a sample price is set.",
    ...pack("/images/products/vachras/Cutout_Vachras.png"),
    sortOrder: 2,
    ratePerKgPaise: 59900 as number | undefined,
    bulkPackPaise: 3893500 as number | undefined,
  },
  {
    slug: "moro",
    name: "MORO",
    gradeLabel: "Jumbo Nut",
    nutSize: "Jumbo whole nuts.",
    description:
      "MORO is the jumbo arecanut grade. It is packed in a 65 kg trade bag for wholesale orders, with 250 g, 500 g, and 1 kg samples when a sample price is set.",
    ...pack("/images/products/mora/Cutout_Mora.png"),
    sortOrder: 3,
    ratePerKgPaise: 65900 as number | undefined,
    bulkPackPaise: 4283500 as number | undefined,
  },
  {
    slug: "jam",
    name: "JAM",
    gradeLabel: "JAM",
    nutSize: "65 kg wholesale bag.",
    description:
      "JAM is packed in a 65 kg trade bag for wholesale orders, with 250 g, 500 g, and 1 kg samples when a sample price is set.",
    ...pack("/images/products/jam/Cutout_Jam.png"),
    sortOrder: 4,
    ratePerKgPaise: undefined,
    bulkPackPaise: undefined,
  },
  {
    slug: "jeeni",
    name: "JEENI",
    gradeLabel: "JEENI",
    nutSize: "65 kg wholesale bag.",
    description:
      "JEENI is packed in a 65 kg trade bag for wholesale orders, with 250 g, 500 g, and 1 kg samples when a sample price is set.",
    ...pack("/images/products/jeeni/Cutout_Jeeni.png"),
    sortOrder: 5,
    ratePerKgPaise: undefined,
    bulkPackPaise: undefined,
  },
  {
    slug: "fattor",
    name: "FATTOR",
    gradeLabel: "FATTOR",
    nutSize: "65 kg wholesale bag.",
    description:
      "FATTOR is packed in a 65 kg trade bag for wholesale orders, with 250 g, 500 g, and 1 kg samples when a sample price is set.",
    ...pack("/images/products/fattor/FATTOR.jpg.jpeg"),
    sortOrder: 6,
    ratePerKgPaise: undefined,
    bulkPackPaise: undefined,
  },
];

async function main() {
  loadEnv();
  await renameProductSlug("mora", "moro", "MORO");
  const today = kolkataDateKey();
  for (const product of products) {
    const { ratePerKgPaise, bulkPackPaise, ...details } = product;
    await upsertCatalogProduct(
      details,
      ratePerKgPaise != null && bulkPackPaise != null ? { ratePerKgPaise, bulkPackPaise, effectiveDate: today } : undefined,
    );
  }

  const demoPrices = [
    { slug: "moti", ratePerKgPaise: 63900, bulkPackPaise: 4153500, sample250Paise: 22000, sample500Paise: 42000, sample1000Paise: 80000, fillBulk: false },
    { slug: "vachras", ratePerKgPaise: 59900, bulkPackPaise: 3893500, sample250Paise: 20000, sample500Paise: 38000, sample1000Paise: 74000, fillBulk: false },
    { slug: "moro", ratePerKgPaise: 65900, bulkPackPaise: 4283500, sample250Paise: 23000, sample500Paise: 44000, sample1000Paise: 84000, fillBulk: false },
    { slug: "jam", ratePerKgPaise: 54900, bulkPackPaise: 3568500, sample250Paise: 18000, sample500Paise: 34000, sample1000Paise: 66000, fillBulk: true },
    { slug: "jeeni", ratePerKgPaise: 56900, bulkPackPaise: 3698500, sample250Paise: 19000, sample500Paise: 36000, sample1000Paise: 70000, fillBulk: true },
    { slug: "fattor", ratePerKgPaise: 60900, bulkPackPaise: 3958500, sample250Paise: 21000, sample500Paise: 40000, sample1000Paise: 76000, fillBulk: true },
  ];
  for (const prices of demoPrices) {
    await fillMissingPrices(prices.slug, { ...prices, effectiveDate: today });
  }
  for (const pin of VERIFIED_PONNANI_PINS) {
    await upsertPin(pin);
  }
  const settings: Record<string, string> = {
    companyName: COMPANY.legalName,
    address: COMPANY.addressLines.join("\n"),
    whatsappNumber: "",
    supportEmail: "",
    supportNote: "",
    deliveryNote:
      "Orders can be sent across India after confirmation. A delivery charge is added only when it has been set for the PIN code. Otherwise it is confirmed before dispatch.",
  };
  for (const [key, value] of Object.entries(settings)) {
    await ensureSetting(key, value);
  }
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const existing = await findAdminByEmail(email);
    if (!existing) {
      await createAdmin({ name: "RAK TRADERS Admin", email, passwordHash: hashPassword(password) });
      console.log(`Admin created for ${email}`);
    } else {
      console.log(`Admin already exists for ${email}`);
    }
  } else {
    console.log("ADMIN_EMAIL and ADMIN_PASSWORD were not set, so no admin was created.");
  }
}

main()
  .then(async () => {
    await closeDb();
  })
  .catch(async (error) => {
    console.error(error);
    await closeDb();
    process.exit(1);
  });
