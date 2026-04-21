"use client";

import { useState } from "react";
import { ProductCategory, ProductType } from "@/lib/types";
import { productTypeLabels } from "@/data/products";

interface Props {
  activeCategory: ProductCategory | null;
  onCategoryChange: (c: ProductCategory | null) => void;
  availableTypes: ProductType[];
  selectedTypes: ProductType[];
  onTypeToggle: (t: ProductType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: string;
  onSortChange: (s: string) => void;
  perPage: number;
  onPerPageChange: (n: number) => void;
  onClearAll: () => void;
}

type SectionKey = "category" | "type" | "colors" | "sort" | "perPage";

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: "interior", label: "Interior" },
  { id: "exterior", label: "Exterior" },
  { id: "accessories", label: "Accessories" },
];
const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "newest", label: "Newest" },
];
const PER_PAGE_OPTIONS = [12, 24, 48];
const COLOR_SWATCHES = [
  { name: "Natural Walnut", color: "#6f4a2d" },
  { name: "Oak", color: "#e4d5b7" },
  { name: "Tropical Hardwood", color: "#8a6a55" },
  { name: "White Oak", color: "#eae0cd" },
  { name: "Hardwood Black", color: "#3a2a22" },
  { name: "Pine Black", color: "#1f1a17" },
  { name: "Gray Matte", color: "#8a8a8a" },
];

export default function MobileFiltersMenu(props: Props) {
  const {
    activeCategory,
    onCategoryChange,
    availableTypes,
    selectedTypes,
    onTypeToggle,
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    perPage,
    onPerPageChange,
    onClearAll,
  } = props;

  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<SectionKey | null>(null);
  const [unspecifiedColor, setUnspecifiedColor] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const toggleSection = (key: SectionKey) =>
    setSection((prev) => (prev === key ? null : key));

  const toggleColor = (name: string) =>
    setSelectedColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );

  const Arrow = ({ open }: { open: boolean }) => (
    <span
      className="mobile-filter-arrow inline-block text-[10px] transition-transform duration-300"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      ▼
    </span>
  );

  return (
    <div className="mobile-filters-menu lg:hidden">
      <div className="mobile-filters-header-container flex items-center justify-between pb-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mobile-filters-toggle flex items-center gap-2 text-[14px] font-semibold uppercase tracking-[0.5px] text-saro-dark"
        >
          <span>Filters</span>
          <Arrow open={open} />
        </button>
        <button
          type="button"
          onClick={onClearAll}
          className="mobile-clear-filters-external-btn flex items-center gap-2 text-[13px] text-[#666] hover:text-saro-green"
        >
          <span>Clear filters</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div
        className={`mobile-filters-dropdown overflow-hidden transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Search (always-accessible text field) */}
        <div className="pt-3 pb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search SKU or name…"
            className="w-full rounded border border-gray-300 px-3 py-2 text-[14px] focus:border-saro-green focus:outline-none"
          />
        </div>

        {/* Accordion sections */}
        <AccordionSection
          title="Filter by category"
          isOpen={section === "category"}
          onToggle={() => toggleSection("category")}
        >
          <div className="flex flex-wrap gap-2 pt-2">
            {CATEGORIES.map((c) => {
              const active = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onCategoryChange(c.id)}
                  className={`rounded-full border px-4 py-1.5 text-[13px] transition-colors duration-300 ${
                    active
                      ? "border-saro-green bg-saro-green text-white"
                      : "border-gray-300 text-[#666] hover:border-saro-green"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </AccordionSection>

        <AccordionSection
          title="Product type"
          isOpen={section === "type"}
          onToggle={() => toggleSection("type")}
        >
          <div className="flex flex-col gap-2 pt-2">
            {availableTypes.map((t) => (
              <label
                key={t}
                className="flex cursor-pointer items-center gap-2 text-[14px] text-[#333]"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(t)}
                  onChange={() => onTypeToggle(t)}
                  className="h-4 w-4 accent-saro-green"
                />
                {productTypeLabels[t]}
              </label>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection
          title="Colors"
          isOpen={section === "colors"}
          onToggle={() => toggleSection("colors")}
        >
          <label className="flex cursor-pointer items-center gap-2 pt-2 text-[14px] text-[#333]">
            <input
              type="checkbox"
              checked={unspecifiedColor}
              onChange={() => setUnspecifiedColor((v) => !v)}
              className="h-4 w-4 accent-saro-green"
            />
            Unspecified
          </label>
          <div className="flex flex-wrap gap-2 pt-2">
            {COLOR_SWATCHES.map((s) => {
              const active = selectedColors.includes(s.name);
              return (
                <button
                  key={s.name}
                  type="button"
                  aria-label={s.name}
                  onClick={() => toggleColor(s.name)}
                  className={`h-7 w-7 rounded-full border-2 transition-transform duration-300 hover:scale-110 ${
                    active ? "border-saro-green" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: s.color }}
                />
              );
            })}
          </div>
        </AccordionSection>

        <AccordionSection
          title="Sort by"
          isOpen={section === "sort"}
          onToggle={() => toggleSection("sort")}
        >
          <div className="flex flex-col gap-2 pt-2">
            {SORT_OPTIONS.map((o) => (
              <label
                key={o.value}
                className="flex cursor-pointer items-center gap-2 text-[14px] text-[#333]"
              >
                <input
                  type="radio"
                  name="mobile-sort"
                  value={o.value}
                  checked={sortBy === o.value}
                  onChange={() => onSortChange(o.value)}
                  className="accent-saro-green"
                />
                {o.label}
              </label>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection
          title={`Products per page: ${perPage}`}
          isOpen={section === "perPage"}
          onToggle={() => toggleSection("perPage")}
        >
          <div className="flex gap-2 pt-2">
            {PER_PAGE_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onPerPageChange(n)}
                className={`rounded border px-3 py-1 text-[13px] transition-colors duration-300 ${
                  perPage === n
                    ? "border-saro-green bg-saro-green text-white"
                    : "border-gray-300 text-[#666] hover:border-saro-green"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </AccordionSection>
      </div>
    </div>
  );
}

function AccordionSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mobile-filter-section border-b border-gray-200">
      <button
        type="button"
        onClick={onToggle}
        className="mobile-filter-header flex w-full items-center justify-between py-3 text-left text-[14px] font-medium text-saro-dark"
      >
        <span>{title}</span>
        <span
          className="mobile-filter-arrow inline-block text-[10px] transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▼
        </span>
      </button>
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-3">{children}</div>
      </div>
    </div>
  );
}
