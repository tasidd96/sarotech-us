"use client";

import { useDragScroll } from "@/lib/useDragScroll";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Client-only wrapper that turns any horizontal-scroll container into a
 * drag-to-scroll one. Use this around sections that do not need the full
 * HorizontalCarousel primitive (edge scrims + arrow buttons).
 */
export default function DragScrollRow({ children, className = "" }: Props) {
  const { dragProps, dragClassName } = useDragScroll<HTMLDivElement>();
  return (
    <div {...dragProps} className={`${className} ${dragClassName}`}>
      {children}
    </div>
  );
}
