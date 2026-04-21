"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { products } from "@/data/products";

const CARD_STEP = 244;

export default function PopularProducts() {
  const featured = products.filter((p) => p.featured);
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
      left: direction === "left" ? -CARD_STEP : CARD_STEP,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12 lg:py-16">
      <div className="container-std">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Bestsellers</h2>
          <Link href="/products" className="text-sm text-saro-green hover:underline">
            View all &rarr;
          </Link>
        </div>

        <div className="group/bestsellers relative">
          {/* Left fade scrim */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent transition-opacity duration-200 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Right fade scrim */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent transition-opacity duration-200 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Left arrow */}
          <button
            type="button"
            aria-label="Scroll bestsellers left"
            onClick={() => scrollBy("left")}
            className={`absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-saro-green text-white shadow-lg transition-all duration-200 hover:bg-saro-green-light focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              canScrollLeft
                ? "opacity-0 group-hover/bestsellers:opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          {/* Right arrow */}
          <button
            type="button"
            aria-label="Scroll bestsellers right"
            onClick={() => scrollBy("right")}
            className={`absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-saro-green text-white shadow-lg transition-all duration-200 hover:bg-saro-green-light focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              canScrollRight
                ? "opacity-0 group-hover/bestsellers:opacity-100"
                : "pointer-events-none opacity-0"
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
            {featured.map((product) => (
              <div key={product.id} className="w-[220px] min-w-[220px] snap-center flex-shrink-0">
                <div className="relative mb-3 h-[270px] w-[220px] overflow-hidden rounded-lg bg-gray-200">
                  <Image
                    src={product.image}
                    alt={`${product.name} - ${product.variantName}`}
                    fill
                    className="object-cover"
                    sizes="220px"
                  />
                </div>
                <h3 className="text-sm font-medium">{product.name}</h3>
                <p className="text-xs text-gray-500">{product.variantName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
