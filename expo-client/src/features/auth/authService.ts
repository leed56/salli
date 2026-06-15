import { supabaseClient } from "@/lib/supabaseClient";

export async function requestPhoneCode(phone: string) {
  return supabaseClient.auth.signInWithOtp({ phone });
}

export async function verifyPhoneCode(phone: string, token: string) {
  return supabaseClient.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
}

export async function signOut() {
  return supabaseClient.auth.signOut();
}
