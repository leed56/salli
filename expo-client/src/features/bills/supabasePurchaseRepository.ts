import { supabaseClient } from "@/lib/supabaseClient";

export const VAT_RATE = 0.18;

export type PurchaseLineInput = {
  name: string;
  qty: number;
  unitCost: number;
};

export type PurchaseTotals = {
  subtotal: number;
  vatAmount: number;
  total: number;
};

type ComputedLine = {
  name: string;
  qty: number;
  unit_cost: number;
  vat_amount: number;
  line_total: number;
};

// Treats unit costs as VAT-inclusive (consistent with the sales side) and derives
// the input VAT portion at the standard rate.
function computeLine(line: PurchaseLineInput): ComputedLine {
  const gross = line.unitCost * line.qty;
  const vatAmount = gross * (VAT_RATE / (1 + VAT_RATE));
  return {
    name: line.name,
    qty: line.qty,
    unit_cost: line.unitCost,
    vat_amount: vatAmount,
    line_total: gross,
  };
}

export function computePurchaseTotals(lines: PurchaseLineInput[]): PurchaseTotals {
  return lines.reduce<PurchaseTotals>(
    (totals, line) => {
      const computed = computeLine(line);
      return {
        subtotal: totals.subtotal + (computed.line_total - computed.vat_amount),
        vatAmount: totals.vatAmount + computed.vat_amount,
        total: totals.total + computed.line_total,
      };
    },
    { subtotal: 0, vatAmount: 0, total: 0 },
  );
}

export async function createPurchase(
  shopId: string,
  draft: { supplierName: string; lines: PurchaseLineInput[] },
) {
  const computed = draft.lines.map(computeLine);
  const totals = computePurchaseTotals(draft.lines);

  // Recorded via a SECURITY DEFINER RPC so the purchase, its items, and product
  // stock increases (matching/creating products by name) happen atomically.
  const { data, error } = await supabaseClient.rpc("record_purchase", {
    p_tenant_id: shopId,
    p_supplier_name: draft.supplierName,
    p_subtotal: totals.subtotal,
    p_vat_amount: totals.vatAmount,
    p_total: totals.total,
    p_items: computed.map((line) => ({
      name: line.name,
      qty: line.qty,
      unit_cost: line.unit_cost,
      vat_amount: line.vat_amount,
      line_total: line.line_total,
    })),
  });

  if (error) {
    return { error };
  }

  return { data: { purchaseId: data as string, vatAmount: totals.vatAmount } };
}
