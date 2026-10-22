import React from "react";
import { AbsoluteFill } from "remotion";
import { at, atEnd, C, clamp01, E, ease, ESC, FONT, lerp, prog, rnd, spr, win } from "../theme";
import { Layout, lerpRect, place, Rect, screenOf } from "../layout";
import { Kind, PROGRAMAR, Slot } from "../windows";
import { Cam, Desk, WS } from "../components/Desk";
import { Win } from "../components/Win";
import { Cursor, Dust, shake } from "../components/Bits";
import { ICONS, Keys } from "../components/Mind";
import { AGENTS, AgentLogo, Bar, Cable, Cage, Check, FnChip, Orb, ProjectBox, Spark, Toggle, Tree } from "../components/Agent";

type P = { t: number; L: Layout };
type Pt = { x: number; y: number };
const FN = ["informe", "deploy", "backup"];

// la ventana donde vive el agente (gancho, giro y cierre)
const CAGE = (L: Layout) => (L.vertical ? { x: 540, y: 760, w: 800, h: 600 } : { x: 960, y: 420, w: 860, h: 560 });
const ORB_R = (L: Layout) => (L.vertical ? 96 : 90);

/** recorrido del agente rebotando contra el cristal: un logo distinto en cada golpe */
const HITS = [0.5, 0.88, 1.26, 1.64, 2.02, 2.4];
const bouncePos = (L: Layout, t: number): Pt => {
  const g = CAGE(L);
  const ix = g.w / 2 - 120, iy = g.h / 2 - 125;
  const P: Pt[] = [
    { x: g.x, y: g.y + 20 },
    { x: g.x - ix, y: g.y - iy * 0.2 },
    { x: g.x + ix * 0.3, y: g.y - iy + 20 },
    { x: g.x + ix, y: g.y + iy * 0.4 },
    { x: g.x - ix * 0.2, y: g.y + iy },
    { x: g.x - ix, y: g.y + iy * 0.1 },
  ];
  if (t <= HITS[0]) return P[0];
  for (let i = 0; i < HITS.length - 1; i++) {
    if (t < HITS[i + 1]) {
      const k = ease.inOut(prog(t, HITS[i], HITS[i + 1]));
      return { x: lerp(P[i].x, P[i + 1].x, k), y: lerp(P[i].y, P[i + 1].y, k) };
    }
  }
  return P[P.length - 1];
};

// ───────── 1 · «Tu agente de IA vive encerrado en una ventana.» ─────────
export const S01: React.FC<P> = ({ t, L }) => {
  const g = CAGE(L);
  const te = at("t01", "encerrado");
  const tv = at("t01", "ventana");
  const k = spr(t, 0.02, 1.4, 7);
  const bars = prog(t, te - 0.05, te + 0.5);
  const locked = E(t, te + 0.25, 0.4);
  const hitI = HITS.filter((h) => t >= h).length - 1;
  const logo = hitI >= 1 && hitI <= 5 && t < te + 0.1 ? AGENTS[hitI - 1] : null;
  // tras quedar encerrado, el agente cae al centro y se apaga un poco
  const free = bouncePos(L, Math.min(t, HITS[HITS.length - 1]));
  const settle = E(t, te + 0.1, 0.7);
  const pos = { x: lerp(free.x, g.x, settle), y: lerp(free.y, g.y + 30, settle) };
  const sh = shake(t, [te + 0.32], 12);
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.07 * E(t, 0, 4.6, ease.inOut)} ox={g.x} oy={g.y} x={sh.x} y={sh.y}>
        <Cage {...g} t={t} k={k} bars={bars} tone={locked > 0 ? C.coral : C.amber} glowAmt={0.35 + 0.65 * locked}>
          {HITS.slice(1).map((h, i) =>
            t > h && t < h + 0.5 ? (
              <div key={i} style={{ position: "absolute", left: bouncePos(L, h).x - (g.x - g.w / 2) - 60 - 80 * (t - h), top: bouncePos(L, h).y - (g.y - g.h / 2) - 60 - 80 * (t - h), width: 120 + 160 * (t - h), height: 120 + 160 * (t - h), borderRadius: 999, border: `3px solid ${C.amber}`, opacity: 1 - (t - h) / 0.5 }} />
            ) : null,
          )}
          <Orb x={pos.x - (g.x - g.w / 2)} y={pos.y - (g.y - g.h / 2)} r={ORB_R(L)} t={t} k={spr(t, 0.25, 1.8, 7)} dim={locked * 0.45} logo={logo} logoK={logo ? spr(t, HITS[hitI], 2.4, 9) : 1} />
        </Cage>
      </Cam>
      {/* el exterior se queda a oscuras cuando se cierra */}
      <AbsoluteFill style={{ background: `radial-gradient(${g.w * 0.75}px ${g.h * 0.8}px at ${g.x}px ${g.y}px, transparent 60%, rgba(0,0,0,0.75))`, opacity: E(t, tv - 0.2, 0.6) }} />
    </AbsoluteFill>
  );
};

// ───────── 2 · «Conoce tu proyecto por dentro: cada carpeta, cada script.» ─────────
const SIDE = (L: Layout) => (L.vertical ? { x: 540, y: 420, s: 0.58 } : { x: 520, y: 420, s: 0.66 });
const TREE_G = (L: Layout) => (L.vertical ? { x: 540, y: 965, w: 780, h: 600 } : { x: 1370, y: 420, w: 640, h: 600 });
export const S02: React.FC<P> = ({ t, L }) => {
  const a = ESC.t02.a;
  const g = CAGE(L);
  const sd = SIDE(L);
  const mv = E(t, a, 0.7, ease.inOut);
  const cx = lerp(g.x, sd.x, mv), cy = lerp(g.y, sd.y, mv), s = lerp(1, sd.s, mv);
  const tc = at("t02", "conoce");
  const td = at("t02", "dentro");
  const tca = at("t02", "carpeta");
  const tsc = at("t02", "script");
  const tg = TREE_G(L);
  const treeK = E(t, tc + 0.15, 0.5);
  const beam = E(t, tc + 0.3, 0.5);
  const orb = { x: cx, y: cy + 15 * s };
  // haz de luz del agente al árbol (atraviesa los barrotes: lo conoce todo, aunque no pueda salir)
  const near = L.vertical ? [{ x: tg.x - tg.w / 2 + 30, y: tg.y - tg.h / 2 }, { x: tg.x + tg.w / 2 - 30, y: tg.y - tg.h / 2 }] : [{ x: tg.x - tg.w / 2, y: tg.y - tg.h / 2 + 30 }, { x: tg.x - tg.w / 2, y: tg.y + tg.h / 2 - 30 }];
  const fl = 0.75 + 0.25 * Math.sin(t * 9);
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.03 * E(t, a, 4)} ox={L.c.x} oy={L.c.y}>
        {beam > 0 && (
          <svg style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "visible" }}>
            <defs>
              <linearGradient id="beam" x1={orb.x} y1={orb.y} x2={(near[0].x + near[1].x) / 2} y2={(near[0].y + near[1].y) / 2} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={C.amber} stopOpacity={0.55} />
                <stop offset="100%" stopColor={C.amber} stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <polygon points={`${orb.x},${orb.y} ${near[0].x},${near[0].y} ${near[1].x},${near[1].y}`} fill="url(#beam)" opacity={beam * fl} />
          </svg>
        )}
        <Cage x={cx} y={cy} w={g.w * s} h={g.h * s} t={t} bars={1} tone={C.coral} glowAmt={0.5}>
          <Orb x={(g.w * s) / 2} y={(g.h * s) / 2 + 15 * s} r={ORB_R(L) * s} t={t} dim={0.3 - 0.3 * beam} />
        </Cage>
        <Tree {...tg} t={t} k={treeK} rows={prog(t, tc + 0.2, td + 0.2)} hlDir={prog(t, tca - 0.1, tca + 0.6)} hlScript={prog(t, tsc - 0.1, tsc + 0.6)} scan={prog(t, td - 0.1, tsc + 0.5)} />
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 3 · «Pero el escritorio lo sigues montando tú: abrir, colocar, recordar comandos.» ─────────
const MESSY: Slot[] = [
  { id: "m1", kind: "code", mon: 0, f: { x: 0, y: 0, w: 1, h: 1 } },
  { id: "m2", kind: "browser", mon: 0, f: { x: 0, y: 0, w: 1, h: 1 } },
  { id: "m3", kind: "notes", mon: 1, f: { x: 0, y: 0, w: 1, h: 1 } },
  { id: "m4", kind: "music", mon: 1, f: { x: 0, y: 0, w: 1, h: 1 } },
];
const messyRect = (L: Layout, s: Slot, i: number): Rect => {
  const sc = screenOf(L.mon[s.mon], L.u);
  const w = sc.w * (0.45 + rnd("mw" + i) * 0.15);
  const h = sc.h * (0.5 + rnd("mh" + i) * 0.15);
  return { x: sc.x + (sc.w - w) * (0.15 + rnd("mx" + i) * 0.7), y: sc.y + (sc.h - h) * (0.1 + rnd("my" + i) * 0.8), w, h };
};
export const S03: React.FC<P> = ({ t, L }) => {
  const a = ESC.t03.a;
  const ttu = at("t03", "tu");
  const tab = at("t03", "abrir");
  const tco = at("t03", "colocar");
  const tre = at("t03", "recordar");
  const tcm = at("t03", "comandos");
  const power = E(t, a + 0.1, 0.5);
  const wins: WS[] = MESSY.map((s, i) => {
    const k = spr(t, tab - 0.1 + i * 0.13, 1.8, 7);
    let r = messyRect(L, s, i);
    if (i === 0) {
      // «colocar»: arrastre torpe hasta media pantalla, con temblor
      const target = place(L, 0, { x: 0, y: 0, w: 0.55, h: 1 });
      const d = ease.inOut(prog(t, tco + 0.15, tco + 0.95));
      const wob = d > 0 && d < 1 ? Math.sin(t * 22) * 10 : 0;
      r = lerpRect(r, target, d);
      r = { ...r, x: r.x + wob, y: r.y + wob * 0.5 };
    }
    return { slot: s, r, opacity: clamp01(k * 3), scale: 0.6 + 0.4 * Math.min(1.04, k), rotate: i === 0 && t > tco + 0.95 ? 0 : (rnd("mr" + i) - 0.5) * 6 };
  });
  // terminal donde no recuerdas el comando
  const term: Rect = (() => {
    const sc = screenOf(L.mon[1], L.u);
    return { x: sc.x + sc.w * 0.2, y: sc.y + sc.h * 0.18, w: sc.w * 0.62, h: sc.h * 0.64 };
  })();
  const tk = spr(t, tre - 0.1, 1.8, 7);
  const typed = "npm run ".slice(0, Math.floor(clamp01((t - tre) / 0.45) * 8));
  const q = spr(t, tcm, 2, 8);
  // cursor: aparece en «tú», abre, arrastra
  const grab0 = messyRect(L, MESSY[0], 0);
  const tgt = place(L, 0, { x: 0, y: 0, w: 0.55, h: 1 });
  const curP = (x: number): Pt => {
    const home = { x: L.c.x + 60, y: L.c.y + 40 };
    const g0 = { x: grab0.x + grab0.w * 0.4, y: grab0.y + 10 };
    const g1 = { x: tgt.x + tgt.w * 0.4, y: tgt.y + 10 };
    if (x < tco) return home;
    if (x < tco + 0.15) return { x: lerp(home.x, g0.x, ease.inOut(prog(x, tco - 0.1, tco + 0.15))), y: lerp(home.y, g0.y, ease.inOut(prog(x, tco - 0.1, tco + 0.15))) };
    const d = ease.inOut(prog(x, tco + 0.15, tco + 0.95));
    const p = { x: lerp(g0.x, g1.x, d), y: lerp(g0.y, g1.y, d) };
    if (x < tre) return p;
    const d2 = ease.inOut(prog(x, tre - 0.2, tre + 0.3));
    return { x: lerp(p.x, term.x + term.w * 0.5, d2), y: lerp(p.y, term.y + term.h * 0.55, d2) };
  };
  const cur = curP(t);
  const curK = spr(t, ttu - 0.05, 2, 8);
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.04 * E(t, a, 6)} ox={L.c.x} oy={L.c.y} opacity={E(t, a, 0.3)}>
        <Desk L={L} t={t} wins={wins} power={[power, power]} clip />
        {tk > 0 && (
          <>
            <Win r={term} kind="terminal" t={t} seed="olvido" opacity={clamp01(tk * 3)} scale={0.7 + 0.3 * Math.min(1, tk)} live={0.25} glow={C.coral} glowAmt={E(t, tcm, 0.3)} />
            <div style={{ position: "absolute", left: term.x + term.w * 0.1, top: term.y + term.h * 0.48, fontFamily: "Consolas, 'Cascadia Mono', monospace", fontWeight: 700, fontSize: term.h * 0.12, color: "#C9D1E3", opacity: clamp01(tk * 3), whiteSpace: "nowrap" }}>
              <span style={{ color: "#7CF2B0" }}>$ </span>
              {typed}
              <span style={{ color: C.coral }}>{t > tcm ? "???" : ""}</span>
              <span style={{ opacity: Math.floor(t * 2.4) % 2 ? 0 : 1 }}>▮</span>
            </div>
          </>
        )}
        {q > 0 && (
          <div style={{ position: "absolute", left: term.x + term.w - 40, top: term.y - 70, width: 100, height: 100, borderRadius: 99, background: C.coral, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 68, color: "#0A0C12", transform: `scale(${Math.min(1.1, q)}) rotate(${(1 - Math.min(1, q)) * -25}deg)`, boxShadow: `0 0 40px ${C.coral}` }}>?</div>
        )}
        <Cursor x={cur.x} y={cur.y} s={L.u * 1.3 * Math.min(1.15, curK)} opacity={clamp01(curK * 3)} color={C.coral} click={t > tco + 0.1 && t < tco + 0.8 ? (t - tco - 0.1) / 0.7 : t > tab && t < tab + 0.7 ? (t - tab) / 0.7 : -1} />
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 4 · «Y lo mejor de tu proyecto se queda enterrado en una terminal.» ─────────
const TERM_BIG = (L: Layout): Rect => (L.vertical ? { x: 110, y: 430, w: 860, h: 660 } : { x: 410, y: 110, w: 1100, h: 620 });
/** capas de registro de la terminal que entierran las funciones (k 0..1) */
const Sediment: React.FC<{ r: Rect; k: number; t: number; seed: string }> = ({ r, k, t, seed }) => {
  if (k <= 0) return null;
  const n = 26;
  const top = r.y + r.h * 0.12;
  return (
    <div style={{ position: "absolute", left: r.x + 8, top, width: r.w - 16, height: r.h * 0.86, overflow: "hidden", borderRadius: 8 }}>
      {Array.from({ length: n }).map((_, i) => {
        const appear = clamp01(k * n * 1.1 - (n - 1 - i));
        if (appear <= 0) return null;
        const y = (i / n) * r.h * 0.84 - (1 - ease.out(appear)) * 40 - ((t * 14) % 6);
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, height: (r.h * 0.84) / n + 2, background: "#05070B", opacity: appear }}>
            <div style={{ position: "absolute", left: "4%", top: "30%", width: `${15 + rnd(seed + i) * 60}%`, height: "40%", borderRadius: 9, background: i % 4 === 0 ? "rgba(124,242,176,0.35)" : "rgba(201,209,227,0.22)" }} />
          </div>
        );
      })}
    </div>
  );
};
const chipHome = (r: Rect, i: number, L: Layout): Pt => ({ x: r.x + r.w * (L.vertical ? 0.5 : 0.2 + i * 0.3), y: r.y + r.h * (L.vertical ? 0.28 + i * 0.16 : 0.42) });
export const S04: React.FC<P> = ({ t, L }) => {
  const a = ESC.t04.a;
  const tm = at("t04", "mejor");
  const tq = at("t04", "queda");
  const ten = at("t04", "enterrado");
  const tt = at("t04", "terminal");
  const r = TERM_BIG(L);
  const inK = spr(t, a, 1.5, 7);
  const sink = ease.in(prog(t, tq - 0.1, ten + 0.5));
  const bury = prog(t, ten - 0.1, tt + 0.5);
  const size = L.vertical ? 46 : 40;
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.05 * E(t, a, 5)} ox={r.x + r.w / 2} oy={r.y + r.h / 2} filter={bury > 0 ? `saturate(${1 - bury * 0.5})` : undefined}>
        <Win r={r} kind="terminal" t={t} seed="registro" opacity={clamp01(inK * 3)} scale={0.8 + 0.2 * Math.min(1, inK)} live={1} glow={C.coral} glowAmt={E(t, tt, 0.4)} />
        {FN.map((f, i) => {
          const h = chipHome(r, i, L);
          const k = spr(t, tm - 0.1 + i * 0.12, 1.8, 7);
          const y = lerp(h.y, r.y + r.h * 0.86, sink) + Math.sin(t * 2 + i) * 6 * (1 - sink);
          return <FnChip key={f} x={h.x} y={y} label={f} size={size} t={t} k={Math.min(1.05, k)} gray={sink} rot={sink * (i - 1) * 8} />;
        })}
        <Sediment r={r} k={bury} t={t} seed="sed" />
        <Dust x={r.x + 40} y={r.y + r.h * 0.6} w={r.w - 80} h={r.h * 0.3} k={prog(t, ten, ten + 1.2)} seed="tierra" n={36} color="#8A90A2" />
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 5 · «¿Y si le abrieras la ventana?» ─────────
export const S05: React.FC<P> = ({ t, L }) => {
  const a = ESC.t05.a;
  const g = CAGE(L);
  const tab = at("t05", "abrieras");
  const tv = at("t05", "ventana");
  const inK = E(t, a, 0.6);
  const lift = prog(t, tab - 0.15, tab + 0.6);
  const open = prog(t, tv - 0.05, tv + 0.8);
  const out = E(t, tv + 0.1, 1.0, ease.inOut);
  const rays = E(t, tv, 0.6);
  return (
    <AbsoluteFill>
      {rays > 0 && (
        <AbsoluteFill style={{ background: `conic-gradient(from ${t * 12}deg at ${g.x}px ${g.y}px, transparent 0deg, ${C.amber}22 12deg, transparent 24deg, transparent 50deg, ${C.amber}1A 62deg, transparent 74deg, transparent 110deg, ${C.amber}22 122deg, transparent 134deg, transparent 170deg, ${C.amber}1A 182deg, transparent 194deg, transparent 240deg, ${C.amber}22 252deg, transparent 264deg, transparent 300deg, ${C.amber}1A 312deg, transparent 324deg)`, opacity: rays }} />
      )}
      <Cam s={0.96 + 0.04 * inK + 0.05 * out} ox={g.x} oy={g.y} opacity={inK}>
        <Cage {...g} t={t} bars={1} lift={lift} open={open} tone={open > 0 ? C.amber : C.coral} glowAmt={0.3 + 0.7 * rays} dim={0.4 * (1 - lift)}>
          <Orb x={g.w / 2} y={g.h / 2 + 30 - 60 * out} r={ORB_R(L) * (1 + 0.35 * out)} t={t} dim={0.5 * (1 - lift)} />
        </Cage>
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 6 · «Claude, Codex, Cursor, Antigravity, Copilot… el que ya uses, lo conectas una vez.» ─────────
const HUB = (L: Layout) =>
  L.vertical ? { orb: { x: 540, y: 510 }, r: 112, ring: 320, logo: 180, scr: { x: 540, y: 1090, w: 640, h: 300 } } : { orb: { x: 600, y: 420 }, r: 104, ring: 290, logo: 165, scr: { x: 1440, y: 410, w: 680, h: 400 } };
/** pantalla sencilla (el escritorio del usuario) */
const Screen: React.FC<{ x: number; y: number; w: number; h: number; k: number; edge: number; edgeCol?: string; children?: React.ReactNode }> = ({ x, y, w, h, k, edge, edgeCol = C.cyan, children }) => {
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: clamp01(k * 2), transform: `scale(${0.85 + 0.15 * k})` }}>
      <div style={{ position: "absolute", left: w * 0.465, width: w * 0.07, top: h - 2, height: h * 0.12, background: "linear-gradient(90deg,#141924,#232A3A,#141924)" }} />
      <div style={{ position: "absolute", left: w * 0.37, width: w * 0.26, top: h * 1.1, height: 9, borderRadius: 6, background: "#232A3A" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "linear-gradient(160deg,#1B2130,#0C0F17)", border: `2px solid ${edge > 0 ? edgeCol : "#2A3142"}`, boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 ${60 * edge}px ${edgeCol}66` }} />
      <div style={{ position: "absolute", inset: 11, borderRadius: 8, overflow: "hidden", background: "radial-gradient(120% 90% at 30% 20%, #18223A 0%, #0D1322 45%, #070A12 100%)" }}>{children}</div>
    </div>
  );
};
export const S06: React.FC<P> = ({ t, L }) => {
  const a = ESC.t06.a;
  const H = HUB(L);
  const names = ["claude", "codex", "cursor", "antigravity", "copilot"].map((w) => at("t06", w));
  const tu = at("t06", "uses");
  const tc = at("t06", "conectas");
  const tun = at("t06", "una");
  const enter = E(t, a, 0.5);
  const spin = (t - tu) > 0 ? (t - tu) * 26 + 12 * E(t, tu - 0.2, 0.6) : 0;
  const cable = prog(t, tc - 0.15, tc + 0.4);
  const plug = prog(t, tun - 0.05, tun + 0.6);
  const lit = E(t, tun, 0.4);
  const orbEdge = L.vertical ? { x: H.orb.x, y: H.orb.y + H.r + 6 } : { x: H.orb.x + H.r + 6, y: H.orb.y };
  const scrEdge = L.vertical ? { x: H.scr.x, y: H.scr.y - H.scr.h / 2 } : { x: H.scr.x - H.scr.w / 2, y: H.scr.y };
  return (
    <AbsoluteFill>
      <Cam s={1.02 - 0.02 * E(t, a, 5)} ox={L.c.x} oy={L.c.y} x={shake(t, [tun + 0.02], 8).x} y={shake(t, [tun + 0.02], 8).y}>
        {/* órbita */}
        <svg style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "visible" }}>
          <circle cx={H.orb.x} cy={H.orb.y} r={H.ring} fill="none" stroke={C.amber} strokeOpacity={0.25 * enter} strokeWidth={2} strokeDasharray="6 12" strokeDashoffset={-t * 30} />
        </svg>
        <Screen {...H.scr} k={E(t, tc - 0.4, 0.5)} edge={lit}>
          {lit > 0 && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, ${C.cyan}33, transparent 70%)`, opacity: lit }} />}
        </Screen>
        <Cable a={orbEdge} b={scrEdge} t={t} draw={cable} bend={0.12} />
        <Spark x={scrEdge.x} y={scrEdge.y} k={plug} color="#BFF0FF" />
        <Orb x={H.orb.x} y={H.orb.y} r={H.r} t={t} k={spr(t, a, 1.6, 7)} />
        {AGENTS.map((id, i) => {
          const an = ((-90 + i * 72 + spin) * Math.PI) / 180;
          const k = spr(t, names[i] - 0.06, 1.8, 7);
          const hot = win(t, names[i] - 0.06, names[i] + 0.4, 0.05, 0.3);
          return <AgentLogo key={id} id={id} x={H.orb.x + Math.cos(an) * H.ring} y={H.orb.y + Math.sin(an) * H.ring} size={H.logo * (1 + 0.12 * hot)} k={Math.min(1.06, k)} glow={hot + 0.35 * lit} />;
        })}
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 7 · «Entiende en qué trabajas y te monta el entorno: espacios, ventanas, atajos, ajustes.» ─────────
const ENV = (L: Layout) =>
  L.vertical
    ? { orb: { x: 132, y: 822 }, r: 56, keys: { x: 540, y: 985 }, tog: { x: 540, y: 1115 }, ks: 40, ts: 36 }
    : { orb: { x: 1500, y: 640 }, r: 56, keys: { x: 1290, y: 790 }, tog: { x: 1700, y: 790 }, ks: 34, ts: 32 };
/** tira de escritorios virtuales (los «espacios») sobre la pantalla principal */
const Spaces: React.FC<{ L: Layout; k: number; active: number }> = ({ L, k, active }) => {
  if (k <= 0) return null;
  const sc = screenOf(L.mon[0], L.u);
  const w = L.vertical ? 104 : 116, h = L.vertical ? 62 : 66, gap = 16;
  const x0 = sc.x + sc.w / 2 - (3 * w + 2 * gap) / 2;
  return (
    <>
      {[0, 1, 2].map((i) => {
        const kk = ease.back(clamp01((k - i * 0.15) / 0.6));
        return (
          <div key={i} style={{ position: "absolute", left: x0 + i * (w + gap), top: sc.y + 14, width: w, height: h, borderRadius: 12, zIndex: 25, transform: `scale(${kk})`, opacity: clamp01(kk * 2), background: "rgba(14,18,28,0.92)", border: `2px solid ${i === active ? C.amber : "rgba(255,255,255,0.2)"}`, boxShadow: i === active ? `0 0 24px ${C.amber}88` : "0 8px 20px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" width={h * 0.55} height={h * 0.55}>
              <path d={ICONS[i]} fill="none" stroke={i === active ? C.amber : C.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      })}
    </>
  );
};
export const S07: React.FC<P> = ({ t, L }) => {
  const a = ESC.t07.a;
  const ten = at("t07", "entiende");
  const tm = at("t07", "monta");
  const tes = at("t07", "espacios");
  const tve = at("t07", "ventanas");
  const tat = at("t07", "atajos");
  const taj = at("t07", "ajustes");
  const G = ENV(L);
  const power = E(t, tm - 0.1, 0.6);
  const m0 = L.mon[0], m1 = L.mon[1];
  const ends = L.vertical
    ? [{ x: m0.x + 40, y: m0.y + m0.h }, { x: m1.x, y: m1.y + m1.h * 0.4 }]
    : [{ x: m1.x + m1.w * 0.5, y: m1.y + m1.h }, { x: m0.x + m0.w, y: m0.y + m0.h * 0.75 }];
  const think = win(t, ten - 0.1, tm, 0.2, 0.2);
  const wins: WS[] = PROGRAMAR.map((s, i) => {
    const k = spr(t, tve - 0.15 + i * 0.1, 1.6, 7.5);
    const dst = place(L, s.mon, s.f);
    const src: Rect = { x: G.orb.x - 30, y: G.orb.y - 20, w: 60, h: 40 };
    return { slot: s, r: lerpRect(src, dst, Math.min(1, k)), opacity: clamp01(k * 4), scale: 1 + 0.03 * Math.max(0, k - 1), glow: C.amber, glowAmt: win(t, tve - 0.15 + i * 0.1, tve + 0.6 + i * 0.1, 0.1, 0.4) };
  });
  const done = E(t, taj + 0.55, 0.5);
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.04 * E(t, a, 6)} ox={L.c.x} oy={L.c.y} opacity={E(t, a, 0.35)}>
        <Desk L={L} t={t} wins={t > tve - 0.2 ? wins : []} power={[power, power]} edge={done > 0 ? C.green : C.cyan} edgeAmt={done > 0 ? done : 0.5 * power} overlay={[<Spaces key="s" L={L} k={prog(t, tes - 0.1, tes + 0.6)} active={0} />, null]} />
        {ends.map((b, i) => (
          <Cable key={i} a={G.orb} b={b} t={t} draw={prog(t, tm - 0.25 + i * 0.1, tm + 0.3 + i * 0.1)} bend={i ? -0.2 : 0.2} width={5} flow={1.4} />
        ))}
        {think > 0 &&
          [0, 1, 2].map((i) => {
            const k = ((t - ten) * 1.3 + i / 3) % 1;
            return <div key={i} style={{ position: "absolute", left: G.orb.x - G.r * (1 + 1.6 * k), top: G.orb.y - G.r * (1 + 1.6 * k), width: 2 * G.r * (1 + 1.6 * k), height: 2 * G.r * (1 + 1.6 * k), borderRadius: 999, border: `2px solid ${C.amber}`, opacity: (1 - k) * think }} />;
          })}
        <Orb x={G.orb.x} y={G.orb.y} r={G.r} t={t} k={spr(t, a, 1.6, 7)} />
        <Keys x={G.keys.x} y={G.keys.y} keys={["Ctrl", "Alt", "1"]} size={G.ks} k={spr(t, tat - 0.08, 1.8, 7)} color={C.cyan} />
        {[0, 1].map((i) => (
          <Toggle key={i} x={G.tog.x - 70 + i * 140} y={G.tog.y} s={G.ts} k={spr(t, taj - 0.15 + i * 0.08, 1.8, 7)} on={prog(t, taj + 0.05 + i * 0.12, taj + 0.35 + i * 0.12)} />
        ))}
        <Check x={L.vertical ? m0.x + m0.w - 50 : m0.x + m0.w - 50} y={m0.y + 50} s={L.vertical ? 76 : 70} k={done} />
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 8 · «Y desentierra lo mejor de tu proyecto: lleva sus funciones a tu Omnibar.» ─────────
const OMNI = (L: Layout) =>
  L.vertical
    ? { term: { x: 130, y: 330, w: 820, h: 470 }, orb: { x: 540, y: 200 }, r: 62, bar: { x: 540, y: 990, w: 860, h: 100 }, row0: 1092, dy: 72, size: 40 }
    : { term: { x: 150, y: 210, w: 800, h: 470 }, orb: { x: 550, y: 110 }, r: 56, bar: { x: 1400, y: 300, w: 760, h: 96 }, row0: 400, dy: 72, size: 38 };
export const S08: React.FC<P> = ({ t, L }) => {
  const a = ESC.t08.a;
  const td = at("t08", "desentierra");
  const tm = at("t08", "mejor");
  const tl = at("t08", "lleva");
  const to = at("t08", "omnibar");
  const O = OMNI(L);
  const r = O.term as Rect;
  const rise = ease.out(prog(t, td + 0.05, td + 0.9));
  const beam = win(t, td - 0.15, tl + 0.2, 0.2, 0.3);
  const barK = E(t, tl - 0.35, 0.5);
  const termOut = E(t, to + 0.2, 0.6);
  /** ficha i: enterrada → desenterrada → vuela a la barra. `flying` = solo se dibuja la fase de vuelo (encima de todo) */
  const chip = (f: string, i: number, flying: boolean) => {
    // misma pila vertical en las dos orientaciones (en fila, en horizontal, las fichas desenterradas se solapaban)
    const home = { x: r.x + r.w * 0.5, y: r.y + r.h * (0.5 + i * 0.16) };
    const up = { x: home.x, y: r.y + r.h * (0.24 + i * 0.17) };
    const dst = { x: O.bar.x - O.bar.w / 2 + O.size * 3.6, y: O.row0 + i * O.dy };
    const fly = ease.inOut(prog(t, tl + i * 0.12, tl + 0.7 + i * 0.12));
    if ((fly > 0) !== flying) return null;
    const p0 = { x: lerp(home.x, up.x, rise), y: lerp(home.y, up.y, rise) };
    const x = lerp(p0.x, dst.x, fly) + (L.vertical ? Math.sin(fly * Math.PI) * (i - 1) * 60 : 0);
    const y = lerp(p0.y, dst.y, fly) + Math.sin(fly * Math.PI) * (L.vertical ? 0 : -120);
    const bump = win(t, tm - 0.05, tm + 0.5, 0.05, 0.3);
    return <FnChip key={f} x={x} y={y} label={f} size={O.size * (1 + 0.1 * bump)} t={t} gray={1 - rise} tone={fly > 0.85 ? C.cyan : C.amber} slash={fly > 0.85} />;
  };
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.03 * E(t, a, 5)} ox={L.c.x} oy={L.c.y} opacity={E(t, a, 0.3)}>
        <div style={{ opacity: 1 - termOut * 0.6 }}>
          <Win r={r} kind="terminal" t={t} seed="registro" live={1} />
        </div>
        {FN.map((f, i) => chip(f, i, false))}
        <div style={{ opacity: 1 - termOut * 0.6 }}>
          <Sediment r={r} k={1 - rise} t={t} seed="sed" />
        </div>
        {beam > 0 && (
          <svg style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "visible" }}>
            <polygon points={`${O.orb.x},${O.orb.y} ${r.x + r.w * 0.15},${r.y + r.h} ${r.x + r.w * 0.85},${r.y + r.h}`} fill={C.amber} opacity={0.14 * beam * (0.8 + 0.2 * Math.sin(t * 9))} />
          </svg>
        )}
        <Dust x={r.x + 60} y={r.y + r.h * 0.5} w={r.w - 120} h={r.h * 0.4} k={prog(t, td, td + 1.1)} seed="desentierra" n={40} color="#C9D1E3" />
        <Orb x={O.orb.x} y={O.orb.y} r={O.r} t={t} k={spr(t, a, 1.6, 7)} />
        <Bar {...O.bar} t={t} k={barK} text="" glow={0.4 + 0.6 * win(t, to - 0.05, to + 0.6, 0.05, 0.4)} />
        {FN.map((f, i) => chip(f, i, true))}
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 9 · «Pulsas tu atajo, eliges una función… y tu proyecto hace el trabajo. Desde cualquier app.» ─────────
const USE = (L: Layout) =>
  L.vertical
    ? { app: { x: 90, y: 300, w: 900, h: 640 }, keys: { x: 540, y: 200 }, ks: 40, bar: { x: 540, y: 470, w: 840, h: 96 }, row0: 570, dy: 70, size: 38, box: { x: 540, y: 1135 }, bs: 260 }
    : { app: { x: 150, y: 120, w: 1080, h: 640 }, keys: { x: 1640, y: 170 }, ks: 36, bar: { x: 690, y: 290, w: 820, h: 92 }, row0: 388, dy: 68, size: 36, box: { x: 1640, y: 470 }, bs: 260 };
export const S09: React.FC<P> = ({ t, L }) => {
  const a = ESC.t09.a;
  const tp = at("t09", "pulsas");
  const tat = at("t09", "atajo");
  const tel = at("t09", "eliges");
  const tf = at("t09", "funcion");
  const tpr = at("t09", "proyecto");
  const tha = at("t09", "hace");
  const ttr = at("t09", "trabajo");
  const tcu = at("t09", "cualquier");
  const tap = at("t09", "app");
  const U = USE(L);
  // la app de delante cambia: «desde cualquier app»
  const kinds: Kind[] = ["browser", "design", "notes"];
  const ki = t < tcu ? 0 : t < tap ? 1 : 2;
  const flip = Math.max(win(t, tcu - 0.12, tcu + 0.12, 0.12, 0.12), win(t, tap - 0.12, tap + 0.12, 0.12, 0.12));
  const barK = E(t, tat, 0.35);
  const rowsK = E(t, tel - 0.05, 0.4) * (1 - E(t, tpr - 0.1, 0.3));
  const pick = clamp01(prog(t, tel + 0.1, tf + 0.1));
  const sel = pick < 0.5 ? 2 : pick < 0.8 ? 1 : 0;
  const text = t < tf ? "" : "/informe".slice(0, Math.max(1, Math.floor(prog(t, tf, tf + 0.35) * 8)));
  const send = prog(t, tpr - 0.1, tha + 0.1);
  const work = win(t, tha - 0.1, ttr + 0.5, 0.15, 0.3);
  const back = ease.inOut(prog(t, ttr + 0.15, ttr + 0.75));
  const boxK = spr(t, tpr - 0.3, 1.6, 7);
  const barBottom = { x: U.bar.x, y: U.bar.y + U.bar.h / 2 };
  const boxTop = L.vertical ? { x: U.box.x, y: U.box.y - U.bs * 0.45 } : { x: U.box.x - U.bs * 0.5, y: U.box.y };
  const resultPos = { x: lerp(boxTop.x, U.bar.x, back), y: lerp(boxTop.y, U.row0 + 6, back) };
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.03 * E(t, a, 5)} ox={L.c.x} oy={L.c.y} opacity={E(t, a, 0.3)}>
        <div style={{ transform: `scaleX(${1 - 0.9 * flip})`, transformOrigin: `${U.app.x + U.app.w / 2}px 0`, filter: `brightness(${0.55 + 0.25 * (1 - barK)})` }}>
          <Win r={U.app} kind={kinds[ki]} t={t} seed={"app" + ki} />
        </div>
        <Keys x={U.keys.x} y={U.keys.y} keys={["Tu atajo"]} size={U.ks} k={spr(t, tp + 0.05, 1.8, 7) * (1 - E(t, tel + 0.3, 0.4))} color={C.cyan} />
        <Cable a={barBottom} b={boxTop} t={t} draw={send} bend={L.vertical ? 0.08 : -0.25} color={C.cyan} width={5} flow={work > 0 ? 1.6 : 0} />
        <ProjectBox x={U.box.x} y={U.box.y} s={U.bs} t={t} k={boxK} work={work} />
        <Bar {...U.bar} t={t} k={barK} text={text} glow={0.5 + 0.5 * flip} />
        {FN.map((f, i) => (
          <div key={f} style={{ opacity: rowsK }}>
            <FnChip x={U.bar.x - U.bar.w / 2 + U.size * 3.6} y={U.row0 + i * U.dy} label={f} size={U.size * (i === sel ? 1.06 : 1)} t={t} tone={C.cyan} slash k={rowsK > 0 ? 1 : 0} opacity={i === sel ? 1 : 0.5} />
          </div>
        ))}
        {back > 0 && (
          <div style={{ position: "absolute", left: resultPos.x, top: resultPos.y, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * back})`, display: "flex", alignItems: "center", gap: 14, padding: `${U.size * 0.3}px ${U.size * 0.6}px`, borderRadius: U.size * 0.5, background: "linear-gradient(180deg,#14301F,#0C1A12)", border: `2px solid ${C.green}`, boxShadow: `0 0 ${40 * back}px ${C.green}66`, fontFamily: FONT, fontWeight: 800, fontSize: U.size, color: C.ink, whiteSpace: "nowrap", zIndex: 30 }}>
            <svg viewBox="0 0 24 24" width={U.size} height={U.size}>
              <path d="M5 12.5 L10 17 L19 7.5" fill="none" stroke={C.green} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            informe listo
          </div>
        )}
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 10 · «Él propone. Tú revisas y decides.» ─────────
const DRAFT = (L: Layout) => (L.vertical ? { orb: { x: 540, y: 300 }, r: 72, card: { x: 540, y: 820, w: 760, h: 560 } } : { orb: { x: 420, y: 420 }, r: 80, card: { x: 1150, y: 420, w: 820, h: 560 } });
export const S10: React.FC<P> = ({ t, L }) => {
  const a = ESC.t10.a;
  const tpr = at("t10", "propone");
  const ttu = at("t10", "tu");
  const tre = at("t10", "revisas");
  const tde = at("t10", "decides");
  const D = DRAFT(L);
  const c = D.card;
  const out = spr(t, tpr - 0.2, 1.4, 7);
  const cx = lerp(D.orb.x, c.x, Math.min(1, out)), cy = lerp(D.orb.y, c.y, Math.min(1, out));
  const ok = E(t, tde + 0.15, 0.35);
  const fs = L.vertical ? 38 : 36;
  const rows = [
    { icon: ICONS[0], label: "Espacio · mi-proyecto" },
    { icon: "M4 7 H20 V17 H4 Z M7 10 H8 M10 10 H11 M13 10 H14 M16 10 H17 M8 14 H16", label: "Atajo · Ctrl + Alt + 1" },
    { icon: "M12 3 V21 M3 12 H21", label: "/informe" },
  ];
  const scan = prog(t, tre - 0.1, tde - 0.1);
  const mag = { x: c.x - c.w * 0.18 + c.w * 0.36 * Math.sin(scan * Math.PI * 1.5), y: c.y - c.h * 0.22 + c.h * 0.42 * scan };
  const btn = { x: c.x + c.w / 2 - 150, y: c.y + c.h / 2 - 62 };
  const rest = { x: c.x + c.w * 0.12, y: c.y + c.h * 0.36 };
  const curP = t < tde - 0.25 ? rest : { x: lerp(rest.x, btn.x + 20, ease.inOut(prog(t, tde - 0.25, tde + 0.1))), y: lerp(rest.y, btn.y + 10, ease.inOut(prog(t, tde - 0.25, tde + 0.1))) };
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.04 * E(t, a, 4)} ox={L.c.x} oy={L.c.y} opacity={E(t, a, 0.3)}>
        <Orb x={D.orb.x} y={D.orb.y} r={D.r} t={t} k={spr(t, a, 1.6, 7)} />
        {out > 0 && (
          <div
            style={{
              position: "absolute", left: cx - c.w / 2, top: cy - c.h / 2, width: c.w, height: c.h, borderRadius: 26, transform: `scale(${0.3 + 0.7 * Math.min(1.03, out)})`, opacity: clamp01(out * 3),
              background: "linear-gradient(160deg, rgba(26,32,48,0.97), rgba(12,15,23,0.97))", border: `3px ${ok > 0.5 ? "solid" : "dashed"} ${ok > 0.5 ? C.green : C.amber}`,
              boxShadow: `0 40px 90px rgba(0,0,0,0.6), 0 0 ${70 * (ok > 0.5 ? ok : 0.4)}px ${ok > 0.5 ? C.green : C.amber}55`, fontFamily: FONT, color: C.ink,
            }}
          >
            <div style={{ position: "absolute", left: 40, top: 32, display: "flex", alignItems: "center", gap: 14, fontWeight: 800, fontSize: fs * 1.05, color: ok > 0.5 ? C.green : C.amber }}>
              <svg viewBox="-12 -12 24 24" width={fs} height={fs}>
                <path d="M0 -10 C1.2 -3 3 -1.2 10 0 C3 1.2 1.2 3 0 10 C-1.2 3 -3 1.2 -10 0 C-3 -1.2 -1.2 -3 0 -10 Z" fill={ok > 0.5 ? C.green : C.amber} />
              </svg>
              {ok > 0.5 ? "Aplicado" : "Propuesta"}
            </div>
            {rows.map((rw, i) => {
              const rk = E(t, tpr + 0.15 + i * 0.12, 0.35);
              const seen = scan > (i + 0.6) / 3.2 || ok > 0;
              return (
                <div key={i} style={{ position: "absolute", left: 40, right: 40, top: 120 + i * 92, height: 72, borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 18, paddingLeft: 20, opacity: rk, transform: `translateX(${(1 - rk) * 30}px)`, fontWeight: 700, fontSize: fs * 0.82 }}>
                  <svg viewBox="0 0 24 24" width={fs} height={fs}>
                    <path d={rw.icon} fill="none" stroke={C.cyan} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {rw.label}
                  {seen && (
                    <svg viewBox="0 0 24 24" width={fs} height={fs} style={{ position: "absolute", right: 18 }}>
                      <path d="M5 12.5 L10 17 L19 7.5" fill="none" stroke={C.green} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              );
            })}
            <div style={{ position: "absolute", right: 40, bottom: 30, width: 220, height: 64, borderRadius: 32, background: ok > 0.5 ? C.green : "rgba(0,230,118,0.15)", border: `2px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: fs * 0.8, color: ok > 0.5 ? "#0A0C12" : C.green, transform: `scale(${t > tde && t < tde + 0.2 ? 0.92 : 1})` }}>Aplicar</div>
          </div>
        )}
        {scan > 0 && scan < 1 && (
          <svg viewBox="0 0 24 24" width={130} height={130} style={{ position: "absolute", left: mag.x - 50, top: mag.y - 50, filter: `drop-shadow(0 0 12px ${C.cyan})`, zIndex: 40 }}>
            <circle cx={10} cy={10} r={6.5} fill="rgba(79,209,255,0.12)" stroke={C.cyan} strokeWidth={2} />
            <path d="M15 15 L21 21" stroke={C.cyan} strokeWidth={2.6} strokeLinecap="round" />
          </svg>
        )}
        <Cursor x={curP.x} y={curP.y} s={L.u * 1.25} opacity={E(t, ttu - 0.1, 0.3)} color={C.green} click={t > tde && t < tde + 0.8 ? (t - tde) / 0.8 : -1} />
        <Check x={c.x + c.w / 2 - 6} y={c.y - c.h / 2 + 6} s={84} k={ok} />
        <Spark x={c.x + c.w / 2 - 6} y={c.y - c.h / 2 + 6} k={prog(t, tde + 0.15, tde + 0.75)} color="#B9FFD6" />
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 11 · «Tu agente ya no vive en una ventana.» ─────────
export const S11: React.FC<P> = ({ t, L }) => {
  const a = ESC.t11.a;
  const g0 = CAGE(L);
  const g = { ...g0, w: g0.w * 0.8, h: g0.h * 0.8 };
  const tya = at("t11", "ya");
  const tve = at("t11", "ventana");
  const gone = prog(t, tya - 0.05, tve + 0.4);
  const inK = E(t, a, 0.5);
  // el agente da vueltas fuera de la ventana y acaba en el centro
  const ang = (t - a) * 2.2;
  const rx = L.vertical ? 400 : 560, ry = L.vertical ? 420 : 300;
  const center = E(t, tve - 0.2, 0.9, ease.inOut);
  const ox = lerp(g.x + Math.cos(ang) * rx, g.x, center), oy = lerp(g.y + Math.sin(ang) * ry * 0.8, g.y, center);
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.04 * E(t, a, 4)} ox={g.x} oy={g.y} opacity={inK}>
        <Cage {...g} t={t} k={1 - ease.in(clamp01((gone - 0.35) / 0.65))} glowAmt={0.15} dim={0.5} opacity={1 - ease.in(clamp01((gone - 0.4) / 0.6))} />
        <Dust x={g.x - g.w / 2} y={g.y - g.h / 2} w={g.w} h={g.h} k={prog(t, tya + 0.2, tve + 1.0)} seed="cristal" n={70} color="#AFC2E8" size={5} />
        {Array.from({ length: 10 }).map((_, i) => {
          const tt = t - i * 0.04;
          const an = (tt - a) * 2.2;
          const px = lerp(g.x + Math.cos(an) * rx, g.x, E(tt, tve - 0.2, 0.9, ease.inOut)), py = lerp(g.y + Math.sin(an) * ry * 0.8, g.y, E(tt, tve - 0.2, 0.9, ease.inOut));
          return i === 0 ? null : <div key={i} style={{ position: "absolute", left: px - 10, top: py - 10, width: 20, height: 20, borderRadius: 99, background: C.amber, opacity: (1 - i / 10) * 0.35, filter: "blur(2px)" }} />;
        })}
        <Orb x={ox} y={oy} r={ORB_R(L) * (0.8 + 0.5 * center)} t={t} />
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 12 · «Ahora prepara tu forma de trabajar.» ─────────
export const S12: React.FC<P> = ({ t, L }) => {
  const a = ESC.t12.a;
  const tah = at("t12", "ahora");
  const tpr = at("t12", "prepara");
  const tfo = at("t12", "forma");
  const fin = atEnd("t12", "trabajar") + 0.25;
  const power = E(t, tah - 0.1, 0.5);
  const G = ENV(L);
  const wins: WS[] = PROGRAMAR.map((s, i) => {
    const k = spr(t, tpr - 0.1 + i * 0.09, 1.6, 7.5);
    return { slot: s, opacity: clamp01(k * 3), scale: 0.7 + 0.3 * Math.min(1.03, k), glow: C.green, glowAmt: E(t, tfo, 0.5) * 0.7 };
  });
  const m0 = L.mon[0], m1 = L.mon[1];
  const ends = L.vertical
    ? [{ x: m0.x + 40, y: m0.y + m0.h }, { x: m1.x, y: m1.y + m1.h * 0.4 }]
    : [{ x: m1.x + m1.w * 0.5, y: m1.y + m1.h }, { x: m0.x + m0.w, y: m0.y + m0.h * 0.75 }];
  const green = E(t, tfo, 0.6);
  const sc = screenOf(m0, L.u);
  const fade = E(t, fin, 0.8, ease.inOut);
  return (
    <AbsoluteFill>
      <Cam s={0.97 + 0.05 * E(t, a, 4) - 0.05 * fade} ox={L.c.x} oy={L.c.y} opacity={E(t, a, 0.35) * (1 - 0.8 * fade)} filter={fade > 0 ? `blur(${fade * 5}px)` : undefined}>
        <Desk L={L} t={t} wins={wins} power={[power, power]} edge={C.green} edgeAmt={green} overlay={[<Spaces key="s" L={L} k={E(t, tpr, 0.6)} active={0} />, null]} />
        {ends.map((b, i) => (
          <Cable key={i} a={G.orb} b={b} t={t} draw={prog(t, tpr - 0.2 + i * 0.1, tpr + 0.4 + i * 0.1)} bend={i ? -0.2 : 0.2} width={5} flow={1.2} color={C.amber} />
        ))}
        <Orb x={G.orb.x} y={G.orb.y} r={G.r} t={t} k={spr(t, a, 1.6, 7)} />
        <Bar x={sc.x + sc.w / 2} y={sc.y + sc.h * 0.62} w={sc.w * 0.62} h={L.vertical ? 70 : 74} t={t} k={E(t, tpr + 0.3, 0.4)} text="/informe" caret={false} glow={0.4} />
        <Check x={m0.x + m0.w - 50} y={m0.y + 50} s={L.vertical ? 76 : 70} k={green} />
      </Cam>
    </AbsoluteFill>
  );
};
