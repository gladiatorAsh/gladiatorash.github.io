/*
 * Moon Golf — a small canvas game. Nine holes of one-sixth-gravity golf on a course that is
 * generated from today's date, so everyone who visits on the same day plays the same holes.
 *
 * World units: y points down, the playfield is WORLD_H tall, each hole has its own width.
 * Ten world units are shown to the player as one metre.
 */

export type Club = "driver" | "iron" | "wedge" | "putter";
export type Phase = "aim" | "flight" | "holed" | "done";
type Surface = 0 | 1 | 2; // dust, rock, pad (the smooth area around the cup)

export const CLUBS: { id: Club; label: string; hint: string; key: string }[] = [
  { id: "driver", label: "Driver", hint: "long", key: "1" },
  { id: "iron", label: "Iron", hint: "mid", key: "2" },
  { id: "wedge", label: "Wedge", hint: "short, stops fast", key: "3" },
  { id: "putter", label: "Putter", hint: "rolls flat", key: "4" }
];

const CLUB_SPEED: Record<Club, number> = { driver: 520, iron: 380, wedge: 265, putter: 170 };
const PUTTER_MAX_LIFT = (12 * Math.PI) / 180;

export const HOLES = 9;
const WORLD_H = 900;
const STEP = 4; // terrain sample spacing
const G = 150; // gravity, units/s^2
const R = 6; // ball radius
const CUP_HALF = 11;
const CUP_DEPTH = 34;
const TEE_X = 110;
const MAX_STROKES = 10;

const RESTITUTION: Record<Surface, number> = { 0: 0.1, 1: 0.52, 2: 0.25 };
const IMPACT_FRICTION: Record<Surface, number> = { 0: 0.55, 1: 0.1, 2: 0.2 };
const ROLL_DECEL: Record<Surface, number> = { 0: 190, 1: 28, 2: 55 };

export type Mode = "solo" | "bot";
export type Difficulty = "easy" | "medium" | "hard";
export type HoleResult = { par: number; strokes: number; points: number };
export type PlayerHud = { label: string; strokes: number; holed: boolean; total: number; strokeTotal: number; results: HoleResult[] };
export type HoleSummary = { par: number; rows: { label: string; strokes: number; points: number; name: string }[] };
export type Hud = {
  phase: Phase;
  mode: Mode;
  hole: number; // 1-based
  par: number;
  turn: number; // index into players
  botStatus: "thinking" | "swinging" | null;
  club: Club;
  toPin: number; // metres, for the ball in play
  fastForward: boolean;
  players: PlayerHud[];
  lastHole: HoleSummary | null;
  // The human player's round, for the leaderboard.
  strokes: number;
  total: number;
  results: HoleResult[];
};

export type Hole = { width: number; ys: Float32Array; kinds: Uint8Array; cupX: number; rimY: number; par: number };

// ---------- seeded randomness ----------

function hashSeed(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- course ----------

function makeHole(rng: () => number, index: number): Hole {
  const width = Math.round(1300 + index * 140 + rng() * 900);
  const n = Math.floor(width / STEP) + 1;
  const ys = new Float32Array(n);
  const kinds = new Uint8Array(n);
  const base = 600 + rng() * 60;
  const a1 = 50 + rng() * 70;
  const f1 = 260 + rng() * 240;
  const f2 = 90 + rng() * 80;
  const p1 = rng() * 6.28;
  const p2 = rng() * 6.28;
  const p3 = rng() * 6.28;
  const rockFreq = 140 + rng() * 120;
  const rockBias = 0.15 + rng() * 0.35;

  for (let i = 0; i < n; i++) {
    const x = i * STEP;
    ys[i] = base + a1 * Math.sin(x / f1 + p1) + a1 * 0.35 * Math.sin(x / f2 + p2) + 6 * Math.sin(x / 23 + p3);
    kinds[i] = Math.sin(x / rockFreq + p3) > rockBias ? 1 : 0;
  }

  const cupX = Math.round(width - 140 - rng() * 160);

  // Craters: a dusty bowl with a bare-rock rim.
  const craters = 2 + Math.floor(rng() * 3);
  for (let c = 0; c < craters; c++) {
    const cx = 340 + rng() * Math.max(60, cupX - 560);
    const cr = 55 + rng() * 110;
    const depth = 25 + rng() * 55;
    for (let i = 0; i < n; i++) {
      const t = (i * STEP - cx) / cr;
      const at = Math.abs(t);
      if (at > 1.6) continue;
      if (at < 1) {
        ys[i] += depth * (1 - t * t);
        kinds[i] = 0;
      }
      const rim = depth * 0.5 * Math.exp(-(((at - 1) / 0.17) ** 2));
      ys[i] -= rim;
      if (at > 0.85 && at < 1.2) kinds[i] = 1;
    }
  }

  // Flatten the tee and the pad around the cup.
  const flatten = (cx: number, half: number, blend: number, kind: Surface | null) => {
    const y0 = ys[Math.round(cx / STEP)];
    for (let i = 0; i < n; i++) {
      const d = Math.abs(i * STEP - cx);
      if (d > half + blend) continue;
      const w = d <= half ? 1 : 0.5 + 0.5 * Math.cos(((d - half) / blend) * Math.PI);
      ys[i] = ys[i] * (1 - w) + y0 * w;
      if (kind !== null && d <= half + blend * 0.4) kinds[i] = kind;
    }
  };
  flatten(TEE_X, 40, 50, null);
  flatten(cupX, 70, 90, 2);

  for (let i = 0; i < n; i++) ys[i] = Math.min(830, Math.max(360, ys[i]));

  const rimY = ys[Math.round(cupX / STEP)];
  for (let i = 0; i < n; i++) if (Math.abs(i * STEP - cupX) <= CUP_HALF) ys[i] = rimY + CUP_DEPTH;

  const dist = cupX - TEE_X;
  const par = dist < 1050 ? 3 : dist < 1800 ? 4 : 5;
  return { width, ys, kinds, cupX, rimY, par };
}

export function makeCourse(seed: string) {
  const rng = mulberry32(hashSeed(`moon-golf:${seed}`));
  return Array.from({ length: HOLES }, (_, i) => makeHole(rng, i));
}

function groundAt(hole: Hole, x: number) {
  const f = Math.min(Math.max(x / STEP, 0), hole.ys.length - 1);
  const i = Math.floor(f);
  const j = Math.min(i + 1, hole.ys.length - 1);
  return hole.ys[i] + (hole.ys[j] - hole.ys[i]) * (f - i);
}

export function scoreName(par: number, strokes: number) {
  if (strokes === 1) return "Hole in one";
  const d = strokes - par;
  return d <= -3 ? "Albatross" : d === -2 ? "Eagle" : d === -1 ? "Birdie" : d === 0 ? "Par" : d === 1 ? "Bogey" : d === 2 ? "Double bogey" : `+${d}`;
}

export function holePoints(par: number, strokes: number) {
  return Math.max(0, 300 + 100 * (par - strokes)) + (strokes === 1 ? 500 : 0);
}

function suggestClub(dx: number): Club {
  const d = Math.abs(dx);
  return d > 1000 ? "driver" : d > 480 ? "iron" : d > 110 ? "wedge" : "putter";
}

// ---------- physics (pure, so the bot can rehearse shots with it) ----------

type Ball = { x: number; y: number; vx: number; vy: number; club: Club; firstImpact: boolean; rest: number; t: number };
type StepResult = "move" | "rest" | "sunk" | "oob";

/** Launch velocity for a club, a direction and a power from 0 to 1. Putts are kept near the ground. */
export function launch(club: Club, angle: number, power: number) {
  let a = angle;
  if (club === "putter") {
    const left = Math.cos(a) < 0;
    const lift = left ? -(Math.PI + a) : -a;
    const clamped = Math.max(-0.2, Math.min(PUTTER_MAX_LIFT, lift));
    a = left ? -Math.PI + clamped : -clamped;
  }
  const v = CLUB_SPEED[club] * Math.max(0, Math.min(1, power));
  return { vx: Math.cos(a) * v, vy: Math.sin(a) * v, angle: a };
}

function collide(hole: Hole, b: Ball, dt: number) {
  let contact: { nx: number; ny: number; kind: Surface } | null = null;
  for (let pass = 0; pass < 2; pass++) {
    const i0 = Math.max(0, Math.floor((b.x - R) / STEP) - 1);
    const i1 = Math.min(hole.ys.length - 2, Math.ceil((b.x + R) / STEP) + 1);
    const ground = groundAt(hole, b.x);
    const below = b.y > ground;
    let best = 0;
    let bnx = 0;
    let bny = -1;
    let bk: Surface = 0;
    for (let i = i0; i <= i1; i++) {
      const ax = i * STEP;
      const ay = hole.ys[i];
      const ex = STEP;
      const ey = hole.ys[i + 1] - ay;
      const t = Math.max(0, Math.min(1, ((b.x - ax) * ex + (b.y - ay) * ey) / (ex * ex + ey * ey)));
      let dx = b.x - (ax + ex * t);
      let dy = b.y - (ay + ey * t);
      let dist = Math.hypot(dx, dy);
      // Below the surface counts as inside, even when the centre went through.
      if (dist < 1e-6 || below) {
        const len = Math.hypot(ex, ey);
        dx = ey / len;
        dy = -ex / len;
        dist = below ? -Math.abs(b.y - ground) : 0;
      } else {
        dx /= dist;
        dy /= dist;
      }
      const pen = R - dist;
      if (pen > best) {
        best = pen;
        bnx = dx;
        bny = dy;
        bk = hole.kinds[i] as Surface;
      }
    }
    if (best <= 0) break;
    b.x += bnx * best;
    b.y += bny * best;
    contact = { nx: bnx, ny: bny, kind: bk };
  }
  if (!contact) return false;

  const { nx, ny, kind } = contact;
  const vn = b.vx * nx + b.vy * ny;
  let tx = b.vx - vn * nx;
  let ty = b.vy - vn * ny;
  if (vn < -35) {
    const spin = b.club === "wedge" && b.firstImpact;
    const e = RESTITUTION[kind] * (spin ? 0.6 : 1);
    const f = Math.min(0.9, IMPACT_FRICTION[kind] + (spin ? 0.35 : 0));
    b.firstImpact = false;
    tx *= 1 - f;
    ty *= 1 - f;
    b.vx = tx - e * vn * nx;
    b.vy = ty - e * vn * ny;
  } else {
    // Rolling: drop the normal part, slow down along the surface.
    const sp = Math.hypot(tx, ty);
    const ns = Math.max(0, sp - ROLL_DECEL[kind] * dt);
    const k = sp > 1e-6 ? ns / sp : 0;
    b.vx = tx * k;
    b.vy = ty * k;
  }
  return true;
}

function stepBall(hole: Hole, b: Ball, dt: number): StepResult {
  b.vy += G * dt;
  b.x += b.vx * dt;
  b.y += b.vy * dt;
  b.t += dt;
  if (b.x < -R * 2 || b.x > hole.width + R * 2) return "oob";
  const touching = collide(hole, b, dt);
  if (Math.abs(b.x - hole.cupX) < CUP_HALF - 1 && b.y > hole.rimY + R * 0.6) {
    b.x = hole.cupX;
    b.y = hole.rimY + CUP_DEPTH - R;
    b.vx = b.vy = 0;
    return "sunk";
  }
  if (touching && Math.hypot(b.vx, b.vy) < 9) b.rest += dt;
  else b.rest = 0;
  if (b.rest > 0.25 || b.t > 45) {
    b.vx = b.vy = 0;
    return "rest";
  }
  return "move";
}

const FIXED = 1 / 240;

function newBall(x: number, y: number, club: Club, angle: number, power: number): Ball {
  const { vx, vy } = launch(club, angle, power);
  return { x, y, vx, vy, club, firstImpact: true, rest: 0, t: 0 };
}

/** Plays a shot to the end without drawing it. */
export function simulateShot(hole: Hole, x: number, y: number, club: Club, angle: number, power: number) {
  const b = newBall(x, y, club, angle, power);
  for (let i = 0; i < 45 * 240 + 10; i++) {
    const r = stepBall(hole, b, FIXED);
    if (r !== "move") return { result: r, x: b.x, y: b.y };
  }
  return { result: "rest" as const, x: b.x, y: b.y };
}

// ---------- the bot ----------

/**
 * How the bot falls short, per level. It plans with the real physics, so every level has to be held
 * back on purpose: it looks at fewer options, settles for a shot that is merely "close enough",
 * and then mis-hits it.
 *   slack   — any candidate finishing within this share of the remaining distance of the best one may be chosen
 *   refine  — whether it fine-tunes the chosen shot
 *   clubs   — how many clubs it considers
 *   angle/power — aim error (radians, and fraction of power) added at the swing
 */
export const BOT_SKILL: Record<Difficulty, { slack: number; refine: boolean; clubs: number; angle: number; power: number }> = {
  easy: { slack: 0.45, refine: false, clubs: 1, angle: (9 * Math.PI) / 180, power: 0.2 },
  medium: { slack: 0.35, refine: false, clubs: 2, angle: (8.5 * Math.PI) / 180, power: 0.19 },
  hard: { slack: 0.2, refine: false, clubs: 3, angle: (6.5 * Math.PI) / 180, power: 0.14 }
};

type Plan = { club: Club; angle: number; power: number; cost: number };

/**
 * Searches club, launch angle and power by simulating each candidate on the real terrain, then picks
 * one of the "good enough" candidates for the level. A generator so the search can be spread over
 * frames.
 */
export function* planShot(hole: Hole, x: number, y: number, level: Difficulty = "medium", rand: () => number = Math.random): Generator<void, Plan> {
  const skill = BOT_SKILL[level];
  const dist = Math.abs(hole.cupX - x);
  const dir = hole.cupX >= x ? 1 : -1;
  const toward = (elev: number) => (dir > 0 ? -elev : -Math.PI + elev);
  const first = suggestClub(hole.cupX - x);
  const order: Club[] = ["driver", "iron", "wedge", "putter"];
  const fi = order.indexOf(first);
  // The club for the distance, then one longer, then one shorter.
  const preferred = Array.from(new Set([first, order[Math.max(0, fi - 1)], order[Math.min(3, fi + 1)]]));
  // Shots that finish near either end of the hole are one mis-hit from out of bounds; avoid them.
  const cost = (r: ReturnType<typeof simulateShot>) =>
    r.result === "sunk" ? 0 : r.result === "oob" ? 5000 : Math.abs(r.x - hole.cupX) + (r.x < 120 || r.x > hole.width - 120 ? 400 : 0);

  const POWERS = 24;
  const tried: Plan[] = [];
  let n = 0;
  function* search(clubs: Club[]): Generator<void, void> {
    for (const club of clubs) {
      const elevs = club === "putter" ? [0, 0.05, 0.1] : [12, 20, 28, 36, 44, 52, 60, 68].map((d) => (d * Math.PI) / 180);
      for (const e of elevs) {
        const row: number[] = [];
        for (let i = 0; i < POWERS; i++) {
          row.push(cost(simulateShot(hole, x, y, club, toward(e), 0.06 + i * 0.04)));
          if (++n % 12 === 0) yield;
        }
        // Judge each shot with its neighbours too, so it prefers shots that forgive a mis-hit.
        for (let i = 0; i < POWERS; i++) {
          const near = [row[i], row[Math.max(0, i - 1)], row[Math.min(POWERS - 1, i + 1)]];
          tried.push({ club, angle: toward(e), power: 0.06 + i * 0.04, cost: row[i] * 0.5 + ((near[1] + near[2]) / 2) * 0.5 });
        }
      }
    }
  }
  yield* search(preferred.slice(0, skill.clubs));
  // Stuck (in a crater, say)? Then any club will do.
  if (Math.min(...tried.map((t) => t.cost)) > dist * 0.85) yield* search(order.filter((c) => !preferred.slice(0, skill.clubs).includes(c)));

  const bestCost = Math.min(...tried.map((t) => t.cost));
  const slack = Math.max(4, skill.slack * dist);
  const okay = tried.filter((t) => t.cost <= bestCost + slack);
  let pick = okay[Math.floor(rand() * okay.length)];

  if (skill.refine) {
    const base = pick;
    let bestRaw = Infinity;
    for (let da = -3; da <= 3; da++) {
      for (let dp = -0.02; dp <= 0.0201; dp += 0.005) {
        const angle = base.angle + (da * 0.75 * Math.PI) / 180;
        const power = Math.max(0.02, Math.min(1, base.power + dp));
        const c = cost(simulateShot(hole, x, y, base.club, angle, power));
        // Only take a refinement that isn't a knife-edge: its slightly harder twin must also hold up.
        if (c < bestRaw && c < 5000) {
          const twin = cost(simulateShot(hole, x, y, base.club, angle, Math.min(1, power * 1.06)));
          if (twin < 5000) {
            bestRaw = c;
            pick = { club: base.club, angle, power, cost: c };
          }
        }
        if (++n % 12 === 0) yield;
      }
    }
  }
  return pick;
}

function gauss() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ---------- the game ----------

type Player = {
  label: string;
  bot: boolean;
  color: string;
  visor: string;
  ball: Ball;
  lastRest: { x: number; y: number };
  strokes: number;
  holed: boolean;
  results: HoleResult[];
  trail: { x: number; y: number }[];
};

export function createGolf(canvas: HTMLCanvasElement, seed: string, onHud: (hud: Hud) => void) {
  const ctx = canvas.getContext("2d")!;
  const course = makeCourse(seed);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const starRng = mulberry32(hashSeed(seed + "stars"));
  const stars = Array.from({ length: 220 }, () => ({ x: starRng(), y: starRng(), s: starRng() * 1.4 + 0.3, tw: starRng() * 6.28 }));

  let mode: Mode = "solo";
  let difficulty: Difficulty = "medium";
  let holeIndex = 0;
  let hole = course[0];
  let phase: Phase = "aim";
  let club: Club = "driver";
  let players: Player[] = [];
  let turn = 0;
  let lastHole: HoleSummary | null = null;
  let fastForward = false;
  let inputOn = false;
  let message: { text: string; until: number } | null = null;

  // Bot turn state.
  let botStatus: Hud["botStatus"] = null;
  let botSearch: Generator<void, Plan> | null = null;
  let botPlan: Plan | null = null;
  let botSwingAt = 0;

  // Aim state for whoever is up. Keyboard edits angle/power directly.
  let aiming = false;
  let dragStart = { x: 0, y: 0 };
  let aim = { angle: -Math.PI / 4, power: 0 };
  let facing = 1;

  // Camera
  let w = 0;
  let h = 0;
  let dpr = 1;
  let scale = 1;
  let camX = 0;

  const active = () => players[turn];
  const human = () => players[0];

  function makePlayers() {
    const restBall = (): Ball => ({ x: TEE_X, y: 0, vx: 0, vy: 0, club: "driver", firstImpact: true, rest: 0, t: 0 });
    const list: Player[] = [
      { label: "You", bot: false, color: "#ffffff", visor: "#d6a74a", ball: restBall(), lastRest: { x: TEE_X, y: 0 }, strokes: 0, holed: false, results: [], trail: [] }
    ];
    if (mode === "bot")
      list.push({ label: "Bot", bot: true, color: "#f0b45b", visor: "#5fd0c0", ball: restBall(), lastRest: { x: TEE_X, y: 0 }, strokes: 0, holed: false, results: [], trail: [] });
    return list;
  }

  function resetHole() {
    hole = course[holeIndex];
    phase = "aim";
    for (const p of players) {
      p.ball.x = TEE_X;
      p.ball.y = groundAt(hole, TEE_X) - R;
      p.ball.vx = p.ball.vy = 0;
      p.lastRest = { x: p.ball.x, y: p.ball.y };
      p.strokes = 0;
      p.holed = false;
      p.trail = [];
    }
    turn = 0;
    beginTurn();
    camX = targetCam();
  }

  function emit() {
    const me = human();
    onHud({
      phase,
      mode,
      hole: holeIndex + 1,
      par: hole.par,
      turn,
      botStatus,
      club,
      toPin: Math.round(Math.abs(hole.cupX - (active()?.ball.x ?? TEE_X)) / 10),
      fastForward,
      players: players.map((p) => ({
        label: p.label,
        strokes: p.strokes,
        holed: p.holed,
        total: p.results.reduce((s, r) => s + r.points, 0),
        strokeTotal: p.results.reduce((s, r) => s + r.strokes, 0),
        results: p.results.slice()
      })),
      lastHole,
      strokes: me.strokes,
      total: me.results.reduce((s, r) => s + r.points, 0),
      results: me.results.slice()
    });
  }

  function flash(text: string) {
    message = { text, until: performance.now() + 1800 };
  }

  // ---- coordinates ----
  const viewW = () => w / scale;
  const toScreenX = (x: number) => (x - camX) * scale;
  const toScreenY = (y: number) => h - (WORLD_H - y) * scale;

  function targetCam() {
    const vw = viewW();
    if (hole.width <= vw) return (hole.width - vw) / 2;
    const b = active()?.ball ?? { x: TEE_X };
    const lead = phase === "aim" ? Math.sign(hole.cupX - b.x) * vw * 0.12 : 0;
    return Math.min(Math.max(b.x + lead - vw / 2, 0), hole.width - vw);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    scale = Math.max(Math.min(h / WORLD_H, w / 1100), 0.42);
    camX = targetCam();
  }

  // ---- turns ----

  /** Golf order: whoever is farthest from the pin plays next. You break ties. */
  function pickTurn() {
    let next = -1;
    let far = -1;
    players.forEach((p, i) => {
      if (p.holed) return;
      const d = Math.abs(hole.cupX - p.ball.x);
      if (d > far + 0.5) {
        far = d;
        next = i;
      }
    });
    return next;
  }

  function beginTurn() {
    const next = pickTurn();
    if (next < 0) {
      finishHole();
      return;
    }
    turn = next;
    const p = active();
    phase = "aim";
    fastForward = false;
    facing = hole.cupX >= p.ball.x ? 1 : -1;
    club = suggestClub(hole.cupX - p.ball.x);
    aim = { angle: club === "putter" ? (facing > 0 ? 0 : -Math.PI) : facing > 0 ? -Math.PI / 4 : (-3 * Math.PI) / 4, power: 0 };
    if (p.bot) {
      botStatus = "thinking";
      botSearch = planShot(hole, p.ball.x, p.ball.y, difficulty);
      botPlan = null;
      botSwingAt = performance.now() + 450; // a beat, so the turn change reads
    } else botStatus = null;
    emit();
  }

  function shoot() {
    const p = active();
    if (phase !== "aim" || aim.power < 0.04) return;
    const b = newBall(p.ball.x, p.ball.y, club, aim.angle, aim.power);
    p.lastRest = { x: p.ball.x, y: p.ball.y };
    p.ball = b;
    p.strokes++;
    p.trail = [];
    phase = "flight";
    aiming = false;
    if (p.bot) botStatus = null;
    emit();
  }

  function finishHole() {
    const rows = players.map((p) => {
      const points = holePoints(hole.par, p.strokes);
      p.results.push({ par: hole.par, strokes: p.strokes, points });
      return { label: p.label, strokes: p.strokes, points, name: p.strokes > MAX_STROKES ? "Picked up" : scoreName(hole.par, p.strokes) };
    });
    lastHole = { par: hole.par, rows };
    phase = holeIndex === HOLES - 1 ? "done" : "holed";
    fastForward = false;
    botStatus = null;
    emit();
  }

  function endShot(result: StepResult) {
    const p = active();
    p.ball.vx = p.ball.vy = 0;
    if (result === "sunk") {
      p.holed = true;
      if (mode === "bot") flash(`${p.label === "You" ? "You" : "The bot"} holed out in ${p.strokes}.`);
    } else if (result === "oob") {
      p.strokes++;
      flash(`${p.bot ? "Bot: out" : "Out"} of bounds. One stroke penalty.`);
      p.ball.x = p.lastRest.x;
      p.ball.y = p.lastRest.y;
    }
    if (!p.holed && p.strokes >= MAX_STROKES) {
      flash(`${p.bot ? "The bot picks" : "Stroke limit. Picking"} up.`);
      p.strokes = MAX_STROKES + 1;
      p.holed = true;
    }
    beginTurn();
  }

  // ---- input ----
  function setAimFromDrag(sx: number, sy: number) {
    // Measured in screen pixels so a full swing feels the same on a phone and a monitor.
    const dx = dragStart.x - sx;
    const dy = dragStart.y - sy;
    const len = Math.hypot(dx, dy);
    const maxDrag = Math.min(280, Math.max(150, 0.42 * Math.min(w, h)));
    aim.power = Math.min(1, len / maxDrag);
    if (len > 2) aim.angle = Math.atan2(dy, dx);
    facing = Math.cos(aim.angle) >= 0 ? 1 : -1;
  }

  function pointerPos(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  const humanAiming = () => phase === "aim" && !active().bot;

  const onDown = (e: PointerEvent) => {
    if (!inputOn) return;
    if (phase === "flight") {
      fastForward = !fastForward;
      emit();
      return;
    }
    if (!humanAiming()) return;
    canvas.setPointerCapture(e.pointerId);
    aiming = true;
    dragStart = pointerPos(e);
    aim.power = 0;
  };
  const onMove = (e: PointerEvent) => {
    if (!aiming) return;
    const p = pointerPos(e);
    setAimFromDrag(p.x, p.y);
  };
  const onUp = (e: PointerEvent) => {
    if (!aiming) return;
    aiming = false;
    const p = pointerPos(e);
    setAimFromDrag(p.x, p.y);
    if (aim.power < 0.04) {
      aim.power = 0;
      return;
    }
    shoot();
  };
  const onCancel = () => {
    aiming = false;
    if (humanAiming()) aim.power = 0;
  };

  const onKey = (e: KeyboardEvent) => {
    if (!inputOn) return;
    const target = e.target as HTMLElement | null;
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
    if (target && /^(BUTTON|A)$/.test(target.tagName) && (e.key === " " || e.key === "Enter")) return;
    if (document.querySelector("dialog[open]")) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (phase === "flight" && (e.key === "f" || e.key === "F" || e.key === " ")) {
      e.preventDefault();
      fastForward = !fastForward;
      emit();
      return;
    }
    if (!humanAiming()) return;
    const clubKey = CLUBS.find((c) => c.key === e.key);
    if (clubKey) {
      setClub(clubKey.id);
      return;
    }
    const stepA = e.shiftKey ? 0.01 : 0.035;
    if (e.key === "ArrowLeft") aim.angle -= stepA * (Math.cos(aim.angle) >= 0 ? 1 : -1);
    else if (e.key === "ArrowRight") aim.angle += stepA * (Math.cos(aim.angle) >= 0 ? 1 : -1);
    else if (e.key === "ArrowUp") aim.power = Math.min(1, aim.power + (e.shiftKey ? 0.01 : 0.04));
    else if (e.key === "ArrowDown") aim.power = Math.max(0, aim.power - (e.shiftKey ? 0.01 : 0.04));
    else if (e.key === "a" || e.key === "A") aim.angle = Math.PI - aim.angle; // flip direction
    else if (e.key === " " || e.key === "Enter") shoot();
    else return;
    e.preventDefault();
    facing = Math.cos(aim.angle) >= 0 ? 1 : -1;
  };

  // ---- bot ----
  function runBot(t: number) {
    const p = active();
    if (phase !== "aim" || !p?.bot) return;
    if (botSearch) {
      const until = performance.now() + 8; // a slice of each frame
      while (performance.now() < until) {
        const r = botSearch.next();
        if (r.done) {
          const noise = BOT_SKILL[difficulty];
          botPlan = {
            ...r.value,
            angle: r.value.angle + gauss() * noise.angle,
            power: Math.max(0.03, Math.min(1, r.value.power * (1 + gauss() * noise.power)))
          };
          botSearch = null;
          botSwingAt = Math.max(botSwingAt, t) + 900;
          club = botPlan.club;
          aim.angle = botPlan.angle;
          aim.power = 0;
          facing = Math.cos(aim.angle) >= 0 ? 1 : -1;
          botStatus = "swinging";
          emit();
          break;
        }
      }
      return;
    }
    if (botPlan) {
      // Wind up the swing on screen, then hit.
      const left = botSwingAt - t;
      aim.power = botPlan.power * Math.min(1, Math.max(0, 1 - left / 800));
      if (left <= 0) {
        aim.power = botPlan.power;
        botPlan = null;
        shoot();
      }
    }
  }

  // ---- drawing ----
  function drawSky(t: number) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#03040a");
    g.addColorStop(1, "#0c1222");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const par = camX * scale * 0.15;
    for (const st of stars) {
      const sx = (((st.x * w * 1.6 - par) % (w * 1.6)) + w * 1.6) % (w * 1.6);
      if (sx > w) continue;
      ctx.globalAlpha = reduceMotion ? 0.8 : 0.6 + 0.4 * Math.sin(t / 900 + st.tw);
      ctx.fillStyle = "#e8ecf5";
      ctx.fillRect(sx, st.y * h * 0.75, st.s, st.s);
    }
    ctx.globalAlpha = 1;

    // Earth, low in the sky.
    const er = Math.max(18, Math.min(w, h) * 0.055);
    const ex = w * 0.78 - par * 0.2;
    const ey = h * 0.16;
    const eg = ctx.createRadialGradient(ex - er * 0.35, ey - er * 0.35, er * 0.1, ex, ey, er);
    eg.addColorStop(0, "#9cc0ff");
    eg.addColorStop(0.55, "#3b6fd1");
    eg.addColorStop(1, "#14295c");
    ctx.fillStyle = eg;
    ctx.beginPath();
    ctx.arc(ex, ey, er, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(220,235,220,0.55)";
    ctx.beginPath();
    ctx.ellipse(ex - er * 0.2, ey - er * 0.1, er * 0.35, er * 0.22, 0.6, 0, Math.PI * 2);
    ctx.ellipse(ex + er * 0.35, ey + er * 0.35, er * 0.22, er * 0.14, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(3,4,10,0.55)";
    ctx.beginPath();
    ctx.arc(ex, ey, er, -Math.PI / 2.4, Math.PI - Math.PI / 2.4);
    ctx.fill();
  }

  function drawTerrain() {
    const i0 = Math.max(0, Math.floor(camX / STEP) - 2);
    const i1 = Math.min(hole.ys.length - 1, Math.ceil((camX + viewW()) / STEP) + 2);

    ctx.beginPath();
    ctx.moveTo(toScreenX(i0 * STEP), h);
    for (let i = i0; i <= i1; i++) ctx.lineTo(toScreenX(i * STEP), toScreenY(hole.ys[i]));
    ctx.lineTo(toScreenX(i1 * STEP), h);
    ctx.closePath();
    const g = ctx.createLinearGradient(0, toScreenY(450), 0, h);
    g.addColorStop(0, "#4a4d54");
    g.addColorStop(1, "#1c1e23");
    ctx.fillStyle = g;
    ctx.fill();

    // Surface strip, coloured by material.
    const colors = ["#b8b2a4", "#6b717b", "#d9dde3"];
    const widths = [4, 3, 3.5];
    let start = i0;
    for (let i = i0 + 1; i <= i1 + 1; i++) {
      if (i <= i1 && hole.kinds[i] === hole.kinds[start] && i - start < 400) continue;
      const k = hole.kinds[start];
      ctx.beginPath();
      for (let j = start; j <= Math.min(i, i1); j++) {
        const sx = toScreenX(j * STEP);
        const sy = toScreenY(hole.ys[j]) + (widths[k] * scale) / 2;
        if (j === start) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = colors[k];
      ctx.lineWidth = Math.max(2, widths[k] * scale * 1.4);
      ctx.lineJoin = "round";
      ctx.stroke();
      start = i;
    }

    // Cup and flag.
    const cx = toScreenX(hole.cupX);
    const rimY = toScreenY(hole.rimY);
    ctx.fillStyle = "#07080c";
    ctx.fillRect(cx - CUP_HALF * scale, rimY, CUP_HALF * 2 * scale, CUP_DEPTH * scale);
    const poleTop = rimY - 120 * scale;
    ctx.strokeStyle = "#e6e8ec";
    ctx.lineWidth = Math.max(1.5, 2 * scale);
    ctx.beginPath();
    ctx.moveTo(cx, rimY + CUP_DEPTH * scale - 2);
    ctx.lineTo(cx, poleTop);
    ctx.stroke();
    ctx.fillStyle = "#86a8f6";
    ctx.beginPath();
    ctx.moveTo(cx, poleTop);
    ctx.lineTo(cx + 48 * scale, poleTop + 14 * scale);
    ctx.lineTo(cx, poleTop + 28 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#03040a";
    ctx.font = `600 ${Math.max(9, 15 * scale)}px ui-monospace, Menlo, monospace`;
    ctx.fillText(String(holeIndex + 1), cx + 10 * scale, poleTop + 19 * scale);
  }

  function drawAstronaut(p: Player) {
    const bx = toScreenX(p.ball.x - facing * 16);
    const gy = toScreenY(groundAt(hole, p.ball.x - facing * 16));
    const sc = Math.max(0.55, scale);
    ctx.save();
    ctx.translate(bx, gy);
    ctx.scale(facing * sc, sc);
    const suit = p.bot ? "#e8d8bd" : "#f1f2f5";
    ctx.fillStyle = p.bot ? "#d9c8ab" : "#e9ebef";
    ctx.fillRect(-9, -22, 7, 22);
    ctx.fillRect(2, -22, 7, 22);
    ctx.fillStyle = p.bot ? "#bba98b" : "#c9ccd3";
    ctx.fillRect(-16, -46, 8, 20);
    ctx.fillStyle = suit;
    ctx.fillRect(-11, -50, 22, 30);
    ctx.beginPath();
    ctx.arc(0, -60, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.visor;
    ctx.beginPath();
    ctx.ellipse(4, -60, 7, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    if (p.bot) {
      // antenna
      ctx.strokeStyle = suit;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-4, -71);
      ctx.lineTo(-8, -82);
      ctx.stroke();
      ctx.fillStyle = "#f0b45b";
      ctx.fillRect(-10, -85, 4, 4);
    }
    const back = aim.power * 1.9;
    ctx.strokeStyle = "#9aa0a8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(4, -38);
    const ang = Math.PI / 2 - 0.35 + back;
    ctx.lineTo(4 + Math.cos(ang) * 34, -38 + Math.sin(ang) * 34);
    ctx.stroke();
    ctx.restore();
  }

  function drawBall(p: Player, isActive: boolean) {
    if (p.holed && !isActive) return;
    ctx.fillStyle = p.bot ? "rgba(240,180,91,0.4)" : "rgba(230,234,242,0.35)";
    for (let i = 0; i < p.trail.length; i += 3) {
      const q = p.trail[i];
      ctx.fillRect(toScreenX(q.x) - 1, toScreenY(q.y) - 1, 2, 2);
    }
    const sx = toScreenX(p.ball.x);
    const sy = toScreenY(p.ball.y);
    const r = Math.max(3, R * scale);
    if (sy < -r) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(sx, 6);
      ctx.lineTo(sx - 6, 16);
      ctx.lineTo(sx + 6, 16);
      ctx.closePath();
      ctx.fill();
      return;
    }
    if (isActive) {
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3);
      glow.addColorStop(0, p.bot ? "rgba(240,180,91,0.4)" : "rgba(255,255,255,0.35)");
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(sx - r * 3, sy - r * 3, r * 6, r * 6);
    }
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
    if (mode === "bot" && !isActive) {
      ctx.font = "10px ui-monospace, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = p.bot ? "rgba(240,180,91,0.85)" : "rgba(230,234,242,0.8)";
      ctx.fillText(p.label, sx, sy - r - 6);
      ctx.textAlign = "left";
    }
  }

  function drawAim() {
    const p = active();
    if (phase !== "aim" || aim.power <= 0 || !p) return;
    const { vx, vy } = launch(club, aim.angle, aim.power);
    let x = p.ball.x;
    let y = p.ball.y;
    let px = vx;
    let py = vy;
    const dt = 1 / 30;
    ctx.fillStyle = p.bot ? "#f0b45b" : "#86a8f6";
    for (let i = 0; i < 22; i++) {
      py += G * dt;
      x += px * dt;
      y += py * dt;
      if (y > groundAt(hole, x)) break;
      ctx.globalAlpha = 1 - i / 22;
      ctx.beginPath();
      ctx.arc(toScreenX(x), toScreenY(y), Math.max(1.6, 2.4 * scale), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const bx = toScreenX(p.ball.x) - 30;
    const by = toScreenY(p.ball.y) + 18;
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(bx, by, 60, 4);
    ctx.fillStyle = p.bot ? "#f0b45b" : aim.power > 0.95 ? "#f0b45b" : "#86a8f6";
    ctx.fillRect(bx, by, 60 * aim.power, 4);
    ctx.font = "11px ui-monospace, Menlo, monospace";
    ctx.fillStyle = "rgba(230,234,242,0.8)";
    ctx.fillText(`${Math.round(aim.power * 100)}%`, bx + 64, by + 5);
  }

  function drawPinMarker() {
    const cx = toScreenX(hole.cupX);
    if (cx >= 0 && cx <= w) return;
    const right = cx > w;
    const x = right ? w - 14 : 14;
    const y = Math.min(h - 40, Math.max(70, toScreenY(hole.rimY) - 40));
    ctx.fillStyle = "#86a8f6";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (right ? -12 : 12), y - 8);
    ctx.lineTo(x + (right ? -12 : 12), y + 8);
    ctx.closePath();
    ctx.fill();
    ctx.font = "11px ui-monospace, Menlo, monospace";
    ctx.textAlign = right ? "right" : "left";
    ctx.fillText(`${Math.round(Math.abs(hole.cupX - (active()?.ball.x ?? TEE_X)) / 10)} m`, x + (right ? -16 : 16), y + 4);
    ctx.textAlign = "left";
  }

  function drawMessage(t: number) {
    if (!message || t > message.until) return;
    ctx.font = "13px ui-monospace, Menlo, monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(240,180,91,0.95)";
    ctx.fillText(message.text, w / 2, Math.max(120, h * 0.28));
    ctx.textAlign = "left";
  }

  // ---- loop ----
  let raf = 0;
  let last = performance.now();
  let acc = 0;
  let lastEmit = 0;

  function frame(t: number) {
    const dt = Math.min(0.05, (t - last) / 1000);
    last = t;

    if (players.length) {
      if (phase === "flight") {
        const p = active();
        acc += dt * (fastForward ? 4 : 1);
        let guard = 0;
        while (acc >= FIXED && phase === "flight" && guard++ < 1000) {
          const r = stepBall(hole, p.ball, FIXED);
          acc -= FIXED;
          if (r !== "move") {
            endShot(r);
            break;
          }
        }
        if (phase === "flight") {
          p.trail.push({ x: p.ball.x, y: p.ball.y });
          if (p.trail.length > 240) p.trail.shift();
          if (t - lastEmit > 250) {
            lastEmit = t;
            emit();
          }
        }
      } else acc = 0;
      runBot(t);

      const target = targetCam();
      camX += (target - camX) * Math.min(1, dt * (phase === "flight" ? 5 : 3));
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawSky(t);
    if (players.length) {
      drawTerrain();
      players.forEach((p, i) => i !== turn && drawBall(p, false));
      if (phase === "aim" && active()) drawAstronaut(active());
      drawAim();
      if (active()) drawBall(active(), true);
      drawPinMarker();
      drawMessage(t);
    }
    raf = requestAnimationFrame(frame);
  }

  function setClub(c: Club) {
    if (!humanAiming()) return;
    club = c;
    if (c === "putter") aim.angle = facing > 0 ? 0 : -Math.PI;
    emit();
  }

  function newRound(m: Mode, d: Difficulty) {
    mode = m;
    difficulty = d;
    holeIndex = 0;
    lastHole = null;
    players = makePlayers();
    resetHole();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onCancel);
  window.addEventListener("keydown", onKey);
  resize();
  newRound("solo", "medium"); // shows the first hole behind the intro card
  raf = requestAnimationFrame(frame);

  return {
    /** Starts a round. Called from the intro card. */
    start(m: Mode = "solo", d: Difficulty = "medium") {
      newRound(m, d);
      inputOn = true;
    },
    /** Stops reacting to input, e.g. while the intro card is back up. */
    pause() {
      inputOn = false;
    },
    setClub,
    nextHole() {
      if (phase !== "holed") return;
      holeIndex++;
      lastHole = null;
      resetHole();
    },
    restart() {
      newRound(mode, difficulty);
    },
    toggleFastForward() {
      if (phase !== "flight") return;
      fastForward = !fastForward;
      emit();
    },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("keydown", onKey);
    }
  };
}
