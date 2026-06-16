import { initializeLocalDatabase } from "@/db/local/database";
import { enqueueSyncItem } from "@/db/sync/enqueue";

import type { BillDraft, BillLine } from "./billModel";

type SavePurchaseInput = {
  tenantId: string;
  draft: BillDraft;
};

type LocalProductRow = {
  id: string;
  stock_qty: number;
};

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function applyStockIncrease(db: Awaited<ReturnType<typeof initializeLocalDatabase>>, tenantId: string, line: BillLine, now: string) {
  const existing = await db.getFirstAsync<LocalProductRow>(
    `select id, stock_qty from local_products where tenant_id = ? and lower(name) = lower(?) limit 1;`,
    [tenantId, line.name],
  );

  if (existing) {
    await db.runAsync(
      `update local_products set stock_qty = ?, updated_at = ? where id = ?;`,
      [existing.stock_qty + line.qty, now, existing.id],
    );
    return existing.id;
  }

  const productId = createLocalId("product");
  await db.runAsync(
    `insert into local_products (id, tenant_id, name, barcode, sell_price, stock_qty, updated_at)
     values (?, ?, ?, null, 0, ?, ?);`,
    [productId, tenantId, line.name, line.qty, now],
  );

  return productId;
}

export async function saveBillDraftLocally({ tenantId, draft }: SavePurchaseInput) {
  const db = await initializeLocalDatabase();
  const now = new Date().toISOString();
  const purchaseId = createLocalId("purchase");
  const stockChanges: Array<{ productId: string; name: string; qtyAdded: number }> = [];

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `insert into local_purchases (id, tenant_id, supplier_name, subtotal, vat_amount, total, confidence, sync_status, created_at)
       values (?, ?, ?, ?, ?, ?, ?, 'pending', ?);`,
      [purchaseId, tenantId, draft.supplier, draft.subtotal, draft.tax, draft.total, draft.confidence, now],
    );

    for (const line of draft.lines) {
      const productId = await applyStockIncrease(db, tenantId, line, now);
      stockChanges.push({ productId, name: line.name, qtyAdded: line.qty });

      await db.runAsync(
        `insert into local_purchase_items (id, purchase_id, name, qty, unit_cost, line_total, vat_amount, stock_status)
         values (?, ?, ?, ?, ?, ?, ?, 'applied');`,
        [createLocalId("purchase-item"), purchaseId, line.name, line.qty, line.unitCost, line.lineTotal, line.tax],
      );
    }
  });

  await enqueueSyncItem({
    entity: "purchase",
    operation: "insert",
    payload: {
      purchaseId,
      tenantId,
      supplierName: draft.supplier,
      subtotal: draft.subtotal,
      vatAmount: draft.tax,
      total: draft.total,
      confidence: draft.confidence,
      warnings: draft.warnings,
      lines: draft.lines,
      stockChanges,
      createdAt: now,
    },
  });

  return { purchaseId, stockChanges };
}
