"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { TOAST } from "@/lib/client-events";
import { cn } from "@/lib/utils";

/** Single polite live region; shows the latest message for ~2s. */
export function Toaster() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onToast = (event: Event) => {
      setMessage((event as CustomEvent<string>).detail);
      setVisible(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setVisible(false), 2200);
    };
    window.addEventListener(TOAST, onToast);
    return () => window.removeEventListener(TOAST, onToast);
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
      <div
        className={cn(
          "toast flex items-center gap-2 border border-ink bg-paper px-4 py-2 font-mono text-[0.72rem] text-ink transition duration-200",
          visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        )}
      >
        <Check aria-hidden="true" className="h-4 w-4 text-azure-light" />
        {message}
      </div>
    </div>
  );
}
