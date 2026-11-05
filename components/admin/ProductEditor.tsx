"use client";

import { useActionState, useState } from "react";
import { deleteProduct, saveProduct } from "@/app/actions/admin";
import { paiseToRupeeInput } from "@/lib/money";

function galleryLines(value?: string) {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) return parsed.filter((item) => typeof item === "string").join("\n");
  } catch {
    return value;
  }
  return value;
}

type ProductForm = {
  id?: string;
  name: string;
  slug: string;
  gradeLabel: string;
  description: string;
  nutSize: string;
  imagePath: string;
  packImagePath: string;
  galleryPaths?: string;
  sortOrder: number;
  isActive: boolean;
  sampleAvailable: boolean;
  bulkAvailable: boolean;
  sample250Paise: number | null;
  sample500Paise: number | null;
  sample1000Paise: number | null;
};

export function ProductEditor({ product }: { product?: ProductForm }) {
  const [state, action, pending] = useActionState(saveProduct, {});
  const savedImage = product?.packImagePath || product?.imagePath || "";
  const [preview, setPreview] = useState(savedImage);

  function chooseImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setPreview(savedImage);
      return;
    }
    setPreview(URL.createObjectURL(file));
  }

  return (
    <form action={action} className="panel grid gap-3 p-4">
      {product?.id ? <input type="hidden" name="id" value={product.id} /> : null}
      <div className="grid gap-3 sm:grid-cols-[9rem_1fr] sm:items-center">
        <div className="flex h-36 w-full items-center justify-center overflow-hidden rounded-lg border border-[#e4e7ec] bg-[#f7f8fa] sm:w-36">
          {preview ? (
            <img src={preview} alt={product?.name ? `${product.name} preview` : "Selected product image"} className="h-full w-full object-contain" />
          ) : (
            <p className="px-2 text-center text-sm text-muted">No image yet</p>
          )}
        </div>
        <label className="field">
          <span>{product ? "Replace image from this device" : "Add image from this device"}</span>
          <input name="image" type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseImage} />
          <p className="text-sm font-normal text-muted">JPG, PNG, or WEBP, up to 4 MB. The picture appears here before you save.</p>
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="field"><span>Name</span><input name="name" defaultValue={product?.name ?? ""} required /></label>
        <label className="field"><span>Slug</span><input name="slug" defaultValue={product?.slug ?? ""} required /></label>
        <label className="field"><span>Grade</span><input name="gradeLabel" defaultValue={product?.gradeLabel ?? ""} required /></label>
      </div>
      <label className="field"><span>Description</span><textarea name="description" defaultValue={product?.description ?? ""} required /></label>
      <label className="field"><span>Nut size</span><input name="nutSize" defaultValue={product?.nutSize ?? ""} /></label>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="field"><span>Image path</span><input name="imagePath" defaultValue={product?.imagePath ?? ""} /></label>
        <label className="field"><span>65 kg pack image</span><input name="packImagePath" defaultValue={product?.packImagePath ?? ""} /></label>
      </div>
      <label className="field"><span>Gallery paths, one per line</span><textarea name="galleryPaths" defaultValue={galleryLines(product?.galleryPaths)} /></label>
      <div className="grid gap-3 md:grid-cols-4">
        <label className="field"><span>Sort</span><input name="sortOrder" defaultValue={product?.sortOrder ?? 0} /></label>
        <label className="field"><span>250 g sample ₹</span><input name="sample250" defaultValue={paiseToRupeeInput(product?.sample250Paise)} /></label>
        <label className="field"><span>500 g sample ₹</span><input name="sample500" defaultValue={paiseToRupeeInput(product?.sample500Paise)} /></label>
        <label className="field"><span>1 kg sample ₹</span><input name="sample1000" defaultValue={paiseToRupeeInput(product?.sample1000Paise)} /></label>
      </div>
      <div className="flex flex-wrap gap-4 text-base">
        <label><input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} /> Active</label>
        <label><input type="checkbox" name="sampleAvailable" defaultChecked={product?.sampleAvailable ?? true} /> Samples</label>
        <label><input type="checkbox" name="bulkAvailable" defaultChecked={product?.bulkAvailable ?? true} /> Bulk</label>
      </div>
      {state.error ? <p className="text-[#8a3b1d]">{state.error}</p> : null}
      {state.ok ? <p className="text-forest">Saved.</p> : null}
      <div className="flex gap-2">
        <button className="btn btn-primary" disabled={pending} type="submit">{pending ? "Saving…" : product ? "Save product" : "Add product"}</button>
      </div>
      {product?.id ? (
        <button className="btn btn-secondary w-fit" type="submit" formAction={deleteProduct}>Delete product</button>
      ) : null}
    </form>
  );
}
