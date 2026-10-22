import React from "react";
import { C, clamp01, ease, FONT, rnd } from "../theme";
import { ACCENT, Kind, Slot } from "../windows";

// ───────── la cabeza (perfil mirando a la derecha), en unidades de un lienzo de 200×240 ─────────
export const HEAD_W = 200;
export const HEAD_H = 240;
export const HEAD_PATH =
  "M 72 236 L 72 204 C 44 192 24 162 24 122 C 24 62 66 18 116 18 C 160 18 189 50 190 94 C 190 108 186 117 191 128 L 199 144 C 201 149 199 153 194 154 L 188 155 L 189 167 C 190 175 186 179 180 180 L 171 181 C 169 194 161 201 146 199 L 136 198 L 136 236 Z";
/** zona del «cerebro» donde caben las ventanas (elipse en unidades de cabeza) */
export const BRAIN = { x: 110, y: 96, rx: 66, ry: 56 };
export const brainPoint = (seed: string) => {
  const a = rnd(seed + "a") * Math.PI * 2;
  const r = Math.sqrt(rnd(seed + "r")) * 0.92;
  return { x: BRAIN.x + Math.cos(a) * BRAIN.rx * r, y: BRAIN.y + Math.sin(a) * BRAIN.ry * r };
};

type HeadProps = {
  cx: number;
  cy: number;
  h: number; // alto en px
  draw?: number; // 0..1 trazo que se dibuja
  stroke?: string;
  glow?: string;
  glowAmt?: number;
  fill?: string;
  opacity?: number;
  shake?: number;
  children?: React.ReactNode; // contenido dentro de la cabeza, en unidades 200×240
};
export const Head: React.FC<HeadProps> = ({ cx, cy, h, draw = 1, stroke = C.ink, glow, glowAmt = 0, fill = "rgba(80,110,200,0.08)", opacity = 1, shake = 0, children }) => {
  if (opacity <= 0) return null;
  const s = h / HEAD_H;
  return (
    <div
      style={{
        position: "absolute", left: cx - (HEAD_W * s) / 2 + shake, top: cy - h / 2, width: HEAD_W, height: HEAD_H,
        transform: `scale(${s})`, transformOrigin: "0 0", opacity,
      }}
    >
      <svg width={HEAD_W} height={HEAD_H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs>
          <radialGradient id="headFill" cx="55%" cy="40%" r="60%">
            <stop offset="0%" stopColor={fill} />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        <path d={HEAD_PATH} fill="url(#headFill)" opacity={draw} />
        <path
          d={HEAD_PATH} fill="none" stroke={stroke} strokeWidth={1.3} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw}
          style={{ filter: glow && glowAmt > 0 ? `drop-shadow(0 0 ${6 * glowAmt}px ${glow})` : undefined }} opacity={0.85}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, clipPath: `path('${HEAD_PATH}')` }}>{children}</div>
    </div>
  );
};

/** ventana en miniatura (dentro de la cabeza o en el mapa) */
export const MiniWin: React.FC<{ x: number; y: number; w: number; h: number; kind: Kind; rot?: number; opacity?: number; scale?: number; glow?: string; glowAmt?: number; dot?: boolean; desat?: number }> = ({
  x, y, w, h, kind, rot = 0, opacity = 1, scale = 1, glow, glowAmt = 0, dot = false, desat = 0,
}) => {
  if (opacity <= 0) return null;
  const acc = ACCENT[kind];
  const u = h / 40;
  return (
    <div
      style={{
        position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: 3 * u, opacity,
        transform: `rotate(${rot}deg) scale(${scale})`, background: "linear-gradient(180deg,#151B29,#0E121C)",
        border: `${0.6 * u}px solid ${glow && glowAmt > 0 ? glow : "rgba(255,255,255,0.14)"}`,
        boxShadow: `0 ${2 * u}px ${6 * u}px rgba(0,0,0,0.5)${glow && glowAmt > 0 ? `, 0 0 ${8 * u * glowAmt}px ${glow}` : ""}`,
        filter: desat ? `grayscale(${desat})` : undefined, overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 5 * u, background: "rgba(255,255,255,0.05)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 0.9 * u, background: acc }} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 4 * u, top: (10 + i * 8) * u, width: `${70 - i * 15}%`, height: 3 * u, borderRadius: 9, background: i === 0 ? acc : "rgba(255,255,255,0.2)", opacity: i === 0 ? 0.7 : 1 }} />
      ))}
      {dot && <div style={{ position: "absolute", right: -2 * u, top: -2 * u, width: 9 * u, height: 9 * u, borderRadius: 99, background: C.coral, boxShadow: `0 0 ${6 * u}px ${C.coral}` }} />}
    </div>
  );
};

/** medidor vertical de energía mental (1 lleno, 0 vacío) */
export const Meter: React.FC<{ x: number; y: number; w: number; h: number; v: number; opacity?: number; t: number }> = ({ x, y, w, h, v, opacity = 1, t }) => {
  if (opacity <= 0) return null;
  const col = v > 0.6 ? C.green : v > 0.3 ? C.amber : C.coral;
  const flick = v < 0.15 ? (Math.sin(t * 40) > 0 ? 1 : 0.55) : 1;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, opacity }}>
      <div style={{ position: "absolute", left: w * 0.3, width: w * 0.4, top: -h * 0.04, height: h * 0.05, borderRadius: 4, background: "rgba(243,241,234,0.4)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: w * 0.28, border: `${Math.max(3, w * 0.06)}px solid rgba(243,241,234,0.55)` }} />
      <div
        style={{
          position: "absolute", left: w * 0.14, right: w * 0.14, bottom: h * 0.04, height: (h * 0.92) * clamp01(v), borderRadius: w * 0.16,
          background: `linear-gradient(0deg, ${col}, ${col}cc)`, boxShadow: `0 0 ${w * 0.5}px ${col}88`, opacity: flick,
        }}
      />
      <svg viewBox="0 0 24 24" width={w * 0.5} height={w * 0.5} style={{ position: "absolute", left: w * 0.25, top: h + w * 0.25 }}>
        <path d="M13 2 L4 14 H11 L10 22 L20 9 H13 Z" fill={col} />
      </svg>
    </div>
  );
};

/** hilo del foco: de la cabeza a la tarea; tension 0..1, snap 0..1 (se rompe y se recoge) */
export const Thread: React.FC<{ a: { x: number; y: number }; b: { x: number; y: number }; t: number; draw?: number; tension?: number; snap?: number; color?: string; width?: number }> = ({
  a, b, t, draw = 1, tension = 0, snap = 0, color = C.amber, width = 5,
}) => {
  if (draw <= 0) return null;
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const sag = 60 * (1 - tension);
  const wob = Math.sin(t * 30) * 6 * tension;
  const glow = { filter: `drop-shadow(0 0 8px ${color})` };
  if (snap <= 0) {
    return (
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "visible" }}>
        <path d={`M ${a.x} ${a.y} Q ${mx} ${my + sag + wob} ${b.x} ${b.y}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} style={glow} />
      </svg>
    );
  }
  // roto: cada mitad se recoge hacia su extremo con un latigazo
  const k = ease.out(clamp01(snap));
  const ax = mx + (a.x - mx) * k, ay = my + (a.y - my) * k + 40 * Math.sin(k * 3);
  const bx = mx + (b.x - mx) * k, by = my + (b.y - my) * k + 40 * Math.sin(k * 3);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "visible", opacity: 1 - clamp01((snap - 0.6) / 0.4) }}>
      <path d={`M ${a.x} ${a.y} Q ${(a.x + ax) / 2} ${(a.y + ay) / 2 + 50 * (1 - k)} ${ax} ${ay}`} fill="none" stroke={C.coral} strokeWidth={width} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${C.coral})` }} />
      <path d={`M ${b.x} ${b.y} Q ${(b.x + bx) / 2} ${(b.y + by) / 2 + 50 * (1 - k)} ${bx} ${by}`} fill="none" stroke={C.coral} strokeWidth={width} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${C.coral})` }} />
      {snap < 0.4 &&
        Array.from({ length: 10 }).map((_, i) => {
          const an = rnd("sp" + i) * Math.PI * 2;
          const d = 20 + 90 * ease.out(snap / 0.4) * rnd("sd" + i);
          return <circle key={i} cx={mx + Math.cos(an) * d} cy={my + Math.sin(an) * d} r={3} fill="#FFE2A8" opacity={1 - snap / 0.4} />;
        })}
    </svg>
  );
};

/** ratón visto desde arriba, con los botones laterales X1 (atrás) y X2 (adelante) en el lado del pulgar */
export const Mouse: React.FC<{ cx: number; cy: number; h: number; lit?: number; press?: "x1" | "x2" | null; opacity?: number; labels?: boolean }> = ({ cx, cy, h, lit = 1, press = null, opacity = 1, labels = true }) => {
  if (opacity <= 0) return null;
  const s = h / 200;
  const btn = (y: number, name: "x1" | "x2") => {
    const on = press === name;
    return (
      <g key={name} transform={`translate(${on ? 3 : 0} 0)`}>
        <rect x={-9} y={y} width={18} height={30} rx={7} fill={on ? C.amber : "#2A3142"} stroke={C.amber} strokeOpacity={0.4 + 0.6 * lit} strokeWidth={2.5} style={{ filter: `drop-shadow(0 0 ${on ? 14 : 6 * lit}px ${C.amber})` }} />
        {labels && (
          <text x={-22} y={y + 21} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={17} fill={on ? C.amber : "rgba(243,241,234,0.75)"}>
            {name.toUpperCase()}
          </text>
        )}
      </g>
    );
  };
  return (
    <svg width={160 * s} height={200 * s} viewBox="-30 0 160 200" style={{ position: "absolute", left: cx - 80 * s, top: cy - 100 * s, opacity, overflow: "visible" }}>
      <defs>
        <linearGradient id="mouseBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#262D3E" />
          <stop offset="100%" stopColor="#10141E" />
        </linearGradient>
      </defs>
      <path d="M 50 6 C 92 6 112 40 112 92 C 112 160 90 194 56 194 C 22 194 2 160 2 92 C 2 40 12 6 50 6 Z" fill="url(#mouseBody)" stroke="rgba(243,241,234,0.35)" strokeWidth={2} />
      <line x1={56} y1={8} x2={56} y2={70} stroke="rgba(243,241,234,0.25)" strokeWidth={2} />
      <path d="M 2 70 C 30 76 84 76 112 70" fill="none" stroke="rgba(243,241,234,0.15)" strokeWidth={2} />
      <rect x={50} y={24} width={12} height={26} rx={6} fill="#3A4256" />
      {btn(86, "x2")}
      {btn(122, "x1")}
    </svg>
  );
};

/** teclas tipo «Alt + X2» */
export const Keys: React.FC<{ x: number; y: number; keys: string[]; size: number; k: number; color?: string }> = ({ x, y, keys, size, k, color = C.cyan }) => {
  if (k <= 0) return null;
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * ease.back(clamp01(k))})`, opacity: clamp01(k * 2),
        display: "flex", alignItems: "center", gap: size * 0.3, fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.ink,
      }}
    >
      {keys.map((key, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ opacity: 0.6 }}>+</span>}
          <span
            style={{
              padding: `${size * 0.22}px ${size * 0.5}px`, borderRadius: size * 0.28, background: "linear-gradient(180deg,#232A3A,#141924)",
              border: `2px solid ${color}`, boxShadow: `0 ${size * 0.12}px 0 #0A0D14, 0 0 ${size * 0.6}px ${color}55`,
            }}
          >
            {key}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

/** habitación del mapa: un escritorio con su distribución (pantalla principal del conjunto) */
export const Room: React.FC<{ x: number; y: number; w: number; h: number; slots: Slot[]; icon: string; lit: number; opacity?: number; k?: number }> = ({ x, y, w, h, slots, icon, lit, opacity = 1, k = 1 }) => {
  if (opacity <= 0) return null;
  const pad = w * 0.04;
  return (
    <div
      style={{
        position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: w * 0.04, opacity,
        background: "linear-gradient(160deg, rgba(26,32,48,0.95), rgba(12,15,23,0.95))",
        border: `2px solid ${lit > 0 ? C.amber : "rgba(255,255,255,0.12)"}`, boxShadow: `0 30px 70px rgba(0,0,0,0.55)${lit > 0 ? `, 0 0 ${50 * lit}px ${C.amber}66` : ""}`,
        transform: `scale(${0.6 + 0.4 * ease.back(clamp01(k))})`,
      }}
    >
      {slots
        .filter((s) => s.mon === 0)
        .map((s, i) => {
          const sk = clamp01((k - 0.3 - i * 0.12) / 0.4);
          return (
            <div
              key={s.id}
              style={{
                position: "absolute", left: pad + s.f.x * (w - 2 * pad) + 3, top: pad * 1.6 + s.f.y * (h - pad * 3.2) + 3, width: s.f.w * (w - 2 * pad) - 6, height: s.f.h * (h - pad * 3.2) - 6,
                borderRadius: w * 0.012, background: "linear-gradient(180deg,#171D2C,#0F131D)", border: "1px solid rgba(255,255,255,0.1)", opacity: sk, overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: ACCENT[s.kind] }} />
              {[0, 1, 2, 3].map((j) => (
                <div key={j} style={{ position: "absolute", left: "8%", top: `${18 + j * 16}%`, width: `${70 - j * 12}%`, height: "6%", borderRadius: 9, background: j === 0 ? ACCENT[s.kind] : "rgba(255,255,255,0.16)", opacity: j === 0 ? 0.7 : 1 }} />
              ))}
            </div>
          );
        })}
      <svg viewBox="0 0 24 24" width={h * 0.14} height={h * 0.14} style={{ position: "absolute", left: w / 2 - h * 0.07, top: h + h * 0.06 }}>
        <path d={icon} fill="none" stroke={lit > 0 ? C.amber : C.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export const ICONS = [
  "M8 7 L3 12 L8 17 M16 7 L21 12 L16 17 M14 4 L10 20",
  "M3 5 H9 A3 3 0 0 1 12 8 V20 A2.5 2.5 0 0 0 9.5 17.5 H3 Z M21 5 H15 A3 3 0 0 0 12 8 V20 A2.5 2.5 0 0 1 14.5 17.5 H21 Z",
  "M4 20 L8 19 L19.5 7.5 A2.1 2.1 0 0 0 16.5 4.5 L5 16 Z M14.5 6.5 L17.5 9.5",
];
