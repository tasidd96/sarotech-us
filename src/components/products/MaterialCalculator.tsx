"use client";

import { useMemo, useState } from "react";

type Props = {
  m2PerBox?: number;
  piecesPerBox?: number;
  productName: string;
  variantCode: string;
};

type Mode = "m2" | "dimensions";

export default function MaterialCalculator({
  m2PerBox,
  piecesPerBox,
  productName,
  variantCode,
}: Props) {
  const [mode, setMode] = useState<Mode>("m2");
  const [m2, setM2] = useState("");
  const [base, setBase] = useState("");
  const [height, setHeight] = useState("");

  const { totalM2, units, boxes, coveredM2, hasInput } = useMemo(() => {
    const m2Box = m2PerBox && m2PerBox > 0 ? m2PerBox : 0;
    const perBox = piecesPerBox && piecesPerBox > 0 ? piecesPerBox : 0;
    let total = 0;
    if (mode === "m2") {
      total = parseFloat(m2) || 0;
    } else {
      const b = parseFloat(base) || 0;
      const h = parseFloat(height) || 0;
      total = b * h;
    }
    const usableTotal = Math.max(total, 0);
    const boxCount = m2Box > 0 && usableTotal > 0 ? Math.ceil(usableTotal / m2Box) : 0;
    return {
      totalM2: usableTotal,
      units: boxCount * perBox,
      boxes: boxCount,
      coveredM2: boxCount * m2Box,
      hasInput: usableTotal > 0,
    };
  }, [mode, m2, base, height, m2PerBox, piecesPerBox]);

  const fmt = (n: number) =>
    n === 0 ? "0" : Number.isInteger(n) ? n.toString() : n.toFixed(2);

  const quoteHref =
    "https://www.sarotech.us/contact" +
    `?product=${encodeURIComponent(productName)}` +
    `&variant=${encodeURIComponent(variantCode)}` +
    (boxes ? `&boxes=${boxes}` : "") +
    (totalM2 ? `&m2=${totalM2}` : "");

  return (
    <section className="calculator-section bg-[#e6e6e6] px-5 py-5">
      <div className="calculator-container mx-auto flex max-w-[1200px] flex-col gap-5">
        <div className="calculator-title-row text-center">
          <h2 className="calculator-title text-[24px] font-semibold text-saro-dark">
            Calculate how much material you need for your project
          </h2>
        </div>

        <div className="calculator-content-row grid grid-cols-1 items-center gap-[30px] lg:grid-cols-[minmax(0,462px)_repeat(4,minmax(0,1fr))]">
          {/* Input column */}
          <div className="calculator-input-column flex flex-col gap-5">
            <div className="calculation-options flex flex-wrap gap-6">
              <label className="radio-option flex cursor-pointer items-center gap-2 text-[14px] text-saro-dark">
                <input
                  type="radio"
                  value="m2"
                  checked={mode === "m2"}
                  onChange={() => setMode("m2")}
                  name="calculationType"
                  className="accent-saro-green"
                />
                <span>Calculate by m²</span>
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
                <span>Calculate Base × Height</span>
              </label>
            </div>

            {mode === "m2" ? (
              <div className="input-section flex items-center gap-3">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="15"
                  value={m2}
                  onChange={(e) => setM2(e.target.value)}
                  className="area-input h-[45px] w-[184px] rounded border border-[#ccc] bg-white px-3 text-[16px] text-black outline-none focus:border-saro-green"
                />
                <span className="unit-label text-[16px] text-saro-dark">m²</span>
              </div>
            ) : (
              <div className="input-section flex flex-wrap items-center gap-3">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="Base"
                  value={base}
                  onChange={(e) => setBase(e.target.value)}
                  className="area-input h-[45px] w-[120px] rounded border border-[#ccc] bg-white px-3 text-[16px] text-black outline-none focus:border-saro-green"
                />
                <span className="text-[16px] text-saro-dark">×</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="Height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="area-input h-[45px] w-[120px] rounded border border-[#ccc] bg-white px-3 text-[16px] text-black outline-none focus:border-saro-green"
                />
                <span className="unit-label text-[16px] text-saro-dark">m</span>
              </div>
            )}
          </div>

          {/* Result columns */}
          {[
            { label: "Total m²", value: fmt(totalM2) },
            { label: "Units", value: units.toString() },
            { label: "Boxes", value: boxes.toString() },
            { label: "m² Covered", value: fmt(coveredM2) },
          ].map((r) => (
            <div key={r.label} className="result-column flex flex-col text-center">
              <div className="result-label text-[14px] text-gray-600">
                {r.label}
              </div>
              <div className="result-value text-[28.8px] font-normal leading-none text-saro-dark">
                {r.value}
              </div>
            </div>
          ))}
        </div>

        <div className="calculator-footer-row flex flex-wrap items-center justify-between gap-4">
          <div className="recommendation-text text-[13.6px] italic text-gray-500">
            *We recommend adding 10% extra material to cover cuts and replacements.
          </div>
          <a
            href={quoteHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!hasInput}
            className={`quote-btn inline-block rounded-[5px] px-12 py-2 text-center text-[17.6px] font-semibold uppercase tracking-[1px] text-white transition-colors ${
              hasInput
                ? "bg-saro-green hover:bg-saro-green-light"
                : "bg-[#999] pointer-events-none"
            }`}
          >
            Get a Quote
          </a>
        </div>
      </div>
    </section>
  );
}
