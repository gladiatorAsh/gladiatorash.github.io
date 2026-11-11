"use client";

import { useEffect, useRef, useState } from "react";
import { CloudRain, Coins, Flame, Heart, Moon, Pause, Play, RotateCcw, Shield, Swords } from "lucide-react";
import { ABILITY_CD, ENEMIES, SLOTS, TORCH_COST, TOWERS, createRaigad, type Hud, type TowerKind } from "@/lib/raigad-engine";

type Game = ReturnType<typeof createRaigad>;

function read(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
}

const card = "m-auto w-full max-w-lg border border-[#ffffff]/15 bg-[#120f0b]/92 p-6 text-[#efe6d6] backdrop-blur-md";
const btn =
  "inline-flex min-h-9 items-center justify-center gap-1.5 border border-[#ffffff]/25 px-3 text-[0.85rem] font-medium hover:border-[#ffffff]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0a24a] disabled:cursor-not-allowed disabled:opacity-40";
const btnPrimary = `${btn} !border-[#f08a1c] bg-[#f08a1c] text-[#1a1006] hover:bg-[#f6a650]`;
const panel = "border border-[#ffffff]/15 bg-[#120f0b]/88 backdrop-blur-md";

const KINDS: TowerKind[] = ["archer", "musket", "cannon"];

function WaveIntel({ wave, label }: { wave: Hud["next"]; label: string }) {
  if (!wave) return null;
  const counts = new Map<string, number>();
  for (const g of wave.groups) counts.set(ENEMIES[g.kind].name, (counts.get(ENEMIES[g.kind].name) ?? 0) + g.count);
  return (
    <div className="text-[0.8rem] leading-snug">
      <p className="mono m-0 flex items-center gap-2 text-[0.68rem] uppercase tracking-wider text-[#efe6d6]/55">
        {label}
        {wave.night ? <Moon className="h-3.5 w-3.5" aria-label="Night" /> : null}
        {wave.rain ? <CloudRain className="h-3.5 w-3.5" aria-label="Monsoon rain" /> : null}
      </p>
      <p className="m-0 mt-1 text-[#efe6d6]/90">{wave.note}</p>
      <p className="mono m-0 mt-1 text-[0.7rem] text-[#efe6d6]/55">{[...counts].map(([n, c]) => `${c} ${n.toLowerCase()}`).join(" · ")}</p>
    </div>
  );
}

export function RaigadDefense() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [hud, setHud] = useState<Hud | null>(null);
  const [intro, setIntro] = useState(true);
  const [best, setBest] = useState(0);
  const recorded = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [pannable, setPannable] = useState(false);
  const hudRef = useRef(hud);
  hudRef.current = hud;

  useEffect(() => {
    setBest(Number(read("raigad:best")) || 0);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const game = createRaigad(canvas, setHud);
    game.setPaused(true);
    gameRef.current = game;
    return () => game.destroy();
  }, []);

  useEffect(() => {
    if (!hud || (hud.phase !== "won" && hud.phase !== "lost")) {
      recorded.current = false;
      return;
    }
    if (recorded.current) return;
    recorded.current = true;
    if (hud.score > (Number(read("raigad:best")) || 0)) {
      write("raigad:best", String(hud.score));
      setBest(hud.score);
    }
  }, [hud]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const g = gameRef.current;
      if (!g || intro) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        g.startWave();
      } else if (e.key === "Escape") g.deselect();
      else if (e.key === "p" || e.key === "P") g.setPaused(!hudRef.current?.paused);
      else if (e.key === "1" || e.key === "2" || e.key === "3") g.build(KINDS[Number(e.key) - 1]);
      else if (e.key === "u" || e.key === "U") g.upgrade();
      else if (e.key === "b" || e.key === "B") g.arm("boulder");
      else if (e.key === "o" || e.key === "O") g.arm("oil");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [intro]);

  // Keep the map clear of the HUD. Uses the tallest the bottom bar has been, so the map
  // doesn't jump between build and wave phases.
  const bottomMax = useRef(0);
  useEffect(() => {
    const top = topRef.current;
    const bottom = bottomRef.current;
    if (!top || !bottom) return;
    const measure = () => {
      const parent = bottom.offsetParent?.getBoundingClientRect();
      if (!parent) return;
      const fromBottom = parent.bottom - bottom.getBoundingClientRect().top;
      bottomMax.current = Math.max(bottomMax.current, fromBottom);
      const topEdge = top.getBoundingClientRect().bottom - parent.top;
      gameRef.current?.setInsets(Math.round(topEdge + 6), Math.round(bottomMax.current + 6));
      setPannable(!!gameRef.current?.pannable());
    };
    const ro = new ResizeObserver(measure);
    ro.observe(top);
    ro.observe(bottom);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [intro]);

  const g = gameRef.current;
  const begin = () => {
    setIntro(false);
    g?.setPaused(false);
  };
  const over = hud?.phase === "won" || hud?.phase === "lost";
  const slot = hud?.selection ? SLOTS[hud.selection.slot] : null;

  return (
    <div className="relative h-full w-full select-none overflow-hidden bg-[#1d2a17] text-[#efe6d6]">
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none"
        role="img"
        aria-label="Raigad: Hold the Fort. A map of Raigad fort. Tap a bastion to build defenders, tap open ground to move your commander, and start each wave when ready."
      />

      {hud && !intro ? (
        <>
          {/* Top status bar */}
          <div
            ref={topRef}
            className="pointer-events-none absolute inset-x-2 top-2 flex flex-wrap items-start justify-between gap-2 md:inset-x-4"
          >
            <div className={`${panel} mono pointer-events-auto flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2 text-[0.78rem]`}>
              <span className="flex items-center gap-1.5" title="Gold">
                <Coins className="h-4 w-4 text-[#f3c855]" aria-hidden="true" />
                <span className="sr-only">Gold</span>
                {hud.gold}
              </span>
              <span className="flex items-center gap-1.5" title="Morale: attackers who reach the Raj Sadar cost morale">
                <Heart className="h-4 w-4 text-[#ff7a6b]" aria-hidden="true" />
                <span className="sr-only">Morale</span>
                {hud.lives}
              </span>
              <span className="flex items-center gap-1.5">
                <Swords className="h-4 w-4 text-[#efe6d6]/70" aria-hidden="true" />
                Wave {Math.max(hud.wave, hud.phase === "build" ? hud.wave + 1 : hud.wave)}/{hud.waves}
              </span>
              {hud.gates
                .filter((gt) => gt.open)
                .map((gt) => (
                  <span key={gt.id} className="flex items-center gap-1.5" title={`${gt.name} gate`}>
                    <Shield className="h-4 w-4 text-[#c0a060]" aria-hidden="true" />
                    <span className="hidden sm:inline">{gt.name.replace(" Darwaja", "")}</span>
                    <span className={gt.hp === 0 ? "text-[#ff7a6b]" : ""}>{gt.hp === 0 ? "broken" : `${gt.hp}/${gt.max}`}</span>
                  </span>
                ))}
              {hud.phase === "wave" && hud.night ? (
                <span className="flex items-center gap-1 text-[#a9b8ff]">
                  <Moon className="h-4 w-4" aria-hidden="true" /> {hud.torches ? "torches lit" : "night: −30% range"}
                </span>
              ) : null}
              {hud.phase === "wave" && hud.rain ? (
                <span className="flex items-center gap-1 text-[#a9d3ff]">
                  <CloudRain className="h-4 w-4" aria-hidden="true" /> damp powder
                </span>
              ) : null}
              {hud.heroDead ? <span className="text-[#ff9a8a]">Commander returns in {hud.heroDead}s</span> : null}
            </div>

            {/* Speed and pause */}
            <div className="pointer-events-auto flex gap-1">
              <button
                type="button"
                className={`${btn} ${panel} !min-h-9 w-9 !px-0`}
                onClick={() => g?.setPaused(!hud.paused)}
                aria-label={hud.paused ? "Resume" : "Pause"}
                title="Pause (P)"
              >
                {hud.paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`${btn} ${panel} !min-h-9 w-9 !px-0 ${hud.speed === n ? "!border-[#f08a1c] text-[#f6a650]" : ""}`}
                  onClick={() => g?.setSpeed(n)}
                  aria-pressed={hud.speed === n}
                >
                  {n}×
                </button>
              ))}
            </div>
          </div>

          {pannable && hud.phase === "build" && hud.wave === 0 && !hud.selection ? (
            <p
              className={`${panel} mono absolute left-1/2 m-0 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-[0.68rem] text-[#efe6d6]/70`}
              style={{ top: "6.5rem" }}
            >
              Drag the map sideways · or turn your phone
            </p>
          ) : null}
          {hud.message ? (
            <p className={`${panel} absolute left-1/2 top-28 m-0 -translate-x-1/2 px-3 py-1.5 text-[0.85rem] md:top-16`} role="status">
              {hud.message}
            </p>
          ) : null}
          {hud.armed ? (
            <p
              className={`${panel} absolute left-1/2 top-28 m-0 -translate-x-1/2 px-3 py-1.5 text-[0.85rem] text-[#f6a650] md:top-16`}
              role="status"
            >
              {hud.armed === "boulder" ? "Tap where the boulders should land" : "Tap a gate (or the Hirkani cliff) to pour hot oil"}
            </p>
          ) : null}

          {/* Bottom controls */}
          <div
            ref={bottomRef}
            className="pointer-events-none absolute inset-x-2 bottom-2 flex flex-col gap-2 md:inset-x-4 md:bottom-4 md:flex-row md:items-end"
          >
            <div className={`${panel} pointer-events-auto flex-1 p-3 md:max-w-xl`}>
              {hud.selection && slot ? (
                <div>
                  <p className="m-0 flex items-baseline justify-between gap-2 text-[0.9rem] font-medium">
                    {slot.name}
                    <button
                      type="button"
                      className="mono text-[0.7rem] text-[#efe6d6]/55 hover:text-[#efe6d6]"
                      onClick={() => g?.deselect()}
                    >
                      close ✕
                    </button>
                  </p>
                  {hud.tower ? (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-[0.85rem]">
                        {TOWERS[hud.tower.kind].name} · level {hud.tower.level + 1}
                      </span>
                      {hud.tower.upgrade !== null ? (
                        <button type="button" className={btnPrimary} disabled={hud.gold < hud.tower.upgrade} onClick={() => g?.upgrade()}>
                          Upgrade · {hud.tower.upgrade}
                        </button>
                      ) : (
                        <span className="mono text-[0.72rem] text-[#efe6d6]/55">max level</span>
                      )}
                      <button type="button" className={btn} onClick={() => g?.sell()}>
                        Sell · {hud.tower.sellFor}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {KINDS.map((k, i) => {
                        const t = TOWERS[k];
                        const cost = t.levels[0].cost;
                        return (
                          <button
                            key={k}
                            type="button"
                            disabled={hud.gold < cost}
                            onClick={() => g?.build(k)}
                            className={`${btn} !flex-col !items-start !gap-0.5 py-2 text-left`}
                            title={`${t.blurb} (key ${i + 1})`}
                          >
                            <span className="flex w-full justify-between gap-2">
                              {t.name}
                              <span className="mono text-[#f3c855]">{cost}</span>
                            </span>
                            <span className="text-[0.7rem] font-normal leading-tight text-[#efe6d6]/60">{t.blurb}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : hud.phase === "build" ? (
                <WaveIntel wave={hud.next} label={`Next · wave ${hud.wave + 1}`} />
              ) : (
                <WaveIntel wave={hud.current} label={`Wave ${hud.wave} · ${hud.remaining} left`} />
              )}
            </div>

            <div className={`${panel} pointer-events-auto flex flex-wrap items-center gap-2 p-3`}>
              {hud.phase === "build" ? (
                <>
                  <button type="button" className={btnPrimary} onClick={() => g?.startWave()} title="Space">
                    <Swords className="h-4 w-4" aria-hidden="true" /> Start wave {hud.wave + 1}
                  </button>
                  <button type="button" className={btn} onClick={() => g?.repair()} disabled={hud.repairCost === 0 || hud.gold < 1}>
                    Repair gates
                    {hud.repairCost ? ` · ${Math.min(hud.repairCost, hud.gold)}` : ""}
                  </button>
                  {hud.next?.night ? (
                    <button type="button" className={btn} onClick={() => g?.torches()} disabled={hud.torches || hud.gold < TORCH_COST}>
                      <Flame className="h-4 w-4" aria-hidden="true" /> {hud.torches ? "Torches ready" : `Torches · ${TORCH_COST}`}
                    </button>
                  ) : null}
                </>
              ) : (
                <>
                  {(["boulder", "oil"] as const).map((a) => {
                    const cd = Math.ceil(hud.cds[a]);
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => g?.arm(a)}
                        disabled={cd > 0}
                        className={`${btn} relative overflow-hidden ${hud.armed === a ? "!border-[#f08a1c] text-[#f6a650]" : ""}`}
                        title={
                          a === "boulder" ? "Roll boulders: heavy damage and a stun (B)" : "Hot oil at a gate: burns everything there (O)"
                        }
                      >
                        <span
                          className="absolute inset-y-0 left-0 bg-[#ffffff]/10"
                          style={{
                            width: `${(hud.cds[a] / ABILITY_CD[a]) * 100}%`
                          }}
                          aria-hidden="true"
                        />
                        <span className="relative">
                          {a === "boulder" ? "Boulders" : "Hot oil"}
                          {cd > 0 ? ` · ${cd}s` : ""}
                        </span>
                      </button>
                    );
                  })}
                  {hud.night && !hud.torches ? (
                    <button type="button" className={btn} onClick={() => g?.torches()} disabled={hud.gold < TORCH_COST}>
                      <Flame className="h-4 w-4" aria-hidden="true" /> Torches · {TORCH_COST}
                    </button>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </>
      ) : null}

      {intro ? (
        <div className="absolute inset-0 flex overflow-y-auto bg-[#0b0906]/60 p-4">
          <div className={card}>
            <p className="mono m-0 text-[0.7rem] uppercase tracking-widest text-[#f6a650]">Arcade · prototype</p>
            <h2 className="m-0 mt-2 text-[1.7rem] font-semibold tracking-[-0.02em]">Raigad: Hold the Fort</h2>
            <p className="m-0 mt-3 text-[0.92rem] leading-relaxed text-[#efe6d6]/80">
              Raigad sits on a cliff-ringed hilltop in the Sahyadris and was Shivaji&apos;s capital, where he was crowned in 1674. Only a
              few routes lead to the top. Defend all of them for twelve waves.
            </p>
            <ul className="m-0 mt-4 list-disc space-y-1.5 pl-5 text-[0.86rem] leading-snug text-[#efe6d6]/85">
              <li>
                <b>Tap a bastion</b> (the dashed circles) to place archers, Toradar matchlock gunners or a Tof cannon. Tap it again to
                upgrade or sell.
              </li>
              <li>
                <b>Tap open ground</b> to move your commander. Standing still, he holds up to three attackers and makes nearby defenders
                fire 25% faster.
              </li>
              <li>
                <b>Guard the gates.</b> Once the Maha Darwaja or Wagh Darwaja falls, attackers run for the Raj Sadar. Each one that gets
                there costs morale. Repair gates between waves.
              </li>
              <li>
                <b>Watch the weather.</b> Monsoon rain dampens gunpowder. At night your defenders see less far unless you light torches.
                Climbers come up the Hirkani cliff, where there&apos;s no gate.
              </li>
              <li>
                During a wave, roll <b>boulders</b> onto the approach or pour <b>hot oil</b> over a gate.
              </li>
            </ul>
            <p className="mono m-0 mt-4 text-[0.7rem] text-[#efe6d6]/50">
              Keys: Space starts a wave · 1–3 build · U upgrade · B boulders · O oil · P pause
              {best ? ` · Your best: ${best.toLocaleString()}` : ""}
            </p>
            <button type="button" className={`${btnPrimary} mt-5 w-full`} onClick={begin}>
              Defend Raigad
            </button>
            <p className="m-0 mt-3 text-[0.72rem] text-[#efe6d6]/45">
              The map is a stylised plan inspired by the real fort, not a survey. The waves are fiction, loosely set during the Maratha
              wars.
            </p>
          </div>
        </div>
      ) : null}

      {hud && over ? (
        <div className="absolute inset-0 flex overflow-y-auto bg-[#0b0906]/65 p-4">
          <div className={card} role="dialog" aria-modal="true" aria-labelledby="raigad-over">
            <h2 id="raigad-over" className="m-0 text-[1.6rem] font-semibold tracking-[-0.02em]">
              {hud.phase === "won" ? "Raigad holds." : "Raigad has fallen."}
            </h2>
            <p className="m-0 mt-2 text-[0.92rem] text-[#efe6d6]/80">
              {hud.phase === "won"
                ? `All ${hud.waves} waves beaten with ${hud.lives} morale left.`
                : `You held out until wave ${hud.wave} of ${hud.waves}.`}
            </p>
            <dl className="mono mt-4 grid grid-cols-3 gap-3 text-[0.8rem]">
              <div>
                <dt className="text-[#efe6d6]/50">Score</dt>
                <dd className="m-0 text-[1.1rem]">{hud.score.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-[#efe6d6]/50">Attackers stopped</dt>
                <dd className="m-0 text-[1.1rem]">{hud.kills}</dd>
              </div>
              <div>
                <dt className="text-[#efe6d6]/50">Best</dt>
                <dd className="m-0 text-[1.1rem]">{best.toLocaleString()}</dd>
              </div>
            </dl>
            <button type="button" className={`${btnPrimary} mt-5 w-full`} onClick={() => g?.restart()}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Play again
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
