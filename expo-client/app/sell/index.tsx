import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { Screen } from "@/components/ui/Screen";
import { listProducts } from "@/features/products/productRepository";
import { buildCartItem } from "@/features/sales/saleRepository";
import type { Product } from "@/features/products/types";
import { formatLkr } from "@/lib/currency";
import { useAppSession } from "@/stores/appSession";
import { useCartStore } from "@/stores/cartStore";

export default function SellScreen() {
  const { shopId } = useAppSession();
  const { items, totals, addItem, removeItem } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!shopId) {
      setIsLoading(false);
      return;
    }
    listProducts(shopId)
      .then((next) => {
        if (active) setProducts(next);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [shopId]);

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
            {isLoading ? (
              <Text className="rounded-3xl bg-salli-card p-5 text-base text-salli-muted">Loading products...</Text>
            ) : products.length === 0 ? (
              <Text className="rounded-3xl bg-salli-card p-5 text-base text-salli-muted">
                No products yet. Add products in Stock first.
              </Text>
            ) : (
              products.map((product) => (
                <Pressable
                  key={product.id}
                  onPress={() => addItem(buildCartItem(product))}
                  className="min-h-16 rounded-3xl bg-salli-card p-5"
                >
                  <Text className="text-xl font-bold text-salli-text">{product.name}</Text>
                  <Text className="mt-1 text-base text-salli-muted">{formatLkr(product.sellPrice)}</Text>
                </Pressable>
              ))
            )}
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
