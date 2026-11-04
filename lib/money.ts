export function rupeesToPaise(input: string): number | null {
  const cleaned = input.trim().replace(/,/g, "");
  if (!cleaned) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) {
    throw new Error("Enter a valid amount in rupees, with up to 2 decimal places.");
  }
  const [rupees, fraction = ""] = cleaned.split(".");
  return Number(rupees) * 100 + Number(fraction.padEnd(2, "0"));
}

export function paiseToRupeeInput(paise: number | null | undefined): string {
  if (paise == null) return "";
  const rupees = Math.floor(paise / 100);
  const fraction = paise % 100;
  return fraction === 0 ? String(rupees) : `${rupees}.${String(fraction).padStart(2, "0")}`;
}

export function formatInr(paise: number): string {
  const negative = paise < 0;
  const abs = Math.abs(Math.trunc(paise));
  const rupees = Math.floor(abs / 100);
  const fraction = abs % 100;
  const grouped = new Intl.NumberFormat("en-IN").format(rupees);
  return `${negative ? "-" : ""}₹${grouped}.${String(fraction).padStart(2, "0")}`;
}

export function bulkPackPaise(ratePerKgPaise: number, kilograms = 65): number {
  return ratePerKgPaise * kilograms;
}

export function sampleEquivalentPerKg(samplePaise: number, weightGrams: number): number {
  return Math.round((samplePaise * 1000) / weightGrams);
}
