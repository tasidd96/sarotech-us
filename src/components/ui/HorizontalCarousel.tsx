"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ScrimColor = "white" | "black" | "dark";

type Props = {
  children: React.ReactNode;
  scrollStep?: number;
  scrimColor?: ScrimColor;
  ariaLabel?: string;
};

const SCRIM_FROM: Record<ScrimColor, string> = {
  white: "from-white",
  black: "from-black",
  dark: "from-saro-dark",
};

export default function HorizontalCarousel({
  children,
  scrollStep = 244,
  scrimColor = "white",
  ariaLabel = "carousel",
}: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -scrollStep : scrollStep,
      behavior: "smooth",
    });
  };

  const scrimFrom = SCRIM_FROM[scrimColor];

  return (
    <div className="relative">
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r ${scrimFrom} to-transparent transition-opacity duration-200 ${
          canScrollLeft ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l ${scrimFrom} to-transparent transition-opacity duration-200 ${
          canScrollRight ? "opacity-100" : "opacity-0"
        }`}
      />

      <button
        type="button"
        aria-label={`Scroll ${ariaLabel} left`}
        onClick={() => scrollBy("left")}
        className={`absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-saro-green text-white shadow-lg transition-all duration-200 hover:bg-saro-green-light focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
          canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label={`Scroll ${ariaLabel} right`}
        onClick={() => scrollBy("right")}
        className={`absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-saro-green text-white shadow-lg transition-all duration-200 hover:bg-saro-green-light focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
          canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div
        ref={scrollerRef}
        className="scrollbar-hide flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4"
      >
        {children}
      </div>
    </div>
  );
}
