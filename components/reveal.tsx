import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal with zero JavaScript.
 * Uses CSS scroll-driven animations (see `.reveal` in globals.css). Browsers without
 * support, and users who prefer reduced motion, simply see the content immediately —
 * nothing ever starts hidden waiting on hydration, which keeps LCP fast.
 */
export function Reveal({ children, className }: PropsWithChildren<{ className?: string; delay?: number }>) {
  return <div className={cn("reveal", className)}>{children}</div>;
}
