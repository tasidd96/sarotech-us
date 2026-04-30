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

  // Key includes URL search params so a client-side nav that changes
  // the params (e.g. sub-nav dropdown click) remounts ProductsPageClient.
  // Without this, useState(initialTab/initialTypes) is only consumed on
  // first mount and subsequent prop changes are ignored — meaning the
  // listing wouldn't update until a hard refresh.
  const stateKey = `${initialTab ?? "all"}|${initialTypes.join(",")}|${initialQ}`;

  return (
    <ProductsPageClient
      key={stateKey}
      products={products}
      initialTab={initialTab}
      initialQ={initialQ}
      initialTypes={initialTypes}
    />
  );
}
