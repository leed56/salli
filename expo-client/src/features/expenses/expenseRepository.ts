import { supabaseClient } from "@/lib/supabaseClient";

export const VAT_RATE = 0.18;

export type Expense = {
  id: string;
  category: string;
  note: string | null;
  amount: number;
  vatAmount: number;
  createdAt: string;
};

type ExpenseRow = {
  id: string;
  category: string;
  note: string | null;
  amount: number | string;
  vat_amount: number | string;
  created_at: string;
};

function mapExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    category: row.category,
    note: row.note,
    amount: Number(row.amount ?? 0),
    vatAmount: Number(row.vat_amount ?? 0),
    createdAt: row.created_at,
  };
}

export async function listExpenses(shopId: string): Promise<Expense[]> {
  const { data, error } = await supabaseClient
    .from("expenses")
    .select("id, category, note, amount, vat_amount, created_at")
    .eq("tenant_id", shopId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data as ExpenseRow[] | null) ?? []).map(mapExpense);
}

export async function addExpense(
  shopId: string,
  input: { category: string; amount: number; note?: string; vatClaimable: boolean; rate?: number },
) {
  // Claimable expense VAT is the VAT-inclusive portion of the amount at the
  // given rate (0 when VAT is disabled); otherwise 0.
  const rate = input.rate ?? VAT_RATE;
  const vatAmount = input.vatClaimable ? input.amount * (rate / (1 + rate)) : 0;

  return supabaseClient.from("expenses").insert({
    tenant_id: shopId,
    category: input.category,
    note: input.note || null,
    amount: input.amount,
    vat_amount: vatAmount,
  });
}
