import { initializeLocalDatabase } from "@/db/local/database";

import { calculateVatSummary, type VatSummary } from "./calculateVatSummary";

type VatPeriod = {
  label: string;
  start: string;
  end: string;
  daysRemaining: number;
};

type VatRow = {
  total: number | null;
};

export type LocalVatSummary = VatSummary & {
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

async function sumColumn(table: string, column: string, tenantId: string, start: string, end: string) {
  const db = await initializeLocalDatabase();
  const row = await db.getFirstAsync<VatRow>(
    `select coalesce(sum(${column}), 0) as total from ${table} where tenant_id = ? and date(created_at) between date(?) and date(?);`,
    [tenantId, start, end],
  );

  return Number(row?.total ?? 0);
}

async function countRows(table: string, tenantId: string, start: string, end: string) {
  const db = await initializeLocalDatabase();
  const row = await db.getFirstAsync<VatRow>(
    `select count(*) as total from ${table} where tenant_id = ? and date(created_at) between date(?) and date(?);`,
    [tenantId, start, end],
  );

  return Number(row?.total ?? 0);
}

export async function fetchLocalVatSummary(tenantId: string): Promise<LocalVatSummary> {
  const period = getCurrentVatPeriod();
  const [outputVat, inputVat, salesCount, purchaseCount] = await Promise.all([
    sumColumn("local_sales", "vat_amount", tenantId, period.start, period.end),
    sumColumn("local_purchases", "vat_amount", tenantId, period.start, period.end),
    countRows("local_sales", tenantId, period.start, period.end),
    countRows("local_purchases", tenantId, period.start, period.end),
  ]);
  const expenseVat = 0;
  const summary = calculateVatSummary({ outputVat, inputVat, expenseVat });

  return {
    ...summary,
    period,
    salesCount,
    purchaseCount,
    lastUpdatedAt: new Date().toISOString(),
  };
}
