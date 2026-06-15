import { supabaseClient } from "@/lib/supabaseClient";

type CreateShopInput = {
  name: string;
  vatNumber?: string;
  quarterStartMonth: number;
  language: "en" | "si" | "ta";
};

export async function createShop(input: CreateShopInput) {
  const userResult = await supabaseClient.auth.getUser();
  const userId = userResult.data.user?.id;

  if (!userId) {
    return { error: new Error("You must sign in before creating a shop.") };
  }

  const tenantResult = await supabaseClient
    .from("tenants")
    .insert({
      name: input.name,
      vat_number: input.vatNumber || null,
      quarter_start_month: input.quarterStartMonth,
      language: input.language,
    })
    .select("id")
    .single();

  if (tenantResult.error || !tenantResult.data) {
    return { error: tenantResult.error ?? new Error("Shop creation failed.") };
  }

  const tenantId = tenantResult.data.id;

  const memberResult = await supabaseClient.from("tenant_members").insert({
    tenant_id: tenantId,
    user_id: userId,
    role: "owner",
  });

  if (memberResult.error) {
    return { error: memberResult.error };
  }

  const subscriptionResult = await supabaseClient.from("subscriptions").insert({
    tenant_id: tenantId,
    plan: "free",
    status: "trial",
  });

  if (subscriptionResult.error) {
    return { error: subscriptionResult.error };
  }

  return { data: { tenantId } };
}
