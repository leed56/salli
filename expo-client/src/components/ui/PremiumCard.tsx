import type { PropsWithChildren } from "react";
import { Text, View } from "react-native";

type PremiumCardProps = PropsWithChildren<{
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: "teal" | "amber" | "rose" | "slate";
}>;

export function PremiumCard({ children, eyebrow, title, description, tone = "slate" }: PremiumCardProps) {
  const borderClass = {
    teal: "border-salli-teal/30",
    amber: "border-salli-amber/30",
    rose: "border-salli-rose/30",
    slate: "border-slate-700/60",
  }[tone];

  const eyebrowClass = {
    teal: "text-salli-teal",
    amber: "text-salli-amber",
    rose: "text-salli-rose",
    slate: "text-salli-muted",
  }[tone];

  return (
    <View className={`rounded-[32px] border ${borderClass} bg-salli-card p-5 shadow-lg shadow-black/20`}>
      {eyebrow ? (
        <Text className={`text-xs font-black uppercase tracking-[3px] ${eyebrowClass}`}>{eyebrow}</Text>
      ) : null}
      {title ? <Text className="mt-2 text-2xl font-black text-salli-text">{title}</Text> : null}
      {description ? <Text className="mt-2 text-base leading-6 text-salli-muted">{description}</Text> : null}
      {children ? <View className={title || description || eyebrow ? "mt-5" : undefined}>{children}</View> : null}
    </View>
  );
}
