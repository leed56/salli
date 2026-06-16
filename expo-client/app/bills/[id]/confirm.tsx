import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Screen } from "@/components/ui/Screen";
import type { BillDraft } from "@/features/bills/billModel";
import { confirmBillDraft, getBillDraftById } from "@/features/bills/billRepository";
import { formatLkr } from "@/lib/currency";
import { useAppSession } from "@/stores/appSession";

type StockChange = {
  productId: string;
  name: string;
  qtyAdded: number;
};

export default function BillConfirmScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { shopId } = useAppSession();
  const [draft, setDraft] = useState<BillDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPurchaseId, setSavedPurchaseId] = useState<string | null>(null);
  const [stockChanges, setStockChanges] = useState<StockChange[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDraft() {
      if (!id) {
        return;
      }

      const nextDraft = await getBillDraftById(id);
      setDraft(nextDraft);
    }

    loadDraft();
  }, [id]);

  async function handleConfirm() {
    if (!draft || !shopId) {
      setSaveError("Shop setup is required before saving bills.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const result = await confirmBillDraft(draft, shopId);
      setSavedPurchaseId(result.purchaseId);
      setStockChanges(result.stockChanges);
    } catch (error) {
      console.error("save bill failed", error);
      setSaveError("Could not save this bill. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Screen>
      <AuthGate>
        <View className="gap-5">
          <View>
            <Text className="text-sm font-black uppercase tracking-[4px] text-salli-amber">Owner review</Text>
            <Text className="mt-2 text-4xl font-black text-salli-text">Confirm bill</Text>
            <Text className="mt-3 text-base leading-7 text-salli-muted">
              Review supplier, totals, stock rows, and input VAT before this purchase is recorded.
            </Text>
          </View>

          {!draft ? (
            <PremiumCard title="Draft not found" description="Go back and scan the demo supplier bill again." tone="rose">
              <PremiumButton tone="dark" onPress={() => router.back()}>
                Back
              </PremiumButton>
            </PremiumCard>
          ) : (
            <>
              <PremiumCard eyebrow="Supplier" title={draft.supplier} description="Editable supplier fields will be added after persistence is connected." tone="teal">
                <View className="gap-3">
                  <View className="rounded-2xl bg-slate-950/50 p-4">
                    <Text className="text-xs font-black uppercase tracking-[3px] text-salli-muted">Invoice status</Text>
                    <Text className="mt-2 text-2xl font-black text-salli-text">Ready for owner check</Text>
                  </View>
                  <View className="rounded-2xl bg-slate-950/50 p-4">
                    <Text className="text-xs font-black uppercase tracking-[3px] text-salli-muted">Confidence</Text>
                    <Text className="mt-2 text-3xl font-black text-salli-amber">{Math.round(draft.confidence * 100)}%</Text>
                  </View>
                </View>
              </PremiumCard>

              <PremiumCard eyebrow="Detected items" title={`${draft.lines.length} stock rows`} description="Each confirmed line increases local stock immediately." tone="slate">
                <View className="gap-3">
                  {draft.lines.map((line) => (
                    <View key={line.id} className="rounded-2xl bg-slate-950/50 p-4">
                      <Text className="text-lg font-black text-salli-text">{line.name}</Text>
                      <Text className="mt-1 text-base text-salli-muted">
                        Qty {line.qty} • Unit {formatLkr(line.unitCost)}
                      </Text>
                      <View className="mt-3 flex-row items-center justify-between">
                        <Text className="text-base text-salli-muted">Input VAT</Text>
                        <Text className="text-lg font-black text-salli-text">{formatLkr(line.tax)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </PremiumCard>

              <PremiumCard eyebrow="VAT impact" title="Input VAT update" description="This will reduce the VAT payable meter after the purchase is saved." tone="amber">
                <View className="gap-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base text-salli-muted">Subtotal</Text>
                    <Text className="text-xl font-black text-salli-text">{formatLkr(draft.subtotal)}</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base text-salli-muted">Input VAT</Text>
                    <Text className="text-xl font-black text-salli-amber">{formatLkr(draft.tax)}</Text>
                  </View>
                  <View className="flex-row items-center justify-between border-t border-slate-700 pt-3">
                    <Text className="text-base text-salli-muted">Total</Text>
                    <Text className="text-2xl font-black text-salli-text">{formatLkr(draft.total)}</Text>
                  </View>
                </View>
              </PremiumCard>

              {draft.warnings.length ? (
                <PremiumCard eyebrow="Checks" title="Warnings" tone="rose">
                  <View className="gap-3">
                    {draft.warnings.map((warning) => (
                      <Text key={warning} className="rounded-2xl bg-salli-rose/10 p-4 text-base font-bold text-salli-text">
                        {warning}
                      </Text>
                    ))}
                  </View>
                </PremiumCard>
              ) : null}

              <PremiumCard title={savedPurchaseId ? "Saved offline" : "Confirm purchase"} description={savedPurchaseId ? "Purchase, stock, input VAT, and sync queue were updated locally." : "Save the bill locally first, then sync it when the shop is online."} tone={savedPurchaseId ? "teal" : "slate"}>
                <View className="gap-3">
                  {saveError ? <Text className="rounded-2xl bg-salli-rose/10 p-4 text-base font-bold text-salli-text">{saveError}</Text> : null}
                  {savedPurchaseId ? (
                    <View className="rounded-2xl bg-salli-teal/10 p-4">
                      <Text className="text-base font-bold text-salli-text">Ready for sync • {savedPurchaseId}</Text>
                      <Text className="mt-2 text-sm font-bold text-salli-teal">{stockChanges.length} stock rows applied</Text>
                    </View>
                  ) : null}
                  {stockChanges.map((change) => (
                    <View key={change.productId} className="flex-row items-center justify-between rounded-2xl bg-slate-950/50 p-4">
                      <Text className="flex-1 text-base font-bold text-salli-text">{change.name}</Text>
                      <Text className="text-lg font-black text-salli-teal">+{change.qtyAdded}</Text>
                    </View>
                  ))}
                  <PremiumButton onPress={handleConfirm} disabled={isSaving || Boolean(savedPurchaseId)}>
                    {isSaving ? "Saving..." : savedPurchaseId ? "Bill saved" : "Confirm bill"}
                  </PremiumButton>
                  <PremiumButton tone="dark" onPress={() => router.push("/stock")}>View stock</PremiumButton>
                  <PremiumButton tone="dark" onPress={() => router.push("/")}>Back to home</PremiumButton>
                </View>
              </PremiumCard>
            </>
          )}
        </View>
      </AuthGate>
    </Screen>
  );
}
