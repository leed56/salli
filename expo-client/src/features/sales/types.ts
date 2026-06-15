export type CartItem = {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  vatAmount: number;
  lineTotal: number;
};

export type SaleDraft = {
  tenantId: string;
  customerId?: string | null;
  paymentType: "cash" | "credit";
  items: CartItem[];
};

export type SaleTotals = {
  subtotal: number;
  vatAmount: number;
  total: number;
};
