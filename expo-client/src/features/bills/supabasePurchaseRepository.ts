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

  const purchaseResult = await supabaseClient
    .from("purchases")
    .insert({
      tenant_id: shopId,
      supplier_name: draft.supplierName || null,
      status: "confirmed",
      subtotal: totals.subtotal,
      vat_amount: totals.vatAmount,
      total: totals.total,
      confirmed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (purchaseResult.error || !purchaseResult.data) {
    return { error: purchaseResult.error ?? new Error("Could not save supplier bill.") };
  }

  const purchaseId = purchaseResult.data.id as string;

  const itemRows = computed.map((line) => ({
    tenant_id: shopId,
    purchase_id: purchaseId,
    name: line.name,
    qty: line.qty,
    unit_cost: line.unit_cost,
    vat_amount: line.vat_amount,
    line_total: line.line_total,
  }));

  const itemsResult = await supabaseClient.from("purchase_items").insert(itemRows);

  if (itemsResult.error) {
    return { error: itemsResult.error };
  }

  return { data: { purchaseId, vatAmount: totals.vatAmount } };
}
