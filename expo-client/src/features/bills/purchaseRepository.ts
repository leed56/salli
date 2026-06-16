import { initializeLocalDatabase } from "@/db/local/database";
import { enqueueSyncItem } from "@/db/sync/enqueue";

import type { BillDraft } from "./billModel";

type SavePurchaseInput = {
  tenantId: string;
  draft: BillDraft;
};

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function saveBillDraftLocally({ tenantId, draft }: SavePurchaseInput) {
  const db = await initializeLocalDatabase();
  const now = new Date().toISOString();
  const purchaseId = createLocalId("purchase");

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `insert into local_purchases (id, tenant_id, supplier_name, subtotal, vat_amount, total, confidence, sync_status, created_at)
       values (?, ?, ?, ?, ?, ?, ?, 'pending', ?);`,
      [purchaseId, tenantId, draft.supplier, draft.subtotal, draft.tax, draft.total, draft.confidence, now],
    );

    for (const line of draft.lines) {
      await db.runAsync(
        `insert into local_purchase_items (id, purchase_id, name, qty, unit_cost, line_total, vat_amount, stock_status)
         values (?, ?, ?, ?, ?, ?, ?, 'pending');`,
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
      createdAt: now,
    },
  });

  return { purchaseId };
}
