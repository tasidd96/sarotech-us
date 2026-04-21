import Link from "next/link";

export const metadata = {
  title: "SARO Rewards | SARO TECH",
  description:
    "The SARO TECH distributor loyalty program — grow your business with tiered benefits, training, and dedicated support.",
};

const TIERS = [
  {
    name: "Bronze",
    tagline: "Starter",
    description: "Onboard to SARO TECH with access to our full catalog and core distributor tools.",
  },
  {
    name: "Silver",
    tagline: "Growing",
    description:
      "Unlock promotional materials, initial training, and expanded product access.",
  },
  {
    name: "Gold",
    tagline: "Established",
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
    body: "Access to our full catalog of architectural finishes — decking, cladding, paneling, and accessories.",
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

export default function SaroRewardsPage() {
  return (
    <>
      <section className="bg-saro-dark py-20 text-white lg:py-28">
        <div className="container-lg">
          <p className="mb-2 text-sm tracking-wider text-saro-green-light">
            Partner With Us
          </p>
          <h1 className="mb-4 max-w-[700px] text-[40px] font-semibold leading-tight">
            SARO Rewards
          </h1>
          <p className="mb-8 max-w-[620px] text-[15px] leading-relaxed text-gray-300">
            Our distributor loyalty program is built to grow with your business.
            Four tiers, real benefits, and a team that invests in your success.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded bg-saro-green px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-saro-green-light"
          >
            Become a Distributor
          </Link>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-lg">
          <h2 className="mb-2 text-2xl font-semibold">Four Tiers, One Partnership</h2>
          <p className="mb-10 max-w-[620px] text-gray-600">
            Start where it makes sense for your business &mdash; every tier unlocks
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
    </>
  );
}
