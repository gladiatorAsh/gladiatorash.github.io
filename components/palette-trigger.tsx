"use client";

import { useEffect, useState } from "react";
import { Command as CommandIcon, Search } from "lucide-react";
import { openPalette } from "@/lib/client-events";

/** Visible trigger so the palette is discoverable without knowing the shortcut. */
export function PaletteTrigger({ compact = false }: { compact?: boolean }) {
  const [mac, setMac] = useState(true);
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);

  if (compact) {
    return (
      <button
        type="button"
        onClick={openPalette}
        aria-label="Open command palette"
        className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-300 hover:bg-white/5 hover:text-white"
      >
        <Search aria-hidden="true" className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openPalette}
      className="focus-ring flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-400 transition hover:border-azure/40 hover:text-white"
    >
      <Search aria-hidden="true" className="h-4 w-4" />
      <span className="flex-1 text-left">Quick jump…</span>
      <kbd className="flex items-center gap-0.5 rounded border border-white/10 px-1.5 py-0.5 font-mono text-[11px]">
        {mac ? <CommandIcon aria-hidden="true" className="h-3 w-3" /> : "Ctrl"}
        <span>K</span>
      </kbd>
    </button>
  );
}
