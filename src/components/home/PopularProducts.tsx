import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";

export default function PopularProducts() {
  const featured = products.filter((p) => p.featured);

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Bestsellers</h2>
          <Link href="/products" className="text-sm text-saro-green hover:underline">
            View all &rarr;
          </Link>
        </div>

        <div className="scrollbar-hide flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4">
          {featured.map((product) => (
            <div key={product.id} className="w-[220px] min-w-[220px] snap-center flex-shrink-0">
              <div className="relative mb-3 h-[270px] w-[220px] overflow-hidden rounded-lg bg-gray-200">
                <Image
                  src={product.image}
                  alt={`${product.name} - ${product.variantName}`}
                  fill
                  className="object-cover"
                  sizes="220px"
                />
              </div>
              <h3 className="text-sm font-medium">{product.name}</h3>
              <p className="text-xs text-gray-500">{product.variantName}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
