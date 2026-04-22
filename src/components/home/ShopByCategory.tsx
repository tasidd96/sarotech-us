import Image from "next/image";
import Link from "next/link";
import DragScrollRow from "@/components/ui/DragScrollRow";

type CarouselCat = { name: string; image?: string };

const CAROUSEL_CATEGORIES: CarouselCat[] = [
  { name: "Floor Decking",               image: "/images/categories/floor-decking.png" },
  { name: "Exterior Corner",             image: "/images/categories/exterior-corner.png" },
  { name: "Laminated Corner",            image: "/images/categories/laminated-corner.png" },
  { name: "Premium Wood Board Corner",   image: "/images/categories/premium-wood-board-corner.png" },
  { name: "Coextruded Cladding",         image: "/images/categories/coextruded-cladding.png" },
  { name: "Extruded Cladding",           image: "/images/categories/extruded-cladding.png" },
  { name: "Ceiling Louver",              image: "/images/categories/ceiling-louver.png" },
  { name: "Synthetic Marble",            image: "/images/categories/synthetic-marble.png" },
  { name: "Continuous Synthetic Marble", image: "/images/categories/continuous-synthetic-marble.png" },
  { name: "Premium Synthetic Marble",    image: "/images/categories/premium-synthetic-marble.png" },
  { name: "Wide Cladding Panel",         image: "/images/categories/wide-cladding-panel.png" },
  { name: "Laminated Cladding Panel",    image: "/images/categories/laminated-cladding-panel.png" },
  { name: "Wavy Cladding Panel",         image: "/images/categories/wavy-cladding-panel.png" },
  { name: "SPC Wall Panel",              image: "/images/categories/spc-wall-panel.png" },
  { name: "Wavy Panel",                  image: "/images/categories/wavy-panel.png" },
  { name: "Adhesive",                    image: "/images/categories/adhesive.png" },
  { name: "Aluminum Profile",            image: "/images/categories/aluminum-profile.png" },
  { name: "Transition Profile",          image: "/images/categories/transition-profile.png" },
  { name: "Lighting Profile",            image: "/images/categories/lighting-profile.png" },
  { name: "Wide Lighting Profile",       image: "/images/categories/wide-lighting-profile.png" },
  { name: "Stair Nosing Profile",        image: "/images/categories/stair-nosing-profile.png" },
  { name: "Premium Wood Board Profile",  image: "/images/categories/premium-wood-board-profile.png" },
  { name: "PU Synthetic Stone",          image: "/images/categories/pu-synthetic-stone.png" },
  { name: "Travertine Synthetic Stone",  image: "/images/categories/travertine-synthetic-stone.png" },
  { name: "PVC-ASA Wall Panel",          image: "/images/categories/pvc-asa-wall-panel.png" },
  { name: "Vinyl Flooring",              image: "/images/categories/vinyl-flooring.png" },
  { name: "StoneFlex",                   image: "/images/categories/stoneflex.png" },
  { name: "Mirror Board",                image: "/images/categories/mirror-board.png" },
  { name: "Smooth Laminated Board",      image: "/images/categories/smooth-laminated-board.png" },
  { name: "Premium Wood Board",          image: "/images/categories/premium-wood-board.png" },
  { name: "Premium Metallic Board",      image: "/images/categories/premium-metallic-board.png" },
  { name: "Premium Wave Board",          image: "/images/categories/premium-wave-board.png" },
  { name: "Beam Caps",                   image: "/images/categories/beam-caps.png" },
  { name: "Coextruded Beam",             image: "/images/categories/coextruded-beam.png" },
  { name: "Laminated Beam",              image: "/images/categories/laminated-beam.png" },
  { name: "Wall Cladding",               image: "/images/categories/wall-cladding.png" },
  { name: "Wall Fence",                  image: "/images/categories/wall-fence.png" },
  { name: "SPC Baseboard",               image: "/images/categories/spc-baseboard.png" },
];

const MAIN_CATEGORIES = [
  {
    id: "interior",
    name: "Interior Coverings",
    image: "/images/categories/interior.jpg",
  },
  {
    id: "exterior",
    name: "Exterior Coverings",
    image: "/images/categories/exterior.jpg",
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "/images/categories/accessories.jpg",
  },
];

export default function ShopByCategory() {
  return (
    <section className="category-carousel-section bg-white py-12 lg:py-16">
      <div className="container-std">
        <h3 className="category-carousel-title mb-8 text-[20px] font-semibold text-saro-dark">
          Shop by Category
        </h3>
      </div>

      {/* Horizontal carousel — full-width, edge-to-edge */}
      <div className="category-carousel-wrapper mb-10 w-full">
        <DragScrollRow className="category-carousel scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2">
          {CAROUSEL_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?q=${encodeURIComponent(cat.name)}`}
              className="category-carousel-item group flex w-[220px] min-w-[220px] flex-shrink-0 snap-start flex-col items-center"
            >
              <div className="category-carousel-image relative mb-2 flex h-[220px] w-full items-center justify-center overflow-hidden rounded bg-[#f0f0f0] transition-transform duration-300 group-hover:scale-[1.03]">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-contain p-4"
                    sizes="220px"
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
        </DragScrollRow>
      </div>

      {/* Main 3-card category grid (Interior / Exterior / Accessories) */}
      <div className="container-std">
        <div className="main-categories">
          <div className="categories-grid grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {MAIN_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?tab=${cat.id}`}
                className="category-card group relative block h-[400px] overflow-hidden rounded-lg"
              >
                {/* Photo — fills card, subtle zoom on hover */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />

                {/* Pill label — bottom-left, matches sarotech.io exactly */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="inline-block rounded-[5px] bg-white/95 px-3 py-2 text-[17.6px] font-medium text-black">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
