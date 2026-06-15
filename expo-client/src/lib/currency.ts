export function formatLkr(value: number | null | undefined) {
  const amount = Number.isFinite(value ?? NaN) ? Number(value) : 0;

  return `Rs ${amount.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
