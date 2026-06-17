import { supabaseClient } from "@/lib/supabaseClient";

export type Customer = {
  id: string;
  name: string;
  phone: string | null;
  balance: number;
};

type CustomerRow = {
  id: string;
  name: string;
  phone: string | null;
  balance: number | string;
};

function mapCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    balance: Number(row.balance ?? 0),
  };
}

export async function listCustomers(shopId: string): Promise<Customer[]> {
  const { data, error } = await supabaseClient
    .from("customers")
    .select("id, name, phone, balance")
    .eq("tenant_id", shopId)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data as CustomerRow[] | null) ?? []).map(mapCustomer);
}

export async function addCustomer(shopId: string, input: { name: string; phone?: string }) {
  return supabaseClient.from("customers").insert({
    tenant_id: shopId,
    name: input.name,
    phone: input.phone || null,
  });
}

/**
 * Records a credit collection: reduces the customer's outstanding balance
 * (floored at zero). Read-modify-write is acceptable for the MVP volume.
 */
export async function recordPayment(shopId: string, customerId: string, amount: number) {
  const current = await supabaseClient
    .from("customers")
    .select("balance")
    .eq("tenant_id", shopId)
    .eq("id", customerId)
    .single();

  if (current.error || !current.data) {
    return { error: current.error ?? new Error("Customer not found.") };
  }

  const nextBalance = Math.max(0, Number(current.data.balance ?? 0) - amount);

  const { error } = await supabaseClient
    .from("customers")
    .update({ balance: nextBalance, updated_at: new Date().toISOString() })
    .eq("tenant_id", shopId)
    .eq("id", customerId);

  return { error: error ?? null, data: error ? null : { balance: nextBalance } };
}
