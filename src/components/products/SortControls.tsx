"use client";

import { useState, useRef, useEffect } from "react";

interface SortControlsProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  perPage: number;
  onPerPageChange: (n: number) => void;
  filtersVisible: boolean;
  onToggleFilters: () => void;
}

const sortOptions = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "newest", label: "Newest" },
];
const perPageOptions = [12, 24, 48];

function Chevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function FiltersIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M3 6h18M9 12h6M11 18h2" />
    </svg>
  );
}

type DropdownProps = {
  label: React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  disabled?: boolean;
  className?: string;
};

function Dropdown({ label, children, disabled, className = "" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`sort-dropdown-btn flex items-center gap-2 py-2 text-[14px] transition-colors ${
          disabled
            ? "cursor-not-allowed text-gray-300"
            : "text-gray-600 hover:text-saro-dark"
        }`}
      >
        <span>{label}</span>
        <Chevron />
      </button>
      <div
        className={`sort-dropdown-menu ${open && !disabled ? "open" : ""} absolute right-0 top-full z-[500] mt-2 min-w-[180px] rounded-[5px] bg-white py-1`}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
      >
        {children(() => setOpen(false))}
      </div>
    </div>
  );
}

export default function SortControls({
  sortBy,
  onSortChange,
  perPage,
  onPerPageChange,
  filtersVisible,
  onToggleFilters,
}: SortControlsProps) {
  const currentSortLabel =
    sortOptions.find((o) => o.value === sortBy)?.label ?? "Sort by";

  return (
    <div className="view-controls flex items-center justify-end gap-8">
      <button
        type="button"
        onClick={onToggleFilters}
        className="toggle-filters flex items-center gap-2 text-[14px] text-gray-600 transition-colors hover:text-saro-dark"
      >
        <span>{filtersVisible ? "Hide Filters" : "Show Filters"}</span>
        <FiltersIcon />
      </button>

      <Dropdown label={`Sort by: ${currentSortLabel}`}>
        {(close) => (
          <>
            {sortOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onSortChange(o.value);
                  close();
                }}
                className={`sort-dropdown-item block w-full px-4 py-2 text-left text-[14px] transition-colors hover:bg-gray-50 ${
                  sortBy === o.value ? "text-saro-green" : "text-gray-700"
                }`}
              >
                {o.label}
              </button>
            ))}
          </>
        )}
      </Dropdown>

      <Dropdown label={`Products per page: ${perPage}`}>
        {(close) => (
          <>
            {perPageOptions.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  onPerPageChange(n);
                  close();
                }}
                className={`sort-dropdown-item block w-full px-4 py-2 text-left text-[14px] transition-colors hover:bg-gray-50 ${
                  perPage === n ? "text-saro-green" : "text-gray-700"
                }`}
              >
                {n}
              </button>
            ))}
          </>
        )}
      </Dropdown>
    </div>
  );
}
