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

export function variantSlug(product: Pick<Product, "sku" | "variantName">): string {
  return slugify(`${product.sku} ${product.variantName}`);
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
