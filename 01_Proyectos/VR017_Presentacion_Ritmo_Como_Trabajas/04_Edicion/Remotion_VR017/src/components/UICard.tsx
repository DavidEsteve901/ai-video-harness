import React from "react";
import { Img, staticFile } from "remotion";
import { clamp01, ease, lerp, spr } from "../theme";

export type Region = { x: number; y: number; w: number; h: number }; // fracciones 0..1 de la imagen
export type Glow = { r: Region; at: number; color: string; dur?: number; radius?: number };

/** Desplazamiento (px, desde el centro de la tarjeta) de un punto (fx, fy ∈ 0..1 de la captura) con el zoom `s` hacia la región `r` ya completado. */
export const zoomPoint = (iw: number, ih: number, w: number, maxH: number | undefined, r: Region, s: number, fx: number, fy: number) => {
  let W = w, H = (w * ih) / iw;
  if (maxH && H > maxH) { H = maxH; W = (H * iw) / ih; }
  const mx = ((s - 1) * W) / 2, my = ((s - 1) * H) / 2;
  const zx = Math.max(-mx, Math.min(mx, -((r.x + r.w / 2) * W - W / 2) * s));
  const zy = Math.max(-my, Math.min(my, -((r.y + r.h / 2) * H - H / 2) * s));
  return { x: (fx - 0.5) * W * s + zx, y: (fy - 0.5) * H * s + zy };
};

/** Tarjeta con una captura REAL de la app que entra en 3D en `at` (aterriza en el golpe) y puede hacer zoom a una región. */
export const UICard: React.FC<{
  t: number; src: string; iw: number; ih: number; cx: number; cy: number; w: number; maxH?: number;
  at: number; // instante en que aterriza
  from?: { rx?: number; ry?: number; y?: number; x?: number; s?: number; rz?: number };
  zoom?: { at: number; d?: number; r: Region; s: number }[]; // zooms encadenados (el último manda)
  out?: number; outMode?: "fall" | "fly" | "fade" | "scale";
  glows?: Glow[]; radius?: number; drift?: number; children?: React.ReactNode; tilt?: number;
}> = ({ t, src, iw, ih, cx, cy, w, maxH, at, from = {}, zoom = [], out, outMode = "fly", glows = [], radius = 18, drift = 1, children, tilt = 1 }) => {
  const lead = 0.34;
  if (t < at - lead) return null;
  let W = w, H = (w * ih) / iw;
  if (maxH && H > maxH) { H = maxH; W = (H * iw) / ih; }
  // entrada: resorte que llega al golpe
  const k = clamp01((t - (at - lead)) / lead);
  const e = ease.out(k);
  const s2 = spr(t, at - 0.05, 1.6, 7.5);
  const rx = (from.rx ?? 52) * (1 - s2);
  const ry = (from.ry ?? -18) * (1 - s2);
  const rz = (from.rz ?? 0) * (1 - s2);
  const ty = (from.y ?? 420) * (1 - e);
  const tx = (from.x ?? 0) * (1 - e);
  const sc = lerp(from.s ?? 0.78, 1, e);
  // deriva lenta tras aterrizar (vida)
  const dl = Math.max(0, t - at);
  const dry = drift * tilt * (-4 + 3 * Math.sin(dl * 0.9));
  const drx = drift * tilt * (3 * Math.cos(dl * 0.7));
  // zoom
  let zs = 1, zx = 0, zy = 0;
  for (const z of zoom) {
    const zk = ease.inOut(clamp01((t - z.at) / (z.d ?? 0.45)));
    if (zk <= 0) continue;
    const rcx = (z.r.x + z.r.w / 2) * W, rcy = (z.r.y + z.r.h / 2) * H;
    const s = lerp(zs, z.s, zk);
    // centra la región sin dejar ver el borde de la captura (el zoom ocurre dentro del marco de la tarjeta)
    const mx = ((z.s - 1) * W) / 2, my = ((z.s - 1) * H) / 2;
    const tgx = Math.max(-mx, Math.min(mx, -(rcx - W / 2) * z.s)), tgy = Math.max(-my, Math.min(my, -(rcy - H / 2) * z.s));
    zx = lerp(zx, tgx, zk); zy = lerp(zy, tgy, zk); zs = s;
  }
  // salida
  let o = clamp01(k * 2.5), ox = 0, oy = 0, os = 1, orx = 0, blur = 0;
  if (out !== undefined && t > out) {
    const q = ease.in(clamp01((t - out) / 0.22));
    if (outMode === "fall") { oy = q * 900; orx = -q * 40; }
    else if (outMode === "fly") { ox = -q * 1400; blur = q * 10; }
    else if (outMode === "scale") { os = 1 + q * 0.6; blur = q * 14; }
    o *= 1 - q;
    if (q >= 1) return null;
  }
  const sheen = clamp01((t - at + 0.05) / 0.6);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", perspective: 1800, perspectiveOrigin: `${cx}px ${cy}px`, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", left: cx - W / 2 + tx + ox, top: cy - H / 2 + ty + oy, width: W, height: H, opacity: o,
          transform: `scale(${sc * os}) rotateX(${rx + drx + orx}deg) rotateY(${ry + dry}deg) rotateZ(${rz}deg)`,
          transformOrigin: "50% 50%",
          borderRadius: radius, overflow: "hidden", filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
          boxShadow: "0 50px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.10)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, transform: `translate(${zx}px, ${zy}px) scale(${zs})`, transformOrigin: "50% 50%" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", display: "block" }} />
        {glows.map((g, i) => {
          const d = t - g.at;
          if (d < 0) return null;
          const gk = ease.out(clamp01(d / 0.25)) * (1 - clamp01((d - (g.dur ?? 1.2)) / 0.3));
          if (gk <= 0) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute", left: `${g.r.x * 100}%`, top: `${g.r.y * 100}%`, width: `${g.r.w * 100}%`, height: `${g.r.h * 100}%`,
                borderRadius: g.radius ?? 12, border: `3px solid ${g.color}`, boxShadow: `0 0 40px ${g.color}, inset 0 0 30px ${g.color}55`, opacity: gk,
                transform: `scale(${1.04 - 0.04 * gk})`,
              }}
            />
          );
        })}
        {children}
        </div>
        {sheen > 0 && sheen < 1 && (
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${sheen * 140 - 40}%, rgba(255,255,255,0.10) ${sheen * 140 - 25}%, transparent ${sheen * 140 - 10}%)` }} />
        )}
      </div>
    </div>
  );
};
