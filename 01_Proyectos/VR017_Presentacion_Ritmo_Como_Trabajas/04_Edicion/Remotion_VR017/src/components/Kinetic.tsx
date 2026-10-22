import React from "react";
import { C, clamp01, ease, FONT, lerp, spr } from "../theme";

export type Entrada = "slam" | "rise" | "drop" | "fade";
export type Palabra = { w: string; at: number; color?: string; out?: number; mark?: string; entrada?: Entrada; size?: number; node?: React.ReactNode };

/** estilo de una palabra que entra a golpe en `at` y sale en `out` */
const wordStyle = (t: number, p: Palabra, base: Entrada): React.CSSProperties => {
  const ent = p.entrada ?? base;
  const d = t - p.at;
  if (d < -0.0001) return { opacity: 0 };
  let o = 1, sx = 1, ty = 0, blur = 0, rot = 0;
  if (ent === "slam") {
    const k = clamp01(d / 0.16);
    sx = lerp(1.45, 1, ease.out(k)) + 0.04 * (spr(t, p.at + 0.1, 3, 9) - 1) * -1;
    o = clamp01(d / 0.06);
    blur = (1 - ease.out(k)) * 14;
  } else if (ent === "rise") {
    const k = ease.out(clamp01(d / 0.32));
    ty = (1 - k) * 105; // % de la altura de línea (con máscara)
  } else if (ent === "drop") {
    const k = clamp01(d / 0.28);
    ty = -(1 - spr(t, p.at, 2.4, 8)) * 60;
    o = clamp01(k * 3);
    rot = (1 - ease.out(k)) * -6;
  } else {
    o = ease.out(clamp01(d / 0.25));
    blur = (1 - o) * 8;
  }
  if (p.out !== undefined && t > p.out) {
    const k = ease.in(clamp01((t - p.out) / 0.16));
    o *= 1 - k;
    ty += ent === "rise" ? -k * 105 : -k * 30;
    blur += k * 8;
  }
  return {
    opacity: o,
    transform: ent === "rise" ? `translateY(${ty}%)` : `translateY(${ty}px) scale(${sx}) rotate(${rot}deg)`,
    filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
    display: "inline-block",
  };
};

/** Una línea de palabras centrada en (x, y); cada palabra entra en su golpe. Posiciones fijas desde el principio. */
export const Linea: React.FC<{
  t: number; x: number; y: number; size: number; palabras: Palabra[]; entrada?: Entrada; color?: string; gap?: number; maxW?: number;
  align?: "center" | "left"; weight?: number; tracking?: number; lineHeight?: number; glow?: number;
}> = ({ t, x, y, size, palabras, entrada = "slam", color = C.ink, gap = 0.26, maxW = 2000, align = "center", weight = 800, tracking = -0.035, lineHeight = 1.08, glow = 0 }) => {
  if (palabras.every((p) => t < p.at || (p.out !== undefined && t > p.out + 0.2))) return null;
  return (
    <div
      style={{
        position: "absolute", left: align === "center" ? x - maxW / 2 : x, top: y, width: maxW, transform: "translateY(-50%)",
        display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * gap, rowGap: size * 0.08,
        fontFamily: FONT, fontWeight: weight, fontSize: size, letterSpacing: `${tracking}em`, lineHeight, color, zIndex: 40,
      }}
    >
      {palabras.map((p, i) => {
        const st = wordStyle(t, p, entrada);
        const col = p.color ?? color;
        const fs = p.size ? size * p.size : size;
        const inner = (
          <span style={{ ...st, color: col, fontSize: fs, position: "relative", textShadow: glow ? `0 0 ${glow}px ${col}66` : "0 6px 30px rgba(0,0,0,0.5)" }}>
            {p.mark && t >= p.at && (
              <span
                style={{
                  position: "absolute", left: "-3%", bottom: "8%", height: "26%", borderRadius: 6, background: p.mark, opacity: 0.32, zIndex: -1,
                  width: `${106 * ease.out(clamp01((t - p.at - 0.05) / 0.3))}%`,
                }}
              />
            )}
            {p.node ?? p.w}
          </span>
        );
        return (p.entrada ?? entrada) === "rise" ? (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.08em", marginBottom: "-0.08em" }}>{inner}</span>
        ) : (
          <span key={i}>{inner}</span>
        );
      })}
    </div>
  );
};

/** rótulo pequeño tipo «eyebrow» encima de un titular */
export const Eyebrow: React.FC<{ t: number; at: number; x: number; y: number; text: string; color?: string; size?: number; out?: number; align?: "center" | "left" }> = ({ t, at, x, y, text, color = C.cyan, size = 30, out, align = "center" }) => {
  const k = ease.out(clamp01((t - at) / 0.3));
  const ko = out !== undefined ? ease.in(clamp01((t - out) / 0.15)) : 0;
  if (k <= 0 || ko >= 1) return null;
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, transform: `translate(${align === "center" ? "-50%" : "0"}, -50%) translateY(${(1 - k) * 16}px)`, opacity: k * (1 - ko), zIndex: 41,
        fontFamily: FONT, fontWeight: 700, fontSize: size, letterSpacing: "0.16em", textTransform: "uppercase", color, whiteSpace: "nowrap",
        display: "flex", alignItems: "center", gap: size * 0.5,
      }}
    >
      <span style={{ width: size * 0.32, height: size * 0.32, borderRadius: 99, background: color, boxShadow: `0 0 ${size * 0.6}px ${color}` }} />
      {text}
    </div>
  );
};
