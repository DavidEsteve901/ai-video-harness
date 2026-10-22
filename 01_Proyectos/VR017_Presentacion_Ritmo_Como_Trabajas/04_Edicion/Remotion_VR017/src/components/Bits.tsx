import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import icons from "../icons.json";
import { C, clamp01, ease, rnd } from "../theme";

export type IconName = keyof typeof icons;
export const Icon: React.FC<{ name: IconName; size?: number; color?: string; stroke?: number; style?: React.CSSProperties }> = ({ name, size = 16, color = "currentColor", stroke = 2, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
    {(icons[name] as [string, Record<string, string>][]).map(([tag, a], i) => React.createElement(tag, { key: i, ...a }))}
  </svg>
);

/** Fondo: casi negro con dos luces que respiran (y laten con la música), viñeta y grano */
export const Background: React.FC<{ t: number; W: number; H: number; tint?: string; tintAmt?: number; beat?: number }> = ({ t, W, H, tint = C.amber, tintAmt = 0, beat = 0 }) => {
  const a = { x: 0.25 + 0.07 * Math.sin(t * 0.35), y: 0.3 + 0.05 * Math.cos(t * 0.3) };
  const b = { x: 0.78 + 0.05 * Math.cos(t * 0.28), y: 0.72 + 0.06 * Math.sin(t * 0.33) };
  const gx = Math.floor(rnd("gx" + Math.floor(t * 30)) * 256);
  const gy = Math.floor(rnd("gy" + Math.floor(t * 30)) * 256);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(${W * 0.6}px ${H * 0.45}px at ${a.x * 100}% ${a.y * 100}%, rgba(79,120,255,${0.13 + 0.06 * beat}), transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(${W * 0.5}px ${H * 0.45}px at ${b.x * 100}% ${b.y * 100}%, rgba(155,140,255,${0.09 + 0.05 * beat}), transparent 70%)` }} />
      {tintAmt > 0 && <AbsoluteFill style={{ background: `radial-gradient(${W * 0.65}px ${H * 0.5}px at 50% 45%, ${tint}, transparent 70%)`, opacity: tintAmt }} />}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 52%, rgba(0,0,0,0.7) 100%)" }} />
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile("img/grano.png")})`, backgroundPosition: `${gx}px ${gy}px`, opacity: 0.07, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

/** sacudida de cámara tras cada impacto */
export const shake = (t: number, hits: number[], amp = 10) => {
  let x = 0, y = 0;
  for (const h of hits) {
    const d = t - h;
    if (d >= 0 && d < 0.35) {
      const k = Math.exp(-d * 14);
      x += Math.sin(d * 90) * amp * k;
      y += Math.cos(d * 75) * amp * 0.7 * k;
    }
  }
  return { x, y };
};

/** destello blanco en un corte */
export const Flash: React.FC<{ t: number; at: number[]; max?: number; color?: string }> = ({ t, at, max = 0.5, color = "#fff" }) => {
  let o = 0;
  for (const a of at) {
    const d = t - a;
    if (d >= 0 && d < 0.25) o = Math.max(o, max * Math.exp(-d * 18));
  }
  if (o <= 0.002) return null;
  return <AbsoluteFill style={{ background: color, opacity: o, mixBlendMode: "screen", pointerEvents: "none" }} />;
};

/** Puntero con onda de clic */
export const Cursor: React.FC<{ x: number; y: number; s?: number; click?: number; opacity?: number; color?: string }> = ({ x, y, s = 1, click = -1, opacity = 1, color = C.green }) => {
  if (opacity <= 0) return null;
  const press = click >= 0 && click < 0.2 ? 0.85 : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity, zIndex: 80 }}>
      {click >= 0 && click < 1 &&
        [0, 0.12].map((d, i) => {
          const k = clamp01((click - d) / 0.7);
          const r = 70 * s * ease.out(k);
          return <div key={i} style={{ position: "absolute", left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: 999, border: `${3 * s}px solid ${color}`, opacity: (1 - k) * 0.9 }} />;
        })}
      <svg width={38 * s} height={46 * s} viewBox="0 0 38 46" style={{ position: "absolute", left: -4 * s, top: -3 * s, transform: `scale(${press})`, transformOrigin: "4px 3px", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.6))" }}>
        <path d="M4 3 L4 37 L13 29 L19 43 L25 40 L19 27 L31 27 Z" fill="#F3F1EA" stroke="#0B0E15" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Partículas que se desprenden de un rectángulo (las ventanas se deshacen) */
export const Dust: React.FC<{ x: number; y: number; w: number; h: number; k: number; seed: string; n?: number; color?: string; size?: number }> = ({ x, y, w, h, k, seed, n = 40, color = C.amber, size = 5 }) => {
  if (k <= 0 || k >= 1) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const px = x + rnd(seed + "x" + i) * w;
        const py = y + rnd(seed + "y" + i) * h;
        const d = clamp01((k - rnd(seed + "d" + i) * 0.35) / 0.65);
        const e = ease.out(d);
        const X = px + (rnd(seed + "vx" + i) - 0.5) * 220 * e;
        const Y = py - (60 + rnd(seed + "vy" + i) * 260) * e;
        const o = d > 0 ? 1 - d : 0;
        const s = size * (0.5 + rnd(seed + "s" + i));
        return <div key={i} style={{ position: "absolute", left: X - s / 2, top: Y - s / 2, width: s, height: s, borderRadius: 99, background: color, opacity: o * 0.9, boxShadow: `0 0 ${s * 2}px ${color}` }} />;
      })}
    </>
  );
};
