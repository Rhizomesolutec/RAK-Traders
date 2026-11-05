import { MongoClient, ObjectId, type Db } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClient?: Promise<MongoClient>;
  mongoIndexes?: Promise<void>;
};

function connectionUri() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error("MONGODB_URI is not set.");
  if (!uri.startsWith("mongodb+srv://") && !uri.startsWith("mongodb://")) {
    throw new Error("MONGODB_URI must start with mongodb+srv:// or mongodb://.");
  }
  return uri;
}

function connectionError(error: unknown) {
  const message = error instanceof Error ? error.message.split("\n")[0] : "Unknown MongoDB error";
  console.error("[mongodb] connection failed:", message);
}

export function getClient() {
  if (!globalForMongo.mongoClient) {
    const client = new MongoClient(connectionUri(), {
      family: 4,
      autoSelectFamily: false,
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });
    globalForMongo.mongoClient = client.connect().catch((error: unknown) => {
      globalForMongo.mongoClient = undefined;
      connectionError(error);
      throw error;
    });
  }
  return globalForMongo.mongoClient;
}

async function ensureIndexes(db: Db) {
  if (!globalForMongo.mongoIndexes) {
    globalForMongo.mongoIndexes = Promise.all([
      db.collection("admins").createIndex({ email: 1 }, { unique: true }),
      db.collection("products").createIndex({ slug: 1 }, { unique: true }),
      db.collection("products").createIndex({ sortOrder: 1 }),
      db.collection("rateHistory").createIndex({ productId: 1, recordedAt: -1 }),
      db.collection("orders").createIndex({ orderNumber: 1 }, { unique: true }),
      db.collection("orders").createIndex({ "customer.mobile": 1 }),
      db.collection("orders").createIndex({ createdAt: -1 }),
      db.collection("pinCodes").createIndex({ code: 1 }, { unique: true }),
    ])
      .then(() => undefined)
      .catch((error: unknown) => {
        globalForMongo.mongoIndexes = undefined;
        throw error;
      });
  }
  await globalForMongo.mongoIndexes;
}

export async function getDb() {
  const client = await getClient();
  const db = client.db();
  await ensureIndexes(db);
  return db;
}

export async function closeDb() {
  const pending = globalForMongo.mongoClient;
  globalForMongo.mongoClient = undefined;
  globalForMongo.mongoIndexes = undefined;
  if (!pending) return;
  const client = await pending.catch(() => null);
  await client?.close();
}

export function toObjectId(id: string) {
  if (!ObjectId.isValid(id) || new ObjectId(id).toHexString() !== id) return null;
  return new ObjectId(id);
}

export function newId() {
  return new ObjectId().toHexString();
}
