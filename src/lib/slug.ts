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
