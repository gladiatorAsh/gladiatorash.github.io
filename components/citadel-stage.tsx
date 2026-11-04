"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Map as MapIcon, X } from "lucide-react";
import { Citadel } from "@/components/citadel";

/*
 * Where the citadel lives.
 *
 * Small screens: pinned under the header, as before.
 * Large screens: a full-width band at the top of the page. Once half of it has scrolled away the
 * same 3D scene glides into a mini-map in the bottom-right corner and keeps following the chapter
 * being read. The engine resizes itself from its container, so this only moves a box around.
 */

const LG = "(min-width: 1024px)";
const EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";
const DURATION = 450;

type Rect = { left: number; top: number; width: number; height: number };

function dockRect(): Rect {
  const width = Math.round(Math.min(400, Math.max(260, window.innerWidth * 0.21)));
  const height = Math.round(width * 0.72);
  return { left: window.innerWidth - width - 24, top: window.innerHeight - height - 24, width, height };
}

function readHidden() {
  try {
    return window.localStorage.getItem("citadel:dock") === "hidden";
  } catch {
    return false;
  }
}

export function CitadelStage() {
  const slot = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [docked, setDocked] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const s = slot.current;
    const f = frame.current;
    if (!s || !f) return;
    const mq = window.matchMedia(LG);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let isDocked = false;
    let timer = 0;
    let raf = 0;

    setHidden(readHidden());

    const apply = (r: Rect) => {
      f.style.left = `${r.left}px`;
      f.style.top = `${r.top}px`;
      f.style.width = `${r.width}px`;
      f.style.height = `${r.height}px`;
    };
    const clear = () => {
      f.style.cssText = "";
    };

    const place = (toDock: boolean, animate: boolean) => {
      window.clearTimeout(timer);
      if (!mq.matches) {
        clear();
        return;
      }
      const motion = animate && !reduce;
      if (toDock) {
        // From wherever it is on screen now, to the corner.
        const from = f.getBoundingClientRect();
        f.style.transition = "none";
        f.style.position = "fixed";
        apply(from);
        void f.offsetWidth;
        if (motion) f.style.transition = ["left", "top", "width", "height"].map((p) => `${p} ${DURATION}ms ${EASE}`).join(", ");
        apply(dockRect());
      } else {
        if (!motion || f.style.position !== "fixed") {
          clear();
          return;
        }
        // Back to the hero band, then hand positioning back to the page flow.
        f.style.transition = ["left", "top", "width", "height"].map((p) => `${p} ${DURATION}ms ${EASE}`).join(", ");
        const to = s.getBoundingClientRect();
        apply({ left: to.left, top: to.top, width: to.width, height: to.height });
        timer = window.setTimeout(() => {
          if (!isDocked) clear();
        }, DURATION + 30);
      }
    };

    const check = () => {
      raf = 0;
      if (!mq.matches) {
        if (isDocked) {
          isDocked = false;
          setDocked(false);
        }
        clear();
        return;
      }
      const r = s.getBoundingClientRect();
      // Dock once half the band is gone; undock when most of it is back (a little hysteresis).
      const want = isDocked ? r.bottom < r.height * 0.6 + 56 : r.bottom < r.height * 0.5 + 56;
      if (want !== isDocked) {
        isDocked = want;
        setDocked(want);
        place(want, true);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    const onResize = () => {
      if (isDocked && mq.matches) place(true, false);
      else check();
    };

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    mq.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", onResize);
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.map = hidden ? "hidden" : "shown";
  }, [hidden]);

  const setHide = (value: boolean) => {
    setHidden(value);
    try {
      window.localStorage.setItem("citadel:dock", value ? "hidden" : "shown");
    } catch {
      /* not remembered */
    }
  };

  const showDock = docked && !hidden;

  return (
    <>
      <div
        ref={slot}
        className="citadel-slot sticky top-14 z-20 h-[38svh] border-b border-rule bg-paper lg:relative lg:top-auto lg:mt-14 lg:h-[calc(72svh-3.5rem)] lg:min-h-[26rem]"
      >
        <div
          ref={frame}
          data-docked={docked ? "true" : undefined}
          data-hidden={docked && hidden ? "true" : undefined}
          className="citadel-frame absolute inset-0 z-30 bg-paper"
        >
          <Citadel compact={docked} />
          {showDock ? (
            <div className="absolute right-0 top-0 flex">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Back to the full citadel"
                title="Back to the top"
                className="inline-flex h-8 w-8 items-center justify-center border-b border-l border-rule bg-paper text-graphite hover:text-ink"
              >
                <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setHide(true)}
                aria-label="Hide the map"
                title="Hide the map"
                className="inline-flex h-8 w-8 items-center justify-center border-b border-l border-rule bg-paper text-graphite hover:text-ink"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
      {docked && hidden ? (
        <button
          type="button"
          onClick={() => setHide(false)}
          className="key-btn fixed bottom-6 right-6 z-30 hidden bg-paper lg:inline-flex"
        >
          <MapIcon aria-hidden="true" className="h-4 w-4" />
          Show map
        </button>
      ) : null}
    </>
  );
}
