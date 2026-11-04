"use client";

import { useEffect, useRef, useState } from "react";
import { CLUBS, HOLES, createGolf, type Club, type Difficulty, type Hud, type Mode } from "@/lib/golf-engine";
import { fetchBoard, leaderboardEnabled, submitScore, type Board } from "@/lib/leaderboard";
import { NAME_RE, cleanName } from "@/lib/leaderboard-rules";

type Game = ReturnType<typeof createGolf>;

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

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
    /* storage unavailable: nothing is remembered */
  }
}

const readBest = (key: string) => Number(read(key)) || 0;
const saveBest = (key: string, value: number) => value > readBest(key) && write(key, String(value));

const card = "m-auto w-full max-w-md border border-[#ffffff]/15 bg-[#0b0e16]/92 p-6 text-[#e6e8ec] backdrop-blur-md";
const btn =
  "inline-flex min-h-10 items-center justify-center border border-[#ffffff]/25 px-4 text-[0.9rem] font-medium hover:border-[#ffffff]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#86a8f6]";
const btnPrimary = `${btn} !border-[#86a8f6] bg-[#86a8f6] text-[#05060b] hover:bg-[#a9c1fa] disabled:opacity-50`;
const seg = (on: boolean) =>
  `${btn} ${on ? "!border-[#86a8f6] bg-[#86a8f6]/15 text-[#ffffff]" : "bg-transparent text-[#ffffff]/70"} -ml-px first:ml-0`;

const BOT_COLOR = "text-[#f0b45b]";
const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" }
];

const fmtDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function toPar(strokes: number, par: number) {
  const d = strokes - par;
  return d === 0 ? "E" : d > 0 ? `+${d}` : `−${-d}`;
}

function Leaderboard({ board, limit, highlight }: { board: Board | null; limit: number; highlight?: string }) {
  if (!board) return <p className="mono m-0 mt-3 text-[0.72rem] text-[#ffffff]/45">Loading the leaderboard…</p>;
  if (!board.entries.length) return <p className="mono m-0 mt-3 text-[0.72rem] text-[#ffffff]/45">No scores yet. Be the first.</p>;
  const me = highlight?.toLowerCase();
  return (
    <table className="mono mt-3 w-full border-collapse text-[0.75rem]">
      <thead>
        <tr className="text-[#ffffff]/45">
          <th className="w-8 border-b border-[#ffffff]/15 py-1 text-left font-normal">#</th>
          <th className="border-b border-[#ffffff]/15 py-1 text-left font-normal">Name</th>
          <th className="border-b border-[#ffffff]/15 py-1 text-right font-normal">Score</th>
          <th className="border-b border-[#ffffff]/15 py-1 text-right font-normal">Date</th>
        </tr>
      </thead>
      <tbody>
        {board.entries.slice(0, limit).map((e, i) => (
          <tr key={e.name} className={e.name.toLowerCase() === me ? "text-[#86a8f6]" : "text-[#ffffff]/85"}>
            <td className="py-1">{i + 1}</td>
            <td className="max-w-[9rem] truncate py-1">{e.name}</td>
            <td className="py-1 text-right">{e.score.toLocaleString()}</td>
            <td className="py-1 text-right text-[#ffffff]/50">{fmtDate.format(new Date(`${e.date}T12:00:00Z`))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function MoonGolf() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [hud, setHud] = useState<Hud | null>(null);
  const [started, setStarted] = useState(false);
  const [seed, setSeed] = useState("");
  const [mode, setMode] = useState<Mode>("solo");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [best, setBest] = useState({ today: 0, ever: 0 });
  const [record, setRecord] = useState({ wins: 0, losses: 0, ties: 0 });
  const [board, setBoard] = useState<Board | null>(null);
  const [name, setName] = useState("");
  const [submit, setSubmit] = useState<{ state: "idle" | "sending" | "sent" | "error"; message?: string }>({ state: "idle" });
  const recorded = useRef(false);

  useEffect(() => {
    const s = today();
    setSeed(s);
    setBest({ today: readBest(`moongolf:best:${s}`), ever: readBest("moongolf:best") });
    setRecord({ wins: readBest("moongolf:wins"), losses: readBest("moongolf:losses"), ties: readBest("moongolf:ties") });
    setName(read("moongolf:name") ?? "");
    const m = read("moongolf:mode");
    if (m === "solo" || m === "bot") setMode(m);
    const d = read("moongolf:difficulty");
    if (d === "easy" || d === "medium" || d === "hard") setDifficulty(d);
    fetchBoard().then(setBoard);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const game = createGolf(canvas, s, setHud);
    gameRef.current = game;
    return () => game.destroy();
  }, []);

  const you = hud?.players[0];
  const bot = hud?.players[1];
  const parTotal = you?.results.reduce((s, r) => s + r.par, 0) ?? 0;
  const vsBot = started && hud?.mode === "bot" && bot;
  const outcome = vsBot && you ? (you.strokeTotal < bot.strokeTotal ? "win" : you.strokeTotal > bot.strokeTotal ? "loss" : "tie") : null;

  useEffect(() => {
    if (hud?.phase !== "done" || !seed) {
      recorded.current = false;
      return;
    }
    if (recorded.current) return;
    recorded.current = true;
    saveBest(`moongolf:best:${seed}`, hud.total);
    saveBest("moongolf:best", hud.total);
    setBest({ today: readBest(`moongolf:best:${seed}`), ever: readBest("moongolf:best") });
    if (outcome) {
      const key = outcome === "win" ? "wins" : outcome === "loss" ? "losses" : "ties";
      write(`moongolf:${key}`, String(readBest(`moongolf:${key}`) + 1));
      setRecord({ wins: readBest("moongolf:wins"), losses: readBest("moongolf:losses"), ties: readBest("moongolf:ties") });
    }
  }, [hud?.phase, hud?.total, seed, outcome]);

  const setClub = (c: Club) => gameRef.current?.setClub(c);

  const startRound = () => {
    write("moongolf:mode", mode);
    write("moongolf:difficulty", difficulty);
    gameRef.current?.start(mode, difficulty);
    setStarted(true);
  };

  const sendScore = async () => {
    if (!hud || hud.phase !== "done") return;
    const clean = cleanName(name);
    if (clean.length < 2 || !NAME_RE.test(clean)) {
      setSubmit({ state: "error", message: "Use 2–16 letters, numbers, spaces, dots, dashes or underscores." });
      return;
    }
    setSubmit({ state: "sending" });
    write("moongolf:name", clean);
    try {
      const res = await submitScore({ name: clean, date: seed, holes: hud.results.map((r) => ({ par: r.par, strokes: r.strokes })) });
      setBoard(res.board);
      const kept = res.board.entries.find((e) => e.name.toLowerCase() === clean.toLowerCase());
      setSubmit({
        state: "sent",
        message: res.improved
          ? res.rank
            ? `Saved. You're #${res.rank} all-time.`
            : "Saved, but it's not in the top 50 yet."
          : `Your best of ${kept?.score.toLocaleString() ?? "earlier"} still stands${res.rank ? ` at #${res.rank}` : ""}.`
      });
    } catch (err) {
      setSubmit({ state: "error", message: err instanceof Error ? err.message : "Couldn't reach the leaderboard." });
    }
  };

  const playAgain = () => {
    setSubmit({ state: "idle" });
    gameRef.current?.restart();
  };

  const newGame = () => {
    setSubmit({ state: "idle" });
    gameRef.current?.pause();
    setStarted(false);
  };

  const botTurn = hud?.mode === "bot" && hud.turn === 1;

  return (
    <div className="relative h-full w-full select-none overflow-hidden bg-[#05060b] text-[#e6e8ec]">
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none"
        aria-label="Moon Golf. Drag back from anywhere and release to hit the ball. Keyboard: arrow keys aim, Space hits, 1 to 4 pick a club."
        role="img"
      />

      {/* Scoreline */}
      {hud && you ? (
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
            {vsBot ? null : (
              <div>
                <dt>Strokes</dt>
                <dd className="m-0 text-[1.05rem] text-[#ffffff]">{you.strokes}</dd>
              </div>
            )}
            <div>
              <dt>{vsBot ? (botTurn ? "Bot to pin" : "To pin") : "To pin"}</dt>
              <dd className={`m-0 text-[1.05rem] ${botTurn ? BOT_COLOR : "text-[#ffffff]"}`}>{hud.toPin} m</dd>
            </div>
          </dl>
          {vsBot && bot ? (
            <table className="mono border-collapse text-right text-[0.78rem] text-[#ffffff]/60">
              <thead>
                <tr>
                  <th className="pr-3 text-left font-normal" />
                  <th className="px-2 font-normal">Hole</th>
                  <th className="pl-2 font-normal">Total</th>
                </tr>
              </thead>
              <tbody className="text-[1rem]">
                {[you, bot].map((p, i) => (
                  <tr key={p.label} className={i ? BOT_COLOR : "text-[#ffffff]"}>
                    <td className="pr-3 text-left text-[0.78rem]">
                      {hud.turn === i && hud.phase !== "holed" && hud.phase !== "done" ? "▸ " : ""}
                      {p.label}
                    </td>
                    <td className="px-2">
                      {p.strokes}
                      {p.holed ? "✓" : ""}
                    </td>
                    <td className="pl-2">{toPar(p.strokeTotal, parTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="mono text-right text-[0.78rem] text-[#ffffff]/70">
              Score
              <div className="text-[1.35rem] leading-tight text-[#ffffff]">{hud.total.toLocaleString()}</div>
            </div>
          )}
        </div>
      ) : null}

      {/* Clubs, or what the bot is doing */}
      {hud && started && hud.phase !== "holed" && hud.phase !== "done" ? (
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-0 p-3 md:p-5">
          {hud.phase === "flight" ? (
            <button type="button" className={btn} onClick={() => gameRef.current?.toggleFastForward()}>
              {hud.fastForward ? "Normal speed" : "Fast-forward ×4"}
              <span className="mono ml-2 text-[0.7rem] text-[#ffffff]/50">tap / F</span>
            </button>
          ) : botTurn ? (
            <p className={`mono m-0 border border-[#f0b45b]/40 bg-[#0b0e16]/70 px-4 py-2.5 text-[0.85rem] ${BOT_COLOR}`} role="status">
              {hud.botStatus === "thinking" ? "Bot is reading the terrain…" : `Bot takes the ${CLUBS.find((c) => c.id === hud.club)?.label.toLowerCase()}`}
            </p>
          ) : (
            <div role="group" aria-label="Club" className="flex">
              {CLUBS.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={hud.club === c.id}
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
        <div className="absolute inset-0 flex overflow-y-auto bg-[#05060b]/55 p-4">
          <div className={card}>
            <p className="mono m-0 text-[0.75rem] text-[#ffffff]/55">Arcade · {seed}</p>
            <h2 className="m-0 mt-2 text-[1.9rem] font-[450] tracking-[-0.03em]">Moon Golf</h2>
            <p className="m-0 mt-2 text-[#ffffff]/70">
              Nine holes of one-sixth-gravity golf. The course is built from today&rsquo;s date, so everyone plays the same holes today.
            </p>
            <ul className="m-0 mt-5 list-none space-y-2.5 p-0 text-[0.92rem] leading-[1.5] text-[#ffffff]/80">
              <li>
                <b className="font-medium text-[#ffffff]">Drag back, let go.</b> Press anywhere, pull away from where you want the ball to go, release.
              </li>
              <li>
                <b className="font-medium text-[#ffffff]">No air.</b> Every shot is a clean parabola. The dots only show the start of it.
              </li>
              <li>
                <span className="text-[#cfc8b8]">Dust</span> soaks up the ball. <span className="text-[#9aa1ab]">Bare rock</span> bounces and rolls. The{" "}
                <span className="text-[#ffffff]">bright pad</span> around the flag is smooth.
              </li>
              <li>
                <b className="font-medium text-[#ffffff]">Pick a club.</b> Beat par for points. Tap mid-flight to fast-forward.
              </li>
            </ul>

            <div className="mt-5 border-t border-[#ffffff]/15 pt-4">
              <p className="mono m-0 text-[0.72rem] text-[#ffffff]/55">Mode</p>
              <div role="radiogroup" aria-label="Mode" className="mt-2 flex">
                <button type="button" role="radio" aria-checked={mode === "solo"} className={seg(mode === "solo")} onClick={() => setMode("solo")}>
                  Single player
                </button>
                <button type="button" role="radio" aria-checked={mode === "bot"} className={seg(mode === "bot")} onClick={() => setMode("bot")}>
                  Against the bot
                </button>
              </div>
              {mode === "bot" ? (
                <>
                  <div role="radiogroup" aria-label="Bot difficulty" className="mt-2 flex">
                    {DIFFICULTIES.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        role="radio"
                        aria-checked={difficulty === d.id}
                        className={`${seg(difficulty === d.id)} !min-h-9 text-[0.82rem]`}
                        onClick={() => setDifficulty(d.id)}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                  <p className="m-0 mt-2 text-[0.82rem] leading-[1.5] text-[#ffffff]/60">
                    You and the bot each play a ball. Whoever is farther from the pin hits next, and the fewest total strokes wins.{" "}
                    {difficulty === "easy"
                      ? "Easy settles for rough shots and mis-hits often; it usually finishes well over par."
                      : difficulty === "medium"
                        ? "Medium plays sensible shots with a shaky swing; it finishes around par."
                        : "Hard weighs more options and swings cleaner; expect it a few under par."}
                    {record.wins + record.losses + record.ties ? (
                      <span className="mono mt-1 block text-[0.72rem] text-[#ffffff]/50">
                        Your record: {record.wins}W {record.losses}L {record.ties}T
                      </span>
                    ) : null}
                  </p>
                </>
              ) : null}
            </div>

            <p className="mono m-0 mt-4 text-[0.72rem] text-[#ffffff]/50">Keyboard: ← → aim · ↑ ↓ power · A flips · Space hits · 1–4 clubs</p>
            {best.today || best.ever ? (
              <p className="mono m-0 mt-2 text-[0.72rem] text-[#ffffff]/50">
                Your best today {best.today.toLocaleString()} · all-time {best.ever.toLocaleString()}
              </p>
            ) : null}
            <div className="mt-5 border-t border-[#ffffff]/15 pt-4">
              <p className="mono m-0 text-[0.72rem] text-[#ffffff]/55">All-time leaderboard</p>
              <Leaderboard board={board} limit={5} highlight={name} />
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" className={btnPrimary} onClick={startRound} autoFocus>
                Play
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Hole done */}
      {started && hud?.phase === "holed" && hud.lastHole ? (
        <div className="absolute inset-0 grid place-items-center bg-[#05060b]/40 p-4">
          <div className={card} role="status">
            <p className="mono m-0 text-[0.75rem] text-[#ffffff]/55">
              Hole {hud.hole} · par {hud.lastHole.par}
            </p>
            {hud.lastHole.rows.length === 1 ? (
              <>
                <h2 className="m-0 mt-2 text-[1.9rem] font-[450] tracking-[-0.03em]">{hud.lastHole.rows[0].name}</h2>
                <p className="m-0 mt-2 text-[#ffffff]/70">
                  {hud.lastHole.rows[0].strokes > 10
                    ? "Picked up after 10 strokes."
                    : `${hud.lastHole.rows[0].strokes} stroke${hud.lastHole.rows[0].strokes === 1 ? "" : "s"}.`}{" "}
                  <span className="text-[#86a8f6]">+{hud.lastHole.rows[0].points}</span>
                </p>
              </>
            ) : (
              <>
                <h2 className="m-0 mt-2 text-[1.9rem] font-[450] tracking-[-0.03em]">
                  {hud.lastHole.rows[0].strokes < hud.lastHole.rows[1].strokes
                    ? "You take the hole"
                    : hud.lastHole.rows[0].strokes > hud.lastHole.rows[1].strokes
                      ? "The bot takes it"
                      : "Halved"}
                </h2>
                <table className="mono mt-3 w-full border-collapse text-[0.85rem]">
                  <tbody>
                    {hud.lastHole.rows.map((r, i) => (
                      <tr key={r.label} className={i ? BOT_COLOR : ""}>
                        <td className="py-1">{r.label}</td>
                        <td className="py-1">{r.name}</td>
                        <td className="py-1 text-right">{r.strokes > 10 ? "11" : r.strokes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {you && bot ? (
                  <p className="mono m-0 mt-2 text-[0.75rem] text-[#ffffff]/55">
                    Round so far: you {toPar(you.strokeTotal, parTotal)}, bot {toPar(bot.strokeTotal, parTotal)}
                  </p>
                ) : null}
              </>
            )}
            <button type="button" className={`${btnPrimary} mt-6`} onClick={() => gameRef.current?.nextHole()} autoFocus>
              Hole {hud.hole + 1}
            </button>
          </div>
        </div>
      ) : null}

      {/* Round done */}
      {started && hud?.phase === "done" && you ? (
        <div className="absolute inset-0 flex overflow-y-auto bg-[#05060b]/60 p-4">
          <div className={card} role="status">
            <p className="mono m-0 text-[0.75rem] text-[#ffffff]/55">Round complete · {seed}</p>
            {vsBot && bot ? (
              <>
                <h2 className="m-0 mt-2 text-[1.9rem] font-[450] tracking-[-0.03em]">
                  {outcome === "win" ? "You beat the bot" : outcome === "loss" ? "The bot wins" : "All square"}
                </h2>
                <p className="m-0 mt-1 text-[#ffffff]/70">
                  {you.strokeTotal} strokes to the bot&rsquo;s {bot.strokeTotal}
                  {outcome === "tie" ? "." : ` (by ${Math.abs(you.strokeTotal - bot.strokeTotal)}).`} {hud.total.toLocaleString()} points.
                </p>
              </>
            ) : (
              <>
                <h2 className="m-0 mt-2 text-[1.9rem] font-[450] tracking-[-0.03em]">{hud.total.toLocaleString()} points</h2>
                <p className="m-0 mt-1 text-[#ffffff]/70">
                  {you.strokeTotal} strokes against par {parTotal} ({toPar(you.strokeTotal, parTotal)}).
                </p>
              </>
            )}
            <table className="mono mt-5 w-full border-collapse text-[0.75rem]">
              <thead>
                <tr className="text-[#ffffff]/50">
                  <th className="border-b border-[#ffffff]/15 py-1 text-left font-normal">Hole</th>
                  {you.results.map((_, i) => (
                    <th key={i} className="border-b border-[#ffffff]/15 py-1 text-center font-normal">
                      {i + 1}
                    </th>
                  ))}
                  <th className="border-b border-[#ffffff]/15 py-1 text-right font-normal">Tot</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-[#ffffff]/60">
                  <td className="py-1">Par</td>
                  {you.results.map((r, i) => (
                    <td key={i} className="py-1 text-center">
                      {r.par}
                    </td>
                  ))}
                  <td className="py-1 text-right">{parTotal}</td>
                </tr>
                {hud.players.map((p, pi) => (
                  <tr key={p.label} className={pi ? BOT_COLOR : ""}>
                    <td className="py-1">{p.label}</td>
                    {p.results.map((r, i) => (
                      <td
                        key={i}
                        className={`py-1 text-center ${pi ? "" : r.strokes < r.par ? "text-[#86a8f6]" : r.strokes > r.par ? "text-[#f0b45b]" : ""}`}
                      >
                        {r.strokes}
                      </td>
                    ))}
                    <td className="py-1 text-right">{p.strokeTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {leaderboardEnabled ? (
              submit.state === "sent" ? (
                <p className="m-0 mt-5 text-[0.92rem] text-[#86a8f6]">{submit.message}</p>
              ) : (
                <form
                  className="mt-5 flex gap-0"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void sendScore();
                  }}
                >
                  <label className="sr-only" htmlFor="mg-name">
                    Name for the leaderboard
                  </label>
                  <input
                    id="mg-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={16}
                    autoComplete="nickname"
                    placeholder="Your name"
                    autoFocus
                    className="min-h-10 min-w-0 flex-1 select-text border border-[#ffffff]/25 bg-transparent px-3 text-[0.9rem] text-[#ffffff] placeholder:text-[#ffffff]/40 focus:border-[#86a8f6] focus:outline-none"
                  />
                  <button type="submit" className={`${btnPrimary} -ml-px`} disabled={submit.state === "sending"}>
                    {submit.state === "sending" ? "Saving…" : "Submit score"}
                  </button>
                </form>
              )
            ) : null}
            {submit.state === "error" ? (
              <p className="m-0 mt-2 text-[0.82rem] text-[#f0b45b]" role="alert">
                {submit.message}
              </p>
            ) : null}
            <div className="mt-5 border-t border-[#ffffff]/15 pt-4">
              <p className="mono m-0 text-[0.72rem] text-[#ffffff]/55">All-time leaderboard</p>
              <Leaderboard board={board} limit={10} highlight={submit.state === "sent" ? cleanName(name) : undefined} />
            </div>
            <p className="mono m-0 mt-4 text-[0.72rem] text-[#ffffff]/50">
              Your best today {best.today.toLocaleString()} · all-time {best.ever.toLocaleString()}
              {vsBot ? ` · vs bot ${record.wins}W ${record.losses}L ${record.ties}T` : ""}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className={submit.state === "sent" || !leaderboardEnabled ? btnPrimary : btn} onClick={playAgain} autoFocus={!leaderboardEnabled}>
                Play again
              </button>
              <button type="button" className={btn} onClick={newGame}>
                Change mode
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
