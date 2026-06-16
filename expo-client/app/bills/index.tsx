import { useState } from "react";
import { router } from "expo-router";
import { Text, TextInput, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Screen } from "@/components/ui/Screen";
import {
  computePurchaseTotals,
  createPurchase,
  type PurchaseLineInput,
} from "@/features/bills/supabasePurchaseRepository";
import { formatLkr } from "@/lib/currency";
import { useAppSession } from "@/stores/appSession";

export default function SupplierBillsScreen() {
  const { shopId } = useAppSession();
  const [supplier, setSupplier] = useState("");
  const [name, setName] = useState("");
  const [qty, setQty] = useState("1");
  const [cost, setCost] = useState("");
  const [lines, setLines] = useState<PurchaseLineInput[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const totals = computePurchaseTotals(lines);

  function addLine() {
    const qtyValue = Number(qty);
    const costValue = Number(cost);
    if (!name.trim() || !Number.isFinite(qtyValue) || qtyValue <= 0 || !Number.isFinite(costValue)) {
      return;
    }

    setLines((current) => [...current, { name: name.trim(), qty: qtyValue, unitCost: costValue }]);
    setName("");
    setQty("1");
    setCost("");
  }

  async function confirmBill() {
    if (!shopId || lines.length === 0) {
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const { error } = await createPurchase(shopId, { supplierName: supplier.trim(), lines });

    setIsSubmitting(false);

    if (error) {
      setMessage("Could not save supplier bill. Please try again.");
      return;
    }

    setLines([]);
    setSupplier("");
    router.replace("/vat");
  }

  return (
    <Screen>
      <AuthGate>
        <View className="gap-6">
          <View>
            <Text className="text-sm font-black uppercase tracking-[4px] text-salli-teal">Supplier bills</Text>
            <Text className="mt-2 text-4xl font-black text-salli-text">Add supplier bill</Text>
            <Text className="mt-3 text-base leading-7 text-salli-muted">
              Record what you bought. Input VAT from confirmed bills reduces the VAT you owe.
            </Text>
          </View>

          <PremiumCard eyebrow="Supplier" title="Bill details" description="Add the supplier and each line on the bill." tone="teal">
            <View className="gap-3">
              <TextInput
                value={supplier}
                onChangeText={setSupplier}
                placeholder="Supplier name"
                placeholderTextColor="#64748B"
                className="min-h-14 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
              />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Item name"
                placeholderTextColor="#64748B"
                className="min-h-14 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
              />
              <View className="flex-row gap-3">
                <TextInput
                  value={qty}
                  onChangeText={setQty}
                  keyboardType="decimal-pad"
                  placeholder="Qty"
                  placeholderTextColor="#64748B"
                  className="min-h-14 flex-1 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
                />
                <TextInput
                  value={cost}
                  onChangeText={setCost}
                  keyboardType="decimal-pad"
                  placeholder="Unit cost"
                  placeholderTextColor="#64748B"
                  className="min-h-14 flex-1 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
                />
              </View>
              <PremiumButton tone="dark" onPress={addLine}>Add line</PremiumButton>
            </View>
          </PremiumCard>

          <PremiumCard eyebrow="Bill" title="Lines" description={`${lines.length} line(s) on this bill.`} tone="slate">
            <View className="gap-3">
              {lines.length === 0 ? (
                <Text className="rounded-2xl bg-slate-950/50 p-4 text-base leading-6 text-salli-muted">
                  No lines yet. Add the items from the supplier bill above.
                </Text>
              ) : (
                lines.map((line, index) => (
                  <View key={`${line.name}-${index}`} className="flex-row justify-between gap-3 rounded-2xl bg-slate-950/50 p-4">
                    <Text className="flex-1 text-base text-salli-text">
                      {line.qty} x {line.name}
                    </Text>
                    <Text className="font-bold text-salli-text">{formatLkr(line.unitCost * line.qty)}</Text>
                  </View>
                ))
              )}

              <View className="mt-2 border-t border-slate-700 pt-4">
                <Row label="Subtotal" value={formatLkr(totals.subtotal)} />
                <Row label="Input VAT" value={formatLkr(totals.vatAmount)} amber />
                <Row label="Bill total" value={formatLkr(totals.total)} strong />
              </View>

              <PremiumButton onPress={confirmBill} disabled={isSubmitting || lines.length === 0}>
                {isSubmitting ? "Saving..." : "Confirm supplier bill"}
              </PremiumButton>

              {message ? <Text className="text-base font-bold text-salli-rose">{message}</Text> : null}
            </View>
          </PremiumCard>
        </View>
      </AuthGate>
    </Screen>
  );
}

function Row({ label, value, strong = false, amber = false }: { label: string; value: string; strong?: boolean; amber?: boolean }) {
  return (
    <View className="flex-row justify-between py-1">
      <Text className={strong ? "text-lg font-bold text-salli-text" : "text-base text-salli-muted"}>{label}</Text>
      <Text
        className={
          strong
            ? "text-lg font-bold text-salli-teal"
            : amber
              ? "text-base font-bold text-salli-amber"
              : "text-base text-salli-text"
        }
      >
        {value}
      </Text>
    </View>
  );
}
