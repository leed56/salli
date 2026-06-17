import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { FeatureGate } from "@/components/auth/FeatureGate";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Screen } from "@/components/ui/Screen";
import { listCustomers, recordPayment, type Customer } from "@/features/customers/customerRepository";
import { formatLkr } from "@/lib/currency";
import { useAppSession } from "@/stores/appSession";

export default function CreditScreen() {
  const { shopId } = useAppSession();
  const [customers, setCustomers] = useState<Customer[]>([]);
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
      const all = await listCustomers(shopId);
      setCustomers(all.filter((customer) => customer.balance > 0));
    } catch (loadError) {
      console.error("load credit failed", loadError);
      setError("Could not load credit book.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [shopId]);

  async function collect(customer: Customer) {
    if (!shopId) return;
    setBusyId(customer.id);
    setError(null);
    const { error: payError } = await recordPayment(shopId, customer.id, customer.balance);
    setBusyId(null);
    if (payError) {
      setError("Could not record payment.");
      return;
    }
    await load();
  }

  const outstanding = customers.reduce((sum, customer) => sum + customer.balance, 0);

  return (
    <Screen>
      <AuthGate>
        <FeatureGate feature="credit_book">
          <View className="gap-6">
            <View>
              <Text className="text-sm font-black uppercase tracking-[4px] text-salli-rose">Credit book</Text>
              <Text className="mt-2 text-4xl font-black text-salli-text">Who owes you</Text>
              <Text className="mt-3 text-base leading-7 text-salli-muted">
                Outstanding credit from credit sales. Record a payment when a customer settles up.
              </Text>
            </View>

            <PremiumCard eyebrow="Outstanding" title={formatLkr(outstanding)} description={`${customers.length} customer(s) with a balance.`} tone={outstanding > 0 ? "rose" : "teal"}>
              <Text className="text-base leading-6 text-salli-muted">Credit due updates after every credit sale and collection.</Text>
            </PremiumCard>

            {error ? <Text className="rounded-2xl bg-salli-rose/10 p-4 text-base font-bold text-salli-text">{error}</Text> : null}
            {isLoading ? <Text className="rounded-2xl bg-salli-card p-4 text-base font-bold text-salli-muted">Loading credit book...</Text> : null}

            <View className="gap-3">
              {!isLoading && customers.length === 0 ? (
                <Text className="rounded-2xl bg-salli-card p-4 text-base leading-6 text-salli-muted">
                  No outstanding credit. Credit sales will appear here.
                </Text>
              ) : null}

              {customers.map((customer) => (
                <PremiumCard key={customer.id} eyebrow={customer.phone ?? "Customer"} title={customer.name} description={`Owes ${formatLkr(customer.balance)}`} tone="rose">
                  <PremiumButton tone="teal" disabled={busyId === customer.id} onPress={() => collect(customer)}>
                    {busyId === customer.id ? "Recording..." : `Collect ${formatLkr(customer.balance)}`}
                  </PremiumButton>
                </PremiumCard>
              ))}
            </View>
          </View>
        </FeatureGate>
      </AuthGate>
    </Screen>
  );
}
