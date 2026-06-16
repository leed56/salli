import { Link } from "expo-router";
import { Text, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Screen } from "@/components/ui/Screen";
import { formatLkr } from "@/lib/currency";

const dashboard = {
  vatPayable: 0,
  outputVat: 0,
  inputVat: 0,
  todaySales: 0,
  todayCash: 0,
  creditOutstanding: 0,
  lowStockCount: 1,
  daysLeftInQuarter: 16,
};

export default function HomeScreen() {
  return (
    <Screen>
      <AuthGate>
        <View className="gap-6">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="text-sm font-black uppercase tracking-[3px] text-salli-teal">
                Salli
              </Text>
              <Text className="mt-2 text-4xl font-black leading-tight text-salli-text">
                Your shop is under control
              </Text>
            </View>
            <View className="rounded-full border border-salli-teal/30 bg-salli-teal/10 px-4 py-2">
              <Text className="text-xs font-black uppercase tracking-[2px] text-salli-teal">Free</Text>
            </View>
          </View>

          <PremiumCard eyebrow="Live quarter meter" tone="teal">
            <Text className="text-base font-bold text-salli-muted">VAT payable this quarter</Text>
            <Text className="mt-3 text-6xl font-black tracking-tight text-salli-teal">
              {formatLkr(dashboard.vatPayable)}
            </Text>
            <View className="mt-5 rounded-3xl bg-slate-950 p-4">
              <Text className="text-sm font-bold text-salli-muted">
                {dashboard.daysLeftInQuarter} days left in this quarter. This number updates after every sale and confirmed supplier bill.
              </Text>
            </View>
            <Link href="/vat" className="mt-5 rounded-2xl bg-salli-teal px-5 py-4 text-center text-lg font-black text-slate-950">
              Open VAT meter
            </Link>
          </PremiumCard>

          <View className="grid gap-3 md:grid-cols-2">
            <MetricCard label="Output VAT" value={formatLkr(dashboard.outputVat)} tone="teal" />
            <MetricCard label="Input VAT" value={formatLkr(dashboard.inputVat)} tone="teal" />
            <MetricCard label="Today sales" value={formatLkr(dashboard.todaySales)} tone="amber" />
            <MetricCard label="Today cash" value={formatLkr(dashboard.todayCash)} tone="amber" />
            <MetricCard label="Credit outside" value={formatLkr(dashboard.creditOutstanding)} tone="rose" />
            <MetricCard label="Low stock" value={`${dashboard.lowStockCount} item`} tone="rose" />
          </View>

          <PremiumCard eyebrow="Counter actions" title="What do you want to do now?" tone="amber">
            <View className="gap-3 md:flex-row">
              <Link href="/sell" className="min-h-16 flex-1 rounded-2xl bg-salli-amber px-5 py-5 text-center text-xl font-black text-slate-950">
                New Sale
              </Link>
              <Link href="/bills" className="min-h-16 flex-1 rounded-2xl bg-salli-teal px-5 py-5 text-center text-xl font-black text-slate-950">
                Add Bill
              </Link>
            </View>
          </PremiumCard>

          <PremiumCard eyebrow="Status" tone="slate">
            <View className="gap-3">
              <StatusRow label="Sync" value="All caught up" tone="teal" />
              <StatusRow label="Offline mode" value="Ready" tone="teal" />
              <StatusRow label="Plan" value="Free plan active" tone="amber" />
            </View>
          </PremiumCard>
        </View>
      </AuthGate>
    </Screen>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  tone: "teal" | "amber" | "rose";
};

function MetricCard({ label, value, tone }: MetricCardProps) {
  const toneClass = {
    teal: "text-salli-teal",
    amber: "text-salli-amber",
    rose: "text-salli-rose",
  }[tone];

  return (
    <View className="rounded-3xl border border-slate-700/60 bg-salli-card p-5 shadow-lg shadow-black/20">
      <Text className="text-sm font-bold text-salli-muted">{label}</Text>
      <Text className={`mt-2 text-3xl font-black ${toneClass}`}>{value}</Text>
    </View>
  );
}

function StatusRow({ label, value, tone }: { label: string; value: string; tone: "teal" | "amber" }) {
  const toneClass = tone === "teal" ? "text-salli-teal" : "text-salli-amber";

  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-slate-950 px-4 py-3">
      <Text className="font-bold text-salli-muted">{label}</Text>
      <Text className={`font-black ${toneClass}`}>{value}</Text>
    </View>
  );
}
