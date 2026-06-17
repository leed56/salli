import { supabaseClient } from "@/lib/supabaseClient";

export type DaySummary = {
  salesCount: number;
  cashTotal: number;
  creditTotal: number;
  total: number;
};

function startOfTodayIso() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
}

export async function fetchTodaySummary(shopId: string): Promise<DaySummary> {
  const { data, error } = await supabaseClient
    .from("sales")
    .select("total, payment_type")
    .eq("tenant_id", shopId)
    .gte("created_at", startOfTodayIso());

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as Array<{ total: number | string; payment_type: string }>;
  let cashTotal = 0;
  let creditTotal = 0;
  for (const row of rows) {
    const value = Number(row.total ?? 0);
    if (row.payment_type === "credit") {
      creditTotal += value;
    } else {
      cashTotal += value;
    }
  }

  return { salesCount: rows.length, cashTotal, creditTotal, total: cashTotal + creditTotal };
}

export async function recordDayClose(
  shopId: string,
  input: { expectedCash: number; countedCash: number; note?: string },
) {
  const variance = input.countedCash - input.expectedCash;
  const { error } = await supabaseClient.from("cash_drawer_logs").insert({
    tenant_id: shopId,
    expected_cash: input.expectedCash,
    counted_cash: input.countedCash,
    variance,
    note: input.note || null,
  });

  return { error: error ?? null, data: error ? null : { variance } };
}
