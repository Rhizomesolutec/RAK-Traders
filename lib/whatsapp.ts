export function normalizeWhatsappNumber(number: string): string | null {
  const digits = number.replace(/\D/g, "");
  if (/^[6-9]\d{9}$/.test(digits)) return `91${digits}`;
  if (/^91[6-9]\d{9}$/.test(digits)) return digits;
  return null;
}

export function whatsappHref(number: string, message: string): string | null {
  const normalized = normalizeWhatsappNumber(number);
  if (!normalized) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello RAK TRADERS, I would like to know today's arecanut rate and place an order.";
