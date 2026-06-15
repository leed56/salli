export type Plan = "free" | "standard" | "pro";
export type Role = "owner" | "cashier";

export type Feature =
  | "billing"
  | "stock"
  | "credit_book"
  | "day_close"
  | "supplier_invoice_capture"
  | "vat_return"
  | "exports"
  | "staff_accounts"
  | "supplier_ledger"
  | "reports"
  | "profit_view"
  | "cost_price_view"
  | "multi_branch";

const planFeatures: Record<Plan, Feature[]> = {
  free: ["billing", "stock", "credit_book", "day_close"],
  standard: [
    "billing",
    "stock",
    "credit_book",
    "day_close",
    "supplier_invoice_capture",
    "vat_return",
    "exports",
    "supplier_ledger",
  ],
  pro: [
    "billing",
    "stock",
    "credit_book",
    "day_close",
    "supplier_invoice_capture",
    "vat_return",
    "exports",
    "staff_accounts",
    "supplier_ledger",
    "reports",
    "profit_view",
    "cost_price_view",
    "multi_branch",
  ],
};

const cashierBlockedFeatures: Feature[] = [
  "supplier_invoice_capture",
  "vat_return",
  "exports",
  "staff_accounts",
  "supplier_ledger",
  "reports",
  "profit_view",
  "cost_price_view",
  "multi_branch",
];

export function canUsePlanFeature(plan: Plan, feature: Feature) {
  return planFeatures[plan]?.includes(feature) ?? false;
}

export function canUseRoleFeature(role: Role, feature: Feature) {
  if (role === "owner") return true;
  return !cashierBlockedFeatures.includes(feature);
}

export function canUseFeature(plan: Plan, role: Role, feature: Feature) {
  return canUsePlanFeature(plan, feature) && canUseRoleFeature(role, feature);
}
