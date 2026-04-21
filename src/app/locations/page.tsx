import Link from "next/link";
import LocationsSection from "@/components/home/LocationsSection";

export const metadata = {
  title: "Locations | SARO TECH",
  description:
    "Always close by — find the SARO TECH warehouse, office, and service areas across Texas.",
};

export default function LocationsPage() {
  return (
    <>
      <section className="bg-saro-dark py-20 text-white lg:py-28">
        <div className="container-lg">
          <p className="mb-2 text-sm tracking-wider text-saro-green-light">
            Where We Serve
          </p>
          <h1 className="mb-4 max-w-[700px] text-[40px] font-semibold leading-tight">
            Locations
          </h1>
          <p className="mb-8 max-w-[600px] text-[15px] leading-relaxed text-gray-300">
            Always close by. Headquartered in Houston with service coverage across
            every major Texas metro &mdash; and expanding nationwide.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded bg-saro-green px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-saro-green-light"
          >
            Let&rsquo;s talk about your project
          </Link>
        </div>
      </section>

      <section className="bg-saro-dark pb-16 text-white">
        <div className="container-lg mb-8">
          <h2 className="text-2xl font-semibold">Our Locations</h2>
        </div>
        <LocationsSection />
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-lg">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-semibold">Visit the Houston HQ</h2>
              <p className="mb-2 text-gray-700">
                <strong>Warehouse:</strong> 1210 Leer Street, Houston, TX
              </p>
              <p className="mb-2 text-gray-700">
                <strong>Office:</strong> 7676 Hilmont Street, Houston, TX
              </p>
              <p className="mb-2 text-gray-700">
                <strong>Phone:</strong>{" "}
                <a href="tel:+18325551234" className="text-saro-green hover:underline">
                  (832) 555-1234
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:info@sarotech.us"
                  className="text-saro-green hover:underline"
                >
                  info@sarotech.us
                </a>
              </p>
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-semibold">
                Don&rsquo;t see your area?
              </h2>
              <p className="mb-6 text-gray-700">
                We deliver across the continental U.S. and are opening new service
                areas every quarter. Tell us where you need SARO TECH next.
              </p>
              <Link
                href="/contact"
                className="inline-block rounded border border-saro-green px-8 py-3 text-sm font-semibold text-saro-green transition-colors hover:bg-saro-green hover:text-white"
              >
                Request Your Area
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
