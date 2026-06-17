import { supabaseClient } from "@/lib/supabaseClient";

export type Supplier = {
  id: string;
  name: string;
  phone: string | null;
  balance: number;
};

type SupplierRow = {
  id: string;
  name: string;
  phone: string | null;
  balance: number | string;
};

function mapSupplier(row: SupplierRow): Supplier {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    balance: Number(row.balance ?? 0),
  };
}

export async function listSuppliers(shopId: string): Promise<Supplier[]> {
  const { data, error } = await supabaseClient
    .from("suppliers")
    .select("id, name, phone, balance")
    .eq("tenant_id", shopId)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data as SupplierRow[] | null) ?? []).map(mapSupplier);
}

export async function addSupplier(shopId: string, input: { name: string; phone?: string }) {
  return supabaseClient.from("suppliers").insert({
    tenant_id: shopId,
    name: input.name,
    phone: input.phone || null,
  });
}

/**
 * Records a payment to a supplier, reducing the amount owed (floored at zero).
 */
export async function recordSupplierPayment(shopId: string, supplierId: string, amount: number) {
  const current = await supabaseClient
    .from("suppliers")
    .select("balance")
    .eq("tenant_id", shopId)
    .eq("id", supplierId)
    .single();

  if (current.error || !current.data) {
    return { error: current.error ?? new Error("Supplier not found.") };
  }

  const nextBalance = Math.max(0, Number(current.data.balance ?? 0) - amount);

  const { error } = await supabaseClient
    .from("suppliers")
    .update({ balance: nextBalance, updated_at: new Date().toISOString() })
    .eq("tenant_id", shopId)
    .eq("id", supplierId);

  return { error: error ?? null, data: error ? null : { balance: nextBalance } };
}
