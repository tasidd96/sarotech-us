import { formatUSD } from "./price";

/**
 * Inputs for building a quote-request URL. Everything is optional except
 * `productName` + `variantCode`, which uniquely identify what's being
 * quoted. The fields are strictly additive — pass what you have, the
 * helper formats and encodes the rest.
 */
export interface QuoteContext {
  productName: string;
  variantCode: string;
  sku?: string;
  /** Unit count (typically pieces). */
  quantity?: number;
  /** Whole boxes — only set when calculator math has been done. */
  boxes?: number;
  /** Total ft² typed/computed in the calculator. */
  totalSqft?: number;
  /** Unit sell price in USD. */
  price?: number;
  /** Unit list price (compareAtPrice) in USD if different from sell. */
  listPrice?: number;
}

/**
 * Builds a multi-line, plain-text quote summary for the contact form's
 * message body. Designed to be readable when pasted into an email client
 * by a human, AND to give whoever's responding (sales) every detail
 * they need without a back-and-forth.
 *
 * The format is intentionally low-tech (no markdown, no fancy unicode)
 * because this gets rendered into a `<textarea>` and possibly emailed.
 */
export function formatQuoteBody(ctx: QuoteContext): string {
  const lines: string[] = [];
  lines.push("Hi SARO TECH team,");
  lines.push("");
  lines.push("I'd like to request a quote for:");
  lines.push("");
  lines.push(`- Product: ${ctx.productName}`);
  lines.push(`- Variant: ${ctx.variantCode}`);
  if (ctx.sku) lines.push(`- SKU: ${ctx.sku}`);

  if (typeof ctx.quantity === "number" && ctx.quantity > 0) {
    lines.push(`- Quantity: ${ctx.quantity} pcs`);
  }
  if (typeof ctx.boxes === "number" && ctx.boxes > 0) {
    lines.push(`- Boxes needed: ${ctx.boxes}`);
  }
  if (typeof ctx.totalSqft === "number" && ctx.totalSqft > 0) {
    lines.push(`- Project area: ${formatSqft(ctx.totalSqft)} ft²`);
  }
  if (typeof ctx.price === "number") {
    lines.push(`- Unit price: ${formatUSD(ctx.price)}`);
  }
  if (
    typeof ctx.listPrice === "number" &&
    typeof ctx.price === "number" &&
    ctx.listPrice > ctx.price
  ) {
    lines.push(`- List price: ${formatUSD(ctx.listPrice)}`);
  }
  if (typeof ctx.price === "number" && typeof ctx.quantity === "number") {
    const subtotal = ctx.price * ctx.quantity;
    lines.push(`- Estimated subtotal: ${formatUSD(subtotal)}`);
  }

  lines.push("");
  lines.push("A few details about the project / installation timeline would help.");
  lines.push("");
  lines.push("Thanks!");
  return lines.join("\n");
}

/**
 * Builds a `/contact?...` URL carrying the quote context plus a pre-formatted
 * `body` so the contact form's message field can be populated verbatim. The
 * individual params are kept too — they let the form render a "prefilled"
 * banner and stay backwards compatible with older entry points.
 */
export function buildQuoteUrl(ctx: QuoteContext): string {
  const params = new URLSearchParams();
  params.set("product", ctx.productName);
  params.set("variant", ctx.variantCode);
  if (ctx.sku) params.set("sku", ctx.sku);
  if (typeof ctx.quantity === "number" && ctx.quantity > 0) {
    params.set("qty", String(ctx.quantity));
  }
  if (typeof ctx.boxes === "number" && ctx.boxes > 0) {
    params.set("boxes", String(ctx.boxes));
  }
  if (typeof ctx.totalSqft === "number" && ctx.totalSqft > 0) {
    params.set("sqft", formatSqft(ctx.totalSqft));
  }
  if (typeof ctx.price === "number") {
    params.set("price", ctx.price.toFixed(2));
  }
  if (typeof ctx.listPrice === "number") {
    params.set("listPrice", ctx.listPrice.toFixed(2));
  }
  params.set("body", formatQuoteBody(ctx));
  return `/contact?${params.toString()}`;
}

function formatSqft(n: number): string {
  return Number.isInteger(n) ? n.toString() : n.toFixed(1);
}
