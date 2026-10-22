import React from "react";
import { AbsoluteFill } from "remotion";
import { at, atEnd, C, clamp01, E, ease, ESC, LANG, lerp, prog, rnd, spr, toma, win } from "../theme";
import { centerOf, Layout, lerpRect, place, Rect } from "../layout";
import { BASE, Slot } from "../windows";
import { Cam, Desk, WS } from "../components/Desk";
import { Cursor, Dust, shake } from "../components/Bits";

type P = { t: number; L: Layout };

/** Posición desordenada de una ventana (amontonada en la pantalla principal) */
export const messy = (L: Layout, s: Slot, seed: string): Rect => {
  const m = L.mon[0];
  const w = m.w * (0.3 + rnd(seed + "w") * 0.18);
  const h = w * (0.55 + rnd(seed + "h") * 0.2);
  return { x: m.x + m.w * (0.08 + rnd(seed + "x") * 0.5), y: m.y + m.h * (0.1 + rnd(seed + "y") * 0.38), w, h };
};
export const messyRot = (seed: string) => (rnd(seed + "r") - 0.5) * 10;

// ───────── 1 · «Tu ordenador tiene amnesia.» ─────────
export const S01: React.FC<P> = ({ t, L }) => {
  const ta = at("t01", "amnesia");
  const off = prog(t, ta + 0.32, ta + 0.86);
  const wins: WS[] = BASE.map((s, i) => {
    const t0 = 0.04 + i * 0.12;
    const k = spr(t, t0, 1.5, 6.5);
    const dest = place(L, s.mon, s.f);
    const ang = rnd(s.id + "a") * Math.PI * 2;
    const dist = 900 + rnd(s.id + "d") * 400;
    const from = { ...dest, x: dest.x + Math.cos(ang) * dist, y: dest.y + Math.sin(ang) * dist * 0.6, w: dest.w * 0.6, h: dest.h * 0.6 };
    const land = clamp01((t - t0 - 0.28) / 0.6);
    return {
      slot: s,
      r: lerpRect(from, dest, Math.min(1.04, k)),
      opacity: clamp01((t - t0) / 0.1),
      rotate: (1 - Math.min(1, k)) * (rnd(s.id + "r") - 0.5) * 40,
      blur: Math.max(0, (1 - clamp01(k)) * 10),
      glow: C.cyan,
      glowAmt: land > 0 && land < 1 ? (1 - land) * 0.7 : 0,
    };
  });
  // glitch en «amnesia»
  const g = t > ta - 0.04 && t < ta + 0.4 ? 1 : 0;
  const gx = g * Math.sin(t * 140) * 14;
  const sh = shake(t, [ta], 14);
  const push = 1 + 0.05 * E(t, 0, 3.2, ease.inOut);
  return (
    <AbsoluteFill>
      <Cam s={push} x={sh.x + gx * 0.4} y={sh.y} ox={L.c.x} oy={L.c.y} filter={g ? `drop-shadow(${gx}px 0 0 rgba(255,0,80,0.55)) drop-shadow(${-gx}px 0 0 rgba(0,229,255,0.55))` : undefined}>
        <Desk L={L} t={t} wins={wins} power={[E(t, 0, 0.2), E(t, 0.1, 0.2)]} crt={[off, Math.min(1, off * 1.08)]} />
        {g > 0 &&
          [0, 1, 2].map((i) => {
            const y = L.mon[0].y + rnd("gl" + i + Math.floor(t * 30)) * (L.mon[0].h + 300);
            return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, height: 6 + rnd("gh" + i + Math.floor(t * 30)) * 18, background: i % 2 ? "rgba(255,90,95,0.35)" : "rgba(79,209,255,0.25)", mixBlendMode: "screen" }} />;
          })}
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 2 · «Cada vez que lo enciendes, se le olvida cómo trabajas.» ─────────
export const S02: React.FC<P> = ({ t, L }) => {
  const te = at("t02", "enciendes");
  const to = at("t02", "olvida");
  const on = prog(t, te + 0.05, te + 0.4);
  const crt = 1 - ease.out(on);
  // botón de encendido
  const btn = win(t, ESC.t02.a, te + 0.35, 0.2, 0.25);
  const press = t > te && t < te + 0.25 ? 0.88 : 1;
  const wins: WS[] = BASE.map((s, i) => {
    const d = prog(t, to - 0.1 + i * 0.07, to + 0.75 + i * 0.07);
    return { slot: s, ghost: 1, opacity: on * (1 - d) * 0.9 };
  });
  return (
    <AbsoluteFill>
      <Cam s={1.05 - 0.02 * E(t, ESC.t02.a, 3)} ox={L.c.x} oy={L.c.y}>
        <Desk L={L} t={t} wins={wins} power={[on, on]} crt={[crt, crt]} />
        {BASE.map((s, i) => {
          const r = place(L, s.mon, s.f);
          return <Dust key={s.id} {...r} k={prog(t, to - 0.1 + i * 0.07, to + 1.1 + i * 0.07)} seed={s.id} n={34} color={C.ink} size={4 * L.u} />;
        })}
      </Cam>
      {btn > 0 && (
        <div style={{ position: "absolute", left: L.mon[0].x + L.mon[0].w / 2 - 70 * L.u, top: L.mon[0].y + L.mon[0].h / 2 - 70 * L.u, width: 140 * L.u, height: 140 * L.u, opacity: btn, transform: `scale(${press * (0.8 + 0.2 * btn)})` }}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ filter: `drop-shadow(0 0 ${t > te ? 30 : 10}px ${C.cyan})` }}>
            <path d="M34 28 A30 30 0 1 0 66 28" fill="none" stroke={t > te ? C.cyan : C.ink} strokeWidth="7" strokeLinecap="round" />
            <line x1="50" y1="14" x2="50" y2="48" stroke={t > te ? C.cyan : C.ink} strokeWidth="7" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ───────── 3 · «Qué programas usabas. Qué pestañas… Dónde iba cada ventana. Y en qué pantalla.» ─────────
const Frag: React.FC<{ kind: number; s: number }> = ({ kind, s }) => {
  const box = (x: number, y: number, w: number, h: number, bg: string, r = 8, extra: React.CSSProperties = {}) => (
    <div style={{ position: "absolute", left: x * s, top: y * s, width: w * s, height: h * s, background: bg, borderRadius: r * s, ...extra }} />
  );
  if (kind === 0)
    return (
      <>
        {["#7C8CFF", "#FF7AB6", "#6EE7D8", "#FF9F6E", "#5AB0FF", "#C9A7FF"].map((c, i) =>
          box(40 + (i % 3) * 78, 34 + Math.floor(i / 3) * 78, 62, 62, `linear-gradient(135deg, ${c}, ${c}88)`, 16)
        )}
      </>
    );
  if (kind === 1)
    return (
      <>
        {[0, 1, 2, 3].map((i) => box(26 + i * 64, 70, 60, 34, i === 0 ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)", 8))}
        {box(26, 104, 252, 80, "rgba(255,255,255,0.06)", 6)}
        {box(40, 120, 120, 10, "rgba(255,255,255,0.3)", 9)}
      </>
    );
  if (kind === 2)
    return (
      <>
        {box(85, 60, 134, 96, "rgba(255,255,255,0.06)", 10, { border: `${3 * s}px solid rgba(243,241,234,0.7)` })}
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dy], i) => (
          <svg key={i} viewBox="0 0 40 40" style={{ position: "absolute", left: (152 + dx * 95 - 20) * s, top: (108 + dy * 70 - 20) * s, width: 40 * s, height: 40 * s, transform: `rotate(${Math.atan2(dy, dx) * 57.3 + 0}deg)` }}>
            <path d="M6 20 H32 M24 12 L32 20 L24 28" stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          </svg>
        ))}
      </>
    );
  return (
    <>
      {box(30, 52, 150, 96, "rgba(255,255,255,0.06)", 10, { border: `${3 * s}px solid rgba(243,241,234,0.7)` })}
      {box(96, 148, 18, 18, "rgba(243,241,234,0.5)", 2)}
      {box(196, 72, 90, 60, "rgba(255,255,255,0.06)", 8, { border: `${3 * s}px solid rgba(243,241,234,0.7)` })}
      {box(234, 132, 14, 14, "rgba(243,241,234,0.5)", 2)}
    </>
  );
};

export const S03: React.FC<P> = ({ t, L }) => {
  const words = [at("t03", "programas"), at("t03", "pestañas"), at("t03", "ventana"), at("t03", "pantalla")];
  const endT = ESC.t03.b;
  const s = L.vertical ? 1.25 : 1.22;
  const cw = 310 * s, ch = 220 * s, gap = 34 * s;
  const pos = (i: number) =>
    L.vertical
      ? { x: L.c.x - cw - gap / 2 + (i % 2) * (cw + gap), y: L.c.y - ch - gap / 2 + Math.floor(i / 2) * (ch + gap) - 40 }
      : { x: L.c.x - 2 * cw - 1.5 * gap + i * (cw + gap), y: L.c.y - ch / 2 + 20 };
  const back = E(t, ESC.t03.a, 0.5);
  const shatter = prog(t, endT - 0.45, endT + 0.05);
  return (
    <AbsoluteFill>
      <Cam s={1.03 - 0.12 * back} ox={L.c.x} oy={L.c.y} opacity={1 - 0.78 * back} filter={`blur(${back * 6}px)`}>
        <Desk L={L} t={t} wins={[]} />
      </Cam>
      {words.map((w, i) => {
        const k = spr(t, w - 0.08, 1.8, 7);
        const p = pos(i);
        const forget = E(t, w + 0.55, 0.5);
        const q = spr(t, w + 0.5, 2, 8);
        const flick = forget > 0 && forget < 1 && rnd("f" + i + Math.floor(t * 24)) > 0.7 ? 0.5 : 1;
        if (t < w - 0.1) return null;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute", left: p.x, top: p.y, width: cw, height: ch, borderRadius: 22 * s,
                background: "linear-gradient(160deg, rgba(30,36,52,0.92), rgba(14,18,28,0.92))", border: `1.5px solid rgba(255,255,255,${0.12 - forget * 0.06})`,
                boxShadow: "0 30px 70px rgba(0,0,0,0.55)",
                transform: `translateY(${(1 - Math.min(1, k)) * 60}px) scale(${0.85 + 0.15 * Math.min(1.05, k)}) rotate(${forget * (i % 2 ? 2.5 : -2.5)}deg)`,
                opacity: Math.min(1, k * 1.5) * (1 - shatter) * flick, filter: `grayscale(${forget}) blur(${shatter * 8}px)`,
              }}
            >
              <div style={{ position: "absolute", inset: 0, opacity: 1 - forget * 0.65 }}>
                <Frag kind={i} s={s * 0.98} />
              </div>
            </div>
            {/* interrogación coral: se olvidó */}
            <div
              style={{
                position: "absolute", left: p.x + cw - 58 * s, top: p.y - 30 * s, width: 76 * s, height: 76 * s, borderRadius: 99, background: C.coral,
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "InterX", fontWeight: 800, fontSize: 50 * s, color: "#0A0C12",
                transform: `scale(${Math.max(0, Math.min(1.1, q))}) rotate(${(1 - Math.min(1, q)) * -30}deg)`, opacity: (q > 0 ? 1 : 0) * (1 - shatter), boxShadow: `0 0 30px ${C.coral}88`,
              }}
            >
              ?
            </div>
            <Dust x={p.x} y={p.y} w={cw} h={ch} k={shatter} seed={"sh" + i} n={50} color={i % 2 ? C.coral : C.ink} size={5} />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ───────── 4 · «Y te toca a ti reconstruirlo. Ventana a ventana. Todos los días.» ─────────
const DIAS = { es: ["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES"], en: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] };
export const S04: React.FC<P> = ({ t, L }) => {
  const a = ESC.t04.a;
  const tr = at("t04", "reconstruirlo");
  const td = at("t04", "todos");
  const end = ESC.t04.b;
  const enter = E(t, a, 0.45);
  // arrastres manuales: cuatro ventanas, una tras otra
  const order = ["w1", "w2", "w4", "w3", "w5", "w6"];
  const dragDur = (td - tr) / 4.2;
  // días acelerando
  const dayRate = (x: number) => 2.2 + 26 * x * x; // días/s
  let days = 0;
  if (t > td) {
    const steps = 40;
    const span = t - td;
    for (let i = 0; i < steps; i++) days += (dayRate(((i + 0.5) / steps) * span / Math.max(0.01, end - td)) * span) / steps;
  }
  const phase = t > td ? days % 1 : 0;
  const dayIdx = Math.floor(days);
  const speed = t > td ? clamp01((t - td) / (end - td)) : 0;
  let cursor = { x: L.mon[0].x + L.mon[0].w * 0.85, y: L.mon[0].y + L.mon[0].h * 0.9 };
  let clickK = -1;
  const wins: WS[] = BASE.map((s) => {
    const dest = place(L, s.mon, s.f);
    if (t > td) {
      const mess = messy(L, s, s.id + "d" + dayIdx);
      const oi = order.indexOf(s.id);
      const k = ease.inOut(clamp01((phase - oi * 0.1) / 0.45));
      return { slot: s, r: lerpRect(mess, dest, k), rotate: messyRot(s.id + "d" + dayIdx) * (1 - k), blur: speed * 9, desat: speed * 0.4 };
    }
    const mess = messy(L, s, s.id);
    const oi = order.indexOf(s.id);
    const d0 = tr + oi * dragDur;
    const k = oi < 4 ? clamp01((t - d0 - dragDur * 0.3) / (dragDur * 0.6)) : 0;
    const kk = ease.inOut(k);
    if (oi < 4 && t >= d0 && t < d0 + dragDur) {
      const c0 = centerOf(mess);
      const tgt = lerpRect(mess, dest, kk);
      const grab = { x: tgt.x + tgt.w * 0.3, y: tgt.y + 6 };
      const app = ease.inOut(clamp01((t - d0) / (dragDur * 0.3)));
      cursor = k > 0 ? grab : { x: lerp(cursor.x, mess.x + mess.w * 0.3, app), y: lerp(cursor.y, mess.y + 6, app) };
      if (t - d0 > dragDur * 0.25 && t - d0 < dragDur * 0.25 + 0.5) clickK = (t - d0 - dragDur * 0.25) / 0.5;
      void c0;
    } else if (oi < 4 && t >= d0 + dragDur) {
      const next = order[oi + 1];
      if (next && oi < 3) cursor = { x: dest.x + dest.w * 0.3, y: dest.y + 6 };
    }
    return { slot: s, r: lerpRect(mess, dest, kk), rotate: messyRot(s.id) * (1 - kk), glow: C.coral, glowAmt: k > 0 && k < 1 ? 0.5 : 0 };
  });
  const dayO = E(t, td - 0.05, 0.3);
  const fs = L.vertical ? 76 : 62;
  const dayPos = L.vertical ? { x: L.c.x, y: 150 } : { x: L.mon[1].x + L.mon[1].w / 2, y: L.mon[1].y + L.mon[1].h + 140 };
  return (
    <AbsoluteFill>
      <Cam s={0.92 + 0.08 * enter + 0.04 * speed} ox={L.c.x} oy={L.c.y} opacity={0.22 + 0.78 * enter} filter={enter < 1 ? `blur(${(1 - enter) * 6}px)` : undefined}>
        <Desk L={L} t={t} wins={wins} />
        <Cursor x={cursor.x} y={cursor.y} s={L.u * 1.1} click={clickK} color={C.coral} opacity={(t < td ? 1 : 1 - clamp01((t - td) / 0.5)) * enter} />
      </Cam>
      {dayO > 0 && (
        <div style={{ position: "absolute", left: dayPos.x - 300, width: 600, top: dayPos.y - fs, textAlign: "center", fontFamily: "InterX", fontWeight: 800, opacity: dayO }}>
          <div style={{ fontSize: fs * 0.42, letterSpacing: "0.3em", color: C.dim }}>{LANG === "en" ? "DAY" : "DÍA"} {dayIdx + 1}</div>
          <div style={{ fontSize: fs, color: C.coral, letterSpacing: "0.04em", filter: `blur(${speed * 3}px)`, transform: `translateY(${(1 - ease.out(phase)) * -6}px)` }}>{DIAS[LANG][dayIdx % 5]}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
export { atEnd, toma };
