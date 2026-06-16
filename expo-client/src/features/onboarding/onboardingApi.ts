import { supabaseClient } from "@/lib/supabaseClient";

type CreateShopInput = {
  name: string;
  vatNumber?: string;
  quarterStartMonth: number;
  language: "en" | "si" | "ta";
};

export async function createShop(input: CreateShopInput) {
  // Tenant, owner membership and the trial subscription are created atomically
  // by a SECURITY DEFINER function (see migration 003) so first-time onboarding
  // is not blocked by the owner-only RLS write policies.
  const { data, error } = await supabaseClient.rpc("create_tenant_with_owner", {
    p_name: input.name,
    p_vat_number: input.vatNumber ?? "",
    p_quarter_start_month: input.quarterStartMonth,
    p_language: input.language,
  });

  if (error) {
    return { error };
  }

  return { data: { tenantId: data as string } };
}
