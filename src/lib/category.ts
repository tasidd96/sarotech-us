import { Product, ProductCategory } from "./types";

/**
 * Returns the categories a product should appear under. Currently strict:
 * each product only surfaces under its declared category. (We previously
 * cross-listed exterior under interior, but Talha clarified that's not
 * desired — if no interior-only product exists in HL, the Interior tab
 * should be empty / hidden, not full of cross-listed exterior items.)
 *
 * If we later want to support multi-category products (e.g. read from HL
 * collectionIds, or add an explicit `additionalCategories` field), this
 * is the single point to extend.
 */
export function categoriesForProduct(
  p: Pick<Product, "category">
): ProductCategory[] {
  return [p.category];
}

export function productMatchesCategory(
  p: Pick<Product, "category">,
  category: ProductCategory
): boolean {
  return categoriesForProduct(p).includes(category);
}
