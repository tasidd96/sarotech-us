"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCategory, ProductType } from "@/lib/types";
import { products } from "@/data/products";
import ProductTabs from "@/components/products/ProductTabs";
import SidebarFilters from "@/components/products/SidebarFilters";
import ProductGrid from "@/components/products/ProductGrid";
import SortControls from "@/components/products/SortControls";
import Pagination from "@/components/products/Pagination";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as ProductCategory) || "interior";

  const [activeTab, setActiveTab] = useState<ProductCategory>(initialTab);
  const [selectedTypes, setSelectedTypes] = useState<ProductType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [perPage, setPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersVisible, setFiltersVisible] = useState(true);

  const handleTabChange = (tab: ProductCategory) => {
    setActiveTab(tab);
    setSelectedTypes([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleTypeToggle = (type: ProductType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.category === activeTab);
    if (selectedTypes.length > 0) {
      result = result.filter((p) => selectedTypes.includes(p.productType));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.variantName.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        default: return 0;
      }
    });
    return result;
  }, [activeTab, selectedTypes, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="mx-auto max-w-[1920px]">
      {/* Sub-navigation bar matching Figma (y=60, h=64) */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center px-4">
          <ProductTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      </div>

      {/* AI Visualizer button - positioned top right matching Figma */}
      <div className="mx-auto max-w-[1400px] px-4 pt-4">
        <div className="flex justify-end">
          <button className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:border-saro-green hover:text-saro-green">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Visualize Your Space
          </button>
        </div>
      </div>

      {/* Main content area: sidebar 300px + gap 30px + content 1070px */}
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <SortControls
          sortBy={sortBy}
          onSortChange={setSortBy}
          perPage={perPage}
          onPerPageChange={(n) => { setPerPage(n); setCurrentPage(1); }}
          filtersVisible={filtersVisible}
          onToggleFilters={() => setFiltersVisible(!filtersVisible)}
        />

        <div className="flex gap-[30px]">
          {/* Sidebar: 300px wide matching Figma */}
          {filtersVisible && (
            <div className="hidden w-[300px] flex-shrink-0 lg:block">
              <SidebarFilters
                selectedTypes={selectedTypes}
                onTypeToggle={handleTypeToggle}
                searchQuery={searchQuery}
                onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
              />
            </div>
          )}

          {/* Product grid area */}
          <div className="flex-1">
            <ProductGrid products={paginated} />

            {filtered.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                perPage={perPage}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex h-96 items-center justify-center">Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
