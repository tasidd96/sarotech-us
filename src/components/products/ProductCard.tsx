import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { productSlug, variantSlug } from "@/lib/slug";

export default function ProductCard({ product }: { product: Product }) {
  const toneSuffix = product.detail?.toneFamily
    ? ` - ${product.detail.toneFamily}`
    : "";
  const href = `/products/${productSlug(product)}/${variantSlug(product)}`;

  return (
    <Link
      href={href}
      className="products-page-card group flex w-full flex-col transition-transform duration-200 hover:-translate-y-[2px]"
    >
      <div className="products-page-image relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gray-100 sm:h-[270px] sm:aspect-auto">
        <Image
          src={product.image}
          alt={`${product.sku}-${product.variantName}`}
          fill
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03] sm:p-0 sm:object-cover"
          sizes="(min-width: 1024px) 252px, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="products-page-info px-2 py-[10px] text-center">
        <h4 className="mb-[5px] text-[15.6px] font-medium leading-snug text-[#2c3e50]">
          {product.name}
          {toneSuffix}
        </h4>
        <p className="products-page-sku my-[5px] text-[12px] text-[#888]">
          SKU: {product.skuNumber}
        </p>
        <p className="products-page-variant text-[12px] text-[#888]">
          {product.sku}-{product.variantName}
        </p>
      </div>
    </Link>
  );
}
