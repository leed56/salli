import type { PropsWithChildren } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
}>;

export function Screen({ children, scroll = true }: ScreenProps) {
  const content = <View className="flex-1 px-5 py-4">{children}</View>;

  return (
    <SafeAreaView className="flex-1 bg-salli-bg">
      {scroll ? <ScrollView className="flex-1">{content}</ScrollView> : content}
    </SafeAreaView>
  );
}
