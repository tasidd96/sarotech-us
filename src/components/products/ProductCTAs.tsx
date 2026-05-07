"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Inventory } from "@/lib/types";
import { discountPercent, formatUSD } from "@/lib/price";
import { buildQuoteUrl } from "@/lib/quote";
import type { CalculatorResultEvent } from "./MaterialCalculator";

interface Props {
  productName: string;
  variantCode: string;
  sku: string;
  inventory?: Inventory;
  price?: number;
  listPrice?: number;
}

/**
 * PDP quote section — qty stepper, estimated subtotal, single "Request
 * a Quote" CTA.
 *
 * Pricing IS shown here on the PDP (subtotal + strikethrough list
 * subtotal when on sale). Listing cards stay $-free; that's a
 * collections-page constraint, not a site-wide one. Stock counts are
 * still hidden everywhere — the StockPill at the top of the column
 * shows in/out-of-stock state without a numeric on-hand count.
 *
 * Listens for `saro:calculator-result` events fired by the
 * MaterialCalculator further down the page; on receive the qty stepper
 * auto-fills with the computed piece count and the subtotal updates in
 * lockstep.
 *
 * NOTE: This is a fallback. A GoHighLevel-embedded form will replace
 * `/contact` later; the shared quote helper keeps both paths in sync.
 */
export default function ProductCTAs({
  productName,
  variantCode,
  sku,
  inventory,
  price,
  listPrice,
}: Props) {
  // Stored as a string so the input can hold transient states like "" while
  // the user is clearing the field to retype.
  const [qtyText, setQtyText] = useState("1");
  const parsed = parseInt(qtyText, 10);
  const quantity = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;

  // Calculator-derived context that travels into the quote URL when set.
  // Cleared if the user manually edits the qty stepper afterwards — the
  // boxes/sqft would no longer correspond to the qty at that point.
  const [calcContext, setCalcContext] = useState<{
    boxes?: number;
    totalSqft?: number;
    overage?: boolean;
  }>({});

  // Subscribe to calculator results and mirror the piece count onto the
  // stepper. Dispatch happens whenever the user has typed a non-zero area
  // into the calculator below.
  useEffect(() => {
    const onCalc = (e: Event) => {
      const detail = (e as CustomEvent<CalculatorResultEvent>).detail;
      if (!detail || detail.pieces <= 0) return;
      setQtyText(String(detail.pieces));
      setCalcContext({
        boxes: detail.boxes > 0 ? detail.boxes : undefined,
        totalSqft: detail.totalSqft > 0 ? detail.totalSqft : undefined,
        overage: detail.overage,
      });
    };
    window.addEventListener("saro:calculator-result", onCalc);
    return () => window.removeEventListener("saro:calculator-result", onCalc);
  }, []);

  const available = inventory?.available ?? 0;
  const allowOutOfStock = inventory?.allowOutOfStock ?? false;
  const hasInventoryData = !!inventory;

  const subtotal = typeof price === "number" ? price * quantity : undefined;
  const listSubtotal =
    typeof listPrice === "number" ? listPrice * quantity : undefined;
  const off = discountPercent(price, listPrice);

  const quoteHref = buildQuoteUrl({
    productName,
    variantCode,
    sku,
    quantity,
    boxes: calcContext.boxes,
    totalSqft: calcContext.totalSqft,
    price,
    listPrice,
    overage: calcContext.overage,
  });

  // Cap the stepper at on-hand quantity when we know it AND out-of-stock
  // purchases aren't enabled. Without inventory data we don't cap (HL
  // hasn't been wired to this variant yet).
  const cap = (n: number) => {
    if (!hasInventoryData || allowOutOfStock) return Math.max(1, n);
    return Math.min(available > 0 ? available : 1, Math.max(1, n));
  };

  const decrement = () => {
    setQtyText(String(Math.max(1, quantity - 1)));
    // Manual edit invalidates the calc context — the boxes/sqft were tied
    // to the previous qty. Drop them so the quote body reflects only what
    // the user is actually looking at now.
    setCalcContext({});
  };
  const increment = () => {
    setQtyText(String(cap(quantity + 1)));
    setCalcContext({});
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "" || /^\d+$/.test(raw)) {
      setQtyText(raw);
      setCalcContext({});
    }
  };

  const handleQtyBlur = () => {
    const n = parseInt(qtyText, 10);
    const next = Number.isFinite(n) && n > 0 ? n : 1;
    setQtyText(String(next));
  };

  // Helper text only when the variant is fully out of stock — and even
  // then it doesn't reveal the on-hand count.
  const helper =
    hasInventoryData && available <= 0 && !allowOutOfStock
      ? "Currently out of stock — request a quote and we'll source it for you."
      : null;

  return (
    <div className="product-cta-section mt-2 flex flex-col gap-3">
      {/* Outer wrapper stacks at every viewport now — qty stepper +
          subtotal occupy the top row, the Request-a-Quote button sits
          full-width directly underneath. Earlier inline pattern crowded
          the 40% column at desktop widths; full-width button below
          reads cleaner regardless of viewport. */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-stretch gap-x-2 gap-y-2">
          {/* Stepper — 44px tap targets for thumbs */}
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

        {/* Estimated subtotal — height-matched to the stepper (44px)
            so it sits on the same line visually. */}
        {typeof subtotal === "number" && (
          <div className="flex h-11 flex-col justify-center">
            <span className="text-[11px] uppercase leading-none tracking-[0.5px] text-gray-500">
              Estimated subtotal
            </span>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
              <span className="text-[16px] font-semibold leading-none text-saro-dark">
                {formatUSD(subtotal)}
              </span>
              {typeof listSubtotal === "number" && off !== undefined && (
                <span className="text-[12px] leading-none text-gray-500 line-through">
                  {formatUSD(listSubtotal)}
                </span>
              )}
            </div>
          </div>
        )}

        </div>

        <Link
          href={quoteHref}
          className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded bg-saro-green px-4 text-[14px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-saro-green-light"
        >
          Request a Quote
        </Link>
      </div>

      {/* Calculator-derived project context — its own row underneath the
          stepper / subtotal / quote button so it never crowds them out
          when the right column is narrow. Comma-separated to read as a
          sentence fragment. */}
      {(calcContext.boxes !== undefined ||
        calcContext.totalSqft !== undefined) && (
        <p className="text-[12px] text-gray-600">
          <span className="text-gray-500">From your calculation: </span>
          <span className="text-saro-dark">
            {[
              calcContext.totalSqft !== undefined
                ? `${calcContext.totalSqft} ft²`
                : null,
              calcContext.boxes !== undefined
                ? `${calcContext.boxes} box${
                    calcContext.boxes === 1 ? "" : "es"
                  }`
                : null,
              calcContext.overage ? "+10% overage" : null,
            ]
              .filter(Boolean)
              .join(", ")}
          </span>
        </p>
      )}

      {helper && <p className="text-[12px] text-gray-500">{helper}</p>}

      <p className="text-[11px] italic text-gray-500">
        Estimated total. Final pricing, freight, and lead time confirmed in
        your quote.
      </p>
    </div>
  );
}
