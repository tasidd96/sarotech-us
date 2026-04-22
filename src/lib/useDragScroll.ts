"use client";

import { useRef, useState, useCallback } from "react";

/**
 * Hook that adds mouse-drag-to-scroll to a horizontal scroller. Returns the
 * props to spread onto the scroller element and a boolean for `isDragging`
 * so the parent can toggle cursor styling.
 *
 * Touch devices already get native momentum scrolling, so the handlers are
 * gated to pointerType === "mouse".
 */
export function useDragScroll<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; scrollLeft: number } | null>(null);
  const dragMoved = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent<T>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    dragStart.current = { x: e.clientX, scrollLeft: el.scrollLeft };
    dragMoved.current = 0;
    setIsDragging(true);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<T>) => {
    if (!dragStart.current) return;
    const el = ref.current;
    if (!el) return;
    const dx = e.clientX - dragStart.current.x;
    dragMoved.current = Math.max(dragMoved.current, Math.abs(dx));
    el.scrollLeft = dragStart.current.scrollLeft - dx;
  }, []);

  const endDrag = useCallback(() => {
    if (!dragStart.current) return;
    dragStart.current = null;
    setIsDragging(false);
  }, []);

  const onClickCapture = useCallback((e: React.MouseEvent<T>) => {
    if (dragMoved.current > 5) {
      e.preventDefault();
      e.stopPropagation();
      dragMoved.current = 0;
    }
  }, []);

  const dragProps = {
    ref,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerLeave: endDrag,
    onPointerCancel: endDrag,
    onClickCapture,
    style: { touchAction: "pan-y" as const },
  };

  const dragClassName = isDragging ? "cursor-grabbing select-none" : "cursor-grab select-none";

  return { ref, isDragging, dragProps, dragClassName };
}
