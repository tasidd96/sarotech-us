"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Product, VariantAxis } from "@/lib/types";
import { variantSlug } from "@/lib/slug";
import {
  ALL_OVERRIDE,
  pickControlledAxis,
  useVariantSelection,
} from "./VariantSelectionContext";

type Props = {
  product: Product;
  siblings: Product[];
  productSlug: string;
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
 *  with body copy or a heading. The first menu item is always
 *  "All <AxisName>" so the user can clear the swatch-grid lock without
 *  having to navigate to a specific variant first. */
function AxisDropdown({
  axis,
  currentValue,
  available,
  onChange,
  overrideOn,
}: {
  axis: VariantAxis;
  currentValue: string;
  available: Set<string>;
  onChange: (value: string) => void;
  overrideOn: boolean;
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
  const allLabel = `All ${axis.name}`;
  // What the trigger button shows. When the override is on we surface
  // "All <AxisName>" so the user knows the swatch grid is unlocked.
  const display = overrideOn
    ? allLabel
    : currentValue || visibleOptions[0]?.name || "—";

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
        {/* Special "All <AxisName>" pseudo-option: turns off the
            swatch-grid lock for this axis so the user can browse every
            variant regardless of what's selected. */}
        <button
          type="button"
          role="option"
          aria-selected={overrideOn}
          onClick={() => {
            onChange(ALL_OVERRIDE);
            setOpen(false);
          }}
          className={`sort-dropdown-item block w-full border-b border-gray-100 px-4 py-2 text-left text-[14px] transition-colors hover:bg-gray-50 ${
            overrideOn ? "text-saro-green" : "text-gray-700"
          }`}
        >
          {allLabel}
        </button>
        {visibleOptions.map((o) => (
          <button
            key={o.id}
            type="button"
            role="option"
            aria-selected={!overrideOn && currentValue === o.name}
            onClick={() => {
              onChange(o.name);
              setOpen(false);
            }}
            className={`sort-dropdown-item block w-full px-4 py-2 text-left text-[14px] transition-colors hover:bg-gray-50 ${
              !overrideOn && currentValue === o.name
                ? "text-saro-green"
                : "text-gray-700"
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
 * Renders ONE custom dropdown for the product's "controlled" axis.
 * Rule (see pickControlledAxis): prefer the first non-Color axis (Ribs,
 * Size, Style, …); fall back to the first axis (typically Color) for
 * Color-only products like Cladding so they still get a dropdown.
 *
 * Earlier this component rendered every non-Color axis. Talha asked to
 * cap at one — extra axes were noisy on products with multiple
 * categorical attributes — and to ensure Cladding (no non-Color axis)
 * still shows a dropdown.
 */
export default function VariantAxisDropdowns({
  product,
  siblings,
  productSlug,
}: Props) {
  const router = useRouter();
  const { overrides, setOverride } = useVariantSelection();
  const allAxes = product.variantAxes ?? [];
  const controlled = pickControlledAxis(allAxes);
  const axes: VariantAxis[] = controlled ? [controlled] : [];
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
    // "All <AxisName>" sentinel OR re-clicking the currently selected
    // option (deselect) → flip the override flag on, no nav. The
    // VariantSwatches grid (subscribed via context) will stop filtering
    // siblings on this axis and surface every variant.
    if (
      optionName === ALL_OVERRIDE ||
      selected[axisName] === optionName
    ) {
      setOverride(axisName, true);
      return;
    }
    // Picking a different real option clears any prior "all" override
    // on this axis — user has narrowed the selection again.
    setOverride(axisName, false);
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
            overrideOn={!!overrides[axis.name]}
          />
        );
      })}
    </span>
  );
}
