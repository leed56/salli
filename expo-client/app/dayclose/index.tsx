import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { FeatureGate } from "@/components/auth/FeatureGate";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Screen } from "@/components/ui/Screen";
import { fetchTodaySummary, recordDayClose, type DaySummary } from "@/features/dayclose/dayCloseRepository";
import { formatLkr } from "@/lib/currency";
import { useAppSession } from "@/stores/appSession";

export default function DayCloseScreen() {
  const { shopId } = useAppSession();
  const [summary, setSummary] = useState<DaySummary | null>(null);
  const [counted, setCounted] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [variance, setVariance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!shopId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      setSummary(await fetchTodaySummary(shopId));
    } catch (loadError) {
      console.error("load day summary failed", loadError);
      setError("Could not load today's summary.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [shopId]);

  async function closeDay() {
    const countedValue = Number(counted);
    if (!shopId || !summary || !Number.isFinite(countedValue)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const { error: closeError, data } = await recordDayClose(shopId, {
      expectedCash: summary.cashTotal,
      countedCash: countedValue,
    });
    setIsSubmitting(false);

    if (closeError || !data) {
      setError("Could not close the day.");
      return;
    }

    setVariance(data.variance);
  }

  return (
    <Screen>
      <AuthGate>
        <FeatureGate feature="day_close">
          <View className="gap-6">
            <View>
              <Text className="text-sm font-black uppercase tracking-[4px] text-salli-teal">Day close</Text>
              <Text className="mt-2 text-4xl font-black text-salli-text">Close the day</Text>
              <Text className="mt-3 text-base leading-7 text-salli-muted">
                Compare today's cash sales with the cash in your drawer and record any difference.
              </Text>
            </View>

            {error ? <Text className="rounded-2xl bg-salli-rose/10 p-4 text-base font-bold text-salli-text">{error}</Text> : null}
            {isLoading ? <Text className="rounded-2xl bg-salli-card p-4 text-base font-bold text-salli-muted">Loading today...</Text> : null}

            {summary ? (
              <>
                <View className="flex-row gap-3">
                  <View className="flex-1 rounded-[28px] bg-salli-card p-4">
                    <Text className="text-xs font-black uppercase tracking-[3px] text-salli-muted">Sales today</Text>
                    <Text className="mt-2 text-3xl font-black text-salli-text">{summary.salesCount}</Text>
                  </View>
                  <View className="flex-1 rounded-[28px] bg-salli-card p-4">
                    <Text className="text-xs font-black uppercase tracking-[3px] text-salli-muted">Total</Text>
                    <Text className="mt-2 text-2xl font-black text-salli-teal">{formatLkr(summary.total)}</Text>
                  </View>
                </View>

                <PremiumCard eyebrow="Today" title="Cash and credit" description="Cash sales should match the cash in your drawer." tone="teal">
                  <View className="gap-3">
                    <Row label="Cash sales" value={formatLkr(summary.cashTotal)} />
                    <Row label="Credit sales" value={formatLkr(summary.creditTotal)} />
                    <Row label="Expected cash" value={formatLkr(summary.cashTotal)} strong />
                  </View>
                </PremiumCard>

                <PremiumCard eyebrow="Count" title="Cash in drawer" description="Enter the cash you counted, then close the day." tone="amber">
                  <View className="gap-3">
                    <TextInput
                      value={counted}
                      onChangeText={setCounted}
                      keyboardType="decimal-pad"
                      placeholder="Counted cash"
                      placeholderTextColor="#64748B"
                      className="min-h-14 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
                    />
                    <PremiumButton onPress={closeDay} disabled={isSubmitting || !counted}>
                      {isSubmitting ? "Closing..." : "Close day"}
                    </PremiumButton>
                  </View>
                </PremiumCard>

                {variance !== null ? (
                  <PremiumCard
                    eyebrow="Result"
                    title={variance === 0 ? "Balanced" : variance > 0 ? `Over by ${formatLkr(variance)}` : `Short by ${formatLkr(Math.abs(variance))}`}
                    description="Day close recorded in the cash drawer log."
                    tone={variance === 0 ? "teal" : "rose"}
                  >
                    <Text className="text-base leading-6 text-salli-muted">
                      Expected {formatLkr(summary.cashTotal)} - counted {formatLkr(Number(counted))}.
                    </Text>
                  </PremiumCard>
                ) : null}
              </>
            ) : null}
          </View>
        </FeatureGate>
      </AuthGate>
    </Screen>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-slate-950/50 p-4">
      <Text className={strong ? "text-base font-black text-salli-text" : "text-base font-bold text-salli-muted"}>{label}</Text>
      <Text className={strong ? "text-lg font-black text-salli-teal" : "text-base font-black text-salli-text"}>{value}</Text>
    </View>
  );
}
