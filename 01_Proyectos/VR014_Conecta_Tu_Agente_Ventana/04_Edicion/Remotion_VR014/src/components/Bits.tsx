import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, clamp01, E, ease, rnd } from "../theme";

/** Puntero con onda de clic */
export const Cursor: React.FC<{ x: number; y: number; s?: number; click?: number; opacity?: number; color?: string }> = ({ x, y, s = 1, click = -1, opacity = 1, color = C.green }) => {
  if (opacity <= 0) return null;
  const press = click >= 0 && click < 0.25 ? 0.85 + 0.15 * Math.abs(Math.cos(click * 12)) : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity, zIndex: 50 }}>
      {click >= 0 && click < 1 && (
        <>
          {[0, 0.12].map((d, i) => {
            const k = clamp01((click - d) / 0.8);
            return (
              <div
                key={i}
                style={{
                  position: "absolute", left: -60 * s * ease.out(k), top: -60 * s * ease.out(k), width: 120 * s * ease.out(k), height: 120 * s * ease.out(k),
                  borderRadius: 999, border: `${3 * s}px solid ${color}`, opacity: (1 - k) * 0.9,
                }}
              />
            );
          })}
        </>
      )}
      <svg width={38 * s} height={46 * s} viewBox="0 0 38 46" style={{ position: "absolute", left: -4 * s, top: -3 * s, transform: `scale(${press})`, transformOrigin: "4px 3px", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.6))" }}>
        <path d="M4 3 L4 37 L13 29 L19 43 L25 40 L19 27 L31 27 Z" fill="#F3F1EA" stroke="#0B0E15" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Fondo: casi negro con dos luces suaves que respiran, viñeta y grano */
export const Background: React.FC<{ t: number; tint?: string; tintAmt?: number; W: number; H: number }> = ({ t, tint = C.amber, tintAmt = 0, W, H }) => {
  const a = { x: 0.25 + 0.06 * Math.sin(t * 0.35), y: 0.3 + 0.05 * Math.cos(t * 0.3) };
  const b = { x: 0.78 + 0.05 * Math.cos(t * 0.28), y: 0.72 + 0.06 * Math.sin(t * 0.33) };
  const grainX = Math.floor(rnd("gx" + Math.floor(t * 30)) * 256);
  const grainY = Math.floor(rnd("gy" + Math.floor(t * 30)) * 256);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(${W * 0.55}px ${H * 0.45}px at ${a.x * 100}% ${a.y * 100}%, rgba(79,120,255,0.13), transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(${W * 0.5}px ${H * 0.45}px at ${b.x * 100}% ${b.y * 100}%, rgba(155,140,255,0.09), transparent 70%)` }} />
      {tintAmt > 0 && <AbsoluteFill style={{ background: `radial-gradient(${W * 0.6}px ${H * 0.5}px at 50% 45%, ${tint}, transparent 70%)`, opacity: tintAmt }} />}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.65) 100%)" }} />
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile("img/grano.png")})`, backgroundPosition: `${grainX}px ${grainY}px`, opacity: 0.07, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

/** Partículas deterministas que se desprenden de un rectángulo (olvido) o convergen hacia un punto */
export const Dust: React.FC<{ x: number; y: number; w: number; h: number; k: number; seed: string; n?: number; color?: string; dir?: "up" | "in"; tx?: number; ty?: number; size?: number }> = ({
  x, y, w, h, k, seed, n = 40, color = C.ink, dir = "up", tx = 0, ty = 0, size = 4,
}) => {
  if (k <= 0 || k >= 1) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const px = x + rnd(seed + "x" + i) * w;
        const py = y + rnd(seed + "y" + i) * h;
        const d = clamp01((k - rnd(seed + "d" + i) * 0.35) / 0.65);
        const e = ease.out(d);
        let X = px, Y = py;
        if (dir === "up") {
          X = px + (rnd(seed + "vx" + i) - 0.5) * 120 * e;
          Y = py - (40 + rnd(seed + "vy" + i) * 160) * e;
        } else {
          X = px + (tx - px) * ease.inOut(d);
          Y = py + (ty - py) * ease.inOut(d);
        }
        const o = dir === "up" ? (d > 0 ? 1 - d : 0) : d > 0 && d < 1 ? Math.sin(d * Math.PI) : 0;
        const s = size * (0.5 + rnd(seed + "s" + i));
        return <div key={i} style={{ position: "absolute", left: X - s / 2, top: Y - s / 2, width: s, height: s, borderRadius: 99, background: color, opacity: o * 0.9, boxShadow: `0 0 ${s * 2}px ${color}` }} />;
      })}
    </>
  );
};

/** Desplazamiento de cámara por sacudida (impactos) */
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

export const Logo: React.FC<{ src: string; size: number; style?: React.CSSProperties }> = ({ src, size, style }) => <Img src={staticFile(src)} style={{ width: size, height: size, ...style }} />;
export { E };
