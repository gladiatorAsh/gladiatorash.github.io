"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { paletteState, REQUEST_PALETTE } from "@/lib/client-events";

// The palette (list, filtering, icons) is not needed to render the page, so its code loads after the
// page is idle — or immediately on the first ⌘K / trigger click — keeping it out of hydration.
const CommandPalette = dynamic(() => import("@/components/command-palette"), { ssr: false });

export function DeferredPalette() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const request = () => {
      paletteState.wanted = true;
      setLoad(true);
    };
    const onKey = (event: KeyboardEvent) => {
      if (paletteState.mounted) return; // the palette handles its own shortcut once mounted
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        request();
      }
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const idleId = w.requestIdleCallback?.(() => setLoad(true), { timeout: 5000 });
    window.addEventListener("keydown", onKey);
    window.addEventListener(REQUEST_PALETTE, request);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(REQUEST_PALETTE, request);
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
    };
  }, []);

  return load ? <CommandPalette /> : null;
}
