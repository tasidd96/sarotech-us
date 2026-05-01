import type { Metadata } from "next";
import ProductsSubNav from "@/components/layout/ProductsSubNav";
import { getCatalog } from "@/lib/catalog";
import { categoriesForProduct } from "@/lib/category";
import { ProductCategory, ProductType } from "@/lib/types";

const PRODUCTS_TITLE = "Products";
const PRODUCTS_DESCRIPTION =
  "Browse SARO TECH's full catalog of WPC wall panels, floor decking, synthetic marble, wall cladding, and accessories. Premium architectural finishes for interior and exterior projects.";

export const metadata: Metadata = {
  title: PRODUCTS_TITLE,
  description: PRODUCTS_DESCRIPTION,
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    title: `${PRODUCTS_TITLE} | SARO TECH USA`,
    description: PRODUCTS_DESCRIPTION,
    url: "/products",
  },
  twitter: {
    card: "summary_large_image",
    title: `${PRODUCTS_TITLE} | SARO TECH USA`,
    description: PRODUCTS_DESCRIPTION,
  },
};

export default async function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Compute which product types are present per category in the live
  // catalog. The sub-nav uses this to only show categories + types that
  // actually have visible products today (driven by HL stock + sellable
  // filter), rather than the static seed list.
  const catalog = await getCatalog();
  const typesByCategory: Partial<Record<ProductCategory, ProductType[]>> = {};
  for (const p of catalog) {
    // categoriesForProduct() encodes cross-listing rules (e.g. exterior
    // products also surface under interior). Apply the same rule here so
    // the sub-nav reflects what the listing page filter will actually show.
    for (const cat of categoriesForProduct(p)) {
      const list = typesByCategory[cat] ?? [];
      if (!list.includes(p.productType)) list.push(p.productType);
      typesByCategory[cat] = list;
    }
  }

  return (
    <>
      <ProductsSubNav typesByCategory={typesByCategory} />
      {children}
    </>
  );
}
