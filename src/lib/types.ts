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
  heightCm: number;
  widthCm: number;
  thicknessCm: number;
}

export interface ProductDetail {
  toneFamily?: string;
  swatchColor?: string;
  dimensions?: ProductDimensions;
  piecesPerBox?: number;
  m2PerBox?: number;
  description?: string;
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
}

export interface Category {
  id: ProductCategory;
  name: string;
  image: string;
  productCount: number;
}

export interface Project {
  id: string;
  name: string;
  image: string;
  description?: string;
  featured?: boolean;
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
