import { Inventory } from "@/lib/types";

type Size = "sm" | "md";

interface Props {
  inventory: Inventory;
  size?: Size;
}

export default function StockPill({ inventory, size = "sm" }: Props) {
  const { available, inStock, allowOutOfStock } = inventory;
  const padding = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";
  const text = size === "sm" ? "text-[11px]" : "text-[13px]";
  const base = `inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-[0.5px] ${padding} ${text}`;

  if (available > 0) {
    return (
      <span className={`${base} bg-saro-green text-white`}>
        <Dot className="bg-white" />
        In Stock · {available}
      </span>
    );
  }

  if (allowOutOfStock || inStock) {
    return (
      <span className={`${base} bg-amber-500 text-white`}>
        <Dot className="bg-white" />
        Backorder
      </span>
    );
  }

  return (
    <span className={`${base} bg-gray-500 text-white`}>
      <Dot className="bg-white" />
      Out of Stock
    </span>
  );
}

function Dot({ className }: { className: string }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${className}`} />;
}
