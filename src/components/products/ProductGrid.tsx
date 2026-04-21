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
    <div className="flex flex-wrap gap-x-[32px] gap-y-[20px]">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
