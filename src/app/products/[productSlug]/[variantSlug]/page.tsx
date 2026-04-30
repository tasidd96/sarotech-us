import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { findVariant, findProductVariants, variantLabel } from "@/lib/slug";
import MaterialCalculator from "@/components/products/MaterialCalculator";
import ProductInfoSection from "@/components/products/ProductInfoSection";
import ProductFAQSection from "@/components/products/ProductFAQSection";
import ToneSelector from "@/components/products/ToneSelector";
import { formatInches } from "@/lib/units";

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
    title: `${variant.name} — ${variantLabel(variant)} | SARO TECH USA`,
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
  const variantCode = variantLabel(variant);

  return (
    <>
      <div className="product-detail-page">
        <main className="product-detail-main container-std pt-6">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="product-breadcrumb mb-4 text-[13px] text-gray-500"
          >
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-saro-green hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-400">
                ›
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-saro-green hover:underline"
                >
                  Products
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-400">
                ›
              </li>
              <li>
                <Link
                  href={`/products?tab=${variant.category}`}
                  className="hover:text-saro-green hover:underline"
                >
                  {CATEGORY_LABEL[variant.category]}
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-400">
                ›
              </li>
              <li className="text-saro-dark" aria-current="page">
                {variant.name}
              </li>
            </ol>
          </nav>

          <div
            className="product-detail-container grid grid-cols-1 gap-10 pb-5 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-12"
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

              <div className="product-image-section relative mx-auto h-[340px] w-full max-w-[420px] sm:h-[420px] lg:h-[500px]">
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
              <ToneSelector
                siblings={siblings}
                currentSku={variant.sku}
                productSlug={productSlug}
                activeToneFamily={toneFamily}
                variantCode={variantCode}
              />



              {/* Size */}
              <div className="product-size-section flex items-start justify-between border-t-2 border-black p-[10px]">
                <span className="size-label text-[16px] font-medium text-saro-dark">
                  Size
                </span>
                {dims ? (
                  <div className="size-details text-right text-[14.4px] text-saro-dark">
                    Height: {formatInches(dims.heightIn)}
                    <br />
                    Width: {formatInches(dims.widthIn)}
                    <br />
                    Thickness: {formatInches(dims.thicknessIn)}
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

              {/* CTAs */}
              <div className="product-cta-section mt-2 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/contact?product=${encodeURIComponent(
                    variant.name
                  )}&variant=${encodeURIComponent(variantCode)}`}
                  className="inline-flex flex-1 items-center justify-center rounded bg-saro-green px-8 py-3 text-[14px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-saro-green-light"
                >
                  Get a Quote
                </Link>
                <a
                  href="#calculator"
                  className="inline-flex flex-1 items-center justify-center rounded border border-saro-dark px-8 py-3 text-[14px] font-semibold uppercase tracking-wider text-saro-dark transition-colors hover:bg-saro-dark hover:text-white"
                >
                  Calculate Material
                </a>
              </div>
            </div>
          </div>
        </main>

        {/* Section 2 — Calculator band (full-width gray background) */}
        <MaterialCalculator
          dimensions={dims}
          sqftPerBox={variant.detail?.sqftPerBox}
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
