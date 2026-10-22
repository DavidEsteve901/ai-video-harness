import React from "react";
import { C, clamp01, ease, rnd } from "../theme";
import { Layout, place, screenOf } from "../layout";
import { ACCENT, BASE, Slot } from "../windows";

/** Núcleo de memoria: punto ámbar que crece en anillos con partículas en órbita */
export const Core: React.FC<{ x: number; y: number; R: number; k: number; t: number; wave?: number; opacity?: number }> = ({ x, y, R, k, t, wave = -1, opacity = 1 }) => {
  if (k <= 0 || opacity <= 0) return null;
  const r = R * k;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity }}>
      <div style={{ position: "absolute", left: x - r * 3, top: y - r * 3, width: r * 6, height: r * 6, borderRadius: 999, background: `radial-gradient(circle, ${C.amber}55 0%, ${C.amber}18 35%, transparent 70%)` }} />
      {[1.0, 1.45].map((m, i) => (
        <div
          key={i}
          style={{
            position: "absolute", left: x - r * m, top: y - r * m, width: 2 * r * m, height: 2 * r * m, borderRadius: 999,
            border: `${Math.max(1.5, R * 0.025)}px dashed ${C.amber}${i ? "77" : "cc"}`, transform: `rotate(${(i ? -1 : 1) * t * 40}deg)`,
          }}
        />
      ))}
      <div style={{ position: "absolute", left: x - r * 0.42, top: y - r * 0.42, width: r * 0.84, height: r * 0.84, borderRadius: 999, background: `radial-gradient(circle at 40% 35%, #FFF6E0, ${C.amber} 45%, #E07A00 100%)`, boxShadow: `0 0 ${r * 0.6}px ${C.amber}, 0 0 ${r * 1.4}px ${C.amber}88` }} />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = t * (0.8 + rnd("o" + i) * 0.9) + rnd("p" + i) * 6.28;
        const rr = r * (1.15 + rnd("rr" + i) * 0.6);
        const s = 3 + rnd("s" + i) * 5;
        return <div key={i} style={{ position: "absolute", left: x + Math.cos(a) * rr - s / 2, top: y + Math.sin(a) * rr * 0.75 - s / 2, width: s, height: s, borderRadius: 99, background: "#FFE2A8", boxShadow: `0 0 10px ${C.amber}` }} />;
      })}
      {wave >= 0 && wave < 1 && (
        <div style={{ position: "absolute", left: x - r * (1 + 4 * ease.out(wave)), top: y - r * (1 + 4 * ease.out(wave)), width: 2 * r * (1 + 4 * ease.out(wave)), height: 2 * r * (1 + 4 * ease.out(wave)), borderRadius: 999, border: `${4 * (1 - wave) + 1}px solid ${C.amber}`, opacity: 1 - wave }} />
      )}
    </div>
  );
};

/** Tarjeta del espacio guardado, con un minimapa de las dos pantallas */
export const Card: React.FC<{ L: Layout; x: number; y: number; w: number; h: number; k: number; slots?: Slot[]; glow?: number; press?: number; color?: string; map?: number; children?: React.ReactNode }> = ({
  L, x, y, w, h, k, slots = BASE, glow = 1, press = 1, color = C.amber, map = 1, children,
}) => {
  if (k <= 0.001) return null;
  // minimapa: las dos pantallas encajadas en la tarjeta
  const minX = Math.min(L.mon[0].x, L.mon[1].x), maxX = Math.max(L.mon[0].x + L.mon[0].w, L.mon[1].x + L.mon[1].w);
  const minY = Math.min(L.mon[0].y, L.mon[1].y), maxY = Math.max(L.mon[0].y + L.mon[0].h, L.mon[1].y + L.mon[1].h);
  const sc = Math.min((w * 0.82) / (maxX - minX), (h * 0.74) / (maxY - minY));
  const ox = (w - (maxX - minX) * sc) / 2, oy = (h - (maxY - minY) * sc) / 2;
  const T = (rx: number, ry: number) => ({ x: ox + (rx - minX) * sc, y: oy + (ry - minY) * sc });
  return (
    <div
      style={{
        position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: 26 * L.u,
        background: "linear-gradient(160deg, rgba(40,34,22,0.95), rgba(16,15,14,0.96))", border: `2px solid ${color}`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 ${70 * glow}px ${color}66, inset 0 0 40px ${color}22`,
        transform: `scale(${(0.4 + 0.6 * ease.back(clamp01(k))) * press})`, opacity: clamp01(k * 2),
      }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: map }}>
        {([0, 1] as const).map((i) => {
          const s = screenOf(L.mon[i], L.u);
          const p = T(s.x, s.y);
          return <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: s.w * sc, height: s.h * sc, borderRadius: 5, border: `1.5px solid ${color}88`, background: "rgba(0,0,0,0.35)" }} />;
        })}
        {slots.map((sl) => {
          const r = place(L, sl.mon, sl.f, 7);
          const p = T(r.x, r.y);
          return <div key={sl.id} style={{ position: "absolute", left: p.x + 1, top: p.y + 1, width: r.w * sc - 2, height: r.h * sc - 2, borderRadius: 3, background: ACCENT[sl.kind], opacity: 0.85 }} />;
        })}
      </div>
      {children}
    </div>
  );
};
