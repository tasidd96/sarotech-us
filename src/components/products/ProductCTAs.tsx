"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Inventory } from "@/lib/types";
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
 * PDP quote section — qty stepper + single "Request a Quote" CTA.
 *
 * Pricing dollar figures are deliberately NOT rendered here. Public
 * traffic only sees the qty stepper and the calculator-derived project
 * context; actual prices, list prices, and stock counts will surface
 * later behind a rewards-program login. The price + listPrice props
 * still flow through to `buildQuoteUrl` so the contact form receives
 * the full context (sales reps need it for quoting).
 *
 * Listens for `saro:calculator-result` events fired by the
 * MaterialCalculator further down the page; on receive the qty stepper
 * auto-fills with the computed piece count and the resulting quote URL
 * carries boxes/sqft/qty/price/listPrice plus a pre-formatted message
 * body for the contact form's textarea.
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
      });
    };
    window.addEventListener("saro:calculator-result", onCalc);
    return () => window.removeEventListener("saro:calculator-result", onCalc);
  }, []);

  const available = inventory?.available ?? 0;
  const allowOutOfStock = inventory?.allowOutOfStock ?? false;
  const hasInventoryData = !!inventory;

  const quoteHref = buildQuoteUrl({
    productName,
    variantCode,
    sku,
    quantity,
    boxes: calcContext.boxes,
    totalSqft: calcContext.totalSqft,
    price,
    listPrice,
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
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
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

        {/* Calculator-derived project context — surfaces the project area
            and box count next to the stepper so the user knows their
            calculation is feeding the quote. No dollar figures shown. */}
        {(calcContext.boxes !== undefined ||
          calcContext.totalSqft !== undefined) && (
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.5px] text-gray-500">
              From your calculation
            </span>
            <span className="text-[13px] text-saro-dark">
              {calcContext.totalSqft !== undefined &&
                `${calcContext.totalSqft} ft²`}
              {calcContext.totalSqft !== undefined &&
              calcContext.boxes !== undefined
                ? " · "
                : ""}
              {calcContext.boxes !== undefined &&
                `${calcContext.boxes} box${calcContext.boxes === 1 ? "" : "es"}`}
            </span>
          </div>
        )}
      </div>

      <Link
        href={quoteHref}
        className="inline-flex items-center justify-center rounded bg-saro-green px-8 py-3 text-[14px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-saro-green-light sm:w-auto sm:self-start"
      >
        Request a Quote
      </Link>

      {helper && <p className="text-[12px] text-gray-500">{helper}</p>}
    </div>
  );
}
