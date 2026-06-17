import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { FeatureGate } from "@/components/auth/FeatureGate";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Screen } from "@/components/ui/Screen";
import { fetchVatMeterSummary, type VatMeterSummary } from "@/features/vat/supabaseVatRepository";
import { formatLkr } from "@/lib/currency";
import { useAppSession } from "@/stores/appSession";

function formatDateLabel(value: string) {
  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString("en-LK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatUpdatedAt(value: string) {
  return new Date(value).toLocaleTimeString("en-LK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function VatScreen() {
  const { shopId, vatEnabled } = useAppSession();
  const [summary, setSummary] = useState<VatMeterSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadSummary() {
    if (!shopId || !vatEnabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextSummary = await fetchVatMeterSummary(shopId);
      setSummary(nextSummary);
    } catch (loadError) {
      console.error("load VAT failed", loadError);
      setError("Could not load VAT summary.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, [shopId, vatEnabled]);

  const confidenceLabel = summary && summary.purchaseCount > 0 ? "Good" : "Needs supplier bills";
  const confidenceCopy = summary && summary.purchaseCount > 0
    ? "Supplier bill input VAT is included in this quarter estimate."
    : "Scan supplier bills to improve the VAT payable estimate.";

  return (
    <Screen>
      <AuthGate>
        <FeatureGate feature="vat_return">
          <View className="gap-5">
            <View>
              <Text className="text-sm font-black uppercase tracking-[4px] text-salli-amber">VAT meter</Text>
              <Text className="mt-2 text-4xl font-black text-salli-text">VAT payable</Text>
              <Text className="mt-3 text-base leading-7 text-salli-muted">
                See VAT collected from sales, VAT paid on supplier bills, and the estimated amount payable this quarter.
              </Text>
            </View>

            {!vatEnabled ? (
              <PremiumCard eyebrow="VAT off" title="VAT is turned off" description="This shop is not VAT-registered." tone="slate">
                <Text className="text-base leading-6 text-salli-muted">
                  Sales, supplier bills, and expenses are recorded without VAT. Turn VAT on in Settings when you register.
                </Text>
              </PremiumCard>
            ) : null}

            {vatEnabled && error ? <Text className="rounded-2xl bg-salli-rose/10 p-4 text-base font-bold text-salli-text">{error}</Text> : null}
            {vatEnabled && isLoading ? <Text className="rounded-2xl bg-salli-card p-4 text-base font-bold text-salli-muted">Loading VAT...</Text> : null}

            {vatEnabled && summary ? (
              <>
                <PremiumCard eyebrow={summary.period.label} title={formatLkr(summary.netPayable)} description="Estimated VAT payable for the current quarter." tone={summary.netPayable > 0 ? "amber" : "teal"}>
                  <View className="gap-4">
                    <View className="flex-row items-center justify-between rounded-2xl bg-slate-950/50 p-4">
                      <Text className="text-base font-bold text-salli-muted">Quarter period</Text>
                      <Text className="text-base font-black text-salli-text">
                        {formatDateLabel(summary.period.start)} - {formatDateLabel(summary.period.end)}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between rounded-2xl bg-slate-950/50 p-4">
                      <Text className="text-base font-bold text-salli-muted">Days remaining</Text>
                      <Text className="text-2xl font-black text-salli-amber">{summary.period.daysRemaining}</Text>
                    </View>
                  </View>
                </PremiumCard>

                <View className="gap-3">
                  <PremiumCard eyebrow="Sales" title={formatLkr(summary.outputVat)} description={`${summary.salesCount} sales included.`} tone="teal">
                    <Text className="text-base leading-6 text-salli-muted">VAT collected from customers through sales.</Text>
                  </PremiumCard>

                  <PremiumCard eyebrow="Supplier bills" title={formatLkr(summary.inputVat)} description={`${summary.purchaseCount} confirmed supplier bills included.`} tone="amber">
                    <Text className="text-base leading-6 text-salli-muted">VAT paid on supplier bills. This reduces the amount payable.</Text>
                  </PremiumCard>

                  <PremiumCard eyebrow="Expenses" title={formatLkr(summary.expenseVat)} description="Claimable VAT from recorded expenses." tone="slate">
                    <Text className="text-base leading-6 text-salli-muted">VAT on VAT-claimable expenses. This also reduces the amount payable.</Text>
                  </PremiumCard>
                </View>

                <PremiumCard eyebrow="Confidence" title={confidenceLabel} description={confidenceCopy} tone={summary.purchaseCount > 0 ? "teal" : "rose"}>
                  <View className="gap-3">
                    <View className="flex-row items-center justify-between rounded-2xl bg-slate-950/50 p-4">
                      <Text className="text-base font-bold text-salli-muted">Data status</Text>
                      <Text className="text-base font-black text-salli-teal">Synced</Text>
                    </View>
                    <View className="flex-row items-center justify-between rounded-2xl bg-slate-950/50 p-4">
                      <Text className="text-base font-bold text-salli-muted">Updated</Text>
                      <Text className="text-base font-black text-salli-text">{formatUpdatedAt(summary.lastUpdatedAt)}</Text>
                    </View>
                  </View>
                </PremiumCard>

                <PremiumCard eyebrow="Exports" title="Owner reports" description="Exports are disabled until the VAT review flow and synced records are production-ready." tone="slate">
                  <View className="gap-3">
                    <PremiumButton tone="dark" disabled>Export PDF soon</PremiumButton>
                    <PremiumButton tone="dark" disabled>Export CSV soon</PremiumButton>
                    <PremiumButton tone="dark" disabled>Prepare VAT return soon</PremiumButton>
                  </View>
                </PremiumCard>
              </>
            ) : null}
          </View>
        </FeatureGate>
      </AuthGate>
    </Screen>
  );
}
