import { Product, ProductCategory } from "./types";

/**
 * Cross-category rule: exterior-rated products can also be used indoors,
 * so they appear under the "interior" tab in addition to "exterior". The
 * inverse is NOT true — interior-only products are not weatherproof and
 * stay in the interior tab only.
 *
 * Update this function if more cross-listing rules are added (e.g. an
 * accessory that also belongs in interior).
 */
export function categoriesForProduct(
  p: Pick<Product, "category">
): ProductCategory[] {
  if (p.category === "exterior") return ["exterior", "interior"];
  return [p.category];
}

export function productMatchesCategory(
  p: Pick<Product, "category">,
  category: ProductCategory
): boolean {
  return categoriesForProduct(p).includes(category);
}
