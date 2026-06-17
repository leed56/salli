import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { Screen } from "@/components/ui/Screen";
import { createSale } from "@/features/sales/saleRepository";
import { listCustomers, type Customer } from "@/features/customers/customerRepository";
import { formatLkr } from "@/lib/currency";
import { useAppSession } from "@/stores/appSession";
import { useCartStore } from "@/stores/cartStore";

export default function CartScreen() {
  const { shopId } = useAppSession();
  const { items, totals, clear } = useCartStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!shopId) return;
    listCustomers(shopId)
      .then((next) => {
        if (active) setCustomers(next);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [shopId]);

  async function completeCheckout(method: "cash" | "credit") {
    if (!shopId || items.length === 0) {
      return;
    }

    if (method === "credit" && !customerId) {
      setMessage("Select a customer for a credit sale.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const { error } = await createSale(shopId, {
      paymentType: method,
      items,
      customerId: method === "credit" ? customerId : null,
    });

    setIsSubmitting(false);

    if (error) {
      setMessage("Could not complete sale. Please try again.");
      return;
    }

    clear();
    router.replace("/vat");
  }

  return (
    <Screen>
      <AuthGate>
        <View className="gap-6">
          <View>
            <Text className="text-sm font-semibold uppercase tracking-[3px] text-salli-amber">
              Checkout
            </Text>
            <Text className="mt-2 text-4xl font-black text-salli-text">
              Review and finish sale
            </Text>
          </View>

          <View className="rounded-[32px] bg-salli-card p-5">
            <Text className="text-xl font-bold text-salli-text">Items</Text>
            <View className="mt-4 gap-3">
              {items.length === 0 ? (
                <Text className="text-base text-salli-muted">Cart is empty. Go back and add items.</Text>
              ) : (
                items.map((item) => (
                  <View key={item.productId} className="flex-row justify-between gap-3">
                    <Text className="flex-1 text-base text-salli-text">
                      {item.qty} x {item.name}
                    </Text>
                    <Text className="font-bold text-salli-text">{formatLkr(item.lineTotal)}</Text>
                  </View>
                ))
              )}
            </View>
          </View>

          <View className="rounded-[32px] bg-salli-card p-5">
            <Row label="Subtotal" value={formatLkr(totals.subtotal)} />
            <Row label="VAT" value={formatLkr(totals.vatAmount)} />
            <Row label="Total" value={formatLkr(totals.total)} strong />
          </View>

          <View className="rounded-[32px] bg-salli-card p-5">
            <Text className="text-base font-bold text-salli-text">Bill to (for credit sale)</Text>
            <View className="mt-3 gap-2">
              {customers.length === 0 ? (
                <Text className="text-base text-salli-muted">No customers yet. Add one in Customers to sell on credit.</Text>
              ) : (
                customers.map((customer) => {
                  const selected = customer.id === customerId;
                  return (
                    <Pressable
                      key={customer.id}
                      onPress={() => setCustomerId(selected ? null : customer.id)}
                      className={`min-h-12 justify-center rounded-2xl px-4 py-3 ${selected ? "bg-salli-teal" : "bg-slate-950"}`}
                    >
                      <Text className={selected ? "text-base font-bold text-slate-950" : "text-base text-salli-text"}>
                        {customer.name}
                      </Text>
                    </Pressable>
                  );
                })
              )}
            </View>
          </View>

          <View className="gap-3">
            <Pressable
              disabled={items.length === 0 || isSubmitting}
              onPress={() => completeCheckout("cash")}
              className="min-h-14 items-center justify-center rounded-2xl bg-salli-amber px-5"
            >
              <Text className="text-lg font-bold text-slate-950">
                {isSubmitting ? "Saving..." : "Complete cash sale"}
              </Text>
            </Pressable>

            <Pressable
              disabled={items.length === 0 || isSubmitting}
              onPress={() => completeCheckout("credit")}
              className="min-h-14 items-center justify-center rounded-2xl bg-salli-rose px-5"
            >
              <Text className="text-lg font-bold text-slate-950">
                {isSubmitting ? "Saving..." : "Complete credit sale"}
              </Text>
            </Pressable>

            {message ? <Text className="text-base font-bold text-salli-rose">{message}</Text> : null}
          </View>
        </View>
      </AuthGate>
    </Screen>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <View className="flex-row justify-between py-1">
      <Text className={strong ? "text-lg font-bold text-salli-text" : "text-base text-salli-muted"}>{label}</Text>
      <Text className={strong ? "text-lg font-bold text-salli-amber" : "text-base text-salli-text"}>{value}</Text>
    </View>
  );
}
