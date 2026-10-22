import React from "react";
import { AbsoluteFill } from "remotion";
import { Video } from "@remotion/media";
import { staticFile } from "remotion";
import { ANTON, C, clamp01, easeBack, easeInOut, easeOut, lerp, mix, prog, rnd } from "./theme";

/** interpolación lineal por puntos clave [[t, valor], …] con suavizado */
export const kf = (t: number, pts: [number, number][]) => {
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (t <= pts[i][0]) {
      const k = easeInOut((t - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]));
      return lerp(pts[i - 1][1], pts[i][1], k);
    }
  }
  return pts[pts.length - 1][1];
};

// ───────────────────────── fondo de la oficina ─────────────────────────
export const Office: React.FC<{ warm: number; t: number }> = ({ warm, t }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${mix("#141A33", "#3A2A33", warm)} 0%, ${mix("#0E1226", "#26192A", warm)} 100%)` }} />
    <AbsoluteFill
      style={{
        background: `radial-gradient(760px 620px at 50% 30%, ${mix("rgba(80,120,255,0.22)", "rgba(255,160,80,0.30)", warm)}, transparent 70%)`,
      }}
    />
    {/* persiana */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 150, opacity: 0.18, background: "repeating-linear-gradient(180deg, rgba(255,255,255,0.9) 0 8px, transparent 8px 26px)" }} />
  </AbsoluteFill>
);

/** borde delantero de la mesa: se dibuja DESPUÉS de las personas para que queden «detrás» */
export const DeskFront: React.FC<{ warm: number }> = ({ warm }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1340, bottom: 0, background: `linear-gradient(180deg, ${mix("#2A3046", "#4A2F2A", warm)}, ${mix("#171B2B", "#2A1A1C", warm)})`, boxShadow: "0 -18px 40px rgba(0,0,0,0.45)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1334, height: 10, background: mix("#4A5270", "#7A4A3A", warm) }} />
  </>
);

// ───────────────────────── monitor ─────────────────────────
export const SCREEN_W = 960;
export const SCREEN_H = 540;
export const Monitor: React.FC<{ x?: number; y?: number; children: React.ReactNode; glow?: string; warm?: number }> = ({ x = 60, y = 190, children, glow = "rgba(120,170,255,0.35)", warm = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 1000 - 40 + 40, height: 610 }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: mix("#0F111A", "#1B1214", warm), boxShadow: `0 0 90px ${glow}, 0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 4px rgba(255,255,255,0.08)` }} />
    <div style={{ position: "absolute", left: 20, top: 20, width: SCREEN_W, height: SCREEN_H, borderRadius: 10, overflow: "hidden", background: "#05070d" }}>{children}</div>
    <div style={{ position: "absolute", left: 470, top: 574, width: 60, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.16)" }} />
    <div style={{ position: "absolute", left: 440, top: 606, width: 120, height: 46, background: "#12141E", clipPath: "polygon(20% 0,80% 0,100% 100%,0 100%)" }} />
  </div>
);

// ───────────────────────── ventanas falsas (el caos manual) ─────────────────────────
type Kind = "editor" | "terminal" | "browser";
const MONO = "Consolas, 'Courier New', monospace";

const WinBody: React.FC<{ kind: Kind; w: number; h: number }> = ({ kind, w, h }) => {
  if (kind === "editor") {
    const cols = ["#7AA2F7", "#9ECE6A", "#BB9AF7", "#E0AF68", "#7DCFFF"];
    return (
      <div style={{ display: "flex", width: w, height: h - 30, background: "#14161F" }}>
        <div style={{ width: 70, background: "#0F111A", padding: 10 }}>
          {[0, 1, 2, 3, 4].map((i) => (<div key={i} style={{ height: 10, margin: "9px 0", width: 30 + rnd(i + 1) * 28, borderRadius: 5, background: "#2A2F45" }} />))}
        </div>
        <div style={{ flex: 1, padding: "12px 14px" }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 8, margin: "9px 0", marginLeft: (i % 4) * 14 * (rnd(i) > 0.4 ? 1 : 0) }}>
              <div style={{ width: 14 + rnd(i + 9) * 60, height: 10, borderRadius: 5, background: cols[i % cols.length] }} />
              <div style={{ width: 20 + rnd(i + 3) * 90, height: 10, borderRadius: 5, background: "#3B4261" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (kind === "terminal") {
    const lines = ["$ npm run dev", "> ready on :5173", "$ git status", "On branch main", "$ npm test", "✔ 42 passed", "$ _"];
    return (
      <div style={{ width: w, height: h - 30, background: "#0B0E12", padding: "10px 14px", fontFamily: MONO, fontSize: 15, lineHeight: "22px", color: "#7CFFA2", overflow: "hidden" }}>
        {lines.map((l, i) => (<div key={i} style={{ opacity: l.startsWith("$") ? 1 : 0.6, whiteSpace: "pre" }}>{l}</div>))}
      </div>
    );
  }
  return (
    <div style={{ width: w, height: h - 30, background: "#F4F6FA" }}>
      <div style={{ height: 34, background: "#DFE3EC", display: "flex", alignItems: "center", padding: "0 10px" }}>
        <div style={{ height: 20, flex: 1, borderRadius: 10, background: "#FFFFFF" }} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, padding: 12 }}>
        {[C.coldBlue, "#FFD36B", "#9BE3A5", "#F4A3B8", "#B9A7FF", "#8ED1FF"].map((c, i) => (<div key={i} style={{ width: (w - 54) / 2, height: 54 + rnd(i) * 30, borderRadius: 10, background: c, opacity: 0.85 }} />))}
      </div>
    </div>
  );
};

type Slot = { x: number; y: number; w: number; h: number };
const Win: React.FC<{ kind: Kind; title: string; r: Slot; rot: number; z: number; pop: number }> = ({ kind, title, r, rot, z, pop }) => (
  <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, transform: `rotate(${rot}deg) scale(${pop})`, transformOrigin: "50% 30%", zIndex: z, borderRadius: 10, overflow: "hidden", boxShadow: "0 14px 34px rgba(0,0,0,0.55)", border: "2px solid rgba(255,255,255,0.12)" }}>
    <div style={{ height: 30, background: "#262A3D", display: "flex", alignItems: "center", gap: 6, padding: "0 10px", color: "#B9C0DA", fontFamily: ANTON, fontSize: 15, letterSpacing: 1 }}>
      <i style={{ width: 11, height: 11, borderRadius: 6, background: "#FF5F57" }} />
      <i style={{ width: 11, height: 11, borderRadius: 6, background: "#FEBC2E" }} />
      <i style={{ width: 11, height: 11, borderRadius: 6, background: "#28C840" }} />
      <span style={{ marginLeft: 8 }}>{title}</span>
    </div>
    <WinBody kind={kind} w={r.w} h={r.h} />
  </div>
);

const SLOTS: Record<Kind, Slot> = {
  editor: { x: 14, y: 14, w: 450, h: 512 },
  terminal: { x: 478, y: 14, w: 468, h: 246 },
  browser: { x: 478, y: 276, w: 468, h: 250 },
};
const MESS: Record<Kind, { r: Slot; rot: number }> = {
  editor: { r: { x: 150, y: 70, w: 640, h: 400 }, rot: -3 },
  terminal: { r: { x: 250, y: 120, w: 620, h: 360 }, rot: 2.5 },
  browser: { r: { x: 60, y: 40, w: 680, h: 420 }, rot: -1.8 },
};

export type DragTimes = { editor: number; terminal: number; browser: number };

/** Pantalla del Lucas «a mano»: cada ventana se abre torcida, se arrastra y se coloca. Devuelve también la posición del cursor. */
export const LucasScreen: React.FC<{ t: number; times: DragTimes; settled?: boolean }> = ({ t, times, settled = false }) => {
  const kinds: Kind[] = ["editor", "terminal", "browser"];
  const titles = { editor: "Editor", terminal: "Terminal", browser: "Navegador" };
  let cursor = { x: 480, y: 280 };
  const wins = kinds.map((k, idx) => {
    const t0 = settled ? -99 : times[k];
    const pop = settled ? 1 : easeBack(clamp01((t - t0) / 0.28));
    const drag = settled ? 1 : prog(t, t0 + 0.45, t0 + 1.05, easeInOut);
    const m = MESS[k], s = SLOTS[k];
    const r: Slot = { x: lerp(m.r.x, s.x, drag), y: lerp(m.r.y, s.y, drag), w: lerp(m.r.w, s.w, drag), h: lerp(m.r.h, s.h, drag) };
    const rot = lerp(m.rot, 0, drag);
    if (!settled && t >= t0 && t < t0 + 1.35) {
      cursor = { x: r.x + 90 + (1 - drag) * 10, y: r.y + 14 };
    }
    return { k, r, rot, pop, visible: settled || t >= t0, z: 10 + idx + (t >= t0 && t < t0 + 1.1 ? 10 : 0) };
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(520px 380px at 70% 70%, #1C3FA8, #0A1230 70%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, background: "rgba(15,18,30,0.92)", display: "flex", gap: 8, alignItems: "center", paddingLeft: 14 }}>
        {[0, 1, 2, 3, 4].map((i) => (<i key={i} style={{ width: 14, height: 14, borderRadius: 4, background: ["#5B8CFF", "#FFB347", "#7AE582", "#F4A3B8", "#B9A7FF"][i], opacity: 0.85 }} />))}
      </div>
      {wins.map((w) => w.visible && <Win key={w.k} kind={w.k} title={titles[w.k]} r={w.r} rot={w.rot} z={w.z} pop={w.pop} />)}
      {!settled && (
        <svg width="34" height="40" viewBox="0 0 34 40" style={{ position: "absolute", left: cursor.x, top: cursor.y, zIndex: 60, filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.6))" }}>
          <path d="M3 2 L3 30 L11 23 L17 36 L23 33 L17 21 L28 21 Z" fill="#FFFFFF" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── pantalla real del Senior ─────────────────────────
export const RealScreen: React.FC<{ t: number; t0: number; clickT: number; dropT: number; zoomIn: number; endHold?: boolean; ended?: boolean }> = ({ t, t0, clickT, dropT, zoomIn }) => {
  // zoom suave hacia el botón y salida rápida en el drop (igual que VR001)
  const push = prog(t, zoomIn, clickT, easeInOut);
  const out = prog(t, dropT, dropT + 0.22, easeOut);
  const z = lerp(1, 1.5, push * (1 - out));
  const fx = 1000, fy = 420; // punto de interés (coordenadas del bruto 1920×1080)
  const s = 0.5; // 1920 → 960
  const tx = (SCREEN_W / 2 - fx * s * z) * (push * (1 - out)) + 0;
  const ty = (SCREEN_H / 2 - fy * s * z) * (push * (1 - out)) + 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s * z})` }}>
        <Video src={staticFile("media/senior.mp4")} muted style={{ width: 1920, height: 1080 }} />
      </div>
    </AbsoluteFill>
  );
};
