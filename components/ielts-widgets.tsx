"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { skills, type Phase, type Skill, type Week } from "@/lib/ielts/types";


function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: progress just isn't remembered */
  }
}

export function WeekPlan({ weeks, phases, storageKey }: { weeks: Week[]; phases: Phase[]; storageKey: string }) {
  const DONE_KEY = `${storageKey}:done`;
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    setDone(load(DONE_KEY, {}));
    setLoaded(true);
  }, [DONE_KEY]);

  // No calendar: "up next" is simply the first week with anything left to do.
  const now = loaded ? (weeks.find((w) => skills.some((s) => !done[`${w.n}-${s}`]))?.n ?? 0) : 0;

  const toggle = (id: string) => {
    setDone((d) => {
      const next = { ...d, [id]: !d[id] };
      save(DONE_KEY, next);
      return next;
    });
  };

  const total = weeks.length * skills.length;
  const completed = Object.values(done).filter(Boolean).length;
  const pct = Math.round((completed / total) * 100);
  const shown = filter === "all" ? weeks : weeks.filter((w) => w.phase === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 border border-rule bg-paper-2 p-4">
        <div className="min-w-[12rem] flex-1">
          <p className="mono m-0 text-graphite">
            Progress · {completed}/{total} tasks · {pct}%
          </p>
          <div className="mt-2 h-2 w-full bg-paper" aria-hidden="true">
            <div className="h-2 bg-signal transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter weeks by phase">
          {[{ id: "all", name: "All" }, ...phases.filter((p) => p.id !== "B")].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setFilter(p.id)}
              className={`mono border px-3 py-1.5 ${filter === p.id ? "border-ink bg-ink text-paper" : "border-rule text-graphite hover:text-ink"}`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
      <p className="mono mt-3 text-graphite">Weeks aren&apos;t tied to dates. Skipped one? Just carry on from the week marked “up next”. Ticks are saved on this device only.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {shown.map((w) => {
          const isNow = w.n === now;
          const weekDone = skills.every((s) => done[`${w.n}-${s}`]);
          return (
            <article
              key={w.n}
              id={`week-${w.n}`}
              className={`border p-5 ${isNow ? "border-signal ring-1 ring-signal" : "border-rule"} ${weekDone ? "opacity-70" : ""} bg-paper-2`}
            >
              <header className="flex items-start justify-between gap-3">
                <div>
                  <p className="mono m-0 text-graphite">
                    Week {w.n}
                    {isNow ? <span className="ml-2 text-signal">● up next</span> : null}
                  </p>
                  <h3 className="m-0 mt-1 text-[1.3rem] font-[500] leading-tight tracking-[-0.02em]">{w.theme}</h3>
                </div>
                <span className="mono shrink-0 border border-rule px-2 py-0.5 text-graphite">{phases.find((p) => p.id === w.phase)?.name}</span>
              </header>
              <ul className="mt-4 list-none space-y-2 p-0">
                {skills.map((s) => {
                  const id = `${w.n}-${s}`;
                  return (
                    <li key={s}>
                      <label className="flex cursor-pointer items-start gap-3">
                        <input type="checkbox" className="peer sr-only" checked={!!done[id]} onChange={() => toggle(id)} />
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-rule peer-checked:border-signal peer-checked:bg-signal peer-focus-visible:ring-2 peer-focus-visible:ring-signal"
                        >
                          {done[id] ? <Check className="h-3.5 w-3.5 text-paper" /> : null}
                        </span>
                        <span className={done[id] ? "text-graphite line-through" : ""}>
                          <span className="mono mr-2 text-signal">{s}</span>
                          {w.tasks[s]}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              {w.milestone ? (
                <p className="mono m-0 mt-4 border-t border-rule pt-3 text-ink">◆ Milestone: {w.milestone}</p>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

type Row = { date: string; test: string } & Record<Skill, string>;
const emptyRow = (): Row => ({ date: "", test: "", Listening: "", Reading: "", Writing: "", Speaking: "" });
export function ScoreTracker({ storageKey, targets }: { storageKey: string; targets: Record<Skill, string> }) {
  const TRACK_KEY = `${storageKey}:tracker`;
  const targetBand = Object.fromEntries(skills.map((s) => [s, parseFloat(targets[s])])) as Record<Skill, number>;
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    setRows(load<Row[]>(TRACK_KEY, [{ ...emptyRow(), test: "Diagnostic" }]));
  }, [TRACK_KEY]);

  const update = (i: number, key: keyof Row, value: string) => {
    setRows((r) => {
      const next = r.map((row, j) => (j === i ? { ...row, [key]: value } : row));
      save(TRACK_KEY, next);
      return next;
    });
  };
  const add = () =>
    setRows((r) => {
      const next = [...r, emptyRow()];
      save(TRACK_KEY, next);
      return next;
    });
  const remove = (i: number) =>
    setRows((r) => {
      const next = r.filter((_, j) => j !== i);
      save(TRACK_KEY, next);
      return next;
    });

  const cell = "w-full border border-rule bg-paper px-2 py-1.5 text-[0.95rem]";

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-left">
          <thead>
            <tr className="mono text-graphite">
              <th className="border-b border-rule py-2 pr-2 font-normal">Date</th>
              <th className="border-b border-rule py-2 pr-2 font-normal">Test used</th>
              {skills.map((s) => (
                <th key={s} className="border-b border-rule py-2 pr-2 font-normal">
                  {s} <span className="text-signal">({targetBand[s].toFixed(1)})</span>
                </th>
              ))}
              <th className="border-b border-rule py-2 font-normal" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td className="py-1.5 pr-2">
                  <input aria-label="Date" type="date" className={cell} value={row.date} onChange={(e) => update(i, "date", e.target.value)} />
                </td>
                <td className="py-1.5 pr-2">
                  <input aria-label="Test used" className={cell} value={row.test} placeholder="e.g. Cambridge GT Test 2" onChange={(e) => update(i, "test", e.target.value)} />
                </td>
                {skills.map((s) => {
                  const v = parseFloat(row[s]);
                  const hit = !Number.isNaN(v) && v >= targetBand[s];
                  return (
                    <td key={s} className="py-1.5 pr-2">
                      <input
                        aria-label={`${s} band`}
                        inputMode="decimal"
                        className={`${cell} ${hit ? "!border-signal text-signal" : ""}`}
                        value={row[s]}
                        placeholder="band"
                        onChange={(e) => update(i, s, e.target.value)}
                      />
                    </td>
                  );
                })}
                <td className="py-1.5">
                  <button type="button" onClick={() => remove(i)} className="mono px-2 text-graphite hover:text-ink" aria-label="Remove row">
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={add} className="mono mt-4 border border-ink px-4 py-2 hover:bg-ink hover:text-paper">
        + Add a practice test
      </button>
      <p className="mono mt-3 text-graphite">Scores at or above target turn blue. Saved on this device only.</p>
    </div>
  );
}
