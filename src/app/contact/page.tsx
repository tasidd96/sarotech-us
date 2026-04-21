import { Suspense } from "react";
import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact | SARO TECH",
  description:
    "Tell us about your project — we'll help you pick the right materials and get a quote back to you fast.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-saro-dark py-20 text-white lg:py-28">
        <div className="container-lg">
          <p className="mb-2 text-sm tracking-wider text-saro-green-light">
            Get in Touch
          </p>
          <h1 className="mb-4 max-w-[700px] text-[40px] font-semibold leading-tight">
            Contact Us
          </h1>
          <p className="max-w-[620px] text-[15px] leading-relaxed text-gray-300">
            Every project deserves the right materials. Tell us what you&rsquo;re
            building and we&rsquo;ll get back to you within one business day.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-lg">
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div>
              <Suspense fallback={<div className="text-gray-500">Loading form&hellip;</div>}>
                <ContactForm />
              </Suspense>
            </div>

            <aside className="space-y-8">
              <div>
                <h2 className="mb-3 text-lg font-semibold">Houston HQ</h2>
                <p className="text-sm text-gray-700">
                  1210 Leer Street, Houston, TX
                  <br />
                  <span className="text-gray-500">(Warehouse)</span>
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  7676 Hilmont Street, Houston, TX
                  <br />
                  <span className="text-gray-500">(Office)</span>
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-lg font-semibold">Call Us</h2>
                <a
                  href="tel:+18325551234"
                  className="text-sm text-saro-green hover:underline"
                >
                  (832) 555-1234
                </a>
                <p className="mt-1 text-xs text-gray-500">Mon–Fri · 8am–5pm CT</p>
              </div>

              <div>
                <h2 className="mb-3 text-lg font-semibold">Email</h2>
                <a
                  href="mailto:info@sarotech.us"
                  className="text-sm text-saro-green hover:underline"
                >
                  info@sarotech.us
                </a>
              </div>

              <div>
                <h2 className="mb-3 text-lg font-semibold">Become a Distributor</h2>
                <p className="mb-3 text-sm text-gray-700">
                  Applying to SARO Rewards? Learn more about our partner program.
                </p>
                <Link
                  href="/saro-rewards"
                  className="text-sm font-semibold text-saro-green hover:underline"
                >
                  View SARO Rewards &rarr;
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
