import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Screen } from "@/components/ui/Screen";
import { listLocalProducts, addLocalProduct } from "@/features/products/localProductRepository";
import type { Product } from "@/features/products/types";
import { formatLkr } from "@/lib/currency";
import { useAppSession } from "@/stores/appSession";

export default function StockScreen() {
  const { shopId } = useAppSession();
  const [items, setItems] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadProducts() {
    if (!shopId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextItems = await listLocalProducts(shopId);
      setItems(nextItems);
    } catch (loadError) {
      console.error("load local products failed", loadError);
      setError("Could not load local stock.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [shopId]);

  async function addItem() {
    const sellPrice = Number(price);
    if (!shopId || !name.trim() || !Number.isFinite(sellPrice)) {
      return;
    }

    await addLocalProduct(shopId, {
      name: name.trim(),
      sellPrice,
      stockQty: 0,
      vatInclusive: true,
    });

    setName("");
    setPrice("");
    await loadProducts();
  }

  const totalUnits = items.reduce((sum, item) => sum + item.stockQty, 0);
  const lowStockCount = items.filter((item) => item.stockQty <= item.reorderLevel).length;

  return (
    <Screen>
      <AuthGate>
        <View className="gap-6">
          <View>
            <Text className="text-sm font-black uppercase tracking-[4px] text-salli-teal">Stock</Text>
            <Text className="mt-2 text-4xl font-black text-salli-text">Products and stock</Text>
            <Text className="mt-3 text-base leading-7 text-salli-muted">
              Local stock updates instantly from confirmed supplier bills, then syncs when the shop is online.
            </Text>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 rounded-[28px] bg-salli-card p-4">
              <Text className="text-xs font-black uppercase tracking-[3px] text-salli-muted">Items</Text>
              <Text className="mt-2 text-3xl font-black text-salli-text">{items.length}</Text>
            </View>
            <View className="flex-1 rounded-[28px] bg-salli-card p-4">
              <Text className="text-xs font-black uppercase tracking-[3px] text-salli-muted">Units</Text>
              <Text className="mt-2 text-3xl font-black text-salli-teal">{totalUnits}</Text>
            </View>
          </View>

          <PremiumCard eyebrow="Quick add" title="Add product" description="Use this for products that are not captured from supplier bills yet." tone="teal">
            <View className="gap-3">
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Product name"
                placeholderTextColor="#64748B"
                className="min-h-14 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
              />
              <TextInput
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                placeholder="Sell price"
                placeholderTextColor="#64748B"
                className="min-h-14 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
              />
              <PremiumButton onPress={addItem}>Add product</PremiumButton>
            </View>
          </PremiumCard>

          {error ? <Text className="rounded-2xl bg-salli-rose/10 p-4 text-base font-bold text-salli-text">{error}</Text> : null}
          {isLoading ? <Text className="rounded-2xl bg-salli-card p-4 text-base font-bold text-salli-muted">Loading local stock...</Text> : null}

          <PremiumCard eyebrow="Inventory" title="Local stock ledger" description={`${lowStockCount} items at or below reorder level.`} tone="slate">
            <View className="gap-3">
              {!isLoading && items.length === 0 ? (
                <Text className="rounded-2xl bg-slate-950/50 p-4 text-base leading-6 text-salli-muted">
                  No local products yet. Scan a supplier bill or add a product manually.
                </Text>
              ) : null}

              {items.map((item) => {
                const lowStock = item.stockQty <= item.reorderLevel;
                return (
                  <View key={item.id} className="rounded-3xl bg-slate-950/50 p-5">
                    <View className="flex-row justify-between gap-3">
                      <View className="flex-1">
                        <Text className="text-xl font-black text-salli-text">{item.name}</Text>
                        <Text className="mt-1 text-base text-salli-muted">{formatLkr(item.sellPrice)}</Text>
                      </View>
                      <View className="items-end">
                        <Text className={lowStock ? "text-2xl font-black text-salli-rose" : "text-2xl font-black text-salli-teal"}>
                          {item.stockQty}
                        </Text>
                        <Text className="text-sm text-salli-muted">in stock</Text>
                      </View>
                    </View>
                    <Text className="mt-3 text-sm font-bold text-salli-muted">Updated offline • Ready for sync</Text>
                  </View>
                );
              })}
            </View>
          </PremiumCard>
        </View>
      </AuthGate>
    </Screen>
  );
}
