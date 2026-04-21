"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCategory, ProductType } from "@/lib/types";
import { products } from "@/data/products";
import SidebarFilters from "@/components/products/SidebarFilters";
import CategoryTabs from "@/components/products/CategoryTabs";
import MobileFiltersMenu from "@/components/products/MobileFiltersMenu";
import ProductGrid from "@/components/products/ProductGrid";
import SortControls from "@/components/products/SortControls";
import Pagination from "@/components/products/Pagination";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as ProductCategory | null;
  const qParam = searchParams.get("q") ?? "";
  const initialTab: ProductCategory | null = tabParam ?? null;

  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(
    initialTab
  );
  const [selectedTypes, setSelectedTypes] = useState<ProductType[]>([]);
  const [searchQuery, setSearchQuery] = useState(qParam);
  const [sortBy, setSortBy] = useState("name-asc");
  const [perPage, setPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersVisible, setFiltersVisible] = useState(true);

  // Clicking the active category deselects it (toggle to null).
  const handleCategoryChange = (cat: ProductCategory | null) => {
    setActiveCategory((prev) => (prev === cat ? null : cat));
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

  const handleClearAll = () => {
    setActiveCategory(null);
    setSelectedTypes([]);
    setSearchQuery("");
    setSortBy("name-asc");
    setCurrentPage(1);
  };

  // Product types available under the current category (or all types when no
  // category is selected). Drives the sidebar's "Product Type" checkbox list.
  const availableTypes = useMemo<ProductType[]>(() => {
    const pool = activeCategory
      ? products.filter((p) => p.category === activeCategory)
      : products;
    const set = new Set<ProductType>();
    for (const p of pool) set.add(p.productType);
    return Array.from(set);
  }, [activeCategory]);

  const filtered = useMemo(() => {
    let result = activeCategory
      ? products.filter((p) => p.category === activeCategory)
      : [...products];
    if (selectedTypes.length > 0) {
      result = result.filter((p) => selectedTypes.includes(p.productType));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.variantName.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.skuNumber.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
    return result;
  }, [activeCategory, selectedTypes, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="products-page">
      <main className="products-main container-lg py-6">
        {/* Mobile filter/sort drawer (<lg) */}
        <MobileFiltersMenu
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          availableTypes={availableTypes}
          selectedTypes={selectedTypes}
          onTypeToggle={handleTypeToggle}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          onSortChange={setSortBy}
          perPage={perPage}
          onPerPageChange={(n) => {
            setPerPage(n);
            setCurrentPage(1);
          }}
          onClearAll={handleClearAll}
        />

        <div
          className={`products-container ${
            filtersVisible ? "filters-open" : "filters-closed"
          }`}
        >
          {/* Left column — drawer with CategoryTabs + filter body. The outer
              column width animates to 0 on hide; inner stays 300px so the
              content never squishes, it just gets clipped + faded. */}
          <aside
            className="filters-aside hidden lg:block"
            aria-hidden={!filtersVisible}
            style={{ flexBasis: filtersVisible ? "300px" : "0px" }}
          >
            <div className="filters-aside-inner">
              <div className="pb-[15px]">
                <CategoryTabs
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                />
              </div>
              <SidebarFilters
                availableTypes={availableTypes}
                selectedTypes={selectedTypes}
                onTypeToggle={handleTypeToggle}
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                  setSearchQuery(q);
                  setCurrentPage(1);
                }}
              />
            </div>
          </aside>

          <div className="products-column flex min-w-0 flex-col gap-5">
            {filtersVisible ? (
              <SortControls
                sortBy={sortBy}
                onSortChange={setSortBy}
                perPage={perPage}
                onPerPageChange={(n) => {
                  setPerPage(n);
                  setCurrentPage(1);
                }}
                filtersVisible={filtersVisible}
                onToggleFilters={() => setFiltersVisible(!filtersVisible)}
              />
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <CategoryTabs
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                />
                <SortControls
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  perPage={perPage}
                  onPerPageChange={(n) => {
                    setPerPage(n);
                    setCurrentPage(1);
                  }}
                  filtersVisible={filtersVisible}
                  onToggleFilters={() => setFiltersVisible(!filtersVisible)}
                />
              </div>
            )}

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
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">Loading…</div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
