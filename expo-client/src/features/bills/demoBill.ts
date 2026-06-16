import type { BillDraft } from "./billModel";

export const demoBillDraft: BillDraft = {
  id: "demo-bill-001",
  supplier: "Nimal Traders",
  subtotal: 42800,
  tax: 7704,
  total: 50504,
  confidence: 0.91,
  warnings: [
    "Check invoice number before saving.",
    "One item may need product matching.",
  ],
  lines: [
    {
      id: "line-001",
      name: "Rice 5kg pack",
      qty: 20,
      unitCost: 1480,
      lineTotal: 29600,
      tax: 5328,
    },
    {
      id: "line-002",
      name: "Coconut oil 1L",
      qty: 12,
      unitCost: 850,
      lineTotal: 10200,
      tax: 1836,
    },
    {
      id: "line-003",
      name: "Tea pack 400g",
      qty: 5,
      unitCost: 600,
      lineTotal: 3000,
      tax: 540,
    },
  ],
};
