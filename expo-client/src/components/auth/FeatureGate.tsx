import type { PropsWithChildren } from "react";
import { Text, View } from "react-native";

import type { Feature } from "@/features/subscriptions/entitlements";
import { getAccessDecision } from "@/lib/permissions";
import { useAppSession } from "@/stores/appSession";

type FeatureGateProps = PropsWithChildren<{
  feature: Feature;
  fallbackTitle?: string;
}>;

export function FeatureGate({ children, feature, fallbackTitle = "Upgrade required" }: FeatureGateProps) {
  const { plan, role } = useAppSession();
  const decision = getAccessDecision(plan, role, feature);

  if (decision.allowed) return <>{children}</>;

  const message =
    decision.reason === "role"
      ? "This area is only available to the shop owner."
      : "This feature is available on a higher Salli plan.";

  return (
    <View className="rounded-3xl bg-salli-card p-5">
      <Text className="text-xl font-bold text-salli-text">{fallbackTitle}</Text>
      <Text className="mt-2 text-base leading-6 text-salli-muted">{message}</Text>
    </View>
  );
}
