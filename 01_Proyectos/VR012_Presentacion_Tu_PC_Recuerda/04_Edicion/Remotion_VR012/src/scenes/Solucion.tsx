import React from "react";
import { AbsoluteFill } from "remotion";
import { at, atEnd, C, clamp01, E, ease, ESC, lerp, prog, rnd, spr, win } from "../theme";
import { centerOf, Layout, lerpRect, place, screenOf } from "../layout";
import { BASE } from "../windows";
import { Cam, Desk, WS } from "../components/Desk";
import { Cursor, shake } from "../components/Bits";
import { Card, Core } from "../components/Memory";
import { messy, messyRot } from "./Problema";

type P = { t: number; L: Layout };
export const cardSize = (L: Layout) => (L.vertical ? { w: 560, h: 340 } : { w: 470, h: 290 });

// ───────── 5 · «¿Y si tu escritorio tuviera memoria?» ─────────
export const S05: React.FC<P> = ({ t, L }) => {
  const a = ESC.t05.a;
  const tm = at("t05", "memoria");
  const fade = E(t, a, 0.9, ease.inOut);
  const coreK = E(t, at("t05", "escritorio") - 0.1, 1.6, ease.out) * 0.55 + E(t, tm - 0.05, 0.5, ease.back) * 0.45;
  const wins: WS[] = BASE.map((s) => ({ slot: s, r: messy(L, s, s.id + "f"), rotate: messyRot(s.id + "f"), desat: 1, blur: 3 + fade * 5 }));
  const R = L.vertical ? 150 : 135;
  return (
    <AbsoluteFill>
      <Cam s={1.04 - 0.14 * fade} ox={L.c.x} oy={L.c.y} opacity={1 - 0.88 * fade} filter="grayscale(1)">
        <Desk L={L} t={t} wins={wins} />
      </Cam>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${L.c.x}px ${L.c.y}px, ${C.amber}${Math.round(40 * E(t, tm, 0.4)).toString(16).padStart(2, "0")}, transparent ${L.vertical ? 45 : 40}%)` }} />
      <Core x={L.c.x} y={L.c.y} R={R} k={coreK} t={t} wave={t > tm ? (t - tm) / 0.9 : -1} />
    </AbsoluteFill>
  );
};

// ───────── 6 · «Lo montas una vez, a tu manera: tus apps, tus pestañas, tus proyectos. Cada uno en su sitio.» ─────────
export const S06: React.FC<P> = ({ t, L }) => {
  const a = ESC.t06.a;
  const appear: Record<string, number> = {
    w1: at("t06", "montas"), w5: at("t06", "apps"), w6: at("t06", "apps") + 0.14,
    w2: at("t06", "pestañas"),
    w4: at("t06", "proyectos"), w3: at("t06", "proyectos") + 0.14,
  };
  const tc = at("t06", "cada");
  const tsit = at("t06", "sitio");
  const ts = atEnd("t06", "sitio") + 0.08; // guardar
  const scan = prog(t, ts, ts + 0.38);
  const suck = prog(t, ts + 0.3, ts + 0.85);
  const cs = cardSize(L);
  const cardK = E(t, ts + 0.42, 0.45);
  const deskIn = E(t, a, 0.6);
  const zones = win(t, tc, ts + 0.2, 0.25, 0.25);
  const wins: WS[] = BASE.map((s, i) => {
    const dest = place(L, s.mon, s.f);
    const ap = spr(t, appear[s.id] - 0.05, 1.7, 7);
    const off = { x: (rnd(s.id + "ox") - 0.5) * 120 * L.u, y: (rnd(s.id + "oy") - 0.5) * 80 * L.u + Math.sin(t * 2 + i) * 6 };
    const float = { ...dest, x: dest.x + off.x + dest.w * 0.08, y: dest.y + off.y + dest.h * 0.08, w: dest.w * 0.84, h: dest.h * 0.84 };
    const snapT = tsit - 0.15 + i * 0.06;
    const sn = spr(t, snapT, 2.2, 8);
    let r = lerpRect(float, dest, Math.min(1.03, sn));
    // succión hacia la tarjeta
    if (suck > 0) {
      const e = ease.in(clamp01((suck - i * 0.04) / 0.8));
      const tgt = { x: L.c.x - 20, y: L.c.y - 12, w: 40, h: 24 };
      r = lerpRect(dest, tgt, e);
    }
    const flash = t > snapT + 0.1 ? Math.max(0, 1 - (t - snapT - 0.1) / 0.6) : 0;
    return {
      slot: s, r, opacity: (ap > 0 ? Math.min(1, ap * 1.4) : 0) * (1 - clamp01((suck - 0.75) / 0.25)),
      scale: 0.7 + 0.3 * Math.min(1, ap), rotate: (1 - Math.min(1, sn)) * (rnd(s.id + "rt") - 0.5) * 8,
      glow: C.amber, glowAmt: flash, blur: suck * 4,
    };
  });
  const zoneLayer = (mon: 0 | 1) =>
    zones > 0 &&
    BASE.filter((s) => s.mon === mon).map((s) => {
      const r = place(L, s.mon, s.f);
      return <div key={s.id} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 10, border: `2px dashed ${C.cyan}`, background: `${C.cyan}10`, opacity: zones * 0.8 }} />;
    });
  const scanLine = (mon: 0 | 1) => {
    if (scan <= 0 || scan >= 1) return null;
    const s = screenOf(L.mon[mon], L.u);
    return <div style={{ position: "absolute", left: s.x + s.w * scan - 3, top: s.y, width: 6, height: s.h, background: C.amber, boxShadow: `0 0 40px 12px ${C.amber}aa`, opacity: Math.sin(scan * Math.PI) }} />;
  };
  const coreOut = 1 - E(t, a, 0.5);
  return (
    <AbsoluteFill>
      <Core x={L.c.x} y={L.c.y} R={L.vertical ? 150 : 135} k={coreOut} t={t} opacity={coreOut} />
      <Cam s={0.94 + 0.06 * deskIn} ox={L.c.x} oy={L.c.y} opacity={deskIn * (1 - 0.45 * E(t, ts + 0.5, 0.5))}>
        <Desk L={L} t={t} wins={wins} overlay={[zoneLayer(0), zoneLayer(1)]} edge={C.amber} edgeAmt={scan > 0 && scan < 1 ? 0.8 : 0} />
        {scanLine(0)}
        {scanLine(1)}
      </Cam>
      <Card L={L} x={L.c.x} y={L.c.y} w={cs.w} h={cs.h} k={cardK} map={E(t, ts + 0.6, 0.4)} />
    </AbsoluteFill>
  );
};

// ───────── 7 · «Y a partir de ahí, un clic… y vuelve todo. Tal y como lo guardaste.» ─────────
export const S07: React.FC<P> = ({ t, L }) => {
  const a = ESC.t07.a;
  const tc = at("t07", "clic");
  const tv = at("t07", "vuelve");
  const tt = at("t07", "tal");
  const cs = cardSize(L);
  const start = { x: L.W * 0.88, y: L.H * (L.vertical ? 0.62 : 0.95) };
  const target = { x: L.c.x + cs.w * 0.18, y: L.c.y + cs.h * 0.12 };
  const mv = ease.inOut(prog(t, a + 0.15, tc - 0.02));
  const cur = { x: lerp(start.x, target.x, mv), y: lerp(start.y, target.y, mv) - Math.sin(mv * Math.PI) * 80 };
  const clickK = t >= tc ? (t - tc) / 0.7 : -1;
  const press = t > tc && t < tc + 0.18 ? 0.93 : 1;
  const out = E(t, tv - 0.05, 0.45, ease.in);
  const deskBright = 0.55 + 0.45 * E(t, tv, 0.5);
  const wins: WS[] = BASE.map((s, i) => {
    const dest = place(L, s.mon, s.f);
    const t0 = tv - 0.04 + i * 0.05;
    const k = spr(t, t0, 1.6, 7.5);
    const from = { x: L.c.x - 30, y: L.c.y - 18, w: 60, h: 36 };
    const r = lerpRect(from, dest, Math.min(1.03, k));
    const arc = Math.sin(clamp01(k) * Math.PI) * -120 * L.u;
    const land = t - t0 - 0.35;
    return {
      slot: s, r: { ...r, y: r.y + arc }, opacity: t > t0 ? 1 : 0, blur: Math.max(0, (1 - Math.min(1, k)) * 8),
      glow: C.green, glowAmt: land > 0 ? Math.max(0, 1 - land / 1.0) : t > t0 ? 0.6 : 0,
    };
  });
  const ghosts = win(t, tt - 0.05, tt + 1.0, 0.2, 0.35);
  const ghostLayer = (mon: 0 | 1) =>
    ghosts > 0 &&
    BASE.filter((s) => s.mon === mon).map((s) => {
      const r = place(L, s.mon, s.f);
      const p = 1 + 0.03 * Math.sin(clamp01((t - tt) / 0.5) * Math.PI);
      return <div key={s.id} style={{ position: "absolute", left: r.x - 6, top: r.y - 6, width: r.w + 12, height: r.h + 12, borderRadius: 12, border: `2.5px dashed ${C.amber}`, opacity: ghosts, transform: `scale(${p})`, zIndex: 5 }} />;
    });
  const sh = shake(t, [tv + 0.32], 9);
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.03 * E(t, tv, 2.5)} x={sh.x} y={sh.y} ox={L.c.x} oy={L.c.y}>
        <Cam s={1} ox={0} oy={0} opacity={deskBright}>
          <Desk L={L} t={t} wins={wins} edge={C.green} edgeAmt={win(t, tv + 0.3, tv + 0.9, 0.1, 0.6) * 0.7} />
        </Cam>
        <div style={{ position: "absolute", inset: 0, zIndex: 6 }}>
          {ghostLayer(0)}
          {ghostLayer(1)}
        </div>
      </Cam>
      <Card L={L} x={L.c.x} y={L.c.y} w={cs.w} h={cs.h} k={1 - out} press={press} glow={1 + (t > tc && t < tv ? 0.6 * Math.sin((t - tc) * 10) ** 2 : 0)} />
      <Cursor x={cur.x} y={cur.y} s={L.u * 1.2} click={clickK} color={C.green} opacity={1 - E(t, tv + 0.2, 0.4)} />
    </AbsoluteFill>
  );
};
export { centerOf };
