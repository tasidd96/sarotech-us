"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { variantSlug, variantLabel } from "@/lib/slug";

type Props = {
  product: Product;
  siblings: Product[];
  productSlug: string;
};

/**
 * Swatch grid for direct visual variant selection — typically the
 * Color/finish axis. Shows every sibling regardless of which other-axis
 * dropdowns are currently picked, so a user on a 3-Ribs product can
 * still tap straight to a 4-Ribs swatch.
 */
export default function VariantSwatches({
  product,
  siblings,
  productSlug,
}: Props) {
  const swatches = useMemo(() => {
    const seen = new Set<string>();
    return siblings.filter((s) => {
      const slug = variantSlug(s);
      if (seen.has(slug)) return false;
      seen.add(slug);
      return true;
    });
  }, [siblings]);

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
