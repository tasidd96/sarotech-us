"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { productSlug, variantSlug } from "@/lib/slug";

interface Props {
  variant: Product;
  relatedProducts: Product[];
}

type Key = "description" | "dimensions" | "care" | "warranty";

export default function ProductInfoSection({ variant, relatedProducts }: Props) {
  const [open, setOpen] = useState<Set<Key>>(new Set<Key>(["description"]));
  const [supportOpen, setSupportOpen] = useState(true);

  const toggle = (k: Key) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const dims = variant.detail?.dimensions;

  return (
    <section className="additional-info-section bg-white py-12">
      <div className="additional-info-container container-lg grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* LEFT — accordions + support material + related */}
        <div className="info-column flex flex-col gap-6">
          <div className="toggle-sections flex flex-col gap-3">
            <Accordion
              icon="≡"
              title="Description"
              open={open.has("description")}
              onToggle={() => toggle("description")}
            >
              <p className="text-[14px] leading-[1.7] text-[#555]">
                {variant.detail?.description ??
                  `${variant.name} in ${variant.variantName}. A premium WPC architectural finish from SARO TECH.`}
              </p>
            </Accordion>

            <Accordion
              icon="□"
              title="Dimensions"
              open={open.has("dimensions")}
              onToggle={() => toggle("dimensions")}
            >
              {dims ? (
                <ul className="space-y-1 text-[14px] text-[#555]">
                  <li>Height: {dims.heightCm} cm</li>
                  <li>Width: {dims.widthCm} cm</li>
                  <li>Thickness: {dims.thicknessCm} cm</li>
                  {variant.detail?.m2PerBox && (
                    <li>Coverage: {variant.detail.m2PerBox} m² per box</li>
                  )}
                  {variant.detail?.piecesPerBox && (
                    <li>Pieces per box: {variant.detail.piecesPerBox}</li>
                  )}
                </ul>
              ) : (
                <p className="text-[14px] text-[#888]">Dimensions vary by variant.</p>
              )}
            </Accordion>

            <Accordion
              icon="♡"
              title="Care"
              open={open.has("care")}
              onToggle={() => toggle("care")}
            >
              <p className="text-[14px] leading-[1.7] text-[#555]">
                Clean with a soft damp cloth and mild soap. Avoid abrasive
                scrubbers and solvent-based cleaners. For outdoor applications,
                rinse periodically to remove dust and debris.
              </p>
            </Accordion>

            <Accordion
              icon="⊙"
              title="Warranty"
              open={open.has("warranty")}
              onToggle={() => toggle("warranty")}
            >
              <p className="text-[14px] leading-[1.7] text-[#555]">
                Covered by SARO TECH&apos;s limited warranty against
                manufacturing defects. Contact our team for full terms or to
                file a claim.
              </p>
            </Accordion>
          </div>

          {/* Support material */}
          <div
            className={`support-material-section ${
              supportOpen ? "expanded" : ""
            } border-t border-gray-200 pt-4`}
          >
            <button
              type="button"
              onClick={() => setSupportOpen((v) => !v)}
              className="flex w-full items-center justify-between py-2 text-[14px] font-medium text-saro-dark"
            >
              <span className="flex items-center gap-2">
                <span
                  className="inline-block text-[10px] transition-transform duration-300"
                  style={{
                    transform: supportOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  ▼
                </span>
                <span>Support Material</span>
              </span>
            </button>
            <div
              className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                supportOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="flex flex-col gap-2 pt-2 text-[14px]">
                <li>
                  <a
                    href="#"
                    className="text-saro-green underline underline-offset-4 transition-colors hover:text-saro-green-dark"
                  >
                    Technical Sheet
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-saro-green underline underline-offset-4 transition-colors hover:text-saro-green-dark"
                  >
                    Installation Guide
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="product-related-section border-t border-gray-200 pt-6">
              <h3 className="mb-4 text-[15px] font-medium text-saro-dark">
                Related Products
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {relatedProducts.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/products/${productSlug(rp)}/${variantSlug(rp)}`}
                    className="group flex flex-col items-center text-center"
                  >
                    <div className="relative mb-2 h-[120px] w-full overflow-hidden rounded bg-gray-100">
                      <Image
                        src={rp.image}
                        alt={rp.name}
                        fill
                        sizes="120px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                      />
                    </div>
                    <span className="text-[13px] text-[#555] group-hover:text-saro-green">
                      {rp.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — technical CAD drawing */}
        <div className="image-column flex flex-col items-center justify-start">
          <div className="technical-image flex w-full max-w-[480px] items-center justify-center">
            <TechnicalDrawing dims={dims} />
          </div>
          <p className="mt-3 text-[12px] italic text-[#888]">
            *Dimensions in centimeters*
          </p>
        </div>
      </div>
    </section>
  );
}

function Accordion({
  icon,
  title,
  open,
  onToggle,
  children,
}: {
  icon: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded border border-gray-200">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between bg-white px-4 py-3 text-left text-[14px] font-medium text-saro-dark transition-colors hover:bg-gray-50"
      >
        <span className="flex items-center gap-3">
          <span className="text-[16px] text-[#666]">{icon}</span>
          <span>{title}</span>
        </span>
        <span
          className="inline-block text-[10px] text-[#888] transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▼
        </span>
      </button>
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-3 pt-1">{children}</div>
      </div>
    </div>
  );
}

function TechnicalDrawing({
  dims,
}: {
  dims?: { heightCm: number; widthCm: number; thicknessCm: number };
}) {
  const w = dims?.widthCm ?? 15.5;
  const t = dims?.thicknessCm ?? 1.8;
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full"
      aria-hidden="true"
      role="img"
    >
      <rect x="40" y="90" width="320" height="100" fill="#e8e8e8" stroke="#333" strokeWidth="1.5" />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={80 + i * 70}
          y="110"
          width="40"
          height="60"
          fill="#ffffff"
          stroke="#333"
          strokeWidth="1.5"
        />
      ))}
      {/* Width annotation */}
      <line x1="40" y1="220" x2="360" y2="220" stroke="#333" strokeWidth="1" />
      <line x1="40" y1="215" x2="40" y2="225" stroke="#333" strokeWidth="1" />
      <line x1="360" y1="215" x2="360" y2="225" stroke="#333" strokeWidth="1" />
      <text x="200" y="240" textAnchor="middle" fontSize="12" fill="#333">
        {w}
      </text>
      {/* Thickness annotation */}
      <line x1="380" y1="90" x2="380" y2="190" stroke="#333" strokeWidth="1" />
      <line x1="375" y1="90" x2="385" y2="90" stroke="#333" strokeWidth="1" />
      <line x1="375" y1="190" x2="385" y2="190" stroke="#333" strokeWidth="1" />
      <text x="395" y="144" fontSize="12" fill="#333">
        {t}
      </text>
    </svg>
  );
}
