/*
 * Leaderboard rules shared by the game page and the Cloudflare Worker that writes the board.
 * The Worker rebuilds the day's course from the date and checks every hole against it, so a
 * submission has to describe a round that could have been played on that course.
 */

import { HOLES, holePoints, makeCourse } from "./golf-engine";

export type Entry = { name: string; score: number; strokes: number; par: number; date: string; at: string };
export type Board = { updatedAt: string | null; entries: Entry[] };
export type Submission = { name: string; date: string; holes: { par: number; strokes: number }[] };

export const BOARD_SIZE = 50;
export const NAME_RE = /^[A-Za-z0-9][A-Za-z0-9 ._-]{0,14}[A-Za-z0-9._-]$|^[A-Za-z0-9]$/;
const MAX_STROKES = 11; // 10 strokes, then a pick-up counts as 11

export function cleanName(raw: string) {
  return raw.replace(/\s+/g, " ").trim();
}

/** Returns an Entry, or a reason the submission was refused. */
export function validate(sub: unknown, now = new Date()): { ok: true; entry: Entry } | { ok: false; error: string } {
  if (!sub || typeof sub !== "object") return { ok: false, error: "Bad request." };
  const s = sub as Partial<Submission>;
  const name = cleanName(String(s.name ?? ""));
  if (name.length < 2 || !NAME_RE.test(name)) return { ok: false, error: "Use 2–16 letters, numbers, spaces, dots, dashes or underscores." };

  const date = String(s.date ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { ok: false, error: "Bad date." };
  const day = Date.parse(`${date}T12:00:00Z`);
  if (Number.isNaN(day) || Math.abs(day - now.getTime()) > 36 * 3600 * 1000) return { ok: false, error: "Rounds can only be submitted on the day they're played." };

  const holes = s.holes;
  if (!Array.isArray(holes) || holes.length !== HOLES) return { ok: false, error: "A round is nine holes." };
  const course = makeCourse(date);
  let score = 0;
  let strokes = 0;
  let par = 0;
  for (let i = 0; i < HOLES; i++) {
    const h = holes[i] as { par?: unknown; strokes?: unknown };
    if (h?.par !== course[i].par) return { ok: false, error: `Hole ${i + 1} doesn't match that day's course.` };
    const st = Number(h.strokes);
    if (!Number.isInteger(st) || st < 1 || st > MAX_STROKES) return { ok: false, error: `Hole ${i + 1} has an impossible stroke count.` };
    score += holePoints(course[i].par, st);
    strokes += st;
    par += course[i].par;
  }
  return { ok: true, entry: { name, score, strokes, par, date, at: now.toISOString() } };
}

/** Adds an entry, keeping each name's best round and the top BOARD_SIZE overall. */
export function merge(board: Board, entry: Entry): { board: Board; rank: number | null; improved: boolean } {
  const key = entry.name.toLowerCase();
  const existing = board.entries.find((e) => e.name.toLowerCase() === key);
  const improved = !existing || entry.score > existing.score;
  let entries = improved ? [...board.entries.filter((e) => e.name.toLowerCase() !== key), entry] : board.entries.slice();
  entries.sort((a, b) => b.score - a.score || a.strokes - b.strokes || a.at.localeCompare(b.at));
  entries = entries.slice(0, BOARD_SIZE);
  const i = entries.findIndex((e) => e.name.toLowerCase() === key);
  return { board: { updatedAt: improved ? entry.at : board.updatedAt, entries }, rank: i >= 0 ? i + 1 : null, improved };
}
