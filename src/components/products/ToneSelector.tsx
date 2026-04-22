"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { variantSlug } from "@/lib/slug";

type Props = {
  siblings: Product[];
  currentSku: string;
  productSlug: string;
  activeToneFamily: string;
  variantCode: string;
};

function Chevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function ToneSelector({
  siblings,
  currentSku,
  productSlug,
  activeToneFamily,
  variantCode,
}: Props) {
  const families = useMemo(() => {
    const seen = new Set<string>();
    const ordered: string[] = [];
    for (const s of siblings) {
      const f = s.detail?.toneFamily;
      if (f && !seen.has(f)) {
        seen.add(f);
        ordered.push(f);
      }
    }
    return ordered;
  }, [siblings]);

  const [selectedFamily, setSelectedFamily] = useState(activeToneFamily);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  const filtered = useMemo(
    () => siblings.filter((s) => s.detail?.toneFamily === selectedFamily),
    [siblings, selectedFamily]
  );

  const hasMultipleFamilies = families.length > 1;

  return (
    <>
      {/* Tone family dropdown row */}
      <div className="product-code-section flex items-center justify-between border-t-2 border-black p-[10px]">
        <div
          ref={ref}
          className="product-tone-dropdown-container relative flex items-center gap-2 text-[16px]"
        >
          <span className="text-saro-dark">Tone:</span>
          <button
            type="button"
            onClick={() => hasMultipleFamilies && setOpen((v) => !v)}
            disabled={!hasMultipleFamilies}
            className={`sort-dropdown-btn flex items-center gap-1 py-1 transition-colors ${
              hasMultipleFamilies
                ? "hover:text-saro-green"
                : "cursor-default"
            }`}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label="Change tone family"
          >
            <span className="underline underline-offset-2">{selectedFamily}</span>
            {hasMultipleFamilies && <Chevron />}
          </button>
          <div
            className={`sort-dropdown-menu ${open ? "open" : ""} absolute left-0 top-full z-[500] mt-2 min-w-[180px] rounded-[5px] bg-white py-1`}
            style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
            role="listbox"
          >
            {families.map((f) => (
              <button
                key={f}
                type="button"
                role="option"
                aria-selected={selectedFamily === f}
                onClick={() => {
                  setSelectedFamily(f);
                  setOpen(false);
                }}
                className={`sort-dropdown-item block w-full px-4 py-2 text-left text-[14px] transition-colors hover:bg-gray-50 ${
                  selectedFamily === f ? "text-saro-green" : "text-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <span className="product-finish-name text-[14.4px] text-saro-dark">
          {variantCode}
        </span>
      </div>

      {/* Material-preview swatches filtered by family */}
      <div className="product-finish-section flex flex-col gap-4 px-[10px]">
        <p className="text-[14.4px] text-gray-600">
          Select the tone you&apos;re looking for
        </p>
        <div className="tone-swatch-grid grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-3">
          {filtered.map((s) => {
            const isActive = s.sku === currentSku;
            const sSlug = variantSlug(s);
            return (
              <Link
                key={s.sku}
                href={`/products/${productSlug}/${sSlug}`}
                aria-label={`${s.sku}-${s.variantName}`}
                aria-current={isActive ? "true" : undefined}
                className={`group relative flex flex-col items-center gap-1.5 ${
                  isActive ? "" : "hover:scale-[1.02]"
                } transition-transform`}
              >
                <span
                  className={`relative block aspect-square w-full overflow-hidden rounded-md border-2 transition-colors ${
                    isActive
                      ? "border-saro-green shadow-md"
                      : "border-transparent group-hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </span>
                <span className="block w-full truncate text-center text-[11px] leading-tight text-gray-600">
                  {s.variantName}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
