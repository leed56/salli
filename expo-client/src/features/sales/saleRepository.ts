import { supabaseClient } from "@/lib/supabaseClient";

import { calculateSaleTotals } from "./calculateSaleTotals";
import type { CartItem } from "./types";

export const VAT_RATE = 0.18;

/**
 * Builds a cart line for a catalogue product, computing the VAT portion.
 * Prices are treated as VAT-inclusive unless the product is flagged otherwise.
 */
export function buildCartItem(
  product: { id: string; name: string; sellPrice: number; vatInclusive: boolean },
  qty = 1,
): CartItem {
  const gross = product.sellPrice * qty;
  const vatAmount = product.vatInclusive
    ? gross * (VAT_RATE / (1 + VAT_RATE))
    : gross * VAT_RATE;
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
  draft: { paymentType: "cash" | "credit"; items: CartItem[] },
) {
  const totals = calculateSaleTotals(draft.items);

  const saleResult = await supabaseClient
    .from("sales")
    .insert({
      tenant_id: shopId,
      payment_type: draft.paymentType,
      subtotal: totals.subtotal,
      vat_amount: totals.vatAmount,
      total: totals.total,
    })
    .select("id")
    .single();

  if (saleResult.error || !saleResult.data) {
    return { error: saleResult.error ?? new Error("Could not create sale.") };
  }

  const saleId = saleResult.data.id as string;

  const itemRows = draft.items.map((item) => ({
    tenant_id: shopId,
    sale_id: saleId,
    product_id: item.productId,
    name: item.name,
    qty: item.qty,
    unit_price: item.unitPrice,
    vat_amount: item.vatAmount,
    line_total: item.lineTotal,
  }));

  const itemsResult = await supabaseClient.from("sale_items").insert(itemRows);

  if (itemsResult.error) {
    return { error: itemsResult.error };
  }

  return { data: { saleId, total: totals.total } };
}
