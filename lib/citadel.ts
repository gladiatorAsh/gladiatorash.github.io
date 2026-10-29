/**
 * The citadel: a 3D map of this site. Every building stands for something on the page and the
 * camera moves to it as you read. Pure data, so the scene and the page share one source of truth.
 *
 *   keep (centre)       you: the orchestrator everything connects to
 *   workshop (east)     new agent projects, built with AI coding agents
 *   old town (west)     case studies engineered by hand
 *   wall towers         the places I've worked (and studied), oldest beside the gate
 *   plaza (north)       testimonials, one standing stone each
 *   gate (south)        contact
 */
import { agenticProjects, projects, testimonials, timeline } from "@/lib/portfolio";

export type BuildingKind =
  | "keep"
  | "tower"
  | "gate"
  | "market"
  | "archive"
  | "forge"
  | "hall"
  | "prism"
  | "house"
  | "stone";

export type Building = {
  id: string;
  kind: BuildingKind;
  label: string;
  /** Element id on the page this building links to. */
  anchor: string;
  x: number;
  z: number;
  /** Footprint and height multipliers for the kind's base shape. */
  w?: number;
  d?: number;
  h?: number;
  rot?: number;
};

export type CameraShot = {
  target: [number, number, number];
  distance: number;
  /** Around the vertical axis, radians; 0 looks at the citadel from the gate (south). */
  azimuth: number;
  /** Above the ground plane, radians. */
  elevation: number;
};

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const agentAnchor = (title: string) => `agent-${slug(title)}`;
export const projectAnchor = (title: string) => `project-${slug(title)}`;

/** Hexagonal wall: vertices at 0°, 60°, …; the gate sits in the edge facing +z (south). */
export const WALL_RADIUS = 34;
const vertex = (deg: number): [number, number] => [
  WALL_RADIUS * Math.cos((deg * Math.PI) / 180),
  WALL_RADIUS * Math.sin((deg * Math.PI) / 180)
];
export const wallVertices = [0, 60, 120, 180, 240, 300].map(vertex);
export const GATE_Z = WALL_RADIUS * Math.cos(Math.PI / 6);

// Towers, oldest first, walking from the gate's west side around the wall.
const towerAngles = [120, 180, 240, 300, 0, 60];
const careerOldestFirst = [...timeline].reverse();

const workshopSpots = [
  { kind: "market" as const, x: 15, z: -7 },
  { kind: "archive" as const, x: 21, z: 2 },
  { kind: "forge" as const, x: 13, z: 8 }
];

// Old town: two great halls for the production AI platforms, then a grid of houses.
const hallSpots = [
  { kind: "hall" as const, x: -9, z: -10 },
  { kind: "prism" as const, x: -9, z: 9 }
];
const houseSpots: [number, number][] = [];
for (const z of [-14, -8.4, -2.8, 2.8, 8.4, 14]) for (const x of [-22.5, -17.5]) houseSpots.push([x, z]);

export const buildings: Building[] = [
  { id: "keep", kind: "keep", label: "Ashutosh Singh", anchor: "home", x: 0, z: 0 },
  { id: "gate", kind: "gate", label: "Contact", anchor: "contact", x: 0, z: GATE_Z },

  ...careerOldestFirst.map((job, i) => {
    const [x, z] = vertex(towerAngles[i]);
    return { id: `tower-${slug(job.company)}`, kind: "tower" as const, label: job.company, anchor: "resume", x, z };
  }),
  (() => {
    const [x, z] = vertex(towerAngles[careerOldestFirst.length]);
    return { id: "tower-sjsu", kind: "tower" as const, label: "San Jose State University", anchor: "skills", x, z, h: 0.8 };
  })(),

  ...agenticProjects.map((p, i) => ({
    id: agentAnchor(p.title),
    kind: workshopSpots[i % workshopSpots.length].kind,
    label: p.title,
    anchor: agentAnchor(p.title),
    x: workshopSpots[i % workshopSpots.length].x,
    z: workshopSpots[i % workshopSpots.length].z
  })),

  ...projects.map((p, i) => {
    if (i < hallSpots.length) {
      const spot = hallSpots[i];
      return { id: projectAnchor(p.title), kind: spot.kind, label: p.title, anchor: projectAnchor(p.title), x: spot.x, z: spot.z };
    }
    const [x, z] = houseSpots[(i - hallSpots.length) % houseSpots.length];
    // Vary the houses a little so the old town doesn't look stamped out.
    const h = 0.8 + (((i * 37) % 10) / 10) * 0.7;
    return { id: projectAnchor(p.title), kind: "house" as const, label: p.title, anchor: projectAnchor(p.title), x, z, h, rot: (i % 3) * 0.12 - 0.12 };
  }),

  ...testimonials.map((t, i) => {
    const a = ((-128 + (76 / Math.max(1, testimonials.length - 1)) * i) * Math.PI) / 180;
    return { id: `stone-${slug(t.name)}`, kind: "stone" as const, label: t.name, anchor: "testimonials", x: 21 * Math.cos(a), z: 21 * Math.sin(a), h: 0.8 + (i % 3) * 0.2 };
  })
];

const byKind = (kind: BuildingKind) => buildings.filter((b) => b.kind === kind).map((b) => b.id);
const pos = (id: string): [number, number, number] => {
  const b = buildings.find((x) => x.id === id);
  return b ? [b.x, 2, b.z] : [0, 2, 0];
};

export type SceneState = { shot: CameraShot; highlight: string[]; label?: boolean; roads?: boolean; wall?: boolean };

/** What the camera shows for each part of the page (keys match data-scene attributes). */
/** Look at a building from outside the wall, high enough that taller neighbours never block it. */
const outward = (id: string, distance: number): CameraShot => {
  const b = buildings.find((x) => x.id === id);
  const [x, z] = b ? [b.x, b.z] : [0, 1];
  return { target: [x, 2, z], distance, azimuth: Math.atan2(x, z) + 0.3, elevation: 0.92 };
};

export function sceneFor(key: string): SceneState {
  if (key.startsWith("agent-")) {
    return { shot: outward(key, 46), highlight: [key], label: true };
  }
  if (key.startsWith("project-")) {
    const b = buildings.find((x) => x.id === key);
    const big = b && (b.kind === "hall" || b.kind === "prism");
    return { shot: outward(key, big ? 48 : 40), highlight: [key], label: true };
  }
  switch (key) {
    case "agents":
      return { shot: { target: [16, 2, 1], distance: 52, azimuth: 0.85, elevation: 0.62 }, highlight: byKind("market").concat(byKind("archive"), byKind("forge")), label: true };
    case "projects":
      return { shot: { target: [-15, 2, 0], distance: 62, azimuth: -0.8, elevation: 0.66 }, highlight: byKind("hall").concat(byKind("prism"), byKind("house")) };
    case "resume":
      return { shot: { target: [0, 4, 0], distance: 128, azimuth: 0.05, elevation: 0.36 }, highlight: byKind("tower"), label: true };
    case "architecture":
      return { shot: { target: [0, 3, 0], distance: 70, azimuth: 0.4, elevation: 1.05 }, highlight: ["keep"], roads: true };
    case "testimonials":
      return { shot: { target: [0, 2, -18], distance: 44, azimuth: 3.05, elevation: 0.5 }, highlight: byKind("stone") };
    case "skills":
      return { shot: { target: [0, 0, 0], distance: 110, azimuth: 0.2, elevation: 1.2 }, highlight: [], wall: true };
    case "contact":
      return { shot: { target: [0, 5, GATE_Z - 6], distance: 62, azimuth: 0.18, elevation: 0.42 }, highlight: ["gate"], label: true };
    default:
      return { shot: { target: [0, 3, 0], distance: 104, azimuth: 0.62, elevation: 0.6 }, highlight: [] };
  }
}
