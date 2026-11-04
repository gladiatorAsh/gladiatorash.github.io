/*
 * Moon Golf leaderboard — a Cloudflare Worker.
 *
 *   GET  /scores  → the board (public/leaderboard.json from the site repo), cached briefly
 *   POST /scores  → { name, date, holes: [{ par, strokes } × 9] } → validated, merged, committed
 *
 * The GitHub token lives only here, as a Worker secret; the browser never sees it.
 * Commits carry [skip ci] so a new score doesn't redeploy the site; the board is read live from
 * this Worker, and the daily scheduled deploy refreshes the static copy that ships with the site.
 */

import { merge, validate, type Board } from "../../../lib/leaderboard-rules";

export interface Env {
  GITHUB_TOKEN: string;
  GITHUB_REPO: string; // "owner/repo"
  GITHUB_BRANCH: string;
  BOARD_PATH: string;
  ALLOWED_ORIGINS: string; // comma-separated
  GITHUB_API?: string; // override for local testing
}

const EMPTY: Board = { updatedAt: null, entries: [] };
let cache: { at: number; board: Board; sha: string | null } | null = null;
const CACHE_MS = 20_000;
const hits = new Map<string, number[]>();

function corsHeaders(req: Request, env: Env): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  const allowed = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim());
  const ok = allowed.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : allowed[0],
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}

function json(req: Request, env: Env, body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(req, env), ...extra }
  });
}

function b64encode(text: string) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function b64decode(b64: string) {
  const bin = atob(b64.replace(/\s/g, ""));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

function gh(env: Env, path: string, init: RequestInit = {}) {
  const api = env.GITHUB_API ?? "https://api.github.com";
  return fetch(`${api}/repos/${env.GITHUB_REPO}/contents/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "moon-golf-leaderboard",
      ...(init.headers ?? {})
    }
  });
}

async function readBoard(env: Env, fresh = false): Promise<{ board: Board; sha: string | null }> {
  if (!fresh && cache && Date.now() - cache.at < CACHE_MS) return cache;
  const res = await gh(env, `${env.BOARD_PATH}?ref=${encodeURIComponent(env.GITHUB_BRANCH)}`);
  if (res.status === 404) {
    cache = { at: Date.now(), board: EMPTY, sha: null };
    return cache;
  }
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const file = (await res.json()) as { content: string; sha: string };
  let board: Board = EMPTY;
  try {
    const parsed = JSON.parse(b64decode(file.content)) as Board;
    if (Array.isArray(parsed.entries)) board = parsed;
  } catch {
    /* a hand-edited file that doesn't parse is treated as empty rather than breaking submissions */
  }
  cache = { at: Date.now(), board, sha: file.sha };
  return cache;
}

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

async function submit(req: Request, env: Env) {
  const ip = req.headers.get("CF-Connecting-IP") ?? "unknown";
  if (rateLimited(ip)) return json(req, env, { error: "Too many submissions. Try again in a minute." }, 429);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(req, env, { error: "Bad request." }, 400);
  }
  const checked = validate(body);
  if (!checked.ok) return json(req, env, { error: checked.error }, 422);

  // Read, merge, write; retry if someone else committed in between.
  for (let attempt = 0; attempt < 3; attempt++) {
    const { board, sha } = await readBoard(env, true);
    const merged = merge(board, checked.entry);
    if (!merged.improved) return json(req, env, { rank: merged.rank, improved: false, board });
    const res = await gh(env, env.BOARD_PATH, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `leaderboard: ${checked.entry.name} ${checked.entry.score} [skip ci]`,
        content: b64encode(JSON.stringify(merged.board, null, 2) + "\n"),
        branch: env.GITHUB_BRANCH,
        ...(sha ? { sha } : {})
      })
    });
    if (res.ok) {
      const out = (await res.json()) as { content?: { sha?: string } };
      cache = { at: Date.now(), board: merged.board, sha: out.content?.sha ?? null };
      return json(req, env, { rank: merged.rank, improved: true, board: merged.board });
    }
    if (res.status !== 409 && res.status !== 422) return json(req, env, { error: "Couldn't save the score right now." }, 502);
  }
  return json(req, env, { error: "The board was busy. Try again." }, 503);
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(req, env) });
    if (url.pathname !== "/scores") return json(req, env, { error: "Not found." }, 404);
    try {
      if (req.method === "GET") {
        const { board } = await readBoard(env);
        return json(req, env, board, 200, { "Cache-Control": "public, max-age=20" });
      }
      if (req.method === "POST") return await submit(req, env);
      return json(req, env, { error: "Method not allowed." }, 405);
    } catch {
      return json(req, env, { error: "Leaderboard unavailable." }, 502);
    }
  }
};
