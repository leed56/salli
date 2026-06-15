import { createClient } from "@supabase/supabase-js";

import { getOptionalClientEnv } from "@/lib/clientEnv";

const url = getOptionalClientEnv("EXPO_PUBLIC_SUPABASE_URL") ?? "";
const key = getOptionalClientEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY") ?? "";

export const supabaseClient = createClient(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
