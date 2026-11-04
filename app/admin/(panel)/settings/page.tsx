import { Suspense } from "react";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/catalog";

async function Settings() {
  const settings = await getSettings();
  return <SettingsForm settings={settings} />;
}

export default function SettingsPage() {
  return (
    <section>
      <h1 className="mb-5 text-3xl font-semibold text-forest">Settings</h1>
      <Suspense fallback={<p>Loading settings…</p>}><Settings /></Suspense>
    </section>
  );
}
