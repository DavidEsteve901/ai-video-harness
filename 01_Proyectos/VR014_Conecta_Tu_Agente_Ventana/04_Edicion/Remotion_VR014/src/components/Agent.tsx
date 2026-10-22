import React from "react";
import { Img, staticFile } from "remotion";
import { C, clamp01, ease, FONT, rnd } from "../theme";
import { P_CLAUDE, P_COPILOT, P_CURSOR } from "../logos";

// ───────── agentes: sus marcas solo identifican la herramienta (sin colaboración) ─────────
export type AgentId = "claude" | "codex" | "cursor" | "antigravity" | "copilot";
export const AGENTS: AgentId[] = ["claude", "codex", "cursor", "antigravity", "copilot"];

const Glyph: React.FC<{ id: AgentId; s: number }> = ({ id, s }) => {
  if (id === "codex") return <Img src={staticFile("img/agentes/codex.png")} style={{ width: s, height: s }} />;
  if (id === "antigravity") return <Img src={staticFile("img/agentes/antigravity.svg")} style={{ width: s * 1.08, height: s * 1.08 }} />;
  const d = id === "claude" ? P_CLAUDE : id === "cursor" ? P_CURSOR : P_COPILOT;
  return (
    <svg viewBox="0 0 24 24" width={s} height={s}>
      <path d={d} fill={id === "claude" ? "#D97757" : "#F3F1EA"} />
    </svg>
  );
};

/** ficha redonda de cristal con el logo del agente */
export const AgentLogo: React.FC<{ id: AgentId; x: number; y: number; size: number; k?: number; glow?: number; opacity?: number; rot?: number }> = ({
  id, x, y, size, k = 1, glow = 0, opacity = 1, rot = 0,
}) => {
  if (k <= 0 || opacity <= 0) return null;
  return (
    <div
      style={{
        position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: size * 0.3, opacity: opacity * clamp01(k * 3),
        background: "linear-gradient(160deg, #1E2536, #0D111A)", border: `${Math.max(2, size * 0.02)}px solid ${glow > 0 ? C.amber : "rgba(255,255,255,0.16)"}`,
        boxShadow: `0 ${size * 0.12}px ${size * 0.3}px rgba(0,0,0,0.55)${glow > 0 ? `, 0 0 ${size * 0.45 * glow}px ${C.amber}88` : ""}`,
        display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${k}) rotate(${rot}deg)`,
      }}
    >
      <Glyph id={id} s={size * 0.56} />
    </div>
  );
};

/** el agente, abstracto: un núcleo ámbar con destello (la IA). Si `logo`, lleva dentro la marca del agente. */
export const Orb: React.FC<{ x: number; y: number; r: number; t: number; k?: number; dim?: number; logo?: AgentId | null; logoK?: number; opacity?: number }> = ({
  x, y, r, t, k = 1, dim = 0, logo = null, logoK = 1, opacity = 1,
}) => {
  if (k <= 0 || opacity <= 0) return null;
  const pulse = 1 + 0.04 * Math.sin(t * 3.2);
  const lum = 1 - dim * 0.65;
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, transform: `scale(${k * pulse})`, opacity }}>
      <div style={{ position: "absolute", inset: -r * 0.9, borderRadius: 999, background: `radial-gradient(circle, ${C.amber}55, transparent 65%)`, opacity: lum }} />
      <div
        style={{
          position: "absolute", inset: 0, borderRadius: 999, filter: `brightness(${lum})`,
          background: "radial-gradient(circle at 38% 32%, #FFE7B8 0%, #FFB547 38%, #C9761B 78%, #6B3A0C 100%)",
          boxShadow: `0 0 ${r * 0.7}px ${C.amber}, inset 0 ${-r * 0.15}px ${r * 0.4}px rgba(0,0,0,0.35)`,
        }}
      />
      {/* anillo que gira */}
      <svg width={2 * r} height={2 * r} viewBox="-50 -50 100 100" style={{ position: "absolute", inset: 0, overflow: "visible", transform: `rotate(${t * 60}deg)`, opacity: 0.8 * lum }}>
        <circle r={62} fill="none" stroke={C.amber} strokeWidth={1.6} strokeDasharray="10 7 2 7" />
      </svg>
      {logo ? (
        <div style={{ position: "absolute", inset: r * 0.18, borderRadius: 999, background: "#0D111A", display: "flex", alignItems: "center", justifyContent: "center", opacity: logoK, transform: `scale(${0.7 + 0.3 * logoK})` }}>
          <Glyph id={logo} s={r * 0.95} />
        </div>
      ) : (
        <svg viewBox="-12 -12 24 24" width={r * 1.05} height={r * 1.05} style={{ position: "absolute", left: r * 0.475, top: r * 0.475, transform: `rotate(${Math.sin(t * 1.5) * 8}deg)` }}>
          <path d="M0 -10 C1.2 -3 3 -1.2 10 0 C3 1.2 1.2 3 0 10 C-1.2 3 -3 1.2 -10 0 C-3 -1.2 -1.2 -3 0 -10 Z" fill="#FFF6E3" opacity={lum} />
        </svg>
      )}
    </div>
  );
};

/** la ventana donde «vive» el agente: marco, barrotes (bars 0..1 bajan) y hojas que se abren (open 0..1) */
export const Cage: React.FC<{
  x: number; y: number; w: number; h: number; t: number; k?: number; bars?: number; lift?: number; open?: number; tone?: string; glowAmt?: number; children?: React.ReactNode; opacity?: number; dim?: number;
}> = ({ x, y, w, h, t, k = 1, bars = 0, lift = 0, open = 0, tone = C.amber, glowAmt = 0.4, children, opacity = 1, dim = 0 }) => {
  if (k <= 0 || opacity <= 0) return null;
  const bh = Math.max(34, h * 0.075);
  const nb = 7;
  const lock = bars > 0.6 && lift < 0.3;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `scale(${0.85 + 0.15 * k})`, opacity: opacity * clamp01(k * 2) }}>
      <div
        style={{
          position: "absolute", inset: 0, borderRadius: w * 0.03, overflow: "hidden", filter: dim ? `brightness(${1 - dim * 0.5})` : undefined,
          background: "linear-gradient(180deg, #151B29, #0C1018)", border: `2px solid ${glowAmt > 0 ? tone : "rgba(255,255,255,0.14)"}`,
          boxShadow: `0 40px 90px rgba(0,0,0,0.6), 0 0 ${70 * glowAmt}px ${tone}66`,
        }}
      >
        {/* barra de título */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: bh, background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: bh * 0.45 + i * bh * 0.42, top: bh * 0.36, width: bh * 0.28, height: bh * 0.28, borderRadius: 99, background: ["#FF5F57", "#FEBC2E", "#28C840"][i], opacity: 0.8 }} />
          ))}
          <div style={{ position: "absolute", left: "34%", right: "34%", top: bh * 0.38, height: bh * 0.24, borderRadius: 99, background: "rgba(255,255,255,0.1)" }} />
        </div>
        {/* conversación abstracta */}
        {[0, 1, 2, 3].map((i) => {
          const right = i % 2 === 1;
          const ww = [0.42, 0.3, 0.5, 0.26][i];
          return (
            <div
              key={i}
              style={{
                position: "absolute", top: bh + h * (0.08 + i * 0.12), height: h * 0.075, width: `${ww * 100}%`, borderRadius: h * 0.04,
                left: right ? undefined : "6%", right: right ? "6%" : undefined, background: right ? "rgba(255,181,71,0.16)" : "rgba(255,255,255,0.07)",
              }}
            />
          );
        })}
        <div style={{ position: "absolute", left: "6%", right: "6%", bottom: h * 0.06, height: h * 0.1, borderRadius: h * 0.05, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.03)" }} />
        {children}
        {/* luz que sale al abrir */}
        {open > 0 && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 55%, #FFE2A8, ${C.amber}88 35%, transparent 75%)`, opacity: clamp01(open * 1.4) * 0.85 }} />}
      </div>
      {/* hojas de cristal (se abren como puertas) */}
      {open > 0 && open < 1 &&
        [0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute", top: bh, bottom: 0, width: w / 2, left: i === 0 ? 0 : w / 2, transformOrigin: i === 0 ? "left center" : "right center",
              transform: `perspective(${w * 2}px) rotateY(${(i === 0 ? -1 : 1) * 100 * ease.out(open)}deg)`,
              background: "linear-gradient(120deg, rgba(180,210,255,0.16), rgba(180,210,255,0.04))", border: "1px solid rgba(200,220,255,0.25)",
            }}
          />
        ))}
      {/* barrotes */}
      {bars > 0 &&
        Array.from({ length: nb }).map((_, i) => {
          const d = clamp01((bars - i * 0.04) / 0.72);
          const up = clamp01((lift - (nb - 1 - i) * 0.07) / 0.6);
          const fall = ease.back(d);
          const yy = -h * (1 - fall) - h * 1.15 * ease.in(up);
          if (d <= 0) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute", left: w * ((i + 1) / (nb + 1)) - w * 0.011, top: bh + yy, width: w * 0.022, height: h - bh, borderRadius: 99,
                background: "linear-gradient(90deg, #6A7184, #C9CED9 45%, #555B6B)", boxShadow: `0 0 18px rgba(0,0,0,0.6)${glowAmt > 0 && tone === C.coral ? `, 0 0 14px ${C.coral}88` : ""}`, opacity: 1 - up,
              }}
            />
          );
        })}
      {/* candado */}
      {(lock || (bars > 0.6 && lift < 0.6)) && (
        <svg viewBox="0 0 24 24" width={bh * 1.6} height={bh * 1.6} style={{ position: "absolute", left: w / 2 - bh * 0.8, top: -bh * 0.9, transform: `rotate(${lift > 0.3 ? 0 : Math.sin(t * 30) * 2 * clamp01((bars - 0.6) * 4)}deg)`, opacity: 1 - clamp01((lift - 0.3) / 0.3) }}>
          <rect x={5} y={10} width={14} height={11} rx={2.5} fill={C.coral} />
          <path d={lift > 0.25 ? "M8 10 V7 A4 4 0 0 1 16 7 V5" : "M8 10 V7 A4 4 0 0 1 16 7 V10"} fill="none" stroke={C.coral} strokeWidth={2.4} strokeLinecap="round" />
          <circle cx={12} cy={15.5} r={1.6} fill="#0A0C12" />
        </svg>
      )}
    </div>
  );
};

/** árbol de archivos del proyecto (abstracto). `rows` 0..1 cuántas filas se ven; `hl` resalta por tipo */
export type TreeRow = { name: string; depth: number; kind: "dir" | "file" | "script" };
export const TREE: TreeRow[] = [
  { name: "mi-proyecto", depth: 0, kind: "dir" },
  { name: "src", depth: 1, kind: "dir" },
  { name: "app.ts", depth: 2, kind: "file" },
  { name: "informe.py", depth: 2, kind: "script" },
  { name: "scripts", depth: 1, kind: "dir" },
  { name: "deploy.ps1", depth: 2, kind: "script" },
  { name: "backup.ps1", depth: 2, kind: "script" },
  { name: "package.json", depth: 1, kind: "file" },
  { name: "README.md", depth: 1, kind: "file" },
];
export const Tree: React.FC<{ x: number; y: number; w: number; h: number; t: number; rows: number; hlDir?: number; hlScript?: number; scan?: number; k?: number }> = ({
  x, y, w, h, t, rows, hlDir = 0, hlScript = 0, scan = -1, k = 1,
}) => {
  if (k <= 0) return null;
  const rh = (h - 40) / TREE.length;
  const fs = rh * 0.5;
  return (
    <div
      style={{
        position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: 22, opacity: clamp01(k * 2), transform: `scale(${0.9 + 0.1 * k})`,
        background: "linear-gradient(160deg, rgba(24,30,46,0.96), rgba(11,14,22,0.96))", border: "2px solid rgba(255,255,255,0.12)", boxShadow: "0 30px 80px rgba(0,0,0,0.55)", overflow: "hidden",
      }}
    >
      {TREE.map((r, i) => {
        const rk = ease.out(clamp01(rows * TREE.length - i));
        if (rk <= 0) return null;
        const lit = r.kind === "dir" ? hlDir : r.kind === "script" ? hlScript : 0;
        const ld = clamp01(lit * 3 - (r.kind === "dir" ? i * 0.25 : (i - 3) * 0.12));
        const col = ld > 0 ? C.amber : r.kind === "dir" ? "#AFC2E8" : "rgba(243,241,234,0.75)";
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: 26 + r.depth * rh * 0.9, top: 20 + i * rh, height: rh * 0.82, display: "flex", alignItems: "center", gap: rh * 0.3,
              opacity: rk, transform: `translateX(${(1 - rk) * -30}px)`, fontFamily: "Consolas, 'Cascadia Mono', monospace", fontWeight: 700, fontSize: fs, color: col,
              padding: `0 ${rh * 0.3}px`, borderRadius: rh * 0.2, background: ld > 0 ? `rgba(255,181,71,${0.16 * ld})` : undefined, boxShadow: ld > 0 ? `0 0 ${24 * ld}px ${C.amber}44` : undefined,
            }}
          >
            {r.kind === "dir" ? (
              <svg viewBox="0 0 24 24" width={rh * 0.55} height={rh * 0.55}>
                <path d="M3 6 A2 2 0 0 1 5 4 H9 L11 6.5 H19 A2 2 0 0 1 21 8.5 V18 A2 2 0 0 1 19 20 H5 A2 2 0 0 1 3 18 Z" fill={ld > 0 ? C.amber : "#5D7BB5"} />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width={rh * 0.5} height={rh * 0.5}>
                <path d="M6 3 H14 L19 8 V21 H6 Z" fill="none" stroke={col} strokeWidth={2} strokeLinejoin="round" />
                {r.kind === "script" && <path d="M9 13 L11 15 L9 17 M13 17 H16" fill="none" stroke={col} strokeWidth={2} strokeLinecap="round" />}
              </svg>
            )}
            {r.name}
            {r.kind === "script" && ld > 0.5 && (
              <svg viewBox="0 0 24 24" width={rh * 0.48} height={rh * 0.48} style={{ transform: `rotate(${t * 120}deg)` }}>
                <path d={GEAR} fill={C.amber} />
              </svg>
            )}
          </div>
        );
      })}
      {scan >= 0 && scan <= 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: scan * h - 40, height: 80, background: `linear-gradient(180deg, transparent, ${C.amber}33, transparent)`, borderBottom: `2px solid ${C.amber}aa` }} />
      )}
    </div>
  );
};

export const GEAR =
  "M10.3 2 h3.4 l.5 2.6 a7.6 7.6 0 0 1 1.9 .8 l2.2 -1.5 2.4 2.4 -1.5 2.2 a7.6 7.6 0 0 1 .8 1.9 l2.6 .5 v3.4 l-2.6 .5 a7.6 7.6 0 0 1 -.8 1.9 l1.5 2.2 -2.4 2.4 -2.2 -1.5 a7.6 7.6 0 0 1 -1.9 .8 l-.5 2.6 h-3.4 l-.5 -2.6 a7.6 7.6 0 0 1 -1.9 -.8 l-2.2 1.5 -2.4 -2.4 1.5 -2.2 a7.6 7.6 0 0 1 -.8 -1.9 L2 13.7 v-3.4 l2.6 -.5 a7.6 7.6 0 0 1 .8 -1.9 L3.9 5.7 6.3 3.3 8.5 4.8 a7.6 7.6 0 0 1 1.9 -.8 Z M12 8.6 a3.4 3.4 0 1 0 0 6.8 a3.4 3.4 0 1 0 0 -6.8 Z";

/** cable con pulsos que viajan (draw 0..1; flow = velocidad de los pulsos, 0 = quieto) */
export const Cable: React.FC<{ a: { x: number; y: number }; b: { x: number; y: number }; t: number; draw: number; bend?: number; color?: string; width?: number; flow?: number; pulses?: number }> = ({
  a, b, t, draw, bend = 0.25, color = C.amber, width = 6, flow = 1, pulses = 3,
}) => {
  if (draw <= 0) return null;
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const nx = -(b.y - a.y), ny = b.x - a.x;
  const cx = mx + nx * bend, cy = my + ny * bend;
  const pt = (k: number) => ({ x: (1 - k) ** 2 * a.x + 2 * (1 - k) * k * cx + k * k * b.x, y: (1 - k) ** 2 * a.y + 2 * (1 - k) * k * cy + k * k * b.y });
  const tip = pt(draw);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "visible" }}>
      <path d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`} fill="none" stroke="#0A0C12" strokeWidth={width + 6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
      <path d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
      {draw >= 1 && flow > 0 &&
        Array.from({ length: pulses }).map((_, i) => {
          const k = (t * 0.9 * flow + i / pulses) % 1;
          const p = pt(k);
          return <circle key={i} cx={p.x} cy={p.y} r={width * 1.3} fill="#FFF3D6" opacity={Math.sin(k * Math.PI)} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />;
        })}
      {draw < 1 && <circle cx={tip.x} cy={tip.y} r={width * 1.6} fill="#FFF3D6" style={{ filter: `drop-shadow(0 0 12px ${color})` }} />}
    </svg>
  );
};

/** chispa radial (enchufe, confirmación) */
export const Spark: React.FC<{ x: number; y: number; k: number; color?: string; size?: number; seed?: string }> = ({ x, y, k, color = "#FFE2A8", size = 1, seed = "sp" }) => {
  if (k <= 0 || k >= 1) return null;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "visible" }}>
      <circle cx={x} cy={y} r={20 * size + 90 * size * ease.out(k)} fill="none" stroke={color} strokeWidth={4 * (1 - k)} opacity={1 - k} />
      {Array.from({ length: 12 }).map((_, i) => {
        const an = (i / 12) * Math.PI * 2 + rnd(seed + i) * 0.3;
        const d0 = 20 * size + 60 * size * ease.out(k), d1 = d0 + 30 * size * (1 - k);
        return <line key={i} x1={x + Math.cos(an) * d0} y1={y + Math.sin(an) * d0} x2={x + Math.cos(an) * d1} y2={y + Math.sin(an) * d1} stroke={color} strokeWidth={4} strokeLinecap="round" opacity={1 - k} />;
      })}
    </svg>
  );
};

/** ficha de función del proyecto (engranaje + nombre). gray 0..1 = enterrada */
export const FnChip: React.FC<{ x: number; y: number; label: string; size: number; t: number; k?: number; gray?: number; tone?: string; slash?: boolean; opacity?: number; rot?: number }> = ({
  x, y, label, size, t, k = 1, gray = 0, tone = C.amber, slash = false, opacity = 1, rot = 0,
}) => {
  if (k <= 0 || opacity <= 0) return null;
  const col = tone;
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${k}) rotate(${rot}deg)`, opacity, filter: gray > 0 ? `grayscale(${gray}) brightness(${1 - gray * 0.45})` : undefined,
        display: "flex", alignItems: "center", gap: size * 0.32, padding: `${size * 0.3}px ${size * 0.6}px ${size * 0.3}px ${size * 0.4}px`, borderRadius: size * 0.5, whiteSpace: "nowrap",
        background: "linear-gradient(180deg, #232A3A, #121722)", border: `2px solid ${col}`, boxShadow: `0 ${size * 0.2}px ${size * 0.5}px rgba(0,0,0,0.5), 0 0 ${size * 0.8 * (1 - gray)}px ${col}66`,
        fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.ink, zIndex: 25,
      }}
    >
      <svg viewBox="0 0 24 24" width={size * 1.1} height={size * 1.1} style={{ transform: `rotate(${t * (gray > 0.5 ? 0 : 90)}deg)` }}>
        <path d={GEAR} fill={col} fillRule="evenodd" />
      </svg>
      <span style={{ color: slash ? col : C.ink }}>{slash ? "/" : ""}</span>
      <span style={{ marginLeft: slash ? -size * 0.3 : 0 }}>{label}</span>
    </div>
  );
};

/** barra de órdenes abstracta (metáfora del Omnibar, no su interfaz real) */
export const Bar: React.FC<{ x: number; y: number; w: number; h: number; k: number; t: number; text?: string; caret?: boolean; glow?: number; tone?: string; children?: React.ReactNode }> = ({
  x, y, w, h, k, t, text = "", caret = true, glow = 0.6, tone = C.cyan, children,
}) => {
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, opacity: clamp01(k * 2), transform: `translateY(${(1 - ease.out(clamp01(k))) * -40}px) scale(${0.92 + 0.08 * k})`, zIndex: 20 }}>
      <div
        style={{
          position: "relative", height: h, borderRadius: h * 0.5, display: "flex", alignItems: "center", gap: h * 0.25, padding: `0 ${h * 0.4}px`,
          background: "linear-gradient(180deg, rgba(40,48,68,0.86), rgba(18,22,34,0.9))", border: `2px solid ${tone}`, backdropFilter: "blur(8px)",
          boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 ${50 * glow}px ${tone}55, inset 0 1px 0 rgba(255,255,255,0.15)`,
        }}
      >
        <svg viewBox="-12 -12 24 24" width={h * 0.42} height={h * 0.42}>
          <path d="M0 -10 C1.2 -3 3 -1.2 10 0 C3 1.2 1.2 3 0 10 C-1.2 3 -3 1.2 -10 0 C-3 -1.2 -1.2 -3 0 -10 Z" fill={C.amber} />
        </svg>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: h * 0.4, color: text ? C.ink : "rgba(243,241,234,0.4)" }}>
          {text}
          {caret && <span style={{ opacity: Math.floor(t * 2.4) % 2 ? 0 : 1, color: tone }}>|</span>}
        </span>
      </div>
      {children}
    </div>
  );
};

/** caja del proyecto: su lógica (engranajes) trabaja dentro */
export const ProjectBox: React.FC<{ x: number; y: number; s: number; t: number; k?: number; work?: number; label?: string }> = ({ x, y, s, t, k = 1, work = 0, label = "tu proyecto" }) => {
  if (k <= 0) return null;
  const spin = t * (40 + 260 * work);
  return (
    <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s * 0.82, transform: `scale(${0.6 + 0.4 * ease.back(clamp01(k))})`, opacity: clamp01(k * 2) }}>
      <div
        style={{
          position: "absolute", inset: 0, borderRadius: s * 0.1, background: "linear-gradient(160deg, #2A2213, #15110A)",
          border: `3px solid ${work > 0 ? C.amber : "rgba(255,181,71,0.5)"}`, boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 ${80 * work}px ${C.amber}77`,
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: s * 0.16, borderRadius: `${s * 0.1}px ${s * 0.1}px 0 0`, background: "rgba(255,181,71,0.14)" }} />
      <svg viewBox="0 0 24 24" width={s * 0.42} height={s * 0.42} style={{ position: "absolute", left: s * 0.14, top: s * 0.26, transform: `rotate(${spin}deg)` }}>
        <path d={GEAR} fill={C.amber} fillRule="evenodd" />
      </svg>
      <svg viewBox="0 0 24 24" width={s * 0.3} height={s * 0.3} style={{ position: "absolute", left: s * 0.53, top: s * 0.2, transform: `rotate(${-spin * 1.4 + 12}deg)` }}>
        <path d={GEAR} fill="#FFD48A" fillRule="evenodd" />
      </svg>
      <svg viewBox="0 0 24 24" width={s * 0.24} height={s * 0.24} style={{ position: "absolute", left: s * 0.6, top: s * 0.47, transform: `rotate(${spin * 1.8}deg)` }}>
        <path d={GEAR} fill="#C9761B" fillRule="evenodd" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: s * 0.88, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: s * 0.12, color: C.amber, whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
};

/** interruptor de ajuste */
export const Toggle: React.FC<{ x: number; y: number; s: number; on: number; k?: number }> = ({ x, y, s, on, k = 1 }) => {
  if (k <= 0) return null;
  const col = on > 0.5 ? C.cyan : "#3A4256";
  return (
    <div style={{ position: "absolute", left: x - s, top: y - s * 0.5, width: s * 2, height: s, borderRadius: s, background: on > 0.5 ? `${C.cyan}44` : "#1A2030", border: `3px solid ${col}`, transform: `scale(${ease.back(clamp01(k))})`, boxShadow: on > 0.5 ? `0 0 ${s * 0.6}px ${C.cyan}66` : undefined }}>
      <div style={{ position: "absolute", top: s * 0.1, left: s * 0.1 + s * ease.backSoft(clamp01(on)), width: s * 0.72, height: s * 0.72, borderRadius: 99, background: on > 0.5 ? C.cyan : "#8A90A2" }} />
    </div>
  );
};

/** visto en círculo */
export const Check: React.FC<{ x: number; y: number; s: number; k: number; color?: string }> = ({ x, y, s, k, color = C.green }) => {
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: 99, background: color, transform: `scale(${ease.back(clamp01(k))})`, boxShadow: `0 0 ${s * 0.6}px ${color}`, zIndex: 30 }}>
      <svg viewBox="0 0 24 24" width={s} height={s}>
        <path d="M6 12.5 L10 16.5 L18 8" fill="none" stroke="#0A0C12" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(k * 1.6 - 0.3)} />
      </svg>
    </div>
  );
};
