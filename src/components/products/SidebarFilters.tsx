"use client";

import { useState } from "react";
import { ProductType } from "@/lib/types";
import { productTypeLabels } from "@/data/products";

interface SidebarFiltersProps {
  availableTypes: ProductType[];
  selectedTypes: ProductType[];
  onTypeToggle: (type: ProductType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const INITIAL_VISIBLE_TYPES = 8;

const colorSwatches = [
  { name: "Natural Walnut", color: "#6f4a2d" },
  { name: "Oak", color: "#e4d5b7" },
  { name: "Tropical Hardwood", color: "#8a6a55" },
  { name: "White Oak", color: "#eae0cd" },
  { name: "Hardwood Black", color: "#3a2a22" },
  { name: "Pine Black", color: "#1f1a17" },
  { name: "Gray Matte", color: "#8a8a8a" },
  { name: "Striped Walnut", color: "#4a2e20" },
];

export default function SidebarFilters({
  availableTypes,
  selectedTypes,
  onTypeToggle,
  searchQuery,
  onSearchChange,
}: SidebarFiltersProps) {
  const [typesExpanded, setTypesExpanded] = useState(false);
  const [unspecifiedColor, setUnspecifiedColor] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const visibleTypes = typesExpanded
    ? availableTypes
    : availableTypes.slice(0, INITIAL_VISIBLE_TYPES);

  const toggleColor = (name: string) =>
    setSelectedColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );

  return (
    <aside className="filters-column flex flex-col gap-5">
      {/* Product Type */}
      <div className="product-types">
        <h3 className="mb-[15px] text-[16px] font-semibold text-[#2c3e50]">
          Product Type
        </h3>
        <div className="product-type-list flex flex-col gap-3">
          {visibleTypes.map((type) => (
            <label
              key={type}
              className="product-type-item flex cursor-pointer items-center gap-2 text-[14px] text-gray-700 hover:text-saro-dark"
            >
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => onTypeToggle(type)}
                className="h-4 w-4 rounded border-gray-300 accent-saro-green focus:ring-saro-green"
              />
              <span>{productTypeLabels[type]}</span>
            </label>
          ))}
          {availableTypes.length > INITIAL_VISIBLE_TYPES && (
            <button
              type="button"
              onClick={() => setTypesExpanded((v) => !v)}
              className="show-more-btn mt-[10px] w-full py-2 text-left text-[14px] text-black hover:underline"
            >
              {typesExpanded ? "− Less" : "+ More"}
            </button>
          )}
        </div>
      </div>

      {/* Colors */}
      <div className="color-filters mt-[30px]">
        <h3 className="mb-[15px] text-[16px] font-semibold uppercase tracking-[0.5px] text-[#2c3e50]">
          Colors
        </h3>
        <label className="flex cursor-pointer items-center gap-2 pb-3 text-[14px] text-gray-700">
          <input
            type="checkbox"
            checked={unspecifiedColor}
            onChange={() => setUnspecifiedColor((v) => !v)}
            className="h-4 w-4 rounded border-gray-300 accent-saro-green focus:ring-saro-green"
          />
          <span>Unspecified</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {colorSwatches.map((s) => {
            const isActive = selectedColors.includes(s.name);
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => toggleColor(s.name)}
                title={s.name}
                aria-label={s.name}
                aria-pressed={isActive}
                className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                  isActive ? "border-saro-green shadow" : "border-gray-300"
                }`}
                style={{ backgroundColor: s.color }}
              />
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="search-filter mt-[30px]">
        <h3 className="mb-[15px] text-[16px] font-semibold uppercase tracking-[0.5px] text-[#2c3e50]">
          Search
        </h3>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="SKU, name..."
            className="w-full rounded border border-gray-300 px-3 py-2 pr-10 text-[14px] focus:border-saro-green focus:outline-none focus:ring-1 focus:ring-saro-green"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </aside>
  );
}
