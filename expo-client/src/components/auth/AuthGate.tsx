import type { PropsWithChildren } from "react";
import { Link } from "expo-router";
import { Text, View } from "react-native";

import { useAppSession } from "@/stores/appSession";

type AuthGateProps = PropsWithChildren<{
  requireSetup?: boolean;
}>;

export function AuthGate({ children, requireSetup = true }: AuthGateProps) {
  const { userId, setupDone, hydrated } = useAppSession();

  if (!hydrated) {
    return (
      <View className="rounded-3xl bg-salli-card p-5">
        <Text className="text-base text-salli-muted">Loading your session...</Text>
      </View>
    );
  }

  if (!userId) {
    return (
      <View className="rounded-3xl bg-salli-card p-5">
        <Text className="text-xl font-bold text-salli-text">Sign in required</Text>
        <Text className="mt-2 text-base text-salli-muted">Please sign in to continue.</Text>
        <Link href="/login" className="mt-4 rounded-2xl bg-salli-teal px-5 py-3 text-center font-bold text-slate-950">
          Go to login
        </Link>
      </View>
    );
  }

  if (requireSetup && !setupDone) {
    return (
      <View className="rounded-3xl bg-salli-card p-5">
        <Text className="text-xl font-bold text-salli-text">Shop setup required</Text>
        <Text className="mt-2 text-base text-salli-muted">Create your shop profile before using Salli.</Text>
        <Link href="/onboarding" className="mt-4 rounded-2xl bg-salli-teal px-5 py-3 text-center font-bold text-slate-950">
          Set up shop
        </Link>
      </View>
    );
  }

  return <>{children}</>;
}
