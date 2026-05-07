import { Inventory } from "@/lib/types";

type Size = "sm" | "md";

interface Props {
  inventory: Inventory;
  size?: Size;
  /**
   * Optional discount % (e.g. 29 for "29% OFF"). Surfaces inside the pill
   * when set — prices themselves are intentionally hidden from public
   * traffic; the % is the sole pricing signal we expose. Plan is to
   * expose actual $ figures behind a rewards-program login later.
   */
  discountPercent?: number;
}

export default function StockPill({
  inventory,
  size = "sm",
  discountPercent,
}: Props) {
  const { available, inStock, allowOutOfStock } = inventory;
  const padding = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";
  const text = size === "sm" ? "text-[11px]" : "text-[13px]";
  const base = `inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-[0.5px] ${padding} ${text}`;

  // Build the label without ever leaking the actual on-hand count.
  // Exact stock numbers ship later behind the rewards-program paywall.
  const baseLabel =
    available > 0
      ? "In Stock"
      : allowOutOfStock || inStock
      ? "Backorder"
      : "Out of Stock";

  const colorClasses =
    available > 0
      ? "bg-saro-green text-white"
      : allowOutOfStock || inStock
      ? "bg-amber-500 text-white"
      : "bg-gray-500 text-white";

  const showDiscount =
    typeof discountPercent === "number" && discountPercent > 0;

  return (
    <span className={`${base} ${colorClasses}`}>
      <Dot className="bg-white" />
      <span>{baseLabel}</span>
      {showDiscount && (
        <>
          <span aria-hidden className="opacity-60">
            ·
          </span>
          <span>{discountPercent}% Off</span>
        </>
      )}
    </span>
  );
}

function Dot({ className }: { className: string }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${className}`} />;
}
