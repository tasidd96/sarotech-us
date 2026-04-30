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
import { Product, ProductCategory, ProductType } from "./types";
import {
  getHighLevelConfig,
  HighLevelConfig,
  listProducts,
  listInventory,
  listPricesForProduct,
  GHLProduct,
  GHLInventoryItem,
  GHLPrice,
} from "./highlevel";

export async function getCatalog(): Promise<Product[]> {
  const config = getHighLevelConfig();
  if (!config) return localProducts;

  try {
    const [hlProducts, inventory] = await Promise.all([
      fetchAllProducts(config),
      fetchAllInventory(config),
    ]);
    const priceBySku = await fetchPriceBySku(config, inventory);
    const result = buildCatalogFromHL(
      hlProducts,
      inventory,
      priceBySku,
      localProducts
    );
    console.log(
      `[catalog] HL source of truth: ${hlProducts.length} products, ${inventory.length} variants, ${result.length} sellable on site.`
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
    category: "interior",
    productType: "coextruded-panels",
    defaultImage: "/images/categories/coextruded-cladding.png",
  },
  "Synthetic Marble": {
    category: "interior",
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
  hlProducts: GHLProduct[],
  inventory: GHLInventoryItem[],
  priceBySku: Map<string, number>,
  seed: Product[]
): Product[] {
  const productById = new Map(hlProducts.map((p) => [p._id, p]));
  const seedBySkuNumber = new Map(seed.map((p) => [p.skuNumber, p]));

  const sellable = inventory.filter(isSellable);

  return sellable.map((item) => {
    const hlProduct = productById.get(item.product);
    const productName = hlProduct?.name ?? "Product";
    const mapping = HL_PRODUCT_MAP[productName] ?? FALLBACK_MAPPING;
    const { sku, variantName } = parseVariantName(item.name);
    const price = item.sku ? priceBySku.get(item.sku) : undefined;
    const seedMatch = item.sku ? seedBySkuNumber.get(item.sku) : undefined;

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
      detail: seedMatch?.detail,
      ...(typeof price === "number" ? { price } : {}),
      inventory: {
        available: item.availableQuantity ?? 0,
        inStock:
          (item.availableQuantity ?? 0) > 0 || item.allowOutOfStockPurchases,
        allowOutOfStock: item.allowOutOfStockPurchases,
      },
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

// ─────────────────────────────────────────────────────────────────────────
// HL fetchers
// ─────────────────────────────────────────────────────────────────────────

async function fetchAllProducts(
  config: HighLevelConfig
): Promise<GHLProduct[]> {
  const all: GHLProduct[] = [];
  const pageSize = 100;
  let offset = 0;
  for (let i = 0; i < 50; i++) {
    const page = await listProducts(config, { limit: pageSize, offset });
    all.push(...page.products);
    if (page.products.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

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

// HL stores one Product with many variants; each variant has its own SKU
// (in inventory) and its own price (in prices). Variants are linked by
// matching `inventory.name` to `price.name`. We resolve prices to SKUs
// here so the build step is a flat lookup.
async function fetchPriceBySku(
  config: HighLevelConfig,
  inventory: GHLInventoryItem[]
): Promise<Map<string, number>> {
  const productIds = Array.from(
    new Set(inventory.map((i) => i.product).filter(Boolean))
  );

  const productPrices = await Promise.all(
    productIds.map(async (productId) => {
      try {
        const { prices } = await listPricesForProduct(config, productId);
        return [productId, prices] as const;
      } catch (err) {
        console.error(
          `[catalog] price fetch failed for product ${productId}:`,
          err
        );
        return [productId, [] as GHLPrice[]] as const;
      }
    })
  );
  const pricesByProductId = new Map(productPrices);

  const priceBySku = new Map<string, number>();
  for (const item of inventory) {
    if (!item.sku) continue;
    const list = pricesByProductId.get(item.product) ?? [];
    const match = list.find((p) => p.name === item.name);
    if (match && typeof match.amount === "number") {
      priceBySku.set(item.sku, match.amount);
    }
  }
  return priceBySku;
}
