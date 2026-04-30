/**
 * Catalog data layer.
 *
 * When HighLevel is configured, HL is the **source of truth** for the
 * catalog: the product list is built from HL inventory variants, prices
 * come from HL price-lists, and we overlay seed metadata (image, copy,
 * drawings, FAQs) onto any HL variant whose `sku` matches a seed
 * `skuNumber`. Variants without a seed match still render with HL data
 * and a category-default image.
 *
 * When HL is not configured (no env vars) or the call fails, we fall
 * back to the local seed so the site keeps rendering during development.
 *
 * Server-only. Use from server components, route handlers, or server actions.
 */

import { products as localProducts } from "@/data/products";
import {
  Product,
  ProductCategory,
  ProductDimensions,
  ProductType,
  VariantAxis,
} from "./types";
import {
  getHighLevelConfig,
  getProduct,
  HighLevelConfig,
  listInventory,
  listPricesForProduct,
  GHLProduct,
  GHLInventoryItem,
  GHLPrice,
  GHLShippingDimensions,
} from "./highlevel";

export async function getCatalog(): Promise<Product[]> {
  const config = getHighLevelConfig();
  if (!config) return localProducts;

  try {
    const inventory = await fetchAllInventory(config);
    const { productById, priceBySku } = await fetchProductsAndPrices(
      config,
      inventory
    );
    const result = buildCatalogFromHL(
      productById,
      inventory,
      priceBySku,
      localProducts
    );
    console.log(
      `[catalog] HL source of truth: ${productById.size} products, ${inventory.length} variants, ${result.length} sellable on site.`
    );
    return result;
  } catch (err) {
    console.error("[catalog] HighLevel fetch failed; using seed:", err);
    return localProducts;
  }
}

export async function getProductBySku(sku: string): Promise<Product | null> {
  const all = await getCatalog();
  return all.find((p) => p.sku === sku) ?? null;
}

export function isHighLevelConfigured(): boolean {
  return getHighLevelConfig() !== null;
}

// ─────────────────────────────────────────────────────────────────────────
// HL Product → site category/productType mapping.
//
// The site's category and productType unions are fixed (see types.ts).
// HL Product names map to those unions here. Edit this table when new HL
// Products are added or you want to recategorize existing ones.
// ─────────────────────────────────────────────────────────────────────────

interface HLProductMapping {
  category: ProductCategory;
  productType: ProductType;
  defaultImage: string;
}

const HL_PRODUCT_MAP: Record<string, HLProductMapping> = {
  "Decking/Flooring": {
    category: "exterior",
    productType: "floor-decking",
    defaultImage: "/images/categories/exterior.jpg",
  },
  "Wall Cladding": {
    category: "exterior",
    productType: "wall-panels",
    defaultImage: "/images/categories/coextruded-cladding.png",
  },
  "Coextruded Wall Panel": {
    // Coextruded WPC panels are weather-rated for outdoor cladding —
    // exterior is the canonical category. Talha confirmed no interior-only
    // material is on hand today.
    category: "exterior",
    productType: "coextruded-panels",
    defaultImage: "/images/categories/coextruded-cladding.png",
  },
  "Synthetic Marble": {
    category: "exterior",
    productType: "synthetic-marble",
    defaultImage: "/images/categories/continuous-synthetic-marble.png",
  },
  "WPC Corner": {
    category: "accessories",
    productType: "corner-pieces",
    defaultImage: "/images/categories/exterior-corner.png",
  },
  "Clips & Hardware": {
    category: "accessories",
    productType: "clips",
    defaultImage: "/images/categories/accessories.jpg",
  },
  "PU Stone": {
    category: "exterior",
    productType: "wall-panels",
    defaultImage: "/images/categories/exterior.jpg",
  },
  "Synthetic Travertine Stone": {
    category: "exterior",
    productType: "wall-panels",
    defaultImage: "/images/categories/exterior.jpg",
  },
  "Coextruded Beam": {
    category: "exterior",
    productType: "deck-accessories",
    defaultImage: "/images/categories/coextruded-beam.png",
  },
  "Architectural Model Render (3D)": {
    category: "accessories",
    productType: "deck-accessories",
    defaultImage: "/images/categories/accessories.jpg",
  },
};

const FALLBACK_MAPPING: HLProductMapping = {
  category: "accessories",
  productType: "deck-accessories",
  defaultImage: "/images/categories/accessories.jpg",
};

// ─────────────────────────────────────────────────────────────────────────
// Builders
// ─────────────────────────────────────────────────────────────────────────

function buildCatalogFromHL(
  productById: Map<string, GHLProduct>,
  inventory: GHLInventoryItem[],
  priceBySku: Map<string, GHLPrice>,
  seed: Product[]
): Product[] {
  const seedBySkuNumber = new Map(seed.map((p) => [p.skuNumber, p]));
  const sellable = inventory.filter(isSellable);

  return sellable.map((item) => {
    const hlProduct = productById.get(item.product);
    const productName = hlProduct?.name ?? "Product";
    const mapping = HL_PRODUCT_MAP[productName] ?? FALLBACK_MAPPING;
    const { sku, variantName } = parseVariantName(item.name);
    const priceRecord = item.sku ? priceBySku.get(item.sku) : undefined;
    const price = priceRecord?.amount;
    const seedMatch = item.sku ? seedBySkuNumber.get(item.sku) : undefined;

    const variantAxes: VariantAxis[] | undefined = hlProduct?.variants?.length
      ? hlProduct.variants
      : undefined;
    const selectedOptions = variantAxes
      ? deriveSelectedOptions(variantAxes, priceRecord?.variantOptionIds ?? [])
      : undefined;

    const hlDimensions = mapShippingDimensions(
      priceRecord?.shippingOptions?.dimensions
    );
    // Seed dimensions win when present (the marketing-blessed numbers); HL's
    // shipping dims are a reasonable fallback when no seed match exists.
    const detail = mergeDetail(seedMatch?.detail, hlDimensions);

    const built: Product = {
      id: item._id,
      name: productName,
      sku: sku || item.sku || item._id,
      skuNumber: item.sku ?? "",
      variantName: variantName || item.name,
      category: seedMatch?.category ?? mapping.category,
      productType: seedMatch?.productType ?? mapping.productType,
      // HL variant image (CDN-hosted, set per inventory item) takes priority
      // over seed image and the category fallback. ~all variants in HL today
      // have one set, so this is the primary image source in practice.
      image: item.image ?? seedMatch?.image ?? mapping.defaultImage,
      featured: seedMatch?.featured,
      detail,
      ...(typeof price === "number" ? { price } : {}),
      inventory: {
        available: item.availableQuantity ?? 0,
        inStock:
          (item.availableQuantity ?? 0) > 0 || item.allowOutOfStockPurchases,
        allowOutOfStock: item.allowOutOfStockPurchases,
      },
      ...(variantAxes ? { variantAxes } : {}),
      ...(selectedOptions ? { selectedOptions } : {}),
    };
    return built;
  });
}

// Sellable = stocked OR explicitly opted-in to out-of-stock purchases.
function isSellable(item: GHLInventoryItem): boolean {
  const qty = item.availableQuantity;
  return (typeof qty === "number" && qty > 0) || item.allowOutOfStockPurchases;
}

// HL variant names commonly embed an alphanumeric SKU prefix like "A41-Teak
// Dual / Regular". Sometimes that prefix is preceded by structural metadata
// like "4-Ribs / " or "4x8 / " (e.g. "5-Ribs / A13-Teak Brushed"). For card
// display we want the variant name to start at the A##- token and run to
// the end — so "5-Ribs / A13-Teak Brushed" becomes "A13-Teak Brushed", but
// "A41-Teak Dual / Regular" stays as "A41-Teak Dual / Regular".
//
// The matched SKU prefix is also returned for slug generation and seed
// metadata matching.
function parseVariantName(name: string): {
  sku: string;
  variantName: string;
} {
  const m = name.match(/([A-Z]+\d+)-/);
  if (!m) return { sku: "", variantName: name };
  const sku = m[1];
  const idx = name.indexOf(m[0]);
  const variantName = name.slice(idx).trim();
  return { sku, variantName };
}

// Map HL price.variantOptionIds[] back to { axisName: optionName } using the
// parent product's variants[] structure. Each axis has a list of options
// with stable IDs; the price references option IDs, one per axis.
function deriveSelectedOptions(
  axes: VariantAxis[],
  optionIds: string[]
): Record<string, string> {
  const idSet = new Set(optionIds);
  const out: Record<string, string> = {};
  for (const axis of axes) {
    const hit = axis.options.find((o) => idSet.has(o.id));
    if (hit) out[axis.name] = hit.name;
  }
  return out;
}

// HL ships dimensions on the price record under shippingOptions.dimensions.
// Map (length, width, height) → (heightIn, widthIn, thicknessIn) which is
// how the site's calculator + size display expect them. For a wall panel
// this is "long-side, narrow-side, depth" which matches the convention.
function mapShippingDimensions(
  d: GHLShippingDimensions | undefined
): ProductDimensions | undefined {
  if (!d) return undefined;
  const heightIn = d.length;
  const widthIn = d.width;
  const thicknessIn = d.height;
  if (
    typeof heightIn !== "number" ||
    typeof widthIn !== "number" ||
    typeof thicknessIn !== "number"
  ) {
    return undefined;
  }
  return { heightIn, widthIn, thicknessIn };
}

// Merge: keep all of seedDetail, but if it doesn't have dimensions and HL
// provided some, fall back to HL. Returns undefined when both are empty.
function mergeDetail(
  seedDetail: Product["detail"],
  hlDimensions: ProductDimensions | undefined
): Product["detail"] {
  if (!seedDetail && !hlDimensions) return undefined;
  if (!seedDetail) return { dimensions: hlDimensions };
  if (seedDetail.dimensions || !hlDimensions) return seedDetail;
  return { ...seedDetail, dimensions: hlDimensions };
}

// ─────────────────────────────────────────────────────────────────────────
// HL fetchers
// ─────────────────────────────────────────────────────────────────────────

async function fetchAllInventory(
  config: HighLevelConfig
): Promise<GHLInventoryItem[]> {
  const all: GHLInventoryItem[] = [];
  const pageSize = 100;
  let offset = 0;
  for (let i = 0; i < 50; i++) {
    const page = await listInventory(config, { limit: pageSize, offset });
    all.push(...page.inventory);
    if (page.inventory.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

// For each unique product id referenced by inventory, fetch the full HL
// product (with `variants` and `medias`) AND its prices in parallel. The
// full product is required to know the variant axes (Color, Size, etc.)
// and option lookup tables; the list endpoint does not return variants.
//
// Variants are linked from inventory → prices by matching `inventory.name`
// to `price.name` within the same product. We surface the full GHLPrice
// (not just amount) so callers can read shippingOptions.dimensions and
// variantOptionIds.
async function fetchProductsAndPrices(
  config: HighLevelConfig,
  inventory: GHLInventoryItem[]
): Promise<{
  productById: Map<string, GHLProduct>;
  priceBySku: Map<string, GHLPrice>;
}> {
  const productIds = Array.from(
    new Set(inventory.map((i) => i.product).filter(Boolean))
  );

  const data = await Promise.all(
    productIds.map(async (productId) => {
      try {
        const [pricesRes, fullProduct] = await Promise.all([
          listPricesForProduct(config, productId),
          getProduct(config, productId),
        ]);
        return { productId, prices: pricesRes.prices, product: fullProduct };
      } catch (err) {
        console.error(
          `[catalog] product/price fetch failed for ${productId}:`,
          err
        );
        return { productId, prices: [] as GHLPrice[], product: null };
      }
    })
  );

  const productById = new Map<string, GHLProduct>();
  const pricesByProductId = new Map<string, GHLPrice[]>();
  for (const d of data) {
    if (d.product) productById.set(d.productId, d.product);
    pricesByProductId.set(d.productId, d.prices);
  }

  const priceBySku = new Map<string, GHLPrice>();
  for (const item of inventory) {
    if (!item.sku) continue;
    const list = pricesByProductId.get(item.product) ?? [];
    // Primary match: same name (e.g. price.name === inventory.name).
    // Fallback: HL also stores `sku` directly on price records.
    const match =
      list.find((p) => p.name === item.name) ??
      list.find((p) => p.sku === item.sku);
    if (match) priceBySku.set(item.sku, match);
  }
  return { productById, priceBySku };
}
