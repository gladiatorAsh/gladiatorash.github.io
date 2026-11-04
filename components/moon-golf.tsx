"use client";

import { useEffect, useRef, useState } from "react";
import { CLUBS, HOLES, createGolf, type Club, type Hud } from "@/lib/golf-engine";

type Game = ReturnType<typeof createGolf>;

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function readBest(key: string) {
  try {
    return Number(window.localStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(key: string, value: number) {
  try {
    if (value > readBest(key)) window.localStorage.setItem(key, String(value));
  } catch {
    /* storage unavailable: the best score just isn't kept */
  }
}

const card = "w-full max-w-md border border-[#ffffff]/15 bg-[#0b0e16]/92 p-6 text-[#e6e8ec] backdrop-blur-md";
const btn =
  "inline-flex min-h-10 items-center justify-center border border-[#ffffff]/25 px-4 text-[0.9rem] font-medium hover:border-[#ffffff]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#86a8f6]";
const btnPrimary = `${btn} !border-[#86a8f6] bg-[#86a8f6] text-[#05060b] hover:bg-[#a9c1fa]`;

export function MoonGolf() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [hud, setHud] = useState<Hud | null>(null);
  const [started, setStarted] = useState(false);
  const [seed, setSeed] = useState("");
  const [best, setBest] = useState({ today: 0, ever: 0 });

  useEffect(() => {
    const s = today();
    setSeed(s);
    setBest({ today: readBest(`moongolf:best:${s}`), ever: readBest("moongolf:best") });
    const canvas = canvasRef.current;
    if (!canvas) return;
    const game = createGolf(canvas, s, setHud);
    gameRef.current = game;
    return () => game.destroy();
  }, []);

  useEffect(() => {
    if (hud?.phase !== "done" || !seed) return;
    saveBest(`moongolf:best:${seed}`, hud.total);
    saveBest("moongolf:best", hud.total);
    setBest({ today: readBest(`moongolf:best:${seed}`), ever: readBest("moongolf:best") });
  }, [hud?.phase, hud?.total, seed]);

  const setClub = (c: Club) => gameRef.current?.setClub(c);
  const parTotal = hud?.results.reduce((s, r) => s + r.par, 0) ?? 0;
  const strokeTotal = hud?.results.reduce((s, r) => s + r.strokes, 0) ?? 0;

  return (
    <div className="relative h-full w-full select-none overflow-hidden bg-[#05060b] text-[#e6e8ec]">
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none"
        aria-label="Moon Golf. Drag back from anywhere and release to hit the ball. Keyboard: arrow keys aim, Space hits, 1 to 4 pick a club."
        role="img"
      />

      {/* Scoreline */}
      {hud ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-3 p-3 md:p-5">
          <dl className="mono m-0 flex gap-5 text-[0.78rem] text-[#ffffff]/70">
            <div>
              <dt>Hole</dt>
              <dd className="m-0 text-[1.05rem] text-[#ffffff]">
                {hud.hole}
                <span className="text-[#ffffff]/50">/{HOLES}</span>
              </dd>
            </div>
            <div>
              <dt>Par</dt>
              <dd className="m-0 text-[1.05rem] text-[#ffffff]">{hud.par}</dd>
            </div>
            <div>
              <dt>Strokes</dt>
              <dd className="m-0 text-[1.05rem] text-[#ffffff]">{hud.strokes}</dd>
            </div>
            <div>
              <dt>To pin</dt>
              <dd className="m-0 text-[1.05rem] text-[#ffffff]">{hud.toPin} m</dd>
            </div>
          </dl>
          <div className="mono text-right text-[0.78rem] text-[#ffffff]/70">
            Score
            <div className="text-[1.35rem] leading-tight text-[#ffffff]">{hud.total.toLocaleString()}</div>
          </div>
        </div>
      ) : null}

      {/* Clubs */}
      {hud && started ? (
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-0 p-3 md:p-5">
          {hud.phase === "flight" ? (
            <button type="button" className={btn} onClick={() => gameRef.current?.toggleFastForward()}>
              {hud.fastForward ? "Normal speed" : "Fast-forward ×4"}
              <span className="mono ml-2 text-[0.7rem] text-[#ffffff]/50">tap / F</span>
            </button>
          ) : (
            <div role="group" aria-label="Club" className="flex">
              {CLUBS.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={hud.club === c.id}
                  disabled={hud.phase !== "aim"}
                  onClick={() => setClub(c.id)}
                  className={`${btn} ${i ? "-ml-px" : ""} flex-col !items-start !gap-0 py-1.5 ${
                    hud.club === c.id ? "!border-[#86a8f6] bg-[#86a8f6]/15 text-[#ffffff]" : "bg-[#0b0e16]/70 text-[#ffffff]/75"
                  }`}
                >
                  <span>
                    {c.label} <span className="mono text-[0.65rem] text-[#ffffff]/45">{c.key}</span>
                  </span>
                  <span className="mono hidden text-[0.62rem] text-[#ffffff]/50 sm:block">{c.hint}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* Intro */}
      {!started ? (
        <div className="absolute inset-0 grid place-items-center bg-[#05060b]/55 p-4">
          <div className={card}>
            <p className="mono m-0 text-[0.75rem] text-[#ffffff]/55">Arcade · {seed}</p>
            <h2 className="m-0 mt-2 text-[1.9rem] font-[450] tracking-[-0.03em]">Moon Golf</h2>
            <p className="m-0 mt-2 text-[#ffffff]/70">Nine holes of one-sixth-gravity golf. The course is built from today&rsquo;s date, so everyone plays the same holes today.</p>
            <ul className="m-0 mt-5 list-none space-y-2.5 p-0 text-[0.92rem] leading-[1.5] text-[#ffffff]/80">
              <li>
                <b className="font-medium text-[#ffffff]">Drag back, let go.</b> Press anywhere, pull away from where you want the ball to go, release.
              </li>
              <li>
                <b className="font-medium text-[#ffffff]">No air.</b> Every shot is a clean parabola. The dots only show the start of it.
              </li>
              <li>
                <span className="text-[#cfc8b8]">Dust</span> soaks up the ball. <span className="text-[#9aa1ab]">Bare rock</span> bounces and rolls.
                The <span className="text-[#ffffff]">bright pad</span> around the flag is smooth.
              </li>
              <li>
                <b className="font-medium text-[#ffffff]">Pick a club.</b> Beat par for points. Tap mid-flight to fast-forward.
              </li>
            </ul>
            <p className="mono m-0 mt-5 text-[0.72rem] text-[#ffffff]/50">Keyboard: ← → aim · ↑ ↓ power · A flips · Space hits · 1–4 clubs</p>
            {best.today || best.ever ? (
              <p className="mono m-0 mt-2 text-[0.72rem] text-[#ffffff]/50">
                Your best today {best.today.toLocaleString()} · all-time {best.ever.toLocaleString()}
              </p>
            ) : null}
            <div className="mt-6 flex gap-3">
              <button type="button" className={btnPrimary} onClick={() => {
                  gameRef.current?.start();
                  setStarted(true);
                }}
                autoFocus>
                Play
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Hole done */}
      {started && hud?.phase === "holed" && hud.lastResult ? (
        <div className="absolute inset-0 grid place-items-center bg-[#05060b]/40 p-4">
          <div className={card} role="status">
            <p className="mono m-0 text-[0.75rem] text-[#ffffff]/55">
              Hole {hud.hole} · par {hud.lastResult.par}
            </p>
            <h2 className="m-0 mt-2 text-[1.9rem] font-[450] tracking-[-0.03em]">{hud.lastResult.name}</h2>
            <p className="m-0 mt-2 text-[#ffffff]/70">
              {hud.lastResult.strokes > 10 ? "Picked up after 10 strokes." : `${hud.lastResult.strokes} stroke${hud.lastResult.strokes === 1 ? "" : "s"}.`}{" "}
              <span className="text-[#86a8f6]">+{hud.lastResult.points}</span>
            </p>
            <button type="button" className={`${btnPrimary} mt-6`} onClick={() => gameRef.current?.nextHole()} autoFocus>
              Hole {hud.hole + 1}
            </button>
          </div>
        </div>
      ) : null}

      {/* Round done */}
      {started && hud?.phase === "done" ? (
        <div className="absolute inset-0 grid place-items-center overflow-y-auto bg-[#05060b]/60 p-4">
          <div className={card} role="status">
            <p className="mono m-0 text-[0.75rem] text-[#ffffff]/55">Round complete · {seed}</p>
            <h2 className="m-0 mt-2 text-[1.9rem] font-[450] tracking-[-0.03em]">{hud.total.toLocaleString()} points</h2>
            <p className="m-0 mt-1 text-[#ffffff]/70">
              {strokeTotal} strokes against par {parTotal} ({strokeTotal - parTotal >= 0 ? "+" : ""}
              {strokeTotal - parTotal}).
            </p>
            <table className="mono mt-5 w-full border-collapse text-[0.75rem]">
              <thead>
                <tr className="text-[#ffffff]/50">
                  <th className="border-b border-[#ffffff]/15 py-1 text-left font-normal">Hole</th>
                  {hud.results.map((_, i) => (
                    <th key={i} className="border-b border-[#ffffff]/15 py-1 text-center font-normal">
                      {i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="text-[#ffffff]/60">
                  <td className="py-1">Par</td>
                  {hud.results.map((r, i) => (
                    <td key={i} className="py-1 text-center">
                      {r.par}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-1">You</td>
                  {hud.results.map((r, i) => (
                    <td key={i} className={`py-1 text-center ${r.strokes < r.par ? "text-[#86a8f6]" : r.strokes > r.par ? "text-[#f0b45b]" : ""}`}>
                      {r.strokes}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <p className="mono m-0 mt-4 text-[0.72rem] text-[#ffffff]/50">
              Your best today {best.today.toLocaleString()} · all-time {best.ever.toLocaleString()} · kept in this browser only
            </p>
            <div className="mt-6 flex gap-3">
              <button type="button" className={btnPrimary} onClick={() => gameRef.current?.restart()} autoFocus>
                Play again
              </button>
              <a className={btn} href="/">
                Back to the site
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
