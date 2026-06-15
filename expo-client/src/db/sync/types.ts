export type SyncOperation = "insert" | "update" | "delete";
export type SyncStatus = "pending" | "syncing" | "synced" | "failed";

export type SyncQueueItem = {
  id: string;
  entity: string;
  operation: SyncOperation;
  payload: Record<string, unknown>;
  status: SyncStatus;
  attempts: number;
  lastError?: string | null;
  createdAt: string;
  updatedAt: string;
};
