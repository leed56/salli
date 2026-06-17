import { create } from "zustand";

import type { Plan, Role } from "@/features/subscriptions/entitlements";

type AppSession = {
  userId: string | null;
  shopId: string | null;
  role: Role;
  plan: Plan;
  setupDone: boolean;
  // Per-shop VAT configuration (see migration 008).
  vatEnabled: boolean;
  vatRate: number;
  // False until SessionSync has resolved the initial Supabase session, so route
  // guards can show a loading state instead of flashing "sign in / setup required".
  hydrated: boolean;
  update: (data: Partial<Omit<AppSession, "update" | "clear">>) => void;
  clear: () => void;
};

const defaults = {
  userId: null,
  shopId: null,
  role: "owner" as Role,
  plan: "free" as Plan,
  setupDone: false,
  vatEnabled: true,
  vatRate: 0.18,
  hydrated: false,
};

/** Effective VAT rate for the current session: 0 when VAT is disabled. */
export function effectiveVatRate(session: { vatEnabled: boolean; vatRate: number }) {
  return session.vatEnabled ? session.vatRate : 0;
}

export const useAppSession = create<AppSession>((set) => ({
  ...defaults,
  update: (data) => set(data),
  clear: () => set(defaults),
}));
