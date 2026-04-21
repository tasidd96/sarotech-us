import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        No products found matching your filters.
      </div>
    );
  }

  return (
    <div className="products-page-grid-main grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
