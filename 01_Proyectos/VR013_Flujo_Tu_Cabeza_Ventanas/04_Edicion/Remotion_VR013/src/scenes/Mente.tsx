import React from "react";
import { AbsoluteFill } from "remotion";
import { at, atEnd, C, clamp01, E, ease, ESC, lerp, prog, rnd, spr, toma, win } from "../theme";
import { Layout, lerpRect, place, Rect, screenOf } from "../layout";
import { ACCENT, BASE, CREAR, ESTUDIAR, Kind, PROGRAMAR, Slot } from "../windows";
import { Cam, Desk, WS } from "../components/Desk";
import { Monitor } from "../components/Monitor";
import { Win } from "../components/Win";
import { Cursor, Dust, shake } from "../components/Bits";
import { BRAIN, brainPoint, Head, ICONS, Keys, Meter, MiniWin, Mouse, Room, Thread } from "../components/Mind";

type P = { t: number; L: Layout };
const KINDS = Object.keys(ACCENT) as Kind[];
const SETS = [PROGRAMAR, ESTUDIAR, CREAR];

// posiciones de la cabeza por escena y orientación
const HEAD = {
  hook: (L: Layout) => (L.vertical ? { cx: 540, cy: 720, h: 780 } : { cx: 960, cy: 400, h: 700 }),
  carga: (L: Layout) => (L.vertical ? { cx: 500, cy: 700, h: 720 } : { cx: 820, cy: 400, h: 680 }),
  calma: (L: Layout) => (L.vertical ? { cx: 540, cy: 760, h: 660 } : { cx: 760, cy: 400, h: 660 }),
};
/** punto de la cabeza (unidades 200×240) → píxeles del fotograma */
const toPx = (hd: { cx: number; cy: number; h: number }, p: { x: number; y: number }) => {
  const s = hd.h / 240;
  return { x: hd.cx - 100 * s + p.x * s, y: hd.cy - hd.h / 2 + p.y * s };
};

/** ventanas que llenan la cabeza (las mismas en el gancho y en el beneficio) */
const headWins = (n: number) =>
  Array.from({ length: n }).map((_, i) => {
    const p = brainPoint("hw" + i);
    const w = 34 + rnd("hww" + i) * 22;
    return { i, x: p.x, y: p.y, w, h: w * 0.66, kind: KINDS[i % KINDS.length], rot: (rnd("hwr" + i) - 0.5) * 40, dot: i % 4 === 0 };
  });

// ───────── 1 · «Tu cabeza tiene demasiadas ventanas abiertas.» ─────────
export const S01: React.FC<P> = ({ t, L }) => {
  const hd = HEAD.hook(L);
  const td = at("t01", "demasiadas");
  const tab = atEnd("t01", "abiertas");
  const ws = headWins(34);
  const over = E(t, tab - 0.2, 0.6);
  const sh = t > tab - 0.1 ? Math.sin(t * 70) * 5 * Math.max(0, 1 - (t - tab) / 1.2) : 0;
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.05 * E(t, 0, 3, ease.inOut)} ox={hd.cx} oy={hd.cy}>
        <Head {...hd} draw={E(t, 0, 0.7)} glow={C.coral} glowAmt={over} stroke={over > 0.5 ? "#FFB0B2" : C.ink} fill={over > 0 ? "rgba(255,90,95,0.18)" : undefined} shake={sh}>
          {ws.map((w) => {
            const t0 = w.i < 6 ? 0.25 + w.i * 0.17 : td - 0.05 + (w.i - 6) * 0.032;
            const k = spr(t, t0, 1.8, 7);
            if (k <= 0) return null;
            const ang = rnd("ang" + w.i) * Math.PI * 2;
            const fx = w.x + Math.cos(ang) * 260, fy = w.y + Math.sin(ang) * 260;
            const blink = w.dot && Math.floor(t * 4 + w.i) % 2 === 0;
            return (
              <MiniWin key={w.i} x={lerp(fx, w.x, Math.min(1.05, k))} y={lerp(fy, w.y, Math.min(1.05, k))} w={w.w} h={w.h} kind={w.kind}
                rot={w.rot * Math.min(1, k)} scale={0.6 + 0.4 * Math.min(1, k)} dot={blink} glow={C.coral} glowAmt={over * 0.6} />
            );
          })}
        </Head>
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 2 · «Buscas una pestaña. Apuntas. Arrastras. Cambias de escritorio a ciegas.» ─────────
const messy = (L: Layout, s: Slot, seed: string): Rect => {
  const m = L.mon[s.mon];
  const w = m.w * (0.32 + rnd(seed + "w") * 0.2);
  const h = w * (0.55 + rnd(seed + "h") * 0.2);
  return { x: m.x + m.w * (0.05 + rnd(seed + "x") * 0.5), y: m.y + m.h * (0.08 + rnd(seed + "y") * 0.38), w, h };
};
export const S02: React.FC<P> = ({ t, L }) => {
  const a = ESC.t02.a;
  const tb = at("t02", "buscas");
  const tp = at("t02", "pestaña");
  const ta = at("t02", "apuntas");
  const tr = at("t02", "arrastras");
  const tc = at("t02", "cambias");
  const tci = at("t02", "ciegas");
  const m = L.mon[0];
  const P = (fx: number, fy: number) => ({ x: m.x + m.w * fx, y: m.y + m.h * fy });
  // ventanas desordenadas (dos escritorios: antes y después del cambio a ciegas)
  const desk = (seed: string) =>
    [...BASE, ...BASE.map((s) => ({ ...s, id: s.id + "x" }))].map((s) => ({ slot: { ...s, id: s.id + seed }, r: messy(L, s, s.id + seed), rotate: (rnd(s.id + seed + "r") - 0.5) * 8 }));
  const d1 = desk("a"), d2 = desk("b");
  const browser = d1.find((w) => w.slot.kind === "browser")!.r!;
  const tab = { x: browser.x + browser.w * 0.27, y: browser.y + Math.max(9, Math.min(24, browser.h * 0.075)) + browser.h * 0.06 };
  const code = d1.find((w) => w.slot.kind === "code")!;
  // recorrido del cursor
  const zig = [P(0.5, 0.65), P(0.15, 0.25), P(0.85, 0.35), P(0.3, 0.75), P(0.75, 0.15), P(0.45, 0.5)];
  const curAt = (x: number) => {
    if (x < tb) return zig[0];
    if (x < tp) {
      const k = prog(x, tb, tp) * (zig.length - 1);
      const i = Math.min(zig.length - 2, Math.floor(k));
      const e = ease.inOut(k - i);
      return { x: lerp(zig[i].x, zig[i + 1].x, e), y: lerp(zig[i].y, zig[i + 1].y, e) };
    }
    if (x < tr) {
      const e = ease.out(prog(x, tp, ta + 0.25));
      return { x: lerp(zig[zig.length - 1].x, tab.x, e), y: lerp(zig[zig.length - 1].y, tab.y, e) };
    }
    const grab = { x: code.r!.x + code.r!.w * 0.4, y: code.r!.y + 8 };
    const e1 = ease.inOut(prog(x, tr, tr + 0.25));
    const e2 = ease.inOut(prog(x, tr + 0.25, tc - 0.05));
    return { x: lerp(lerp(tab.x, grab.x, e1), grab.x + m.w * 0.25, e2), y: lerp(lerp(tab.y, grab.y, e1), grab.y + m.h * 0.3, e2) };
  };
  const cur = curAt(t);
  const drag = ease.inOut(prog(t, tr + 0.25, tc - 0.05));
  d1.forEach((w) => {
    if (w === code) w.r = { ...w.r!, x: w.r!.x + m.w * 0.25 * drag, y: w.r!.y + m.h * 0.3 * drag };
  });
  const sw = ease.inOut(prog(t, tc, tc + 0.35));
  const scrW = screenOf(m, L.u).w;
  const wins: WS[] = [
    ...d1.map((w) => ({ ...w, r: { ...w.r!, x: w.r!.x - scrW * 1.1 * sw }, blur: Math.sin(sw * Math.PI) * 10 })),
    ...(sw > 0 ? d2.map((w) => ({ ...w, r: { ...w.r!, x: w.r!.x + scrW * 1.1 * (1 - sw) }, blur: Math.sin(sw * Math.PI) * 10 })) : []),
  ];
  // estela del cursor
  const trail = Array.from({ length: 14 }).map((_, i) => ({ p: curAt(t - i * 0.025), o: (1 - i / 14) * 0.5 }));
  const aim = win(t, ta - 0.1, tr, 0.15, 0.2);
  const aimR = 70 - 50 * E(t, ta - 0.1, 0.4);
  const blind = E(t, tci - 0.1, 0.4);
  const enter = E(t, a, 0.4);
  return (
    <AbsoluteFill>
      <Cam s={0.96 + 0.04 * enter + 0.03 * aim} ox={tab.x} oy={tab.y} opacity={enter}>
        <Desk L={L} t={t} wins={wins} clip />
        {trail.map((d, i) => (i === 0 ? null : <div key={i} style={{ position: "absolute", left: d.p.x - 4, top: d.p.y - 4, width: 8, height: 8, borderRadius: 9, background: C.coral, opacity: d.o * (t > tb && t < tr ? 1 : 0.3) }} />))}
        {aim > 0 && <div style={{ position: "absolute", left: tab.x - aimR, top: tab.y - aimR, width: aimR * 2, height: aimR * 2, borderRadius: 999, border: `3px solid ${C.coral}`, opacity: aim, boxShadow: `0 0 20px ${C.coral}` }} />}
        <Cursor x={cur.x} y={cur.y} s={L.u * 1.15} click={t > ta + 0.25 && t < ta + 0.95 ? (t - ta - 0.25) / 0.7 : -1} color={C.coral} />
        {blind > 0 && (
          <div style={{ position: "absolute", left: cur.x + 30, top: cur.y - 90, width: 70, height: 70, borderRadius: 99, background: C.coral, color: "#0A0C12", fontFamily: "InterX", fontWeight: 800, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${ease.back(blind)})`, boxShadow: `0 0 30px ${C.coral}` }}>?</div>
        )}
      </Cam>
      {blind > 0 && <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, transparent 25%, rgba(0,0,0,0.85) 75%)", opacity: blind * 0.9 }} />}
    </AbsoluteFill>
  );
};

// ───────── 3 · «Y cuando por fin la encuentras… ¿qué ibas a hacer?» ─────────
export const S03: React.FC<P> = ({ t, L }) => {
  const a = ESC.t03.a;
  const te = at("t03", "encuentras");
  const tq = at("t03", "que");
  const ti = at("t03", "ibas");
  const hd = L.vertical ? { cx: 540, cy: 560, h: 520 } : { cx: 520, cy: 420, h: 480 };
  const card: Rect = L.vertical ? { x: 290, y: 980, w: 500, h: 300 } : { x: 1170, y: 300, w: 520, h: 320 };
  const brain = toPx(hd, { x: BRAIN.x + 20, y: BRAIN.y });
  const cardP = L.vertical ? { x: card.x + card.w / 2, y: card.y } : { x: card.x, y: card.y + card.h / 2 };
  const ws = headWins(10);
  const snap = prog(t, ti - 0.05, ti + 0.85);
  const found = E(t, te, 0.3);
  const q = spr(t, tq - 0.05, 2, 8);
  const cur = { x: lerp(L.W * 0.95, card.x + card.w * 0.6, ease.inOut(prog(t, a, te))), y: lerp(L.H * 0.9, card.y + card.h * 0.55, ease.inOut(prog(t, a, te))) };
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.03 * E(t, a, 3)} ox={L.c.x} oy={L.c.y} x={shake(t, [ti], 10).x} y={shake(t, [ti], 10).y}>
        <Thread a={brain} b={cardP} t={t} draw={E(t, a, 0.5)} tension={prog(t, a, ti)} snap={snap} />
        <Head {...hd} draw={1} glow={snap > 0 ? C.coral : undefined} glowAmt={snap > 0 ? 1 - snap * 0.5 : 0}>
          {ws.map((w) => <MiniWin key={w.i} x={w.x} y={w.y} w={w.w} h={w.h} kind={w.kind} rot={w.rot} dot={w.dot} desat={snap * 0.6} />)}
        </Head>
        <Win r={card} kind="notes" t={t} seed="tarea" glow={found > 0 && snap === 0 ? C.green : C.amber} glowAmt={0.6 + 0.4 * found * (1 - snap)} desat={snap * 0.7} opacity={E(t, a, 0.4)} />
        <Cursor x={cur.x} y={cur.y} s={L.u * 1.15} click={t >= te && t < te + 0.7 ? (t - te) / 0.7 : -1} color={C.green} opacity={1 - E(t, ti, 0.4)} />
        {q > 0 && (
          <div
            style={{
              position: "absolute", left: brain.x + 40, top: brain.y - hd.h * 0.42, width: 110, height: 110, borderRadius: 99, background: C.coral,
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "InterX", fontWeight: 800, fontSize: 76, color: "#0A0C12",
              transform: `scale(${Math.min(1.1, q)}) rotate(${(1 - Math.min(1, q)) * -25}deg)`, boxShadow: `0 0 40px ${C.coral}`,
            }}
          >
            ?
          </div>
        )}
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 4 · «Cada búsqueda es una pequeña decisión. Y cien pequeñas decisiones te vacían la cabeza.» ─────────
export const S04: React.FC<P> = ({ t, L }) => {
  const a = ESC.t04.a;
  const hd = HEAD.carga(L);
  const first = [at("t04", "busqueda"), at("t04", "pequena"), at("t04", "decision")];
  const tc = at("t04", "cien");
  const tv = at("t04", "vacian");
  const end = ESC.t04.b;
  const N = 48;
  const chipT = (i: number) => (i < 3 ? first[i] : tc + (i - 3) * ((tv + 0.2 - tc) / (N - 3)));
  const fallen = Array.from({ length: N }).filter((_, i) => t > chipT(i) + 0.3).length;
  const v = Math.max(0.04, 1 - fallen * 0.0205 - (t > tv ? 0.2 : 0));
  const drained = E(t, tv, 0.5);
  const meter = L.vertical ? { x: 955, y: 700, w: 64, h: 300 } : { x: 1300, y: 410, w: 74, h: 330 };
  return (
    <AbsoluteFill>
      <Cam s={1.02 + 0.05 * E(t, a, end - a)} ox={hd.cx} oy={hd.cy} filter={drained > 0 ? `grayscale(${drained * 0.8}) brightness(${1 - drained * 0.35})` : undefined}>
        <Head {...hd} glow={C.coral} glowAmt={drained}>
          {Array.from({ length: N }).map((_, i) => {
            const t0 = chipT(i);
            if (t < t0) return null;
            const row = Math.floor(i / 8);
            const col = i % 8;
            const tx = BRAIN.x - 55 + col * 15 + (row % 2) * 7 + (rnd("cx" + i) - 0.5) * 4;
            const ty = BRAIN.y + BRAIN.ry * 0.85 - row * 15;
            const k = ease.in(clamp01((t - t0) / 0.35));
            const y = lerp(-30, ty, k);
            const bounce = t - t0 > 0.35 ? Math.sin((t - t0 - 0.35) * 30) * 3 * Math.exp(-(t - t0 - 0.35) * 10) : 0;
            const big = i < 3 ? 1.6 : 1;
            return (
              <div key={i} style={{ position: "absolute", left: tx - 6 * big, top: y - 6 * big + bounce, width: 12 * big, height: 12 * big, borderRadius: 3, background: i < 3 ? C.coral : i % 3 ? "#5B6478" : "#C04A4E", border: "0.8px solid rgba(255,255,255,0.3)", fontSize: 8 * big, color: "#0A0C12", fontFamily: "InterX", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i < 3 ? "?" : ""}
              </div>
            );
          })}
        </Head>
        <Meter {...meter} v={v} t={t} opacity={E(t, a, 0.4)} />
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 5 · «¿Y si tu mano supiera llegar sola?» ─────────
export const S05: React.FC<P> = ({ t, L }) => {
  const a = ESC.t05.a;
  const ts = at("t05", "sola");
  const c = L.vertical ? { cx: 540, cy: 720, h: 540 } : { cx: 960, cy: 400, h: 500 };
  const app = E(t, a + 0.25, 0.9);
  const wave = t > ts ? (t - ts) / 1.0 : -1;
  const pulse = 0.6 + 0.4 * Math.sin(t * 5);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${c.cx}px ${c.cy}px, ${C.amber}${Math.round(18 + 30 * E(t, ts, 0.4)).toString(16)}, transparent ${L.vertical ? 42 : 36}%)`, opacity: app }} />
      {wave >= 0 && wave < 1 && (
        <div style={{ position: "absolute", left: c.cx - c.h * (0.5 + 1.6 * ease.out(wave)), top: c.cy - c.h * (0.5 + 1.6 * ease.out(wave)), width: c.h * (1 + 3.2 * ease.out(wave)), height: c.h * (1 + 3.2 * ease.out(wave)), borderRadius: 999, border: `${5 * (1 - wave) + 1}px solid ${C.amber}`, opacity: 1 - wave }} />
      )}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${0.85 + 0.15 * app}) translateY(${(1 - app) * 40}px)`, transformOrigin: `${c.cx}px ${c.cy}px`, opacity: app }}>
        <Mouse cx={c.cx} cy={c.cy} h={c.h} lit={t > ts ? 1 : pulse * app} />
      </div>
    </AbsoluteFill>
  );
};

// ───────── mapa de escritorios (escenas 6 y 7) ─────────
const roomGeom = (L: Layout) => (L.vertical ? { w: 640, h: 360, gap: 70, y: 700 } : { w: 520, h: 292, gap: 60, y: 400 });
const roomX = (L: Layout, i: number) => {
  const g = roomGeom(L);
  return L.W / 2 + (i - 1) * (g.w + g.gap);
};
const Rooms: React.FC<{ L: Layout; t: number; k: number[]; lit: number[]; line?: number }> = ({ L, t, k, lit, line = 0 }) => {
  const g = roomGeom(L);
  return (
    <>
      {line > 0 && (
        <svg style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "visible" }}>
          <line x1={roomX(L, 0)} y1={g.y} x2={roomX(L, 0) + (roomX(L, 2) - roomX(L, 0)) * line} y2={g.y} stroke={C.amber} strokeWidth={3} strokeDasharray="10 12" strokeDashoffset={-t * 40} opacity={0.6} />
        </svg>
      )}
      {[0, 1, 2].map((i) => (
        <Room key={i} x={roomX(L, i)} y={g.y} w={g.w} h={g.h} slots={SETS[i]} icon={ICONS[i]} lit={lit[i]} k={k[i]} opacity={k[i] > 0 ? 1 : 0} />
      ))}
    </>
  );
};

// ───────── 6 · «Tu cerebro recuerda lugares mejor que listas. Así que dale un mapa.» ─────────
export const S06: React.FC<P> = ({ t, L }) => {
  const a = ESC.t06.a;
  const tl = at("t06", "listas");
  const tm = at("t06", "mapa");
  const tas = at("t06", "asi");
  const rows = 8;
  const lw = L.vertical ? 620 : 560, lh = L.vertical ? 74 : 62;
  const listIn = E(t, a, 0.4);
  const fly = prog(t, tas - 0.1, tm + 0.3);
  const bad = win(t, tl - 0.05, tas, 0.1, 0.2);
  const g = roomGeom(L);
  const roomK = [0, 1, 2].map((i) => spr(t, tm - 0.25 + i * 0.12, 1.6, 7));
  return (
    <AbsoluteFill>
      <Rooms L={L} t={t} k={roomK} lit={[0, 0, 0]} line={E(t, tm + 0.2, 0.8)} />
      {Array.from({ length: rows }).map((_, i) => {
        const scroll = ((t - a) * 1.4 + i) % rows;
        const y0 = L.c.y - (rows * lh) / 2 + scroll * lh - (L.vertical ? 0 : 20);
        const x0 = L.W / 2 - lw / 2 + (bad > 0 ? Math.sin(t * 60 + i) * 6 * bad : 0);
        const room = i % 3;
        const tgt = { x: roomX(L, room) - g.w * 0.3 + (rnd("lx" + i) * g.w * 0.4), y: g.y - g.h * 0.2 + rnd("ly" + i) * g.h * 0.4 };
        const e = ease.inOut(clamp01((fly - i * 0.05) / 0.6));
        const kind = KINDS[i % KINDS.length];
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: lerp(x0, tgt.x - lw * 0.15, e), top: lerp(y0, tgt.y, e), width: lw * (1 - 0.7 * e), height: lh * 0.78 * (1 - 0.5 * e),
              borderRadius: 12, background: bad > 0 ? `rgba(255,90,95,${0.12 * bad})` : "rgba(255,255,255,0.05)", border: `1.5px solid ${bad > 0 ? C.coral : "rgba(255,255,255,0.12)"}`,
              opacity: listIn * (1 - clamp01((e - 0.8) / 0.2)), display: "flex", alignItems: "center", gap: 16, paddingLeft: 16,
            }}
          >
            <div style={{ width: lh * 0.4, height: lh * 0.4, borderRadius: 7, background: ACCENT[kind], opacity: 0.85 }} />
            <div style={{ width: `${45 + rnd("lw" + i) * 35}%`, height: lh * 0.14, borderRadius: 9, background: "rgba(243,241,234,0.35)" }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ───────── 7 · «Un escritorio para cada cosa. El pulgar avanza… el pulgar vuelve.» ─────────
export const S07: React.FC<P> = ({ t, L }) => {
  const lits = [at("t07", "escritorio"), at("t07", "cada"), at("t07", "cosa")];
  const tp = at("t07", "el");
  const tav = at("t07", "avanza");
  const tvu = at("t07", "vuelve");
  const g = roomGeom(L);
  const zoom = E(t, tp - 0.1, 0.5, ease.inOut);
  const toR1 = ease.inOut(prog(t, tav - 0.05, tav + 0.3));
  const back = ease.inOut(prog(t, tvu - 0.05, tvu + 0.3));
  const focusX = lerp(roomX(L, 0), roomX(L, 1), toR1 * (1 - back));
  const S = L.vertical ? 1.3 : 1.65;
  const s = 1 + (S - 1) * zoom;
  const cx = lerp(L.W / 2, focusX, zoom);
  const moving = (t > tav - 0.05 && t < tav + 0.3) || (t > tvu - 0.05 && t < tvu + 0.3);
  const cur = Math.round(toR1 * (1 - back));
  const lit = [0, 1, 2].map((i) => (t < tp ? (t > lits[i] - 0.05 ? 1 : 0) : i === cur ? 1 : 0));
  const mouse = L.vertical ? { cx: 900, cy: 1170, h: 230 } : { cx: 1770, cy: 790, h: 200 };
  const press = t > tav && t < tav + 0.3 ? "x2" : t > tvu && t < tvu + 0.3 ? "x1" : null;
  const arrow = (dir: 1 | -1, k: number) =>
    k > 0 && k < 1 ? (
      <svg viewBox="0 0 60 30" width={160} height={80} style={{ position: "absolute", left: L.W / 2 - 80 + dir * 40 * ease.out(k), top: g.y + g.h * 0.75 * (L.vertical ? 1 : 1) - 40, opacity: Math.sin(k * Math.PI) }}>
        <path d={dir > 0 ? "M5 15 H50 M38 4 L52 15 L38 26" : "M55 15 H10 M22 4 L8 15 L22 26"} stroke={C.amber} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${C.amber})` }} />
      </svg>
    ) : null;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${L.W / 2 - cx}px, 0)`, transformOrigin: `${cx}px ${g.y}px` }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${s})`, transformOrigin: `${cx}px ${g.y}px`, filter: moving ? "blur(4px)" : undefined }}>
          <Rooms L={L} t={t} k={[1, 1, 1]} lit={lit} line={1} />
        </div>
      </div>
      {arrow(1, prog(t, tav - 0.05, tav + 0.45))}
      {arrow(-1, prog(t, tvu - 0.05, tvu + 0.45))}
      <Mouse cx={mouse.cx} cy={mouse.cy} h={mouse.h} press={press} lit={E(t, tp - 0.2, 0.3)} opacity={E(t, tp - 0.3, 0.4)} />
    </AbsoluteFill>
  );
};

// ───────── 8 · «Pones el puntero sobre una zona, un toque de pulgar, y sus ventanas rotan. Sin clic.» ─────────
export const S08: React.FC<P> = ({ t, L }) => {
  const a = ESC.t08.a;
  const tz = at("t08", "zona");
  const tt = at("t08", "toque");
  const tr = at("t08", "rotan");
  const scr = screenOf(L.mon[0], L.u);
  const zone: Rect = { x: scr.x + 10, y: scr.y + 10, w: scr.w * 0.6 - 20, h: scr.h - 20 };
  const right: Rect = { x: scr.x + scr.w * 0.6 + 6, y: scr.y + 10, w: scr.w * 0.4 - 16, h: scr.h - 20 };
  const kinds: Kind[] = ["code", "browser", "notes"];
  const r = E(t, tr - 0.05, 0.45) + E(t, tr + 0.65, 0.45);
  const off = 34 * L.u;
  const slot = (idx: number): { r: Rect; o: number; d: number } => {
    if (idx <= 2) {
      const base = { x: zone.x + off * idx, y: zone.y - off * idx, w: zone.w - off * 2, h: zone.h - off * 2 };
      return { r: { ...base, y: base.y + off * 2 }, o: 1, d: idx };
    }
    const f = slot(0);
    return { r: { ...f.r, y: f.r.y + 80 * (idx - 2) }, o: 3 - idx, d: -1 };
  };
  const cards = kinds.map((k, j) => {
    const idx = (((j - r) % 3) + 3) % 3;
    const i0 = Math.floor(idx), f = idx - i0;
    const A = slot(i0), B = slot(i0 + 1 > 3 ? 3 : i0 + 1);
    const rr = idx > 2 ? lerpRect(slot(3).r, slot(2).r, 3 - idx) : lerpRect(A.r, B.r, f);
    const o = idx > 2 ? 1 - (idx - 2) * 0.0 : 1;
    return { k, j, idx, r: rr, o, z: idx > 2 ? 0 : 10 - Math.round(idx * 3) };
  });
  const enter = E(t, a, 0.45);
  const pointerIn = ease.inOut(prog(t, a + 0.2, tz + 0.1));
  const pos = { x: lerp(L.W * 0.95, zone.x + zone.w * 0.45, pointerIn), y: lerp(L.H * 0.95, zone.y + zone.h * 0.55, pointerIn) };
  const rotPulse = [tr - 0.05, tr + 0.65].map((x) => (t > x && t < x + 0.6 ? (t - x) / 0.6 : -1));
  const zoneLit = Math.max(...rotPulse.map((p) => (p >= 0 ? 1 - p : 0)));
  return (
    <AbsoluteFill>
      <Cam s={0.95 + 0.05 * enter} ox={L.c.x} oy={L.c.y} opacity={enter}>
        <Monitor L={L} i={0}>
          <div style={{ position: "absolute", left: zone.x - 6, top: zone.y - 6, width: zone.w + 12, height: zone.h + 12, borderRadius: 12, border: `3.5px dashed ${C.cyan}`, background: `${C.cyan}${zoneLit > 0 ? "22" : "0c"}`, boxShadow: zoneLit > 0 ? `0 0 ${40 * zoneLit}px ${C.cyan}88` : undefined, opacity: E(t, tz - 0.3, 0.3) }} />
          {[...cards].sort((x, y) => x.z - y.z).map((c) => (
            <Win key={c.k} r={c.r} kind={c.k} t={t} seed={"rot" + c.j} opacity={c.o} desat={c.idx > 0.5 && c.idx <= 2 ? 0.2 * c.idx / 2 : 0} glow={C.cyan} glowAmt={c.idx < 0.5 ? zoneLit * 0.8 : 0} />
          ))}
          <Win r={right} kind="terminal" t={t} seed="dcha" />
        </Monitor>
        <Monitor L={L} i={1} opacity={0.5}>
          {null}
        </Monitor>
        <Cursor x={pos.x} y={pos.y} s={L.u * 1.2} />
        {rotPulse.map((p, i) => (p >= 0 ? <div key={i} style={{ position: "absolute", left: pos.x - 40 * (1 + p), top: pos.y - 40 * (1 + p), width: 80 * (1 + p), height: 80 * (1 + p), borderRadius: 999, border: `3px solid ${C.cyan}`, opacity: 1 - p }} /> : null))}
      </Cam>
      <Keys x={L.vertical ? 540 : pos.x + 30} y={L.vertical ? 1250 : Math.min(760, zone.y + zone.h + 90)} keys={["Alt", "X2"]} size={L.vertical ? 52 : 50} k={E(t, tt - 0.1, 0.4)} />
    </AbsoluteFill>
  );
};

// ───────── 9 · «Y las pestañas cambian igual: sin apuntar a ninguna.» ─────────
export const S09: React.FC<P> = ({ t, L }) => {
  const a = ESC.t09.a;
  const steps = [at("t09", "cambian"), at("t09", "igual"), at("t09", "ninguna")];
  const tap = at("t09", "apuntar");
  const scr = screenOf(L.mon[0], L.u);
  const wr: Rect = { x: scr.x + 10, y: scr.y + 10, w: scr.w - 20, h: scr.h - 20 };
  const tabs = 5;
  const act = steps.filter((x) => t > x - 0.05).length;
  const actF = steps.reduce((s, x) => s + E(t, x - 0.05, 0.3), 0);
  const tabH = wr.h * 0.11, tabW = (wr.w - 20) / tabs - 6;
  const colors = ["#5AB0FF", "#FF7AB6", "#6EE7D8", "#FFB547", "#9B8CFF"];
  const enter = E(t, a, 0.35);
  const ptr = { x: wr.x + wr.w * 0.55, y: wr.y + wr.h * 0.62 };
  const no = win(t, tap - 0.1, tap + 0.9, 0.15, 0.3);
  return (
    <AbsoluteFill>
      <Cam s={0.96 + 0.04 * enter} ox={L.c.x} oy={L.c.y} opacity={enter}>
        <Monitor L={L} i={0}>
          <div style={{ position: "absolute", left: wr.x, top: wr.y, width: wr.w, height: wr.h, borderRadius: 10, background: "linear-gradient(180deg,#121724,#0E121C)", border: "1px solid rgba(255,255,255,0.09)", overflow: "hidden" }}>
            {Array.from({ length: tabs }).map((_, i) => {
              const on = i === act;
              return (
                <div key={i} style={{ position: "absolute", left: 10 + i * (tabW + 6), top: 8, width: tabW, height: tabH, borderRadius: "10px 10px 0 0", background: on ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.04)", borderBottom: on ? `3px solid ${C.cyan}` : "none", display: "flex", alignItems: "center", gap: 10, paddingLeft: 12 }}>
                  <div style={{ width: tabH * 0.36, height: tabH * 0.36, borderRadius: 4, background: colors[i] }} />
                  <div style={{ width: "50%", height: tabH * 0.14, borderRadius: 9, background: "rgba(243,241,234,0.35)" }} />
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 16, right: 16, top: tabH + 22, height: tabH * 0.6, borderRadius: 99, background: "rgba(255,255,255,0.07)" }} />
            <div
              style={{
                position: "absolute", left: 16, right: 16, top: tabH * 1.9 + 30, bottom: 16, borderRadius: 12,
                background: `linear-gradient(135deg, ${colors[Math.min(act, tabs - 1)]}55, transparent 70%)`, transition: "none",
                opacity: 0.6 + 0.4 * (actF % 1 === 0 ? 1 : actF % 1),
              }}
            >
              {[0, 1, 2, 3].map((j) => <div key={j} style={{ position: "absolute", left: "6%", top: `${16 + j * 14}%`, width: `${60 - j * 10}%`, height: "5%", borderRadius: 9, background: "rgba(243,241,234,0.25)" }} />)}
            </div>
          </div>
          {no > 0 && (
            <svg style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "visible", opacity: no }}>
              <line x1={ptr.x} y1={ptr.y} x2={wr.x + 10 + 2 * (tabW + 6)} y2={wr.y + 8 + tabH} stroke={C.coral} strokeWidth={3} strokeDasharray="8 10" />
              <g transform={`translate(${(ptr.x + wr.x + 10 + 2 * (tabW + 6)) / 2} ${(ptr.y + wr.y + 8 + tabH) / 2})`}>
                <circle r={26} fill="#0A0C12" stroke={C.coral} strokeWidth={3} />
                <path d="M -11 -11 L 11 11 M 11 -11 L -11 11" stroke={C.coral} strokeWidth={4} strokeLinecap="round" />
              </g>
            </svg>
          )}
        </Monitor>
        <Monitor L={L} i={1} opacity={0.5}>
          {null}
        </Monitor>
        <Cursor x={ptr.x} y={ptr.y} s={L.u * 1.2} />
        {steps.map((x, i) => (t > x - 0.05 && t < x + 0.55 ? <div key={i} style={{ position: "absolute", left: ptr.x - 40 * (1 + (t - x) / 0.6), top: ptr.y - 40 * (1 + (t - x) / 0.6), width: 80 * (1 + (t - x) / 0.6), height: 80 * (1 + (t - x) / 0.6), borderRadius: 999, border: `3px solid ${C.cyan}`, opacity: 1 - (t - x) / 0.6 }} /> : null))}
      </Cam>
      <Keys x={L.vertical ? 540 : ptr.x + 40} y={L.vertical ? 1250 : Math.min(770, wr.y + wr.h + 95)} keys={["Shift", "X2"]} size={L.vertical ? 52 : 50} k={E(t, at("t09", "pestanas") - 0.1, 0.4)} />
    </AbsoluteFill>
  );
};

// ───────── 10 · «Dejas de pensar dónde está todo. Y empiezas a pensar en lo que haces.» ─────────
const miniRooms = (L: Layout) =>
  L.vertical ? [0, 1, 2].map((i) => ({ x: 200 + i * 340, y: 300, w: 300, h: 170 })) : [0, 1, 2].map((i) => ({ x: 1480, y: 200 + i * 240, w: 330, h: 186 }));
export const S10: React.FC<P> = ({ t, L }) => {
  const a = ESC.t10.a;
  const td = at("t10", "donde");
  const th = at("t10", "haces");
  const tl = at("t10", "lo");
  const hd = HEAD.calma(L);
  const ws = headWins(22);
  const rooms = miniRooms(L);
  const out = (i: number) => ease.inOut(clamp01((t - td + 0.1 - i * 0.03) / 0.7));
  const task = spr(t, tl - 0.1, 1.8, 7);
  const enter = E(t, a, 0.4);
  return (
    <AbsoluteFill>
      {rooms.map((r, i) => <Room key={i} x={r.x} y={r.y} w={r.w} h={r.h} slots={SETS[i]} icon={ICONS[i]} lit={E(t, td + 0.4 + i * 0.1, 0.4) * 0.6} k={spr(t, td - 0.2 + i * 0.08, 1.6, 7)} opacity={clamp01(spr(t, td - 0.2 + i * 0.08, 1.6, 7) * 3)} />)}
      <Head {...hd} opacity={enter} glow={C.green} glowAmt={E(t, th - 0.2, 0.6)}>
        {ws.map((w) => {
          const k = out(w.i);
          if (k >= 1) return null;
          return <MiniWin key={w.i} x={w.x} y={w.y} w={w.w} h={w.h} kind={w.kind} rot={w.rot} dot={w.dot} opacity={1 - k} scale={1 - 0.5 * k} />;
        })}
        {task > 0 && <MiniWin x={BRAIN.x} y={BRAIN.y} w={88} h={60} kind="notes" scale={Math.min(1.05, task)} glow={C.green} glowAmt={1} />}
      </Head>
      {ws.map((w) => {
        const k = out(w.i);
        if (k <= 0 || k >= 1) return null;
        const p0 = toPx(hd, { x: w.x, y: w.y });
        const r = rooms[w.i % 3];
        const p1 = { x: r.x + (rnd("rx" + w.i) - 0.5) * r.w * 0.6, y: r.y + (rnd("ry" + w.i) - 0.5) * r.h * 0.5 };
        const s = hd.h / 240;
        return <MiniWin key={"f" + w.i} x={lerp(p0.x, p1.x, k)} y={lerp(p0.y, p1.y, k) - Math.sin(k * Math.PI) * 80} w={w.w * s * (1 - 0.5 * k)} h={w.h * s * (1 - 0.5 * k)} kind={w.kind} rot={w.rot * (1 - k)} opacity={1 - clamp01((k - 0.8) / 0.2)} />;
      })}
    </AbsoluteFill>
  );
};

// ───────── 11 · «Eso es entrar en flujo.» ─────────
const Flow: React.FC<{ L: Layout; t: number; k: number }> = ({ L, t, k }) => {
  if (k <= 0) return null;
  const lines = 9;
  const cy = HEAD.calma(L).cy;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: L.W, height: L.H }}>
      <defs>
        <linearGradient id="flowG" x1="0" x2="1">
          <stop offset="0%" stopColor={C.amber} stopOpacity={0} />
          <stop offset="30%" stopColor={C.amber} />
          <stop offset="70%" stopColor={C.green} />
          <stop offset="100%" stopColor={C.green} stopOpacity={0} />
        </linearGradient>
      </defs>
      {Array.from({ length: lines }).map((_, i) => {
        const y0 = cy + (i - (lines - 1) / 2) * (L.vertical ? 34 : 26);
        const amp = 18 + i * 3;
        const pts = Array.from({ length: 41 }).map((__, j) => {
          const x = (j / 40) * L.W;
          const y = y0 + Math.sin(j * 0.32 - t * 2.2 + i * 0.6) * amp * Math.sin((j / 40) * Math.PI);
          return `${j ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`;
        });
        return <path key={i} d={pts.join(" ")} fill="none" stroke="url(#flowG)" strokeWidth={2.5} opacity={0.55 * k} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(k * 1.2 - i * 0.03)} />;
      })}
    </svg>
  );
};
export const S11: React.FC<P> = ({ t, L }) => {
  const tf = at("t11", "flujo");
  const hd = HEAD.calma(L);
  const fk = E(t, tf - 0.3, 1.0, ease.inOut);
  const meter = L.vertical ? { x: 955, y: 760, w: 64, h: 300 } : { x: 1250, y: 420, w: 74, h: 330 };
  const rooms = miniRooms(L);
  return (
    <AbsoluteFill>
      {rooms.map((r, i) => <Room key={i} x={r.x} y={r.y} w={r.w} h={r.h} slots={SETS[i]} icon={ICONS[i]} lit={0.6} k={1} opacity={1 - E(t, ESC.t11.a, 0.5)} />)}
      <Flow L={L} t={t} k={fk} />
      <Head {...hd} glow={C.green} glowAmt={0.6 + 0.4 * fk} stroke={fk > 0.5 ? "#BFFFD9" : C.ink} fill="rgba(0,230,118,0.10)">
        <MiniWin x={BRAIN.x} y={BRAIN.y} w={88} h={60} kind="notes" glow={C.green} glowAmt={1} />
      </Head>
      <Meter {...meter} v={0.18 + 0.82 * E(t, tf - 0.2, 1.2)} t={t} opacity={E(t, ESC.t11.a + 0.2, 0.4)} />
    </AbsoluteFill>
  );
};

// ───────── 12 · «Ahora tu cabeza tiene una sola ventana abierta: la que importa.» ─────────
export const S12: React.FC<P> = ({ t, L }) => {
  const a = ESC.t12.a;
  const hd = HEAD.calma(L);
  const tv = at("t12", "ventana");
  const last = atEnd("t12", "importa");
  const fin = E(t, last + 0.25, 1.0, ease.inOut);
  const big = E(t, tv - 0.2, 0.7, ease.inOut);
  const meter = L.vertical ? { x: 955, y: 760, w: 64, h: 300 } : { x: 1250, y: 420, w: 74, h: 330 };
  return (
    <AbsoluteFill style={{ opacity: 1 - E(t, toma("t12").fin + 1.6, 0.6) * 0 }}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - 0.72 * fin, filter: fin > 0 ? `blur(${fin * 7}px)` : undefined }}>
        <Flow L={L} t={t} k={1 - 0.5 * E(t, a, 1)} />
        <Head {...hd} glow={C.green} glowAmt={1} stroke="#BFFFD9" fill="rgba(0,230,118,0.10)">
          <MiniWin x={BRAIN.x} y={BRAIN.y} w={88 + 30 * big} h={60 + 20 * big} kind="notes" glow={C.green} glowAmt={1} />
        </Head>
        <Meter {...meter} v={1} t={t} opacity={1 - E(t, a, 0.6)} />
      </div>
    </AbsoluteFill>
  );
};
export { Dust, place };
