"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Product, VariantAxis } from "@/lib/types";
import { variantSlug, variantLabel } from "@/lib/slug";

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

/** One axis dropdown — same custom button + popup pattern as ToneSelector. */
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
      className="product-tone-dropdown-container relative flex items-center gap-2 text-[16px]"
    >
      <span className="text-saro-dark">{axis.name}:</span>
      <button
        type="button"
        onClick={() => hasMultiple && setOpen((v) => !v)}
        disabled={!hasMultiple}
        className={`sort-dropdown-btn flex items-center gap-1 py-1 transition-colors ${
          hasMultiple ? "hover:text-saro-green" : "cursor-default"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Change ${axis.name}`}
      >
        <span className="underline underline-offset-2">{display}</span>
        {hasMultiple && <Chevron />}
      </button>
      <div
        className={`sort-dropdown-menu ${open ? "open" : ""} absolute left-0 top-full z-[500] mt-2 min-w-[200px] rounded-[5px] bg-white py-1`}
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
 * Renders one custom dropdown per HighLevel variant axis (Color, Size, …)
 * laid out horizontally on desktop and wrapping on smaller widths. Style
 * matches the original ToneSelector (button + underlined value + chevron,
 * popup menu with shadow). Below the dropdown row, a swatches grid lets
 * the user click a sibling directly.
 */
export default function VariantSelector({
  product,
  siblings,
  productSlug,
}: Props) {
  const router = useRouter();
  const axes = product.variantAxes ?? [];
  const selected = product.selectedOptions ?? {};

  // For each axis, the option names that exist on at least one visible
  // sibling. Filters out options that aren't actually buyable today.
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

  // De-duped sibling list for the swatches grid (one card per unique slug).
  const swatches = useMemo(() => {
    const seen = new Set<string>();
    return siblings.filter((s) => {
      const slug = variantSlug(s);
      if (seen.has(slug)) return false;
      seen.add(slug);
      return true;
    });
  }, [siblings]);

  if (axes.length === 0) return null;

  const handleChange = (axisName: string, optionName: string) => {
    const newCombo = { ...selected, [axisName]: optionName };

    // Prefer an exact match across all axes.
    const exact = siblings.find((s) => {
      if (!s.selectedOptions) return false;
      return Object.entries(newCombo).every(
        ([k, v]) => s.selectedOptions?.[k] === v
      );
    });
    // Fallback: any sibling where the changed axis matches.
    const partial = siblings.find(
      (s) => s.selectedOptions?.[axisName] === optionName
    );

    const target = exact ?? partial;
    if (target) {
      router.push(`/products/${productSlug}/${variantSlug(target)}`);
    }
  };

  return (
    <>
      {/* Axis selectors row — horizontal on desktop, wrap on mobile */}
      <div className="product-code-section flex flex-wrap items-center gap-x-8 gap-y-3 border-t-2 border-black p-[10px]">
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
        <span className="product-finish-name ml-auto text-[14.4px] text-saro-dark">
          {variantLabel(product)}
        </span>
      </div>

      {/* Swatches grid — click a swatch to jump straight to that variant */}
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
    </>
  );
}
