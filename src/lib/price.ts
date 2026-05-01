/**
 * Currency formatting + discount helpers shared across the catalog UI.
 * USD-only for now, but routed through a single helper so the day we
 * support a second currency it's a one-line change.
 */

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function formatUSD(amount: number): string {
  return usdFormatter.format(amount);
}

export function discountPercent(
  price: number | undefined,
  listPrice: number | undefined
): number | undefined {
  if (
    typeof price !== "number" ||
    typeof listPrice !== "number" ||
    listPrice <= 0 ||
    listPrice <= price
  ) {
    return undefined;
  }
  return Math.round(((listPrice - price) / listPrice) * 100);
}
