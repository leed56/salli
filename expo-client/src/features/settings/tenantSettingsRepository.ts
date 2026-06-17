import { supabaseClient } from "@/lib/supabaseClient";

export async function updateVatSettings(
  shopId: string,
  input: { vatEnabled: boolean; vatRate: number },
) {
  return supabaseClient
    .from("tenants")
    .update({
      vat_enabled: input.vatEnabled,
      vat_rate: input.vatRate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", shopId);
}
