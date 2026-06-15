import type { CartItem, SaleTotals } from "./types";

export function calculateSaleTotals(items: CartItem[]): SaleTotals {
  return items.reduce<SaleTotals>(
    (totals, item) => ({
      subtotal: totals.subtotal + item.lineTotal - item.vatAmount,
      vatAmount: totals.vatAmount + item.vatAmount,
      total: totals.total + item.lineTotal,
    }),
    { subtotal: 0, vatAmount: 0, total: 0 },
  );
}
