import type { Board, Entry, Submission } from "@/lib/leaderboard-rules";

/** Set at build time from the repo variable LEADERBOARD_URL (the Worker's address). */
const API = (process.env.NEXT_PUBLIC_LEADERBOARD_URL ?? "").replace(/\/+$/, "");

export const leaderboardEnabled = Boolean(API);

/** Live board from the Worker; falls back to the copy deployed with the site. */
export async function fetchBoard(): Promise<Board> {
  const urls = API ? [`${API}/scores`, "/leaderboard.json"] : ["/leaderboard.json"];
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const board = (await res.json()) as Board;
      if (Array.isArray(board.entries)) return board;
    } catch {
      /* try the next source */
    }
  }
  return { updatedAt: null, entries: [] };
}

export async function submitScore(sub: Submission): Promise<{ rank: number | null; improved: boolean; board: Board }> {
  const res = await fetch(`${API}/scores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub)
  });
  const body = (await res.json().catch(() => ({}))) as { error?: string; rank?: number | null; improved?: boolean; board?: Board };
  if (!res.ok || !body.board) throw new Error(body.error ?? "Couldn't reach the leaderboard.");
  return { rank: body.rank ?? null, improved: Boolean(body.improved), board: body.board };
}

export type { Board, Entry };
