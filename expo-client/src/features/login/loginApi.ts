import { supabaseClient } from "@/lib/supabaseClient";

export async function startLogin(phone: string) {
  return supabaseClient.auth.signInWithOtp({ phone });
}

export async function completeLogin(phone: string, code: string) {
  return supabaseClient.auth.verifyOtp({
    phone,
    token: code,
    type: "sms",
  });
}

export async function endLogin() {
  return supabaseClient.auth.signOut();
}
