import { create } from "zustand";

import { calculateSaleTotals } from "@/features/sales/calculateSaleTotals";
import type { CartItem, SaleTotals } from "@/features/sales/types";

type CartState = {
  items: CartItem[];
  totals: SaleTotals;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totals: { subtotal: 0, vatAmount: 0, total: 0 },
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((current) => current.productId === item.productId);
      const items = existing
        ? state.items.map((current) =>
            current.productId === item.productId
              ? {
                  ...current,
                  qty: current.qty + item.qty,
                  vatAmount: current.vatAmount + item.vatAmount,
                  lineTotal: current.lineTotal + item.lineTotal,
                }
              : current,
          )
        : [...state.items, item];

      return { items, totals: calculateSaleTotals(items) };
    }),
  removeItem: (productId) =>
    set((state) => {
      const items = state.items.filter((item) => item.productId !== productId);
      return { items, totals: calculateSaleTotals(items) };
    }),
  clear: () => set({ items: [], totals: { subtotal: 0, vatAmount: 0, total: 0 } }),
}));
