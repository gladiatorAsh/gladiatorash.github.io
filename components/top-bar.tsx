"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { navItems, profile } from "@/lib/portfolio";
import { openPalette, readingMode, setReadingMode, type ReadingMode } from "@/lib/client-events";
import { ThemeToggle } from "@/components/theme-toggle";

const chapters = navItems.map((item) => ({ id: item.href.slice(1), label: item.label }));

/** Which chapter crosses the upper third of the viewport. */
function useChapter() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = chapters.findIndex((c) => c.id === entry.target.id);
          if (i >= 0) setIndex(i);
        }
      },
      { rootMargin: "-30% 0px -65% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return index;
}

export function ReadingToggle({ size = "full" }: { size?: "full" | "compact" }) {
  const [mode, setMode] = useState<ReadingMode>("plain");

  useEffect(() => {
    setMode(readingMode());
    const onChange = (event: Event) => setMode((event as CustomEvent<ReadingMode>).detail);
    window.addEventListener("portfolio:reading", onChange);
    return () => window.removeEventListener("portfolio:reading", onChange);
  }, []);

  const options: { value: ReadingMode; label: string; short: string; key: string }[] = [
    { value: "plain", label: "Plain English", short: "Plain", key: "1" },
    { value: "technical", label: "Technical", short: "Tech", key: "2" }
  ];

  return (
    <div role="group" aria-label="Reading mode" className="flex">
      {options.map((option, i) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={mode === option.value}
          onClick={() => setReadingMode(option.value)}
          className={`key-btn ${i ? "-ml-px" : ""} ${size === "compact" ? "!min-h-9 !gap-2 !px-2 text-[0.8rem]" : ""}`}
        >
          <span>{size === "compact" ? option.short : option.label}</span>
          <span className="key" aria-hidden="true">{option.key}</span>
        </button>
      ))}
    </div>
  );
}

/** Global keys: 1 and 2 switch reading mode (ignored while typing). */
function useReadingKeys() {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      if (document.querySelector("dialog[open]")) return;
      if (event.key === "1") setReadingMode("plain");
      if (event.key === "2") setReadingMode("technical");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

export function TopBar() {
  const index = useChapter();
  useReadingKeys();
  const chapter = chapters[index];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-rule bg-paper/92 backdrop-blur-md">
      <div className="scroll-progress absolute inset-x-0 bottom-[-1px] h-px origin-left bg-ink" aria-hidden="true" />
      <div className="frame flex h-14 items-center gap-4">
        <a href="#home" className="shrink-0 text-[0.95rem] font-medium tracking-[-0.01em]">
          <span className="sm:hidden">A. Singh</span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>
        <p className="mono hidden min-w-0 flex-1 truncate text-graphite md:block" aria-live="polite">
          <span className="text-ink">{String(index + 1).padStart(2, "0")}</span>
          <span> / {String(chapters.length).padStart(2, "0")}</span>
          <span className="ml-3">{chapter.label}</span>
        </p>
        <span className="flex-1 md:hidden" />
        <ReadingToggle size="compact" />
        <button
          type="button"
          onClick={openPalette}
          aria-label="Search this site"
          title="Search (Ctrl K)"
          className="inline-flex h-9 w-9 items-center justify-center border border-transparent text-graphite hover:border-rule hover:text-ink"
        >
          <Search aria-hidden="true" className="h-4 w-4" />
        </button>
        <ThemeToggle className="!h-9 !w-9 !rounded-none" />
      </div>
    </header>
  );
}
