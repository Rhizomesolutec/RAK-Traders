"use client";

import { useActionState } from "react";
import { saveRates } from "@/app/actions/admin";
import { kolkataDateKey } from "@/lib/dates";
import { paiseToRupeeInput } from "@/lib/money";

type RateProduct = {
  id: string;
  name: string;
  ratePerKgPaise: number | null;
  bulkPackPaise: number | null;
  published: boolean;
  effectiveDate: string | null;
  note: string | null;
  sample250Paise: number | null;
  sample500Paise: number | null;
  sample1000Paise: number | null;
  sampleAvailable: boolean;
  bulkAvailable: boolean;
};

export function RateEditor({ products }: { products: RateProduct[] }) {
  const [state, action, pending] = useActionState(saveRates, {});
  const note = products.find((product) => product.note)?.note ?? "";
  return (
    <form action={action} className="grid gap-4">
      <div className="panel grid gap-3 p-4 md:grid-cols-2">
        <label className="field"><span>Effective date</span><input type="date" name="effectiveDate" defaultValue={kolkataDateKey()} required /></label>
        <label className="field"><span>Optional rate note</span><input name="note" defaultValue={note} /></label>
      </div>
      {products.map((product) => (
        <fieldset key={product.id} className="panel grid gap-3 p-4">
          <legend className="px-2 text-xl font-semibold text-forest">{product.name}</legend>
          <p className="text-sm text-muted">Last effective date: {product.effectiveDate || "Not published"}</p>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="field"><span>Rate per kg ₹</span><input name={`rate-${product.id}`} defaultValue={paiseToRupeeInput(product.ratePerKgPaise)} /></label>
            <label className="field"><span>65 kg pack price ₹</span><input name={`pack-${product.id}`} defaultValue={paiseToRupeeInput(product.bulkPackPaise)} /></label>
            <label className="field"><span>250 g sample ₹</span><input name={`s250-${product.id}`} defaultValue={paiseToRupeeInput(product.sample250Paise)} /></label>
            <label className="field"><span>500 g sample ₹</span><input name={`s500-${product.id}`} defaultValue={paiseToRupeeInput(product.sample500Paise)} /></label>
            <label className="field"><span>1 kg sample ₹</span><input name={`s1000-${product.id}`} defaultValue={paiseToRupeeInput(product.sample1000Paise)} /></label>
          </div>
          <p className="text-sm text-muted">Enter the 65 kg pack price itself. It is stored as entered and is not recalculated from the per kg rate.</p>
          <div className="flex flex-wrap gap-4">
            <label><input type="checkbox" name={`publish-${product.id}`} defaultChecked={product.published} /> Publish this rate</label>
            <label><input type="checkbox" name={`sample-${product.id}`} defaultChecked={product.sampleAvailable} /> Sample available</label>
            <label><input type="checkbox" name={`bulk-${product.id}`} defaultChecked={product.bulkAvailable} /> Bulk available</label>
          </div>
        </fieldset>
      ))}
      {state.error ? <p className="text-[#8a3b1d]">{state.error}</p> : null}
      {state.ok ? <p className="text-forest">Rates saved. Earlier rates remain in the history.</p> : null}
      <button className="btn btn-primary w-fit" disabled={pending} type="submit">{pending ? "Saving…" : "Publish rates"}</button>
    </form>
  );
}
