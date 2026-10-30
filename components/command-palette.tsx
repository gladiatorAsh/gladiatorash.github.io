"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Copy,
  CornerDownLeft,
  Download,
  Github,
  Hash,
  Linkedin,
  Mail,
  Search,
  SunMoon
} from "lucide-react";
import { navItems, profile } from "@/lib/portfolio";
import { copyText, OPEN_PALETTE, paletteState, renderAllSections, setReadingMode, toast, toggleTheme } from "@/lib/client-events";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  label: string;
  group: "Navigate" | "Actions" | "Links";
  icon: typeof Search;
  keywords?: string;
  run: () => void;
};

function go(href: string) {
  renderAllSections();
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", href);
}

/** ⌘K / Ctrl+K palette built on the native <dialog> element (focus trap, Esc, top layer for free). */
export default function CommandPalette() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  const items = useMemo<Item[]>(
    () => [
      ...navItems.map((item) => ({
        id: `nav-${item.href}`,
        label: item.label,
        group: "Navigate" as const,
        icon: Hash,
        keywords: "section go jump",
        run: () => go(item.href)
      })),
      { id: "nav-certifications", label: "Certifications", group: "Navigate", icon: Hash, keywords: "skills education", run: () => go("#skills") },
      { id: "read-plain", label: "Read in plain English", group: "Actions", icon: BookOpen, keywords: "mode simple eli5 1", run: () => setReadingMode("plain") },
      { id: "read-technical", label: "Read the technical version", group: "Actions", icon: BookOpen, keywords: "mode architecture stack 2", run: () => setReadingMode("technical") },
      {
        id: "copy-email",
        label: "Copy email address",
        group: "Actions",
        icon: Copy,
        keywords: profile.email + " contact",
        run: async () => {
          if (await copyText(profile.email)) toast("Email copied to clipboard");
        }
      },
      {
        id: "resume",
        label: "Download resume (PDF)",
        group: "Actions",
        icon: Download,
        keywords: "cv",
        run: () => {
          const a = document.createElement("a");
          a.href = "/assets/files/Resume.pdf";
          a.download = "Ashutosh-Singh-Resume.pdf";
          a.click();
        }
      },
      { id: "theme", label: "Toggle light / dark theme", group: "Actions", icon: SunMoon, keywords: "mode appearance", run: toggleTheme },
      { id: "email", label: "Send an email", group: "Links", icon: Mail, keywords: "mailto contact", run: () => (window.location.href = `mailto:${profile.email}`) },
      { id: "papers", label: "Paper Desk: today's AI papers", group: "Links", icon: BookOpen, keywords: "research arxiv reading", run: () => (window.location.href = "/papers/") },
      { id: "mcp", label: "MCP learning path", group: "Links", icon: BookOpen, keywords: "model context protocol course study learn", run: () => (window.location.href = "/learn/mcp/") },
      { id: "deals", label: "Deals Galore dashboard", group: "Links", icon: Github, keywords: "shopping agent deals", run: () => window.open("https://www.ashutoshysingh.com/deals-galore/", "_blank", "noopener") },
      { id: "github", label: "Open GitHub", group: "Links", icon: Github, keywords: "code repos", run: () => window.open(profile.github, "_blank", "noopener") },
      { id: "linkedin", label: "Open LinkedIn", group: "Links", icon: Linkedin, keywords: "profile", run: () => window.open(profile.linkedin, "_blank", "noopener") },
      // Private study repo: only reachable from the palette, never shown on the page.
      { id: "notes", label: "My notes", group: "Links", icon: BookOpen, keywords: "notes study prep core foundry", run: () => window.open("https://github.com/gladiatorAsh/core-foundry", "_blank", "noopener") }
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => `${item.label} ${item.group} ${item.keywords ?? ""}`.toLowerCase().includes(q));
  }, [items, query]);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setQuery("");
    setIndex(0);
    dialog.showModal();
    inputRef.current?.focus();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE, open);
    paletteState.mounted = true;
    if (paletteState.wanted) {
      paletteState.wanted = false;
      open();
    }
    return () => {
      paletteState.mounted = false;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE, open);
    };
  }, [open, close]);

  function run(item: Item | undefined) {
    if (!item) return;
    close();
    item.run();
  }

  function onInputKey(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIndex((i) => (i + 1) % Math.max(filtered.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIndex((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(filtered[index]);
    }
  }

  useEffect(() => {
    if (!dialogRef.current?.open) return; // never force layout while closed (e.g. on page load)
    document.getElementById(`palette-${filtered[index]?.id}`)?.scrollIntoView({ block: "nearest" });
  }, [index, filtered]);

  let lastGroup = "";
  return (
    <dialog
      ref={dialogRef}
      aria-label="Command palette"
      className="palette m-auto mt-[14vh] w-[min(36rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-white/10 bg-card p-0 text-slate-300 shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-4">
        <Search aria-hidden="true" className="h-4 w-4 text-slate-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIndex(0);
          }}
          onKeyDown={onInputKey}
          placeholder="Jump to a section or run an action…"
          className="h-14 flex-1 bg-transparent text-base text-white outline-none placeholder:text-slate-400"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={filtered[index] ? `palette-${filtered[index].id}` : undefined}
          aria-autocomplete="list"
        />
        <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[11px] text-slate-400">Esc</kbd>
      </div>
      <ul id="palette-list" role="listbox" aria-label="Commands" className="max-h-[50vh] overflow-y-auto p-2">
        {filtered.length === 0 ? <li className="px-3 py-6 text-center text-sm text-slate-400">No matches</li> : null}
        {filtered.map((item, i) => {
          const Icon = item.icon;
          const header = item.group !== lastGroup ? item.group : null;
          lastGroup = item.group;
          return (
            <li key={item.id} role="presentation">
              {header ? (
                <p role="presentation" className="px-3 pb-1 pt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  {header}
                </p>
              ) : null}
              <div
                id={`palette-${item.id}`}
                role="option"
                aria-selected={i === index}
                onMouseMove={() => setIndex(i)}
                onClick={() => run(item)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                  i === index ? "bg-azure/15 text-white" : "text-slate-300"
                )}
              >
                <Icon aria-hidden="true" className={cn("h-4 w-4", i === index ? "text-azure-light" : "text-slate-400")} />
                <span className="flex-1">{item.label}</span>
                {i === index ? <CornerDownLeft aria-hidden="true" className="h-3.5 w-3.5 text-slate-400" /> : null}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 font-mono text-[11px] text-slate-400">
        <span>↑↓ navigate · ↵ select</span>
        <span className="flex items-center gap-1">
          <ArrowRight aria-hidden="true" className="h-3 w-3" /> ashutoshysingh.com
        </span>
      </div>
    </dialog>
  );
}

