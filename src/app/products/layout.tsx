import type { Metadata } from "next";
import ProductsSubNav from "@/components/layout/ProductsSubNav";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse SARO TECH's full catalog of WPC wall panels, floor decking, synthetic marble, wall cladding, and accessories. Premium architectural finishes for interior and exterior projects.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProductsSubNav />
      {children}
    </>
  );
}
