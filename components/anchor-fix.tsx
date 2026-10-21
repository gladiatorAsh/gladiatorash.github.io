"use client";

import { useEffect } from "react";
import { renderAllSections } from "@/lib/client-events";

/** Before any in-page link jump, render all sections so the browser scrolls to the true position. */
export function AnchorFix() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (link) renderAllSections();
    };
    // Capture phase: runs before the browser performs the default hash navigation.
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", renderAllSections);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", renderAllSections);
    };
  }, []);
  return null;
}
