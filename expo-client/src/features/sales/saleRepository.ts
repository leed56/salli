import { supabaseClient } from "@/lib/supabaseClient";

import { calculateSaleTotals } from "./calculateSaleTotals";
import type { CartItem } from "./types";

export const VAT_RATE = 0.18;

/**
 * Builds a cart line for a catalogue product, computing the VAT portion at the
 * given rate (0 when VAT is disabled for the shop). Prices are treated as
 * VAT-inclusive unless the product is flagged otherwise.
 */
export function buildCartItem(
  product: { id: string; name: string; sellPrice: number; vatInclusive: boolean },
  qty = 1,
  rate = VAT_RATE,
): CartItem {
  const gross = product.sellPrice * qty;
  const vatAmount = product.vatInclusive
    ? gross * (rate / (1 + rate))
    : gross * rate;
  const lineTotal = product.vatInclusive ? gross : gross + vatAmount;

  return {
    productId: product.id,
    name: product.name,
    qty,
    unitPrice: product.sellPrice,
    vatAmount,
    lineTotal,
  };
}

export async function createSale(
  shopId: string,
  draft: { paymentType: "cash" | "credit"; items: CartItem[]; customerId?: string | null },
) {
  const totals = calculateSaleTotals(draft.items);

  // Recorded via a SECURITY DEFINER RPC so the sale, its items, product stock
  // decrements, and (for credit) the customer balance update happen atomically
  // (and so cashiers, who cannot write the owner-only products table directly,
  // can still record sales).
  const { data, error } = await supabaseClient.rpc("record_sale", {
    p_tenant_id: shopId,
    p_payment_type: draft.paymentType,
    p_customer_id: draft.customerId ?? null,
    p_subtotal: totals.subtotal,
    p_vat_amount: totals.vatAmount,
    p_total: totals.total,
    p_items: draft.items.map((item) => ({
      product_id: item.productId,
      name: item.name,
      qty: item.qty,
      unit_price: item.unitPrice,
      vat_amount: item.vatAmount,
      line_total: item.lineTotal,
    })),
  });

  if (error) {
    return { error };
  }

  return { data: { saleId: data as string, total: totals.total } };
}
