import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { Screen } from "@/components/ui/Screen";
import { signInWithEmail, signUpWithEmail } from "@/features/login/loginApi";
import { loadMembership } from "@/features/auth/loadMembership";

type Mode = "signin" | "signup";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<Mode>("signin");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    setMessage(null);

    const trimmedEmail = email.trim();

    if (mode === "signin") {
      const { data, error } = await signInWithEmail(trimmedEmail, password);
      setIsSubmitting(false);

      if (error) {
        setMessage(error.message);
        return;
      }

      const userId = data.user?.id;
      const membership = userId ? await loadMembership(userId) : null;
      router.replace(membership ? "/" : "/onboarding");
      return;
    }

    const { data, error } = await signUpWithEmail(trimmedEmail, password);
    setIsSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.session) {
      router.replace("/onboarding");
      return;
    }

    setMessage("Account created. Check your email to confirm, then sign in.");
    setMode("signin");
  }

  return (
    <Screen scroll={false}>
      <View className="flex-1 justify-center gap-6">
        <View>
          <Text className="text-sm font-semibold uppercase tracking-[3px] text-salli-teal">
            Salli
          </Text>
          <Text className="mt-2 text-4xl font-black text-salli-text">
            {mode === "signin" ? "Sign in to your shop" : "Create your account"}
          </Text>
          <Text className="mt-3 text-base leading-6 text-salli-muted">
            Use your email and password to access Salli.
          </Text>
        </View>

        <View className="gap-4 rounded-[32px] bg-salli-card p-5">
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor="#64748B"
            className="min-h-14 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#64748B"
            className="min-h-14 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
          />

          <Pressable
            disabled={isSubmitting || !email.trim() || !password}
            onPress={handleSubmit}
            className="min-h-14 items-center justify-center rounded-2xl bg-salli-teal px-5"
          >
            <Text className="text-lg font-bold text-slate-950">
              {isSubmitting ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setMessage(null);
            }}
          >
            <Text className="text-center text-base text-salli-muted">
              {mode === "signin"
                ? "New to Salli? Create an account"
                : "Already have an account? Sign in"}
            </Text>
          </Pressable>

          {message ? <Text className="text-base text-salli-muted">{message}</Text> : null}
        </View>
      </View>
    </Screen>
  );
}
