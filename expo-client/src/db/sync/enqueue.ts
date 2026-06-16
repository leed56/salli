import { initializeLocalDatabase } from "@/db/local/database";
import type { SyncOperation } from "./types";

type EnqueueSyncItemInput = {
  entity: string;
  operation: SyncOperation;
  payload: Record<string, unknown>;
};

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function enqueueSyncItem(input: EnqueueSyncItemInput) {
  const db = await initializeLocalDatabase();
  const now = new Date().toISOString();
  const id = createLocalId("sync");

  await db.runAsync(
    `insert into sync_queue (id, entity, operation, payload, status, attempts, created_at, updated_at)
     values (?, ?, ?, ?, 'pending', 0, ?, ?);`,
    [id, input.entity, input.operation, JSON.stringify(input.payload), now, now],
  );

  return id;
}
