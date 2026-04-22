import Image from "next/image";
import Link from "next/link";
import HorizontalCarousel from "@/components/ui/HorizontalCarousel";

type PopularCategory = {
  name: string;
  category: "Interior" | "Exterior";
  image: string;
};

// Mirrors sarotech.io/productos/elementos-populares — 8 most popular categories
// shown as texture-swatch tiles. Order is alphabetical by Spanish source name.
const POPULAR: PopularCategory[] = [
  { name: "Floor Decking", category: "Exterior", image: "/images/bestsellers/floor-decking.png" },
  { name: "Extruded Cladding", category: "Exterior", image: "/images/bestsellers/extruded-cladding.png" },
  { name: "Synthetic Marble", category: "Interior", image: "/images/bestsellers/synthetic-marble.jpg" },
  { name: "Laminated Cladding Panel", category: "Interior", image: "/images/bestsellers/laminated-cladding-panel.jpg" },
  { name: "Wavy Panel", category: "Interior", image: "/images/bestsellers/wavy-panel.png" },
  { name: "PU Synthetic Stone", category: "Exterior", image: "/images/bestsellers/pu-synthetic-stone.png" },
  { name: "Travertine Synthetic Stone", category: "Exterior", image: "/images/bestsellers/travertine-synthetic-stone.png" },
  { name: "Wall Cladding", category: "Exterior", image: "/images/bestsellers/wall-cladding.png" },
];

export default function PopularProducts() {
  return (
    <section className="bg-saro-dark py-12 text-white lg:py-16">
      <div className="container-std">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Bestsellers</h2>
          <Link href="/products" className="text-sm text-saro-green-light hover:underline">
            View all &rarr;
          </Link>
        </div>

        <HorizontalCarousel ariaLabel="bestsellers" scrimColor="dark" scrollStep={264}>
          {POPULAR.map((item) => (
            <Link
              key={item.name}
              href={`/products?q=${encodeURIComponent(item.name)}`}
              className="group flex w-[240px] min-w-[240px] flex-shrink-0 snap-start flex-col"
            >
              <div className="relative mb-3 h-[240px] w-[240px] overflow-hidden rounded-lg bg-[#f0f0f0] transition-transform duration-300 group-hover:scale-[1.03]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="240px"
                  loading="lazy"
                />
              </div>
              <h3 className="text-[15px] font-semibold text-white">{item.name}</h3>
              <p className="mt-1 text-xs uppercase tracking-wider text-saro-green-light">
                {item.category}
              </p>
            </Link>
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  );
}
