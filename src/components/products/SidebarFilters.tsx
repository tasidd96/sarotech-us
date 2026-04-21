import { ProductType } from "@/lib/types";
import { productTypeLabels } from "@/data/products";

interface SidebarFiltersProps {
  selectedTypes: ProductType[];
  onTypeToggle: (type: ProductType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const allTypes: ProductType[] = [
  "floor-decking",
  "wall-panels",
  "wide-wall-panels",
  "synthetic-marble",
  "coextruded-panels",
  "deck-accessories",
  "clips",
  "corner-pieces",
];

export default function SidebarFilters({
  selectedTypes,
  onTypeToggle,
  searchQuery,
  onSearchChange,
}: SidebarFiltersProps) {
  return (
    <aside className="space-y-6">
      {/* Search */}
      <div>
        <label className="mb-2 block text-sm font-semibold">Search</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-saro-green focus:outline-none focus:ring-1 focus:ring-saro-green"
        />
      </div>

      {/* Product Type */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Product Type</h3>
        <div className="space-y-2">
          {allTypes.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => onTypeToggle(type)}
                className="h-4 w-4 rounded border-gray-300 text-saro-green focus:ring-saro-green"
              />
              {productTypeLabels[type]}
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "#8B6914",
            "#A0522D",
            "#D2B48C",
            "#1A1A1A",
            "#808080",
            "#E8E8E8",
            "#5C4033",
            "#C4A35A",
          ].map((color) => (
            <button
              key={color}
              className="h-7 w-7 rounded-full border border-gray-300 transition-transform hover:scale-110"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
