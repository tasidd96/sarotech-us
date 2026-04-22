"use client";

import { ElementType, useEffect, useState } from "react";

type Props = {
  /** Static text rendered on every frame (e.g. "Next-generation finishes,"). */
  prefix?: string;
  /** Variable endings that get typed in and deleted in rotation. */
  messages: string[];
  className?: string;
  /** Element tag to render (defaults to h1). Use "p" or "span" in body copy. */
  as?: ElementType;
  /** ms per character while typing */
  typeSpeed?: number;
  /** ms per character while deleting */
  deleteSpeed?: number;
  /** ms to hold a fully-typed message before deleting */
  holdMs?: number;
};

export default function TypewriterHeading({
  prefix = "",
  messages,
  className = "",
  as,
  typeSpeed = 55,
  deleteSpeed = 30,
  holdMs = 2200,
}: Props) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");

  useEffect(() => {
    const current = messages[index];

    if (phase === "typing") {
      if (displayed.length < current.length) {
        const t = window.setTimeout(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          typeSpeed,
        );
        return () => window.clearTimeout(t);
      }
      const t = window.setTimeout(() => setPhase("deleting"), holdMs);
      return () => window.clearTimeout(t);
    }

    if (phase === "deleting") {
      if (displayed.length > 0) {
        const t = window.setTimeout(
          () => setDisplayed(current.slice(0, displayed.length - 1)),
          deleteSpeed,
        );
        return () => window.clearTimeout(t);
      }
      setIndex((i) => (i + 1) % messages.length);
      setPhase("typing");
    }
  }, [displayed, phase, index, messages, typeSpeed, deleteSpeed, holdMs]);

  // Longest suffix wins for height reservation. The prefix is identical in
  // every frame so only the suffix varies.
  const longestSuffix = messages.reduce((a, b) => (a.length >= b.length ? a : b));

  const Tag = (as ?? "h1") as ElementType;

  return (
    <Tag className={`relative ${className}`}>
      {/* Invisible sizer: prefix + longest suffix. Reserves enough vertical
          space to keep mobile height stable across typing/deleting. */}
      <span aria-hidden className="invisible block whitespace-pre-wrap">
        {prefix}
        {longestSuffix}
      </span>
      {/* Visible overlay: prefix persistent, suffix animated. */}
      <span className="absolute inset-0 block whitespace-pre-wrap" aria-live="polite">
        {prefix}
        {displayed}
        <span
          aria-hidden
          className="ml-[1px] inline-block w-[2px] animate-pulse bg-current align-baseline"
          style={{ height: "0.9em" }}
        />
      </span>
    </Tag>
  );
}
