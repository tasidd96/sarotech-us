import { discountPercent, formatUSD } from "@/lib/price";

type Size = "sm" | "lg";

interface Props {
  price?: number;
  listPrice?: number;
  size?: Size;
  align?: "left" | "right" | "center";
}

/**
 * Renders a sell price, optionally with a struck-through list price and
 * a "% off" badge when listPrice > price. Returns null when no price is
 * known so the layout collapses cleanly during HL's "no price record yet"
 * grace period.
 */
export default function PriceBlock({
  price,
  listPrice,
  size = "sm",
  align = "left",
}: Props) {
  if (typeof price !== "number") return null;
  const off = discountPercent(price, listPrice);

  const sellSize = size === "lg" ? "text-[22px]" : "text-[15px]";
  const listSize = size === "lg" ? "text-[14px]" : "text-[12px]";
  const badgeSize = size === "lg" ? "text-[12px] px-2 py-0.5" : "text-[10px] px-1.5 py-0.5";
  const justify =
    align === "right"
      ? "justify-end"
      : align === "center"
      ? "justify-center"
      : "justify-start";

  return (
    <div className={`flex flex-wrap items-baseline gap-2 ${justify}`}>
      <span className={`font-semibold text-saro-dark ${sellSize}`}>
        {formatUSD(price)}
      </span>
      {typeof listPrice === "number" && off !== undefined && (
        <>
          <span className={`text-gray-500 line-through ${listSize}`}>
            {formatUSD(listPrice)}
          </span>
          <span
            className={`rounded-full bg-saro-green font-semibold uppercase tracking-[0.5px] text-white ${badgeSize}`}
          >
            {off}% off
          </span>
        </>
      )}
    </div>
  );
}
