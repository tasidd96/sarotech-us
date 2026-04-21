export default function FeaturedProject() {
  return (
    <section id="projects" className="bg-saro-dark py-12 text-white lg:py-16">
      <div className="container-lg">
        <h2 className="mb-8 text-2xl font-bold">Why SARO TECH?</h2>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div
            className="aspect-[4/3] rounded-lg bg-cover bg-center"
            style={{
              backgroundImage: "url('https://placehold.co/800x600/2D6A4F/ffffff?text=SARO+TECH+USA')",
            }}
          />

          {/* Content */}
          <div className="flex flex-col justify-center">
            <h3 className="mb-4 text-3xl font-bold lg:text-4xl">
              Built for Strength, Style &amp; Scale
            </h3>
            <p className="mb-6 text-gray-300">
              We bring next-generation WPC (wood-plastic composite) architectural finishes to the American construction market. Our materials balance elegance, durability, and eco-conscious innovation.
            </p>

            <div className="grid grid-cols-2 gap-6 text-sm text-gray-400">
              <div>
                <p className="font-medium text-white">Product Lines</p>
                <ul className="mt-2 space-y-1">
                  <li>Facade Systems</li>
                  <li>Exterior Cladding</li>
                  <li>High-Performance Decking</li>
                  <li>Wall Panels</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-white">Who We Serve</p>
                <ul className="mt-2 space-y-1">
                  <li>Contractors</li>
                  <li>Developers</li>
                  <li>Architects &amp; Designers</li>
                  <li>Wholesalers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
