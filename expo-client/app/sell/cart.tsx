import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { Screen } from "@/components/ui/Screen";
import { formatLkr } from "@/lib/currency";
import { useCartStore } from "@/stores/cartStore";

export default function CartScreen() {
  const { items, totals, clear } = useCartStore();

  function completeCheckout(method: "cash" | "credit") {
    console.log("Checkout selected", { method, items, totals });
    clear();
    router.replace("/");
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

          <View className="gap-3">
            <Pressable
              disabled={items.length === 0}
              onPress={() => completeCheckout("cash")}
              className="min-h-14 items-center justify-center rounded-2xl bg-salli-amber px-5"
            >
              <Text className="text-lg font-bold text-slate-950">Complete cash sale</Text>
            </Pressable>

            <Pressable
              disabled={items.length === 0}
              onPress={() => completeCheckout("credit")}
              className="min-h-14 items-center justify-center rounded-2xl bg-salli-rose px-5"
            >
              <Text className="text-lg font-bold text-slate-950">Complete credit sale</Text>
            </Pressable>
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
