import Image from "next/image";
import { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group w-[220px] cursor-pointer">
      <div className="relative mb-2 h-[270px] w-[220px] overflow-hidden rounded-lg bg-gray-200">
        <Image
          src={product.image}
          alt={`${product.name} - ${product.variantName}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="220px"
        />
      </div>
      <div className="px-2">
        <h4 className="text-[13px] font-medium leading-tight">{product.name}</h4>
        <p className="mt-1 text-center text-xs text-gray-500">SKU: {product.skuNumber}</p>
        <p className="text-center text-xs text-gray-500">{product.sku}-{product.variantName}</p>
      </div>
    </div>
  );
}
