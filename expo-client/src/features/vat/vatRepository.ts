import { supabaseClient } from "@/lib/supabaseClient";

import { calculateVatSummary } from "./calculateVatSummary";

export async function fetchVatSummary(tenantId: string, periodStart: string, periodEnd: string) {
  const [sales, purchases, expenses] = await Promise.all([
    supabaseClient
      .from("sales")
      .select("vat_amount")
      .eq("tenant_id", tenantId)
      .gte("created_at", periodStart)
      .lte("created_at", periodEnd),
    supabaseClient
      .from("purchases")
      .select("vat_amount")
      .eq("tenant_id", tenantId)
      .eq("status", "confirmed")
      .gte("created_at", periodStart)
      .lte("created_at", periodEnd),
    supabaseClient
      .from("expenses")
      .select("vat_amount")
      .eq("tenant_id", tenantId)
      .gte("created_at", periodStart)
      .lte("created_at", periodEnd),
  ]);

  if (sales.error) return { error: sales.error };
  if (purchases.error) return { error: purchases.error };
  if (expenses.error) return { error: expenses.error };

  const outputVat = (sales.data ?? []).reduce((sum, row) => sum + Number(row.vat_amount ?? 0), 0);
  const inputVat = (purchases.data ?? []).reduce((sum, row) => sum + Number(row.vat_amount ?? 0), 0);
  const expenseVat = (expenses.data ?? []).reduce((sum, row) => sum + Number(row.vat_amount ?? 0), 0);

  return { data: calculateVatSummary({ outputVat, inputVat, expenseVat }) };
}
