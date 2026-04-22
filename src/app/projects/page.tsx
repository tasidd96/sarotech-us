import Image from "next/image";
import Link from "next/link";
import HorizontalCarousel from "@/components/ui/HorizontalCarousel";
import { productSlug, variantSlug } from "@/lib/slug";
import { projects } from "@/data/projects";
import { products } from "@/data/products";

export const metadata = {
  title: "Projects | SARO TECH",
  description:
    "Commercial, residential, and trade-show projects built with SARO TECH architectural finishes.",
};

export default function ProjectsPage() {
  const related = products.filter((p) => p.featured);
  const fuelStations = projects.filter((p) => p.category === "fuel-station");
  const featuredProjects = projects.filter((p) => p.category !== "fuel-station");

  return (
    <>
      <section className="bg-saro-dark py-20 text-white lg:py-28">
        <div className="container-lg">
          <p className="mb-2 text-sm tracking-wider text-saro-green-light">
            Our Work
          </p>
          <h1 className="mb-4 max-w-[700px] text-[40px] font-semibold leading-tight">
            Projects
          </h1>
          <p className="mb-8 max-w-[600px] text-[15px] leading-relaxed text-gray-300">
            At SARO TECH, every material fits perfectly — commercial, residential, and
            trade-show spaces built with our architectural finishes.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded bg-saro-green px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-saro-green-light"
          >
            Let&rsquo;s talk about your project
          </Link>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-std">
          <h2 className="mb-8 text-2xl font-semibold">Featured Projects</h2>

          <HorizontalCarousel ariaLabel="projects" scrollStep={324}>
            {featuredProjects.map((project) => (
              <article
                key={project.id}
                className="w-[300px] min-w-[300px] snap-start flex-shrink-0"
              >
                <div className="relative mb-3 h-[220px] w-[300px] overflow-hidden rounded-lg bg-gray-200">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
                <h3 className="text-sm font-semibold">{project.name}</h3>
                {project.description && (
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                    {project.description}
                  </p>
                )}
              </article>
            ))}
          </HorizontalCarousel>
        </div>
      </section>

      {fuelStations.length > 0 && (
        <section className="border-t border-gray-100 py-12 lg:py-16">
          <div className="container-std">
            <h2 className="mb-2 text-2xl font-semibold">
              Fuel Station Installations
            </h2>
            <p className="mb-8 max-w-[620px] text-gray-600">
              Canopy systems, facades, and column cladding built for the
              day-in, day-out life of a Texas fuel station.
            </p>

            <HorizontalCarousel ariaLabel="fuel station projects" scrollStep={324}>
              {fuelStations.map((station) => (
                <article
                  key={station.id}
                  className="w-[300px] min-w-[300px] snap-start flex-shrink-0"
                >
                  <div className="relative mb-3 h-[220px] w-[300px] overflow-hidden rounded-lg bg-gray-200">
                    <Image
                      src={station.image}
                      alt={station.name}
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                  </div>
                  <h3 className="text-sm font-semibold">{station.name}</h3>
                  {station.description && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {station.description}
                    </p>
                  )}
                </article>
              ))}
            </HorizontalCarousel>
          </div>
        </section>
      )}

      <section className="border-t border-gray-100 py-12 lg:py-16">
        <div className="container-std">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Related Products</h2>
            <Link
              href="/products"
              className="text-sm text-saro-green hover:underline"
            >
              View all &rarr;
            </Link>
          </div>

          <HorizontalCarousel ariaLabel="related products">
            {related.map((product) => (
              <Link
                key={product.id}
                href={`/products/${productSlug(product)}/${variantSlug(product)}`}
                className="w-[220px] min-w-[220px] snap-center flex-shrink-0"
              >
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
              </Link>
            ))}
          </HorizontalCarousel>
        </div>
      </section>
    </>
  );
}
