"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { variantSlug, variantLabel } from "@/lib/slug";
import {
  pickControlledAxis,
  useVariantSelection,
} from "./VariantSelectionContext";

type Props = {
  product: Product;
  siblings: Product[];
  productSlug: string;
};

/**
 * Swatch grid for direct visual variant selection.
 *
 * By default the grid is LOCKED to the current variant's non-Color axis
 * selections — i.e. only siblings that match the same Size/Rib/etc. are
 * visible, so the user sees colors that come in their chosen size. The
 * lock can be lifted per-axis via the "All <AxisName>" option in the
 * VariantAxisDropdowns above (state lives in VariantSelectionContext).
 *
 * Color axis (the first axis) is never locked — that's what the swatch
 * grid varies along.
 */
export default function VariantSwatches({
  product,
  siblings,
  productSlug,
}: Props) {
  const { overrides, setOverride } = useVariantSelection();
  const controlled = pickControlledAxis(product.variantAxes);

  const swatches = useMemo(() => {
    const selected = product.selectedOptions ?? {};
    // Lock the SAME axis that VariantAxisDropdowns surfaces (the
    // "controlled" axis — first non-Color, falling back to first axis
    // for Color-only products like Cladding). Override on that axis
    // unlocks the grid. Other axes (if any) are ignored — they don't
    // have a dropdown, so the user can't navigate between them anyway.
    const overrideOn = !!(controlled && overrides[controlled.name]);
    const lockedAxes = controlled && !overrideOn ? [controlled] : [];

    const seen = new Set<string>();
    return siblings.filter((s) => {
      if (lockedAxes.length > 0) {
        // Lenient match: only reject when the sibling has a known value
        // for the axis that explicitly differs from the current selection.
        // Missing or empty axis data is ignored — HL's variantOptionIds
        // aren't always wired, and an empty `selectedOptions` shouldn't
        // make a sibling vanish from the swatch grid.
        const allMatch = lockedAxes.every((axis) => {
          const sibValue = s.selectedOptions?.[axis.name];
          if (sibValue === undefined) return true;
          return sibValue === selected[axis.name];
        });
        if (!allMatch) return false;
      }
      // Dedup key: when the grid is unlocked, include the controlled
      // axis value so duplicates with the same name but different
      // axis values (e.g. A50-Antique Brushed in 3-Ribs vs 4-Ribs) each
      // get their own swatch. When locked, every swatch already shares
      // the same axis value, so slug-only is enough.
      const slug = variantSlug(s);
      const axisVal =
        overrideOn && controlled
          ? s.selectedOptions?.[controlled.name] ?? ""
          : "";
      const key = axisVal ? `${slug}|${axisVal}` : slug;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [controlled, product.selectedOptions, siblings, overrides]);

  if (swatches.length === 0) return null;

  return (
    <div className="product-finish-section flex flex-col gap-4 px-[10px]">
      <p className="text-[14.4px] text-gray-600">
        Or pick a variant directly
      </p>
      <div className="tone-swatch-grid grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-3">
        {swatches.map((s) => {
          const isActive = s.id === product.id;
          const sSlug = variantSlug(s);
          // Pin the controlled-axis value into the URL when the grid is
          // showing all variants; otherwise siblings sharing a slug
          // (e.g. A50-Antique Brushed in 3-Ribs vs 4-Ribs) would all
          // route to the same URL and `findVariantWithParams` would
          // fall back to the first match.
          const overrideOn = !!(controlled && overrides[controlled.name]);
          const sAxisVal = controlled
            ? s.selectedOptions?.[controlled.name]
            : undefined;
          const href =
            overrideOn && controlled && sAxisVal
              ? `/products/${productSlug}/${sSlug}?${new URLSearchParams({
                  [controlled.name]: sAxisVal,
                }).toString()}`
              : `/products/${productSlug}/${sSlug}`;
          // Suffix the label with the axis value when the grid is
          // unlocked so the user can tell duplicates apart.
          const label =
            overrideOn && sAxisVal
              ? `${s.variantName} · ${sAxisVal}`
              : s.variantName;
          const inner = (
            <>
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
                {label}
              </span>
            </>
          );
          const cls = `group relative flex flex-col items-center gap-1.5 ${
            isActive ? "" : "hover:scale-[1.02]"
          } transition-transform`;
          // Re-clicking the active swatch flips on the "All <Axis>"
          // override so the grid expands to every variant — same pattern
          // as re-clicking the active dropdown option. No-op when the
          // product has no controlled axis (single-variant items).
          if (isActive) {
            return (
              <button
                key={s.id}
                type="button"
                aria-label={`Show all ${controlled?.name ?? "variants"}`}
                aria-current="true"
                onClick={() => {
                  if (controlled) setOverride(controlled.name, true);
                }}
                className={`${cls} text-left`}
              >
                {inner}
              </button>
            );
          }
          return (
            <Link
              key={`${s.id}|${sAxisVal ?? ""}`}
              href={href}
              aria-label={
                overrideOn && sAxisVal
                  ? `${variantLabel(s)}, ${sAxisVal}`
                  : variantLabel(s)
              }
              className={cls}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
