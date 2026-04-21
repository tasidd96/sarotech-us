import { ProductCategory } from "@/lib/types";

const tabs: { id: ProductCategory; label: string }[] = [
  { id: "interior", label: "Interior" },
  { id: "exterior", label: "Exterior" },
  { id: "accessories", label: "Accessories" },
];

interface ProductTabsProps {
  activeTab: ProductCategory;
  onTabChange: (tab: ProductCategory) => void;
}

export default function ProductTabs({
  activeTab,
  onTabChange,
}: ProductTabsProps) {
  return (
    <div className="flex gap-1 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "border-b-2 border-saro-green text-saro-green"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
