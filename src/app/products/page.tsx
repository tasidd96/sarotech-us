import { getCatalog } from "@/lib/catalog";
import ProductsPageClient from "@/components/products/ProductsPageClient";
import type { ProductCategory, ProductType } from "@/lib/types";

type SearchParams = { tab?: string; q?: string; type?: string | string[] };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const products = await getCatalog();
  const initialTab = (searchParams.tab as ProductCategory) || null;
  const initialQ = searchParams.q ?? "";
  // `type=` is sent by the sub-nav dropdown (and can repeat for multiple
  // selections, e.g. ?type=floor-decking&type=wall-panels). Normalize to
  // an array so the listing page pre-selects those types.
  const rawType = searchParams.type;
  const initialTypes: ProductType[] = Array.isArray(rawType)
    ? (rawType as ProductType[])
    : rawType
      ? [rawType as ProductType]
      : [];

  return (
    <ProductsPageClient
      products={products}
      initialTab={initialTab}
      initialQ={initialQ}
      initialTypes={initialTypes}
    />
  );
}
