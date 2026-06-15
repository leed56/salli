import { canUseFeature, type Feature, type Plan, type Role } from "@/features/subscriptions/entitlements";

export type AccessDecision = {
  allowed: boolean;
  reason?: "plan" | "role";
};

export function getAccessDecision(plan: Plan, role: Role, feature: Feature): AccessDecision {
  if (canUseFeature(plan, role, feature)) {
    return { allowed: true };
  }

  if (role !== "owner") {
    return { allowed: false, reason: "role" };
  }

  return { allowed: false, reason: "plan" };
}
