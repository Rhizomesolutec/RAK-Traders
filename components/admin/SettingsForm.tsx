"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/actions/admin";
import type { SiteSettings } from "@/lib/types";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(saveSettings, {});
  return (
    <form action={action} className="panel grid max-w-3xl gap-4 p-5">
      <label className="field"><span>Company name</span><input name="companyName" defaultValue={settings.companyName} /></label>
      <label className="field"><span>Address</span><textarea name="address" defaultValue={settings.address} /></label>
      <label className="field"><span>WhatsApp number</span><input name="whatsappNumber" defaultValue={settings.whatsappNumber} placeholder="10-digit mobile" /></label>
      <label className="field"><span>Support email</span><input name="supportEmail" defaultValue={settings.supportEmail} /></label>
      <label className="field"><span>Customer support note</span><textarea name="supportNote" defaultValue={settings.supportNote} /></label>
      <label className="field"><span>Delivery note</span><textarea name="deliveryNote" defaultValue={settings.deliveryNote} /></label>
      {state.error ? <p className="text-[#8a3b1d]">{state.error}</p> : null}
      {state.ok ? <p className="text-forest">Settings saved.</p> : null}
      <button className="btn btn-primary w-fit" disabled={pending} type="submit">{pending ? "Saving…" : "Save settings"}</button>
    </form>
  );
}
