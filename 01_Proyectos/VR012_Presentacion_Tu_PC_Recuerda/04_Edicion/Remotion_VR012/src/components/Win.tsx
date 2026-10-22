import React from "react";
import { C, rnd } from "../theme";
import { Rect } from "../layout";
import { ACCENT, Kind } from "../windows";

type Props = {
  r: Rect;
  kind: Kind;
  t: number; // segundos (para el contenido vivo)
  seed?: string;
  opacity?: number;
  scale?: number;
  rotate?: number;
  glow?: string; // color del contorno
  glowAmt?: number; // 0..1
  blur?: number;
  ghost?: number; // 0..1: se ve solo la silueta punteada
  desat?: number; // 0..1
  live?: number; // 0..1: cuánto contenido se ha «escrito»
};

const bar = (x: number, y: number, w: number, h: number, bg: string, o = 1, r = 99): React.CSSProperties => ({
  position: "absolute", left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, background: bg, opacity: o, borderRadius: r,
});

const CodeBody: React.FC<{ seed: string; live: number }> = ({ seed, live }) => {
  const rows = 15;
  const cols = ["#7C8CFF", "#FF7AB6", "#7CF2B0", "#FFB547", "#C9D1E3"];
  return (
    <>
      <div style={{ ...bar(0, 0, 7, 100, "rgba(255,255,255,0.025)", 1, 0) }} />
      {Array.from({ length: rows }).map((_, i) => {
        if (i / rows > live) return null;
        const indent = [0, 1, 1, 2, 2, 1, 0, 0, 1, 2, 3, 2, 1, 0, 0][i] * 5;
        let x = 11 + indent;
        const n = 1 + Math.floor(rnd(seed + i) * 3.2);
        return (
          <React.Fragment key={i}>
            <div style={bar(2.4, 4 + i * 6.2, 2.2, 2.2, "#3A4256", 1, 2)} />
            {Array.from({ length: n }).map((__, j) => {
              const w = 6 + rnd(seed + i + "w" + j) * 22;
              const el = <div key={j} style={bar(x, 4 + i * 6.2, w, 2.6, cols[Math.floor(rnd(seed + i + "c" + j) * cols.length)], 0.85)} />;
              x += w + 2;
              return x < 96 ? el : null;
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};

const BrowserBody: React.FC<{ seed: string }> = ({ seed }) => (
  <>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ ...bar(3 + i * 21, 3, 19, 7, i === 0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)", 1, 6) }} />
    ))}
    <div style={bar(3, 13, 94, 7, "rgba(255,255,255,0.07)")} />
    <div style={bar(6, 15.5, 30, 2, "rgba(255,255,255,0.25)")} />
    <div style={{ ...bar(3, 25, 94, 30, "linear-gradient(120deg,#2B4C8C 0%,#5AB0FF55 60%,#9B8CFF44 100%)", 1, 8) }} />
    <div style={bar(8, 34, 40, 4, "rgba(255,255,255,0.75)")} />
    <div style={bar(8, 42, 26, 3, "rgba(255,255,255,0.35)")} />
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ ...bar(3 + i * 32, 60, 29, 22, "rgba(255,255,255,0.05)", 1, 8) }} />
    ))}
    {[0, 1].map((i) => (
      <div key={"l" + i} style={bar(3, 87 + i * 5, 60 - rnd(seed + i) * 25, 2.2, "rgba(255,255,255,0.15)")} />
    ))}
  </>
);

const NotesBody: React.FC<{ seed: string; live: number }> = ({ seed, live }) => (
  <>
    <div style={bar(7, 6, 55, 5, "rgba(243,241,234,0.85)")} />
    {Array.from({ length: 6 }).map((_, i) =>
      i / 6 > live ? null : <div key={i} style={bar(7, 18 + i * 6, 70 + rnd(seed + i) * 20, 2.4, "rgba(243,241,234,0.22)")} />
    )}
    {Array.from({ length: 4 }).map((_, i) => (
      <React.Fragment key={"c" + i}>
        <div style={{ ...bar(7, 58 + i * 9, 5, 5, "transparent", 1, 3), border: `2px solid ${i < 2 ? "#C9A7FF" : "rgba(243,241,234,0.25)"}`, background: i < 2 ? "#C9A7FF55" : "transparent" }} />
        <div style={bar(16, 59.5 + i * 9, 35 + rnd(seed + "c" + i) * 35, 2.4, "rgba(243,241,234,0.3)")} />
      </React.Fragment>
    ))}
  </>
);

const TerminalBody: React.FC<{ seed: string; t: number; live: number }> = ({ seed, t, live }) => {
  const rows = 9;
  const shown = Math.max(1, Math.floor(rows * live));
  return (
    <>
      <div style={{ ...bar(0, 0, 100, 100, "#05070B", 1, 0) }} />
      {Array.from({ length: shown }).map((_, i) => (
        <React.Fragment key={i}>
          <div style={bar(5, 8 + i * 9.5, 3, 3.4, i % 3 === 0 ? "#7CF2B0" : "#5B6478", 1, 2)} />
          <div style={bar(10, 8 + i * 9.5, 18 + rnd(seed + i) * 55, 3.4, i % 3 === 0 ? "rgba(124,242,176,0.55)" : "rgba(201,209,227,0.35)")} />
        </React.Fragment>
      ))}
      <div style={{ ...bar(10, 8 + shown * 9.5, 3, 4, "#C9D1E3", Math.floor(t * 2.2) % 2 ? 0 : 0.9, 1) }} />
    </>
  );
};

const MusicBody: React.FC<{ seed: string; t: number }> = ({ seed, t }) => {
  const n = 22;
  return (
    <>
      <div style={{ ...bar(6, 9, 30, 46, "linear-gradient(135deg,#FF7AB6,#9B8CFF 70%,#5AB0FF)", 1, 8) }} />
      <div style={bar(42, 14, 46, 6, "rgba(243,241,234,0.85)")} />
      <div style={bar(42, 26, 30, 4.5, "rgba(243,241,234,0.35)")} />
      {Array.from({ length: n }).map((_, i) => {
        const h = 6 + 14 * Math.abs(Math.sin(t * (3 + rnd(seed + i) * 3) + i * 0.7));
        return <div key={i} style={{ ...bar(6 + i * 4.1, 80 - h, 2.6, h, "#FF7AB6", 0.75, 3) }} />;
      })}
      <div style={bar(6, 86, 88, 2.2, "rgba(255,255,255,0.12)")} />
      <div style={bar(6, 86, 30 + ((t * 4) % 50), 2.2, "#FF7AB6")} />
    </>
  );
};

const ChatBody: React.FC<{ seed: string }> = ({ seed }) => (
  <>
    {Array.from({ length: 4 }).map((_, i) => {
      const right = i % 2 === 1;
      const w = 38 + rnd(seed + i) * 30;
      return (
        <React.Fragment key={i}>
          <div style={{ ...bar(right ? 88 : 4, 10 + i * 21, 8, 13, right ? "#6EE7D8" : "#3A4256", 1, 99) }} />
          <div style={{ ...bar(right ? 84 - w : 15, 9 + i * 21, w, 15, right ? "rgba(110,231,216,0.22)" : "rgba(255,255,255,0.07)", 1, 10) }} />
        </React.Fragment>
      );
    })}
  </>
);

const DesignBody: React.FC<{ seed: string; t: number }> = ({ t }) => (
  <>
    <div style={bar(0, 0, 18, 100, "rgba(255,255,255,0.03)", 1, 0)} />
    {Array.from({ length: 7 }).map((_, i) => (
      <div key={i} style={bar(3, 6 + i * 8, 11, 2.6, i === 2 ? "#FF9F6E" : "rgba(255,255,255,0.18)")} />
    ))}
    <div style={{ ...bar(24, 8, 70, 84, "#1A2030", 1, 6) }} />
    <div style={{ ...bar(32, 20, 22, 39, "radial-gradient(circle at 35% 35%,#FFD3A8,#FF9F6E 45%,#FF5A8A)", 1, 999), transform: `rotate(${t * 20}deg)` }} />
    <div style={{ ...bar(58, 42, 26, 30, "linear-gradient(135deg,#7C8CFF,#5AB0FF)", 0.9, 10) }} />
    <div style={{ ...bar(55, 39, 32, 36, "transparent", 1, 4), border: "2px dashed rgba(255,255,255,0.7)" }} />
  </>
);

const ReaderBody: React.FC<{ seed: string }> = ({ seed }) => (
  <>
    <div style={{ ...bar(14, 6, 72, 94, "#E9E6DD", 1, 3) }} />
    <div style={bar(20, 12, 40, 3.2, "#2A2F3D", 0.9)} />
    {Array.from({ length: 11 }).map((_, i) => (
      <div key={i} style={bar(20, 20 + i * 6.5, 50 + rnd(seed + i) * 10, 1.8, i === 4 ? "#FFB547" : "#6B7080", i === 4 ? 0.9 : 0.5)} />
    ))}
  </>
);

export const Win: React.FC<Props> = ({ r, kind, t, seed = kind, opacity = 1, scale = 1, rotate = 0, glow, glowAmt = 0, blur = 0, ghost = 0, desat = 0, live = 1 }) => {
  if (opacity <= 0.001) return null;
  const barH = Math.max(9, Math.min(24, r.h * 0.075));
  const rad = Math.max(6, Math.min(12, r.w * 0.02));
  const acc = ACCENT[kind];
  const body =
    kind === "code" ? <CodeBody seed={seed} live={live} /> :
    kind === "browser" ? <BrowserBody seed={seed} /> :
    kind === "notes" ? <NotesBody seed={seed} live={live} /> :
    kind === "terminal" ? <TerminalBody seed={seed} t={t} live={live} /> :
    kind === "music" ? <MusicBody seed={seed} t={t} /> :
    kind === "chat" ? <ChatBody seed={seed} /> :
    kind === "design" ? <DesignBody seed={seed} t={t} /> : <ReaderBody seed={seed} />;
  const filters = [blur > 0.2 ? `blur(${blur}px)` : "", desat > 0 ? `grayscale(${desat})` : ""].join(" ").trim();
  return (
    <div
      style={{
        position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, opacity,
        transform: `scale(${scale}) rotate(${rotate}deg)`, filter: filters || undefined,
      }}
    >
      {ghost < 1 && (
        <div
          style={{
            position: "absolute", inset: 0, borderRadius: rad, overflow: "hidden", opacity: 1 - ghost,
            background: `linear-gradient(180deg, ${C.win} 0%, ${C.win2} 100%)`,
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: `0 ${r.h * 0.06}px ${r.h * 0.16}px rgba(0,0,0,0.55)${glowAmt > 0 && glow ? `, 0 0 ${28 * glowAmt}px ${glow}` : ""}`,
          }}
        >
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: barH, background: "rgba(255,255,255,0.035)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ position: "absolute", top: barH * 0.34, left: barH * (0.45 + i * 0.5), width: barH * 0.32, height: barH * 0.32, borderRadius: 99, background: ["#FF6B6B", "#FFC94D", "#4ADE80"][i], opacity: 0.55 }} />
            ))}
            <div style={{ position: "absolute", top: barH * 0.38, left: "38%", width: "24%", height: barH * 0.24, borderRadius: 99, background: "rgba(255,255,255,0.12)" }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: acc, opacity: 0.85 }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: barH, bottom: 0 }}>{body}</div>
        </div>
      )}
      {(ghost > 0 || (glow && glowAmt > 0)) && (
        <div
          style={{
            position: "absolute", inset: -1, borderRadius: rad,
            border: ghost > 0 ? `2px dashed rgba(243,241,234,${0.45 * ghost})` : `2px solid ${glow}`,
            opacity: ghost > 0 ? 1 : glowAmt,
          }}
        />
      )}
    </div>
  );
};
