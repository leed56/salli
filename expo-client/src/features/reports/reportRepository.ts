import { supabaseClient } from "@/lib/supabaseClient";
import { getCurrentVatPeriod } from "@/features/vat/supabaseVatRepository";

export type ReportData = {
  periodLabel: string;
  salesTotal: number;
  salesCount: number;
  salesSubtotal: number;
  outputVat: number;
  cashSales: number;
  creditSales: number;
  purchaseTotal: number;
  inputVat: number;
  expenseTotal: number;
  expenseVat: number;
  cogs: number;
  grossProfit: number;
  netVat: number;
  creditOutstanding: number;
};

const num = (value: unknown) => Number(value ?? 0);

/**
 * Owner report for the current VAT quarter, aggregated from Supabase:
 * sales (output VAT, cash/credit split), purchases (input VAT), expenses
 * (expense VAT), COGS (sale qty x current product cost), gross profit, net VAT,
 * and total outstanding credit.
 */
export async function fetchReport(shopId: string): Promise<ReportData> {
  const period = getCurrentVatPeriod();
  const start = `${period.start}T00:00:00.000Z`;
  const end = `${period.end}T23:59:59.999Z`;

  const [sales, purchases, expenses, items, customers] = await Promise.all([
    supabaseClient.from("sales").select("total, vat_amount, payment_type").eq("tenant_id", shopId).gte("created_at", start).lte("created_at", end),
    supabaseClient.from("purchases").select("total, vat_amount").eq("tenant_id", shopId).eq("status", "confirmed").gte("created_at", start).lte("created_at", end),
    supabaseClient.from("expenses").select("amount, vat_amount").eq("tenant_id", shopId).gte("created_at", start).lte("created_at", end),
    supabaseClient.from("sale_items").select("qty, products(cost_price)").eq("tenant_id", shopId).gte("created_at", start).lte("created_at", end),
    supabaseClient.from("customers").select("balance").eq("tenant_id", shopId),
  ]);

  for (const result of [sales, purchases, expenses, items, customers]) {
    if (result.error) throw result.error;
  }

  const saleRows = (sales.data ?? []) as Array<{ total: number | string; vat_amount: number | string; payment_type: string }>;
  let salesTotal = 0;
  let outputVat = 0;
  let cashSales = 0;
  let creditSales = 0;
  for (const row of saleRows) {
    const total = num(row.total);
    salesTotal += total;
    outputVat += num(row.vat_amount);
    if (row.payment_type === "credit") creditSales += total;
    else cashSales += total;
  }

  const purchaseTotal = (purchases.data ?? []).reduce((sum, row) => sum + num((row as { total: unknown }).total), 0);
  const inputVat = (purchases.data ?? []).reduce((sum, row) => sum + num((row as { vat_amount: unknown }).vat_amount), 0);
  const expenseTotal = (expenses.data ?? []).reduce((sum, row) => sum + num((row as { amount: unknown }).amount), 0);
  const expenseVat = (expenses.data ?? []).reduce((sum, row) => sum + num((row as { vat_amount: unknown }).vat_amount), 0);

  const cogs = (items.data ?? []).reduce((sum, row) => {
    const raw = (row as { products: unknown }).products;
    const product = Array.isArray(raw) ? raw[0] : raw;
    const cost = num((product as { cost_price?: unknown } | null)?.cost_price);
    return sum + num((row as { qty: unknown }).qty) * cost;
  }, 0);

  const salesSubtotal = salesTotal - outputVat;
  const creditOutstanding = (customers.data ?? []).reduce((sum, row) => sum + num((row as { balance: unknown }).balance), 0);

  return {
    periodLabel: period.label,
    salesTotal,
    salesCount: saleRows.length,
    salesSubtotal,
    outputVat,
    cashSales,
    creditSales,
    purchaseTotal,
    inputVat,
    expenseTotal,
    expenseVat,
    cogs,
    grossProfit: salesSubtotal - cogs,
    netVat: Math.max(0, outputVat - inputVat - expenseVat),
    creditOutstanding,
  };
}
