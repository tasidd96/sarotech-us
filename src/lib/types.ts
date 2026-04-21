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
