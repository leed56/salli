import { Link } from "expo-router";
import { Text, View } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { formatLkr } from "@/lib/currency";

const dashboard = {
  vatPayable: 0,
  outputVat: 0,
  inputVat: 0,
  todaySales: 0,
  todayCash: 0,
  creditOutstanding: 0,
};

export default function HomeScreen() {
  return (
    <Screen>
      <View className="gap-6">
        <View>
          <Text className="text-sm font-semibold uppercase tracking-[3px] text-salli-muted">
            Salli
          </Text>
          <Text className="mt-2 text-3xl font-bold text-salli-text">
            Today&apos;s shop command center
          </Text>
        </View>

        <View className="rounded-[32px] border border-salli-teal/20 bg-salli-card p-6">
          <Text className="text-sm font-semibold uppercase tracking-[2px] text-salli-teal">
            VAT payable this quarter
          </Text>
          <Text className="mt-4 text-5xl font-black text-salli-teal">
            {formatLkr(dashboard.vatPayable)}
          </Text>
          <Text className="mt-3 text-base text-salli-muted">
            Ready-to-file figure will update with every confirmed sale and supplier invoice.
          </Text>
        </View>

        <View className="grid gap-3 md:grid-cols-2">
          <MetricCard label="Output VAT" value={formatLkr(dashboard.outputVat)} tone="teal" />
          <MetricCard label="Input VAT" value={formatLkr(dashboard.inputVat)} tone="teal" />
          <MetricCard label="Today sales" value={formatLkr(dashboard.todaySales)} tone="amber" />
          <MetricCard label="Today cash" value={formatLkr(dashboard.todayCash)} tone="amber" />
          <MetricCard label="Credit outstanding" value={formatLkr(dashboard.creditOutstanding)} tone="rose" />
          <MetricCard label="Sync" value="All caught up" tone="teal" />
        </View>

        <View className="gap-3 md:flex-row">
          <Link href="/sell" className="min-h-14 flex-1 rounded-2xl bg-salli-amber px-5 py-4 text-center text-lg font-bold text-slate-950">
            New Sale
          </Link>
          <Link href="/bills" className="min-h-14 flex-1 rounded-2xl bg-salli-teal px-5 py-4 text-center text-lg font-bold text-slate-950">
            Add Bill
          </Link>
        </View>
      </View>
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
    <View className="rounded-3xl bg-salli-card p-5">
      <Text className="text-sm text-salli-muted">{label}</Text>
      <Text className={`mt-2 text-2xl font-bold ${toneClass}`}>{value}</Text>
    </View>
  );
}
