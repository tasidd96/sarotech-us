/**
 * HighLevel (GoHighLevel) API v2 client — server-only.
 *
 * Docs: https://marketplace.gohighlevel.com/docs/
 * Spec: https://github.com/GoHighLevel/highlevel-api-docs
 *
 * Required env vars (see .env.local.example):
 *   HIGHLEVEL_LOCATION_ID   — sub-account (location) ID
 *   HIGHLEVEL_ACCESS_TOKEN  — Private Integration Token or OAuth access token
 *   HIGHLEVEL_API_VERSION   — defaults to 2021-07-28
 *
 * This module reads env vars without the NEXT_PUBLIC_ prefix, so imports are
 * confined to server components, route handlers, and server actions.
 */

const BASE_URL = "https://services.leadconnectorhq.com";
const DEFAULT_VERSION = "2021-07-28";

export interface HighLevelConfig {
  locationId: string;
  accessToken: string;
  version: string;
}

export function getHighLevelConfig(): HighLevelConfig | null {
  const locationId = process.env.HIGHLEVEL_LOCATION_ID;
  const accessToken = process.env.HIGHLEVEL_ACCESS_TOKEN;
  if (!locationId || !accessToken) return null;
  return {
    locationId,
    accessToken,
    version: process.env.HIGHLEVEL_API_VERSION || DEFAULT_VERSION,
  };
}

export interface GHLMedia {
  id: string;
  title?: string;
  url: string;
  type: string;
  isFeatured?: boolean;
  /** When set, this media is associated with these specific price (variant) IDs. */
  priceIds?: string[];
}

export interface GHLVariantOption {
  id: string;
  name: string;
}

export interface GHLVariantAxis {
  id: string;
  name: string;
  options: GHLVariantOption[];
}

export interface GHLProduct {
  _id: string;
  name: string;
  description?: string;
  productType?: string;
  image?: string;
  statementDescriptor?: string;
  availableInStore?: boolean;
  locationId: string;
  collectionIds?: string[];
  slug?: string;
  createdAt: string;
  updatedAt: string;
  medias?: GHLMedia[];
  variants?: GHLVariantAxis[];
}

export interface GHLInventoryItem {
  _id: string;
  name: string;
  sku: string;
  availableQuantity: number;
  allowOutOfStockPurchases: boolean;
  product: string;
  productName?: string;
  image?: string;
  updatedAt: string;
}

export interface ListProductsParams {
  limit?: number;
  offset?: number;
  search?: string;
  collectionIds?: string;
  productIds?: string[];
  expand?: string[];
}

export interface ListProductsResponse {
  products: GHLProduct[];
  total: Array<{ total: number }>;
}

export interface ListInventoryParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface ListInventoryResponse {
  inventory: GHLInventoryItem[];
  total: { total: number };
}

export interface GHLShippingDimensions {
  length?: number;
  width?: number;
  height?: number;
  unit?: string; // typically "in"
}

export interface GHLShippingOptions {
  weight?: { value?: number | null; unit?: string };
  dimensions?: GHLShippingDimensions;
}

export interface GHLPrice {
  _id: string;
  name?: string;
  type?: string;
  currency?: string;
  amount: number;
  product: string;
  compareAtPrice?: number;
  /** SKU as set in HL inventory (matches GHLInventoryItem.sku). */
  sku?: string;
  /** Option IDs referencing GHLVariantAxis.options[*].id on the parent product. */
  variantOptionIds?: string[];
  shippingOptions?: GHLShippingOptions;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListPricesResponse {
  prices: GHLPrice[];
  total: number;
}

// Page cache TTL. 60s is a reasonable floor for "near-realtime" inventory
// without hammering the GHL API on every request.
const REVALIDATE_SECONDS = 60;

async function ghlFetch<T>(
  config: HighLevelConfig,
  path: string,
  params: Record<string, string | number | string[] | undefined>
): Promise<T> {
  const url = new URL(path, BASE_URL);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) {
      for (const item of v) url.searchParams.append(k, item);
    } else {
      url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      Version: config.version,
      Accept: "application/json",
    },
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `HighLevel API ${res.status} ${path}: ${body || res.statusText}`
    );
  }
  return res.json() as Promise<T>;
}

export async function listProducts(
  config: HighLevelConfig,
  params: ListProductsParams = {}
): Promise<ListProductsResponse> {
  return ghlFetch<ListProductsResponse>(config, "/products/", {
    locationId: config.locationId,
    limit: params.limit ?? 100,
    offset: params.offset ?? 0,
    search: params.search,
    collectionIds: params.collectionIds,
    productIds: params.productIds,
    expand: params.expand,
  });
}

export async function getProduct(
  config: HighLevelConfig,
  productId: string
): Promise<GHLProduct> {
  return ghlFetch<GHLProduct>(config, `/products/${productId}`, {
    locationId: config.locationId,
  });
}

export async function listInventory(
  config: HighLevelConfig,
  params: ListInventoryParams = {}
): Promise<ListInventoryResponse> {
  return ghlFetch<ListInventoryResponse>(config, "/products/inventory", {
    altId: config.locationId,
    altType: "location",
    limit: params.limit ?? 100,
    offset: params.offset ?? 0,
    search: params.search,
  });
}

export async function listPricesForProduct(
  config: HighLevelConfig,
  productId: string,
  params: { limit?: number; offset?: number } = {}
): Promise<ListPricesResponse> {
  return ghlFetch<ListPricesResponse>(
    config,
    `/products/${productId}/price`,
    {
      locationId: config.locationId,
      limit: params.limit ?? 100,
      offset: params.offset ?? 0,
    }
  );
}
