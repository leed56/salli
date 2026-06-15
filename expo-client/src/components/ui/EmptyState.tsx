import { Text, View } from "react-native";

import { PremiumCard } from "./PremiumCard";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <PremiumCard tone="slate">
      <View className="items-center gap-3 py-4">
        <View className="h-14 w-14 rounded-full bg-salli-teal/10" />
        <Text className="text-center text-2xl font-black text-salli-text">{title}</Text>
        <Text className="text-center text-base leading-6 text-salli-muted">{description}</Text>
        {action ? <View className="mt-2 w-full">{action}</View> : null}
      </View>
    </PremiumCard>
  );
}
