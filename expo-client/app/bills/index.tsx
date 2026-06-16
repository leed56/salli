import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Screen } from "@/components/ui/Screen";
import type { BillDraft, BillFlowState } from "@/features/bills/billModel";
import { createBillDraftFromImage } from "@/features/bills/billRepository";
import { formatLkr } from "@/lib/currency";

const stateCopy: Record<BillFlowState, string> = {
  idle: "Ready to capture",
  camera: "Camera ready",
  upload: "Uploading image",
  scan: "Reading bill",
  review: "Draft ready",
  error: "Needs retry",
};

export default function BillsScreen() {
  const [flowState, setFlowState] = useState<BillFlowState>("idle");
  const [draft, setDraft] = useState<BillDraft | null>(null);

  async function handleDemoCapture() {
    setFlowState("upload");
    setFlowState("scan");
    const nextDraft = await createBillDraftFromImage();
    setDraft(nextDraft);
    setFlowState("review");
  }

  return (
    <Screen>
      <AuthGate>
        <View className="gap-5">
          <View>
            <Text className="text-sm font-black uppercase tracking-[4px] text-salli-teal">Supplier bills</Text>
            <Text className="mt-2 text-4xl font-black text-salli-text">Capture a bill</Text>
            <Text className="mt-3 text-base leading-7 text-salli-muted">
              Take a photo of a supplier invoice. Salli will prepare stock, purchase, and input VAT records for owner review.
            </Text>
          </View>

          <PremiumCard eyebrow="Step 1" title="Add supplier invoice" description="Photo capture is mocked for now. Vision extraction will run through a Supabase Edge Function later." tone="teal">
            <View className="rounded-[28px] border border-dashed border-salli-teal/40 bg-slate-950/50 p-6">
              <Text className="text-center text-6xl">📷</Text>
              <Text className="mt-4 text-center text-2xl font-black text-salli-text">Camera card</Text>
              <Text className="mt-2 text-center text-base leading-6 text-salli-muted">
                Keep the full invoice inside the frame. Avoid shadows and blurred item rows.
              </Text>
            </View>

            <View className="mt-5 rounded-3xl bg-slate-950/60 p-4">
              <Text className="text-xs font-black uppercase tracking-[3px] text-salli-muted">Status</Text>
              <Text className="mt-2 text-2xl font-black text-salli-text">{stateCopy[flowState]}</Text>
              <Text className="mt-2 text-base text-salli-muted">
                {flowState === "review" ? "Review the extracted draft before saving." : "Use demo scan to preview the paid workflow."}
              </Text>
            </View>

            <View className="mt-5 gap-3">
              <PremiumButton onPress={handleDemoCapture}>Scan demo bill</PremiumButton>
              <PremiumButton tone="dark" disabled>
                Upload image soon
              </PremiumButton>
            </View>
          </PremiumCard>

          {draft ? (
            <PremiumCard eyebrow="Draft" title={draft.supplier} description="Detected supplier bill ready for confirmation." tone="amber">
              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-base text-salli-muted">Confidence</Text>
                  <Text className="text-xl font-black text-salli-amber">{Math.round(draft.confidence * 100)}%</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-base text-salli-muted">Input VAT</Text>
                  <Text className="text-xl font-black text-salli-text">{formatLkr(draft.tax)}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-base text-salli-muted">Bill total</Text>
                  <Text className="text-2xl font-black text-salli-text">{formatLkr(draft.total)}</Text>
                </View>
              </View>

              <View className="mt-5 gap-3">
                {draft.lines.slice(0, 2).map((line) => (
                  <View key={line.id} className="rounded-2xl bg-slate-950/50 p-4">
                    <Text className="text-lg font-black text-salli-text">{line.name}</Text>
                    <Text className="mt-1 text-base text-salli-muted">
                      {line.qty} units • {formatLkr(line.lineTotal)}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="mt-5">
                <PremiumButton onPress={() => router.push({ pathname: "/bills/[id]/confirm", params: { id: draft.id } })}>
                  Review and confirm
                </PremiumButton>
              </View>
            </PremiumCard>
          ) : null}
        </View>
      </AuthGate>
    </Screen>
  );
}
