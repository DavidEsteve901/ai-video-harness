import React from "react";
import { AbsoluteFill } from "remotion";
import { at, atEnd, C, clamp01, E, ease, ESC, prog, rnd, spr, toma, win } from "../theme";
import { Layout, lerpRect, place, Rect, screenOf } from "../layout";
import { ACCENT, BASE, CREAR, ESTUDIAR, PROGRAMAR, Slot } from "../windows";
import { Cam, Desk, WS } from "../components/Desk";

type P = { t: number; L: Layout };

// ───────── 8 · «Un espacio para programar. Otro para estudiar. Otro para crear. Y saltas de uno a otro sin perder el hilo.» ─────────
const ICONS = [
  "M8 7 L3 12 L8 17 M16 7 L21 12 L16 17 M14 4 L10 20",
  "M3 5 H9 A3 3 0 0 1 12 8 V20 A2.5 2.5 0 0 0 9.5 17.5 H3 Z M21 5 H15 A3 3 0 0 0 12 8 V20 A2.5 2.5 0 0 1 14.5 17.5 H21 Z",
  "M4 20 L8 19 L19.5 7.5 A2.1 2.1 0 0 0 16.5 4.5 L5 16 Z M14.5 6.5 L17.5 9.5",
];
const SETS = [PROGRAMAR, ESTUDIAR, CREAR];

export const deskShrink = (L: Layout) => (L.vertical ? { s: 0.88, ox: 540, oy: 230, rowY: 1218, cw: 296, ch: 96, gap: 22 } : { s: 0.84, ox: 960, oy: 40, rowY: 748, cw: 270, ch: 86, gap: 34 });

const MiniMap: React.FC<{ L: Layout; slots: Slot[]; w: number; h: number }> = ({ L, slots, w, h }) => {
  const minX = L.mon[0].x, maxX = Math.max(L.mon[0].x + L.mon[0].w, L.mon[1].x + L.mon[1].w);
  const minY = Math.min(L.mon[0].y, L.mon[1].y), maxY = Math.max(L.mon[0].y + L.mon[0].h, L.mon[1].y + L.mon[1].h);
  const sc = Math.min(w / (maxX - minX), h / (maxY - minY));
  return (
    <div style={{ position: "relative", width: (maxX - minX) * sc, height: (maxY - minY) * sc }}>
      {slots.map((s) => {
        const r = place(L, s.mon, s.f, 6);
        return <div key={s.id} style={{ position: "absolute", left: (r.x - minX) * sc, top: (r.y - minY) * sc, width: r.w * sc - 1.5, height: r.h * sc - 1.5, borderRadius: 2, background: ACCENT[s.kind], opacity: 0.85 }} />;
      })}
    </div>
  );
};

export const S08: React.FC<P> = ({ t, L }) => {
  const a = ESC.t08.a;
  const T = [at("t08", "programar"), at("t08", "estudiar"), at("t08", "crear")];
  const ts = at("t08", "saltas");
  const tsin = at("t08", "sin");
  const th = atEnd("t08", "hilo");
  const sw: { at: number; set: Slot[]; idx: number; d: number }[] = [
    { at: -99, set: BASE, idx: -1, d: 0.35 },
    { at: T[0] - 0.12, set: PROGRAMAR, idx: 0, d: 0.36 },
    { at: T[1] - 0.12, set: ESTUDIAR, idx: 1, d: 0.36 },
    { at: T[2] - 0.12, set: CREAR, idx: 2, d: 0.36 },
    { at: ts - 0.05, set: PROGRAMAR, idx: 0, d: 0.2 },
    { at: ts + 0.22, set: ESTUDIAR, idx: 1, d: 0.2 },
    { at: ts + 0.49, set: CREAR, idx: 2, d: 0.2 },
    { at: ts + 0.76, set: PROGRAMAR, idx: 0, d: 0.24 },
  ];
  let cur = 0;
  sw.forEach((s, i) => { if (t >= s.at) cur = i; });
  const k = ease.inOut(clamp01((t - sw[cur].at) / sw[cur].d));
  const prev = cur > 0 ? sw[cur - 1] : null;
  const fast = sw[cur].d < 0.3;
  const shift = (s: Slot, dir: number, kk: number): WS => {
    const scr = screenOf(L.mon[s.mon], L.u);
    const r = place(L, s.mon, s.f);
    return { slot: s, r: { ...r, x: r.x + dir * scr.w * 0.75 * kk }, opacity: 1 - Math.abs(kk) * 0.6, blur: Math.abs(Math.sin(kk * Math.PI)) * (fast ? 14 : 8) + Math.abs(kk) * 4 };
  };
  const wins: WS[] = [];
  if (prev && k < 1) prev.set.forEach((s) => wins.push(shift(s, -1, k)));
  sw[cur].set.forEach((s) => wins.push(shift(s, 1, 1 - k)));
  const D = deskShrink(L);
  const sk = E(t, a, 0.5, ease.inOut);
  const rowO = E(t, T[0] - 0.4, 0.4);
  const active = sw[cur].idx;
  const totalW = 3 * D.cw + 2 * D.gap;
  const cx = (i: number) => L.W / 2 - totalW / 2 + i * (D.cw + D.gap) + D.cw / 2;
  const thread = prog(t, tsin - 0.1, th + 0.1);
  return (
    <AbsoluteFill>
      <Cam s={1 - (1 - D.s) * sk} ox={D.ox} oy={D.oy}>
        <Desk L={L} t={t} wins={wins} clip />
      </Cam>
      {/* hilo ámbar entre los espacios */}
      {thread > 0 && (
        <svg style={{ position: "absolute", left: 0, top: 0, width: L.W, height: L.H, overflow: "visible", zIndex: 5 }}>
          <path
            d={`M ${cx(0)} ${D.rowY + D.ch / 2} C ${cx(0) + D.cw * 0.5} ${D.rowY + D.ch / 2 + 46}, ${cx(1) - D.cw * 0.5} ${D.rowY + D.ch / 2 + 46}, ${cx(1)} ${D.rowY + D.ch / 2} S ${cx(2) - D.cw * 0.5} ${D.rowY + D.ch / 2 + 46}, ${cx(2)} ${D.rowY + D.ch / 2}`}
            fill="none" stroke={C.amber} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ease.inOut(thread)}
            style={{ filter: `drop-shadow(0 0 10px ${C.amber})` }}
          />
        </svg>
      )}
      {[0, 1, 2].map((i) => {
        const on = active === i ? 1 : 0;
        const app = spr(t, T[i] - 0.45, 1.8, 7);
        const sc = 0.6 + 0.4 * Math.min(1.04, app);
        const lit = on * (fast ? 1 : E(t, sw[cur].at, 0.2));
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: cx(i) - D.cw / 2, top: D.rowY - D.ch / 2, width: D.cw, height: D.ch, borderRadius: D.ch / 2,
              background: lit ? "linear-gradient(160deg, rgba(56,44,20,0.96), rgba(22,18,12,0.96))" : "rgba(18,22,32,0.92)",
              border: `2px solid ${lit ? C.amber : "rgba(255,255,255,0.12)"}`, boxShadow: lit ? `0 0 40px ${C.amber}77` : "0 20px 40px rgba(0,0,0,0.5)",
              transform: `scale(${sc * (1 + 0.07 * lit)})`, opacity: rowO * clamp01(app * 2) * (1 - E(t, ESC.t08.b - 0.2, 0.3)),
              display: "flex", alignItems: "center", gap: D.ch * 0.2, paddingLeft: D.ch * 0.32,
            }}
          >
            <svg viewBox="0 0 24 24" width={D.ch * 0.46} height={D.ch * 0.46}>
              <path d={ICONS[i]} fill="none" stroke={lit ? C.amber : C.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ opacity: 0.9 }}>
              <MiniMap L={L} slots={SETS[i]} w={D.cw * 0.55} h={D.ch * 0.56} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ───────── 9 · «Las ventanas encajan solas en su zona. Y si te apetece, se lo pides con la voz.» ─────────
const ZONAS: Slot[] = [
  { id: "z1", kind: "code", mon: 0, f: { x: 0, y: 0, w: 0.5, h: 1 } },
  { id: "z2", kind: "browser", mon: 0, f: { x: 0.5, y: 0, w: 0.5, h: 0.5 } },
  { id: "z3", kind: "terminal", mon: 0, f: { x: 0.5, y: 0.5, w: 0.5, h: 0.5 } },
  { id: "z4", kind: "notes", mon: 1, f: { x: 0, y: 0, w: 0.5, h: 1 } },
  { id: "z5", kind: "music", mon: 1, f: { x: 0.5, y: 0, w: 0.5, h: 1 } },
];
// tras pedirlo con la voz: la IA reordena la pantalla principal
const VOZ_REORDEN: Record<string, Slot["f"]> = {
  z1: { x: 0.34, y: 0, w: 0.66, h: 1 },
  z2: { x: 0, y: 0, w: 0.34, h: 0.5 },
  z3: { x: 0, y: 0.5, w: 0.34, h: 0.5 },
};

/** Esfera del asistente (puntos en espiral de Fibonacci) */
export const Orb: React.FC<{ x: number; y: number; R: number; t: number; level: number; k: number }> = ({ x, y, R, t, level, k }) => {
  if (k <= 0) return null;
  const N = 150;
  const rot = t * 0.9;
  const r = R * (0.6 + 0.4 * ease.back(clamp01(k))) * (1 + level * 0.08);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: clamp01(k * 2) }}>
      <div style={{ position: "absolute", left: x - r * 2.2, top: y - r * 2.2, width: r * 4.4, height: r * 4.4, borderRadius: 999, background: `radial-gradient(circle, ${C.amber}${level > 0.3 ? "55" : "33"}, transparent 65%)` }} />
      {[0, 1, 2].map((i) => {
        const ph = ((t * 1.4 + i / 3) % 1);
        return level > 0.05 ? <div key={i} style={{ position: "absolute", left: x - r * (1 + ph * 1.2), top: y - r * (1 + ph * 1.2), width: 2 * r * (1 + ph * 1.2), height: 2 * r * (1 + ph * 1.2), borderRadius: 999, border: `2px solid ${C.amber}`, opacity: (1 - ph) * 0.6 * level }} /> : null;
      })}
      {Array.from({ length: N }).map((_, i) => {
        const yy = 1 - (2 * (i + 0.5)) / N;
        const rad = Math.sqrt(1 - yy * yy);
        const th = i * 2.39996 + rot;
        const X = Math.cos(th) * rad, Z = Math.sin(th) * rad;
        const depth = (Z + 1) / 2;
        const wob = 1 + level * 0.12 * Math.sin(t * 9 + i);
        const s = 2 + depth * 3.5;
        return <div key={i} style={{ position: "absolute", left: x + X * r * wob - s / 2, top: y + yy * r * wob - s / 2, width: s, height: s, borderRadius: 99, background: depth > 0.5 ? "#FFE2A8" : C.amber, opacity: 0.25 + 0.75 * depth }} />;
      })}
    </div>
  );
};

/** nivel de voz aproximado: 1 mientras suena una palabra de la toma */
export const voiceLevel = (t: number, id: string) => {
  const ps = toma(id).palabras;
  let l = 0;
  for (const p of ps) if (t >= p.s - 0.03 && t <= p.e + 0.05) l = 0.65 + 0.35 * Math.abs(Math.sin(t * 22 + p.s * 7));
  return l;
};

export const S09: React.FC<P> = ({ t, L }) => {
  const a = ESC.t09.a;
  const snaps: Record<string, number> = {
    z1: at("t09", "encajan") - 0.05, z4: at("t09", "encajan") + 0.12,
    z2: at("t09", "solas") - 0.02, z5: at("t09", "solas") + 0.15,
    z3: at("t09", "zona") - 0.05,
  };
  const ty = at("t09", "y");
  const tv = at("t09", "voz");
  const D = deskShrink(L);
  const back = E(t, a, 0.5, ease.inOut);
  const grid = win(t, a + 0.1, tv + 0.2, 0.3, 0.4);
  const reo = prog(t, tv + 0.08, tv + 0.6);
  const reoE = ease.inOut(reo);
  const zonesOf = (mon: 0 | 1) =>
    grid > 0 &&
    ZONAS.filter((z) => z.mon === mon).map((z) => {
      const r = place(L, z.mon, z.f);
      const lit = win(t, snaps[z.id] - 0.12, snaps[z.id] + 0.25, 0.08, 0.35);
      return <div key={z.id} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 10, border: `2px dashed ${C.cyan}`, background: `${C.cyan}${lit > 0 ? "30" : "08"}`, opacity: grid * (0.55 + 0.45 * lit), boxShadow: lit > 0 ? `0 0 30px ${C.cyan}66` : undefined }} />;
    });
  const wins: WS[] = ZONAS.map((z) => {
    const dest = place(L, z.mon, z.f);
    const scr = screenOf(L.mon[z.mon], L.u);
    const ts = snaps[z.id];
    const fly = ease.out(prog(t, ts - 0.55, ts));
    const from: Rect = { x: scr.x + scr.w * (rnd(z.id + "fx") > 0.5 ? 1.1 : -0.5), y: scr.y + scr.h * (rnd(z.id + "fy") - 0.2), w: dest.w * 0.7, h: dest.h * 0.7 };
    const near: Rect = { x: dest.x + dest.w * 0.12 + (rnd(z.id + "nx") - 0.5) * 40, y: dest.y + dest.h * 0.1 + (rnd(z.id + "ny") - 0.5) * 30, w: dest.w * 0.78, h: dest.h * 0.78 };
    const sn = spr(t, ts, 2.4, 8);
    let r = t < ts ? lerpRect(from, near, fly) : lerpRect(near, dest, Math.min(1.03, sn));
    let glow = C.cyan, glowAmt = t > ts ? Math.max(0, 1 - (t - ts) / 0.5) * 0.8 : 0;
    if (VOZ_REORDEN[z.id] && reo > 0) {
      r = lerpRect(dest, place(L, 0, VOZ_REORDEN[z.id]), reoE);
      glow = reo < 1 ? C.amber : C.green;
      glowAmt = reo < 1 ? 0.9 : Math.max(0, 1 - (t - tv - 0.6) / 0.7);
    }
    return { slot: z, r, opacity: t > ts - 0.55 ? 1 : 0, rotate: t < ts ? (1 - fly) * (rnd(z.id + "r") - 0.5) * 30 + (rnd(z.id + "r2") - 0.5) * 6 : (1 - Math.min(1, sn)) * 4, glow, glowAmt, blur: t < ts ? (1 - fly) * 8 : 0 };
  });
  const orbPos = L.vertical ? { x: 900, y: 826, R: 66 } : { x: 1510, y: 640, R: 72 };
  return (
    <AbsoluteFill>
      <Cam s={D.s + (1 - D.s) * back} ox={D.ox} oy={D.oy}>
        <Desk L={L} t={t} wins={wins} overlay={[zonesOf(0), zonesOf(1)]} />
      </Cam>
      <Orb x={orbPos.x} y={orbPos.y} R={orbPos.R} t={t} level={voiceLevel(t, "t09") * (t > ty ? 1 : 0)} k={E(t, ty - 0.2, 0.5) * (1 - E(t, ESC.t09.b - 0.25, 0.3))} />
    </AbsoluteFill>
  );
};
