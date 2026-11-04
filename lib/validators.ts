import { INDIAN_STATES } from "@/lib/company";

export type FieldErrors = Record<string, string>;

export function validateCustomer(input: {
  name: string;
  mobile: string;
  whatsapp: string;
  email: string;
  addressLine: string;
  state: string;
  district: string;
  city: string;
  pinCode: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  const name = input.name.trim();
  if (name.length < 2 || name.length > 80) errors.name = "Enter the full name.";
  if (!/^[6-9]\d{9}$/.test(input.mobile.trim())) errors.mobile = "Enter a valid 10-digit mobile number.";
  if (!/^[6-9]\d{9}$/.test(input.whatsapp.trim())) errors.whatsapp = "Enter a valid 10-digit WhatsApp number.";
  const email = input.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email or leave it blank.";
  if (input.addressLine.trim().length < 8) errors.addressLine = "Enter the delivery address.";
  if (!INDIAN_STATES.includes(input.state as (typeof INDIAN_STATES)[number])) errors.state = "Select a state.";
  if (input.district.trim().length < 2) errors.district = "Enter the district.";
  if (input.city.trim().length < 2) errors.city = "Enter the city or town.";
  if (!/^\d{6}$/.test(input.pinCode.trim())) errors.pinCode = "Please enter a valid 6-digit Indian PIN code.";
  return errors;
}

export function isValidPin(code: string): boolean {
  return /^\d{6}$/.test(code);
}
