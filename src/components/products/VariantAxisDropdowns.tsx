"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Product, VariantAxis } from "@/lib/types";
import { variantSlug } from "@/lib/slug";

type Props = {
  product: Product;
  siblings: Product[];
  productSlug: string;
  /**
   * Filter the parent's `variantAxes` before rendering. Defaults to
   * skipping any axis named "Color" (case-insensitive) since color is
   * picked via the swatch grid, which is the more visual pattern. Pass
   * `() => true` to render every axis as a dropdown.
   */
  axisFilter?: (axis: VariantAxis, index: number) => boolean;
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

/** One axis dropdown — custom button + popup, designed to sit inline
 *  with body copy or a heading. */
function AxisDropdown({
  axis,
  currentValue,
  available,
  onChange,
}: {
  axis: VariantAxis;
  currentValue: string;
  available: Set<string>;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  const visibleOptions = axis.options.filter((o) => available.has(o.name));
  const hasMultiple = visibleOptions.length > 1;
  const display = currentValue || visibleOptions[0]?.name || "—";

  return (
    <div
      ref={ref}
      className="product-tone-dropdown-container relative inline-flex items-baseline gap-1 text-[14px]"
    >
      <span className="text-gray-500">{axis.name}:</span>
      <button
        type="button"
        onClick={() => hasMultiple && setOpen((v) => !v)}
        disabled={!hasMultiple}
        className={`sort-dropdown-btn inline-flex items-center gap-1 transition-colors ${
          hasMultiple
            ? "cursor-pointer text-saro-dark hover:text-saro-green"
            : "cursor-default text-saro-dark"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Change ${axis.name}`}
      >
        <span className="font-medium underline underline-offset-2">
          {display}
        </span>
        {hasMultiple && <Chevron />}
      </button>
      <div
        className={`sort-dropdown-menu ${
          open ? "open" : ""
        } absolute left-0 top-full z-[500] mt-2 min-w-[180px] rounded-[5px] bg-white py-1`}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
        role="listbox"
      >
        {visibleOptions.map((o) => (
          <button
            key={o.id}
            type="button"
            role="option"
            aria-selected={currentValue === o.name}
            onClick={() => {
              onChange(o.name);
              setOpen(false);
            }}
            className={`sort-dropdown-item block w-full px-4 py-2 text-left text-[14px] transition-colors hover:bg-gray-50 ${
              currentValue === o.name ? "text-saro-green" : "text-gray-700"
            }`}
          >
            {o.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Inline-friendly dropdown row for HighLevel variant axes. Renders one
 * compact dropdown per axis that passes `axisFilter`. By default the
 * first axis (Color) is skipped — colors are selected from the swatch
 * grid (a more visual pattern). Remaining axes (Size, Rib, Style, …)
 * sit inline with the product title on the PDP.
 */
export default function VariantAxisDropdowns({
  product,
  siblings,
  productSlug,
  axisFilter = (axis) => !/^color$/i.test(axis.name),
}: Props) {
  const router = useRouter();
  const allAxes = product.variantAxes ?? [];
  const axes = allAxes.filter((axis, i) => axisFilter(axis, i));
  const selected = product.selectedOptions ?? {};

  const availableByAxis = useMemo(() => {
    const result: Record<string, Set<string>> = {};
    for (const sib of siblings) {
      if (!sib.selectedOptions) continue;
      for (const [axisName, optionName] of Object.entries(
        sib.selectedOptions
      )) {
        if (!result[axisName]) result[axisName] = new Set();
        result[axisName].add(optionName);
      }
    }
    return result;
  }, [siblings]);

  if (axes.length === 0) return null;

  const handleChange = (axisName: string, optionName: string) => {
    const newCombo = { ...selected, [axisName]: optionName };
    const exact = siblings.find((s) => {
      if (!s.selectedOptions) return false;
      return Object.entries(newCombo).every(
        ([k, v]) => s.selectedOptions?.[k] === v
      );
    });
    const partial = siblings.find(
      (s) => s.selectedOptions?.[axisName] === optionName
    );
    const target = exact ?? partial;
    if (target) {
      router.push(`/products/${productSlug}/${variantSlug(target)}`);
    }
  };

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-1">
      {axes.map((axis) => {
        const available = availableByAxis[axis.name] ?? new Set<string>();
        if (!axis.options.some((o) => available.has(o.name))) return null;
        return (
          <AxisDropdown
            key={axis.id}
            axis={axis}
            currentValue={selected[axis.name] ?? ""}
            available={available}
            onChange={(value) => handleChange(axis.name, value)}
          />
        );
      })}
    </span>
  );
}
