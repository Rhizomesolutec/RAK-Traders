import { ObjectId, type Filter } from "mongodb";
import { getDb, toObjectId } from "@/lib/db";

export type RateRecord = {
  ratePerKgPaise: number | null;
  bulkPackPaise: number | null;
  published: boolean;
  effectiveDate: string | null;
  note: string | null;
  updatedById: string | null;
  updatedAt: Date;
};

export type ProductRecord = {
  slug: string;
  name: string;
  gradeLabel: string;
  description: string;
  nutSize: string;
  imagePath: string;
  packImagePath: string;
  galleryPaths: string;
  sortOrder: number;
  isActive: boolean;
  sampleAvailable: boolean;
  bulkAvailable: boolean;
  sample250Paise: number | null;
  sample500Paise: number | null;
  sample1000Paise: number | null;
  createdAt: Date;
  updatedAt: Date;
  rate: RateRecord | null;
};

export type RateHistoryRecord = {
  productId: ObjectId;
  ratePerKgPaise: number | null;
  bulkPackPaise: number | null;
  published: boolean;
  sample250Paise: number | null;
  sample500Paise: number | null;
  sample1000Paise: number | null;
  effectiveDate: string | null;
  note: string | null;
  recordedAt: Date;
  updatedById: string | null;
};

export type OrderItemRecord = {
  id: string;
  productId: string | null;
  productName: string;
  gradeLabel: string;
  orderType: string;
  sampleWeightG: number | null;
  quantity: number;
  weightGrams: number;
  unitPricePaise: number;
  lineTotalPaise: number;
};

export type DispatchEventRecord = {
  id: string;
  status: string;
  note: string | null;
  createdAt: Date;
};

export type OrderRecord = {
  orderNumber: string;
  customer: { name: string; mobile: string; whatsapp: string; email: string | null };
  orderType: string;
  status: string;
  addressLine: string;
  state: string;
  district: string;
  city: string;
  pinCode: string;
  deliveryChargePaise: number | null;
  deliveryNote: string | null;
  subtotalPaise: number;
  totalPaise: number;
  trackingNumber: string | null;
  transportInfo: string | null;
  internalNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemRecord[];
  events: DispatchEventRecord[];
};

export type PinRecord = {
  code: string;
  area: string;
  district: string;
  state: string;
  deliveryEnabled: boolean;
  verified: boolean;
  chargePaise: number | null;
  estimateNote: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type AdminRecord = {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

export type AdminView = { id: string; name: string; email: string; passwordHash: string };

export type ProductView = Omit<ProductRecord, "rate"> & {
  id: string;
  rate: RateRecord | null;
  rateHistory: {
    id: string;
    effectiveDate: string | null;
    published: boolean;
    ratePerKgPaise: number | null;
    bulkPackPaise: number | null;
    recordedAt: Date;
    updatedBy: { name: string } | null;
  }[];
};

export type OrderView = Omit<OrderRecord, never> & { id: string };
export type PinView = Omit<PinRecord, "createdAt" | "updatedAt"> & { id: string };

async function collections() {
  const db = await getDb();
  return {
    admins: db.collection<AdminRecord>("admins"),
    products: db.collection<ProductRecord>("products"),
    rateHistory: db.collection<RateHistoryRecord>("rateHistory"),
    orders: db.collection<OrderRecord>("orders"),
    pinCodes: db.collection<PinRecord>("pinCodes"),
    settings: db.collection<{ _id: string; value: string }>("settings"),
    sequences: db.collection<{ _id: number; last: number }>("orderSequences"),
  };
}

function emptyRate(): RateRecord {
  return {
    ratePerKgPaise: null,
    bulkPackPaise: null,
    published: true,
    effectiveDate: null,
    note: null,
    updatedById: null,
    updatedAt: new Date(),
  };
}

function productView(
  product: ProductRecord & { _id: ObjectId },
  history: ProductView["rateHistory"] = [],
): ProductView {
  return {
    id: product._id.toHexString(),
    slug: product.slug,
    name: product.name,
    gradeLabel: product.gradeLabel,
    description: product.description,
    nutSize: product.nutSize,
    imagePath: product.imagePath,
    packImagePath: product.packImagePath,
    galleryPaths: product.galleryPaths,
    sortOrder: product.sortOrder,
    isActive: product.isActive,
    sampleAvailable: product.sampleAvailable,
    bulkAvailable: product.bulkAvailable,
    sample250Paise: product.sample250Paise,
    sample500Paise: product.sample500Paise,
    sample1000Paise: product.sample1000Paise,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    rate: product.rate,
    rateHistory: history,
  };
}

function orderView(order: OrderRecord & { _id: ObjectId }): OrderView {
  return { id: order._id.toHexString(), ...order };
}

function pinView(pin: PinRecord & { _id: ObjectId }): PinView {
  return {
    id: pin._id.toHexString(),
    code: pin.code,
    area: pin.area,
    district: pin.district,
    state: pin.state,
    deliveryEnabled: pin.deliveryEnabled,
    verified: pin.verified,
    chargePaise: pin.chargePaise,
    estimateNote: pin.estimateNote,
  };
}

async function adminNameMap(ids: string[]) {
  const unique = [...new Set(ids.filter(Boolean))];
  const objectIds = unique.map(toObjectId).filter((id): id is ObjectId => id != null);
  if (objectIds.length === 0) return new Map<string, string>();
  const { admins } = await collections();
  const rows = await admins.find({ _id: { $in: objectIds } }).toArray();
  return new Map(rows.map((row) => [row._id.toHexString(), row.name]));
}

export async function findAdminByEmail(email: string): Promise<AdminView | null> {
  const { admins } = await collections();
  const admin = await admins.findOne({ email });
  if (!admin) return null;
  return { id: admin._id.toHexString(), name: admin.name, email: admin.email, passwordHash: admin.passwordHash };
}

export async function findAdminById(id: string): Promise<AdminView | null> {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const { admins } = await collections();
  const admin = await admins.findOne({ _id: objectId });
  if (!admin) return null;
  return { id: admin._id.toHexString(), name: admin.name, email: admin.email, passwordHash: admin.passwordHash };
}

export async function createAdmin(input: { name: string; email: string; passwordHash: string }) {
  const { admins } = await collections();
  await admins.insertOne({ ...input, createdAt: new Date() });
}

export async function listProducts(options?: { activeOnly?: boolean; withHistory?: boolean }) {
  const { products, rateHistory } = await collections();
  const filter: Filter<ProductRecord> = options?.activeOnly ? { isActive: true } : {};
  const rows = await products.find(filter).sort({ sortOrder: 1 }).toArray();
  if (!options?.withHistory || rows.length === 0) return rows.map((row) => productView(row));

  const historyRows = await rateHistory
    .find({ productId: { $in: rows.map((row) => row._id) } })
    .sort({ recordedAt: -1 })
    .toArray();
  const names = await adminNameMap(historyRows.map((row) => row.updatedById ?? ""));
  const grouped = new Map<string, ProductView["rateHistory"]>();
  for (const entry of historyRows) {
    const key = entry.productId.toHexString();
    const list = grouped.get(key) ?? [];
    if (list.length >= 5) continue;
    list.push({
      id: entry._id.toHexString(),
      effectiveDate: entry.effectiveDate,
      published: entry.published,
      ratePerKgPaise: entry.ratePerKgPaise,
      bulkPackPaise: entry.bulkPackPaise,
      recordedAt: entry.recordedAt,
      updatedBy: entry.updatedById && names.get(entry.updatedById) ? { name: names.get(entry.updatedById)! } : null,
    });
    grouped.set(key, list);
  }
  return rows.map((row) => productView(row, grouped.get(row._id.toHexString()) ?? []));
}

export async function findActiveProductBySlug(slug: string) {
  const { products } = await collections();
  const product = await products.findOne({ slug, isActive: true });
  return product ? productView(product) : null;
}

export async function insertProduct(data: Omit<ProductRecord, "createdAt" | "updatedAt" | "rate">) {
  const { products } = await collections();
  const now = new Date();
  const result = await products.insertOne({ ...data, createdAt: now, updatedAt: now, rate: emptyRate() });
  return result.insertedId.toHexString();
}

export async function updateProduct(id: string, data: Partial<Omit<ProductRecord, "createdAt" | "rate">>) {
  const objectId = toObjectId(id);
  if (!objectId) return;
  const { products } = await collections();
  await products.updateOne({ _id: objectId }, { $set: { ...data, updatedAt: new Date() } });
}

export async function deleteProductById(id: string) {
  const objectId = toObjectId(id);
  if (!objectId) return;
  const { products, rateHistory } = await collections();
  await products.deleteOne({ _id: objectId });
  await rateHistory.deleteMany({ productId: objectId });
}

export async function saveProductRates(
  adminId: string,
  effectiveDate: string,
  note: string | null,
  changes: {
    id: string;
    ratePerKgPaise: number | null;
    bulkPackPaise: number | null;
    published: boolean;
    sample250Paise: number | null;
    sample500Paise: number | null;
    sample1000Paise: number | null;
    sampleAvailable: boolean;
    bulkAvailable: boolean;
  }[],
) {
  const { products, rateHistory } = await collections();
  const now = new Date();
  for (const change of changes) {
    const objectId = toObjectId(change.id);
    if (!objectId) continue;
    await products.updateOne(
      { _id: objectId },
      {
        $set: {
          sample250Paise: change.sample250Paise,
          sample500Paise: change.sample500Paise,
          sample1000Paise: change.sample1000Paise,
          sampleAvailable: change.sampleAvailable,
          bulkAvailable: change.bulkAvailable,
          updatedAt: now,
          rate: {
            ratePerKgPaise: change.ratePerKgPaise,
            bulkPackPaise: change.bulkPackPaise,
            published: change.published,
            effectiveDate,
            note,
            updatedById: adminId,
            updatedAt: now,
          },
        },
      },
    );
    await rateHistory.insertOne({
      productId: objectId,
      ratePerKgPaise: change.ratePerKgPaise,
      bulkPackPaise: change.bulkPackPaise,
      published: change.published,
      sample250Paise: change.sample250Paise,
      sample500Paise: change.sample500Paise,
      sample1000Paise: change.sample1000Paise,
      effectiveDate,
      note,
      recordedAt: now,
      updatedById: adminId,
    });
  }
}

export async function orderCounts() {
  const { orders } = await collections();
  const [total, sample, bulk, pending, dispatched] = await Promise.all([
    orders.countDocuments(),
    orders.countDocuments({ orderType: "SAMPLE" }),
    orders.countDocuments({ orderType: "BULK" }),
    orders.countDocuments({ status: { $in: ["RECEIVED", "CONFIRMED", "PROCESSING"] } }),
    orders.countDocuments({ status: { $in: ["DISPATCHED", "IN_TRANSIT", "OUT_FOR_DELIVERY"] } }),
  ]);
  return { total, sample, bulk, pending, dispatched };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function listOrders(query?: { q?: string; type?: string; status?: string; openOnly?: boolean; limit?: number }) {
  const { orders } = await collections();
  const filter: Filter<OrderRecord> = {};
  if (query?.type) filter.orderType = query.type;
  if (query?.status) filter.status = query.status;
  if (query?.openOnly) filter.status = { $nin: ["DELIVERED", "CANCELLED"] };
  const q = query?.q?.trim();
  if (q) {
    filter.$or = [
      { orderNumber: { $regex: escapeRegex(q.toUpperCase()) } },
      { "customer.mobile": { $regex: escapeRegex(q) } },
    ];
  }
  const cursor = orders.find(filter).sort(query?.openOnly ? { updatedAt: -1 } : { createdAt: -1 });
  const rows = await (query?.limit ? cursor.limit(query.limit) : cursor).toArray();
  return rows.map(orderView);
}

export async function findOrderById(id: string) {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const { orders } = await collections();
  const order = await orders.findOne({ _id: objectId });
  if (!order) return null;
  return orderView({
    ...order,
    events: [...order.events].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  });
}

export async function updateOrderRecord(
  id: string,
  data: { status: string; trackingNumber: string | null; transportInfo: string | null; internalNotes: string | null },
  event?: { status: string; note: string | null },
) {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const { orders } = await collections();
  const existing = await orders.findOne({ _id: objectId });
  if (!existing) return null;
  const update: { $set: Record<string, unknown>; $push?: { events: DispatchEventRecord } } = {
    $set: { ...data, updatedAt: new Date() },
  };
  if (event) {
    update.$push = { events: { id: new ObjectId().toHexString(), status: event.status, note: event.note, createdAt: new Date() } };
  }
  await orders.updateOne({ _id: objectId }, update);
  return orderView(existing);
}

export async function findPinByCode(code: string) {
  const { pinCodes } = await collections();
  const pin = await pinCodes.findOne({ code });
  return pin ? pinView(pin) : null;
}

export async function listPins() {
  const { pinCodes } = await collections();
  const pins = await pinCodes.find().sort({ code: 1 }).toArray();
  return pins.map(pinView);
}

export async function savePin(id: string | null, data: Omit<PinRecord, "createdAt" | "updatedAt">) {
  const { pinCodes } = await collections();
  const now = new Date();
  if (id) {
    const objectId = toObjectId(id);
    if (!objectId) return;
    await pinCodes.updateOne({ _id: objectId }, { $set: { ...data, updatedAt: now } });
    return;
  }
  await pinCodes.insertOne({ ...data, createdAt: now, updatedAt: now });
}

export async function deletePinById(id: string) {
  const objectId = toObjectId(id);
  if (!objectId) return;
  const { pinCodes } = await collections();
  await pinCodes.deleteOne({ _id: objectId });
}

export async function listSettings() {
  const { settings } = await collections();
  const rows = await settings.find().toArray();
  return rows.map((row) => ({ key: String(row._id), value: row.value }));
}

export async function saveSetting(key: string, value: string) {
  const { settings } = await collections();
  await settings.updateOne({ _id: key }, { $set: { value } }, { upsert: true });
}

export async function ensureSetting(key: string, value: string) {
  const { settings } = await collections();
  await settings.updateOne({ _id: key }, { $setOnInsert: { value } }, { upsert: true });
}

export async function nextOrderNumber(year: number) {
  const { sequences } = await collections();
  const sequence = await sequences.findOneAndUpdate(
    { _id: year },
    { $inc: { last: 1 } },
    { upsert: true, returnDocument: "after" },
  );
  const last = sequence?.last ?? 1;
  return `RAK-${year}-${String(last).padStart(5, "0")}`;
}

export async function insertOrder(order: OrderRecord) {
  const { orders } = await collections();
  const result = await orders.insertOne(order);
  return orderView({ ...order, _id: result.insertedId });
}

export async function findOrderForTracking(orderNumber: string, mobile: string) {
  const { orders } = await collections();
  const order = await orders.findOne({ orderNumber, "customer.mobile": mobile });
  if (!order) return null;
  return orderView({
    ...order,
    events: [...order.events].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
  });
}

export async function fillMissingPrices(
  slug: string,
  prices: {
    ratePerKgPaise: number;
    bulkPackPaise: number;
    sample250Paise: number;
    sample500Paise: number;
    sample1000Paise: number;
    effectiveDate: string;
    fillBulk: boolean;
  },
) {
  const { products, rateHistory } = await collections();
  const product = await products.findOne({ slug });
  if (!product) return;
  const now = new Date();
  const sampleUpdate: Partial<ProductRecord> = {};
  if (product.sample250Paise == null) sampleUpdate.sample250Paise = prices.sample250Paise;
  if (product.sample500Paise == null) sampleUpdate.sample500Paise = prices.sample500Paise;
  if (product.sample1000Paise == null) sampleUpdate.sample1000Paise = prices.sample1000Paise;
  const needsBulk = prices.fillBulk && (product.rate?.ratePerKgPaise == null || product.rate?.bulkPackPaise == null);
  if (!needsBulk && Object.keys(sampleUpdate).length === 0) return;
  await products.updateOne(
    { _id: product._id },
    {
      $set: {
        ...sampleUpdate,
        updatedAt: now,
        ...(needsBulk
          ? {
              rate: {
                ratePerKgPaise: prices.ratePerKgPaise,
                bulkPackPaise: prices.bulkPackPaise,
                published: true,
                effectiveDate: prices.effectiveDate,
                note: "Demo price",
                updatedById: null,
                updatedAt: now,
              },
            }
          : {}),
      },
    },
  );
  if (needsBulk) {
    await rateHistory.insertOne({
      productId: product._id,
      ratePerKgPaise: prices.ratePerKgPaise,
      bulkPackPaise: prices.bulkPackPaise,
      published: true,
      sample250Paise: prices.sample250Paise,
      sample500Paise: prices.sample500Paise,
      sample1000Paise: prices.sample1000Paise,
      effectiveDate: prices.effectiveDate,
      note: "Demo price",
      recordedAt: now,
      updatedById: null,
    });
  }
}

export async function findProductBySlug(slug: string) {
  const { products } = await collections();
  const product = await products.findOne({ slug });
  return product ? productView(product) : null;
}

export async function renameProductSlug(from: string, to: string, name: string) {
  const { products } = await collections();
  const current = await products.findOne({ slug: from });
  const target = await products.findOne({ slug: to });
  if (current && !target) {
    await products.updateOne({ _id: current._id }, { $set: { slug: to, name, updatedAt: new Date() } });
  }
}

export async function upsertCatalogProduct(
  details: Omit<ProductRecord, "createdAt" | "updatedAt" | "rate" | "sample250Paise" | "sample500Paise" | "sample1000Paise" | "isActive" | "sampleAvailable" | "bulkAvailable">,
  rate?: { ratePerKgPaise: number; bulkPackPaise: number; effectiveDate: string },
) {
  const { products, rateHistory } = await collections();
  const now = new Date();
  const existing = await products.findOne({ slug: details.slug });
  if (!existing) {
    const inserted = await products.insertOne({
      ...details,
      isActive: true,
      sampleAvailable: true,
      bulkAvailable: true,
      sample250Paise: null,
      sample500Paise: null,
      sample1000Paise: null,
      createdAt: now,
      updatedAt: now,
      rate: rate
        ? {
            ratePerKgPaise: rate.ratePerKgPaise,
            bulkPackPaise: rate.bulkPackPaise,
            published: true,
            effectiveDate: rate.effectiveDate,
            note: null,
            updatedById: null,
            updatedAt: now,
          }
        : null,
    });
    if (!rate) return;
    await rateHistory.insertOne({
      productId: inserted.insertedId,
      ratePerKgPaise: rate.ratePerKgPaise,
      bulkPackPaise: rate.bulkPackPaise,
      published: true,
      sample250Paise: null,
      sample500Paise: null,
      sample1000Paise: null,
      effectiveDate: rate.effectiveDate,
      note: "Initial published rate",
      recordedAt: now,
      updatedById: null,
    });
    return;
  }

  await products.updateOne(
    { _id: existing._id },
    {
      $set: {
        name: details.name,
        gradeLabel: details.gradeLabel,
        nutSize: details.nutSize,
        description: details.description,
        imagePath: details.imagePath,
        packImagePath: details.packImagePath,
        galleryPaths: details.galleryPaths,
        sortOrder: details.sortOrder,
        updatedAt: now,
      },
    },
  );
  if (rate && (existing.rate?.ratePerKgPaise == null || existing.rate.bulkPackPaise == null)) {
    await products.updateOne(
      { _id: existing._id },
      {
        $set: {
          rate: {
            ratePerKgPaise: rate.ratePerKgPaise,
            bulkPackPaise: rate.bulkPackPaise,
            published: true,
            effectiveDate: rate.effectiveDate,
            note: existing.rate?.note ?? null,
            updatedById: existing.rate?.updatedById ?? null,
            updatedAt: now,
          },
        },
      },
    );
    const alreadyRecorded = await rateHistory.findOne({
      productId: existing._id,
      ratePerKgPaise: rate.ratePerKgPaise,
      bulkPackPaise: rate.bulkPackPaise,
    });
    if (!alreadyRecorded) {
      await rateHistory.insertOne({
        productId: existing._id,
        ratePerKgPaise: rate.ratePerKgPaise,
        bulkPackPaise: rate.bulkPackPaise,
        published: true,
        sample250Paise: existing.sample250Paise,
        sample500Paise: existing.sample500Paise,
        sample1000Paise: existing.sample1000Paise,
        effectiveDate: rate.effectiveDate,
        note: "Initial published rate",
        recordedAt: now,
        updatedById: null,
      });
    }
  }
}

export async function upsertPin(pin: { code: string; area: string; district: string; state: string }) {
  const { pinCodes } = await collections();
  const now = new Date();
  const existing = await pinCodes.findOne({ code: pin.code });
  if (!existing) {
    await pinCodes.insertOne({
      ...pin,
      deliveryEnabled: true,
      verified: true,
      estimateNote: null,
      chargePaise: null,
      createdAt: now,
      updatedAt: now,
    });
    return;
  }
  await pinCodes.updateOne(
    { _id: existing._id },
    { $set: { area: pin.area, district: pin.district, state: pin.state, verified: true, updatedAt: now } },
  );
}
