"use client";

import { useRef, useState, useCallback } from "react";

const DRAG_THRESHOLD_PX = 6;

/**
 * Hook that adds mouse-drag-to-scroll to a horizontal scroller. Returns the
 * props to spread onto the scroller element and a boolean for `isDragging`
 * so the parent can toggle cursor styling.
 *
 * Touch devices already get native momentum scrolling, so the handlers are
 * gated to pointerType === "mouse". The scroller element also needs
 * `onDragStart={e => e.preventDefault()}` — we spread that here — so the
 * browser does not kick in native image-drag when the user grabs an <img>.
 */
export function useDragScroll<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragActive = useRef(false);
  const dragStart = useRef<{ x: number; scrollLeft: number; pointerId: number } | null>(null);
  const dragMoved = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent<T>) => {
    if (e.pointerType !== "mouse") return;
    // Ignore right-click and middle-click.
    if (e.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    dragStart.current = { x: e.clientX, scrollLeft: el.scrollLeft, pointerId: e.pointerId };
    dragMoved.current = 0;
    dragActive.current = true;
    // Keep receiving pointermove even if pointer leaves the container.
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      // Some elements reject capture (e.g. the pointer is already captured).
    }
    setIsDragging(true);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<T>) => {
    if (!dragActive.current || !dragStart.current) return;
    const el = ref.current;
    if (!el) return;
    const dx = e.clientX - dragStart.current.x;
    dragMoved.current = Math.max(dragMoved.current, Math.abs(dx));
    // preventDefault stops the browser starting a native text selection /
    // image-drag gesture mid-motion.
    if (dragMoved.current > 2) e.preventDefault();
    el.scrollLeft = dragStart.current.scrollLeft - dx;
  }, []);

  const endDrag = useCallback((e?: React.PointerEvent<T>) => {
    if (!dragActive.current) return;
    dragActive.current = false;
    dragStart.current = null;
    if (e && ref.current) {
      try {
        ref.current.releasePointerCapture(e.pointerId);
      } catch {
        // no-op
      }
    }
    setIsDragging(false);
  }, []);

  // Suppress click on any descendant after a real drag happened. Without this
  // the pointerup at the end of a drag still fires clicks on product tiles.
  const onClickCapture = useCallback((e: React.MouseEvent<T>) => {
    if (dragMoved.current > DRAG_THRESHOLD_PX) {
      e.preventDefault();
      e.stopPropagation();
      // Reset so subsequent genuine clicks still register.
      dragMoved.current = 0;
    }
  }, []);

  // Prevent the browser's native drag-image gesture when the user grabs any
  // <img> or <a> inside the scroller.
  const onDragStart = useCallback((e: React.DragEvent<T>) => {
    e.preventDefault();
  }, []);

  const dragProps = {
    ref,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onDragStart,
    onClickCapture,
    style: { touchAction: "pan-y" as const },
  };

  const dragClassName = isDragging ? "cursor-grabbing select-none" : "cursor-grab";

  return { ref, isDragging, dragProps, dragClassName };
}
