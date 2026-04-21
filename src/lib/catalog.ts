/**
 * Catalog data layer.
 *
 * Returns Product[] for UI. When HighLevel is configured (env vars present),
 * overlays live inventory onto the local product list by SKU. When not, falls
 * back to the local seed data so the site keeps rendering during development
 * and before credentials are dropped in.
 *
 * Server-only. Use from server components, route handlers, or server actions.
 */

import { products as localProducts } from "@/data/products";
import { Product } from "./types";
import {
  getHighLevelConfig,
  listInventory,
  GHLInventoryItem,
} from "./highlevel";

export async function getCatalog(): Promise<Product[]> {
  const config = getHighLevelConfig();
  if (!config) return localProducts;

  try {
    const { inventory } = await fetchAllInventory();
    return overlayInventory(localProducts, inventory);
  } catch (err) {
    console.error("[catalog] HighLevel inventory fetch failed:", err);
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

async function fetchAllInventory(): Promise<{ inventory: GHLInventoryItem[] }> {
  const config = getHighLevelConfig();
  if (!config) return { inventory: [] };

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
  return { inventory: all };
}

function overlayInventory(
  products: Product[],
  inventory: GHLInventoryItem[]
): Product[] {
  const bySku = new Map<string, GHLInventoryItem>();
  for (const item of inventory) {
    if (item.sku) bySku.set(item.sku, item);
  }
  return products.map((p) => {
    const hit = bySku.get(p.sku);
    if (!hit) return p;
    return {
      ...p,
      inventory: {
        available: hit.availableQuantity,
        inStock: hit.availableQuantity > 0 || hit.allowOutOfStockPurchases,
        allowOutOfStock: hit.allowOutOfStockPurchases,
      },
    };
  });
}
