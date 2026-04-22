import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "SARO Rewards | SARO TECH",
  description:
    "The SARO TECH distributor loyalty program. Grow your business with tiered benefits, training, and dedicated support.",
};

const TIERS = [
  {
    name: "Bronze",
    tagline: "Just starting",
    description: "Onboard to SARO TECH with access to our full catalog and core distributor tools.",
  },
  {
    name: "Silver",
    tagline: "Building volume",
    description:
      "Unlock promotional materials, initial training, and expanded product access.",
  },
  {
    name: "Gold",
    tagline: "Proven partner",
    description:
      "Assigned account executive, semiannual training, and priority inventory access.",
  },
  {
    name: "Platinum",
    tagline: "Flagship",
    description:
      "Free shipping, on-site activations, and full CRM + quoting platform access.",
    highlighted: true,
  },
];

const BENEFITS = [
  {
    title: "Broad Product Inventory",
    body: "Access to our full catalog of architectural finishes: decking, cladding, paneling, and accessories.",
  },
  {
    title: "Personalized Advisory",
    body: "A dedicated team that understands your market, your customers, and your projects.",
  },
  {
    title: "Fast Delivery",
    body: "Reliable logistics from our Houston warehouse out to every major Texas metro and beyond.",
  },
  {
    title: "Materials Warranty",
    body: "Every SARO TECH product is backed by our manufacturer warranty.",
  },
  {
    title: "Project Specification Support",
    body: "Design and spec help for bids, tenders, and complex installs.",
  },
  {
    title: "Installation & Technical Resources",
    body: "Installation guides, technical data sheets, and training materials available to all partners.",
  },
];

const REQUIREMENTS = [
  "Business / company name",
  "Contact name and phone number",
  "Business email",
  "Federal EIN or tax documentation",
  "Website or active social media presence",
  "Photos of your storefront or showroom (if applicable)",
];

// Tier benefit breakdown — adapted from sarotech.io's comparison table.
// Each row: [label, bronze, silver, gold, platinum]. Booleans render as a
// green check. Strings render as text. null renders as an empty cell.
type Cell = boolean | string | null;
const BENEFIT_ROWS: { label: string; cells: [Cell, Cell, Cell, Cell] }[] = [
  { label: "Monthly purchase minimum", cells: ["Contact for details", "Contact for details", "Contact for details", "Contact for details"] },
  { label: "Base distributor discount", cells: [true, true, true, true] },
  { label: "Product catalog access", cells: [true, true, true, true] },
  { label: "Promotional materials", cells: [true, true, true, true] },
  { label: "Distributor portal access", cells: [true, true, true, true] },
  { label: "Training", cells: ["Onboarding", "Onboarding + Semiannual", "Onboarding + Semiannual", "Onboarding + Bimonthly + Semiannual"] },
  { label: "Distributor directory listing", cells: [null, true, true, true] },
  { label: "Event & trade show perks", cells: [null, true, true, true] },
  { label: "Dedicated account executive", cells: [null, null, true, true] },
  { label: "Displays & sample kits", cells: [null, null, true, true] },
  { label: "Social media campaign support", cells: [null, null, true, true] },
  { label: "CRM + quoting platform", cells: [null, null, true, true] },
  { label: "Free regional shipping", cells: [null, null, null, true] },
  { label: "Priority inventory access", cells: [null, null, null, true] },
  { label: "Early product launches", cells: [null, null, null, true] },
  { label: "Commercial event support", cells: [null, null, null, true] },
  { label: "On-site activations", cells: [null, null, null, true] },
  { label: "Event participation support", cells: [null, null, null, true] },
];

const TIER_BADGES = [
  { name: "Bronze", image: "/images/rewards/tier-bronze.png" },
  { name: "Silver", image: "/images/rewards/tier-silver.png" },
  { name: "Gold", image: "/images/rewards/tier-gold.png" },
  { name: "Platinum", image: "/images/rewards/tier-platinum.png" },
];

export default function SaroRewardsPage() {
  return (
    <>
      <section className="bg-saro-dark py-20 text-white lg:py-28">
        <div className="container-lg">
          <p className="mb-2 text-sm tracking-wider text-saro-green-light">
            Distributor Program
          </p>
          <h1 className="mb-4 max-w-[700px] text-[40px] font-semibold leading-tight">
            SARO Rewards
          </h1>
          <p className="mb-8 max-w-[620px] text-[15px] leading-relaxed text-gray-300">
            Grow with SARO TECH. Four tiers, real benefits, and a team invested in your business.
          </p>

          <div className="relative mb-8 w-full max-w-[900px]">
            <Image
              src="/images/rewards/tier-levels.png"
              alt="SARO Rewards tiers: Bronze, Silver, Gold, Platinum"
              width={1600}
              height={277}
              className="h-auto w-full"
              priority
            />
          </div>

          <Link
            href="/contact"
            className="inline-block rounded bg-saro-green px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-saro-green-light"
          >
            Start Your Application
          </Link>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-lg">
          <h2 className="mb-2 text-2xl font-semibold">Four Tiers, One Partnership</h2>
          <p className="mb-10 max-w-[620px] text-gray-600">
            Start where it makes sense for your business. Every tier unlocks
            more support, training, and benefits as you scale with SARO TECH.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-lg border p-6 transition-shadow hover:shadow-md ${
                  tier.highlighted
                    ? "border-saro-green bg-saro-green/5"
                    : "border-gray-200 bg-white"
                }`}
              >
                <p className="mb-1 text-xs uppercase tracking-wider text-saro-green">
                  {tier.tagline}
                </p>
                <h3 className="mb-3 text-xl font-semibold">{tier.name}</h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {tier.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12 lg:py-16">
        <div className="container-lg">
          <h2 className="mb-10 text-2xl font-semibold">What You Get</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title}>
                <h3 className="mb-2 text-base font-semibold">{benefit.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{benefit.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-lg">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-semibold">How to Apply</h2>
              <p className="mb-6 text-gray-700">
                Applying to SARO Rewards is straightforward. Have the following ready
                when you contact us and a partner manager will reach out within two
                business days.
              </p>
              <ul className="space-y-3">
                {REQUIREMENTS.map((req) => (
                  <li key={req} className="flex items-start gap-3 text-gray-700">
                    <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-saro-green" />
                    <span className="text-sm">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-saro-dark p-8 text-white">
              <h2 className="mb-4 text-2xl font-semibold">Ready to partner?</h2>
              <p className="mb-6 text-sm leading-relaxed text-gray-300">
                Join a distributor program built on fast shipping, strong margins,
                and materials that sell themselves.
              </p>
              <Link
                href="/contact"
                className="inline-block rounded bg-saro-green px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-saro-green-light"
              >
                Start Your Application
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Founding Distributors (partner showcase placeholder) */}
      <section className="bg-gray-50 py-12 lg:py-16">
        <div className="container-lg">
          <h2 className="mb-2 text-2xl font-semibold">Founding Distributors</h2>
          <p className="mb-10 max-w-[620px] text-gray-600">
            The inaugural U.S. cohort is just opening. Apply now to be among the
            founding partners and claim priority tier placement.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((slot) => (
              <div
                key={slot}
                className="flex h-[140px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500"
              >
                Founding partner slot open
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/contact"
              className="inline-block rounded border border-saro-green px-8 py-3 text-sm font-semibold text-saro-green transition-colors hover:bg-saro-green hover:text-white"
            >
              Apply as a Founding Distributor
            </Link>
          </div>
        </div>
      </section>

      {/* Section 5: Tier benefits breakdown (comparison table) */}
      <section className="py-12 lg:py-16">
        <div className="container-lg">
          <h2 className="mb-2 text-2xl font-semibold">Tier Benefits Breakdown</h2>
          <p className="mb-10 max-w-[620px] text-gray-600">
            Every tier adds more. Here is how the four levels compare side by side.
          </p>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Benefit
                  </th>
                  {TIER_BADGES.map((t) => (
                    <th key={t.name} className="p-4 text-center">
                      <Image
                        src={t.image}
                        alt={t.name}
                        width={90}
                        height={45}
                        className="mx-auto h-10 w-auto"
                      />
                      <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-700">
                        {t.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BENEFIT_ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}
                  >
                    <td className="p-4 text-left font-medium text-gray-900">
                      {row.label}
                    </td>
                    {row.cells.map((cell, ci) => (
                      <td key={ci} className="p-4 text-center text-gray-700">
                        {cell === true ? (
                          <svg
                            aria-label="included"
                            className="mx-auto text-saro-green"
                            width={18}
                            height={18}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : cell === null ? (
                          <span aria-label="not included" className="text-gray-300">
                            {"\u2013"}
                          </span>
                        ) : (
                          <span className="text-xs leading-tight">{cell}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Monthly purchase minimums for each tier will be announced when the U.S.
            distributor program launches. Contact us for current details.
          </p>
        </div>
      </section>

      {/* Section 6: Big CTA banner */}
      <section className="bg-saro-dark py-16 text-white lg:py-24">
        <div className="container-lg text-center">
          <h2 className="mb-4 text-3xl font-semibold leading-tight lg:text-4xl">
            Ready to become a SARO distributor?
          </h2>
          <p className="mx-auto mb-8 max-w-[620px] text-gray-300">
            Apply to SARO Rewards and build a partnership that grows with your
            business. Approvals within two business days.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded bg-saro-green px-10 py-4 text-base font-semibold text-white transition-colors hover:bg-saro-green-light"
          >
            I want to be a distributor
          </Link>
        </div>
      </section>

      {/* Section 7: Testimonials (placeholder) */}
      <section className="py-12 lg:py-16">
        <div className="container-lg">
          <h2 className="mb-2 text-2xl font-semibold">What Our Distributors Say</h2>
          <p className="mb-10 max-w-[620px] text-gray-600">
            Testimonials from our founding U.S. distributors will land here as the
            program ramps up.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((slot) => (
              <blockquote
                key={slot}
                className="rounded-lg border-2 border-dashed border-gray-200 bg-white p-6"
              >
                <p className="mb-4 text-sm italic text-gray-500">
                  Your testimonial here. Apply to SARO Rewards and share your
                  experience with us.
                </p>
                <footer className="text-xs uppercase tracking-wider text-gray-400">
                  Founding distributor &middot; Coming soon
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
