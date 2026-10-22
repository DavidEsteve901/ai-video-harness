import React from "react";
import { C, clamp01, ease, FONT, rnd } from "../theme";
import { Rect } from "../layout";
import { Kind } from "../windows";
import { Win } from "./Win";
import { App, AppIcon, Icon, IconName, OB, OB_FONT } from "./Omnibar";

export type Pt = { x: number; y: number };

/** recorrido por fotogramas clave {t, p}: entre dos claves, curva expo de ida y vuelta (si son iguales, se queda quieto) */
export type Key = { t: number; p: Pt; bend?: number };
export const track = (keys: Key[], t: number): Pt => {
  if (t <= keys[0].t) return keys[0].p;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t < b.t) {
      const k = ease.inOut(clamp01((t - a.t) / Math.max(0.001, b.t - a.t)));
      const bend = b.bend ?? 0;
      const mx = (a.p.x + b.p.x) / 2 - (b.p.y - a.p.y) * bend, my = (a.p.y + b.p.y) / 2 + (b.p.x - a.p.x) * bend;
      return { x: (1 - k) ** 2 * a.p.x + 2 * (1 - k) * k * mx + k * k * b.p.x, y: (1 - k) ** 2 * a.p.y + 2 * (1 - k) * k * my + k * k * b.p.y };
    }
  }
  return keys[keys.length - 1].p;
};
export const sample = (f: (x: number) => Pt, from: number, to: number, step = 1 / 50): Pt[] => {
  const out: Pt[] = [];
  for (let x = from; x <= to; x += step) out.push(f(x));
  if (to > from) out.push(f(to));
  return out;
};

/** rastro del recadero (erase 0..1 = se borra desde el principio) */
export const Trail: React.FC<{ pts: Pt[]; color?: string; width?: number; opacity?: number; erase?: number }> = ({ pts, color = C.coral, width = 5, opacity = 1, erase = 0 }) => {
  if (pts.length < 2 || opacity <= 0 || erase >= 1) return null;
  const d = "M " + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ");
  const dash = erase > 0 ? { pathLength: 1, strokeDasharray: `${1 - erase} 2`, strokeDashoffset: -erase } : {};
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "visible", opacity, zIndex: 40 }}>
      <path d={d} fill="none" stroke={color} strokeOpacity={0.22} strokeWidth={width * 3.2} strokeLinecap="round" strokeLinejoin="round" {...dash} />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${color})` }} {...dash} />
    </svg>
  );
};

/** el paquete que lleva el recadero */
export const Parcel: React.FC<{ x: number; y: number; s?: number; opacity?: number; rot?: number }> = ({ x, y, s = 1, opacity = 1, rot = 0 }) => {
  if (opacity <= 0) return null;
  return (
    <svg width={44 * s} height={40 * s} viewBox="0 0 44 40" style={{ position: "absolute", left: x, top: y, opacity, transform: `rotate(${rot}deg)`, overflow: "visible", zIndex: 51, filter: `drop-shadow(0 0 ${12 * s}px ${C.amber}) drop-shadow(0 6px 8px rgba(0,0,0,0.5))` }}>
      <defs>
        <linearGradient id="parcel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2B65A" />
          <stop offset="100%" stopColor="#B8742A" />
        </linearGradient>
      </defs>
      <rect x={3} y={11} width={38} height={27} rx={4} fill="url(#parcel)" />
      <rect x={1} y={5} width={42} height={10} rx={3} fill="#FFC86E" />
      <rect x={19} y={5} width={6} height={33} fill="#FFE9B8" opacity={0.9} />
    </svg>
  );
};

/** ventana abstracta con la identidad de su programa en la barra de título (cuadrado de color + nombre, sin logos) */
export const AppWin: React.FC<{
  r: Rect; kind: Kind; t: number; app?: App; name?: string; seed?: string; opacity?: number; scale?: number; glow?: string; glowAmt?: number; live?: number;
  dim?: number; blur?: number; mark?: number; badge?: string; markColor?: string; rotate?: number; children?: React.ReactNode;
}> = ({ r, kind, t, app, name, seed, opacity = 1, scale = 1, glow, glowAmt = 0, live = 1, dim = 0, blur = 0, mark = 0, badge, markColor = C.amber, rotate = 0, children }) => {
  if (opacity <= 0.001) return null;
  const barH = Math.max(9, Math.min(24, r.h * 0.075));
  const f = [dim > 0 ? `brightness(${1 - dim})` : "", blur > 0.2 ? `blur(${blur}px)` : ""].join(" ").trim();
  return (
    <div style={{ position: "absolute", inset: 0, opacity, filter: f || undefined, transform: `rotate(${rotate}deg)`, transformOrigin: `${r.x + r.w / 2}px ${r.y + r.h / 2}px` }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${scale})`, transformOrigin: `${r.x + r.w / 2}px ${r.y + r.h / 2}px` }}>
        <Win r={r} kind={kind} t={t} seed={seed ?? kind} glow={glow} glowAmt={glowAmt} live={live} />
        {app && (
          <div style={{ position: "absolute", left: r.x + barH * 2.15, top: r.y + barH * 0.14, height: barH * 0.72, display: "flex", alignItems: "center", gap: barH * 0.28, fontFamily: OB_FONT, fontWeight: 600, fontSize: barH * 0.5, color: "rgba(243,241,234,0.78)" }}>
            <AppIcon app={app} size={barH * 0.66} />
            {name && <span>{name}</span>}
          </div>
        )}
        {children}
      </div>
      {mark > 0 && (
        <>
          <div style={{ position: "absolute", left: r.x - 5, top: r.y - 5, width: r.w + 10, height: r.h + 10, borderRadius: 14, border: `4px solid ${markColor}`, opacity: clamp01(mark * 2), boxShadow: `0 0 ${30 * mark}px ${markColor}88`, transform: `scale(${1.03 - 0.03 * ease.out(clamp01(mark))})`, transformOrigin: `${r.x + r.w / 2}px ${r.y + r.h / 2}px`, zIndex: 45 }} />
          {badge && (
            <div style={{ position: "absolute", left: r.x + r.w - 34, top: r.y + r.h - 34, width: 58, height: 58, borderRadius: 99, background: markColor, color: "#0A0C12", fontFamily: FONT, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${ease.back(clamp01(mark))})`, boxShadow: `0 0 24px ${markColor}`, zIndex: 46 }}>{badge}</div>
          )}
        </>
      )}
    </div>
  );
};

/** marco de pantalla (monitor) con su pie */
export const Frame: React.FC<{ r: Rect; k?: number; edge?: number; edgeCol?: string; children?: React.ReactNode }> = ({ r, k = 1, edge = 0, edgeCol = C.coral, children }) => {
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: clamp01(k * 2) }}>
      <div style={{ position: "absolute", left: r.x + r.w * 0.465, width: r.w * 0.07, top: r.y + r.h - 2, height: 40, background: "linear-gradient(90deg,#141924,#232A3A,#141924)" }} />
      <div style={{ position: "absolute", left: r.x + r.w * 0.37, width: r.w * 0.26, top: r.y + r.h + 36, height: 10, borderRadius: 6, background: "#232A3A" }} />
      <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 18, background: "linear-gradient(160deg,#1B2130,#0C0F17)", border: `2px solid ${edge > 0 ? edgeCol : "#2A3142"}`, boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 ${60 * edge}px ${edgeCol}55` }} />
      <div style={{ position: "absolute", left: r.x + 12, top: r.y + 12, width: r.w - 24, height: r.h - 24, borderRadius: 9, overflow: "hidden", background: "radial-gradient(120% 90% at 30% 20%, #18223A 0%, #0D1322 45%, #070A12 100%)" }} />
      {children}
    </div>
  );
};

/** la idea en la que estabas pensando (bocadillo ámbar). health 1 = viva, 0 = gris y deshecha */
export const IdeaBubble: React.FC<{ x: number; y: number; r: number; health: number; k?: number; t: number; tail: Pt; opacity?: number }> = ({ x, y, r, health, k = 1, t, tail, opacity = 1 }) => {
  if (k <= 0 || opacity <= 0) return null;
  const h = clamp01(health);
  const s = (0.55 + 0.45 * h) * (0.7 + 0.3 * ease.back(clamp01(k)));
  const col = h > 0.02 ? C.amber : "#5B6070";
  const wob = Math.sin(t * 2.1) * 4 * h;
  const dots = [0.72, 0.5, 0.3].map((f, i) => ({ x: x + (tail.x - x) * (0.62 + i * 0.16), y: y + r * 0.7 + (tail.y - y - r * 0.7) * (0.3 + i * 0.32), rr: r * 0.16 * f * 1.6 }));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: opacity * clamp01(k * 2), filter: `grayscale(${1 - h}) brightness(${0.55 + 0.45 * h})` }}>
      {dots.map((d, i) => (
        <div key={i} style={{ position: "absolute", left: d.x - d.rr, top: d.y - d.rr, width: 2 * d.rr, height: 2 * d.rr, borderRadius: 99, background: "linear-gradient(160deg, #3A2E16, #1A150C)", border: `3px solid ${col}`, boxShadow: `0 0 ${20 * h}px ${col}88` }} />
      ))}
      <div style={{ position: "absolute", left: x - r, top: y - r * 0.78 + wob, width: 2 * r, height: 1.56 * r, borderRadius: "50%", transform: `scale(${s})`, background: "radial-gradient(circle at 40% 35%, #4A3A18, #1A150C 75%)", border: `4px solid ${col}`, boxShadow: `0 0 ${70 * h}px ${col}66, inset 0 0 ${40 * h}px ${col}33` }}>
        <svg viewBox="-12 -12 24 24" width={r * 0.62} height={r * 0.62} style={{ position: "absolute", left: r * 0.24, top: r * 0.47, transform: `rotate(${t * 20 * h}deg)` }}>
          <path d="M0 -10 C1.2 -3 3 -1.2 10 0 C3 1.2 1.2 3 0 10 C-1.2 3 -3 1.2 -10 0 C-3 -1.2 -1.2 -3 0 -10 Z" fill={col} />
        </svg>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: r * 0.98, top: r * (0.5 + i * 0.22), width: r * (0.7 - i * 0.14) * (0.3 + 0.7 * h), height: r * 0.09, borderRadius: 9, background: col, opacity: 0.85 - i * 0.2 }} />
        ))}
      </div>
    </div>
  );
};

/** cable con pulsos que viajan (draw 0..1; flow = velocidad de los pulsos, 0 = quieto) */
export const Cable: React.FC<{ a: Pt; b: Pt; t: number; draw: number; bend?: number; color?: string; width?: number; flow?: number; pulses?: number; opacity?: number }> = ({
  a, b, t, draw, bend = 0.25, color = C.cyan, width = 6, flow = 1, pulses = 3, opacity = 1,
}) => {
  if (draw <= 0 || opacity <= 0) return null;
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const nx = -(b.y - a.y), ny = b.x - a.x;
  const cx = mx + nx * bend, cy = my + ny * bend;
  const pt = (k: number) => ({ x: (1 - k) ** 2 * a.x + 2 * (1 - k) * k * cx + k * k * b.x, y: (1 - k) ** 2 * a.y + 2 * (1 - k) * k * cy + k * k * b.y });
  const tip = pt(draw);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "visible", opacity, zIndex: 70 }}>
      <path d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`} fill="none" stroke="#0A0C12" strokeWidth={width + 6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
      <path d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
      {draw >= 1 && flow > 0 &&
        Array.from({ length: pulses }).map((_, i) => {
          const k = (t * 0.9 * flow + i / pulses) % 1;
          const p = pt(k);
          return <circle key={i} cx={p.x} cy={p.y} r={width * 1.2} fill="#E6FAFF" opacity={Math.sin(k * Math.PI)} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />;
        })}
      {draw < 1 && <circle cx={tip.x} cy={tip.y} r={width * 1.5} fill="#E6FAFF" style={{ filter: `drop-shadow(0 0 12px ${color})` }} />}
    </svg>
  );
};

/** chispa radial (llegada, confirmación) */
export const Spark: React.FC<{ x: number; y: number; k: number; color?: string; size?: number; seed?: string }> = ({ x, y, k, color = "#FFE2A8", size = 1, seed = "sp" }) => {
  if (k <= 0 || k >= 1) return null;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "visible", zIndex: 75 }}>
      <circle cx={x} cy={y} r={20 * size + 90 * size * ease.out(k)} fill="none" stroke={color} strokeWidth={4 * (1 - k)} opacity={1 - k} />
      {Array.from({ length: 12 }).map((_, i) => {
        const an = (i / 12) * Math.PI * 2 + rnd(seed + i) * 0.3;
        const d0 = 20 * size + 60 * size * ease.out(k), d1 = d0 + 30 * size * (1 - k);
        return <line key={i} x1={x + Math.cos(an) * d0} y1={y + Math.sin(an) * d0} x2={x + Math.cos(an) * d1} y2={y + Math.sin(an) * d1} stroke={color} strokeWidth={4} strokeLinecap="round" opacity={1 - k} />;
      })}
    </svg>
  );
};

/** visto en círculo */
export const Check: React.FC<{ x: number; y: number; s: number; k: number; color?: string }> = ({ x, y, s, k, color = C.green }) => {
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: 99, background: color, transform: `scale(${ease.back(clamp01(k))})`, boxShadow: `0 0 ${s * 0.6}px ${color}`, zIndex: 72 }}>
      <svg viewBox="0 0 24 24" width={s} height={s}>
        <path d="M6 12.5 L10 16.5 L18 8" fill="none" stroke="#0A0C12" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(k * 1.6 - 0.3)} />
      </svg>
    </div>
  );
};

/** tecla grande que se hunde (press 0..1..0) */
export const KeyCap: React.FC<{ x: number; y: number; label: string; size: number; k: number; press?: number; color?: string; opacity?: number }> = ({ x, y, label, size, k, press = 0, color = C.cyan, opacity = 1 }) => {
  if (k <= 0 || opacity <= 0) return null;
  const depth = size * 0.22;
  const p = clamp01(press);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * ease.back(clamp01(k))})`, opacity: clamp01(k * 2) * opacity, zIndex: 65 }}>
      <div style={{ position: "relative", padding: `${size * 0.32}px ${size * 0.7}px`, borderRadius: size * 0.34, transform: `translateY(${depth * p}px)`, background: "linear-gradient(180deg,#2A3245,#151A26)", border: `3px solid ${color}`, boxShadow: `0 ${depth * (1 - p)}px 0 #0A0D14, 0 ${depth * (1 - p) + 10}px 30px rgba(0,0,0,0.55), 0 0 ${size * (0.6 + 0.9 * p)}px ${color}${p > 0.3 ? "AA" : "55"}`, fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.ink, whiteSpace: "nowrap" }}>
        {label}
      </div>
    </div>
  );
};

/** destino de un comando propio (script, web, servicio) */
export const Dest: React.FC<{ x: number; y: number; size: number; icon: IconName; k: number; lit: number; t: number }> = ({ x, y, size, icon, k, lit, t }) => {
  if (k <= 0) return null;
  const col = C.cyan;
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: size * 0.26, transform: `scale(${0.6 + 0.4 * ease.back(clamp01(k))})`, opacity: clamp01(k * 2), background: "linear-gradient(160deg,#1A2433,#0C111A)", border: `3px solid ${lit > 0 ? col : "rgba(79,209,255,0.35)"}`, boxShadow: `0 20px 50px rgba(0,0,0,0.55), 0 0 ${60 * lit}px ${col}88`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 72 }}>
      <Icon name={icon} size={size * 0.52} color={lit > 0 ? "#E6FAFF" : col} stroke={1.8} style={{ transform: `scale(${1 + 0.08 * lit * Math.sin(t * 8)})` }} />
    </div>
  );
};

/** píldora de «hecho» */
export const DonePill: React.FC<{ x: number; y: number; size: number; label: string; k: number }> = ({ x, y, size, label, k }) => {
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * ease.back(clamp01(k))})`, opacity: clamp01(k * 2), display: "flex", alignItems: "center", gap: size * 0.4, padding: `${size * 0.32}px ${size * 0.7}px ${size * 0.32}px ${size * 0.4}px`, borderRadius: size, background: "linear-gradient(180deg,#14301F,#0C1A12)", border: `2px solid ${C.green}`, boxShadow: `0 16px 40px rgba(0,0,0,0.55), 0 0 ${size}px ${C.green}55`, fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.ink, whiteSpace: "nowrap", zIndex: 72 }}>
      <svg viewBox="0 0 24 24" width={size * 1.1} height={size * 1.1}>
        <circle cx={12} cy={12} r={11} fill={C.green} />
        <path d="M6.5 12.5 L10.2 16 L17.5 8.5" fill="none" stroke="#0A0C12" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </div>
  );
};

/** tarjeta de decisión centrada (la confirmación que el Omnibar pide antes de escribir en otra app) */
export const DecisionCard: React.FC<{ x: number; y: number; s: number; w: number; k: number; question: string; text: string; press?: number }> = ({ x, y, s, w, k, question, text, press = 0 }) => {
  if (k <= 0) return null;
  const e = ease.out(clamp01(k));
  const pressS = press > 0 && press < 1 ? 1 - 0.05 * Math.sin(Math.PI * press) : 1;
  return (
    <div style={{ position: "absolute", left: x - (w * s) / 2, top: y, width: w, transformOrigin: "0 0", transform: `scale(${s})`, opacity: clamp01(k * 1.6), zIndex: 68, fontFamily: OB_FONT, color: OB.text }}>
      <div style={{ transform: `translateY(-50%) translateY(${(1 - e) * 10}px) scale(${0.96 + 0.04 * e})`, borderRadius: 18, overflow: "hidden", boxShadow: `inset 0 0 0 1px ${OB.edgeStrong}, inset 0 1px 0 ${OB.highlight}, 0 30px 80px rgba(0,0,0,.6)` }}>
        <div style={{ background: "linear-gradient(180deg, rgba(34,34,34,.96), rgba(20,20,20,.97))", padding: "16px 18px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 650, marginBottom: 10 }}>
            <Icon name="sparkles" size={15} color={OB.ai} />
            {question}
          </div>
          <div style={{ padding: "10px 12px", borderRadius: 11, border: `1px solid ${OB.tileEdge}`, background: OB.tile, fontSize: 12.5, lineHeight: 1.5, color: OB.text, whiteSpace: "pre-wrap" }}>{text}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <span style={{ flex: 1, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, background: press > 0 ? "rgba(0,230,118,.22)" : OB.accentDim, border: `1px solid ${press > 0 ? "rgba(0,230,118,.6)" : OB.accentEdge}`, transform: `scale(${pressS})` }}>Sí, permitir</span>
            <span style={{ flex: 1, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: OB.muted, background: OB.tile, border: `1px solid ${OB.tileEdge}` }}>No, cancelar</span>
          </div>
        </div>
      </div>
    </div>
  );
};
