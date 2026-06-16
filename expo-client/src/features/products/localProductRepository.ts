import { initializeLocalDatabase } from "@/db/local/database";
import { enqueueSyncItem } from "@/db/sync/enqueue";

import type { Product, ProductInput } from "./types";

type LocalProductRow = {
  id: string;
  tenant_id: string;
  name: string;
  barcode: string | null;
  sell_price: number;
  stock_qty: number;
  updated_at: string;
};

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function mapLocalProduct(row: LocalProductRow): Product {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    name: row.name,
    barcode: row.barcode,
    sellPrice: row.sell_price,
    stockQty: row.stock_qty,
    reorderLevel: 0,
    vatInclusive: true,
    updatedAt: row.updated_at,
  };
}

export async function listLocalProducts(tenantId: string) {
  const db = await initializeLocalDatabase();
  const rows = await db.getAllAsync<LocalProductRow>(
    `select id, tenant_id, name, barcode, sell_price, stock_qty, updated_at
     from local_products
     where tenant_id = ?
     order by updated_at desc, name asc;`,
    [tenantId],
  );

  return rows.map(mapLocalProduct);
}

export async function addLocalProduct(tenantId: string, input: ProductInput) {
  const db = await initializeLocalDatabase();
  const now = new Date().toISOString();
  const productId = createLocalId("product");

  await db.runAsync(
    `insert into local_products (id, tenant_id, name, barcode, sell_price, stock_qty, updated_at)
     values (?, ?, ?, ?, ?, ?, ?);`,
    [productId, tenantId, input.name, input.barcode ?? null, input.sellPrice, input.stockQty ?? 0, now],
  );

  await enqueueSyncItem({
    entity: "product",
    operation: "insert",
    payload: {
      productId,
      tenantId,
      name: input.name,
      barcode: input.barcode ?? null,
      sellPrice: input.sellPrice,
      stockQty: input.stockQty ?? 0,
      createdAt: now,
    },
  });

  return productId;
}
