import { Product } from "./types";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function productSlug(product: Pick<Product, "name">): string {
  return slugify(product.name);
}

/**
 * Display label for a variant. Combines sku + variantName, but if the
 * variantName already begins with the sku (e.g. HL-driven names like
 * "A13-Teak Brushed" with sku "A13"), returns the variantName as-is so
 * we don't render "A13-A13-Teak Brushed".
 */
export function variantLabel(
  product: Pick<Product, "sku" | "variantName">
): string {
  if (!product.sku) return product.variantName;
  if (product.variantName.startsWith(`${product.sku}-`)) {
    return product.variantName;
  }
  return `${product.sku}-${product.variantName}`;
}

export function variantSlug(product: Pick<Product, "sku" | "variantName">): string {
  return slugify(variantLabel(product));
}

export function findProductVariants(
  productSlug: string,
  catalog: Product[]
): Product[] {
  return catalog.filter((p) => slugify(p.name) === productSlug);
}

export function findVariant(
  productSlugInput: string,
  variantSlugInput: string,
  catalog: Product[]
): Product | null {
  return (
    catalog.find(
      (p) =>
        slugify(p.name) === productSlugInput &&
        variantSlug(p) === variantSlugInput
    ) ?? null
  );
}

/**
 * Variant resolution that honors axis search params. variantSlug only
 * encodes sku + variantName, so two variants that share a name but
 * differ on a non-Color axis (e.g. A50-Antique Brushed in 3-Ribs vs
 * 4-Ribs) collide on the same URL slug. The dropdown / swatch grid
 * disambiguates by appending the controlled axis as a query param
 * (e.g. `?Ribs=4-Ribs`); this helper picks the matching variant.
 *
 * Falls back to the first slug match when no params are supplied or
 * none match — keeps clean-URL deep links working.
 */
export function findVariantWithParams(
  productSlugInput: string,
  variantSlugInput: string,
  axisFilters: Record<string, string>,
  catalog: Product[]
): Product | null {
  const matches = catalog.filter(
    (p) =>
      slugify(p.name) === productSlugInput &&
      variantSlug(p) === variantSlugInput
  );
  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0];
  const filterEntries = Object.entries(axisFilters).filter(
    ([, v]) => typeof v === "string" && v.length > 0
  );
  if (filterEntries.length === 0) return matches[0];
  const exact = matches.find((p) =>
    filterEntries.every(([k, v]) => p.selectedOptions?.[k] === v)
  );
  return exact ?? matches[0];
}
