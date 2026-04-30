/**
 * Catalog data layer.
 *
 * Returns Product[] for UI. When HighLevel is configured (env vars present),
 * overlays live inventory and price onto the local product list — keyed by
 * `skuNumber` against HighLevel inventory `sku`. When HL is not configured
 * or the call fails, falls back to local seed data so the site keeps
 * rendering during development and before credentials are dropped in.
 *
 * Server-only. Use from server components, route handlers, or server actions.
 */

import { products as localProducts } from "@/data/products";
import { Product } from "./types";
import {
  getHighLevelConfig,
  HighLevelConfig,
  listInventory,
  listPricesForProduct,
  GHLInventoryItem,
  GHLPrice,
} from "./highlevel";

export async function getCatalog(): Promise<Product[]> {
  const config = getHighLevelConfig();
  if (!config) return localProducts;

  try {
    const inventory = await fetchAllInventory(config);
    const priceBySku = await fetchPriceBySku(config, inventory);
    const result = overlayHighLevel(localProducts, inventory, priceBySku);
    const matched = result.filter((p) => p.inventory).length;
    console.log(
      `[catalog] HL: ${inventory.length} inventory items, ${priceBySku.size} priced, ${matched}/${result.length} seed products matched.`
    );
    return result;
  } catch (err) {
    console.error("[catalog] HighLevel fetch failed:", err);
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

async function fetchAllInventory(
  config: HighLevelConfig
): Promise<GHLInventoryItem[]> {
  const all: GHLInventoryItem[] = [];
  const pageSize = 100;
  let offset = 0;
  // Safety cap — stops runaway loops if the API misreports totals.
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
// matching `inventory.name` to `price.name`. We resolve prices to SKUs here
// so the overlay step is a flat lookup.
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

function overlayHighLevel(
  products: Product[],
  inventory: GHLInventoryItem[],
  priceBySku: Map<string, number>
): Product[] {
  const bySkuNumber = new Map<string, GHLInventoryItem>();
  for (const item of inventory) {
    if (item.sku) bySkuNumber.set(item.sku, item);
  }
  return products.map((p) => {
    const hit = bySkuNumber.get(p.skuNumber);
    if (!hit) return p;
    const price = priceBySku.get(hit.sku);
    return {
      ...p,
      ...(typeof price === "number" ? { price } : {}),
      inventory: {
        available: hit.availableQuantity,
        inStock: hit.availableQuantity > 0 || hit.allowOutOfStockPurchases,
        allowOutOfStock: hit.allowOutOfStockPurchases,
      },
    };
  });
}
