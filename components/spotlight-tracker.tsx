"use client";

import { useEffect } from "react";

/**
 * One passive pointer listener drives both spotlights:
 *  - page-wide glow via --mx/--my on <html>
 *  - per-card glow via --x/--y on the `.spotlight` element under the cursor
 * Only enabled for fine pointers with hover (no work at all on touch devices).
 */
export function SpotlightTracker() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement;
    let frame = 0;
    let last: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      if (!last) return;
      root.style.setProperty("--mx", `${last.clientX}px`);
      root.style.setProperty("--my", `${last.clientY}px`);
      const card = (last.target as Element | null)?.closest?.<HTMLElement>(".spotlight");
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--x", `${last.clientX - rect.left}px`);
        card.style.setProperty("--y", `${last.clientY - rect.top}px`);
      }
    };

    const onMove = (event: PointerEvent) => {
      last = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    root.classList.add("has-pointer");
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      root.classList.remove("has-pointer");
    };
  }, []);

  return <div aria-hidden="true" className="page-spotlight" />;
}
