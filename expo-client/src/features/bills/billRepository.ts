import type { BillDraft } from "./billModel";
import { demoBillDraft } from "./demoBill";

export async function getBillDraftById(id: string): Promise<BillDraft | null> {
  if (id === demoBillDraft.id) {
    return demoBillDraft;
  }

  return null;
}

export async function createBillDraftFromImage(): Promise<BillDraft> {
  return demoBillDraft;
}

export async function confirmBillDraft(draft: BillDraft): Promise<{ purchaseId: string }> {
  console.log("confirm bill draft", {
    draftId: draft.id,
    supplier: draft.supplier,
    lines: draft.lines.length,
    inputVat: draft.tax,
    stockIncrease: draft.lines.map((line) => ({ name: line.name, qty: line.qty })),
  });

  return { purchaseId: `purchase-${draft.id}` };
}
