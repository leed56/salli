export type VatSourceTotals = {
  outputVat: number;
  inputVat: number;
  expenseVat: number;
};

export type VatSummary = VatSourceTotals & {
  netPayable: number;
};

export function calculateVatSummary(totals: VatSourceTotals): VatSummary {
  const netPayable = Math.max(0, totals.outputVat - totals.inputVat - totals.expenseVat);

  return {
    ...totals,
    netPayable,
  };
}
