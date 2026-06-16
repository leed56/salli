import { supabaseClient } from "@/lib/supabaseClient";

export async function signInWithEmail(email: string, password: string) {
  return supabaseClient.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string) {
  return supabaseClient.auth.signUp({ email, password });
}

export async function endLogin() {
  return supabaseClient.auth.signOut();
}
