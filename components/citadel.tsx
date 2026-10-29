"use client";

import { useEffect, useRef, useState } from "react";
import { SystemMap } from "@/components/system-map";
import { renderAllSections } from "@/lib/client-events";

let currentKey = "home";

/** Watches every [data-scene] element and tells the citadel which one is being read. */
export function SceneDirector() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    const order = new Map(els.map((el, i) => [el, i]));
    const active = new Set<HTMLElement>();
    const publish = () => {
      // The deepest (latest in document order) element in the reading band wins:
      // a project article beats the chapter that contains it.
      let best: HTMLElement | null = null;
      for (const el of active) if (!best || (order.get(el) ?? 0) > (order.get(best) ?? 0)) best = el;
      const key = best?.dataset.scene ?? "home";
      if (key !== currentKey) {
        currentKey = key;
        window.dispatchEvent(new CustomEvent("citadel:scene", { detail: key }));
      }
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) active.add(el);
          else active.delete(el);
        }
        publish();
      },
      { rootMargin: "-38% 0px -58% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** The 3D citadel. Falls back to the flat system map when WebGL isn't available. */
export function Citadel() {
  const host = useRef<HTMLDivElement>(null);
  const labels = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"loading" | "3d" | "flat">("loading");

  useEffect(() => {
    if (!webglAvailable()) {
      setMode("flat");
      return;
    }
    let dispose: (() => void) | undefined;
    let cancelled = false;
    import("@/lib/citadel-engine")
      .then(({ mount }) => {
        if (cancelled || !host.current || !labels.current) return;
        dispose = mount(host.current, labels.current, {
          initialKey: currentKey,
          reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          onSelect: (anchor) => {
            renderAllSections();
            document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
        setMode("3d");
      })
      .catch(() => setMode("flat"));
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={host} className="absolute inset-0" />
      <div ref={labels} className="pointer-events-none absolute inset-0" aria-hidden="true" />
      {mode === "flat" ? (
        <div className="absolute inset-0 grid place-items-center p-6">
          <SystemMap />
        </div>
      ) : null}
      <p className="mono pointer-events-none absolute bottom-3 left-4 m-0 text-graphite">
        {mode === "3d" ? (
          <>
            <span className="hidden lg:inline">The citadel: each building is a part of this page. Click one to go there.</span>
            <span className="lg:hidden">Tap a building to jump to it</span>
          </>
        ) : mode === "loading" ? (
          "Raising the citadel…"
        ) : null}
      </p>
    </div>
  );
}
