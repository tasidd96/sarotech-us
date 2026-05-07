"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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
