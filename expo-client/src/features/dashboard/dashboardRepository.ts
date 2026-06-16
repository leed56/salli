import { supabaseClient } from "@/lib/supabaseClient";
import { fetchVatMeterSummary } from "@/features/vat/supabaseVatRepository";

export type DashboardData = {
  vatPayable: number;
  todaySales: number;
  productCount: number;
  lowStockCount: number;
  creditDue: number;
};

/**
 * Aggregates the owner cockpit metrics for a shop from Supabase: VAT payable this
 * quarter, today's sales total, product + low-stock counts, and outstanding credit.
 */
export async function fetchDashboard(shopId: string): Promise<DashboardData> {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayIso = startOfToday.toISOString();

  // VAT pulls from owner-only tables (purchases/expenses); tolerate failures
  // (e.g. cashier role) by defaulting to 0 rather than failing the whole load.
  let vatPayable = 0;
  try {
    vatPayable = (await fetchVatMeterSummary(shopId)).netPayable;
  } catch {
    vatPayable = 0;
  }

  const [salesToday, products, customers] = await Promise.all([
    supabaseClient.from("sales").select("total").eq("tenant_id", shopId).gte("created_at", todayIso),
    supabaseClient.from("products").select("stock_qty, reorder_level").eq("tenant_id", shopId),
    supabaseClient.from("customers").select("balance").eq("tenant_id", shopId),
  ]);

  const todaySales = (salesToday.data ?? []).reduce((sum, row) => sum + Number(row.total ?? 0), 0);
  const productRows = products.data ?? [];
  const lowStockCount = productRows.filter(
    (row) => Number(row.stock_qty ?? 0) <= Number(row.reorder_level ?? 0),
  ).length;
  const creditDue = (customers.data ?? []).reduce((sum, row) => sum + Number(row.balance ?? 0), 0);

  return {
    vatPayable,
    todaySales,
    productCount: productRows.length,
    lowStockCount,
    creditDue,
  };
}
