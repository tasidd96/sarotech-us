import { getCatalog } from "@/lib/catalog";
import ProductsPageClient from "@/components/products/ProductsPageClient";
import type { ProductCategory } from "@/lib/types";

type SearchParams = { tab?: string; q?: string };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const products = await getCatalog();
  const initialTab = (searchParams.tab as ProductCategory) || null;
  const initialQ = searchParams.q ?? "";

  return (
    <ProductsPageClient
      products={products}
      initialTab={initialTab}
      initialQ={initialQ}
    />
  );
}
