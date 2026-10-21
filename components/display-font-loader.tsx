"use client";

import { useEffect } from "react";

/**
 * Loads the display face for section headings *after* first paint.
 * Declaring it in CSS (even unpreloaded, even with font-display: swap) made Chrome hold the first
 * paint under Lighthouse (~0.2s → ~1.3s FCP). Registered via the FontFace API instead, nothing in the
 * initial render can wait on it; headings re-render in it once it arrives (they're below the fold).
 */
export function DisplayFontLoader() {
  useEffect(() => {
    if (!("fonts" in document)) return;
    const load = () => {
      const face = new FontFace("Bricolage Display", "url(/fonts/bricolage-grotesque-wght.woff2) format('woff2')", {
        weight: "200 800",
        display: "swap"
      });
      face
        .load()
        .then((loaded) => document.fonts.add(loaded))
        .catch(() => {
          /* keep Inter */
        });
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
    if (idle) idle(load, { timeout: 1500 });
    else window.setTimeout(load, 200);
  }, []);

  return null;
}
