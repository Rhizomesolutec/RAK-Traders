"use client";

import { useState } from "react";
import { CheckCircle2, MapPin, Truck } from "lucide-react";
import { checkPin } from "@/app/actions/public";
import { INDIAN_STATES } from "@/lib/company";
import { formatInr } from "@/lib/money";
import type { PinCheckResult } from "@/lib/types";

export function DeliveryChecker() {
  const [code, setCode] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<PinCheckResult | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!city.trim() || !stateName) {
      setResult({
        status: "invalid",
        message: "Enter your city and choose your state, then check the PIN code.",
      });
      return;
    }
    setPending(true);
    try {
      const checked = await checkPin(code);
      const place = `${city.trim()}, ${stateName}`;
      if (checked.status === "available") {
        setResult({ ...checked, message: `${checked.message} Location entered: ${place}.` });
      } else if (checked.status === "confirm") {
        setResult({
          status: "confirm",
          message: `Delivery to ${place}, PIN ${code}, needs confirmation. Contact us on WhatsApp.`,
        });
      } else {
        setResult(checked);
      }
    } catch {
      setResult({
        status: "confirm",
        message:
          "Delivery availability for your location needs confirmation. Contact us on WhatsApp.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-[#e6dfd5] bg-white shadow-[0_14px_40px_-16px_rgba(28,25,23,0.1)]">
      <div className="grid lg:grid-cols-12">
        {/* Left info banner */}
        <div className="flex flex-col justify-between bg-[#13110f] p-7 text-white sm:p-10 lg:col-span-5">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a24b]/35 bg-[#c9a24b]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#e7c97a] uppercase">
              <Truck size={13} />
              Dispatch &amp; Logistics
            </span>
            <h2 className="font-display mt-4 text-2xl font-semibold text-white sm:text-3xl">
              Check Delivery Availability
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Confirmed service is currently active for Ponnani and nearby Malappuram PIN codes. Pan-India wholesale transport can be checked and confirmed directly.
            </p>
          </div>

          <div className="mt-8 space-y-3 border-t border-white/10 pt-6 text-xs text-white/75">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={15} className="shrink-0 text-[#e7c97a]" />
              <span>Secure moisture-protected 65 kg jute &amp; poly-lined bags</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin size={15} className="shrink-0 text-[#e7c97a]" />
              <span>Dispatched directly from Ponnani, Malappuram, Kerala</span>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="p-7 sm:p-10 lg:col-span-7">
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <label className="field">
              <span>City</span>
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="e.g. Ponnani"
                required
              />
            </label>
            <label className="field">
              <span>State</span>
              <select
                value={stateName}
                onChange={(event) => setStateName(event.target.value)}
                required
              >
                <option value="">Choose state</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </label>
            <label className="field sm:col-span-2">
              <span>6-Digit PIN Code</span>
              <input
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="679577"
                required
              />
            </label>
            <div className="pt-1 sm:col-span-2">
              <button
                className="btn btn-primary min-h-12 w-full px-7 sm:w-auto"
                type="submit"
                disabled={pending}
              >
                {pending ? "Checking…" : "Check Availability"}
              </button>
            </div>
          </form>

          {result ? (
            <div
              className={`mt-5 rounded-xl border px-4 py-3.5 text-sm leading-6 ${
                result.status === "available"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-amber-200 bg-amber-50 text-amber-950"
              }`}
            >
              <p className="font-medium">{result.message}</p>
              {result.status === "available" ? (
                <p className="mt-1 text-emerald-800">
                  {result.area}.{" "}
                  {result.chargePaise == null
                    ? "Delivery charge will be confirmed with you."
                    : `Delivery charge: ${formatInr(result.chargePaise)}.`}
                  {result.estimateNote ? ` ${result.estimateNote}` : ""}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
