export type ProductCategory = "interior" | "exterior" | "accessories";

export type ProductType =
  | "floor-decking"
  | "wall-panels"
  | "wide-wall-panels"
  | "synthetic-marble"
  | "deck-accessories"
  | "clips"
  | "corner-pieces"
  | "coextruded-panels";

export interface Inventory {
  available: number;
  inStock: boolean;
  allowOutOfStock: boolean;
}

export interface ProductDimensions {
  heightIn: number;
  widthIn: number;
  thicknessIn: number;
}

export interface ProductDetail {
  toneFamily?: string;
  swatchColor?: string;
  dimensions?: ProductDimensions;
  piecesPerBox?: number;
  sqftPerBox?: number;
  description?: string;
  techSheetUrl?: string;
  installGuideUrl?: string;
  technicalDrawingUrl?: string;
}

/**
 * A single option within a variant axis (e.g. "A41-Teak Dual" within
 * the "Color" axis, or "Regular" within the "Size" axis). The id is
 * HighLevel's stable option ID; name is the human label.
 */
export interface VariantOption {
  id: string;
  name: string;
}

/**
 * A variant axis on a product (e.g. "Color", "Size", "Style"). Defined
 * in HighLevel on the parent Product. Each inventory variant carries a
 * combination of one option per axis.
 */
export interface VariantAxis {
  id: string;
  name: string;
  options: VariantOption[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  skuNumber: string;
  variantName: string;
  category: ProductCategory;
  productType: ProductType;
  image: string;
  price?: number;
  featured?: boolean;
  inventory?: Inventory;
  detail?: ProductDetail;
  /**
   * The variant axes defined on the parent product (HL-driven).
   * Same array shared across all variants of a product so the selector
   * UI knows the full option set per axis.
   */
  variantAxes?: VariantAxis[];
  /**
   * This variant's selected option per axis, keyed by axis name.
   * e.g. { Color: "A41-Teak Dual", Size: "Regular" }
   */
  selectedOptions?: Record<string, string>;
}

export interface Category {
  id: ProductCategory;
  name: string;
  image: string;
  productCount: number;
}

export type ProjectCategoryTag = "fuel-station";

export interface Project {
  id: string;
  name: string;
  image: string;
  description?: string;
  featured?: boolean;
  category?: ProjectCategoryTag;
}

export interface Location {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone?: string;
}

export interface FilterState {
  category: ProductCategory;
  productTypes: ProductType[];
  searchQuery: string;
  sortBy: "name-asc" | "name-desc" | "newest";
  perPage: number;
  currentPage: number;
}
