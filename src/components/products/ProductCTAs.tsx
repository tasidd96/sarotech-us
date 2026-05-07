"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Inventory } from "@/lib/types";
import PriceBlock from "./PriceBlock";
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
 * Inline pricing/estimation block + single "Request a Quote" CTA.
 *
 * Listens for `saro:calculator-result` events fired by the MaterialCalculator
 * further down the page; when the user runs a calc, the quantity stepper
 * auto-fills with the computed piece count and the subtotal updates in
 * lockstep. The quote URL we build carries the full calc context (boxes,
 * sqft, qty, price, listPrice) plus a pre-formatted message body for the
 * contact form's textarea.
 *
 * NOTE: This is a fallback. A GoHighLevel-embedded form will replace the
 * `/contact` flow eventually; until then `buildQuoteUrl` keeps both paths
 * in sync.
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
  });

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

  // Helper text under the buttons gives the shopper context — but only when
  // it's actionable. With Buy Now removed there's no need for a "lower the
  // qty to buy now" message; the quote path handles any quantity.
  const helper = (() => {
    if (!hasInventoryData) return null;
    if (available <= 0 && !allowOutOfStock) {
      return "Currently out of stock — request a quote and we'll source it for you.";
    }
    if (available > 0) {
      return `${available} available · ships from nearest warehouse.`;
    }
    return null;
  })();

  return (
    <div className="product-cta-section mt-2 flex flex-col gap-3">
      {/* Unit price headline — anchors the quote action with a clear $. */}
      {typeof price === "number" && (
        <PriceBlock price={price} listPrice={listPrice} size="lg" />
      )}

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

        {/* Inline subtotal next to the stepper */}
        {typeof subtotal === "number" && (
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.5px] text-gray-500">
              Estimated subtotal
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

        {/* Surfaces calculator-derived context inline so the user knows
            their project area is feeding the quote. */}
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

      <p className="text-[11px] italic text-gray-500">
        Estimated total. Final pricing, freight, and lead time confirmed in
        your quote.
      </p>
    </div>
  );
}
