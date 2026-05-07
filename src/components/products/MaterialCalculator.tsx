"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductDimensions } from "@/lib/types";
import { buildQuoteUrl } from "@/lib/quote";

type Props = {
  dimensions?: ProductDimensions;
  piecesPerBox?: number;
  sqftPerBox?: number;
  productName: string;
  variantCode: string;
  sku?: string;
  price?: number;
  listPrice?: number;
};

/**
 * Detail dispatched on `saro:calculator-result` after a successful calc.
 * ProductCTAs subscribes so the quantity stepper auto-updates and the
 * quote URL it builds carries the same calc context as this calculator's
 * own button.
 *
 * `pieces` and `boxes` already include the 10%-overage inflation when
 * `overage` is true. `totalSqft` is the user's raw project area
 * (unchanged) so the form can echo back what they typed.
 */
export interface CalculatorResultEvent {
  pieces: number;
  boxes: number;
  totalSqft: number;
  overage: boolean;
}

type Mode = "sqft" | "dimensions";

const OVERAGE_MULTIPLIER = 1.1;

export default function MaterialCalculator({
  dimensions,
  piecesPerBox,
  sqftPerBox,
  productName,
  variantCode,
  sku,
  price,
  listPrice,
}: Props) {
  const [mode, setMode] = useState<Mode>("sqft");
  const [sqft, setSqft] = useState("");
  const [widthFt, setWidthFt] = useState("");
  const [heightFt, setHeightFt] = useState("");
  // Overage default: ON. Industry-standard recommendation is +10% to
  // cover cuts and replacements; pre-checking it makes the math safer
  // by default and the toggle still lets the user opt out.
  const [overage, setOverage] = useState(true);

  // Derive per-piece coverage from product dimensions when available.
  // sqftPerBox (canonical marketing number) wins for box math; if it's
  // missing but we know piecesPerBox, derive it from per-piece × pieces.
  const sqftPerPiece =
    dimensions && dimensions.widthIn > 0 && dimensions.heightIn > 0
      ? (dimensions.widthIn * dimensions.heightIn) / 144
      : undefined;
  const effectiveSqftPerBox =
    sqftPerBox ??
    (sqftPerPiece && piecesPerBox ? sqftPerPiece * piecesPerBox : undefined);

  // Calculator runs as soon as we know either per-piece or per-box coverage.
  const canCalculate = !!sqftPerPiece || !!effectiveSqftPerBox;

  const { totalSqft, pieces, boxes, coveredSqft, hasInput } = useMemo(() => {
    let total = 0;
    if (mode === "sqft") {
      total = parseFloat(sqft) || 0;
    } else {
      const w = parseFloat(widthFt) || 0;
      const h = parseFloat(heightFt) || 0;
      total = w * h;
    }
    const usableTotal = Math.max(total, 0);
    if (!canCalculate || usableTotal === 0) {
      return {
        totalSqft: usableTotal,
        pieces: 0,
        boxes: 0,
        coveredSqft: 0,
        hasInput: usableTotal > 0,
      };
    }
    // Inflate the area before piece/box math when overage is on. The user's
    // typed total stays untouched in `totalSqft`; pieces/boxes/coveredSqft
    // reflect the buffered amount.
    const adjustedTotal = usableTotal * (overage ? OVERAGE_MULTIPLIER : 1);
    const perBox = piecesPerBox && piecesPerBox > 0 ? piecesPerBox : 0;
    const exactPieces = sqftPerPiece
      ? Math.ceil(adjustedTotal / sqftPerPiece)
      : 0;
    const boxCount = effectiveSqftPerBox
      ? Math.ceil(adjustedTotal / effectiveSqftPerBox)
      : 0;
    const pieceCount =
      effectiveSqftPerBox && perBox > 0 ? boxCount * perBox : exactPieces;
    const covered = effectiveSqftPerBox
      ? boxCount * effectiveSqftPerBox
      : sqftPerPiece
      ? exactPieces * sqftPerPiece
      : usableTotal;
    return {
      totalSqft: usableTotal,
      pieces: pieceCount,
      boxes: boxCount,
      coveredSqft: covered,
      hasInput: true,
    };
  }, [
    mode,
    sqft,
    widthFt,
    heightFt,
    overage,
    canCalculate,
    effectiveSqftPerBox,
    sqftPerPiece,
    piecesPerBox,
  ]);

  const fmt = (n: number) =>
    n === 0 ? "0" : Number.isInteger(n) ? n.toString() : n.toFixed(1);

  // Whenever the user produces a meaningful calc result, broadcast it so
  // the PDP's CTA stepper (further up the page) can auto-fill its quantity
  // input and surface a subtotal that matches the project size. The
  // `overage` flag travels too so the CTA can label "(+10% overage)".
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasInput || !canCalculate) return;
    const detail: CalculatorResultEvent = {
      pieces,
      boxes,
      totalSqft,
      overage,
    };
    window.dispatchEvent(new CustomEvent("saro:calculator-result", { detail }));
  }, [hasInput, canCalculate, pieces, boxes, totalSqft, overage]);

  const quoteHref = buildQuoteUrl({
    productName,
    variantCode,
    sku,
    quantity: pieces > 0 ? pieces : undefined,
    boxes: boxes > 0 ? boxes : undefined,
    totalSqft: totalSqft > 0 ? totalSqft : undefined,
    price,
    listPrice,
    overage,
  });

  // Result columns are conditional: only show what we can actually compute.
  const resultColumns: { label: string; value: string }[] = [
    { label: "Total ft²", value: fmt(totalSqft) },
  ];
  if (sqftPerPiece) {
    resultColumns.push({ label: "Pieces", value: pieces.toString() });
  }
  if (effectiveSqftPerBox) {
    resultColumns.push({ label: "Boxes", value: boxes.toString() });
  }
  resultColumns.push({ label: "ft² Covered", value: fmt(coveredSqft) });

  return (
    <section
      id="calculator"
      className="calculator-section scroll-mt-20 bg-[#e6e6e6] py-8"
    >
      <div className="calculator-container container-std flex flex-col gap-5">
        <div className="calculator-title-row text-center">
          <h2 className="calculator-title text-[24px] font-semibold text-saro-dark">
            Calculate how much material you need for your project
          </h2>
          {(sqftPerPiece || effectiveSqftPerBox) && (
            <p className="mt-1 text-[13px] text-gray-600">
              {sqftPerPiece && `Each piece covers ${sqftPerPiece.toFixed(2)} ft²`}
              {effectiveSqftPerBox
                ? `${sqftPerPiece ? " · " : ""}${effectiveSqftPerBox.toFixed(1)} ft² per box`
                : ""}
            </p>
          )}
        </div>

        {canCalculate ? (
          <div className="calculator-content-row grid grid-cols-1 items-center gap-[30px] lg:grid-cols-[minmax(0,462px)_repeat(4,minmax(0,1fr))]">
            {/* Input column */}
            <div className="calculator-input-column flex flex-col gap-5">
              <div className="calculation-options flex flex-wrap gap-6">
                <label className="radio-option flex cursor-pointer items-center gap-2 text-[14px] text-saro-dark">
                  <input
                    type="radio"
                    value="sqft"
                    checked={mode === "sqft"}
                    onChange={() => setMode("sqft")}
                    name="calculationType"
                    className="accent-saro-green"
                  />
                  <span>Calculate by ft²</span>
                </label>
                <label className="radio-option flex cursor-pointer items-center gap-2 text-[14px] text-saro-dark">
                  <input
                    type="radio"
                    value="dimensions"
                    checked={mode === "dimensions"}
                    onChange={() => setMode("dimensions")}
                    name="calculationType"
                    className="accent-saro-green"
                  />
                  <span>Calculate Width × Height</span>
                </label>
              </div>

              {mode === "sqft" ? (
                <div className="input-section flex items-center gap-3">
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    placeholder="150"
                    value={sqft}
                    onChange={(e) => setSqft(e.target.value)}
                    className="area-input h-[45px] w-full flex-1 rounded border border-[#ccc] bg-white px-3 text-[16px] text-black outline-none focus:border-saro-green sm:w-[184px] sm:flex-none"
                  />
                  <span className="unit-label text-[16px] text-saro-dark">
                    ft²
                  </span>
                </div>
              ) : (
                <div className="input-section flex flex-wrap items-center gap-3">
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    placeholder="Width"
                    value={widthFt}
                    onChange={(e) => setWidthFt(e.target.value)}
                    className="area-input h-[45px] w-full flex-1 rounded border border-[#ccc] bg-white px-3 text-[16px] text-black outline-none focus:border-saro-green sm:w-[120px] sm:flex-none"
                  />
                  <span className="text-[16px] text-saro-dark">×</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    placeholder="Height"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    className="area-input h-[45px] w-full flex-1 rounded border border-[#ccc] bg-white px-3 text-[16px] text-black outline-none focus:border-saro-green sm:w-[120px] sm:flex-none"
                  />
                  <span className="unit-label text-[16px] text-saro-dark">
                    ft
                  </span>
                </div>
              )}
            </div>

            {/* Result columns */}
            {resultColumns.map((r) => (
              <div
                key={r.label}
                className="result-column flex flex-col text-center"
              >
                <div className="result-label text-[14px] text-gray-600">
                  {r.label}
                </div>
                <div className="result-value text-[28.8px] font-normal leading-none text-saro-dark">
                  {r.value}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[14px] text-gray-600">
            Coverage details aren&apos;t published for this product yet. Contact
            us for a tailored quote.
          </p>
        )}

        <div className="calculator-footer-row flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          {/* Overage toggle replaces the static "+10%" recommendation. Default
              ON; clicking flips it. The flag travels into the quote URL +
              body so sales sees whether the qty already includes the buffer. */}
          <button
            type="button"
            role="switch"
            aria-checked={overage}
            onClick={() => setOverage((v) => !v)}
            className={`overage-toggle inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
              overage
                ? "border-saro-green bg-saro-green text-white hover:bg-saro-green-light"
                : "border-gray-400 bg-white text-saro-dark hover:border-saro-green hover:text-saro-green"
            }`}
          >
            <span
              aria-hidden
              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                overage
                  ? "border-white bg-white text-saro-green"
                  : "border-gray-400 bg-transparent"
              }`}
            >
              {overage ? (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : null}
            </span>
            <span>Add 10% overage for cuts &amp; replacements</span>
          </button>
          <a
            href={quoteHref}
            aria-disabled={!hasInput}
            className={`quote-btn block w-full rounded-[5px] px-12 py-3 text-center text-[17.6px] font-semibold uppercase tracking-[1px] text-white transition-colors sm:inline-block sm:w-auto sm:py-2 ${
              hasInput
                ? "bg-saro-green hover:bg-saro-green-light"
                : "bg-[#999] pointer-events-none"
            }`}
          >
            Request a Quote
          </a>
        </div>
      </div>
    </section>
  );
}
