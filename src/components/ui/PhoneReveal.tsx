"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";

type Props = {
  parts: string[];
  className?: string;
  style?: CSSProperties;
  /** Label shown before the user reveals the number. Ignored when `children` is set (icon mode). */
  hiddenLabel?: string;
  format?: (parts: string[]) => string;
  /** If provided, renders as an icon-mode button that dials on click without ever exposing the number in HTML. */
  children?: ReactNode;
  ariaLabel?: string;
};

function defaultFormat(parts: string[]) {
  if (parts.length === 4) {
    return `(${parts[1]}) ${parts[2]}-${parts[3]}`;
  }
  return parts.join(" ");
}

export default function PhoneReveal({
  parts,
  className,
  style,
  hiddenLabel = "Show phone number",
  format = defaultFormat,
  children,
  ariaLabel,
}: Props) {
  const [revealed, setRevealed] = useState(false);

  // Icon mode — no visible number, dial on click without ever putting tel: in static HTML.
  if (children) {
    return (
      <button
        type="button"
        onClick={() => {
          window.location.href = `tel:${parts.join("")}`;
        }}
        className={className}
        style={style}
        aria-label={ariaLabel ?? hiddenLabel}
      >
        {children}
      </button>
    );
  }

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className={className}
        style={style}
        aria-label={ariaLabel ?? hiddenLabel}
      >
        {hiddenLabel}
      </button>
    );
  }

  const tel = parts.join("");
  return (
    <a href={`tel:${tel}`} className={className} style={style} rel="nofollow">
      {format(parts)}
    </a>
  );
}
