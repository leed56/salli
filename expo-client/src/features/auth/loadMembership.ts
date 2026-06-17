import { supabaseClient } from "@/lib/supabaseClient";
import type { Plan, Role } from "@/features/subscriptions/entitlements";

export type Membership = {
  shopId: string;
  role: Role;
  plan: Plan;
  vatEnabled: boolean;
  vatRate: number;
};

/**
 * Loads the signed-in user's tenant membership (shop id + role), the tenant's
 * subscription plan, and its VAT settings. Returns null when the user has not
 * completed shop setup yet.
 */
export async function loadMembership(userId: string): Promise<Membership | null> {
  const memberResult = await supabaseClient
    .from("tenant_members")
    .select("tenant_id, role")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (memberResult.error || !memberResult.data) {
    return null;
  }

  const shopId = memberResult.data.tenant_id as string;
  const role = (memberResult.data.role as Role) ?? "owner";

  const [subscriptionResult, tenantResult] = await Promise.all([
    supabaseClient.from("subscriptions").select("plan").eq("tenant_id", shopId).limit(1).maybeSingle(),
    supabaseClient.from("tenants").select("vat_enabled, vat_rate").eq("id", shopId).maybeSingle(),
  ]);

  const plan = (subscriptionResult.data?.plan as Plan) ?? "free";
  const vatEnabled = tenantResult.data?.vat_enabled ?? true;
  const vatRate = tenantResult.data?.vat_rate != null ? Number(tenantResult.data.vat_rate) : 0.18;

  return { shopId, role, plan, vatEnabled, vatRate };
}
