"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, VariantAxis } from "@/lib/types";
import { variantSlug, variantLabel } from "@/lib/slug";
import { useVariantSelection } from "./VariantSelectionContext";

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
  const { overrides } = useVariantSelection();

  const swatches = useMemo(() => {
    const axes: VariantAxis[] = product.variantAxes ?? [];
    const selected = product.selectedOptions ?? {};
    // Lock all non-primary axes (Color is index 0) unless the user has
    // explicitly picked "All <AxisName>" for that axis.
    const lockedAxes = axes.slice(1).filter((axis) => !overrides[axis.name]);

    const seen = new Set<string>();
    return siblings.filter((s) => {
      if (lockedAxes.length > 0) {
        if (!s.selectedOptions) return false;
        const allMatch = lockedAxes.every(
          (axis) => s.selectedOptions?.[axis.name] === selected[axis.name]
        );
        if (!allMatch) return false;
      }
      const slug = variantSlug(s);
      if (seen.has(slug)) return false;
      seen.add(slug);
      return true;
    });
  }, [product.variantAxes, product.selectedOptions, siblings, overrides]);

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
          return (
            <Link
              key={s.id}
              href={`/products/${productSlug}/${sSlug}`}
              aria-label={variantLabel(s)}
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
  );
}
