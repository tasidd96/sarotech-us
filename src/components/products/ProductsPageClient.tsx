"use client";

import { useEffect, useMemo, useState } from "react";
import { Product, ProductCategory, ProductType } from "@/lib/types";
import { productMatchesCategory } from "@/lib/category";
import SidebarFilters from "@/components/products/SidebarFilters";
import CategoryTabs from "@/components/products/CategoryTabs";
import MobileFiltersMenu from "@/components/products/MobileFiltersMenu";
import ProductGrid from "@/components/products/ProductGrid";
import SortControls from "@/components/products/SortControls";
import Pagination from "@/components/products/Pagination";

interface Props {
  products: Product[];
  initialTab: ProductCategory | null;
  initialQ: string;
  initialTypes?: ProductType[];
}

export default function ProductsPageClient({
  products,
  initialTab,
  initialQ,
  initialTypes,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(
    initialTab
  );
  const [selectedTypes, setSelectedTypes] = useState<ProductType[]>(
    initialTypes ?? []
  );
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [sortBy, setSortBy] = useState("name-asc");
  const [perPage, setPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersVisible, setFiltersVisible] = useState(true);

  // Sync filter state to the URL via history.replaceState whenever the user
  // changes a filter. This makes URL the source of truth for filters: a
  // refresh restores the same view, the sub-nav (which reads URL) reflects
  // the active selection, and copy-paste of the URL reproduces the filtered
  // listing. We use replaceState (not router.replace) to update the URL bar
  // without triggering a Next.js navigation — the data is already loaded
  // client-side, no need for a server round-trip on every checkbox click.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    if (activeCategory) params.set("tab", activeCategory);
    for (const t of selectedTypes) params.append("type", t);
    if (searchQuery) params.set("q", searchQuery);
    const qs = params.toString();
    const newUrl =
      window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
    if (newUrl !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.replaceState(null, "", newUrl);
      // Notify any URL-listening UI (e.g. ProductsSubNav) so it can re-read
      // searchParams and update active state.
      window.dispatchEvent(new Event("popstate"));
    }
  }, [activeCategory, selectedTypes, searchQuery]);

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

  // Product types available under the current category (or all when none selected).
  const availableTypes = useMemo<ProductType[]>(() => {
    const pool = activeCategory
      ? products.filter((p) =>
          productMatchesCategory(p, activeCategory)
        )
      : products;
    const set = new Set<ProductType>();
    for (const p of pool) set.add(p.productType);
    return Array.from(set);
  }, [activeCategory, products]);

  const filtered = useMemo(() => {
    let result = activeCategory
      ? products.filter((p) =>
          productMatchesCategory(p, activeCategory)
        )
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
  }, [activeCategory, selectedTypes, searchQuery, sortBy, products]);

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
            {/* Desktop-only controls — mobile uses MobileFiltersMenu above */}
            <div className="hidden lg:block">
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
            </div>

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
