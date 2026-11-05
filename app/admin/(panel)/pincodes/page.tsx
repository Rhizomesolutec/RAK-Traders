import { Suspense } from "react";
import { listPins } from "@/lib/store";
import { PinEditor } from "@/components/admin/PinEditor";

async function Pins() {
  const pins = await listPins();
  return (
    <div className="grid gap-4">
      <PinEditor />
      {pins.map((pin) => <PinEditor key={pin.id} pin={pin} />)}
    </div>
  );
}

export default function PinsPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-semibold text-forest">PIN Codes</h1>
      <p className="mb-5 max-w-3xl text-base leading-7 text-muted">
        The starting list uses India Post PIN codes around Ponnani. Delivery is enabled for those verified codes, and no delivery charge is set until you enter one.
      </p>
      <Suspense fallback={<p>Loading PIN codes…</p>}><Pins /></Suspense>
    </section>
  );
}
