import Image from "next/image";
import Link from "next/link";
import HorizontalCarousel from "@/components/ui/HorizontalCarousel";
import { products } from "@/data/products";

export default function PopularProducts() {
  const featured = products.filter((p) => p.featured);

  return (
    <section className="py-12 lg:py-16">
      <div className="container-std">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Bestsellers</h2>
          <Link href="/products" className="text-sm text-saro-green hover:underline">
            View all &rarr;
          </Link>
        </div>

        <HorizontalCarousel ariaLabel="bestsellers">
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
        </HorizontalCarousel>
      </div>
    </section>
  );
}
