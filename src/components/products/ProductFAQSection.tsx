"use client";

import { useState } from "react";

interface Props {
  productName: string;
}

export default function ProductFAQSection({ productName }: Props) {
  const faqs = [
    {
      q: `Is the ${productName} suitable for outdoor use?`,
      a: "Each product line is engineered for specific environments — check the product category (Interior / Exterior) and the Support Material PDFs before installing. Interior panels should not be exposed to prolonged moisture or direct weather.",
    },
    {
      q: "What material is SARO TECH cladding made from?",
      a: "SARO TECH cladding is built from Wood-Plastic Composite (WPC) — a high-density blend of virgin polymers and wood fiber, engineered for strength, dimensional stability, and a realistic wood look.",
    },
    {
      q: "What fire resistance does this material have?",
      a: "WPC finishes meet common building code requirements for low flame spread on interior applications. Request the latest fire-test datasheet from our team for your jurisdiction.",
    },
    {
      q: "What is the product warranty?",
      a: "All SARO TECH finishes are covered by a limited manufacturing-defect warranty. Warranty duration varies by product line — refer to the Support Material on this page or contact us for the current terms.",
    },
    {
      q: "How many square meters does one box cover?",
      a: "Coverage is printed on the product page (see Size / Presentation). For the Laminated Wall Panel family, one box typically covers ~6.46 m² at 14 pieces per box.",
    },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="seo-enrichment-container bg-[#fafafa] py-12">
      <div className="seo-faq-wrapper container-lg">
        <div className="faq-section-container">
          <h3 className="faq-section-title mb-6 text-center text-[20px] font-semibold text-saro-dark">
            Frequently Asked Questions
          </h3>

          <div className="faq-accordion flex flex-col gap-2">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className={`faq-item toggle-item overflow-hidden rounded border border-gray-200 bg-white ${
                    isOpen ? "open" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-[14px] font-medium text-saro-dark transition-colors hover:bg-gray-50"
                  >
                    <span>{item.q}</span>
                    <span
                      className="inline-block text-[10px] text-[#888] transition-transform duration-300"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      ▼
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                      isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-4 pb-4 pt-1 text-[14px] leading-[1.7] text-[#555]">
                      {item.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Installation Guide teaser */}
        <div className="install-guide mt-12">
          <h3 className="mb-6 text-center text-[20px] font-semibold text-saro-dark">
            Installation Guide
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <GuideCard
              icon="🔧"
              title="Tools"
              items={[
                "Measuring tape & level",
                "Miter saw or circular saw (fine-tooth blade)",
                "Drill with appropriate bits",
                "Pencil & chalk line",
                "Protective eyewear and gloves",
              ]}
            />
            <GuideCard
              icon="◎"
              title="Materials"
              items={[
                "Laminated wall panels (this product)",
                "Matching clips or fasteners",
                "Corner trim pieces (where applicable)",
                "Construction adhesive (PEGA or equivalent)",
                "Surface primer if installing over painted drywall",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GuideCard({
  icon,
  title,
  items,
}: {
  icon: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold uppercase tracking-[0.5px] text-saro-dark">
        <span className="text-[18px]">{icon}</span>
        <span>{title}</span>
      </div>
      <ul className="space-y-2 text-[14px] text-[#555]">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-[7px] inline-block h-[4px] w-[4px] flex-shrink-0 rounded-full bg-saro-green" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
