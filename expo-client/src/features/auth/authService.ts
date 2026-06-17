import { supabaseClient } from "@/lib/supabaseClient";

export async function signInWithEmail(email: string, password: string) {
  return supabaseClient.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string) {
  return supabaseClient.auth.signUp({ email, password });
}

export async function signOut() {
  return supabaseClient.auth.signOut();
}
