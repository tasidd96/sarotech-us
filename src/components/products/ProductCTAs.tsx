"use client";

import Link from "next/link";
import { useState } from "react";
import { Inventory } from "@/lib/types";
import PriceBlock from "./PriceBlock";
import { discountPercent, formatUSD } from "@/lib/price";

interface Props {
  productName: string;
  variantCode: string;
  sku: string;
  inventory?: Inventory;
  price?: number;
  listPrice?: number;
}

export default function ProductCTAs({
  productName,
  variantCode,
  sku,
  inventory,
  price,
  listPrice,
}: Props) {
  // Stored as a string so the input can hold transient states like "" while
  // the user is clearing the field to retype. Numeric quantity is derived
  // below — that way React never forces a "1" back into the input mid-edit
  // and the user can paste/type 3000 freely.
  const [qtyText, setQtyText] = useState("1");
  const parsed = parseInt(qtyText, 10);
  const quantity = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;

  const available = inventory?.available ?? 0;
  const allowOutOfStock = inventory?.allowOutOfStock ?? false;
  const hasInventoryData = !!inventory;

  // Buy Now is enabled only when the requested quantity can actually ship.
  // No inventory data → fall back to quote-only (don't block the user with a
  // disabled button just because HL hasn't been wired to this variant yet).
  const canBuyNow = hasInventoryData && quantity > 0 && quantity <= available;

  const subtotal = typeof price === "number" ? price * quantity : undefined;
  const listSubtotal =
    typeof listPrice === "number" ? listPrice * quantity : undefined;
  const off = discountPercent(price, listPrice);

  const quoteHref =
    "/contact" +
    `?product=${encodeURIComponent(productName)}` +
    `&variant=${encodeURIComponent(variantCode)}` +
    `&qty=${quantity}`;

  const buyHref =
    "/checkout" +
    `?sku=${encodeURIComponent(sku)}` +
    `&qty=${quantity}`;

  const cap = (n: number) => {
    if (!hasInventoryData || allowOutOfStock) return Math.max(1, n);
    return Math.min(available > 0 ? available : 1, Math.max(1, n));
  };

  const decrement = () => setQtyText(String(Math.max(1, quantity - 1)));
  const increment = () => setQtyText(String(cap(quantity + 1)));

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow only digits OR empty (so the user can clear to retype). Anything
    // else is rejected without snapping the value back, so the cursor stays
    // where the user expects.
    if (raw === "" || /^\d+$/.test(raw)) {
      setQtyText(raw);
    }
  };

  const handleQtyBlur = () => {
    // On blur, snap empty/zero back to a valid quantity so subsequent button
    // clicks and quote/buy URLs always carry a sane value.
    const n = parseInt(qtyText, 10);
    const next = Number.isFinite(n) && n > 0 ? n : 1;
    setQtyText(String(next));
  };

  // Helper text under the buttons gives the shopper context for why Buy Now
  // greys out when it does.
  const helper = (() => {
    if (!hasInventoryData) return null;
    if (available <= 0 && !allowOutOfStock) {
      return "Out of stock — request a quote and we'll source it for you.";
    }
    if (quantity > available && !allowOutOfStock) {
      return `Only ${available} available right now. Lower the quantity to buy now, or request a quote for the full amount.`;
    }
    if (available > 0) {
      return `${available} available · ships from nearest warehouse.`;
    }
    return null;
  })();

  return (
    <div className="product-cta-section mt-2 flex flex-col gap-3">
      {/* Unit price headline — anchors the Buy Now action with a clear $ */}
      {typeof price === "number" && (
        <PriceBlock price={price} listPrice={listPrice} size="lg" />
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        {/* Stepper — 44px tap targets, big +/- glyphs for thumbs */}
        <div className="inline-flex items-stretch overflow-hidden rounded-md border border-saro-dark">
          <button
            type="button"
            onClick={decrement}
            aria-label="Decrease quantity"
            className="flex h-11 w-11 items-center justify-center text-[22px] leading-none text-saro-dark transition-colors hover:bg-saro-dark hover:text-white active:scale-95"
          >
            −
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={qtyText}
            onChange={handleQtyChange}
            onBlur={handleQtyBlur}
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Quantity"
            className="h-11 w-16 border-x border-saro-dark/20 bg-white text-center text-[16px] font-medium text-saro-dark outline-none"
          />
          <button
            type="button"
            onClick={increment}
            aria-label="Increase quantity"
            className="flex h-11 w-11 items-center justify-center text-[22px] leading-none text-saro-dark transition-colors hover:bg-saro-dark hover:text-white active:scale-95"
          >
            +
          </button>
        </div>

        {/* Inline subtotal next to the stepper */}
        {typeof subtotal === "number" && (
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.5px] text-gray-500">
              Subtotal
            </span>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-[18px] font-semibold text-saro-dark">
                {formatUSD(subtotal)}
              </span>
              {typeof listSubtotal === "number" && off !== undefined && (
                <span className="text-[12px] text-gray-500 line-through">
                  {formatUSD(listSubtotal)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={quoteHref}
          className="inline-flex flex-1 items-center justify-center rounded bg-saro-green px-8 py-3 text-[14px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-saro-green-light"
        >
          Get a Quote
        </Link>
        {canBuyNow ? (
          <Link
            href={buyHref}
            className="inline-flex flex-1 items-center justify-center rounded border border-saro-dark bg-saro-dark px-8 py-3 text-[14px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-black"
          >
            Buy Now
          </Link>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="inline-flex flex-1 cursor-not-allowed items-center justify-center rounded border border-gray-300 bg-gray-200 px-8 py-3 text-[14px] font-semibold uppercase tracking-wider text-gray-500"
          >
            Buy Now
          </button>
        )}
      </div>

      {helper && (
        <p className="text-[12px] text-gray-500">{helper}</p>
      )}
    </div>
  );
}
