/*
 * Moon Golf sound effects, synthesised with the Web Audio API (no audio files to download).
 * Browsers only allow audio after a user gesture, so `unlock()` is called from the Play button.
 * The on/off choice is remembered in localStorage.
 */

export type SurfaceSound = 0 | 1 | 2; // dust, rock, pad
export type Sfx = ReturnType<typeof createSfx>;

const KEY = "moongolf:sound";
const VOLUME = 0.5;

function readPref() {
  try {
    return window.localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

export function createSfx() {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let noise: AudioBuffer | null = null;
  let enabled = readPref();
  let lastBounce = 0;
  let lastTick = 0;

  function unlock() {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = enabled ? VOLUME : 0;
      master.connect(ctx.destination);
      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") void ctx.resume();
  }

  function setEnabled(on: boolean) {
    enabled = on;
    try {
      window.localStorage.setItem(KEY, on ? "on" : "off");
    } catch {
      /* not remembered */
    }
    if (on) unlock();
    if (ctx && master) master.gain.setTargetAtTime(on ? VOLUME : 0, ctx.currentTime, 0.02);
  }

  const live = () => (enabled && ctx && master ? { ctx, out: master } : null);

  type ToneOpts = { type?: OscillatorType; dur: number; gain: number; slideTo?: number; delay?: number; attack?: number };
  function tone(freq: number, o: ToneOpts) {
    const a = live();
    if (!a) return;
    const t = a.ctx.currentTime + (o.delay ?? 0);
    const osc = a.ctx.createOscillator();
    const g = a.ctx.createGain();
    osc.type = o.type ?? "sine";
    osc.frequency.setValueAtTime(freq, t);
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t + o.dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, o.gain), t + (o.attack ?? 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    osc.connect(g).connect(a.out);
    osc.start(t);
    osc.stop(t + o.dur + 0.05);
  }

  type NoiseOpts = { dur: number; gain: number; filter: BiquadFilterType; freq: number; q?: number; slideTo?: number; delay?: number; attack?: number };
  function hiss(o: NoiseOpts) {
    const a = live();
    if (!a || !noise) return;
    const t = a.ctx.currentTime + (o.delay ?? 0);
    const src = a.ctx.createBufferSource();
    src.buffer = noise;
    const f = a.ctx.createBiquadFilter();
    f.type = o.filter;
    f.frequency.setValueAtTime(o.freq, t);
    if (o.slideTo) f.frequency.exponentialRampToValueAtTime(o.slideTo, t + o.dur);
    f.Q.value = o.q ?? 1;
    const g = a.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, o.gain), t + (o.attack ?? 0.004));
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    src.connect(f).connect(g).connect(a.out);
    src.start(t, Math.random() * 0.5);
    src.stop(t + o.dur + 0.05);
  }

  const notes = (freqs: number[], step: number, o: Omit<ToneOpts, "delay">) => freqs.forEach((f, i) => tone(f, { ...o, delay: i * step }));

  return {
    unlock,
    setEnabled,
    get enabled() {
      return enabled;
    },

    /** Power crossing each 10% while aiming. */
    tick(power: number) {
      const now = performance.now();
      if (now - lastTick < 25) return;
      lastTick = now;
      tone(420 + power * 700, { type: "triangle", dur: 0.035, gain: 0.05 });
    },

    /** Swing whoosh and club contact. */
    hit(club: "driver" | "iron" | "wedge" | "putter", power: number) {
      const p = Math.max(0.15, power);
      if (club === "putter") {
        tone(900, { type: "triangle", dur: 0.07, gain: 0.18 * p + 0.05, slideTo: 600 });
        return;
      }
      hiss({ dur: 0.16, gain: 0.12 * p, filter: "bandpass", freq: 700, slideTo: 3200, q: 0.8, attack: 0.06 });
      tone(club === "driver" ? 1500 : club === "iron" ? 1900 : 2300, { type: "triangle", dur: 0.06, gain: 0.22 * p, slideTo: 500, delay: 0.06 });
      hiss({ dur: 0.03, gain: 0.25 * p, filter: "highpass", freq: 2500, delay: 0.06 });
    },

    /** The ball landing, by surface. Speed is the impact speed in world units/s. */
    bounce(kind: SurfaceSound, speed: number) {
      const now = performance.now();
      if (now - lastBounce < 45) return;
      lastBounce = now;
      const v = Math.min(1, speed / 320);
      if (v < 0.08) return;
      if (kind === 0) {
        hiss({ dur: 0.14, gain: 0.35 * v, filter: "lowpass", freq: 520, slideTo: 160, q: 0.7 });
        tone(110, { dur: 0.1, gain: 0.18 * v, slideTo: 60 });
      } else if (kind === 1) {
        tone(620 + Math.random() * 80, { type: "triangle", dur: 0.16, gain: 0.22 * v, slideTo: 420 });
        tone(1240, { dur: 0.08, gain: 0.08 * v });
        hiss({ dur: 0.04, gain: 0.15 * v, filter: "highpass", freq: 1800 });
      } else {
        tone(380, { type: "triangle", dur: 0.09, gain: 0.16 * v, slideTo: 300 });
      }
    },

    /** Into the cup: a rattle, then a chime. */
    cup() {
      [0, 0.06, 0.11].forEach((d, i) => tone(900 - i * 120, { type: "triangle", dur: 0.05, gain: 0.14, delay: d }));
      notes([1046.5, 1318.5, 1568], 0.09, { dur: 0.5, gain: 0.16 });
    },

    outOfBounds() {
      tone(330, { type: "square", dur: 0.28, gain: 0.07, slideTo: 140 });
    },

    /** A hole finished; diff is strokes minus par for the human. */
    result(diff: number) {
      if (diff <= -1) notes([784, 988, 1175, 1568], 0.08, { dur: 0.35, gain: 0.13 });
      else if (diff === 0) notes([659, 880], 0.1, { dur: 0.3, gain: 0.12 });
      else notes([440, 370], 0.14, { type: "triangle", dur: 0.3, gain: 0.1 });
    },

    round(outcome: "win" | "loss" | "tie" | "solo") {
      if (outcome === "loss") notes([523, 466, 392], 0.16, { type: "triangle", dur: 0.4, gain: 0.11 });
      else notes([523, 659, 784, 1046.5, 1318.5], 0.09, { dur: 0.55, gain: 0.13 });
    },

    botTurn() {
      notes([520, 780], 0.07, { type: "sine", dur: 0.09, gain: 0.07 });
    },

    click() {
      tone(1200, { type: "triangle", dur: 0.03, gain: 0.06 });
    },

    destroy() {
      void ctx?.close();
      ctx = null;
      master = null;
    }
  };
}
