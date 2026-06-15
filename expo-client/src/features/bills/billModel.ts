export type BillLine = {
  id: string;
  name: string;
  qty: number;
  unitCost: number;
  lineTotal: number;
  tax: number;
};

export type BillDraft = {
  id: string;
  supplier: string;
  subtotal: number;
  tax: number;
  total: number;
  confidence: number;
  warnings: string[];
  lines: BillLine[];
};

export type BillFlowState = "idle" | "camera" | "upload" | "scan" | "review" | "error";
