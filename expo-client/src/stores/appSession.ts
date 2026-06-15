import { create } from "zustand";

import type { Plan, Role } from "@/features/subscriptions/entitlements";

type AppSession = {
  userId: string | null;
  shopId: string | null;
  role: Role;
  plan: Plan;
  setupDone: boolean;
  update: (data: Partial<Omit<AppSession, "update" | "clear">>) => void;
  clear: () => void;
};

const defaults = {
  userId: null,
  shopId: null,
  role: "owner" as Role,
  plan: "free" as Plan,
  setupDone: false,
};

export const useAppSession = create<AppSession>((set) => ({
  ...defaults,
  update: (data) => set(data),
  clear: () => set(defaults),
}));
