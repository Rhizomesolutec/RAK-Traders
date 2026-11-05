"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deletePinById,
  deleteProductById,
  findAdminByEmail,
  findOrderById,
  insertProduct,
  listProducts,
  savePin as savePinRecord,
  saveProductRates,
  updateOrderRecord,
  updateProduct,
} from "@/lib/store";
import { getCurrentAdmin } from "@/lib/auth";
import { clearSessionCookie, setSessionCookie } from "@/lib/session";
import { verifyPassword } from "@/lib/password";
import { rupeesToPaise } from "@/lib/money";
import { kolkataDateKey } from "@/lib/dates";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/company";
import { isValidPin } from "@/lib/validators";

export type FormState = { error?: string; ok?: boolean };

async function adminOrThrow() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("You need to sign in again.");
  return admin;
}

function clean(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function loginAdmin(_prev: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const email = clean(formData.get("email")).toLowerCase();
  const password = clean(formData.get("password"));
  const admin = await findAdminByEmail(email);
  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return { error: "The email or password is not correct." };
  }
  await setSessionCookie(admin.id);
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearSessionCookie();
  redirect("/admin/login");
}

async function saveUpload(file: FormDataEntryValue | null): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > 4_000_000) throw new Error("Use an image smaller than 4 MB.");
  const types: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
  const ext = types[file.type];
  if (!ext) throw new Error("Use a JPG, PNG, or WEBP image.");
  const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${filename}`;
}

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await adminOrThrow();
    const id = clean(formData.get("id"));
    const name = clean(formData.get("name")).toUpperCase();
    const slug = clean(formData.get("slug")).toLowerCase().replace(/[^a-z0-9-]/g, "");
    const gradeLabel = clean(formData.get("gradeLabel"));
    const description = clean(formData.get("description"));
    const nutSize = clean(formData.get("nutSize"));
    const imagePath = clean(formData.get("imagePath"));
    const packImagePath = clean(formData.get("packImagePath"));
    const galleryPaths = JSON.stringify(
      clean(formData.get("galleryPaths"))
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    );
    if (!name || !slug || !gradeLabel || !description) {
      return { error: "Name, slug, grade, and description are required." };
    }
    const uploaded = await saveUpload(formData.get("image"));
    const picture = uploaded || imagePath || packImagePath || "/images/products/moti/Cutout_Moti.png";
    const data = {
      name,
      slug,
      gradeLabel,
      description,
      nutSize,
      imagePath: picture,
      packImagePath: packImagePath && !uploaded ? packImagePath : picture,
      galleryPaths,
      sortOrder: Number(clean(formData.get("sortOrder")) || "0") || 0,
      isActive: formData.get("isActive") === "on",
      sampleAvailable: formData.get("sampleAvailable") === "on",
      bulkAvailable: formData.get("bulkAvailable") === "on",
      sample250Paise: optionalPaise(clean(formData.get("sample250"))),
      sample500Paise: optionalPaise(clean(formData.get("sample500"))),
      sample1000Paise: optionalPaise(clean(formData.get("sample1000"))),
    };
    if (id) {
      await updateProduct(id, data);
    } else {
      await insertProduct(data);
    }
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/today-rate");
    revalidatePath("/admin/products");
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "The product could not be saved." };
  }
}

function optionalPaise(value: string): number | null {
  if (!value) return null;
  return rupeesToPaise(value);
}

export async function deleteProduct(formData: FormData) {
  await adminOrThrow();
  const id = clean(formData.get("id"));
  if (id) await deleteProductById(id);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function saveRates(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const admin = await adminOrThrow();
    const products = await listProducts();
    const effectiveDate = clean(formData.get("effectiveDate")) || kolkataDateKey();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(effectiveDate)) return { error: "Enter a valid date." };
    const note = clean(formData.get("note")) || null;

    await saveProductRates(
      admin.id,
      effectiveDate,
      note,
      products.map((product) => {
        const rateRaw = clean(formData.get(`rate-${product.id}`));
        const packRaw = clean(formData.get(`pack-${product.id}`));
        return {
          id: product.id,
          ratePerKgPaise: rateRaw ? rupeesToPaise(rateRaw) : null,
          bulkPackPaise: packRaw ? rupeesToPaise(packRaw) : null,
          published: formData.get(`publish-${product.id}`) === "on",
          sample250Paise: optionalPaise(clean(formData.get(`s250-${product.id}`))),
          sample500Paise: optionalPaise(clean(formData.get(`s500-${product.id}`))),
          sample1000Paise: optionalPaise(clean(formData.get(`s1000-${product.id}`))),
          sampleAvailable: formData.get(`sample-${product.id}`) === "on",
          bulkAvailable: formData.get(`bulk-${product.id}`) === "on",
        };
      }),
    );

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/today-rate");
    revalidatePath("/admin/rates");
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Rates could not be saved." };
  }
}

export async function updateOrder(formData: FormData) {
  await adminOrThrow();
  const id = clean(formData.get("id"));
  const status = clean(formData.get("status")) as OrderStatus;
  if (!id || !ORDER_STATUSES.includes(status)) return;
  const trackingNumber = clean(formData.get("trackingNumber")) || null;
  const transportInfo = clean(formData.get("transportInfo")) || null;
  const internalNotes = clean(formData.get("internalNotes")) || null;
  const note = clean(formData.get("note")) || null;
  const existing = await findOrderById(id);
  if (!existing) return;
  await updateOrderRecord(
    id,
    { status, trackingNumber, transportInfo, internalNotes },
    existing.status !== status || note ? { status, note } : undefined,
  );
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/dispatch");
}

export async function savePin(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await adminOrThrow();
    const id = clean(formData.get("id"));
    const code = clean(formData.get("code"));
    const area = clean(formData.get("area"));
    const district = clean(formData.get("district"));
    const state = clean(formData.get("state"));
    if (!isValidPin(code) || !area || !district || !state) {
      return { error: "PIN code, area, district, and state are required." };
    }
    const data = {
      code,
      area,
      district,
      state,
      deliveryEnabled: formData.get("deliveryEnabled") === "on",
      verified: formData.get("verified") === "on",
      chargePaise: optionalPaise(clean(formData.get("charge"))),
      estimateNote: clean(formData.get("estimateNote")) || null,
    };
    await savePinRecord(id || null, data);
    revalidatePath("/admin/pincodes");
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "The PIN code could not be saved." };
  }
}

export async function deletePin(formData: FormData) {
  await adminOrThrow();
  const id = clean(formData.get("id"));
  if (id) await deletePinById(id);
  revalidatePath("/admin/pincodes");
}
