import { supabaseClient } from "@/lib/supabaseClient";

import type { Product, ProductInput } from "./types";

type ProductRow = {
  id: string;
  tenant_id: string;
  name: string;
  barcode: string | null;
  sell_price: number | string;
  stock_qty: number | string;
  reorder_level: number | string;
  vat_inclusive: boolean;
  updated_at: string;
};

// PostgREST returns numeric columns as strings to preserve precision, so coerce.
function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    name: row.name,
    barcode: row.barcode,
    sellPrice: Number(row.sell_price),
    stockQty: Number(row.stock_qty),
    reorderLevel: Number(row.reorder_level),
    vatInclusive: row.vat_inclusive,
    updatedAt: row.updated_at,
  };
}

export async function listProducts(shopId: string): Promise<Product[]> {
  const { data, error } = await supabaseClient
    .from("products")
    .select("id, tenant_id, name, barcode, sell_price, stock_qty, reorder_level, vat_inclusive, updated_at")
    .eq("tenant_id", shopId)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data as ProductRow[] | null) ?? []).map(mapProduct);
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
