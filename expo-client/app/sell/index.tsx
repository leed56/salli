import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { Screen } from "@/components/ui/Screen";
import { formatLkr } from "@/lib/currency";
import { useCartStore } from "@/stores/cartStore";

const demoProducts = [
  { id: "demo-rice", name: "Rice 5kg", price: 1850, vat: 0 },
  { id: "demo-milk", name: "Milk powder", price: 1240, vat: 189.15 },
  { id: "demo-soap", name: "Soap", price: 180, vat: 27.46 },
];

export default function SellScreen() {
  const { items, totals, addItem, removeItem } = useCartStore();

  return (
    <Screen>
      <AuthGate>
        <View className="gap-6">
          <View>
            <Text className="text-sm font-semibold uppercase tracking-[3px] text-salli-amber">
              New Sale
            </Text>
            <Text className="mt-2 text-4xl font-black text-salli-text">
              Tap items to bill fast
            </Text>
          </View>

          <View className="gap-3">
            {demoProducts.map((product) => (
              <Pressable
                key={product.id}
                onPress={() =>
                  addItem({
                    productId: product.id,
                    name: product.name,
                    qty: 1,
                    unitPrice: product.price,
                    vatAmount: product.vat,
                    lineTotal: product.price,
                  })
                }
                className="min-h-16 rounded-3xl bg-salli-card p-5"
              >
                <Text className="text-xl font-bold text-salli-text">{product.name}</Text>
                <Text className="mt-1 text-base text-salli-muted">{formatLkr(product.price)}</Text>
              </Pressable>
            ))}
          </View>

          <View className="rounded-[32px] bg-salli-card p-5">
            <Text className="text-xl font-bold text-salli-text">Cart</Text>
            <View className="mt-4 gap-3">
              {items.length === 0 ? (
                <Text className="text-base text-salli-muted">No items added yet.</Text>
              ) : (
                items.map((item) => (
                  <Pressable key={item.productId} onPress={() => removeItem(item.productId)}>
                    <View className="flex-row justify-between gap-3">
                      <Text className="flex-1 text-base text-salli-text">
                        {item.qty} x {item.name}
                      </Text>
                      <Text className="font-bold text-salli-text">{formatLkr(item.lineTotal)}</Text>
                    </View>
                  </Pressable>
                ))
              )}
            </View>

            <View className="mt-5 border-t border-slate-700 pt-4">
              <Row label="Subtotal" value={formatLkr(totals.subtotal)} />
              <Row label="VAT" value={formatLkr(totals.vatAmount)} />
              <Row label="Total" value={formatLkr(totals.total)} strong />
            </View>

            <Link href="/sell/cart" className="mt-5 min-h-14 rounded-2xl bg-salli-amber px-5 py-4 text-center text-lg font-bold text-slate-950">
              Review checkout
            </Link>
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
