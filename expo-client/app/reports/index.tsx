import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { FeatureGate } from "@/components/auth/FeatureGate";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Screen } from "@/components/ui/Screen";
import { fetchReport, type ReportData } from "@/features/reports/reportRepository";
import { formatLkr } from "@/lib/currency";
import { useAppSession } from "@/stores/appSession";

export default function ReportsScreen() {
  const { shopId } = useAppSession();
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!shopId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    fetchReport(shopId)
      .then((data) => {
        if (active) setReport(data);
      })
      .catch((loadError) => {
        console.error("load report failed", loadError);
        if (active) setError("Could not load reports.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [shopId]);

  return (
    <Screen>
      <AuthGate>
        <FeatureGate feature="reports">
          <View className="gap-6">
            <View>
              <Text className="text-sm font-black uppercase tracking-[4px] text-salli-teal">Reports</Text>
              <Text className="mt-2 text-4xl font-black text-salli-text">Owner report</Text>
              <Text className="mt-3 text-base leading-7 text-salli-muted">
                {report ? `Summary for ${report.periodLabel}.` : "Sales, VAT, profit, and credit for the current quarter."}
              </Text>
            </View>

            {error ? <Text className="rounded-2xl bg-salli-rose/10 p-4 text-base font-bold text-salli-text">{error}</Text> : null}
            {isLoading ? <Text className="rounded-2xl bg-salli-card p-4 text-base font-bold text-salli-muted">Loading report...</Text> : null}

            {report ? (
              <>
                <PremiumCard eyebrow="Sales" title={formatLkr(report.salesTotal)} description={`${report.salesCount} sales this quarter.`} tone="teal">
                  <View className="gap-3">
                    <Row label="Cash sales" value={formatLkr(report.cashSales)} />
                    <Row label="Credit sales" value={formatLkr(report.creditSales)} />
                    <Row label="Sales ex-VAT" value={formatLkr(report.salesSubtotal)} />
                  </View>
                </PremiumCard>

                <PremiumCard eyebrow="Profit" title={formatLkr(report.grossProfit)} description="Gross profit = sales ex-VAT minus cost of goods sold." tone={report.grossProfit >= 0 ? "teal" : "rose"}>
                  <View className="gap-3">
                    <Row label="Sales ex-VAT" value={formatLkr(report.salesSubtotal)} />
                    <Row label="Cost of goods sold" value={formatLkr(report.cogs)} />
                  </View>
                </PremiumCard>

                <PremiumCard eyebrow="VAT" title={formatLkr(report.netVat)} description="Estimated VAT payable this quarter." tone="amber">
                  <View className="gap-3">
                    <Row label="Output VAT (sales)" value={formatLkr(report.outputVat)} />
                    <Row label="Input VAT (bills)" value={formatLkr(report.inputVat)} />
                    <Row label="Expense VAT" value={formatLkr(report.expenseVat)} />
                  </View>
                </PremiumCard>

                <PremiumCard eyebrow="Costs & credit" title={formatLkr(report.expenseTotal)} description="Expenses this quarter." tone="slate">
                  <View className="gap-3">
                    <Row label="Purchases" value={formatLkr(report.purchaseTotal)} />
                    <Row label="Expenses" value={formatLkr(report.expenseTotal)} />
                    <Row label="Credit outstanding" value={formatLkr(report.creditOutstanding)} />
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-slate-950/50 p-4">
      <Text className="text-base font-bold text-salli-muted">{label}</Text>
      <Text className="text-base font-black text-salli-text">{value}</Text>
    </View>
  );
}
