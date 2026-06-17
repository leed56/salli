import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { FeatureGate } from "@/components/auth/FeatureGate";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Screen } from "@/components/ui/Screen";
import { addSupplier, listSuppliers, recordSupplierPayment, type Supplier } from "@/features/suppliers/supplierRepository";
import { formatLkr } from "@/lib/currency";
import { useAppSession } from "@/stores/appSession";

export default function SuppliersScreen() {
  const { shopId } = useAppSession();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!shopId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      setSuppliers(await listSuppliers(shopId));
    } catch (loadError) {
      console.error("load suppliers failed", loadError);
      setError("Could not load suppliers.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [shopId]);

  async function add() {
    if (!shopId || !name.trim()) return;
    setError(null);
    const { error: addError } = await addSupplier(shopId, { name: name.trim(), phone: phone.trim() });
    if (addError) {
      setError("Could not save supplier.");
      return;
    }
    setName("");
    setPhone("");
    await load();
  }

  async function pay(supplier: Supplier) {
    if (!shopId) return;
    setBusyId(supplier.id);
    setError(null);
    const { error: payError } = await recordSupplierPayment(shopId, supplier.id, supplier.balance);
    setBusyId(null);
    if (payError) {
      setError("Could not record payment.");
      return;
    }
    await load();
  }

  const totalOwed = suppliers.reduce((sum, supplier) => sum + supplier.balance, 0);

  return (
    <Screen>
      <AuthGate>
        <FeatureGate feature="supplier_ledger">
          <View className="gap-6">
            <View>
              <Text className="text-sm font-black uppercase tracking-[4px] text-salli-teal">Suppliers</Text>
              <Text className="mt-2 text-4xl font-black text-salli-text">Supplier ledger</Text>
              <Text className="mt-3 text-base leading-7 text-salli-muted">
                Track suppliers and what you owe them on credit bills. Record payments as you settle.
              </Text>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1 rounded-[28px] bg-salli-card p-4">
                <Text className="text-xs font-black uppercase tracking-[3px] text-salli-muted">Suppliers</Text>
                <Text className="mt-2 text-3xl font-black text-salli-text">{suppliers.length}</Text>
              </View>
              <View className="flex-1 rounded-[28px] bg-salli-card p-4">
                <Text className="text-xs font-black uppercase tracking-[3px] text-salli-muted">You owe</Text>
                <Text className="mt-2 text-2xl font-black text-salli-rose">{formatLkr(totalOwed)}</Text>
              </View>
            </View>

            <PremiumCard eyebrow="Add" title="New supplier" description="Add a supplier so you can link bills and track credit." tone="teal">
              <View className="gap-3">
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Supplier name"
                  placeholderTextColor="#64748B"
                  className="min-h-14 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
                />
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="Phone optional"
                  placeholderTextColor="#64748B"
                  className="min-h-14 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
                />
                <PremiumButton onPress={add}>Add supplier</PremiumButton>
              </View>
            </PremiumCard>

            {error ? <Text className="rounded-2xl bg-salli-rose/10 p-4 text-base font-bold text-salli-text">{error}</Text> : null}
            {isLoading ? <Text className="rounded-2xl bg-salli-card p-4 text-base font-bold text-salli-muted">Loading suppliers...</Text> : null}

            <PremiumCard eyebrow="Directory" title="All suppliers" description={`${suppliers.length} supplier(s).`} tone="slate">
              <View className="gap-3">
                {!isLoading && suppliers.length === 0 ? (
                  <Text className="rounded-2xl bg-slate-950/50 p-4 text-base leading-6 text-salli-muted">
                    No suppliers yet. Add your first supplier above.
                  </Text>
                ) : null}

                {suppliers.map((supplier) => (
                  <View key={supplier.id} className="gap-3 rounded-3xl bg-slate-950/50 p-5">
                    <View className="flex-row justify-between gap-3">
                      <View className="flex-1">
                        <Text className="text-xl font-black text-salli-text">{supplier.name}</Text>
                        {supplier.phone ? <Text className="mt-1 text-base text-salli-muted">{supplier.phone}</Text> : null}
                      </View>
                      <View className="items-end">
                        <Text className={supplier.balance > 0 ? "text-2xl font-black text-salli-rose" : "text-2xl font-black text-salli-teal"}>
                          {formatLkr(supplier.balance)}
                        </Text>
                        <Text className="text-sm text-salli-muted">owed</Text>
                      </View>
                    </View>
                    {supplier.balance > 0 ? (
                      <PremiumButton tone="teal" disabled={busyId === supplier.id} onPress={() => pay(supplier)}>
                        {busyId === supplier.id ? "Recording..." : `Pay ${formatLkr(supplier.balance)}`}
                      </PremiumButton>
                    ) : null}
                  </View>
                ))}
              </View>
            </PremiumCard>
          </View>
        </FeatureGate>
      </AuthGate>
    </Screen>
  );
}
