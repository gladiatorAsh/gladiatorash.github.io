/**
 * Three.js renderer for the citadel (see lib/citadel.ts for the layout).
 * Loaded on demand so the 3D library never blocks first paint. Renders only while something is
 * moving (camera glide, the opening rise, hover) and sleeps otherwise.
 */
import * as THREE from "three";
import { buildings, GATE_Z, sceneFor, wallVertices, type Building, type SceneState } from "@/lib/citadel";

type Options = {
  onSelect: (anchor: string) => void;
  reducedMotion: boolean;
  initialKey: string;
};

type Palette = { paper: THREE.Color; paper2: THREE.Color; ink: THREE.Color; graphite: THREE.Color; rule: THREE.Color; signal: THREE.Color };

const cssColor = (name: string, fallback: string) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(v || fallback);
};

function readPalette(): Palette {
  return {
    paper: cssColor("--color-paper", "#d6d7d3"),
    paper2: cssColor("--color-paper-2", "#e1e2de"),
    ink: cssColor("--color-ink", "#16181a"),
    graphite: cssColor("--color-graphite", "#565b5f"),
    rule: cssColor("--color-rule", "#a9aba7"),
    signal: cssColor("--color-signal", "#1d4fbf")
  };
}

export function mount(host: HTMLElement, labelLayer: HTMLElement, opts: Options): () => void {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.domElement.style.display = "block";
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 800);

  let palette = readPalette();
  const mats = {
    // Polygon offset pushes faces back a hair so their outlines don't flicker into dashes.
    fill: new THREE.MeshLambertMaterial({ color: palette.paper2, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }),
    fillHi: new THREE.MeshLambertMaterial({ color: palette.paper2, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }),
    ground: new THREE.MeshLambertMaterial({ color: palette.paper }),
    line: new THREE.LineBasicMaterial({ color: palette.graphite }),
    lineHi: new THREE.LineBasicMaterial({ color: palette.signal }),
    lineDim: new THREE.LineBasicMaterial({ color: palette.rule }),
    grid: new THREE.LineBasicMaterial({ color: palette.rule, transparent: true, opacity: 0.45 })
  };

  const ambient = new THREE.AmbientLight(0xffffff, 1.55);
  const sun = new THREE.DirectionalLight(0xffffff, 1.35);
  sun.position.set(-40, 90, 55);
  scene.add(ambient, sun);

  const recolor = () => {
    palette = readPalette();
    mats.fill.color.copy(palette.paper2);
    mats.fillHi.color.copy(palette.paper2).lerp(palette.signal, 0.14);
    mats.ground.color.copy(palette.paper);
    mats.line.color.copy(palette.graphite);
    mats.lineHi.color.copy(palette.signal);
    mats.lineDim.color.copy(palette.rule);
    mats.grid.color.copy(palette.rule);
    const dark = palette.paper.getHSL({ h: 0, s: 0, l: 0 }).l < 0.4;
    ambient.intensity = dark ? 1.2 : 1.55;
    sun.intensity = dark ? 0.9 : 1.35;
    invalidate();
  };

  // ---- ground: drawing-board grid ----
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);

  const ground = new THREE.Mesh(track(new THREE.PlaneGeometry(600, 600)), mats.ground);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  scene.add(ground);
  {
    const pts: number[] = [];
    const size = 160;
    const step = 4;
    for (let i = -size; i <= size; i += step) {
      pts.push(-size, 0, i, size, 0, i, i, 0, -size, i, 0, size);
    }
    const g = track(new THREE.BufferGeometry());
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    scene.add(new THREE.LineSegments(g, mats.grid));
  }

  // ---- building parts ----
  type Part = { mesh: THREE.Mesh; lines: THREE.LineSegments };
  type Entry = { b: Building; group: THREE.Group; parts: Part[]; top: number; rise: number };
  const entries: Entry[] = [];
  const pickables: THREE.Mesh[] = [];

  const part = (group: THREE.Group, parts: Part[], geom: THREE.BufferGeometry, x: number, y: number, z: number, ry = 0, rx = 0, rz = 0) => {
    track(geom);
    const mesh = new THREE.Mesh(geom, mats.fill);
    const lines = new THREE.LineSegments(track(new THREE.EdgesGeometry(geom, 25)), mats.line);
    for (const o of [mesh, lines]) {
      o.position.set(x, y, z);
      o.rotation.set(rx, ry, rz);
      group.add(o);
    }
    parts.push({ mesh, lines });
    return mesh;
  };

  const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
  const cyl = (r: number, h: number, seg: number, rTop = r) => new THREE.CylinderGeometry(rTop, r, h, seg);
  const gable = (w: number, h: number, d: number) => {
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2, 0);
    shape.lineTo(w / 2, 0);
    shape.lineTo(0, h);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false });
    g.translate(0, 0, -d / 2);
    return g;
  };
  const saw = (w: number, h: number, d: number) => {
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2, 0);
    shape.lineTo(w / 2, 0);
    shape.lineTo(w / 2, h);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false });
    g.translate(0, 0, -d / 2);
    return g;
  };

  function build(b: Building): Entry {
    const group = new THREE.Group();
    const parts: Part[] = [];
    const h = b.h ?? 1;
    let top = 4;
    switch (b.kind) {
      case "keep": {
        part(group, parts, cyl(3.6, 15, 8), 0, 7.5, 0);
        part(group, parts, cyl(4.4, 1.6, 8), 0, 15.8, 0);
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
          part(group, parts, box(1.2, 1.3, 1.2), Math.cos(a) * 4.1, 17.25, Math.sin(a) * 4.1, -a);
        }
        part(group, parts, cyl(2.4, 6, 8, 0.01), 0, 19.6, 0);
        top = 23;
        break;
      }
      case "tower": {
        const th = 11 * h;
        part(group, parts, cyl(2.4, th, 10), 0, th / 2, 0);
        part(group, parts, cyl(3, 4, 10, 0.01), 0, th + 2, 0);
        top = th + 4.5;
        break;
      }
      case "gate": {
        for (const sx of [-4.6, 4.6]) {
          part(group, parts, cyl(2, 10, 8), sx, 5, 0);
          part(group, parts, cyl(2.5, 3.2, 8, 0.01), sx, 11.6, 0);
        }
        part(group, parts, box(7.4, 2.2, 2.2), 0, 7.6, 0);
        top = 13.5;
        break;
      }
      case "market": {
        part(group, parts, box(7, 2.4, 4.6), 0, 1.2, 0);
        part(group, parts, box(8.2, 0.3, 6), 0, 4.1, 0.2, 0, 0.16);
        for (const [px, pz] of [[-3.7, -2.6], [3.7, -2.6], [-3.7, 2.9], [3.7, 2.9]]) part(group, parts, box(0.3, 3.8, 0.3), px, 1.9, pz);
        top = 5.4;
        break;
      }
      case "archive": {
        let y = 0;
        [5.2, 4.4, 3.6, 2.8, 2].forEach((s, i) => {
          const lh = i === 4 ? 1.6 : 2.7;
          part(group, parts, box(s, lh, s), 0, y + lh / 2, 0);
          y += lh;
        });
        top = y + 1.4;
        break;
      }
      case "forge": {
        part(group, parts, box(6, 4, 5), 0, 2, 0);
        part(group, parts, gable(6.6, 2.8, 5.4), 0, 4, 0);
        part(group, parts, box(1.1, 4.4, 1.1), 2, 6, -1.4);
        top = 9.2;
        break;
      }
      case "hall": {
        part(group, parts, box(11, 3.6, 6.2), 0, 1.8, 0);
        for (let i = 0; i < 4; i++) part(group, parts, saw(2.75, 2.2, 6.2), -4.125 + i * 2.75, 3.6, 0);
        top = 7;
        break;
      }
      case "prism": {
        part(group, parts, box(6.4, 1.2, 6.4), 0, 0.6, 0);
        const crystal = new THREE.OctahedronGeometry(3.4, 0);
        crystal.scale(1, 1.9, 1);
        part(group, parts, crystal, 0, 7.7, 0, Math.PI / 4);
        top = 14.6;
        break;
      }
      case "house": {
        const hh = 2.6 * h;
        part(group, parts, box(3.3, hh, 3.3), 0, hh / 2, 0);
        part(group, parts, cyl(2.6, 1.9, 4, 0.01), 0, hh + 0.95, 0, Math.PI / 4);
        top = hh + 2.6;
        break;
      }
      case "stone": {
        const sh = 3.4 * h;
        part(group, parts, box(0.95, sh, 0.95), 0, sh / 2, 0);
        part(group, parts, cyl(0.75, 0.9, 4, 0.01), 0, sh + 0.45, 0, Math.PI / 4);
        top = sh + 1.6;
        break;
      }
    }
    group.position.set(b.x, 0, b.z);
    group.rotation.y = b.rot ?? 0;
    group.userData.id = b.id;
    for (const p of parts) {
      p.mesh.userData.id = b.id;
      pickables.push(p.mesh);
    }
    scene.add(group);
    const rise = Math.hypot(b.x, b.z);
    return { b, group, parts, top, rise };
  }

  for (const b of buildings) entries.push(build(b));
  const byId = new Map(entries.map((e) => [e.b.id, e]));

  // ---- wall (with a gap for the gate) and roads ----
  const wallParts: Part[] = [];
  const wallGroup = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const [x1, z1] = wallVertices[i];
    const [x2, z2] = wallVertices[(i + 1) % 6];
    const len = Math.hypot(x2 - x1, z2 - z1);
    const angle = -Math.atan2(z2 - z1, x2 - x1);
    const isGateEdge = Math.abs((z1 + z2) / 2 - GATE_Z) < 0.5;
    const pieces = isGateEdge ? [[-len / 2 + 2.2, -6.6], [6.6, len / 2 - 2.2]] : [[-len / 2 + 2.2, len / 2 - 2.2]];
    for (const [a, c] of pieces) {
      const plen = c - a;
      const mid = (a + c) / 2;
      const mx = (x1 + x2) / 2 + Math.cos(-angle) * mid;
      const mz = (z1 + z2) / 2 + Math.sin(-angle) * mid;
      part(wallGroup, wallParts, box(plen, 6.2, 1.6), mx, 3.1, mz, angle);
    }
  }
  scene.add(wallGroup);

  const roadGeom = (() => {
    const pts: number[] = [];
    for (const e of entries) {
      if (e.b.kind === "keep" || e.b.kind === "tower" || e.b.kind === "stone") continue;
      pts.push(0, 0.05, 0, e.b.x, 0.05, e.b.z);
    }
    // inner ring road
    const r = 27;
    for (let i = 0; i < 6; i++) {
      const a1 = (i / 6) * Math.PI * 2;
      const a2 = ((i + 1) / 6) * Math.PI * 2;
      pts.push(r * Math.cos(a1), 0.05, r * Math.sin(a1), r * Math.cos(a2), 0.05, r * Math.sin(a2));
    }
    const g = track(new THREE.BufferGeometry());
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  })();
  const roads = new THREE.LineSegments(roadGeom, mats.line);
  scene.add(roads);

  // ---- state ----
  let state: SceneState = sceneFor(opts.initialKey);
  let hovered: string | null = null;
  const cur = { target: new THREE.Vector3(...state.shot.target), distance: state.shot.distance * 1.35, azimuth: state.shot.azimuth - 0.5, elevation: state.shot.elevation + 0.15 };
  const want = { target: new THREE.Vector3(), distance: 0, azimuth: 0, elevation: 0 };

  const setWant = () => {
    want.target.set(...state.shot.target);
    want.distance = state.shot.distance;
    // shortest way round
    let az = state.shot.azimuth;
    while (az - cur.azimuth > Math.PI) az -= Math.PI * 2;
    while (az - cur.azimuth < -Math.PI) az += Math.PI * 2;
    want.azimuth = az;
    want.elevation = state.shot.elevation;
  };
  setWant();

  if (opts.reducedMotion) {
    cur.target.copy(want.target);
    cur.distance = want.distance;
    cur.azimuth = want.azimuth;
    cur.elevation = want.elevation;
  }

  const applyHighlight = () => {
    const hi = new Set(state.highlight);
    if (hovered) hi.add(hovered);
    const anyHi = hi.size > 0 || state.roads || state.wall;
    for (const e of entries) {
      const on = hi.has(e.b.id);
      for (const p of e.parts) {
        p.mesh.material = on ? mats.fillHi : mats.fill;
        p.lines.material = on ? mats.lineHi : anyHi ? mats.lineDim : mats.line;
      }
    }
    for (const p of wallParts) p.lines.material = state.wall ? mats.lineHi : anyHi ? mats.lineDim : mats.line;
    roads.material = state.roads ? mats.lineHi : anyHi ? mats.lineDim : mats.line;
  };
  applyHighlight();

  // ---- labels (HTML, projected) ----
  const labelEls = new Map<string, HTMLElement>();
  const v = new THREE.Vector3();
  const updateLabels = (w: number, h: number) => {
    const ids = new Set<string>();
    if (state.label && state.highlight.length <= 6) state.highlight.forEach((id) => ids.add(id));
    if (hovered) ids.add(hovered);
    for (const [id, el] of labelEls) {
      if (!ids.has(id)) {
        el.remove();
        labelEls.delete(id);
      }
    }
    for (const id of ids) {
      const e = byId.get(id);
      if (!e) continue;
      let el = labelEls.get(id);
      if (!el) {
        el = document.createElement("span");
        el.className = "citadel-label";
        el.textContent = e.b.label;
        labelLayer.appendChild(el);
        labelEls.set(id, el);
      }
      v.set(e.b.x, e.top * e.group.scale.y, e.b.z).project(camera);
      const visible = v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05;
      el.style.opacity = visible ? "1" : "0";
      el.style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px) translate(-50%, -130%)`;
    }
  };

  // ---- loop ----
  let raf = 0;
  let last = performance.now();
  const start = performance.now();
  const RISE_MS = opts.reducedMotion ? 0 : 1500;
  let width = 1;
  let height = 1;
  let visible = true;

  function invalidate() {
    if (!raf && visible && !document.hidden) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  function frame(now: number) {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    let moving = false;

    // opening: buildings rise from the plan, nearest the keep first
    const t = RISE_MS ? (now - start) / RISE_MS : 1;
    if (t < 1.4) {
      moving = true;
      for (const e of entries) {
        const local = Math.min(1, Math.max(0, (t - e.rise / 60) / 0.6));
        e.group.scale.y = Math.max(0.001, 1 - Math.pow(1 - local, 3));
      }
      const wl = Math.min(1, Math.max(0, (t - 0.35) / 0.7));
      wallGroup.scale.y = Math.max(0.001, 1 - Math.pow(1 - wl, 3));
    }

    // camera glide
    const k = 1 - Math.exp(-dt * 3);
    cur.target.lerp(want.target, k);
    cur.distance += (want.distance - cur.distance) * k;
    cur.azimuth += (want.azimuth - cur.azimuth) * k;
    cur.elevation += (want.elevation - cur.elevation) * k;
    if (
      cur.target.distanceTo(want.target) > 0.02 ||
      Math.abs(want.distance - cur.distance) > 0.02 ||
      Math.abs(want.azimuth - cur.azimuth) > 0.0005 ||
      Math.abs(want.elevation - cur.elevation) > 0.0005
    )
      moving = true;

    const ce = Math.cos(cur.elevation);
    camera.position.set(
      cur.target.x + cur.distance * ce * Math.sin(cur.azimuth),
      cur.target.y + cur.distance * Math.sin(cur.elevation),
      cur.target.z + cur.distance * ce * Math.cos(cur.azimuth)
    );
    camera.lookAt(cur.target);
    renderer.render(scene, camera);
    updateLabels(width, height);
    if (moving) invalidate();
  }

  const resize = () => {
    width = Math.max(1, host.clientWidth);
    height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = `${width}px`;
    renderer.domElement.style.height = `${height}px`;
    camera.aspect = width / height;
    // Keep the whole citadel in frame on tall, narrow screens.
    camera.fov = width / height < 0.9 ? 42 : 30;
    camera.updateProjectionMatrix();
    invalidate();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  // ---- input ----
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pick = (ev: PointerEvent) => {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(pickables, false)[0];
    return hit ? (hit.object.userData.id as string) : null;
  };
  const onMove = (ev: PointerEvent) => {
    if (ev.pointerType === "touch") return;
    const id = pick(ev);
    if (id !== hovered) {
      hovered = id;
      renderer.domElement.style.cursor = id ? "pointer" : "";
      applyHighlight();
      invalidate();
    }
  };
  const onLeave = () => {
    if (hovered) {
      hovered = null;
      renderer.domElement.style.cursor = "";
      applyHighlight();
      invalidate();
    }
  };
  let downAt: [number, number] | null = null;
  const onDown = (ev: PointerEvent) => (downAt = [ev.clientX, ev.clientY]);
  const onUp = (ev: PointerEvent) => {
    if (!downAt || Math.hypot(ev.clientX - downAt[0], ev.clientY - downAt[1]) > 6) return;
    const id = pick(ev);
    const e = id ? byId.get(id) : null;
    if (e) opts.onSelect(e.b.anchor);
  };
  renderer.domElement.addEventListener("pointermove", onMove);
  renderer.domElement.addEventListener("pointerleave", onLeave);
  renderer.domElement.addEventListener("pointerdown", onDown);
  renderer.domElement.addEventListener("pointerup", onUp);

  const onScene = (ev: Event) => {
    const key = (ev as CustomEvent<string>).detail;
    state = sceneFor(key);
    setWant();
    if (opts.reducedMotion) {
      cur.target.copy(want.target);
      cur.distance = want.distance;
      cur.azimuth = want.azimuth;
      cur.elevation = want.elevation;
    }
    applyHighlight();
    invalidate();
  };
  window.addEventListener("citadel:scene", onScene);
  window.addEventListener("portfolio:theme", recolor);
  const onVisibility = () => invalidate();
  document.addEventListener("visibilitychange", onVisibility);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    invalidate();
  });
  io.observe(host);

  recolor();
  invalidate();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("citadel:scene", onScene);
    window.removeEventListener("portfolio:theme", recolor);
    document.removeEventListener("visibilitychange", onVisibility);
    for (const el of labelEls.values()) el.remove();
    for (const d of disposables) d.dispose();
    for (const m of Object.values(mats)) m.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
