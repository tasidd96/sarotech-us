export const CM_TO_IN = 0.393700787;
export const M2_TO_SQFT = 10.7639104;

export function cmToIn(cm: number): number {
  return cm * CM_TO_IN;
}

export function m2ToSqft(m2: number): number {
  return m2 * M2_TO_SQFT;
}

/**
 * Round n to the nearest 1/denominator. Denominator defaults to 8 (eighths).
 */
function nearestFraction(n: number, denominator = 8): { whole: number; num: number; den: number } {
  const totalEighths = Math.round(n * denominator);
  const whole = Math.trunc(totalEighths / denominator);
  const remainder = Math.abs(totalEighths - whole * denominator);
  if (remainder === 0) return { whole, num: 0, den: denominator };
  let num = remainder;
  let den = denominator;
  while (num % 2 === 0 && den % 2 === 0) {
    num /= 2;
    den /= 2;
  }
  return { whole, num, den };
}

/**
 * Format a value in inches. For values under 24", shows inches with fractional
 * notation (e.g. `6 1/8"`, `3/4"`). For 24"+, shows feet + inches
 * (e.g. `9' 6 1/8"`).
 */
export function formatInches(inches: number): string {
  if (!Number.isFinite(inches) || inches <= 0) return "—";
  if (inches >= 24) {
    const feet = Math.trunc(inches / 12);
    const rem = inches - feet * 12;
    const frac = nearestFraction(rem);
    if (frac.num === 0 && frac.whole === 0) return `${feet}'`;
    if (frac.num === 0) return `${feet}' ${frac.whole}"`;
    if (frac.whole === 0) return `${feet}' ${frac.num}/${frac.den}"`;
    return `${feet}' ${frac.whole} ${frac.num}/${frac.den}"`;
  }
  const frac = nearestFraction(inches);
  if (frac.num === 0) return `${frac.whole}"`;
  if (frac.whole === 0) return `${frac.num}/${frac.den}"`;
  return `${frac.whole} ${frac.num}/${frac.den}"`;
}

export function formatSqft(sqft: number, digits = 1): string {
  if (!Number.isFinite(sqft) || sqft <= 0) return "—";
  return `${sqft.toFixed(digits)} ft²`;
}
