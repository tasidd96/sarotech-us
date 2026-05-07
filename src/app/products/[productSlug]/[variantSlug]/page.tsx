import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import {
  findVariantWithParams,
  findProductVariants,
  variantLabel,
} from "@/lib/slug";
import MaterialCalculator from "@/components/products/MaterialCalculator";
import ProductInfoSection from "@/components/products/ProductInfoSection";
import ProductFAQSection from "@/components/products/ProductFAQSection";
import ProductCTAs from "@/components/products/ProductCTAs";
import StockPill from "@/components/products/StockPill";
import ToneSelector from "@/components/products/ToneSelector";
import VariantAxisDropdowns from "@/components/products/VariantAxisDropdowns";
import VariantSwatches from "@/components/products/VariantSwatches";
import { VariantSelectionProvider } from "@/components/products/VariantSelectionContext";
import { formatInches } from "@/lib/units";
import { discountPercent } from "@/lib/price";

type PageParams = { productSlug: string; variantSlug: string };

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { productSlug, variantSlug: vSlug } = await params;
  const sp = await searchParams;
  const axisFilters: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") axisFilters[k] = v;
  }
  const catalog = await getCatalog();
  const variant = findVariantWithParams(
    productSlug,
    vSlug,
    axisFilters,
    catalog
  );
  if (!variant) return { title: "Product not found | SARO TECH USA" };

  const label = variantLabel(variant);
  const title = `${variant.name}, ${label} | SARO TECH USA`;
  const description =
    variant.detail?.description ??
    `${variant.name} in ${variant.variantName}. Premium WPC architectural finish from SARO TECH.`;
  // Variant image is the most relevant OG card for a specific SKU; falls
  // back to the site default when HL hasn't supplied a CDN image yet.
  const ogImage = variant.image
    ? [{ url: variant.image, alt: `${variant.name}, ${label}` }]
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/products/${productSlug}/${vSlug}`,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/products/${productSlug}/${vSlug}`,
      ...(ogImage ? { images: ogImage } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: ogImage.map((i) => i.url) } : {}),
    },
  };
}

const CATEGORY_LABEL: Record<string, string> = {
  interior: "Interior",
  exterior: "Exterior",
  accessories: "Accessories",
};

export default async function ProductVariantPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { productSlug, variantSlug: vSlug } = await params;
  const sp = await searchParams;
  // Flatten search params to a plain string map. Variant axes are
  // single-valued (Ribs=4-Ribs, Size=Regular, …); ignore arrays.
  const axisFilters: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") axisFilters[k] = v;
  }
  const catalog = await getCatalog();
  const variant = findVariantWithParams(
    productSlug,
    vSlug,
    axisFilters,
    catalog
  );
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
    <VariantSelectionProvider>
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
            className="product-detail-container grid grid-cols-1 gap-10 pb-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12"
          >
            {/* LEFT COLUMN — title block + main image */}
            <div className="product-left-column flex flex-col gap-[30px]">
              <div className="product-title-section">
                {/* Title row: just product name + category label. */}
                <div className="product-title-row flex items-baseline gap-3">
                  <h1 className="product-title text-[26px] font-medium leading-tight text-saro-dark">
                    {variant.name}
                  </h1>
                  <span className="product-detail-category text-[14px] font-normal text-gray-500">
                    {CATEGORY_LABEL[variant.category]}
                  </span>
                </div>
                {/* Stock pill sits alone under the title row. The variant
                    code (e.g. "A125-Antique Black Brushed") moved to the
                    right column inline with the rib/size dropdown — see
                    the .product-axis-section row below. */}
                {variant.inventory && (
                  <div className="mt-2">
                    <StockPill
                      inventory={variant.inventory}
                      discountPercent={discountPercent(
                        variant.price,
                        variant.listPrice
                      )}
                    />
                  </div>
                )}
              </div>

              <div className="product-image-section relative mx-auto h-[340px] w-full overflow-hidden rounded-md bg-gray-50 sm:aspect-square sm:h-auto lg:max-w-none">
                <Image
                  src={variant.image}
                  alt={`${variant.name} — ${variant.variantName}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 700px, 90vw"
                  className="object-contain p-2"
                />
              </div>
            </div>

            {/* RIGHT COLUMN — non-Color axis dropdowns + swatch grid +
                specs + CTAs. Color is intentionally absent from the
                dropdown list (the swatch grid is the color picker). */}
            <div className="product-right-column flex flex-col gap-[25px] pt-5">
              {variant.variantAxes && variant.variantAxes.length > 0 ? (
                <>
                  {/* Axis dropdown row, with the variant code (e.g.
                      "A125-Antique Black Brushed") inline on the right
                      so the row reads like "Ribs: 3-Ribs ▾ ··· A125-…". */}
                  <div className="product-axis-section flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2 border-t-2 border-black p-[10px]">
                    <VariantAxisDropdowns
                      product={variant}
                      siblings={siblings}
                      productSlug={productSlug}
                    />
                    <span className="text-[14.4px] text-saro-dark">
                      {variantCode}
                    </span>
                  </div>
                  <VariantSwatches
                    product={variant}
                    siblings={siblings}
                    productSlug={productSlug}
                  />
                </>
              ) : (
                <ToneSelector
                  siblings={siblings}
                  currentSku={variant.sku}
                  productSlug={productSlug}
                  activeToneFamily={toneFamily}
                  variantCode={variantCode}
                />
              )}

              {/* Dimensions */}
              <div className="product-size-section flex items-start justify-between border-t-2 border-black p-[10px]">
                <span className="size-label text-[16px] font-medium text-saro-dark">
                  Dimensions
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

              {/* Presentation — only shown when we have box-quantity data. */}
              {piecesPerBox ? (
                <div className="product-presentation-section flex items-center justify-between border-t-2 border-black p-[10px]">
                  <span className="presentation-label text-[16px] font-medium text-saro-dark">
                    Presentation
                  </span>
                  <span className="presentation-value text-[14.4px] text-saro-dark">
                    {piecesPerBox} pieces per box
                  </span>
                </div>
              ) : null}

              {/* CTAs */}
              <ProductCTAs
                productName={variant.name}
                variantCode={variantCode}
                sku={variant.skuNumber || variant.sku}
                inventory={variant.inventory}
                price={variant.price}
                listPrice={variant.listPrice}
              />
              <a
                href="#calculator"
                className="-mt-1 inline-flex items-center gap-1 text-[13px] font-medium text-saro-dark underline-offset-4 transition-colors hover:text-saro-green hover:underline"
              >
                Calculate material for your project →
              </a>
            </div>
          </div>
        </main>

        {/* Section 2 — Calculator band (full-width gray background). Pricing
            + sku flow through so the calculator's quote button carries the
            same context as the CTA section above. */}
        <MaterialCalculator
          dimensions={dims}
          sqftPerBox={variant.detail?.sqftPerBox}
          piecesPerBox={piecesPerBox}
          productName={variant.name}
          variantCode={variantCode}
          sku={variant.skuNumber || variant.sku}
          price={variant.price}
          listPrice={variant.listPrice}
        />

        {/* Section 3 — Info accordions + technical drawing */}
        <ProductInfoSection variant={variant} relatedProducts={related} />

        {/* Section 4 — FAQ + install guide */}
        <ProductFAQSection productName={variant.name} />
      </div>
    </VariantSelectionProvider>
  );
}
