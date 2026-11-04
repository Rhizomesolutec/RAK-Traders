"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "rak-traders-cart";
const EMPTY: CartItem[] = [];

let items = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  if (!hydrated) {
    hydrated = true;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? (JSON.parse(saved) as CartItem[]) : EMPTY;
      items = Array.isArray(parsed) ? parsed : EMPTY;
    } catch {
      items = EMPTY;
    }
  }
  return items;
}

function getServerSnapshot() {
  return EMPTY;
}

function commit(next: CartItem[]) {
  items = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  emit();
}

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  count: number;
  subtotalPaise: number;
  addItem: (item: CartItem, mode?: "add" | "set") => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: current,
      ready,
      count: current.reduce((sum, item) => sum + item.quantity, 0),
      subtotalPaise: current.reduce((sum, item) => sum + item.unitPricePaise * item.quantity, 0),
      addItem: (item, mode = "add") => {
        const existing = current.find((entry) => entry.key === item.key);
        if (!existing) {
          commit([...current, item]);
          return;
        }
        const quantity = mode === "set" ? item.quantity : Math.min(100, existing.quantity + item.quantity);
        commit(
          current.map((entry) =>
            entry.key === item.key
              ? { ...entry, quantity, unitPricePaise: item.unitPricePaise, ratePerKgPaise: item.ratePerKgPaise }
              : entry,
          ),
        );
      },
      setQuantity: (key, quantity) => {
        commit(
          current
            .map((entry) => (entry.key === key ? { ...entry, quantity } : entry))
            .filter((entry) => entry.quantity > 0),
        );
      },
      removeItem: (key) => commit(current.filter((entry) => entry.key !== key)),
      clear: () => commit([]),
    }),
    [current, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
