"use client";

import { ProductCategory } from "@/lib/types";

interface Props {
  activeCategory: ProductCategory | null;
  onCategoryChange: (c: ProductCategory | null) => void;
  className?: string;
}

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: "interior", label: "Interior" },
  { id: "exterior", label: "Exterior" },
  { id: "accessories", label: "Accessories" },
];

export default function CategoryTabs({
  activeCategory,
  onCategoryChange,
  className = "",
}: Props) {
  return (
    <div
      className={`category-buttons flex h-[35px] items-center gap-[10px] ${className}`}
    >
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryChange(cat.id)}
            className={`category-btn ${isActive ? "active" : ""} h-[35px] px-4 py-2 text-center text-[14px] transition-[color,border-color] duration-300 ${
              isActive ? "text-black" : "text-[#666] hover:text-black"
            }`}
            style={{
              borderBottom: `2px solid ${isActive ? "#000" : "transparent"}`,
            }}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
