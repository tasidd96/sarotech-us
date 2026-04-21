import Image from "next/image";
import Link from "next/link";

type CarouselCat = { name: string; image?: string };

const CAROUSEL_CATEGORIES: CarouselCat[] = [
  { name: "Floor Decking",               image: "/images/categories/deck-para-piso.jpg" },
  { name: "Exterior Corner",             image: "/images/categories/wall-cladding.jpg" },
  { name: "Laminated Corner",            image: "/images/categories/panel-lambrin-laminado.jpg" },
  { name: "Premium Wood Board Corner",   image: "/images/categories/panel-lambrin-laminado.jpg" },
  { name: "Coextruded Cladding",         image: "/images/categories/lambrin-extruido.jpg" },
  { name: "Extruded Cladding",           image: "/images/categories/lambrin-extruido.jpg" },
  { name: "Ceiling Louver",              image: "/images/categories/lambrin-extruido.jpg" },
  { name: "Synthetic Marble",            image: "/images/categories/marmol-sintetico.jpg" },
  { name: "Continuous Synthetic Marble", image: "/images/categories/marmol-sintetico.jpg" },
  { name: "Premium Synthetic Marble",    image: "/images/categories/marmol-sintetico.jpg" },
  { name: "Wide Cladding Panel",         image: "/images/categories/wall-cladding.jpg" },
  { name: "Laminated Cladding Panel",    image: "/images/categories/panel-lambrin-laminado.jpg" },
  { name: "Wavy Cladding Panel",         image: "/images/categories/panel-wavy.jpg" },
  { name: "SPC Wall Panel",              image: "/images/categories/wall-cladding.jpg" },
  { name: "Wavy Panel",                  image: "/images/categories/panel-wavy.jpg" },
  { name: "Adhesive" },
  { name: "Aluminum Profile" },
  { name: "Transition Profile" },
  { name: "Lighting Profile" },
  { name: "Wide Lighting Profile" },
  { name: "Stair Nosing Profile" },
  { name: "Premium Wood Board Profile",  image: "/images/categories/panel-lambrin-laminado.jpg" },
  { name: "PU Synthetic Stone",          image: "/images/categories/piedra-sintetica-pu.jpg" },
  { name: "Travertine Synthetic Stone",  image: "/images/categories/piedra-sintetica-travertino.jpg" },
  { name: "PVC-ASA Wall Panel",          image: "/images/categories/wall-cladding.jpg" },
  { name: "Vinyl Flooring",              image: "/images/categories/deck-para-piso.jpg" },
  { name: "StoneFlex",                   image: "/images/categories/piedra-sintetica-pu.jpg" },
  { name: "Mirror Board",                image: "/images/categories/panel-lambrin-laminado.jpg" },
  { name: "Smooth Laminated Board",      image: "/images/categories/panel-lambrin-laminado.jpg" },
  { name: "Premium Wood Board",          image: "/images/categories/panel-lambrin-laminado.jpg" },
  { name: "Premium Metallic Board",      image: "/images/categories/panel-lambrin-laminado.jpg" },
  { name: "Premium Wave Board",          image: "/images/categories/panel-wavy.jpg" },
  { name: "Beam Caps" },
  { name: "Coextruded Beam",             image: "/images/categories/lambrin-extruido.jpg" },
  { name: "Laminated Beam",              image: "/images/categories/panel-lambrin-laminado.jpg" },
  { name: "Wall Cladding",               image: "/images/categories/wall-cladding.jpg" },
  { name: "Wall Fence",                  image: "/images/categories/wall-cladding.jpg" },
  { name: "SPC Baseboard",               image: "/images/categories/deck-para-piso.jpg" },
];

const MAIN_CATEGORIES = [
  {
    id: "interior",
    name: "Interior Coverings",
    image: "/images/categories/panel-lambrin-laminado.jpg",
  },
  {
    id: "exterior",
    name: "Exterior Coverings",
    image: "/images/categories/deck-para-piso.jpg",
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "/images/categories/wall-cladding.jpg",
  },
];

export default function ShopByCategory() {
  return (
    <section className="category-carousel-section bg-white py-12 lg:py-16">
      <div className="category-carousel-container container-lg">
        <h3 className="category-carousel-title mb-8 text-[20px] italic text-saro-dark underline underline-offset-[6px]">
          Shop by Category
        </h3>

        {/* Horizontal carousel of product categories */}
        <div className="category-carousel-wrapper mb-10">
          <div className="category-carousel scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2">
            {CAROUSEL_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/products?q=${encodeURIComponent(cat.name)}`}
                className="category-carousel-item group flex w-[180px] min-w-[180px] flex-shrink-0 snap-start flex-col items-center"
              >
                <div className="category-carousel-image relative mb-2 flex h-[180px] w-full items-center justify-center overflow-hidden rounded bg-[#f0f0f0] transition-transform duration-300 group-hover:scale-[1.03]">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="180px"
                      loading="lazy"
                    />
                  ) : (
                    <svg
                      className="h-10 w-10 text-[#ccc]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" />
                      <path strokeLinecap="round" d="M3 15l5-5 4 4 3-3 6 6" />
                      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
                    </svg>
                  )}
                </div>
                <p className="category-carousel-label text-center text-[13px] leading-tight text-saro-dark group-hover:text-saro-green">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Main 3-card category grid (Interior / Exterior / Accessories) */}
        <div className="main-categories">
          <div className="categories-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MAIN_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?tab=${cat.id}`}
                className="category-card group relative block overflow-hidden rounded-lg"
              >
                <div className="category-image relative aspect-[3/2]">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="category-overlay absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/55" />
                  <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                    <h3 className="category-title text-[24px] font-semibold uppercase tracking-[0.08em]">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
