import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Screen } from "@/components/ui/Screen";
import { updateVatSettings } from "@/features/settings/tenantSettingsRepository";
import { useAppSession } from "@/stores/appSession";

export default function SettingsScreen() {
  const { shopId, vatEnabled, vatRate, plan, role, update } = useAppSession();
  const [enabled, setEnabled] = useState(vatEnabled);
  const [ratePct, setRatePct] = useState(String(Math.round(vatRate * 10000) / 100));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save() {
    if (!shopId) return;
    const pct = Number(ratePct);
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
      setMessage("Enter a VAT rate between 0 and 100.");
      return;
    }

    const nextRate = pct / 100;
    setIsSaving(true);
    setMessage(null);
    const { error } = await updateVatSettings(shopId, { vatEnabled: enabled, vatRate: nextRate });
    setIsSaving(false);

    if (error) {
      setMessage("Could not save settings.");
      return;
    }

    update({ vatEnabled: enabled, vatRate: nextRate });
    setMessage("Settings saved.");
  }

  return (
    <Screen>
      <AuthGate>
        <View className="gap-6">
          <View>
            <Text className="text-sm font-black uppercase tracking-[4px] text-salli-teal">Settings</Text>
            <Text className="mt-2 text-4xl font-black text-salli-text">Shop settings</Text>
            <Text className="mt-3 text-base leading-7 text-salli-muted">
              Control VAT for your shop. Turn VAT off if you are not VAT-registered.
            </Text>
          </View>

          <PremiumCard eyebrow="Tax" title="VAT" description="Apply VAT to sales, bills, and expenses at your rate." tone="amber">
            <View className="gap-3">
              <Pressable
                onPress={() => setEnabled((value) => !value)}
                className="min-h-14 flex-row items-center justify-between rounded-2xl bg-slate-950 px-4"
              >
                <Text className="text-base text-salli-text">VAT registered</Text>
                <View className={`h-7 w-12 justify-center rounded-full px-1 ${enabled ? "bg-salli-teal" : "bg-slate-700"}`}>
                  <View className={`h-5 w-5 rounded-full bg-white ${enabled ? "self-end" : "self-start"}`} />
                </View>
              </Pressable>

              {enabled ? (
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-salli-muted">VAT rate (%)</Text>
                  <TextInput
                    value={ratePct}
                    onChangeText={setRatePct}
                    keyboardType="decimal-pad"
                    placeholder="18"
                    placeholderTextColor="#64748B"
                    className="min-h-14 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
                  />
                </View>
              ) : (
                <Text className="rounded-2xl bg-slate-950/50 p-4 text-base leading-6 text-salli-muted">
                  VAT is off. Sales, bills, and expenses will not calculate VAT.
                </Text>
              )}

              <PremiumButton onPress={save} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save settings"}
              </PremiumButton>

              {message ? <Text className="text-base font-bold text-salli-muted">{message}</Text> : null}
            </View>
          </PremiumCard>

          <PremiumCard eyebrow="Plan" title="Subscription" description="Your current Salli plan and role." tone="slate">
            <View className="gap-3">
              <View className="flex-row items-center justify-between rounded-2xl bg-slate-950/50 p-4">
                <Text className="text-base font-bold text-salli-muted">Plan</Text>
                <Text className="text-base font-black text-salli-teal capitalize">{plan}</Text>
              </View>
              <View className="flex-row items-center justify-between rounded-2xl bg-slate-950/50 p-4">
                <Text className="text-base font-bold text-salli-muted">Role</Text>
                <Text className="text-base font-black text-salli-text capitalize">{role}</Text>
              </View>
            </View>
          </PremiumCard>
        </View>
      </AuthGate>
    </Screen>
  );
}
