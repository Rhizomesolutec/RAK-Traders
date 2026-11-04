"use client";

import { useActionState } from "react";
import { deletePin, savePin } from "@/app/actions/admin";
import { paiseToRupeeInput } from "@/lib/money";

type PinForm = {
  id: string;
  code: string;
  area: string;
  district: string;
  state: string;
  deliveryEnabled: boolean;
  verified: boolean;
  chargePaise: number | null;
  estimateNote: string | null;
};

export function PinEditor({ pin }: { pin?: PinForm }) {
  const [state, action, pending] = useActionState(savePin, {});
  return (
    <form action={action} className="panel grid gap-3 p-4">
      {pin ? <input type="hidden" name="id" value={pin.id} /> : null}
      <div className="grid gap-3 md:grid-cols-4">
        <label className="field"><span>PIN code</span><input name="code" defaultValue={pin?.code ?? ""} required /></label>
        <label className="field"><span>Area</span><input name="area" defaultValue={pin?.area ?? ""} required /></label>
        <label className="field"><span>District</span><input name="district" defaultValue={pin?.district ?? "Malappuram"} required /></label>
        <label className="field"><span>State</span><input name="state" defaultValue={pin?.state ?? "Kerala"} required /></label>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="field"><span>Delivery charge ₹</span><input name="charge" defaultValue={paiseToRupeeInput(pin?.chargePaise)} placeholder="Leave blank to confirm later" /></label>
        <label className="field"><span>Estimate note</span><input name="estimateNote" defaultValue={pin?.estimateNote ?? ""} placeholder="Optional. Do not promise a date unless you know it." /></label>
      </div>
      <div className="flex gap-4">
        <label><input type="checkbox" name="verified" defaultChecked={pin?.verified ?? false} /> Verified PIN</label>
        <label><input type="checkbox" name="deliveryEnabled" defaultChecked={pin?.deliveryEnabled ?? false} /> Delivery enabled</label>
      </div>
      {state.error ? <p className="text-[#8a3b1d]">{state.error}</p> : null}
      {state.ok ? <p className="text-forest">Saved.</p> : null}
      <div className="flex gap-2">
        <button className="btn btn-primary" type="submit" disabled={pending}>{pin ? "Save PIN" : "Add PIN"}</button>
        {pin ? <button className="btn btn-secondary" type="submit" formAction={deletePin}>Remove</button> : null}
      </div>
    </form>
  );
}
