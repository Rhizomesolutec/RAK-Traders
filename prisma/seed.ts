import { PrismaClient } from "@prisma/client";
import { COMPANY } from "../lib/company";
import { kolkataDateKey } from "../lib/dates";
import { VERIFIED_PONNANI_PINS } from "../lib/data/pincodes";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

const closedPack = "/images/products/rak-65kg-pack.jpg";

function gallery(_slug: string) {
  return JSON.stringify([closedPack]);
}

const products = [
  {
    slug: "moti",
    name: "MOTI",
    gradeLabel: "Large Nut",
    nutSize: "Large whole nuts.",
    description:
      "MOTI is the large arecanut grade. It is packed in a 65 kg trade bag for wholesale orders, with 250 g, 500 g, and 1 kg samples when a sample price is set.",
    imagePath: closedPack,
    packImagePath: closedPack,
    galleryPaths: gallery("moti"),
    sortOrder: 1,
    ratePerKgPaise: 63900,
    bulkPackPaise: 4153500,
  },
  {
    slug: "vachras",
    name: "VACHRAS",
    gradeLabel: "Medium Nut",
    nutSize: "Medium whole nuts.",
    description:
      "VACHRAS is the medium arecanut grade. It is packed in a 65 kg trade bag for wholesale orders, with 250 g, 500 g, and 1 kg samples when a sample price is set.",
    imagePath: closedPack,
    packImagePath: closedPack,
    galleryPaths: gallery("vachras"),
    sortOrder: 2,
    ratePerKgPaise: 59900,
    bulkPackPaise: 3893500,
  },
  {
    slug: "moro",
    name: "MORO",
    gradeLabel: "Jumbo Nut",
    nutSize: "Jumbo whole nuts.",
    description:
      "MORO is the jumbo arecanut grade. It is packed in a 65 kg trade bag for wholesale orders, with 250 g, 500 g, and 1 kg samples when a sample price is set.",
    imagePath: closedPack,
    packImagePath: closedPack,
    galleryPaths: gallery("moro"),
    sortOrder: 3,
    ratePerKgPaise: 65900,
    bulkPackPaise: 4283500,
  },
];

async function main() {
  const legacy = await prisma.product.findUnique({ where: { slug: "mora" } });
  if (legacy) {
    const renamed = await prisma.product.findUnique({ where: { slug: "moro" } });
    if (!renamed) {
      await prisma.product.update({ where: { id: legacy.id }, data: { slug: "moro", name: "MORO" } });
    }
  }

  const today = kolkataDateKey();
  for (const product of products) {
    const { ratePerKgPaise, bulkPackPaise, ...details } = product;
    const saved = await prisma.product.upsert({
      where: { slug: product.slug },
      create: details,
      update: {
        name: details.name,
        gradeLabel: details.gradeLabel,
        nutSize: details.nutSize,
        description: details.description,
        imagePath: details.imagePath,
        packImagePath: details.packImagePath,
        galleryPaths: details.galleryPaths,
        sortOrder: details.sortOrder,
      },
    });
    const current = await prisma.dailyRate.findUnique({ where: { productId: saved.id } });
    if (current?.ratePerKgPaise == null || current.bulkPackPaise == null) {
      await prisma.dailyRate.upsert({
        where: { productId: saved.id },
        create: {
          productId: saved.id,
          ratePerKgPaise,
          bulkPackPaise,
          published: true,
          effectiveDate: today,
        },
        update: {
          ratePerKgPaise,
          bulkPackPaise,
          published: true,
          effectiveDate: today,
        },
      });
      const alreadyRecorded = await prisma.rateHistory.findFirst({
        where: { productId: saved.id, ratePerKgPaise, bulkPackPaise },
      });
      if (!alreadyRecorded) {
        await prisma.rateHistory.create({
          data: {
            productId: saved.id,
            ratePerKgPaise,
            bulkPackPaise,
            published: true,
            effectiveDate: today,
            note: "Initial published rate",
          },
        });
      }
    }
  }

  for (const pin of VERIFIED_PONNANI_PINS) {
    await prisma.pinCode.upsert({
      where: { code: pin.code },
      create: {
        ...pin,
        deliveryEnabled: true,
        verified: true,
        estimateNote: null,
        chargePaise: null,
      },
      update: {
        area: pin.area,
        district: pin.district,
        state: pin.state,
        verified: true,
      },
    });
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
    await prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: {},
    });
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (!existing) {
      await prisma.admin.create({
        data: {
          name: "RAK TRADERS Admin",
          email,
          passwordHash: hashPassword(password),
        },
      });
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
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
