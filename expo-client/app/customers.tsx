import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Screen } from "@/components/ui/Screen";
import { addCustomer, listCustomers, type Customer } from "@/features/customers/customerRepository";
import { formatLkr } from "@/lib/currency";
import { useAppSession } from "@/stores/appSession";

export default function CustomersScreen() {
  const { shopId } = useAppSession();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!shopId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      setCustomers(await listCustomers(shopId));
    } catch (loadError) {
      console.error("load customers failed", loadError);
      setError("Could not load customers.");
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
    const { error: addError } = await addCustomer(shopId, { name: name.trim(), phone: phone.trim() });
    if (addError) {
      setError("Could not save customer.");
      return;
    }
    setName("");
    setPhone("");
    await load();
  }

  const totalDue = customers.reduce((sum, customer) => sum + customer.balance, 0);

  return (
    <Screen>
      <AuthGate>
        <View className="gap-6">
          <View>
            <Text className="text-sm font-black uppercase tracking-[4px] text-salli-teal">Customers</Text>
            <Text className="mt-2 text-4xl font-black text-salli-text">Customers</Text>
            <Text className="mt-3 text-base leading-7 text-salli-muted">
              Keep customer names and phone numbers, and track who owes you on credit.
            </Text>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 rounded-[28px] bg-salli-card p-4">
              <Text className="text-xs font-black uppercase tracking-[3px] text-salli-muted">Customers</Text>
              <Text className="mt-2 text-3xl font-black text-salli-text">{customers.length}</Text>
            </View>
            <View className="flex-1 rounded-[28px] bg-salli-card p-4">
              <Text className="text-xs font-black uppercase tracking-[3px] text-salli-muted">Total due</Text>
              <Text className="mt-2 text-3xl font-black text-salli-rose">{formatLkr(totalDue)}</Text>
            </View>
          </View>

          <PremiumCard eyebrow="Add" title="New customer" description="Add a customer to bill on credit and track payments." tone="teal">
            <View className="gap-3">
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Customer name"
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
              <PremiumButton onPress={add}>Add customer</PremiumButton>
            </View>
          </PremiumCard>

          {error ? <Text className="rounded-2xl bg-salli-rose/10 p-4 text-base font-bold text-salli-text">{error}</Text> : null}
          {isLoading ? <Text className="rounded-2xl bg-salli-card p-4 text-base font-bold text-salli-muted">Loading customers...</Text> : null}

          <PremiumCard eyebrow="Directory" title="All customers" description={`${customers.length} customer(s).`} tone="slate">
            <View className="gap-3">
              {!isLoading && customers.length === 0 ? (
                <Text className="rounded-2xl bg-slate-950/50 p-4 text-base leading-6 text-salli-muted">
                  No customers yet. Add your first customer above.
                </Text>
              ) : null}

              {customers.map((customer) => (
                <View key={customer.id} className="flex-row justify-between gap-3 rounded-3xl bg-slate-950/50 p-5">
                  <View className="flex-1">
                    <Text className="text-xl font-black text-salli-text">{customer.name}</Text>
                    {customer.phone ? <Text className="mt-1 text-base text-salli-muted">{customer.phone}</Text> : null}
                  </View>
                  <View className="items-end">
                    <Text className={customer.balance > 0 ? "text-2xl font-black text-salli-rose" : "text-2xl font-black text-salli-teal"}>
                      {formatLkr(customer.balance)}
                    </Text>
                    <Text className="text-sm text-salli-muted">balance</Text>
                  </View>
                </View>
              ))}
            </View>
          </PremiumCard>
        </View>
      </AuthGate>
    </Screen>
  );
}
