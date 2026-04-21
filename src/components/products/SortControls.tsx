interface SortControlsProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  perPage: number;
  onPerPageChange: (n: number) => void;
  filtersVisible: boolean;
  onToggleFilters: () => void;
}

export default function SortControls({
  sortBy,
  onSortChange,
  perPage,
  onPerPageChange,
  filtersVisible,
  onToggleFilters,
}: SortControlsProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      <button
        onClick={onToggleFilters}
        className="text-sm text-saro-green hover:underline"
      >
        {filtersVisible ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="ml-auto flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          Sort by:
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-saro-green focus:outline-none"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="newest">Newest</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          Per page:
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-saro-green focus:outline-none"
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </label>
      </div>
    </div>
  );
}
