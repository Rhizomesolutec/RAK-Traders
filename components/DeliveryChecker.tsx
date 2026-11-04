"use client";

import { useState } from "react";
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
      setResult({ status: "invalid", message: "Enter your city and choose your state, then check the PIN code." });
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
      setResult({ status: "confirm", message: "Delivery availability for your location needs confirmation. Contact us on WhatsApp." });
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="panel p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-forest">Check Delivery Availability</h2>
      <p className="mt-2 text-base leading-7 text-muted">
        Confirmed service is currently set for Ponnani and nearby Malappuram PIN codes. Other locations can still be checked and confirmed.
      </p>
      <form onSubmit={onSubmit} className="mt-5 grid gap-3 md:grid-cols-2">
        <label className="field">
          <span>City</span>
          <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Ponnani" required />
        </label>
        <label className="field">
          <span>State</span>
          <select value={stateName} onChange={(event) => setStateName(event.target.value)} required>
            <option value="">Choose state</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </label>
        <label className="field md:col-span-2">
          <span>Enter your 6-digit PIN code</span>
          <input inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="679577" required />
        </label>
        <button className="btn btn-primary md:col-span-2 md:w-fit" type="submit" disabled={pending}>
          {pending ? "Checking…" : "Check Availability"}
        </button>
      </form>
      {result ? (
        <div className={`mt-4 rounded-xl px-4 py-3 text-base leading-7 ${result.status === "available" ? "bg-[#e7f6ec] text-[#166534]" : "bg-[#fdecec] text-[#b91c1c]"}`}>
          <p>{result.message}</p>
          {result.status === "available" ? (
            <p className="mt-1">
              {result.area}. {result.chargePaise == null ? "Delivery charge will be confirmed with you." : `Delivery charge: ${formatInr(result.chargePaise)}.`}
              {result.estimateNote ? ` ${result.estimateNote}` : ""}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
