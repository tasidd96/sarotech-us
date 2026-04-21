import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";

export default function ShopByCategory() {
  return (
    <section className="bg-saro-light py-12 lg:py-16">
      <div className="mx-auto max-w-[1200px] px-4">
        <h2 className="mb-8 text-center text-2xl font-bold">Shop by Category</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/products?tab=${cat.id}`} className="group relative overflow-hidden rounded-lg">
              <div className="relative aspect-[3/2]">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h3 className="text-xl font-bold">{cat.name}</h3>
                  <p className="mt-1 text-sm text-gray-200">{cat.productCount} products</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
