"use client";

import { useEffect, useRef, useState } from "react";
import { navItems } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

/** Tracks which section crosses the middle band of the viewport. */
function useActiveSection() {
  const [active, setActive] = useState(navItems[0].href.slice(1));

  useEffect(() => {
    const ids = navItems.map((item) => item.href.slice(1));
    // Include sections not in the nav (e.g. certifications) so the highlight doesn't stick on the wrong item.
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (ids.includes(id)) setActive(id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}

export function SidebarNav() {
  const active = useActiveSection();
  return (
    <nav className="mt-14 space-y-1" aria-label="Primary navigation">
      {navItems.map((item) => {
        const isActive = active === item.href.slice(1);
        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "focus-ring group flex items-center gap-4 rounded-md py-2.5 text-sm transition",
              isActive ? "text-white" : "text-slate-400 hover:text-white"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-px transition-all duration-300",
                isActive ? "w-16 bg-azure-light" : "w-8 bg-slate-700 group-hover:w-14 group-hover:bg-azure-light"
              )}
            />
            <span className={cn("transition", isActive && "font-semibold tracking-wide")}>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

export function MobileNav() {
  const active = useActiveSection();

  const navRef = useRef<HTMLElement>(null);

  // Keep the active pill visible in the horizontally scrolling bar. Scrolls only the bar itself
  // (never the page), skips the initial render and does nothing while the bar is hidden (desktop),
  // so it never forces a layout during page load.
  useEffect(() => {
    const bar = navRef.current;
    if (!bar || bar.offsetParent === null) return;
    const pill = bar.querySelector<HTMLElement>(`[data-mobile-nav="${active}"]`);
    if (!pill) return;
    bar.scrollTo({ left: pill.offsetLeft - bar.clientWidth / 2 + pill.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  return (
    <nav ref={navRef} aria-label="Section navigation" className="-mb-px flex gap-1 overflow-x-auto px-2 pb-1 [scrollbar-width:none]">
      {navItems.slice(1).map((item) => {
        const id = item.href.slice(1);
        const isActive = active === id;
        return (
          <a
            key={item.href}
            href={item.href}
            data-mobile-nav={id}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "shrink-0 rounded-md border-b-2 px-3 py-2.5 text-sm transition",
              isActive ? "border-azure-light text-white" : "border-transparent text-slate-300 hover:text-white"
            )}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
