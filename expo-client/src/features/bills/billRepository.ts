import type { BillDraft } from "./billModel";
import { demoBillDraft } from "./demoBill";
import { saveBillDraftLocally } from "./purchaseRepository";

export async function getBillDraftById(id: string): Promise<BillDraft | null> {
  if (id === demoBillDraft.id) {
    return demoBillDraft;
  }

  return null;
}

export async function createBillDraftFromImage(): Promise<BillDraft> {
  return demoBillDraft;
}

export async function confirmBillDraft(draft: BillDraft, tenantId: string): Promise<{ purchaseId: string }> {
  return saveBillDraftLocally({ tenantId, draft });
}
