import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { findVariant, findProductVariants, variantSlug } from "@/lib/slug";
import MaterialCalculator from "@/components/products/MaterialCalculator";
import ProductInfoSection from "@/components/products/ProductInfoSection";
import ProductFAQSection from "@/components/products/ProductFAQSection";

type PageParams = { productSlug: string; variantSlug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { productSlug, variantSlug: vSlug } = await params;
  const catalog = await getCatalog();
  const variant = findVariant(productSlug, vSlug, catalog);
  if (!variant) return { title: "Product not found | SARO TECH USA" };
  return {
    title: `${variant.name} — ${variant.sku}-${variant.variantName} | SARO TECH USA`,
    description:
      variant.detail?.description ??
      `${variant.name} in ${variant.variantName}. Premium WPC architectural finish from SARO TECH.`,
  };
}

const CATEGORY_LABEL: Record<string, string> = {
  interior: "Interior",
  exterior: "Exterior",
  accessories: "Accessories",
};

export default async function ProductVariantPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { productSlug, variantSlug: vSlug } = await params;
  const catalog = await getCatalog();
  const variant = findVariant(productSlug, vSlug, catalog);
  if (!variant) notFound();

  const siblings = findProductVariants(productSlug, catalog);
  // Related products: grab up to 3 accessory / cross-category picks.
  const related = catalog
    .filter(
      (p) =>
        p.sku !== variant.sku &&
        (p.productType === "clips" ||
          p.productType === "corner-pieces" ||
          p.productType === "deck-accessories")
    )
    .slice(0, 3);
  const toneFamily = variant.detail?.toneFamily ?? "Natural Tones";
  const dims = variant.detail?.dimensions;
  const piecesPerBox = variant.detail?.piecesPerBox;
  const variantCode = `${variant.sku}-${variant.variantName}`;

  return (
    <>
      <div className="product-detail-page">
        <main className="product-detail-main container-lg">
          <div
            className="product-detail-container mx-auto grid grid-cols-1 gap-10 px-4 pb-5 pt-6 md:px-8 lg:grid-cols-[420px_512px] lg:gap-10"
          >
            {/* LEFT COLUMN — title block + main image */}
            <div className="product-left-column flex flex-col gap-[30px]">
              <div className="product-title-section">
                <div className="product-title-row flex items-baseline gap-3">
                  <h1 className="product-title text-[26px] font-medium leading-tight text-saro-dark">
                    {variant.name}
                  </h1>
                  <span className="product-detail-category text-[14px] font-normal text-gray-500">
                    {CATEGORY_LABEL[variant.category]}
                  </span>
                </div>
                <span className="product-detail-tone mt-1 block text-[14.4px] text-gray-500">
                  {variantCode}
                </span>
              </div>

              <div className="product-image-section relative mx-auto h-[500px] w-full max-w-[420px]">
                <Image
                  src={variant.image}
                  alt={`${variant.name} — ${variant.variantName}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 420px, 90vw"
                  className="object-contain"
                />
              </div>
            </div>

            {/* RIGHT COLUMN — variant selector + specs */}
            <div className="product-right-column flex flex-col gap-[25px] pt-5">
              {/* Tone dropdown + variant code */}
              <div className="product-code-section flex items-center justify-between border-t-2 border-black p-[10px]">
                <div className="product-tone-dropdown-container flex items-center gap-2 text-[16px]">
                  <span className="text-saro-dark">Tone:</span>
                  <button
                    type="button"
                    className="flex items-center gap-1 underline-offset-2 hover:underline"
                    aria-label="Change tone family"
                  >
                    <span className="underline">{toneFamily}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
                <span className="product-finish-name text-[14.4px] text-saro-dark">
                  {variantCode}
                </span>
              </div>

              {/* Tone swatches */}
              <div className="product-finish-section has-scroll flex flex-col gap-4 px-[10px]">
                <p className="text-[14.4px] text-gray-600">
                  Select the tone you&apos;re looking for
                </p>
                <div className="carousel-arrows-container flex items-center gap-3 overflow-x-auto pb-1">
                  {siblings.map((s) => {
                    const isActive = s.sku === variant.sku;
                    const swatch = s.detail?.swatchColor ?? "#c9c9c9";
                    const sSlug = variantSlug(s);
                    return (
                      <Link
                        key={s.sku}
                        href={`/products/${productSlug}/${sSlug}`}
                        aria-label={`${s.sku}-${s.variantName}`}
                        aria-current={isActive ? "true" : undefined}
                        className={`relative h-[56px] w-[56px] flex-shrink-0 overflow-hidden rounded-full border-2 transition-all duration-200 hover:scale-105 ${
                          isActive
                            ? "border-saro-green shadow-md"
                            : "border-transparent hover:border-gray-300"
                        }`}
                        style={{ backgroundColor: swatch }}
                      >
                        <span className="sr-only">
                          {s.sku}-{s.variantName}
                        </span>
                      </Link>
                    );
                  })}
                </div>
                <p className="text-center text-[12px] text-gray-400">
                  ← Swipe to see more →
                </p>
              </div>

              {/* Size */}
              <div className="product-size-section flex items-start justify-between border-t-2 border-black p-[10px]">
                <span className="size-label text-[16px] font-medium text-saro-dark">
                  Size
                </span>
                {dims ? (
                  <div className="size-details text-right text-[14.4px] text-saro-dark">
                    Height: {dims.heightCm} cm
                    <br />
                    Width: {dims.widthCm} cm
                    <br />
                    Thickness: {dims.thicknessCm} cm
                  </div>
                ) : (
                  <div className="size-details text-right text-[14.4px] text-gray-400">
                    —
                  </div>
                )}
              </div>

              {/* SKU */}
              <div className="product-sku-section flex items-center justify-between border-t-2 border-black p-[10px]">
                <span className="sku-label text-[16px] font-medium text-saro-dark">
                  SKU
                </span>
                <span className="sku-value text-[14.4px] text-saro-dark">
                  {variant.skuNumber}
                </span>
              </div>

              {/* Presentation */}
              <div className="product-presentation-section flex items-center justify-between border-t-2 border-black p-[10px]">
                <span className="presentation-label text-[16px] font-medium text-saro-dark">
                  Presentation
                </span>
                <span className="presentation-value text-[14.4px] text-saro-dark">
                  {piecesPerBox ? `${piecesPerBox} pieces per box` : "—"}
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Section 2 — Calculator band (full-width gray background) */}
        <MaterialCalculator
          m2PerBox={variant.detail?.m2PerBox}
          piecesPerBox={piecesPerBox}
          productName={variant.name}
          variantCode={variantCode}
        />

        {/* Section 3 — Info accordions + technical drawing */}
        <ProductInfoSection variant={variant} relatedProducts={related} />

        {/* Section 4 — FAQ + install guide */}
        <ProductFAQSection productName={variant.name} />
      </div>
    </>
  );
}
