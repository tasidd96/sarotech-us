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
 */
export interface CalculatorResultEvent {
  pieces: number;
  boxes: number;
  totalSqft: number;
}

type Mode = "sqft" | "dimensions";

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
  // Per-piece alone is enough to count pieces; boxes column simply hides when
  // we don't have enough info to derive whole-box quantities.
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
    const perBox = piecesPerBox && piecesPerBox > 0 ? piecesPerBox : 0;
    const exactPieces = sqftPerPiece
      ? Math.ceil(usableTotal / sqftPerPiece)
      : 0;
    // Round up to whole boxes when we know per-box coverage; otherwise
    // pieces are reported directly from per-piece coverage.
    const boxCount = effectiveSqftPerBox
      ? Math.ceil(usableTotal / effectiveSqftPerBox)
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
    canCalculate,
    effectiveSqftPerBox,
    sqftPerPiece,
    piecesPerBox,
  ]);

  const fmt = (n: number) =>
    n === 0 ? "0" : Number.isInteger(n) ? n.toString() : n.toFixed(1);

  // Whenever the user produces a meaningful calc result, broadcast it so
  // the PDP's CTA stepper (further up the page) can auto-fill its quantity
  // input and surface a subtotal that matches the project size.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasInput || !canCalculate) return;
    const detail: CalculatorResultEvent = {
      pieces,
      boxes,
      totalSqft,
    };
    window.dispatchEvent(new CustomEvent("saro:calculator-result", { detail }));
  }, [hasInput, canCalculate, pieces, boxes, totalSqft]);

  const quoteHref = buildQuoteUrl({
    productName,
    variantCode,
    sku,
    quantity: pieces > 0 ? pieces : undefined,
    boxes: boxes > 0 ? boxes : undefined,
    totalSqft: totalSqft > 0 ? totalSqft : undefined,
    price,
    listPrice,
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
              {!effectiveSqftPerBox && (
                <p className="text-[12px] italic text-gray-500">
                  Per-box coverage isn&apos;t published for this variant. Piece
                  count is exact, ask sales for box quantities.
                </p>
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

        <div className="calculator-footer-row flex flex-wrap items-center justify-between gap-4">
          <div className="recommendation-text text-[13.6px] italic text-gray-500">
            *We recommend adding 10% extra material to cover cuts and
            replacements.
          </div>
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
