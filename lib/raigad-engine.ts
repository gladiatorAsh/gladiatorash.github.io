/**
 * Raigad: Hold the Fort. A small tower-defense engine on a 2D canvas.
 *
 * The map is a stylised plan of Raigad Fort (Maharashtra): the plateau with its walls, the
 * Maha Darwaja (main gate) approach from the south, the Wagh Darwaja (back gate) to the north-east
 * and the Hirkani Buruj cliff on the west, which attackers climb with ropes. Positions are inspired
 * by the real fort, not surveyed.
 *
 * All game logic runs in a fixed 1000 × 640 world. `step()` is pure logic (no canvas), so it can be
 * driven headlessly for balance tests; `createRaigad()` adds rendering and input on top.
 */

export const WORLD_W = 1000;
export const WORLD_H = 640;

type Pt = { x: number; y: number };

// ---------------------------------------------------------------------------------------------
// Map
// ---------------------------------------------------------------------------------------------

export const PLATEAU: Pt[] = [
  { x: 130, y: 170 },
  { x: 205, y: 92 },
  { x: 420, y: 66 },
  { x: 640, y: 76 },
  { x: 840, y: 118 },
  { x: 902, y: 210 },
  { x: 862, y: 322 },
  { x: 762, y: 400 },
  { x: 560, y: 440 },
  { x: 380, y: 432 },
  { x: 250, y: 382 },
  { x: 160, y: 300 }
];

export const THRONE: Pt = { x: 500, y: 230 };

export type PathId = "maha" | "wagh" | "hirkani";

type PathDef = {
  id: PathId;
  name: string;
  pts: Pt[];
  gate: number;
  gateHp: number;
  opensAt: number;
};

const PATH_DEFS: PathDef[] = [
  {
    id: "maha",
    name: "Maha Darwaja",
    // Switchbacks up the southern slope, past Chit and Nana Darwaja, to the main gate.
    pts: [
      { x: 590, y: 700 },
      { x: 585, y: 612 },
      { x: 330, y: 600 },
      { x: 310, y: 548 },
      { x: 640, y: 528 },
      { x: 662, y: 482 },
      { x: 470, y: 470 },
      { x: 470, y: 438 },
      { x: 480, y: 360 },
      { x: 500, y: 250 }
    ],
    gate: 7,
    gateHp: 420,
    opensAt: 1
  },
  {
    id: "wagh",
    name: "Wagh Darwaja",
    pts: [
      { x: 1040, y: 470 },
      { x: 958, y: 430 },
      { x: 990, y: 330 },
      { x: 938, y: 268 },
      { x: 968, y: 190 },
      { x: 872, y: 166 },
      { x: 760, y: 190 },
      { x: 600, y: 225 },
      { x: 512, y: 232 }
    ],
    gate: 5,
    gateHp: 320,
    opensAt: 4
  },
  {
    id: "hirkani",
    name: "Hirkani Buruj",
    // A sheer cliff: no gate, only climbers come this way, and they are slow on the ropes.
    pts: [
      { x: -40, y: 262 },
      { x: 52, y: 270 },
      { x: 96, y: 236 },
      { x: 148, y: 242 },
      { x: 300, y: 236 },
      { x: 488, y: 232 }
    ],
    gate: 3,
    gateHp: 0,
    opensAt: 3
  }
];

type Path = PathDef & { cum: number[]; total: number; gateD: number };

function buildPath(p: PathDef): Path {
  const cum = [0];
  for (let i = 1; i < p.pts.length; i++) cum.push(cum[i - 1] + Math.hypot(p.pts[i].x - p.pts[i - 1].x, p.pts[i].y - p.pts[i - 1].y));
  return { ...p, cum, total: cum[cum.length - 1], gateD: cum[p.gate] };
}

export const PATHS: Record<PathId, Path> = Object.fromEntries(PATH_DEFS.map((p) => [p.id, buildPath(p)])) as Record<PathId, Path>;

function posAt(path: Path, d: number): Pt {
  const { pts, cum } = path;
  if (d <= 0) return { ...pts[0] };
  for (let i = 1; i < pts.length; i++) {
    if (d <= cum[i]) {
      const t = (d - cum[i - 1]) / (cum[i] - cum[i - 1]);
      return {
        x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t,
        y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t
      };
    }
  }
  return { ...pts[pts.length - 1] };
}

/** Bastions you can build on. `opensAt` is the first wave whose route it covers. */
export const SLOTS: (Pt & { name: string })[] = [
  { x: 395, y: 425, name: "Maha Darwaja west buruj" },
  { x: 560, y: 452, name: "Maha Darwaja east buruj" },
  { x: 470, y: 566, name: "Nana Darwaja" },
  { x: 700, y: 572, name: "Chit Darwaja ridge" },
  { x: 250, y: 575, name: "Lower switchback" },
  { x: 720, y: 430, name: "South rampart" },
  { x: 300, y: 395, name: "Shirkai rampart" },
  { x: 210, y: 215, name: "Hirkani Buruj" },
  { x: 225, y: 300, name: "West rampart" },
  { x: 830, y: 250, name: "Wagh Darwaja buruj" },
  { x: 800, y: 150, name: "Bhavani Kada" },
  { x: 900, y: 330, name: "North-east spur" },
  { x: 410, y: 300, name: "Ganga Sagar" },
  { x: 640, y: 290, name: "Jagadishwar" }
];

// ---------------------------------------------------------------------------------------------
// Units
// ---------------------------------------------------------------------------------------------

export type TowerKind = "archer" | "musket" | "cannon";

type TowerLevel = { cost: number; dmg: number; range: number; rate: number };

export const TOWERS: Record<
  TowerKind,
  {
    name: string;
    blurb: string;
    levels: TowerLevel[];
    splash?: number;
    minRange?: number;
    firearm: boolean;
  }
> = {
  archer: {
    name: "Archers",
    blurb: "Cheap and quick. Weak against shields.",
    firearm: false,
    levels: [
      { cost: 60, dmg: 9, range: 125, rate: 0.7 },
      { cost: 70, dmg: 15, range: 130, rate: 0.6 },
      { cost: 110, dmg: 24, range: 140, rate: 0.55 }
    ]
  },
  musket: {
    name: "Toradar",
    blurb: "Matchlock gunners. Pierce armour; damp powder in rain.",
    firearm: true,
    levels: [
      { cost: 90, dmg: 30, range: 145, rate: 1.4 },
      { cost: 90, dmg: 48, range: 150, rate: 1.3 },
      { cost: 130, dmg: 75, range: 160, rate: 1.2 }
    ]
  },
  cannon: {
    name: "Tof",
    blurb: "Bastion cannon. Splash damage, long reach, slow.",
    firearm: true,
    splash: 48,
    minRange: 45,
    levels: [
      { cost: 140, dmg: 40, range: 175, rate: 2.6 },
      { cost: 130, dmg: 66, range: 185, rate: 2.4 },
      { cost: 170, dmg: 100, range: 195, rate: 2.2 }
    ]
  }
};

export type EnemyKind = "pyade" | "shield" | "ladder" | "climber" | "elephant" | "siege" | "boss";

type EnemyDef = {
  name: string;
  hp: number;
  speed: number;
  gold: number;
  gateDps: number;
  heroDmg: number;
  lives: number;
  size: number;
  /** Damage taken multiplier by source. */
  armor: { arrow: number; bullet: number; blast: number };
  color: string;
};

export const ENEMIES: Record<EnemyKind, EnemyDef> = {
  pyade: {
    name: "Infantry",
    hp: 42,
    speed: 38,
    gold: 6,
    gateDps: 5,
    heroDmg: 6,
    lives: 1,
    size: 6,
    armor: { arrow: 1, bullet: 1, blast: 1 },
    color: "#c9473b"
  },
  shield: {
    name: "Shieldmen",
    hp: 80,
    speed: 31,
    gold: 9,
    gateDps: 6,
    heroDmg: 8,
    lives: 1,
    size: 7,
    armor: { arrow: 0.45, bullet: 0.9, blast: 1 },
    color: "#8f3a8a"
  },
  ladder: {
    name: "Ladder squad",
    hp: 58,
    speed: 47,
    gold: 9,
    gateDps: 12,
    heroDmg: 6,
    lives: 1,
    size: 7,
    armor: { arrow: 1, bullet: 1, blast: 1 },
    color: "#d2793a"
  },
  climber: {
    name: "Rope climber",
    hp: 34,
    speed: 24,
    gold: 8,
    gateDps: 0,
    heroDmg: 7,
    lives: 2,
    size: 5,
    armor: { arrow: 1, bullet: 1, blast: 1 },
    color: "#3d3d3d"
  },
  elephant: {
    name: "War elephant",
    hp: 460,
    speed: 19,
    gold: 40,
    gateDps: 42,
    heroDmg: 22,
    lives: 5,
    size: 13,
    armor: { arrow: 0.6, bullet: 0.8, blast: 0.75 },
    color: "#7b7f86"
  },
  siege: {
    name: "Siege cannon",
    hp: 170,
    speed: 17,
    gold: 25,
    gateDps: 0,
    heroDmg: 4,
    lives: 2,
    size: 10,
    armor: { arrow: 0.8, bullet: 1, blast: 1 },
    color: "#5a4632"
  },
  boss: {
    name: "Siege commander",
    hp: 1700,
    speed: 15,
    gold: 150,
    gateDps: 60,
    heroDmg: 30,
    lives: 20,
    size: 15,
    armor: { arrow: 0.6, bullet: 0.85, blast: 0.8 },
    color: "#e2b13c"
  }
};

// ---------------------------------------------------------------------------------------------
// Waves
// ---------------------------------------------------------------------------------------------

type Group = {
  kind: EnemyKind;
  count: number;
  path: PathId;
  every: number;
  delay?: number;
};
export type WaveDef = {
  rain?: boolean;
  night?: boolean;
  note: string;
  groups: Group[];
};

export const WAVES: WaveDef[] = [
  {
    note: "Scouts test the main approach. Put archers over the Maha Darwaja.",
    groups: [{ kind: "pyade", count: 8, path: "maha", every: 1.5 }]
  },
  {
    note: "Shieldmen shrug off arrows. Toradar gunners pierce them.",
    groups: [
      { kind: "pyade", count: 10, path: "maha", every: 1.2 },
      { kind: "shield", count: 4, path: "maha", every: 2, delay: 6 }
    ]
  },
  {
    night: true,
    note: "Night. Climbers are on the Hirkani cliff, and there is no gate on that side. Light torches or lose range.",
    groups: [
      { kind: "pyade", count: 10, path: "maha", every: 1.2 },
      { kind: "climber", count: 5, path: "hirkani", every: 2.5, delay: 4 }
    ]
  },
  {
    rain: true,
    note: "Monsoon. Damp powder slows guns and cannon, and mud slows everyone. The Wagh Darwaja is under attack too.",
    groups: [
      { kind: "pyade", count: 8, path: "maha", every: 1.3 },
      { kind: "pyade", count: 8, path: "wagh", every: 1.3, delay: 3 },
      { kind: "ladder", count: 5, path: "maha", every: 1.6, delay: 10 }
    ]
  },
  {
    note: "A war elephant is coming for the main gate. Keep the doors standing.",
    groups: [
      { kind: "shield", count: 6, path: "maha", every: 1.6 },
      { kind: "shield", count: 6, path: "wagh", every: 1.6, delay: 2 },
      { kind: "elephant", count: 1, path: "maha", every: 1, delay: 12 }
    ]
  },
  {
    night: true,
    note: "Siege cannon stop out of reach and shell the gate. Hunt them with your own cannon.",
    groups: [
      { kind: "siege", count: 2, path: "maha", every: 6 },
      { kind: "pyade", count: 12, path: "maha", every: 1, delay: 4 },
      { kind: "climber", count: 6, path: "hirkani", every: 2, delay: 8 }
    ]
  },
  {
    rain: true,
    note: "Elephants at the back gate, ladders at the front.",
    groups: [
      { kind: "elephant", count: 2, path: "wagh", every: 7 },
      { kind: "ladder", count: 10, path: "maha", every: 1.1, delay: 3 },
      { kind: "shield", count: 8, path: "maha", every: 1.5, delay: 12 }
    ]
  },
  {
    night: true,
    rain: true,
    note: "A dark, wet night. Every route at once.",
    groups: [
      { kind: "climber", count: 8, path: "hirkani", every: 1.8 },
      { kind: "pyade", count: 14, path: "maha", every: 0.9, delay: 2 },
      { kind: "pyade", count: 10, path: "wagh", every: 1, delay: 4 },
      { kind: "siege", count: 2, path: "wagh", every: 6, delay: 10 }
    ]
  },
  {
    note: "The main assault. Three elephants.",
    groups: [
      { kind: "elephant", count: 3, path: "maha", every: 6 },
      { kind: "shield", count: 12, path: "wagh", every: 1.2, delay: 2 },
      { kind: "ladder", count: 10, path: "maha", every: 1, delay: 8 }
    ]
  },
  {
    night: true,
    note: "They try to swamp you with numbers.",
    groups: [
      { kind: "pyade", count: 22, path: "maha", every: 0.6 },
      { kind: "climber", count: 10, path: "hirkani", every: 1.5, delay: 3 },
      { kind: "siege", count: 3, path: "maha", every: 5, delay: 8 },
      { kind: "pyade", count: 14, path: "wagh", every: 0.8, delay: 6 }
    ]
  },
  {
    rain: true,
    note: "Monsoon again, and the heaviest column yet.",
    groups: [
      { kind: "elephant", count: 2, path: "maha", every: 6 },
      { kind: "elephant", count: 2, path: "wagh", every: 6, delay: 3 },
      { kind: "shield", count: 16, path: "maha", every: 1, delay: 5 },
      { kind: "siege", count: 3, path: "wagh", every: 5, delay: 10 }
    ]
  },
  {
    note: "The siege commander leads the final assault. Hold Raigad.",
    groups: [
      { kind: "boss", count: 1, path: "maha", every: 1, delay: 8 },
      { kind: "elephant", count: 2, path: "maha", every: 5 },
      { kind: "ladder", count: 12, path: "wagh", every: 0.9, delay: 2 },
      { kind: "climber", count: 8, path: "hirkani", every: 1.6, delay: 4 },
      { kind: "shield", count: 12, path: "maha", every: 1, delay: 14 }
    ]
  }
];

// ---------------------------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------------------------

type Enemy = {
  id: number;
  kind: EnemyKind;
  path: Path;
  d: number;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  stun: number;
  burn: number;
  atk: number;
  engaged: boolean;
  dead: boolean;
  wobble: number;
};

type Tower = {
  slot: number;
  kind: TowerKind;
  level: number;
  cd: number;
  spent: number;
  aim: number;
  flash: number;
};

type Projectile =
  | {
      kind: "arrow";
      x: number;
      y: number;
      target: number;
      dmg: number;
      speed: number;
    }
  | {
      kind: "ball";
      sx: number;
      sy: number;
      tx: number;
      ty: number;
      t: number;
      T: number;
      dmg: number;
      splash: number;
    };

type Fx =
  | {
      kind: "text";
      x: number;
      y: number;
      text: string;
      color: string;
      t: number;
    }
  | { kind: "ring"; x: number; y: number; r: number; t: number; color: string }
  | {
      kind: "tracer";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      t: number;
    }
  | { kind: "oil"; x: number; y: number; r: number; t: number }
  | { kind: "boulder"; x: number; y: number; t: number };

export type Phase = "build" | "wave" | "won" | "lost";
export type Ability = "boulder" | "oil";

export const ABILITY_CD: Record<Ability, number> = { boulder: 22, oil: 30 };
const HERO = {
  hp: 320,
  dmg: 20,
  rate: 0.75,
  reach: 30,
  speed: 120,
  respawn: 12,
  aura: 120
};

type Spawn = { kind: EnemyKind; path: PathId; at: number };

export type State = {
  t: number;
  phase: Phase;
  wave: number; // 1-based index of the current or last wave; 0 before the first
  gold: number;
  lives: number;
  kills: number;
  gates: Record<PathId, number>;
  gateMax: Record<PathId, number>;
  towers: (Tower | null)[];
  enemies: Enemy[];
  projectiles: Projectile[];
  fx: Fx[];
  queue: Spawn[];
  waveT: number;
  torches: boolean;
  hero: {
    x: number;
    y: number;
    tx: number;
    ty: number;
    hp: number;
    cd: number;
    dead: number;
  };
  cds: Record<Ability, number>;
  nextId: number;
};

export function newState(): State {
  return {
    t: 0,
    phase: "build",
    wave: 0,
    gold: 220,
    lives: 20,
    kills: 0,
    gates: { maha: PATHS.maha.gateHp, wagh: PATHS.wagh.gateHp, hirkani: 0 },
    gateMax: { maha: PATHS.maha.gateHp, wagh: PATHS.wagh.gateHp, hirkani: 0 },
    towers: SLOTS.map(() => null),
    enemies: [],
    projectiles: [],
    fx: [],
    queue: [],
    waveT: 0,
    torches: false,
    hero: { x: 470, y: 405, tx: 470, ty: 405, hp: HERO.hp, cd: 0, dead: 0 },
    cds: { boulder: 0, oil: 0 },
    nextId: 1
  };
}

const currentWave = (s: State): WaveDef | undefined => WAVES[s.wave - 1];
const nextWaveDef = (s: State): WaveDef | undefined => WAVES[s.wave];
export const isRain = (s: State) => s.phase === "wave" && !!currentWave(s)?.rain;
export const isNight = (s: State) => s.phase === "wave" && !!currentWave(s)?.night;

// ---------------------------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------------------------

export const TORCH_COST = 35;
export const REPAIR_COST_PER_HP = 1 / 3;

export function towerStats(t: Tower) {
  return TOWERS[t.kind].levels[t.level];
}

export function upgradeCost(t: Tower) {
  return TOWERS[t.kind].levels[t.level + 1]?.cost ?? null;
}

export function build(s: State, slot: number, kind: TowerKind) {
  const cost = TOWERS[kind].levels[0].cost;
  if (s.towers[slot] || s.gold < cost || s.phase === "won" || s.phase === "lost") return false;
  s.gold -= cost;
  s.towers[slot] = {
    slot,
    kind,
    level: 0,
    cd: 0.3,
    spent: cost,
    aim: -Math.PI / 2,
    flash: 0
  };
  return true;
}

export function upgrade(s: State, slot: number) {
  const t = s.towers[slot];
  if (!t) return false;
  const cost = upgradeCost(t);
  if (cost === null || s.gold < cost) return false;
  s.gold -= cost;
  t.level++;
  t.spent += cost;
  return true;
}

export function sell(s: State, slot: number) {
  const t = s.towers[slot];
  if (!t) return 0;
  const back = Math.floor(t.spent * 0.6);
  s.gold += back;
  s.towers[slot] = null;
  return back;
}

export function repairCost(s: State) {
  const missing = s.gateMax.maha - s.gates.maha + (s.gateMax.wagh - s.gates.wagh);
  return Math.ceil(missing * REPAIR_COST_PER_HP);
}

export function repair(s: State) {
  if (s.phase !== "build") return false;
  for (const id of ["maha", "wagh"] as const) {
    const missing = s.gateMax[id] - s.gates[id];
    const afford = Math.min(missing, Math.floor(s.gold / REPAIR_COST_PER_HP));
    if (afford <= 0) continue;
    s.gold -= Math.ceil(afford * REPAIR_COST_PER_HP);
    s.gates[id] += afford;
  }
  return true;
}

export function lightTorches(s: State) {
  if (s.torches || s.gold < TORCH_COST) return false;
  s.gold -= TORCH_COST;
  s.torches = true;
  return true;
}

export function startWave(s: State) {
  if (s.phase !== "build" || s.wave >= WAVES.length) return false;
  s.wave++;
  s.phase = "wave";
  s.waveT = 0;
  const w = WAVES[s.wave - 1];
  s.queue = w.groups
    .flatMap((g) =>
      Array.from({ length: g.count }, (_, i) => ({
        kind: g.kind,
        path: g.path,
        at: (g.delay ?? 0) + i * g.every
      }))
    )
    .sort((a, b) => a.at - b.at);
  if (!w.night) s.torches = false;
  return true;
}

export function moveHero(s: State, x: number, y: number) {
  if (s.hero.dead > 0) return;
  s.hero.tx = Math.max(10, Math.min(WORLD_W - 10, x));
  s.hero.ty = Math.max(10, Math.min(WORLD_H - 10, y));
}

export function gatePos(id: PathId): Pt {
  const p = PATHS[id];
  return p.pts[p.gate];
}

export function castAbility(s: State, a: Ability, x: number, y: number): string | null {
  if (s.phase !== "wave") return "Abilities work during a wave.";
  if (s.cds[a] > 0) return "Still recharging.";
  if (a === "oil") {
    const gate = (["maha", "wagh", "hirkani"] as const)
      .map((id) => ({ id, p: gatePos(id) }))
      .find(({ p }) => Math.hypot(p.x - x, p.y - y) < 110);
    if (!gate) return "Pour oil over a gate or the Hirkani cliff.";
    s.fx.push({
      kind: "oil",
      x: gate.p.x,
      y: gate.p.y + (gate.id === "hirkani" ? 0 : 14),
      r: 62,
      t: 5
    });
  } else {
    s.fx.push({ kind: "boulder", x, y, t: 0.45 });
  }
  s.cds[a] = ABILITY_CD[a];
  return null;
}

// ---------------------------------------------------------------------------------------------
// Simulation
// ---------------------------------------------------------------------------------------------

function damage(s: State, e: Enemy, amount: number, source: "arrow" | "bullet" | "blast" | "hero" | "oil") {
  if (e.dead) return;
  const mult = source === "hero" || source === "oil" ? 1 : ENEMIES[e.kind].armor[source];
  e.hp -= amount * mult;
  if (e.hp <= 0) {
    e.dead = true;
    const g = ENEMIES[e.kind].gold;
    s.gold += g;
    s.kills++;
    s.fx.push({
      kind: "text",
      x: e.x,
      y: e.y - 10,
      text: `+${g}`,
      color: "#f3c855",
      t: 0.9
    });
  }
}

function heroBuffed(s: State, x: number, y: number) {
  return s.hero.dead <= 0 && Math.hypot(s.hero.x - x, s.hero.y - y) < HERO.aura;
}

export function step(s: State, dt: number) {
  if (s.phase === "won" || s.phase === "lost") return;
  s.t += dt;
  const rain = isRain(s);
  const night = isNight(s) && !s.torches;
  for (const a of ["boulder", "oil"] as const) s.cds[a] = Math.max(0, s.cds[a] - dt);

  // Spawns
  if (s.phase === "wave") {
    s.waveT += dt;
    while (s.queue.length && s.queue[0].at <= s.waveT) {
      const sp = s.queue.shift()!;
      const def = ENEMIES[sp.kind];
      const path = PATHS[sp.path];
      const p = posAt(path, 0);
      const scale = 1 + Math.max(0, s.wave - 4) * 0.1;
      s.enemies.push({
        id: s.nextId++,
        kind: sp.kind,
        path,
        d: 0,
        x: p.x,
        y: p.y,
        hp: def.hp * scale,
        maxHp: def.hp * scale,
        stun: 0,
        burn: 0,
        atk: 0,
        engaged: false,
        dead: false,
        wobble: Math.random() * 6.28
      });
    }
  }

  // Hero: move, fight, respawn
  const h = s.hero;
  if (h.dead > 0) {
    h.dead -= dt;
    if (h.dead <= 0) {
      h.hp = HERO.hp;
      h.x = h.tx = THRONE.x;
      h.y = h.ty = THRONE.y + 30;
    }
  } else {
    const dx = h.tx - h.x;
    const dy = h.ty - h.y;
    const dist = Math.hypot(dx, dy);
    const moving = dist > 2;
    if (moving) {
      const m = Math.min(dist, HERO.speed * dt);
      h.x += (dx / dist) * m;
      h.y += (dy / dist) * m;
    }
    // Hold up to three nearby attackers.
    const near = s.enemies
      .filter((e) => !e.dead && Math.hypot(e.x - h.x, e.y - h.y) < HERO.reach + ENEMIES[e.kind].size)
      .sort((a, b) => Math.hypot(a.x - h.x, a.y - h.y) - Math.hypot(b.x - h.x, b.y - h.y));
    for (const e of s.enemies) e.engaged = false;
    if (!moving) near.slice(0, 3).forEach((e) => (e.engaged = true));
    h.cd -= dt;
    if (h.cd <= 0 && near.length) {
      h.cd = HERO.rate;
      damage(s, near[0], HERO.dmg, "hero");
    }
    if (h.hp < HERO.hp && !near.length) h.hp = Math.min(HERO.hp, h.hp + 12 * dt);
  }

  // Enemies
  for (const e of s.enemies) {
    if (e.dead) continue;
    const def = ENEMIES[e.kind];
    if (e.stun > 0) {
      e.stun -= dt;
      continue;
    }
    const gateUp = s.gates[e.path.id] > 0;
    if (e.engaged && h.dead <= 0) {
      e.atk -= dt;
      if (e.atk <= 0) {
        e.atk = 1;
        h.hp -= def.heroDmg;
        if (h.hp <= 0) {
          h.dead = HERO.respawn;
          s.fx.push({
            kind: "text",
            x: h.x,
            y: h.y - 14,
            text: "Commander down",
            color: "#ff8a7a",
            t: 1.6
          });
        }
      }
      continue;
    }
    if (e.kind === "siege" && gateUp && e.d >= e.path.gateD - 150) {
      e.atk -= dt;
      if (e.atk <= 0) {
        e.atk = 3;
        s.gates[e.path.id] = Math.max(0, s.gates[e.path.id] - 28);
        const g = gatePos(e.path.id);
        s.fx.push({
          kind: "ring",
          x: g.x,
          y: g.y,
          r: 20,
          t: 0.4,
          color: "#ffb35c"
        });
      }
      continue;
    }
    if (gateUp && e.d >= e.path.gateD - 10) {
      s.gates[e.path.id] = Math.max(0, s.gates[e.path.id] - def.gateDps * dt);
      if (s.gates[e.path.id] <= 0)
        s.fx.push({
          kind: "text",
          x: e.x,
          y: e.y - 20,
          text: `${e.path.name} broken!`,
          color: "#ff8a7a",
          t: 2
        });
      continue;
    }
    // Climbers are slow on the cliff, then run once over the wall.
    const climbing = e.kind === "climber" && e.d < e.path.gateD;
    const speed = def.speed * (rain ? 0.85 : 1) * (e.kind === "climber" && !climbing ? 1.9 : 1);
    e.d += speed * dt;
    if (e.d >= e.path.total) {
      e.dead = true;
      s.lives -= def.lives;
      s.fx.push({
        kind: "text",
        x: THRONE.x,
        y: THRONE.y - 26,
        text: `−${def.lives}`,
        color: "#ff6b5b",
        t: 1.2
      });
      continue;
    }
    const p = posAt(e.path, e.d);
    e.x = p.x;
    e.y = p.y;
  }

  // Oil and boulders
  for (const f of s.fx) {
    if (f.kind === "oil") {
      for (const e of s.enemies) if (!e.dead && Math.hypot(e.x - f.x, e.y - f.y) < f.r) damage(s, e, 26 * dt, "oil");
    }
    if (f.kind === "boulder" && f.t - dt <= 0 && f.t > 0) {
      for (const e of s.enemies) {
        if (!e.dead && Math.hypot(e.x - f.x, e.y - f.y) < 62) {
          damage(s, e, 95, "blast");
          e.stun = Math.max(e.stun, e.kind === "elephant" || e.kind === "boss" ? 0.5 : 1.4);
        }
      }
      s.fx.push({
        kind: "ring",
        x: f.x,
        y: f.y,
        r: 62,
        t: 0.5,
        color: "#c7b79a"
      });
    }
  }

  // Towers
  for (const t of s.towers) {
    if (!t) continue;
    const def = TOWERS[t.kind];
    const st = def.levels[t.level];
    const slot = SLOTS[t.slot];
    t.flash = Math.max(0, t.flash - dt);
    const rateMul = (def.firearm && rain ? 1.8 : 1) / (heroBuffed(s, slot.x, slot.y) ? 1.25 : 1);
    t.cd -= dt;
    if (t.cd > 0) continue;
    const range = st.range * (night ? 0.7 : 1);
    let best: Enemy | null = null;
    let bestLeft = Infinity;
    for (const e of s.enemies) {
      if (e.dead) continue;
      const dist = Math.hypot(e.x - slot.x, e.y - slot.y);
      if (dist > range || (def.minRange && dist < def.minRange)) continue;
      const left = e.path.total - e.d;
      if (left < bestLeft) {
        bestLeft = left;
        best = e;
      }
    }
    if (!best) continue;
    t.cd = st.rate * rateMul;
    t.aim = Math.atan2(best.y - slot.y, best.x - slot.x);
    t.flash = 0.12;
    if (t.kind === "archer")
      s.projectiles.push({
        kind: "arrow",
        x: slot.x,
        y: slot.y,
        target: best.id,
        dmg: st.dmg,
        speed: 520
      });
    else if (t.kind === "musket") {
      damage(s, best, st.dmg, "bullet");
      s.fx.push({
        kind: "tracer",
        x1: slot.x,
        y1: slot.y,
        x2: best.x,
        y2: best.y,
        t: 0.09
      });
    } else {
      // Lead the target a little.
      const lead = posAt(best.path, best.d + ENEMIES[best.kind].speed * 0.5 * (best.stun > 0 || best.engaged ? 0 : 1));
      const T = 0.6 + Math.hypot(lead.x - slot.x, lead.y - slot.y) / 600;
      s.projectiles.push({
        kind: "ball",
        sx: slot.x,
        sy: slot.y,
        tx: lead.x,
        ty: lead.y,
        t: 0,
        T,
        dmg: st.dmg,
        splash: def.splash ?? 40
      });
    }
  }

  // Projectiles
  const byId = new Map(s.enemies.map((e) => [e.id, e]));
  s.projectiles = s.projectiles.filter((p) => {
    if (p.kind === "arrow") {
      const e = byId.get(p.target);
      if (!e || e.dead) return false;
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      const dist = Math.hypot(dx, dy);
      const m = p.speed * dt;
      if (dist <= m + 3) {
        damage(s, e, p.dmg, "arrow");
        return false;
      }
      p.x += (dx / dist) * m;
      p.y += (dy / dist) * m;
      return true;
    }
    p.t += dt;
    if (p.t >= p.T) {
      for (const e of s.enemies) if (!e.dead && Math.hypot(e.x - p.tx, e.y - p.ty) < p.splash) damage(s, e, p.dmg, "blast");
      s.fx.push({
        kind: "ring",
        x: p.tx,
        y: p.ty,
        r: p.splash,
        t: 0.35,
        color: "#ffcf7a"
      });
      return false;
    }
    return true;
  });

  // Effects
  for (const f of s.fx) {
    f.t -= dt;
    if (f.kind === "text") f.y -= 18 * dt;
  }
  s.fx = s.fx.filter((f) => f.t > 0);
  s.enemies = s.enemies.filter((e) => !e.dead);

  // Outcome
  if (s.lives <= 0) {
    s.lives = 0;
    s.phase = "lost";
    return;
  }
  if (s.phase === "wave" && !s.queue.length && !s.enemies.length) {
    s.projectiles = [];
    if (s.wave >= WAVES.length) {
      s.phase = "won";
      return;
    }
    const bonus = 40 + s.wave * 6;
    s.gold += bonus;
    s.fx.push({
      kind: "text",
      x: THRONE.x,
      y: THRONE.y - 40,
      text: `Wave ${s.wave} held  +${bonus}`,
      color: "#f3c855",
      t: 2.2
    });
    s.phase = "build";
    s.torches = false;
  }
}

export function score(s: State) {
  return s.kills * 10 + s.lives * 150 + Math.floor(s.gold) + (s.phase === "won" ? 2000 : 0) + s.wave * 100;
}

// ---------------------------------------------------------------------------------------------
// Rendering and input
// ---------------------------------------------------------------------------------------------

export type Selection = { type: "slot"; slot: number } | null;

export type Hud = {
  phase: Phase;
  wave: number;
  waves: number;
  gold: number;
  lives: number;
  kills: number;
  gates: { id: PathId; name: string; hp: number; max: number; open: boolean }[];
  rain: boolean;
  night: boolean;
  torches: boolean;
  next: WaveDef | undefined;
  current: WaveDef | undefined;
  remaining: number;
  selection: Selection;
  tower: {
    kind: TowerKind;
    level: number;
    upgrade: number | null;
    sellFor: number;
  } | null;
  armed: Ability | null;
  cds: Record<Ability, number>;
  heroDead: number;
  speed: number;
  paused: boolean;
  repairCost: number;
  score: number;
  message: string | null;
};

const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
};

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function inPolygon(p: Pt, poly: Pt[]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

/** Pre-renders the static terrain once per size. */
function paintTerrain(ctx: CanvasRenderingContext2D) {
  const r = rng(1674); // the year of Shivaji's coronation at Raigad
  // Valley and slopes
  const bg = ctx.createRadialGradient(500, 250, 80, 500, 300, 700);
  bg.addColorStop(0, "#6f8a4a");
  bg.addColorStop(0.55, "#4f6b37");
  bg.addColorStop(1, "#2d4126");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  // Contours: concentric shrunk plateaus suggest the hill.
  for (let k = 6; k >= 1; k--) {
    const grow = k * 26;
    ctx.beginPath();
    PLATEAU.forEach((p, i) => {
      const dx = p.x - 515;
      const dy = p.y - 260;
      const len = Math.hypot(dx, dy) || 1;
      const x = p.x + (dx / len) * grow;
      const y = p.y + (dy / len) * grow * 1.15;
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = `rgba(40,30,18,${0.05 + (6 - k) * 0.025})`;
    ctx.fill();
    ctx.strokeStyle = "rgba(20,30,10,0.18)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  // Trees on the slopes
  for (let i = 0; i < 420; i++) {
    const x = r() * WORLD_W;
    const y = r() * WORLD_H;
    if (inPolygon({ x, y }, PLATEAU)) continue;
    const s = 3 + r() * 5;
    ctx.fillStyle = r() > 0.5 ? "rgba(32,56,26,0.85)" : "rgba(48,78,34,0.85)";
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fill();
  }
  // Cliffs: dark band just outside the wall.
  ctx.save();
  ctx.beginPath();
  PLATEAU.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 10;
  const top = ctx.createLinearGradient(0, 60, 0, 440);
  top.addColorStop(0, "#b9a98a");
  top.addColorStop(1, "#a28f6d");
  ctx.fillStyle = top;
  ctx.fill();
  ctx.restore();
  // Grass patches on top
  for (let i = 0; i < 160; i++) {
    const x = 140 + r() * 760;
    const y = 70 + r() * 370;
    if (!inPolygon({ x, y }, PLATEAU)) continue;
    ctx.fillStyle = `rgba(110,130,70,${0.12 + r() * 0.15})`;
    ctx.beginPath();
    ctx.ellipse(x, y, 8 + r() * 20, 5 + r() * 10, r() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Paths
  for (const id of ["maha", "wagh", "hirkani"] as const) {
    const p = PATHS[id];
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const draw = (w: number, c: string, dash: number[] = []) => {
      ctx.setLineDash(dash);
      ctx.beginPath();
      p.pts.forEach((pt, i) => (i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)));
      ctx.strokeStyle = c;
      ctx.lineWidth = w;
      ctx.stroke();
      ctx.setLineDash([]);
    };
    if (id === "hirkani") draw(4, "rgba(60,40,20,0.7)", [4, 6]);
    else {
      draw(22, "rgba(70,50,30,0.35)");
      draw(16, "#9b7e57");
      draw(16, "rgba(255,240,210,0.08)", [2, 9]);
    }
  }
  // Ganga Sagar lake
  ctx.fillStyle = "#4f7f92";
  ctx.beginPath();
  ctx.ellipse(410, 345, 46, 22, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(230,240,240,0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();
  // Walls
  ctx.beginPath();
  PLATEAU.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
  ctx.strokeStyle = "#5d4d3a";
  ctx.lineWidth = 9;
  ctx.stroke();
  ctx.strokeStyle = "#8a7558";
  ctx.lineWidth = 5;
  ctx.setLineDash([6, 3]);
  ctx.stroke();
  ctx.setLineDash([]);
  // Buildings: Raj Sadar (throne), Holi Mal market street, Jagadishwar temple, Takmak Tok
  const block = (x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(x + 3, y + 4, w, h);
    ctx.fillStyle = "#c8b48e";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#6e5a40";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);
  };
  block(470, 200, 60, 34);
  block(482, 186, 36, 14);
  for (let i = 0; i < 7; i++) {
    block(560 + i * 18, 140, 12, 12);
    block(560 + i * 18, 172, 12, 12);
  }
  block(728, 198, 26, 22);
  ctx.fillStyle = "#c8b48e";
  ctx.beginPath();
  ctx.moveTo(741, 182);
  ctx.lineTo(752, 198);
  ctx.lineTo(730, 198);
  ctx.closePath();
  ctx.fill();
  // Labels
  ctx.font = "600 11px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  const label = (text: string, x: number, y: number, color = "rgba(40,28,16,0.85)") => {
    ctx.fillStyle = "rgba(255,248,230,0.55)";
    const w = ctx.measureText(text).width + 8;
    ctx.fillRect(x - w / 2, y - 10, w, 14);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y + 1);
  };
  label("Raj Sadar", 500, 252);
  label("Holi Mal", 616, 133);
  label("Jagadishwar", 742, 236);
  label("Ganga Sagar", 410, 377);
  label("Takmak Tok", 205, 84);
  label("Hirkani Buruj", 120, 158);
  label("Maha Darwaja", 470, 495);
  label("Wagh Darwaja", 905, 150);
  label("Chit Darwaja", 590, 630);
}

export function createRaigad(canvas: HTMLCanvasElement, onHud: (h: Hud) => void) {
  const ctx = canvas.getContext("2d")!;
  let s = newState();
  let selection: Selection = null;
  let armed: Ability | null = null;
  let speed = 1;
  let paused = false;
  let message: string | null = null;
  let messageT = 0;
  let raf = 0;
  let last = performance.now();
  let scale = 1;
  let ox = 0;
  let oy = 0;
  let dpr = 1;
  let terrain: HTMLCanvasElement | null = null;
  let hoverX = -1;
  let hoverY = -1;
  let hudT = 0;
  let destroyed = false;
  let centerX = 520; // world x kept in the middle of a narrow screen
  let insetTop = 0;
  let insetBottom = 0;
  let drag: {
    id: number;
    x: number;
    y: number;
    ox: number;
    moved: boolean;
  } | null = null;

  const say = (m: string) => {
    message = m;
    messageT = 3;
  };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const availH = Math.max(120, h - insetTop - insetBottom);
    const fit = Math.min(w / WORLD_W, availH / WORLD_H);
    // On narrow screens, zoom in to a tappable size and let the map pan sideways.
    scale = Math.min(availH / WORLD_H, Math.max(fit, 0.62));
    ox = clampOx(w / 2 - centerX * scale, w);
    oy = insetTop + (availH - WORLD_H * scale) / 2;
    canvas.dataset.view = `${ox},${oy},${scale}`;
    const off = document.createElement("canvas");
    off.width = Math.round(WORLD_W * scale * dpr);
    off.height = Math.round(WORLD_H * scale * dpr);
    const octx = off.getContext("2d")!;
    octx.scale(scale * dpr, scale * dpr);
    paintTerrain(octx);
    terrain = off;
  }

  function clampOx(x: number, w = canvas.clientWidth) {
    if (WORLD_W * scale <= w) return (w - WORLD_W * scale) / 2;
    return Math.min(0, Math.max(w - WORLD_W * scale, x));
  }

  const toWorld = (cx: number, cy: number) => {
    const r = canvas.getBoundingClientRect();
    return { x: (cx - r.left - ox) / scale, y: (cy - r.top - oy) / scale };
  };

  function slotAt(x: number, y: number) {
    let best = -1;
    let bd = 26;
    SLOTS.forEach((p, i) => {
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    return best;
  }

  function onDown(ev: PointerEvent) {
    drag = { id: ev.pointerId, x: ev.clientX, y: ev.clientY, ox, moved: false };
  }

  function onUp(ev: PointerEvent) {
    const d = drag;
    drag = null;
    if (!d || d.id !== ev.pointerId || d.moved) return;
    onTap(ev);
  }

  function onTap(ev: PointerEvent) {
    if (s.phase === "won" || s.phase === "lost") return;
    const { x, y } = toWorld(ev.clientX, ev.clientY);
    if (armed) {
      const err = castAbility(s, armed, x, y);
      if (err) say(err);
      armed = null;
      emit();
      return;
    }
    const slot = slotAt(x, y);
    if (slot >= 0) {
      selection = selection?.slot === slot ? null : { type: "slot", slot };
    } else if (selection) {
      selection = null;
    } else {
      moveHero(s, x, y);
    }
    emit();
  }

  function onMove(ev: PointerEvent) {
    if (drag && drag.id === ev.pointerId) {
      const dx = ev.clientX - drag.x;
      if (!drag.moved && Math.hypot(dx, ev.clientY - drag.y) > 8 && WORLD_W * scale > canvas.clientWidth) drag.moved = true;
      if (drag.moved) {
        ox = clampOx(drag.ox + dx);
        centerX = (canvas.clientWidth / 2 - ox) / scale;
        canvas.dataset.view = `${ox},${oy},${scale}`;
      }
    }
    const p = toWorld(ev.clientX, ev.clientY);
    hoverX = p.x;
    hoverY = p.y;
  }

  function emit() {
    const sel = selection;
    const t = sel ? s.towers[sel.slot] : null;
    onHud({
      phase: s.phase,
      wave: s.wave,
      waves: WAVES.length,
      gold: Math.floor(s.gold),
      lives: s.lives,
      kills: s.kills,
      gates: (["maha", "wagh"] as const).map((id) => ({
        id,
        name: PATHS[id].name,
        hp: Math.ceil(s.gates[id]),
        max: s.gateMax[id],
        open: s.wave >= PATHS[id].opensAt || (s.phase === "build" && s.wave + 1 >= PATHS[id].opensAt)
      })),
      rain: isRain(s),
      night: isNight(s),
      torches: s.torches,
      next: nextWaveDef(s),
      current: currentWave(s),
      remaining: s.queue.length + s.enemies.length,
      selection: sel,
      tower: t
        ? {
            kind: t.kind,
            level: t.level,
            upgrade: upgradeCost(t),
            sellFor: Math.floor(t.spent * 0.6)
          }
        : null,
      armed,
      cds: { ...s.cds },
      heroDead: Math.max(0, Math.ceil(s.hero.dead)),
      speed,
      paused,
      repairCost: repairCost(s),
      score: score(s),
      message: messageT > 0 ? message : null
    });
  }

  function draw() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#1d2a17";
    ctx.fillRect(0, 0, w, h);
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, ox * dpr, oy * dpr);
    if (terrain) ctx.drawImage(terrain, 0, 0, WORLD_W, WORLD_H);

    const night = isNight(s);
    const rain = isRain(s);
    const sel = selection;

    // Gates
    for (const id of ["maha", "wagh"] as const) {
      const g = gatePos(id);
      const hp = s.gates[id];
      const max = s.gateMax[id];
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.fillStyle = hp > 0 ? "#5a3b22" : "rgba(40,30,20,0.6)";
      ctx.fillRect(-15, -8, 30, 16);
      ctx.strokeStyle = hp > 0 ? "#2b1b0e" : "#7a2a20";
      ctx.lineWidth = 2;
      ctx.strokeRect(-15, -8, 30, 16);
      if (hp > 0) {
        ctx.fillStyle = "#c0a060";
        for (const sx of [-8, 0, 8]) ctx.fillRect(sx - 1, -6, 2, 12);
      }
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(-18, -16, 36, 4);
      ctx.fillStyle = hp / max > 0.5 ? "#7cc46a" : hp / max > 0.25 ? "#e3b341" : "#e0574a";
      ctx.fillRect(-18, -16, 36 * (hp / max), 4);
      ctx.restore();
    }

    // Slots and towers
    SLOTS.forEach((p, i) => {
      const t = s.towers[i];
      const selected = sel?.slot === i;
      if (selected || (t && Math.hypot(hoverX - p.x, hoverY - p.y) < 22)) {
        const range = t ? towerStats(t).range * (night && !s.torches ? 0.7 : 1) : 0;
        if (range) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, range, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,240,200,0.08)";
          ctx.fill();
          ctx.strokeStyle = "rgba(255,240,200,0.5)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      // Bastion base
      ctx.beginPath();
      ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = t ? "#7d6a50" : "rgba(80,64,44,0.55)";
      ctx.fill();
      ctx.lineWidth = selected ? 3 : 1.5;
      ctx.strokeStyle = selected ? "#fff3c4" : t ? "#3d3022" : "rgba(255,240,210,0.55)";
      if (!t) ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
      if (!t) {
        ctx.fillStyle = "rgba(255,240,210,0.7)";
        ctx.font = "700 14px ui-sans-serif, system-ui";
        ctx.textAlign = "center";
        ctx.fillText("+", p.x, p.y + 5);
        return;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      if (t.kind === "archer") {
        ctx.fillStyle = "#e8d29a";
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.rotate(t.aim);
        ctx.strokeStyle = "#3b2a18";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(2, 0, 7, -1.2, 1.2);
        ctx.stroke();
      } else if (t.kind === "musket") {
        ctx.fillStyle = "#d9c08a";
        ctx.fillRect(-7, -7, 14, 14);
        ctx.rotate(t.aim);
        ctx.fillStyle = "#2a2a2a";
        ctx.fillRect(0, -1.5, 14, 3);
        if (t.flash > 0) {
          ctx.fillStyle = "#ffe08a";
          ctx.beginPath();
          ctx.arc(16, 0, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = "#4a4038";
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.rotate(t.aim);
        ctx.fillStyle = "#1d1a17";
        ctx.fillRect(0, -3.5, 17 - (t.flash > 0 ? 3 : 0), 7);
        if (t.flash > 0) {
          ctx.fillStyle = "rgba(255,220,140,0.9)";
          ctx.beginPath();
          ctx.arc(20, 0, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      // Level pips
      for (let l = 0; l <= t.level; l++) {
        ctx.fillStyle = "#f3c855";
        ctx.beginPath();
        ctx.arc(p.x - 6 + l * 6, p.y + 20, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Oil
    for (const f of s.fx) {
      if (f.kind !== "oil") continue;
      const g = ctx.createRadialGradient(f.x, f.y, 4, f.x, f.y, f.r);
      g.addColorStop(0, `rgba(255,170,60,${0.55 * Math.min(1, f.t)})`);
      g.addColorStop(1, "rgba(120,40,10,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Enemies
    for (const e of s.enemies) {
      const def = ENEMIES[e.kind];
      const bob = Math.sin(s.t * 8 + e.wobble) * (e.stun > 0 ? 0 : 1);
      ctx.save();
      ctx.translate(e.x, e.y + bob * 0.6);
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(1, def.size * 0.7, def.size, def.size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      if (e.kind === "elephant" || e.kind === "boss") {
        ctx.fillStyle = def.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, def.size, def.size * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = shade(def.color, 0.75);
        ctx.beginPath();
        ctx.arc(-def.size * 0.6, -def.size * 0.35, def.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = e.kind === "boss" ? "#8a1f1f" : "#a33b2f";
        ctx.fillRect(-def.size * 0.35, -def.size * 0.95, def.size * 0.7, def.size * 0.5);
        if (e.kind === "boss") {
          ctx.fillStyle = "#f6d36b";
          ctx.beginPath();
          ctx.arc(0, -def.size * 1.05, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (e.kind === "siege") {
        ctx.fillStyle = "#6b5236";
        ctx.fillRect(-9, -5, 18, 10);
        ctx.fillStyle = "#222";
        ctx.fillRect(-2, -2.5, 15, 5);
        ctx.fillStyle = "#3a2b1c";
        ctx.beginPath();
        ctx.arc(-6, 6, 3.5, 0, Math.PI * 2);
        ctx.arc(6, 6, 3.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = def.color;
        ctx.beginPath();
        ctx.arc(0, 0, def.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
        if (e.kind === "shield") {
          ctx.fillStyle = "#c9b27a";
          ctx.beginPath();
          ctx.arc(def.size * 0.6, 0, def.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else if (e.kind === "ladder") {
          ctx.strokeStyle = "#e7c48a";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-9, -4);
          ctx.lineTo(9, -4);
          ctx.moveTo(-9, 3);
          ctx.lineTo(9, 3);
          ctx.stroke();
        } else if (e.kind === "climber") {
          ctx.strokeStyle = "#d8c7a0";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, -def.size);
          ctx.lineTo(-4, -def.size - 8);
          ctx.stroke();
        }
      }
      if (e.stun > 0) {
        ctx.fillStyle = "#fff3a0";
        ctx.font = "700 10px ui-sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✶", 0, -def.size - 4);
      }
      ctx.restore();
      if (e.hp < e.maxHp) {
        const w = Math.max(14, def.size * 2.2);
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(e.x - w / 2, e.y - def.size - 8, w, 3);
        ctx.fillStyle = "#e0574a";
        ctx.fillRect(e.x - w / 2, e.y - def.size - 8, w * Math.max(0, e.hp / e.maxHp), 3);
      }
    }

    // Hero
    const hero = s.hero;
    if (hero.dead <= 0) {
      if (Math.hypot(hero.tx - hero.x, hero.ty - hero.y) > 2) {
        ctx.strokeStyle = "rgba(255,200,90,0.5)";
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(hero.x, hero.y);
        ctx.lineTo(hero.tx, hero.ty);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      ctx.arc(hero.x, hero.y, HERO.aura, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,170,60,0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.save();
      ctx.translate(hero.x, hero.y);
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.ellipse(1, 7, 9, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f08a1c"; // saffron
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff1d0";
      ctx.lineWidth = 2;
      ctx.stroke();
      // Flag
      ctx.strokeStyle = "#3b2a18";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(6, -2);
      ctx.lineTo(6, -20);
      ctx.stroke();
      ctx.fillStyle = "#f08a1c";
      ctx.beginPath();
      ctx.moveTo(6, -20);
      ctx.lineTo(18, -16 + Math.sin(s.t * 6) * 1.5);
      ctx.lineTo(6, -12);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(hero.x - 11, hero.y + 12, 22, 3);
      ctx.fillStyle = "#7cc46a";
      ctx.fillRect(hero.x - 11, hero.y + 12, 22 * (hero.hp / HERO.hp), 3);
    }

    // Projectiles
    for (const p of s.projectiles) {
      if (p.kind === "arrow") {
        ctx.fillStyle = "#f6eccc";
        ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
      } else {
        const k = p.t / p.T;
        const x = p.sx + (p.tx - p.sx) * k;
        const y = p.sy + (p.ty - p.sy) * k - Math.sin(k * Math.PI) * 50;
        ctx.fillStyle = "#1b1b1b";
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Effects
    for (const f of s.fx) {
      if (f.kind === "ring") {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * (1.2 - f.t), 0, Math.PI * 2);
        ctx.strokeStyle = f.color;
        ctx.globalAlpha = Math.min(1, f.t * 2.5);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (f.kind === "tracer") {
        ctx.strokeStyle = `rgba(255,236,170,${f.t * 9})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(f.x1, f.y1);
        ctx.lineTo(f.x2, f.y2);
        ctx.stroke();
      } else if (f.kind === "boulder") {
        const k = 1 - f.t / 0.45;
        ctx.fillStyle = "#857865";
        ctx.beginPath();
        ctx.arc(f.x, f.y - (1 - k) * 120, 9 + k * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.beginPath();
        ctx.arc(f.x, f.y, 62, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Weather and light
    if (night) {
      ctx.fillStyle = s.torches ? "rgba(10,14,40,0.32)" : "rgba(6,10,32,0.55)";
      ctx.fillRect(-50, -50, WORLD_W + 100, WORLD_H + 100);
      if (s.torches) {
        ctx.globalCompositeOperation = "lighter";
        for (const p of SLOTS.filter((_, i) => s.towers[i])) {
          const g = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, 70);
          g.addColorStop(0, "rgba(255,170,70,0.35)");
          g.addColorStop(1, "rgba(255,120,40,0)");
          ctx.fillStyle = g;
          ctx.fillRect(p.x - 70, p.y - 70, 140, 140);
        }
        ctx.globalCompositeOperation = "source-over";
      }
    }
    if (rain) {
      ctx.fillStyle = "rgba(60,80,100,0.12)";
      ctx.fillRect(-50, -50, WORLD_W + 100, WORLD_H + 100);
      ctx.strokeStyle = "rgba(200,215,235,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const r = rng(Math.floor(s.t * 20));
      for (let i = 0; i < 140; i++) {
        const x = r() * (WORLD_W + 60);
        const y = r() * WORLD_H;
        ctx.moveTo(x, y);
        ctx.lineTo(x - 6, y + 16);
      }
      ctx.stroke();
    }

    // Floating text on top of everything
    ctx.font = "700 12px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    for (const f of s.fx) {
      if (f.kind !== "text") continue;
      ctx.globalAlpha = Math.min(1, f.t * 2);
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillText(f.text, f.x + 1, f.y + 1);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
      ctx.globalAlpha = 1;
    }

    // Aiming an ability
    if (armed && hoverX >= 0) {
      ctx.beginPath();
      ctx.arc(hoverX, hoverY, armed === "boulder" ? 62 : 62, 0, Math.PI * 2);
      ctx.strokeStyle = armed === "boulder" ? "rgba(230,220,200,0.8)" : "rgba(255,170,60,0.9)";
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  function frame(now: number) {
    if (destroyed) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!paused) {
      const n = speed;
      for (let i = 0; i < n; i++) step(s, dt);
    }
    messageT -= dt;
    draw();
    hudT -= dt;
    if (hudT <= 0) {
      hudT = 0.1;
      emit();
    }
    raf = requestAnimationFrame(frame);
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas);
  resize();
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("pointermove", onMove);
  raf = requestAnimationFrame(frame);
  emit();

  const act = (fn: () => void) => {
    fn();
    emit();
  };

  return {
    startWave: () =>
      act(() => {
        selection = null;
        startWave(s);
      }),
    build: (kind: TowerKind) =>
      act(() => {
        if (!selection) return;
        if (build(s, selection.slot, kind)) selection = null;
        else say("Not enough gold.");
      }),
    upgrade: () =>
      act(() => {
        if (selection && !upgrade(s, selection.slot)) say("Not enough gold.");
      }),
    sell: () =>
      act(() => {
        if (selection) sell(s, selection.slot);
        selection = null;
      }),
    deselect: () => act(() => (selection = null)),
    arm: (a: Ability) =>
      act(() => {
        if (s.phase !== "wave") say("Abilities work during a wave.");
        else if (s.cds[a] > 0) say("Still recharging.");
        else {
          armed = armed === a ? null : a;
          selection = null;
        }
      }),
    torches: () =>
      act(() => {
        if (!lightTorches(s)) say(s.torches ? "Torches are already lit." : "Not enough gold.");
      }),
    repair: () =>
      act(() => {
        repair(s);
      }),
    setInsets: (top: number, bottom: number) => {
      if (top === insetTop && bottom === insetBottom) return;
      insetTop = top;
      insetBottom = bottom;
      resize();
    },
    pannable: () => WORLD_W * scale > canvas.clientWidth + 1,
    setSpeed: (n: number) => act(() => (speed = n)),
    setPaused: (p: boolean) => act(() => (paused = p)),
    restart: () =>
      act(() => {
        s = newState();
        selection = null;
        armed = null;
        paused = false;
        speed = 1;
      }),
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointermove", onMove);
    }
  };
}
