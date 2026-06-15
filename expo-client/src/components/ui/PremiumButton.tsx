import type { PropsWithChildren } from "react";
import { Pressable, Text } from "react-native";

type PremiumButtonProps = PropsWithChildren<{
  onPress?: () => void;
  hrefLabel?: string;
  tone?: "teal" | "amber" | "rose" | "dark";
  disabled?: boolean;
}>;

export function PremiumButton({ children, onPress, tone = "teal", disabled = false }: PremiumButtonProps) {
  const toneClass = {
    teal: "bg-salli-teal",
    amber: "bg-salli-amber",
    rose: "bg-salli-rose",
    dark: "bg-slate-900 border border-slate-700",
  }[tone];

  const textClass = tone === "dark" ? "text-salli-text" : "text-slate-950";

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`min-h-14 items-center justify-center rounded-2xl px-5 ${toneClass} ${disabled ? "opacity-50" : "opacity-100"}`}
    >
      <Text className={`text-lg font-black ${textClass}`}>{children}</Text>
    </Pressable>
  );
}
