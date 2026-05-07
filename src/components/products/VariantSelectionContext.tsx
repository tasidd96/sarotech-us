"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { VariantAxis } from "@/lib/types";

/**
 * Tracks per-axis "show all" overrides so the user can opt out of
 * locking the swatch grid to a specific axis selection. Flow:
 *
 *  - Default: every axis is "locked" to whatever option the current
 *    product variant has. Swatch grid filters to siblings matching
 *    every locked axis.
 *  - Pick "All <AxisName>" in a dropdown → axis flips to override mode
 *    → swatch grid stops filtering on that axis.
 *  - Navigating to a different variant clears the override (the new
 *    variant has a real selection on every axis).
 *
 * Implemented as Context because VariantAxisDropdowns (writes the flag)
 * and VariantSwatches (reads the flag) are siblings on the PDP and
 * neither owns the other.
 */

export const ALL_OVERRIDE = "__all__";

/**
 * Picks at most ONE axis to surface as a dropdown (and to lock the
 * swatch grid against). Rule:
 *   1. Prefer the first non-Color axis (Ribs, Size, Style, …) — these
 *      are the categorical attributes; Color is picked from the
 *      visual swatch grid.
 *   2. Fall back to the first axis (typically Color) if no non-Color
 *      axis exists. This is what Cladding gets — it's a Color-only
 *      product, and a Color dropdown is better than no dropdown.
 *
 * Both VariantAxisDropdowns (renders) and VariantSwatches (locks the
 * grid) call this so they stay in sync.
 */
export function pickControlledAxis(
  axes: VariantAxis[] | undefined
): VariantAxis | null {
  if (!axes || axes.length === 0) return null;
  const nonColor = axes.find((a) => !/^color$/i.test(a.name));
  return nonColor ?? axes[0] ?? null;
}

interface Ctx {
  /** Map of axis name → boolean (true = "All <axis>" picked). */
  overrides: Record<string, boolean>;
  setOverride: (axisName: string, on: boolean) => void;
}

const VariantSelectionContext = createContext<Ctx>({
  overrides: {},
  setOverride: () => {},
});

export function VariantSelectionProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const setOverride = (axisName: string, on: boolean) => {
    setOverrides((prev) => {
      if (prev[axisName] === on) return prev;
      const next = { ...prev };
      if (on) next[axisName] = true;
      else delete next[axisName];
      return next;
    });
  };
  return (
    <VariantSelectionContext.Provider value={{ overrides, setOverride }}>
      {children}
    </VariantSelectionContext.Provider>
  );
}

export function useVariantSelection() {
  return useContext(VariantSelectionContext);
}
