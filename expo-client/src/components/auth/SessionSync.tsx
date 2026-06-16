import { useEffect } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabaseClient } from "@/lib/supabaseClient";
import { loadMembership } from "@/features/auth/loadMembership";
import { useAppSession } from "@/stores/appSession";

/**
 * Bridges Supabase auth state into the local app session store. Mounted once at
 * the app root: it hydrates the current session on launch and keeps the store in
 * sync with sign-in / sign-out / token-refresh events. Renders nothing.
 */
export function SessionSync() {
  const update = useAppSession((state) => state.update);
  const clear = useAppSession((state) => state.clear);

  useEffect(() => {
    let active = true;

    async function applySession(session: Session | null) {
      if (!active) return;

      const userId = session?.user?.id ?? null;
      if (!userId) {
        clear();
        return;
      }

      update({ userId });

      try {
        const membership = await loadMembership(userId);
        if (!active) return;

        if (membership) {
          update({
            shopId: membership.shopId,
            role: membership.role,
            plan: membership.plan,
            setupDone: true,
          });
        } else {
          update({ shopId: null, setupDone: false });
        }
      } catch {
        // Keep the user signed in even if membership lookup fails; shop setup
        // gating will simply treat setup as incomplete.
        if (active) update({ shopId: null, setupDone: false });
      }
    }

    supabaseClient.auth
      .getSession()
      .then(({ data }) => applySession(data.session))
      .catch(() => undefined);

    const { data } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      void applySession(session);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [update, clear]);

  return null;
}
