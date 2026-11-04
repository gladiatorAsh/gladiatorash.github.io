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

export type HoleResult = { par: number; strokes: number; points: number };
export type Hud = {
  phase: Phase;
  hole: number; // 1-based
  par: number;
  strokes: number;
  total: number;
  club: Club;
  toPin: number; // metres
  fastForward: boolean;
  results: HoleResult[];
  lastResult: (HoleResult & { name: string }) | null;
};

type Hole = { width: number; ys: Float32Array; kinds: Uint8Array; cupX: number; rimY: number; par: number };

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

// ---------- the game ----------

export function createGolf(canvas: HTMLCanvasElement, seed: string, onHud: (hud: Hud) => void) {
  const ctx = canvas.getContext("2d")!;
  const course = makeCourse(seed);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const starRng = mulberry32(hashSeed(seed + "stars"));
  const stars = Array.from({ length: 220 }, () => ({ x: starRng(), y: starRng(), s: starRng() * 1.4 + 0.3, tw: starRng() * 6.28 }));

  let holeIndex = 0;
  let hole = course[0];
  let phase: Phase = "aim";
  let club: Club = "driver";
  let strokes = 0;
  const results: HoleResult[] = [];
  let lastResult: Hud["lastResult"] = null;
  let fastForward = false;
  let inputOn = false;

  const ball = { x: TEE_X, y: 0, vx: 0, vy: 0 };
  let lastRest = { x: TEE_X, y: 0 };
  let restTimer = 0;
  let flightTime = 0;
  let firstImpact = true;
  let trail: { x: number; y: number }[] = [];
  let message: { text: string; until: number } | null = null;

  // Aim state. Drag vector in world units; keyboard edits angle/power directly.
  let aiming = false;
  let dragStart = { x: 0, y: 0 };
  let aim = { angle: -Math.PI / 4, power: 0 }; // angle of the launch direction, power 0..1
  let facing = 1;

  // Camera
  let w = 0;
  let h = 0;
  let dpr = 1;
  let scale = 1;
  let camX = 0;

  function placeOnGround(x: number) {
    ball.x = x;
    ball.y = groundAt(hole, x) - R;
    ball.vx = 0;
    ball.vy = 0;
  }

  function resetHole() {
    hole = course[holeIndex];
    strokes = 0;
    phase = "aim";
    placeOnGround(TEE_X);
    lastRest = { x: ball.x, y: ball.y };
    trail = [];
    facing = 1;
    club = suggestClub(hole.cupX - ball.x);
    aim = { angle: club === "putter" ? 0 : -Math.PI / 4, power: 0 };
    camX = targetCam();
    emit();
  }

  function emit() {
    onHud({
      phase,
      hole: holeIndex + 1,
      par: hole.par,
      strokes,
      total: results.reduce((s, r) => s + r.points, 0),
      club,
      toPin: Math.round(Math.abs(hole.cupX - ball.x) / 10),
      fastForward,
      results: results.slice(),
      lastResult
    });
  }

  function flash(text: string) {
    message = { text, until: performance.now() + 1800 };
  }

  // ---- coordinates ----
  const viewW = () => w / scale;
  const toScreenX = (x: number) => (x - camX) * scale;
  const toScreenY = (y: number) => h - (WORLD_H - y) * scale;
  const toWorld = (sx: number, sy: number) => ({ x: sx / scale + camX, y: WORLD_H - (h - sy) / scale });

  function targetCam() {
    const vw = viewW();
    if (hole.width <= vw) return (hole.width - vw) / 2;
    const lead = phase === "aim" ? Math.sign(hole.cupX - ball.x) * vw * 0.12 : 0;
    return Math.min(Math.max(ball.x + lead - vw / 2, 0), hole.width - vw);
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

  // ---- shooting ----
  function launchVelocity() {
    let angle = aim.angle;
    if (club === "putter") {
      // Keep putts close to the ground, either direction.
      const left = Math.cos(angle) < 0;
      const lift = left ? -(Math.PI + angle) : -angle;
      const clamped = Math.max(-0.2, Math.min(PUTTER_MAX_LIFT, lift));
      angle = left ? -Math.PI + clamped : -clamped;
    }
    const v = CLUB_SPEED[club] * aim.power;
    return { vx: Math.cos(angle) * v, vy: Math.sin(angle) * v, angle };
  }

  function shoot() {
    if (phase !== "aim" || aim.power < 0.04) return;
    const { vx, vy } = launchVelocity();
    ball.vx = vx;
    ball.vy = vy;
    lastRest = { x: ball.x, y: ball.y };
    strokes++;
    phase = "flight";
    restTimer = 0;
    flightTime = 0;
    firstImpact = true;
    trail = [];
    fastForward = false;
    aiming = false;
    emit();
  }

  function finishHole() {
    const points = holePoints(hole.par, strokes);
    const result = { par: hole.par, strokes, points };
    results.push(result);
    lastResult = { ...result, name: scoreName(hole.par, strokes) };
    phase = holeIndex === HOLES - 1 ? "done" : "holed";
    fastForward = false;
    emit();
  }

  function comeToRest() {
    phase = "aim";
    fastForward = false;
    if (strokes >= MAX_STROKES) {
      flash("Stroke limit. Picking up.");
      strokes = MAX_STROKES + 1;
      finishHole();
      return;
    }
    facing = hole.cupX >= ball.x ? 1 : -1;
    club = suggestClub(hole.cupX - ball.x);
    const toward = facing > 0 ? 0 : Math.PI;
    aim = { angle: club === "putter" ? -toward : facing > 0 ? -Math.PI / 4 : (-3 * Math.PI) / 4, power: 0 };
    emit();
  }

  // ---- physics ----
  function collide(dt: number) {
    let contact: { nx: number; ny: number; kind: Surface } | null = null;
    for (let pass = 0; pass < 2; pass++) {
      const i0 = Math.max(0, Math.floor((ball.x - R) / STEP) - 1);
      const i1 = Math.min(hole.ys.length - 2, Math.ceil((ball.x + R) / STEP) + 1);
      let best = 0;
      let bn = { nx: 0, ny: -1 };
      let bk: Surface = 0;
      for (let i = i0; i <= i1; i++) {
        const ax = i * STEP;
        const ay = hole.ys[i];
        const bx = ax + STEP;
        const by = hole.ys[i + 1];
        const ex = bx - ax;
        const ey = by - ay;
        const t = Math.max(0, Math.min(1, ((ball.x - ax) * ex + (ball.y - ay) * ey) / (ex * ex + ey * ey)));
        const qx = ax + ex * t;
        const qy = ay + ey * t;
        let dx = ball.x - qx;
        let dy = ball.y - qy;
        let dist = Math.hypot(dx, dy);
        // Below the surface counts as inside, even when the centre went through.
        const below = ball.y > groundAt(hole, ball.x);
        if (dist < 1e-6 || below) {
          const len = Math.hypot(ex, ey);
          dx = ey / len;
          dy = -ex / len;
          dist = below ? -Math.abs(ball.y - groundAt(hole, ball.x)) : 0;
        } else {
          dx /= dist;
          dy /= dist;
        }
        const pen = R - dist;
        if (pen > best) {
          best = pen;
          bn = { nx: dx, ny: dy };
          bk = hole.kinds[i] as Surface;
        }
      }
      if (best <= 0) break;
      ball.x += bn.nx * best;
      ball.y += bn.ny * best;
      contact = { ...bn, kind: bk };
    }
    if (!contact) return false;

    const { nx, ny, kind } = contact;
    const vn = ball.vx * nx + ball.vy * ny;
    let tx = ball.vx - vn * nx;
    let ty = ball.vy - vn * ny;
    if (vn < -35) {
      const e = RESTITUTION[kind] * (club === "wedge" && firstImpact ? 0.6 : 1);
      const f = Math.min(0.9, IMPACT_FRICTION[kind] + (club === "wedge" && firstImpact ? 0.35 : 0));
      firstImpact = false;
      tx *= 1 - f;
      ty *= 1 - f;
      ball.vx = tx - e * vn * nx;
      ball.vy = ty - e * vn * ny;
    } else {
      // Rolling: drop the normal part, slow down along the surface.
      const s = Math.hypot(tx, ty);
      const ns = Math.max(0, s - ROLL_DECEL[kind] * dt);
      const k = s > 1e-6 ? ns / s : 0;
      ball.vx = tx * k;
      ball.vy = ty * k;
    }
    return true;
  }

  function physics(dt: number) {
    ball.vy += G * dt;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    flightTime += dt;

    if (ball.x < -R * 2 || ball.x > hole.width + R * 2) {
      strokes++;
      flash("Out of bounds. One stroke penalty.");
      ball.x = lastRest.x;
      ball.y = lastRest.y;
      ball.vx = ball.vy = 0;
      comeToRest();
      return;
    }

    const touching = collide(dt);

    if (Math.abs(ball.x - hole.cupX) < CUP_HALF - 1 && ball.y > hole.rimY + R * 0.6) {
      ball.x = hole.cupX;
      ball.y = hole.rimY + CUP_DEPTH - R;
      ball.vx = ball.vy = 0;
      finishHole();
      return;
    }

    const speed = Math.hypot(ball.vx, ball.vy);
    if (touching && speed < 9) restTimer += dt;
    else restTimer = 0;
    if (restTimer > 0.25 || flightTime > 45) {
      ball.vx = ball.vy = 0;
      comeToRest();
    }
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

  const onDown = (e: PointerEvent) => {
    if (!inputOn) return;
    if (phase === "flight") {
      fastForward = !fastForward;
      emit();
      return;
    }
    if (phase !== "aim") return;
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
    aim.power = 0;
  };

  const onKey = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (!inputOn) return;
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
    if (target && /^(BUTTON|A)$/.test(target.tagName) && (e.key === " " || e.key === "Enter")) return;
    if (document.querySelector("dialog[open]")) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const clubKey = CLUBS.find((c) => c.key === e.key);
    if (clubKey && phase === "aim") {
      setClub(clubKey.id);
      return;
    }
    if (phase === "flight" && (e.key === "f" || e.key === " ")) {
      e.preventDefault();
      fastForward = !fastForward;
      emit();
      return;
    }
    if (phase !== "aim") return;
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

  // ---- drawing ----
  function drawSky(t: number) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#03040a");
    g.addColorStop(1, "#0c1222");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const par = camX * scale * 0.15;
    for (const s of stars) {
      const sx = (((s.x * w * 1.6 - par) % (w * 1.6)) + w * 1.6) % (w * 1.6);
      if (sx > w) continue;
      const tw = reduceMotion ? 0.8 : 0.6 + 0.4 * Math.sin(t / 900 + s.tw);
      ctx.globalAlpha = tw;
      ctx.fillStyle = "#e8ecf5";
      ctx.fillRect(sx, s.y * h * 0.75, s.s, s.s);
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
    // Night side
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

  function drawAstronaut() {
    if (phase !== "aim") return;
    const bx = toScreenX(ball.x - facing * 16);
    const gy = toScreenY(groundAt(hole, ball.x - facing * 16));
    const s = Math.max(0.55, scale);
    ctx.save();
    ctx.translate(bx, gy);
    ctx.scale(facing * s, s);
    // legs
    ctx.fillStyle = "#e9ebef";
    ctx.fillRect(-9, -22, 7, 22);
    ctx.fillRect(2, -22, 7, 22);
    // body + backpack
    ctx.fillStyle = "#c9ccd3";
    ctx.fillRect(-16, -46, 8, 20);
    ctx.fillStyle = "#f1f2f5";
    ctx.fillRect(-11, -50, 22, 30);
    // helmet + visor
    ctx.beginPath();
    ctx.arc(0, -60, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d6a74a";
    ctx.beginPath();
    ctx.ellipse(4, -60, 7, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // club: swings back with power
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

  function drawBall() {
    // trail
    ctx.fillStyle = "rgba(230,234,242,0.35)";
    for (let i = 0; i < trail.length; i += 3) {
      const p = trail[i];
      ctx.fillRect(toScreenX(p.x) - 1, toScreenY(p.y) - 1, 2, 2);
    }
    const sx = toScreenX(ball.x);
    const sy = toScreenY(ball.y);
    const r = Math.max(3, R * scale);
    if (sy < -r) {
      // Above the top of the screen: point at it.
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(sx, 6);
      ctx.lineTo(sx - 6, 16);
      ctx.lineTo(sx + 6, 16);
      ctx.closePath();
      ctx.fill();
      return;
    }
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3);
    glow.addColorStop(0, "rgba(255,255,255,0.35)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(sx - r * 3, sy - r * 3, r * 6, r * 6);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawAim() {
    if (phase !== "aim" || aim.power <= 0) return;
    const { vx, vy } = launchVelocity();
    let x = ball.x;
    let y = ball.y;
    let px = vx;
    let py = vy;
    const dt = 1 / 30;
    ctx.fillStyle = "#86a8f6";
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

    // power bar
    const bx = toScreenX(ball.x) - 30;
    const by = toScreenY(ball.y) + 18;
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(bx, by, 60, 4);
    ctx.fillStyle = aim.power > 0.95 ? "#f0b45b" : "#86a8f6";
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
    ctx.fillText(`${Math.round(Math.abs(hole.cupX - ball.x) / 10)} m`, x + (right ? -16 : 16), y + 4);
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
  const FIXED = 1 / 240;

  function frame(t: number) {
    const dt = Math.min(0.05, (t - last) / 1000);
    last = t;

    if (phase === "flight") {
      acc += dt * (fastForward ? 4 : 1);
      let guard = 0;
      while (acc >= FIXED && phase === "flight" && guard++ < 1000) {
        physics(FIXED);
        acc -= FIXED;
      }
      if (phase === "flight") {
        trail.push({ x: ball.x, y: ball.y });
        if (trail.length > 240) trail.shift();
        if (Math.round(t / 250) % 2 === 0) emit();
      }
    } else acc = 0;

    const target = targetCam();
    camX += (target - camX) * Math.min(1, dt * (phase === "flight" ? 5 : 3));

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawSky(t);
    drawTerrain();
    drawAstronaut();
    drawAim();
    drawBall();
    drawPinMarker();
    drawMessage(t);
    raf = requestAnimationFrame(frame);
  }

  function setClub(c: Club) {
    if (phase !== "aim") return;
    club = c;
    if (c === "putter") aim.angle = facing > 0 ? 0 : -Math.PI;
    emit();
  }

  function nextHole() {
    if (phase !== "holed") return;
    holeIndex++;
    lastResult = null;
    resetHole();
  }

  function restart() {
    holeIndex = 0;
    results.length = 0;
    lastResult = null;
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
  resetHole();
  raf = requestAnimationFrame(frame);

  return {
    start() {
      inputOn = true;
    },
    setClub,
    nextHole,
    restart,
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
