import { createClient } from "@supabase/supabase-js";

// Reference EXPO_PUBLIC_* vars statically so Expo can inline them into the web
// bundle (dynamic process.env[key] access is not statically replaced and would
// be empty on web). Fall back to harmless placeholders so importing this module
// never throws "supabaseUrl is required" when env is unset; real auth requires
// configuring EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabaseClient = createClient(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
