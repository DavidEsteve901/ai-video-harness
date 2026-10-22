import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Sequence, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import cfg from "../edit.config.json";

// ───────── paleta y utilidades ─────────
const INK = "#1f2538";
const PAPER = "#f4ecd8";
const CARD = "#fffaf0";
const AMBER = "#f2a516"; // IA / agente
const BLUE = "#2f6fe4"; // Workspace Launcher
const CORAL = "#e8735a";
const MINT = "#3fae7a";
const HAND = "InkFree, 'Segoe Print', cursive";
const T = cfg.t;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const out = Easing.bezier(0.16, 1, 0.3, 1);
const back = Easing.bezier(0.34, 1.56, 0.64, 1);
const inout = Easing.bezier(0.65, 0, 0.35, 1);
const prog = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const E = (t: number, a: number, b: number) => out(prog(t, a, b));
const B = (t: number, a: number, d = 0.4) => back(prog(t, a, a + d));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const seg = (t: number, a: number, b: number) => (t >= a && t <= b ? 1 : 0); // ventana de tiempo
const fadeWin = (t: number, a: number, b: number, f = 0.25) => clamp01((t - a) / f) * (1 - clamp01((t - b) / f));

type Pt = { x: number; y: number };
const bez = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, u: number): Pt => {
  const m = 1 - u;
  return {
    x: m * m * m * p0.x + 3 * m * m * u * p1.x + 3 * m * u * u * p2.x + u * u * u * p3.x,
    y: m * m * m * p0.y + 3 * m * m * u * p1.y + 3 * m * u * u * p2.y + u * u * u * p3.y,
  };
};
const rr = (x: number, y: number, w: number, h: number, r: number) =>
  `M ${x + r} ${y} H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r} V ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r} V ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;

// ───────── layout: misma historia en vertical y en horizontal ─────────
type Layout = {
  W: number; H: number; vertical: boolean; s: number;
  person: Pt; bubble: { x: number; y: number; w: number; h: number; font: number };
  agent: { x: number; y: number; w: number; h: number };
  wl: { x: number; y: number; w: number; h: number };
  cap: { y: number; size: number; chars: number };
  chip: { size: number; gap: number };
};
const makeLayout = (W: number, H: number): Layout =>
  H > W
    ? {
        W, H, vertical: true, s: 1.15, person: { x: 230, y: 610 },
        bubble: { x: 410, y: 235, w: 620, h: 310, font: 58 },
        agent: { x: 540, y: 760, w: 340, h: 230 },
        wl: { x: 540, y: 1235, w: 930, h: 560 },
        cap: { y: 1625, size: 56, chars: 30 }, chip: { size: 150, gap: 190 },
      }
    : {
        W, H, vertical: false, s: 1.3, person: { x: 250, y: 790 },
        bubble: { x: 400, y: 60, w: 760, h: 300, font: 58 },
        agent: { x: 870, y: 590, w: 320, h: 220 },
        wl: { x: 1550, y: 530, w: 640, h: 520 },
        cap: { y: 975, size: 50, chars: 70 }, chip: { size: 100, gap: 126 },
      };

// ───────── iconos ─────────
const AGENTS = [
  { id: "claude", file: "claude.svg" },
  { id: "codex", file: "codex.png" },
  { id: "antigravity", file: "antigravity.svg" },
  { id: "opencode", file: "opencode.svg" },
  { id: "gemini", file: "googlegemini.svg" },
];
const Ico: React.FC<{ file: string; cx: number; cy: number; size: number; opacity?: number }> = ({ file, cx, cy, size, opacity = 1 }) => (
  <image href={staticFile(`img/${file}`)} x={cx - size / 2} y={cy - size / 2} width={size} height={size} opacity={opacity} preserveAspectRatio="xMidYMid meet" />
);

// ───────── trazos que se dibujan solos ─────────
const Stroke: React.FC<{ d: string; p?: number; w?: number; c?: string; fill?: string; dash?: string; op?: number }> = ({ d, p = 1, w = 7, c = INK, fill = "none", dash, op = 1 }) =>
  p <= 0 ? null : (
    <path d={d} pathLength={1} fill={fill} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={op}
      strokeDasharray={dash ?? "1 1"} strokeDashoffset={dash ? 0 : 1 - p} />
  );

// Caja estilo cuaderno: sombra solida desplazada + relleno + contorno que se dibuja
const Box: React.FC<{ x: number; y: number; w: number; h: number; r?: number; p?: number; fill?: string; c?: string; sw?: number; shadow?: number; fillOp?: number }> = ({
  x, y, w, h, r = 26, p = 1, fill = CARD, c = INK, sw = 7, shadow = 10, fillOp = 1,
}) => (
  <g>
    {shadow > 0 && p > 0.6 && <path d={rr(x + shadow, y + shadow, w, h, r)} fill={INK} opacity={0.16 * fillOp} />}
    <path d={rr(x, y, w, h, r)} fill={fill} opacity={clamp01(p * 2) * fillOp} />
    <Stroke d={rr(x, y, w, h, r)} p={p} w={sw} c={c} />
  </g>
);

const Txt: React.FC<{ x: number; y: number; lines: string[]; size: number; c?: string; anchor?: "start" | "middle"; op?: number; lh?: number; weight?: number }> = ({
  x, y, lines, size, c = INK, anchor = "middle", op = 1, lh = 1.12, weight = 700,
}) => (
  <g opacity={op}>
    {lines.map((l, i) => (
      <text key={i} x={x} y={y + i * size * lh} textAnchor={anchor} fontFamily={HAND} fontSize={size} fontWeight={weight} fill={c}>{l}</text>
    ))}
  </g>
);

const wrap = (s: string, n: number) => {
  const out: string[] = [];
  let cur = "";
  for (const w of s.split(" ")) {
    if ((cur + " " + w).trim().length > n) { out.push(cur.trim()); cur = w; } else cur += " " + w;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
};

const Spark: React.FC<{ cx: number; cy: number; r: number; p: number; c?: string }> = ({ cx, cy, r, p, c = AMBER }) => {
  if (p <= 0) return null;
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    const r1 = r * 0.55, r2 = r * (0.55 + 0.45 * p);
    return <line key={i} x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1} x2={cx + Math.cos(a) * r2} y2={cy + Math.sin(a) * r2} stroke={c} strokeWidth={7} strokeLinecap="round" opacity={1 - 0.7 * p} />;
  });
  return <g>{rays}</g>;
};

// ───────── personaje ─────────
const Person: React.FC<{ t: number; L: Layout; talk: number; arm: number; happy: number }> = ({ t, L, talk, arm, happy }) => {
  const e = B(t, T.persona, 0.6);
  const blink = Math.floor(t * 10) % 37 === 0 ? 0.15 : 1;
  const mouthOpen = talk > 0.5 && Math.floor(t * 9) % 2 === 0;
  const { x, y } = L.person;
  const armUp = arm; // 0..1
  const sx = 92, sy = -118;
  const hx = lerp(150, 168, armUp), hy = lerp(-20, -178, armUp);
  return (
    <g transform={`translate(${x},${y}) scale(${L.s * e})`} opacity={clamp01(e * 3)}>
      <ellipse cx={0} cy={6} rx={140} ry={12} fill={INK} opacity={0.12} />
      <path d="M -112 0 C -112 -92 -70 -152 0 -152 C 70 -152 112 -92 112 0 Z" fill={CORAL} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d="M -26 -150 L 0 -128 L 26 -150" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M ${sx} ${sy} Q ${lerp(130, 140, armUp)} ${lerp(-70, -150, armUp)} ${hx} ${hy}`} fill="none" stroke={INK} strokeWidth={26} strokeLinecap="round" />
      <path d={`M ${sx} ${sy} Q ${lerp(130, 140, armUp)} ${lerp(-70, -150, armUp)} ${hx} ${hy}`} fill="none" stroke={CORAL} strokeWidth={14} strokeLinecap="round" />
      <circle cx={hx} cy={hy} r={19} fill="#f6d3b0" stroke={INK} strokeWidth={6} />
      <rect x={-18} y={-168} width={36} height={26} fill="#f6d3b0" stroke={INK} strokeWidth={6} />
      <circle cx={0} cy={-218} r={64} fill="#f6d3b0" stroke={INK} strokeWidth={7} />
      <path d="M -66 -226 C -66 -292 68 -292 66 -226 C 40 -256 -22 -258 -66 -226 Z" fill={INK} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <ellipse cx={-23} cy={-216} rx={7} ry={9 * blink} fill={INK} />
      <ellipse cx={23} cy={-216} rx={7} ry={9 * blink} fill={INK} />
      <path d="M -38 -240 Q -23 -250 -8 -241" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <path d="M 8 -241 Q 23 -250 38 -240" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      {mouthOpen ? (
        <ellipse cx={0} cy={-186} rx={14} ry={11} fill={INK} />
      ) : (
        <path d={happy > 0.5 ? "M -22 -192 Q 0 -166 22 -192" : "M -18 -188 Q 0 -176 18 -188"} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      )}
    </g>
  );
};

// ───────── bocadillo ─────────
const Bubble: React.FC<{ L: Layout; t: number; a: number; b: number; lines: string[]; cps?: number; kind?: "say" | "think"; scale?: number; hh?: number; children?: React.ReactNode }> = ({
  L, t, a, b, lines, cps = 24, kind = "say", scale = 1, hh, children,
}) => {
  if (t < a - 0.01 || t > b + 0.3) return null;
  const k = B(t, a, 0.4) * (1 - clamp01((t - b) / 0.28));
  const bx = L.bubble.x, by = L.bubble.y, bw = L.bubble.w, bh = hh ?? L.bubble.h;
  const f = L.bubble.font * scale;
  const total = lines.join("").length;
  let shown = Math.floor(Math.max(0, t - a - 0.25) * cps);
  const caret = shown < total || Math.floor(t * 3) % 2 === 0;
  const visLines = lines.map((l) => { const s = l.slice(0, Math.max(0, shown)); shown -= l.length; return s; });
  const head = { x: L.person.x + 40 * L.s, y: L.person.y - 270 * L.s };
  const tail = `M ${bx + 70} ${by + bh - 4} L ${head.x + 40} ${head.y + 50} L ${bx + 160} ${by + bh - 4}`;
  return (
    <g transform={`translate(${bx + bw / 2},${by + bh / 2}) scale(${k}) translate(${-(bx + bw / 2)},${-(by + bh / 2)})`} opacity={clamp01(k * 2)}>
      <path d={rr(bx + 10, by + 10, bw, bh, 40)} fill={INK} opacity={0.14} />
      {kind === "say" ? (
        <>
          <path d={tail} fill={CARD} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
          <path d={rr(bx, by, bw, bh, 40)} fill={CARD} stroke={INK} strokeWidth={7} />
          <path d={`M ${bx + 72} ${by + bh - 2} L ${bx + 158} ${by + bh - 2}`} stroke={CARD} strokeWidth={10} />
        </>
      ) : (
        <>
          <circle cx={head.x + 30} cy={head.y + 60} r={10} fill={CARD} stroke={INK} strokeWidth={6} />
          <circle cx={bx + 100} cy={by + bh + 30} r={16} fill={CARD} stroke={INK} strokeWidth={6} />
          <path d={rr(bx, by, bw, bh, 70)} fill={CARD} stroke={INK} strokeWidth={7} />
        </>
      )}
      <Txt x={bx + 36} y={by + 78 * scale + 10} lines={visLines} size={f} anchor="start" />
      {caret && shown < 0 ? null : null}
      {children}
    </g>
  );
};

// ───────── ventana de Workspace Launcher ─────────
const WLWindow: React.FC<{ L: Layout; t: number; children?: React.ReactNode }> = ({ L, t, children }) => {
  const { x, y, w, h } = L.wl;
  const left = x - w / 2, top = y - h / 2;
  const p = E(t, T.wl, T.wl + 0.9);
  const live = E(t, T.conectado, T.conectado + 0.4);
  const pulse = 1 + 0.015 * Math.sin(t * 5) * live;
  return (
    <g transform={`translate(${x},${y}) scale(${pulse}) translate(${-x},${-y})`}>
      <Box x={left} y={top} w={w} h={h} p={p} fill={live > 0.2 ? CARD : "none"} fillOp={lerp(0.0, 1, live)} c={live > 0.2 ? INK : "#6b7186"} />
      {live < 0.99 && p > 0.5 && <path d={rr(left, top, w, h, 26)} fill="none" stroke="#6b7186" strokeWidth={5} strokeDasharray="14 14" opacity={0.7 * (1 - live)} />}
      <g opacity={live}>
        <path d={`M ${left} ${top + 76} H ${left + w}`} stroke={INK} strokeWidth={6} />
        <path d={rr(left, top, w, 76, 26).replace(/V \d+(\.\d+)? Q/, "V " + (top + 76) + " Q")} fill="none" />
        <image href={staticFile("img/wl.png")} x={left + 20} y={top + 10} width={56} height={56} />
        <Txt x={left + 92} y={top + 52} lines={["Workspace Launcher"]} size={L.vertical ? 38 : 34} anchor="start" />
      </g>
      {live < 0.99 && p > 0.6 && <Txt x={x} y={y + 80} lines={["?"]} size={260} c="#6b7186" op={(0.55 + 0.2 * Math.sin(t * 4)) * (1 - live)} />}
      {children}
    </g>
  );
};

const zones = (L: Layout) => {
  const { x, y, w, h } = L.wl;
  const ix = x - w / 2 + 28, iy = y - h / 2 + 100, iw = w - 56, ih = h - 128, g = 20;
  const lw = iw * 0.46;
  const rw = iw - lw - g, rh = (ih - g) / 2;
  return [
    { x: ix, y: iy, w: lw, h: ih }, // izquierda grande (apuntes)
    { x: ix + lw + g, y: iy, w: rw, h: rh }, // navegador
    { x: ix + lw + g, y: iy + rh + g, w: rw, h: rh }, // terminal
  ];
};
const TILES = [
  { file: "obsidian.svg", c: "#8b6cf0" },
  { file: "chrome.svg", c: BLUE },
  { file: "terminal.svg", c: INK },
];

// ───────── cables y paquetes ─────────
const cableAW = (L: Layout) =>
  L.vertical
    ? { p0: { x: L.agent.x, y: L.agent.y + L.agent.h / 2 + 4 }, p3: { x: L.wl.x, y: L.wl.y - L.wl.h / 2 - 4 } }
    : { p0: { x: L.agent.x + L.agent.w / 2 + 4, y: L.agent.y }, p3: { x: L.wl.x - L.wl.w / 2 - 4, y: L.wl.y } };
const cablePA = (L: Layout) => ({
  p0: { x: L.person.x + 118 * L.s, y: L.person.y - 40 * L.s },
  p3: L.vertical ? { x: L.agent.x - L.agent.w / 2 - 4, y: L.agent.y + 20 } : { x: L.agent.x - L.agent.w / 2 - 4, y: L.agent.y + 10 },
});
const ctrl = (L: Layout, c: { p0: Pt; p3: Pt }, vertical: boolean) => {
  const { p0, p3 } = c;
  return vertical
    ? { p1: { x: p0.x, y: lerp(p0.y, p3.y, 0.5) }, p2: { x: p3.x, y: lerp(p0.y, p3.y, 0.5) } }
    : { p1: { x: lerp(p0.x, p3.x, 0.5), y: p0.y }, p2: { x: lerp(p0.x, p3.x, 0.5), y: p3.y } };
};
const cableD = (c: { p0: Pt; p3: Pt }, cp: { p1: Pt; p2: Pt }) => `M ${c.p0.x} ${c.p0.y} C ${cp.p1.x} ${cp.p1.y} ${cp.p2.x} ${cp.p2.y} ${c.p3.x} ${c.p3.y}`;

const Plug: React.FC<{ at: Pt; ang: number; on: number }> = ({ at, ang, on }) => (
  <g transform={`translate(${at.x},${at.y}) rotate(${ang})`} opacity={on}>
    <rect x={-14} y={-18} width={28} height={36} rx={7} fill={AMBER} stroke={INK} strokeWidth={6} />
    <path d="M 14 -8 H 30 M 14 8 H 30" stroke={INK} strokeWidth={6} strokeLinecap="round" />
  </g>
);

const Packet: React.FC<{ pos: Pt; size?: number; file?: string; c?: string; op?: number }> = ({ pos, size = 54, file, c = AMBER, op = 1 }) => (
  <g opacity={op}>
    <circle cx={pos.x} cy={pos.y} r={size / 2 + 8} fill={CARD} stroke={INK} strokeWidth={6} />
    {file ? <Ico file={file} cx={pos.x} cy={pos.y} size={size} /> : <circle cx={pos.x} cy={pos.y} r={size / 4} fill={c} />}
  </g>
);

// ───────── escena principal ─────────
const Scene: React.FC<{ t: number; L: Layout }> = ({ t, L }) => {
  const sel = AGENTS.find((a) => a.id === cfg.agenteElegido) ?? AGENTS[0];
  const others = AGENTS.filter((a) => a.id !== sel.id);
  const zs = zones(L);

  // estados de habla del personaje
  // la persona mueve la boca mientras habla ella (tomas v1–v4, v6, v7, v10); el resto es la voz del narrador
  const win = (id: string) => cfg.vo.find((v) => v.id === id)!;
  const speaking = ["v1", "v2", "v3", "v4", "v6", "v7", "v10"].some((id) => t >= win(id).at && t <= win(id).at + win(id).dur) ? 1 : 0;
  const armUp = clamp01(["v4", "v6", "v7"].reduce((s, id) => s + fadeWin(t, win(id).at, win(id).at + win(id).dur, 0.4), 0));
  const happy = t > T.decide ? 1 : 0;

  // —— agente: fichas -> tarjeta
  const chipsIn = (i: number) => B(t, T.chips + i * 0.12, 0.45);
  const choose = E(t, T.elige, T.elige + 0.55);
  const a = L.agent;
  const rowX = (i: number) => a.x + (i - 2) * L.chip.gap;
  const order = AGENTS.map((g) => g.id);
  const cardP = E(t, T.elige + 0.1, T.elige + 0.8);
  const cardOn = t >= T.elige + 0.1;
  const thinking = fadeWin(t, T.piensa - 0.2, T.piensa + 0.55, 0.15);

  // —— cables
  const cA = cableAW(L), cpA = ctrl(L, cA, L.vertical), dA = cableD(cA, cpA);
  const cP = cablePA(L), cpP = ctrl(L, cP, L.vertical), dP = cableD(cP, cpP);
  const wireA = E(t, T.cableWl, T.cableWl + 0.5);
  const wireP = E(t, T.cablePersona, T.cablePersona + 0.5);
  const tentative = fadeWin(t, T.interroga, T.elige + 0.1, 0.3) * (0.55 + 0.45 * Math.sin(t * 7));
  const conn = E(t, T.conectado, T.conectado + 0.3);
  const angA = L.vertical ? 90 : 0;

  // paquetes
  const reqU = prog(t, T.envia, T.envia + 0.6);
  const reqPos = bez(cP.p0, cpP.p1, cpP.p2, cP.p3, inout(reqU));
  const reqOn = t >= T.envia && t < T.envia + 0.65;

  // —— zonas/tiles
  const tileT = [T.tile1, T.tile2, T.tile3];
  const afterTiles = t >= T.tile3 + 0.6;
  const showTiles = fadeWin(t, T.piensa, T.ej3 + 0.1, 0.2) + (t >= T.forma ? 1 : 0);

  // —— ajustes (ej3)
  const setP = E(t, T.ej3 + 0.15, T.ej3 + 0.7);
  const knob = inout(prog(t, T.ajusta, T.ajusta + 1.0));

  // —— propuesta
  const planOn = t >= T.propone - 0.1 && t < T.forma - 0.05;
  const planIn = B(t, T.propone, 0.5) * (1 - clamp01((t - (T.forma - 0.35)) / 0.3));

  return (
    <>
      <Person t={t} L={L} talk={speaking} arm={armUp} happy={happy} />

      {/* Workspace Launcher */}
      <WLWindow L={L} t={t}>
        {/* ghost de zonas durante el ejemplo 1 */}
        {t >= T.ej1 && t < T.forma && (
          <g opacity={fadeWin(t, T.ej1 + 1.5, T.ej3 - 0.2, 0.4)}>
            {zs.map((z, i) => (
              <rect key={i} x={z.x} y={z.y} width={z.w} height={z.h} rx={18} fill="none" stroke="#6b7186" strokeWidth={4} strokeDasharray="12 12" opacity={t < tileT[i] ? 0.6 : 0} />
            ))}
          </g>
        )}
        {/* tiles */}
        {TILES.map((tl, i) => {
          const z = zs[i];
          const t0 = tileT[i];
          const vis = i === 0 ? showTiles : showTiles;
          if (t < t0 - 0.9 || vis <= 0) return null;
          const k = back(prog(t, t0, t0 + 0.5));
          const cx = z.x + z.w / 2, cy = z.y + z.h / 2;
          const fly = t < t0 ? 0 : 1;
          const isz = Math.min(z.w, z.h) * 0.55;
          return (
            <g key={i} opacity={clamp01(vis) * fly} transform={`translate(${cx},${cy}) scale(${k}) translate(${-cx},${-cy})`}>
              <Box x={z.x} y={z.y} w={z.w} h={z.h} r={18} sw={6} shadow={6} fill="#fff" />
              <Ico file={tl.file} cx={cx} cy={cy} size={isz} />
            </g>
          );
        })}
        {/* check de listo */}
        {t >= T.listo && t < T.ej2 + 0.3 && (
          <g opacity={fadeWin(t, T.listo, T.ej2 - 0.1, 0.2)}>
            <circle cx={L.wl.x + L.wl.w / 2 - 20} cy={L.wl.y - L.wl.h / 2 + 4} r={42} fill={MINT} stroke={INK} strokeWidth={7} />
            <Stroke d={`M ${L.wl.x + L.wl.w / 2 - 42} ${L.wl.y - L.wl.h / 2 + 6} L ${L.wl.x + L.wl.w / 2 - 26} ${L.wl.y - L.wl.h / 2 + 24} L ${L.wl.x + L.wl.w / 2 + 6} ${L.wl.y - L.wl.h / 2 - 16}`} p={E(t, T.listo, T.listo + 0.35)} c="#fff" w={9} />
          </g>
        )}
        {/* ejemplo 2: atajo */}
        {t >= T.ej2 && t < T.ej3 + 0.2 && (
          <g opacity={fadeWin(t, T.ej2, T.ej3 - 0.1, 0.2)}>
            <rect x={L.wl.x - L.wl.w / 2 + 8} y={L.wl.y - L.wl.h / 2 + 84} width={L.wl.w - 16} height={L.wl.h - 92} rx={18} fill={CARD} opacity={0.94} />
            {[
              { l: "Ctrl", at: T.tecla1 },
              { l: "Alt", at: T.tecla2 },
              { l: "E", at: T.tecla3 },
            ].map((k, i) => {
              const kw = L.vertical ? 230 : 160, kh = L.vertical ? 190 : 150;
              const gx = L.vertical ? 40 : 24;
              const x0 = L.wl.x - (3 * kw + 2 * gx) / 2 + i * (kw + gx);
              const press = prog(t, T.pulsa + i * 0.12, T.pulsa + i * 0.12 + 0.12) * (1 - prog(t, T.pulsa + 0.7, T.pulsa + 0.9));
              const y0 = L.wl.y - kh / 2 + 30 + press * 14;
              const kp = B(t, k.at, 0.4);
              return (
                <g key={i} opacity={clamp01(kp * 3)} transform={`translate(${x0 + kw / 2},${y0 + kh / 2}) scale(${kp}) translate(${-(x0 + kw / 2)},${-(y0 + kh / 2)})`}>
                  <path d={rr(x0, y0 + 18 - press * 10, kw, kh, 26)} fill={INK} opacity={0.9} />
                  <path d={rr(x0, y0, kw, kh, 26)} fill="#fff" stroke={INK} strokeWidth={7} />
                  <Txt x={x0 + kw / 2} y={y0 + kh / 2 + 24} lines={[k.l]} size={L.vertical ? 76 : 66} />
                </g>
              );
            })}
            {t >= T.pulsa + 0.25 && t < T.pulsa + 1.3 && (
              <Spark cx={L.wl.x} cy={L.wl.y + 30} r={L.vertical ? 330 : 280} p={E(t, T.pulsa + 0.25, T.pulsa + 0.9)} />
            )}
          </g>
        )}
        {/* ejemplo 3: ajustes */}
        {t >= T.ej3 && t < T.propone + 0.1 && (
          <g opacity={fadeWin(t, T.ej3 + 0.1, T.propone - 0.15, 0.25) * setP}>
            <rect x={L.wl.x - L.wl.w / 2 + 8} y={L.wl.y - L.wl.h / 2 + 84} width={L.wl.w - 16} height={L.wl.h - 92} rx={18} fill={CARD} />
            {[0, 1, 2].map((r) => {
              const rh = (L.wl.h - 128) / 3;
              const cy = L.wl.y - L.wl.h / 2 + 100 + rh * r + rh / 2;
              const lx = L.wl.x - L.wl.w / 2 + 50;
              const tx = L.wl.x + L.wl.w / 2 - 270, tw = 220;
              const k = r === 1 ? knob : r === 0 ? knob : 1 - knob;
              return (
                <g key={r}>
                  <path d={`M ${lx} ${cy} q 20 -22 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0`} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
                  {r !== 1 ? (
                    <g>
                      <rect x={tx + 60} y={cy - 34} width={120} height={68} rx={34} fill={lerp(0, 1, k) > 0.5 ? MINT : "#c9c3b0"} stroke={INK} strokeWidth={7} />
                      <circle cx={lerp(tx + 94, tx + 146, k)} cy={cy} r={24} fill="#fff" stroke={INK} strokeWidth={6} />
                    </g>
                  ) : (
                    <g>
                      <path d={`M ${tx} ${cy} H ${tx + tw}`} stroke={INK} strokeWidth={9} strokeLinecap="round" />
                      <path d={`M ${tx} ${cy} H ${lerp(tx + 30, tx + tw - 40, k)}`} stroke={AMBER} strokeWidth={9} strokeLinecap="round" />
                      <circle cx={lerp(tx + 30, tx + tw - 40, k)} cy={cy} r={24} fill="#fff" stroke={INK} strokeWidth={6} />
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        )}
      </WLWindow>

      {/* cable agente -> WL */}
      {wireA > 0 && (
        <g>
          <Stroke d={dA} p={wireA} w={11} c={INK} />
          <Stroke d={dA} p={wireA} w={5} c={AMBER} />
          <Plug at={cA.p0} ang={angA + 180} on={wireA > 0.1 ? 1 : 0} />
          <Plug at={cA.p3} ang={angA} on={wireA > 0.95 ? 1 : 0} />
          {conn > 0 && conn < 1 && <Spark cx={cA.p3.x} cy={cA.p3.y} r={90} p={conn} />}
        </g>
      )}
      {/* interrogante tentativo */}
      {tentative > 0.01 && (
        <g opacity={tentative}>
          <path d={dA.replace(/^M [\d.]+ [\d.]+/, `M ${L.vertical ? L.agent.x : L.agent.x + L.agent.w / 2 + 8} ${L.vertical ? L.agent.y + L.agent.h / 2 + 8 : L.agent.y}`)} fill="none" stroke="#6b7186" strokeWidth={7} strokeDasharray="4 22" strokeLinecap="round" />
        </g>
      )}

      {/* cable persona -> agente */}
      {wireP > 0 && (
        <g>
          <path d={dP} fill="none" stroke={INK} strokeWidth={6} strokeDasharray={`${wireP * 900} 900`} strokeLinecap="round" opacity={0.0 + wireP} />
          <path d={dP} fill="none" stroke={CORAL} strokeWidth={13} strokeDasharray="1 30" strokeLinecap="round" strokeDashoffset={-t * 60} opacity={wireP * 0.9} />
        </g>
      )}
      {reqOn && <Packet pos={reqPos} size={46} c={CORAL} />}
      {/* cada pieza viaja por el cable hasta Workspace Launcher */}
      {TILES.map((tl, i) => {
        const u = prog(t, tileT[i] - 0.55, tileT[i]);
        if (u <= 0 || u >= 1) return null;
        return <Packet key={i} pos={bez(cA.p0, cpA.p1, cpA.p2, cA.p3, inout(u))} size={44} file={tl.file} />;
      })}

      {/* agente: fichas de opciones / tarjeta elegida */}
      {t >= T.chips - 0.1 && (
        <g>
          {AGENTS.map((g, i) => {
            const isSel = g.id === sel.id;
            const e0 = chipsIn(i);
            const x0 = rowX(order.indexOf(g.id));
            const x = lerp(x0, a.x, isSel ? choose : 0);
            const y = a.y + (isSel ? 0 : lerp(0, 40, choose));
            const sz = L.chip.size * (isSel ? lerp(1, 0.78, choose) : lerp(1, 0.3, choose));
            const op = isSel ? 1 : 1 - choose;
            if (!isSel && op <= 0.02) return null;
            const wob = isSel ? 0 : Math.sin(t * 3 + i) * 5 * (1 - choose);
            return (
              <g key={g.id} opacity={clamp01(e0 * 2) * op} transform={`translate(${x},${y + wob}) scale(${e0 * (isSel ? 1 : 1)}) translate(${-x},${-(y + wob)})`}>
                {(!isSel || choose < 0.5) && <Box x={x - sz / 2 - 12} y={y + wob - sz / 2 - 12} w={sz + 24} h={sz + 24} r={28} sw={6} shadow={6} fill={g.id === "codex" ? "#1b1d22" : CARD} />}
                <Ico file={g.file} cx={x} cy={y + wob} size={sz * 0.7} />
              </g>
            );
          })}
          {cardOn && (
            <g>
              <Box x={a.x - a.w / 2} y={a.y - a.h / 2} w={a.w} h={a.h} p={cardP} fill={CARD} sw={8} />
              <Ico file={sel.file} cx={a.x} cy={a.y - 22} size={L.vertical ? 118 : 104} opacity={cardP} />
              <Txt x={a.x} y={a.y + a.h / 2 - 22} lines={["tu agente"]} size={L.vertical ? 46 : 40} op={cardP} />
              <Spark cx={a.x - a.w / 2 + 18} cy={a.y - a.h / 2 + 18} r={54} p={thinking} />
              <Spark cx={a.x + a.w / 2 - 18} cy={a.y - a.h / 2 + 18} r={54} p={thinking} />
            </g>
          )}
        </g>
      )}

      {/* bocadillos */}
      <Bubble L={L} t={t} a={T.habla} b={T.ej1 - 0.1} lines={["..."]} kind="say" cps={6} scale={1.0} />
      <Bubble L={L} t={t} a={T.ej1} b={T.piensa} lines={["Prepárame un espacio", "para estudiar"]} cps={23}>
        {[
          { file: "obsidian.svg", at: T.apuntes },
          { file: "chrome.svg", at: T.navegador },
          { file: "terminal.svg", at: T.terminal },
        ].map((c, i) => {
          const k = B(t, c.at, 0.4);
          const cx = L.bubble.x + 90 + i * 130, cy = L.bubble.y + L.bubble.h - 70;
          return (
            <g key={i} opacity={clamp01(k * 3)} transform={`translate(${cx},${cy}) scale(${k}) translate(${-cx},${-cy})`}>
              <circle cx={cx} cy={cy} r={52} fill="#fff" stroke={INK} strokeWidth={6} />
              <Ico file={c.file} cx={cx} cy={cy} size={62} />
            </g>
          );
        })}
      </Bubble>
      <Bubble L={L} t={t} a={T.ej2} b={T.ej3 - 0.1} lines={["Un atajo para", "lanzarlo"]} cps={22} scale={1.1} hh={L.vertical ? 215 : 220} />
      <Bubble L={L} t={t} a={T.ej3} b={T.propone - 0.1} lines={["Ajusta la app", "a mi manera"]} cps={22} scale={1.1} hh={L.vertical ? 215 : 220} />

      {/* propuesta: él propone, tú revisas y decides */}
      {planOn && (
        <g opacity={clamp01(planIn * 3)} transform={`translate(${L.wl.x},${L.wl.y}) scale(${planIn}) translate(${-L.wl.x},${-L.wl.y})`}>
          {(() => {
            const pw = L.wl.w * 0.74, ph = L.wl.h * 0.86;
            const px = L.wl.x - pw / 2, py = L.wl.y - ph / 2;
            const rowsY = [0, 1, 2].map((i) => py + 120 + i * ((ph - 150) / 3));
            return (
              <g transform={`rotate(-2 ${L.wl.x} ${L.wl.y})`}>
                <Box x={px} y={py} w={pw} h={ph} r={14} fill="#fffdf5" sw={7} shadow={12} />
                <Txt x={px + pw / 2} y={py + 72} lines={["propuesta"]} size={L.vertical ? 62 : 54} c={AMBER} />
                <path d={`M ${px + 30} ${py + 92} H ${px + pw - 30}`} stroke={INK} strokeWidth={5} strokeDasharray="2 14" strokeLinecap="round" />
                {rowsY.map((ry, i) => {
                  const ticks = [T.decide, T.decide + 0.3, T.decide + 0.6][i];
                  const tp = E(t, ticks, ticks + 0.25);
                  const appear = clamp01((t - (T.propone + 0.35 + i * 0.18)) / 0.25);
                  return (
                    <g key={i} opacity={appear}>
                      <Ico file={["obsidian.svg", "claude.svg", "chrome.svg"][i] === "claude.svg" ? "wl.png" : ["obsidian.svg", "claude.svg", "chrome.svg"][i]} cx={px + 80} cy={ry + 10} size={64} />
                      <path d={`M ${px + 140} ${ry + 10} q 22 -22 44 0 t 44 0 t 44 0 t 44 0`} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
                      <rect x={px + pw - 130} y={ry - 24} width={68} height={68} rx={12} fill="#fff" stroke={INK} strokeWidth={6} />
                      <Stroke d={`M ${px + pw - 118} ${ry + 10} L ${px + pw - 102} ${ry + 28} L ${px + pw - 72} ${ry - 12}`} p={tp} c={MINT} w={11} />
                    </g>
                  );
                })}
              </g>
            );
          })()}
          {/* lupa: revisas */}
          {t >= T.revisa && t < T.decide + 0.8 && (
            (() => {
              const k = inout(prog(t, T.revisa, T.decide));
              const mx = lerp(L.wl.x - L.wl.w * 0.12, L.wl.x + L.wl.w * 0.12, k);
              const my = lerp(L.wl.y - 90, L.wl.y + 110, k);
              return (
                <g opacity={fadeWin(t, T.revisa, T.decide + 0.5, 0.2)}>
                  <circle cx={mx} cy={my} r={58} fill="#ffffff" fillOpacity={0.35} stroke={INK} strokeWidth={9} />
                  <path d={`M ${mx + 42} ${my + 42} L ${mx + 98} ${my + 98}`} stroke={INK} strokeWidth={16} strokeLinecap="round" />
                </g>
              );
            })()
          )}
        </g>
      )}

      {/* “tu forma de trabajar”: piezas viajando por el circuito */}
      {t >= T.forma && (
        <g opacity={fadeWin(t, T.forma, T.pregunta + 0.2, 0.3)}>
          {[0, 1, 2, 3].map((i) => {
            const u = ((t - T.forma) * 0.32 + i / 4) % 1;
            const half = u < 0.5;
            const f = half ? bez(cP.p0, cpP.p1, cpP.p2, cP.p3, u * 2) : bez(cA.p0, cpA.p1, cpA.p2, cA.p3, (u - 0.5) * 2);
            const files = ["obsidian.svg", "chrome.svg", "terminal.svg", "wl.png"];
            return <Packet key={i} pos={f} size={40} file={files[i]} />;
          })}
        </g>
      )}

      {/* pregunta final */}
      <Bubble L={L} t={t} a={T.pregunta} b={cfg.duration + 1} lines={["¿Qué le pedirías", "primero?"]} kind="think" cps={26} scale={1.05} />
    </>
  );
};

// ───────── subtítulos ─────────
const Captions: React.FC<{ t: number; L: Layout }> = ({ t, L }) => {
  const cur = cfg.vo.find((v) => t >= v.at - 0.05 && t <= v.at + v.dur + 0.25);
  if (!cur) return null;
  const k = clamp01((t - cur.at) / 0.15) * (1 - clamp01((t - (cur.at + cur.dur + 0.1)) / 0.15));
  const lines = wrap(cur.text, L.cap.chars);
  const lh = L.cap.size * 1.15;
  const y0 = L.cap.y;
  const w = Math.max(...lines.map((l) => l.length)) * L.cap.size * 0.5 + 60;
  return (
    <g opacity={k}>
      <rect x={L.W / 2 - w / 2} y={y0 - L.cap.size * 0.9} width={w} height={lines.length * lh + 24} rx={26} fill={PAPER} opacity={0.88} />
      <path d={`M ${L.W / 2 - w / 2 + 24} ${y0 + lines.length * lh - 4} H ${L.W / 2 + w / 2 - 24}`} stroke={AMBER} strokeWidth={10} strokeLinecap="round" opacity={0.55} />
      <Txt x={L.W / 2} y={y0} lines={lines} size={L.cap.size} lh={1.15} />
    </g>
  );
};

// ───────── fondo de papel ─────────
const Paper: React.FC<{ W: number; H: number }> = ({ W, H }) => (
  <g>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} fill="url(#dots)" opacity={0.5} />
    <rect width={W} height={H} filter="url(#grain)" opacity={0.18} />
    <rect width={W} height={H} fill="url(#vig)" />
  </g>
);

// ───────── audio ─────────
const At: React.FC<{ t: number; f: string; v: number }> = ({ t, f, v }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(t * fps))} layout="none">
      <Audio src={staticFile(`audio/${f}.wav`)} volume={v} />
    </Sequence>
  );
};

const SFX: { t: number; f: string; v: number }[] = [
  { t: T.persona, f: "pop", v: 0.35 },
  { t: T.wl, f: "scribble", v: 0.25 },
  { t: T.chips, f: "pop", v: 0.3 },
  { t: T.chips + 0.24, f: "pop", v: 0.25 },
  { t: T.chips + 0.48, f: "pop", v: 0.25 },
  { t: T.elige, f: "whoosh", v: 0.3 },
  { t: T.cableWl, f: "whoosh", v: 0.25 },
  { t: T.conectado, f: "ding", v: 0.4 },
  { t: T.cablePersona, f: "whoosh", v: 0.2 },
  { t: T.ej1, f: "pop", v: 0.3 },
  { t: T.apuntes, f: "pop", v: 0.3 },
  { t: T.navegador, f: "pop", v: 0.3 },
  { t: T.terminal, f: "pop", v: 0.3 },
  { t: T.envia, f: "whoosh", v: 0.3 },
  { t: T.tile1, f: "pop", v: 0.4 },
  { t: T.tile2, f: "pop", v: 0.4 },
  { t: T.tile3, f: "pop", v: 0.4 },
  { t: T.listo, f: "ding", v: 0.4 },
  { t: T.ej2, f: "pop", v: 0.3 },
  { t: T.tecla1, f: "pop", v: 0.3 },
  { t: T.tecla2, f: "pop", v: 0.3 },
  { t: T.tecla3, f: "pop", v: 0.3 },
  { t: T.pulsa, f: "hit", v: 0.25 },
  { t: T.pulsa + 0.25, f: "ding", v: 0.35 },
  { t: T.ej3, f: "pop", v: 0.3 },
  { t: T.ajusta, f: "whoosh", v: 0.2 },
  { t: T.propone, f: "whoosh", v: 0.3 },
  { t: T.decide, f: "pop", v: 0.3 },
  { t: T.decide + 0.3, f: "pop", v: 0.3 },
  { t: T.decide + 0.6, f: "ding", v: 0.4 },
  { t: T.forma, f: "whoosh", v: 0.25 },
  { t: T.pregunta, f: "pop", v: 0.35 },
];

const useFonts = () => {
  const [h] = useState(() => delayRender("fuentes"));
  useEffect(() => {
    loadFont({ family: "InkFree", url: staticFile("fonts/Inkfree.ttf"), weight: "700" })
      .then(() => continueRender(h))
      .catch(() => continueRender(h));
  }, [h]);
};

export const VR011: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const L = makeLayout(width, height);
  const seed = Math.floor(frame / 4) % 7;
  const fadeEnd = 1 - clamp01((t - (cfg.duration - 0.5)) / 0.5);

  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="rough" x="-3%" y="-3%" width="106%" height="106%">
            <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves={2} seed={seed} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={7} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={3} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 0.9 0" />
          </filter>
          <pattern id="dots" width="54" height="54" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2.2" fill="#b9ad8d" opacity="0.6" />
          </pattern>
          <radialGradient id="vig" cx="50%" cy="46%" r="75%">
            <stop offset="60%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#7a6a3a" stopOpacity="0.22" />
          </radialGradient>
        </defs>
        <Paper W={width} H={height} />
        <g filter="url(#rough)" opacity={fadeEnd}>
          <Scene t={t} L={L} />
        </g>
        {cfg.captions && (
          <g opacity={fadeEnd}>
            <Captions t={t} L={L} />
          </g>
        )}
      </svg>
      <Audio src={staticFile("audio/voz.wav")} volume={1} />
      {SFX.map((s, i) => <At key={i} t={s.t} f={s.f} v={s.v} />)}
    </AbsoluteFill>
  );
};
