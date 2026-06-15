import { supabaseClient } from "@/lib/supabaseClient";

import type { ProductInput } from "./types";

export async function fetchProducts(shopId: string) {
  return supabaseClient
    .from("products")
    .select("id, tenant_id, name, barcode, sell_price, stock_qty, reorder_level, vat_inclusive, updated_at")
    .eq("tenant_id", shopId)
    .order("name", { ascending: true });
}

export async function addProduct(shopId: string, input: ProductInput) {
  return supabaseClient.from("products").insert({
    tenant_id: shopId,
    name: input.name,
    barcode: input.barcode || null,
    sell_price: input.sellPrice,
    cost_price: input.costPrice ?? 0,
    stock_qty: input.stockQty ?? 0,
    reorder_level: input.reorderLevel ?? 0,
    vat_inclusive: input.vatInclusive ?? true,
  });
}
