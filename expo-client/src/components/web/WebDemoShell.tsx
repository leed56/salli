import { Link } from "expo-router";
import type { PropsWithChildren } from "react";
import { ScrollView, Text, View } from "react-native";

export function money(value: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PhoneShell({ children }: PropsWithChildren) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#020617" }}
      contentContainerStyle={{ minHeight: "100%", alignItems: "center", padding: 16 }}
    >
      <View style={{ width: "100%", maxWidth: 430, gap: 14 }}>{children}</View>
    </ScrollView>
  );
}

export function PageHeader({ title, description, badge }: { title: string; description: string; badge?: string }) {
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <Text style={{ color: "#94A3B8", fontSize: 13, fontWeight: "800", letterSpacing: 3, textTransform: "uppercase" }}>
          Salli
        </Text>
        {badge ? (
          <Text
            style={{
              color: "#2DD4BF",
              fontSize: 12,
              fontWeight: "900",
              backgroundColor: "rgba(45, 212, 191, 0.10)",
              borderColor: "rgba(45, 212, 191, 0.30)",
              borderWidth: 1,
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 7,
              overflow: "hidden",
            }}
          >
            {badge}
          </Text>
        ) : null}
      </View>

      <Text style={{ color: "#F8FAFC", fontSize: 30, fontWeight: "900", letterSpacing: -0.8, lineHeight: 36 }}>
        {title}
      </Text>
      <Text style={{ color: "#94A3B8", fontSize: 15, lineHeight: 22 }}>{description}</Text>
    </View>
  );
}

export function Card({ children }: PropsWithChildren) {
  return (
    <View
      style={{
        backgroundColor: "#0F172A",
        borderRadius: 24,
        padding: 18,
        borderWidth: 1,
        borderColor: "#1E293B",
        gap: 12,
      }}
    >
      {children}
    </View>
  );
}

export function Metric({ label, value, tone = "teal" }: { label: string; value: string; tone?: "teal" | "amber" | "rose" }) {
  const color = tone === "amber" ? "#F59E0B" : tone === "rose" ? "#FB7185" : "#2DD4BF";

  return (
    <View style={{ backgroundColor: "rgba(2, 6, 23, 0.58)", borderRadius: 20, padding: 14, gap: 6 }}>
      <Text style={{ color: "#94A3B8", fontSize: 13, fontWeight: "700" }}>{label}</Text>
      <Text style={{ color, fontSize: 28, fontWeight: "900", letterSpacing: -0.5 }}>{value}</Text>
    </View>
  );
}

export function ActionLink({ href, label, tone = "teal" }: { href: string; label: string; tone?: "teal" | "amber" | "dark" }) {
  const backgroundColor = tone === "amber" ? "#F59E0B" : tone === "dark" ? "#020617" : "#2DD4BF";
  const color = tone === "dark" ? "#F8FAFC" : "#042F2E";
  const borderColor = tone === "dark" ? "#1E293B" : backgroundColor;

  return (
    <Link
      href={href as never}
      style={{
        backgroundColor,
        color,
        borderColor,
        borderWidth: 1,
        borderRadius: 18,
        paddingVertical: 15,
        paddingHorizontal: 16,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "900",
        overflow: "hidden",
      }}
    >
      {label}
    </Link>
  );
}

export function BackHome() {
  return <Link href="/" style={{ color: "#94A3B8", fontSize: 15, paddingVertical: 4 }}>Back home</Link>;
}

export function DemoModuleScreen({
  title,
  description,
  metricLabel,
  metricValue,
  actionLabel,
  tone = "teal",
}: {
  title: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  actionLabel: string;
  tone?: "teal" | "amber" | "rose";
}) {
  return (
    <PhoneShell>
      <PageHeader title={title} description={description} badge="Browser preview" />
      <Card>
        <Metric label={metricLabel} value={metricValue} tone={tone} />
        <Text style={{ color: "#94A3B8", fontSize: 14, lineHeight: 21 }}>
          Browser-safe demo screen. Real Supabase and offline storage can be connected after the preview flow is stable.
        </Text>
        <ActionLink href="/" label={actionLabel} />
      </Card>
      <BackHome />
    </PhoneShell>
  );
}
