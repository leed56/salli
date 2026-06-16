import { supabaseClient } from "@/lib/supabaseClient";

import { calculateVatSummary, type VatSummary } from "./calculateVatSummary";

export type VatPeriod = {
  label: string;
  start: string;
  end: string;
  daysRemaining: number;
};

export type VatMeterSummary = VatSummary & {
  period: VatPeriod;
  salesCount: number;
  purchaseCount: number;
  lastUpdatedAt: string;
};

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getCurrentVatPeriod(today = new Date()): VatPeriod {
  const year = today.getFullYear();
  const quarterIndex = Math.floor(today.getMonth() / 3);
  const startMonth = quarterIndex * 3;
  const endMonth = startMonth + 2;
  const startDate = new Date(Date.UTC(year, startMonth, 1));
  const endDate = new Date(Date.UTC(year, endMonth + 1, 0));
  const endOfDay = new Date(endDate);
  endOfDay.setUTCHours(23, 59, 59, 999);
  const daysRemaining = Math.max(0, Math.ceil((endOfDay.getTime() - today.getTime()) / 86_400_000));

  return {
    label: `Q${quarterIndex + 1} ${year}`,
    start: toIsoDate(startDate),
    end: toIsoDate(endDate),
    daysRemaining,
  };
}

/**
 * Computes the VAT meter for the current quarter from Supabase data:
 * output VAT from sales, input VAT from confirmed purchases, expense VAT.
 */
export async function fetchVatMeterSummary(tenantId: string): Promise<VatMeterSummary> {
  const period = getCurrentVatPeriod();
  const startIso = `${period.start}T00:00:00.000Z`;
  const endIso = `${period.end}T23:59:59.999Z`;

  const [sales, purchases, expenses] = await Promise.all([
    supabaseClient
      .from("sales")
      .select("vat_amount", { count: "exact" })
      .eq("tenant_id", tenantId)
      .gte("created_at", startIso)
      .lte("created_at", endIso),
    supabaseClient
      .from("purchases")
      .select("vat_amount", { count: "exact" })
      .eq("tenant_id", tenantId)
      .eq("status", "confirmed")
      .gte("created_at", startIso)
      .lte("created_at", endIso),
    supabaseClient
      .from("expenses")
      .select("vat_amount")
      .eq("tenant_id", tenantId)
      .gte("created_at", startIso)
      .lte("created_at", endIso),
  ]);

  if (sales.error) throw sales.error;
  if (purchases.error) throw purchases.error;
  if (expenses.error) throw expenses.error;

  const outputVat = (sales.data ?? []).reduce((sum, row) => sum + Number(row.vat_amount ?? 0), 0);
  const inputVat = (purchases.data ?? []).reduce((sum, row) => sum + Number(row.vat_amount ?? 0), 0);
  const expenseVat = (expenses.data ?? []).reduce((sum, row) => sum + Number(row.vat_amount ?? 0), 0);

  const summary = calculateVatSummary({ outputVat, inputVat, expenseVat });

  return {
    ...summary,
    period,
    salesCount: sales.count ?? (sales.data ?? []).length,
    purchaseCount: purchases.count ?? (purchases.data ?? []).length,
    lastUpdatedAt: new Date().toISOString(),
  };
}
