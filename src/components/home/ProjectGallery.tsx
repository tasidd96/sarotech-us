import Image from "next/image";
import { projects } from "@/data/projects";

export default function ProjectGallery() {
  const nonFeatured = projects.filter((p) => !p.featured);

  return (
    <section className="py-12 lg:py-16">
      <div className="container-std">
        <h2 className="mb-8 text-2xl font-semibold">Our Projects</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {nonFeatured.map((project) => (
            <div key={project.id} className="group relative overflow-hidden rounded-lg">
              <div className="relative aspect-[4/3]">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <h3 className="font-semibold">{project.name}</h3>
                  {project.description && (
                    <p className="mt-1 text-xs text-gray-200">{project.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
