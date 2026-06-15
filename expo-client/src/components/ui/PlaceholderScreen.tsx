import { Text, View } from "react-native";

import { Screen } from "@/components/ui/Screen";

type PlaceholderScreenProps = {
  title: string;
  description: string;
};

export function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
  return (
    <Screen>
      <View className="gap-4">
        <Text className="text-sm font-semibold uppercase tracking-[3px] text-salli-muted">
          Salli MVP
        </Text>
        <Text className="text-4xl font-black text-salli-text">{title}</Text>
        <Text className="text-lg leading-7 text-salli-muted">{description}</Text>
      </View>
    </Screen>
  );
}
