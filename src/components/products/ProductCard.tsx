import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { productSlug, variantSlug, variantLabel } from "@/lib/slug";
import { discountPercent } from "@/lib/price";
import StockPill from "./StockPill";

export default function ProductCard({ product }: { product: Product }) {
  const toneSuffix = product.detail?.toneFamily
    ? ` - ${product.detail.toneFamily}`
    : "";
  const href = `/products/${productSlug(product)}/${variantSlug(product)}`;
  const label = variantLabel(product);
  // Compute discount % from the (still-present, but-not-shown) price/listPrice
  // pair. The pill renders "% off" inline; actual dollar figures stay hidden
  // pending the rewards-program paywall.
  const off = discountPercent(product.price, product.listPrice);

  return (
    <Link
      href={href}
      className="products-page-card group flex w-full flex-col transition-transform duration-200 hover:-translate-y-[2px]"
    >
      <div className="products-page-image relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-sm bg-gray-100">
        {product.inventory && (
          <div className="absolute left-2 top-2 z-10">
            <StockPill inventory={product.inventory} discountPercent={off} />
          </div>
        )}
        <Image
          src={product.image}
          alt={label}
          fill
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
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
          {label}
        </p>
      </div>
    </Link>
  );
}
