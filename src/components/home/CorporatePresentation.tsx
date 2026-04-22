import Link from "next/link";

const PDF_HREF = "/SARO TECH - 2026 Corporate Presentation.pdf";

export default function CorporatePresentation() {
  return (
    <section className="bg-saro-dark py-12 text-white lg:py-16">
      <div className="container-std">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <p className="mb-2 text-sm tracking-wider text-saro-green-light">
              Corporate Overview
            </p>
            <h2 className="mb-4 text-[30px] font-semibold leading-tight lg:text-[36px]">
              Get the full SARO TECH story
            </h2>
            <p className="mb-8 max-w-[540px] text-[15px] leading-relaxed text-gray-300">
              Product lines, manufacturing capability, distributor economics, and
              the build-out plan for the US market. One PDF, all the context you
              need to evaluate SARO TECH for your next project or pipeline.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={PDF_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded bg-saro-green px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-saro-green-light"
              >
                View 2026 Presentation
              </a>
              <a
                href={PDF_HREF}
                download
                className="inline-flex items-center gap-2 rounded border border-white/30 px-8 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/5"
              >
                Download PDF
              </a>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-saro-green/20 to-saro-dark shadow-xl">
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <p className="text-xs uppercase tracking-[2px] text-saro-green-light">
                  SARO TECH
                </p>
                <p className="mt-2 text-2xl font-semibold leading-tight">
                  2026 Corporate Presentation
                </p>
                <p className="mt-3 text-xs text-gray-400">
                  PDF · 8 MB · Updated April 2026
                </p>
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,106,79,0.35),transparent_60%)]"
              />
            </div>
            <p className="sr-only">
              <Link href={PDF_HREF}>View the 2026 corporate presentation</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
