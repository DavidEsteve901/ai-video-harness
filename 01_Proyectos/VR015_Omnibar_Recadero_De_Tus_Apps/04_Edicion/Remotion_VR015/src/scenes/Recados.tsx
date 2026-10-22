import React from "react";
import { AbsoluteFill } from "remotion";
import { at, atEnd, C, clamp01, E, ease, ESC, lerp, prog, rnd, spr, win } from "../theme";
import { Layout, Rect } from "../layout";
import { Kind } from "../windows";
import { Cam } from "../components/Desk";
import { Cursor, Dust, shake } from "../components/Bits";
import { App, AppIcon, APPS } from "../components/Omnibar";
import { AppWin, Frame, IdeaBubble, KeyCap, Key, Parcel, Pt, sample, Spark, track, Trail } from "../components/Extra";
import { Omnibar } from "../components/Omnibar";

type P = { t: number; L: Layout };

// ───────── ventanas sueltas del gancho (y del cierre) ─────────
type Loose = { r: Rect; kind: Kind; app: App };
const LOOSE = (L: Layout): Loose[] =>
  L.vertical
    ? [
        { r: { x: 80, y: 240, w: 430, h: 300 }, kind: "browser", app: APPS.chrome },
        { r: { x: 580, y: 190, w: 420, h: 310 }, kind: "notes", app: APPS.notion },
        { r: { x: 600, y: 600, w: 400, h: 290 }, kind: "reader", app: APPS.word },
        { r: { x: 70, y: 640, w: 450, h: 310 }, kind: "code", app: APPS.code },
        { r: { x: 110, y: 1010, w: 390, h: 260 }, kind: "music", app: APPS.spotify },
        { r: { x: 590, y: 980, w: 410, h: 290 }, kind: "design", app: APPS.figma },
      ]
    : [
        { r: { x: 170, y: 80, w: 470, h: 310 }, kind: "browser", app: APPS.chrome },
        { r: { x: 735, y: 50, w: 430, h: 290 }, kind: "notes", app: APPS.notion },
        { r: { x: 1290, y: 100, w: 460, h: 300 }, kind: "reader", app: APPS.word },
        { r: { x: 200, y: 470, w: 450, h: 310 }, kind: "code", app: APPS.code },
        { r: { x: 760, y: 450, w: 410, h: 280 }, kind: "music", app: APPS.spotify },
        { r: { x: 1290, y: 480, w: 460, h: 300 }, kind: "design", app: APPS.figma },
      ];
const bob = (i: number, t: number) => Math.sin(t * 1.3 + i * 1.7) * 6;
const looseRect = (L: Layout, i: number, t: number): Rect => {
  const r = LOOSE(L)[i].r;
  return { ...r, y: r.y + bob(i, t) };
};
/** saltos del recadero: cada vez más deprisa */
const HOP_T = [0.3, 0.74, 1.13, 1.47, 1.77, 2.04, 2.29, 2.52, 2.74, 2.95, 3.15, 3.35, 3.55, 3.75, 3.95, 4.15];
const HOP_W = [0, 1, 3, 2, 4, 5, 1, 0, 2, 3, 5, 4, 1, 2, 0, 3];
const spot = (L: Layout, k: number, t: number): Pt => {
  const r = looseRect(L, HOP_W[k], t);
  return { x: r.x + r.w * (0.25 + rnd("hx" + k) * 0.5), y: r.y + r.h * (0.3 + rnd("hy" + k) * 0.45) };
};
const courier = (L: Layout, t: number): Pt => {
  if (t <= HOP_T[0]) return spot(L, 0, t);
  for (let k = 0; k < HOP_T.length - 1; k++) {
    if (t < HOP_T[k + 1]) {
      const a = spot(L, k, t), b = spot(L, k + 1, t);
      const e = ease.inOut(prog(t, HOP_T[k], HOP_T[k + 1]));
      const bend = (k % 2 ? 0.42 : -0.42) * (0.7 + rnd("hb" + k) * 0.6);
      const mx = (a.x + b.x) / 2 - (b.y - a.y) * bend, my = (a.y + b.y) / 2 + (b.x - a.x) * bend;
      return { x: (1 - e) ** 2 * a.x + 2 * (1 - e) * e * mx + e * e * b.x, y: (1 - e) ** 2 * a.y + 2 * (1 - e) * e * my + e * e * b.y };
    }
  }
  return spot(L, HOP_T.length - 1, t);
};
const HOP_END = HOP_T[HOP_T.length - 1];

/** las ventanas sueltas, con destello coral cuando llega el recadero */
const LooseWins: React.FC<{ L: Layout; t: number; k?: (i: number) => number; dim?: number; flash?: boolean }> = ({ L, t, k, dim = 0, flash = true }) => (
  <>
    {LOOSE(L).map((w, i) => {
      const kk = k ? k(i) : 1;
      let hit = 0;
      if (flash) HOP_T.forEach((h, j) => (HOP_W[j] === i ? (hit = Math.max(hit, win(t, h - 0.03, h + 0.28, 0.04, 0.22))) : null));
      return <AppWin key={i} r={looseRect(L, i, t)} kind={w.kind} app={w.app} t={t} seed={"l" + i} opacity={clamp01(kk * 3)} scale={0.7 + 0.3 * Math.min(1.04, kk)} glow={C.coral} glowAmt={hit} dim={dim} rotate={(rnd("lr" + i) - 0.5) * 5} />;
    })}
  </>
);

// ───────── 1 · «Llevas años haciendo de recadero de tus apps.» ─────────
export const S01: React.FC<P> = ({ t, L }) => {
  const tr = at("t01", "recadero");
  const c = courier(L, t);
  const pts = sample((x) => courier(L, x), HOP_T[0], Math.min(t, HOP_END), 1 / 45);
  const sh = shake(t, [tr + 0.02], 11);
  const hot = win(t, tr - 0.05, tr + 0.7, 0.08, 0.4);
  const run = t > HOP_T[0] && t < HOP_END;
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.06 * E(t, 0, 4.7, ease.inOut)} ox={L.c.x} oy={L.c.y} x={sh.x} y={sh.y}>
        <LooseWins L={L} t={t} k={(i) => spr(t, -0.12 + i * 0.035, 1.8, 7)} />
        <Trail pts={pts} width={5 + 2 * hot} opacity={0.9} />
        <Cursor x={c.x} y={c.y} s={L.u * 1.35} color={C.coral} click={HOP_T.some((h) => t > h && t < h + 0.25) ? (t - Math.max(...HOP_T.filter((h) => t > h))) / 0.6 : -1} />
        <Parcel x={c.x + 26 * L.u} y={c.y + 40 * L.u} s={L.u * 1.15} rot={run ? Math.sin(t * 18) * 8 : 0} />
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 2 · «Copias de aquí. Pegas allí. Buscas en otra pestaña. Abres, colocas, vuelves.» ─────────
const PANT = (L: Layout): Rect => (L.vertical ? { x: 40, y: 250, w: 1000, h: 800 } : { x: 300, y: 36, w: 1320, h: 744 });
export const S02: React.FC<P> = ({ t, L }) => {
  const a = ESC.t02.a;
  const R = PANT(L);
  const O = { x: R.x + 12, y: R.y + 12 }, iw = R.w - 24, ih = R.h - 24;
  const BR: Rect = { x: O.x + 14, y: O.y + 14, w: iw * 0.56 - 21, h: ih - 28 };
  const NT: Rect = { x: O.x + iw * 0.56 + 7, y: O.y + 14, w: iw * 0.44 - 21, h: ih - 28 };
  const tC = at("t02", "copias"), tP = at("t02", "pegas"), tB = at("t02", "buscas"), tA = at("t02", "abres"), tCo = at("t02", "colocas"), tV = at("t02", "vuelves");
  const barH = Math.min(24, BR.h * 0.075);
  const body = { y: BR.y + barH, h: BR.h - barH };
  const tabY = body.y + body.h * 0.03, tabH = body.h * 0.07;
  const tabX = (i: number) => BR.x + BR.w * (0.03 + i * 0.21);
  const tabIdx = t < tB + 0.08 ? 0 : t < tB + 0.33 ? 1 : t < tB + 0.58 ? 2 : 1;
  const sel = { x: BR.x + BR.w * 0.08, y: body.y + body.h * 0.335, w: BR.w * 0.42, h: body.h * 0.055 };
  const grid = { x: O.x + iw * 0.5, y: O.y + ih * 0.5 };
  const gs = L.vertical ? 76 : 66, gg = L.vertical ? 22 : 20;
  const gridApps = [APPS.chrome, APPS.notion, APPS.spotify, APPS.code, APPS.figma, APPS.excel, APPS.word, APPS.obsidian, APPS.chrome];
  const gridK = spr(t, tA - 0.1, 1.9, 8) * (1 - E(t, tA + 0.42, 0.14));
  const gridPt = (i: number) => ({ x: grid.x + ((i % 3) - 1) * (gs + gg), y: grid.y + (Math.floor(i / 3) - 1) * (gs + gg) });
  // ventana nueva: aparece suelta y se arrastra a su sitio con temblor
  const nw0: Rect = { x: O.x + iw * 0.12, y: O.y + ih * 0.28, w: iw * 0.42, h: ih * 0.36 };
  const nw1: Rect = { x: NT.x, y: O.y + ih * 0.52, w: NT.w, h: ih * 0.48 - 14 };
  const drag = ease.inOut(prog(t, tCo + 0.04, tCo + 0.38));
  const wob = drag > 0 && drag < 1 ? Math.sin(t * 40) * 9 : 0;
  const nwK = spr(t, tA + 0.4, 1.9, 8);
  const nw: Rect = { x: lerp(nw0.x, nw1.x, drag) + wob, y: lerp(nw0.y, nw1.y, drag) + wob * 0.5, w: lerp(nw0.w, nw1.w, drag), h: lerp(nw0.h, nw1.h, drag) };
  // cursor
  const pSel0 = { x: sel.x + 6, y: sel.y + sel.h * 0.6 }, pSel1 = { x: sel.x + sel.w, y: sel.y + sel.h * 0.6 };
  const pPaste = { x: NT.x + NT.w * 0.22, y: NT.y + NT.h * 0.55 };
  const keys: Key[] = [
    { t: a, p: { x: pSel0.x + 60, y: pSel0.y + 120 } },
    { t: tC - 0.08, p: pSel0 },
    { t: tC + 0.3, p: pSel1 },
    { t: tP - 0.18, p: pSel1 },
    { t: tP + 0.05, p: pPaste, bend: -0.3 },
    { t: tB - 0.05, p: pPaste },
    { t: tB + 0.06, p: { x: tabX(1) + BR.w * 0.09, y: tabY + tabH * 0.6 }, bend: 0.25 },
    { t: tB + 0.3, p: { x: tabX(2) + BR.w * 0.09, y: tabY + tabH * 0.6 } },
    { t: tB + 0.55, p: { x: tabX(1) + BR.w * 0.09, y: tabY + tabH * 0.6 } },
    { t: tA - 0.05, p: { x: tabX(1) + BR.w * 0.09, y: tabY + tabH * 0.6 } },
    { t: tA + 0.25, p: gridPt(4), bend: 0.2 },
    { t: tA + 0.42, p: gridPt(4) },
    { t: tCo + 0.04, p: { x: nw0.x + nw0.w * 0.4, y: nw0.y + 12 } },
    { t: tCo + 0.38, p: { x: nw1.x + nw1.w * 0.4, y: nw1.y + 12 } },
    { t: tV - 0.02, p: { x: nw1.x + nw1.w * 0.4, y: nw1.y + 12 } },
    { t: tV + 0.28, p: { x: BR.x + BR.w * 0.45, y: BR.y + BR.h * 0.62 }, bend: 0.35 },
  ];
  const cur = track(keys, t);
  const pts = sample((x) => track(keys, x), tC - 0.08, Math.max(tC - 0.08, t), 1 / 50);
  const clicks = [tB + 0.06, tB + 0.3, tB + 0.55, tA + 0.25, tCo + 0.02];
  const lastClick = Math.max(-9, ...clicks.filter((c) => t >= c));
  const selK = E(t, tC - 0.05, 0.32);
  const ks = L.vertical ? 46 : 42;
  const carrying = t > tC + 0.25 && t < tP + 0.12;
  const flipFlash = Math.max(...[tB + 0.08, tB + 0.33, tB + 0.58].map((x) => win(t, x - 0.02, x + 0.12, 0.02, 0.1)));
  const sh = shake(t, [tV + 0.28], 7);
  return (
    <AbsoluteFill>
      <Cam s={1.02 + 0.04 * E(t, a, 4)} ox={L.c.x} oy={L.c.y} opacity={E(t, a, 0.25)} x={sh.x} y={sh.y}>
        <Frame r={R} edge={0.35 + 0.65 * E(t, tV, 0.3)} edgeCol={C.coral} />
        <AppWin r={BR} kind="browser" app={APPS.chrome} t={t} seed={"tab" + tabIdx} glow={C.coral} glowAmt={0.6 * flipFlash}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: tabX(i), top: tabY, width: BR.w * 0.19, height: tabH, borderRadius: 6, background: i === tabIdx ? "rgba(255,90,95,0.28)" : "rgba(255,255,255,0.06)", border: i === tabIdx ? `2px solid ${C.coral}` : "2px solid transparent" }} />
          ))}
          {selK > 0 && <div style={{ position: "absolute", left: sel.x, top: sel.y, width: sel.w * selK, height: sel.h, borderRadius: 4, background: "rgba(79,209,255,0.35)", border: `2px solid ${C.cyan}` }} />}
        </AppWin>
        <AppWin r={NT} kind="notes" app={APPS.notion} t={t} seed="nt" glow={C.coral} glowAmt={win(t, tP, tP + 0.5, 0.05, 0.3)}>
          {t > tP + 0.04 && <div style={{ position: "absolute", left: NT.x + NT.w * 0.07, top: NT.y + NT.h * 0.53, width: NT.w * 0.62 * E(t, tP + 0.04, 0.2), height: NT.h * 0.03, borderRadius: 9, background: C.coral, boxShadow: `0 0 14px ${C.coral}` }} />}
        </AppWin>
        {nwK > 0 && <AppWin r={nw} kind="design" app={APPS.figma} t={t} seed="nw" opacity={clamp01(nwK * 3)} scale={0.6 + 0.4 * Math.min(1.04, nwK)} rotate={drag < 1 ? (1 - drag) * -4 : 0} glow={C.coral} glowAmt={drag > 0 && drag < 1 ? 0.8 : 0} />}
        {gridK > 0 && (
          <div style={{ position: "absolute", left: grid.x - (1.5 * gs + gg + 26), top: grid.y - (1.5 * gs + gg + 26), width: 3 * gs + 2 * gg + 52, height: 3 * gs + 2 * gg + 52, borderRadius: 22, background: "rgba(18,22,32,0.96)", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 30px 70px rgba(0,0,0,0.6)", transform: `scale(${0.7 + 0.3 * Math.min(1.04, gridK)})`, opacity: clamp01(gridK * 3), zIndex: 30 }}>
            {gridApps.map((ap, i) => (
              <AppIcon key={i} app={ap} size={gs} radius={gs * 0.24} style={{ position: "absolute", left: 26 + (i % 3) * (gs + gg), top: 26 + Math.floor(i / 3) * (gs + gg), boxShadow: i === 4 && t > tA + 0.25 ? `0 0 0 4px ${C.coral}` : undefined }} />
            ))}
          </div>
        )}
        <KeyCap x={BR.x + BR.w * 0.5} y={BR.y + BR.h * 0.2} label="Ctrl + C" size={ks} k={spr(t, tC - 0.02, 1.9, 8)} opacity={1 - E(t, tP - 0.12, 0.15)} color={C.coral} press={win(t, tC + 0.02, tC + 0.25, 0.04, 0.15)} />
        <KeyCap x={NT.x + NT.w * 0.5} y={NT.y + NT.h * 0.2} label="Ctrl + V" size={ks} k={spr(t, tP - 0.02, 1.9, 8)} opacity={1 - E(t, tB - 0.12, 0.15)} color={C.coral} press={win(t, tP + 0.02, tP + 0.25, 0.04, 0.15)} />
        <Trail pts={pts} width={4} opacity={0.85} />
        <Cursor x={cur.x} y={cur.y} s={L.u * 1.3} color={C.coral} click={lastClick > 0 && t - lastClick < 0.6 ? (t - lastClick) / 0.6 : -1} />
        <Parcel x={cur.x + 26 * L.u} y={cur.y + 38 * L.u} s={L.u} opacity={carrying ? 1 : 0} rot={Math.sin(t * 18) * 8} />
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 3 · «Y en cada viaje se te escapa un poco de lo que estabas pensando.» ─────────
const IDEA = (L: Layout) =>
  L.vertical
    ? {
        task: { x: 255, y: 690, w: 570, h: 520 } as Rect,
        bub: { x: 540, y: 410, r: 200 },
        side: [
          { r: { x: 50, y: 200, w: 270, h: 200 }, kind: "browser" as Kind, app: APPS.chrome },
          { r: { x: 760, y: 200, w: 270, h: 200 }, kind: "reader" as Kind, app: APPS.word },
          { r: { x: 45, y: 860, w: 190, h: 280 }, kind: "music" as Kind, app: APPS.spotify },
          { r: { x: 845, y: 860, w: 190, h: 280 }, kind: "design" as Kind, app: APPS.figma },
        ],
      }
    : {
        task: { x: 660, y: 390, w: 600, h: 410 } as Rect,
        bub: { x: 960, y: 190, r: 150 },
        side: [
          { r: { x: 110, y: 110, w: 400, h: 260 }, kind: "browser" as Kind, app: APPS.chrome },
          { r: { x: 1410, y: 110, w: 400, h: 260 }, kind: "reader" as Kind, app: APPS.word },
          { r: { x: 140, y: 510, w: 370, h: 250 }, kind: "music" as Kind, app: APPS.spotify },
          { r: { x: 1410, y: 510, w: 370, h: 250 }, kind: "design" as Kind, app: APPS.figma },
        ],
      };
const tripsOf = () => {
  const te = at("t03", "escapa");
  return [
    { out: at("t03", "cada") - 0.05, w: 0 },
    { out: at("t03", "se") + 0.1, w: 1 },
    { out: te - 0.08, w: 3 },
    { out: at("t03", "de") + 0.05, w: 2 },
    { out: at("t03", "estabas") - 0.05, w: 1 },
  ];
};
export const S03: React.FC<P> = ({ t, L }) => {
  const a = ESC.t03.a;
  const G = IDEA(L);
  const trips = tripsOf();
  const home = { x: G.task.x + G.task.w * 0.5, y: G.task.y + G.task.h * 0.55 };
  const sidePt = (i: number) => ({ x: G.side[i].r.x + G.side[i].r.w * 0.5, y: G.side[i].r.y + G.side[i].r.h * 0.55 });
  const keys: Key[] = [{ t: a, p: home }];
  trips.forEach((tr, i) => {
    keys.push({ t: tr.out, p: home });
    keys.push({ t: tr.out + 0.3, p: sidePt(tr.w), bend: i % 2 ? 0.2 : -0.2 });
    keys.push({ t: tr.out + 0.42, p: sidePt(tr.w) });
    keys.push({ t: tr.out + 0.72, p: home, bend: i % 2 ? 0.2 : -0.2 });
  });
  const cur = track(keys, t);
  const health = 1 - trips.reduce((s, tr) => s + 0.2 * E(t, tr.out + 0.05, 0.55), 0);
  const tEnd = atEnd("t03", "pensando");
  const fade = E(t, tEnd + 0.15, 0.7);
  const te = at("t03", "escapa");
  const sh = shake(t, [te + 0.05], 8);
  const bubTail = { x: G.task.x + G.task.w * 0.5, y: G.task.y };
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.05 * E(t, a, 6)} ox={G.bub.x} oy={G.bub.y + 200} opacity={E(t, a, 0.35) * (1 - fade)} x={sh.x} y={sh.y}>
        {G.side.map((s, i) => {
          const hit = Math.max(...trips.map((tr) => (tr.w === i ? win(t, tr.out + 0.28, tr.out + 0.6, 0.04, 0.2) : 0)));
          return <AppWin key={i} r={s.r} kind={s.kind} app={s.app} t={t} seed={"s3" + i} opacity={E(t, a + 0.05 * i, 0.4)} glow={C.coral} glowAmt={hit} dim={0.25} />;
        })}
        <AppWin r={G.task} kind="notes" app={APPS.notion} t={t} seed="tarea" glow={C.amber} glowAmt={0.6 * health} />
        <IdeaBubble x={G.bub.x} y={G.bub.y} r={G.bub.r} health={health} k={spr(t, a + 0.1, 1.5, 7)} t={t} tail={bubTail} />
        {trips.map((tr, i) => (
          <React.Fragment key={i}>
            <Dust x={G.bub.x - G.bub.r * 0.7} y={G.bub.y - G.bub.r * 0.5} w={G.bub.r * 1.4} h={G.bub.r * 1.0} k={prog(t, tr.out + 0.02, tr.out + 0.9)} seed={"idea" + i} n={i === 2 ? 46 : 26} color={i < 2 ? C.amber : "#C9A86A"} dir="in" tx={sidePt(tr.w).x} ty={sidePt(tr.w).y} size={i === 2 ? 7 : 5} />
            <Dust x={G.bub.x - G.bub.r * 0.6} y={G.bub.y - G.bub.r * 0.3} w={G.bub.r * 1.2} h={G.bub.r * 0.6} k={prog(t, tr.out, tr.out + 0.8)} seed={"puf" + i} n={14} color={C.coral} size={4} />
          </React.Fragment>
        ))}
        <Cursor x={cur.x} y={cur.y} s={L.u * 1.25} color={C.coral} />
        <Parcel x={cur.x + 24 * L.u} y={cur.y + 36 * L.u} s={L.u * 0.95} rot={Math.sin(t * 16) * 6} />
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 4 · «¿Y si, en vez de ir tú a todo… todo viniera a ti?» ─────────
const RING_APPS = [APPS.chrome, APPS.notion, APPS.spotify, APPS.code, APPS.figma, APPS.excel, APPS.word, APPS.obsidian];
const RING = (L: Layout) => (L.vertical ? { R: 400, r: 235, icon: 120 } : { R: 335, r: 205, icon: 104 });
export const S04: React.FC<P> = ({ t, L }) => {
  const a = ESC.t04.a;
  const G = RING(L);
  const c = L.c;
  const ten = at("t04", "en"), ttu = at("t04", "tu"), ttodo = at("t04", "todo"), ttodo2 = at("t04", "todo", 1), tvin = at("t04", "viniera"), tti = at("t04", "ti");
  const inK = E(t, a + 0.1, 0.6);
  const out = prog(t, ten - 0.05, ttodo + 0.35); // flechas hacia fuera
  const off = E(t, ttodo + 0.45, 0.4); // se apagan: silencio
  const come = spr(t, tvin - 0.05, 1.2, 6.5); // las apps vienen
  const bloom = E(t, tti - 0.05, 0.5);
  const youK = spr(t, ttu - 0.08, 2, 8);
  const light = E(t, tvin - 0.25, 0.6);
  const spin = (t - tvin) > 0 ? (t - tvin) * 9 : 0;
  const dim = 0.6 * (1 - E(t, tvin - 0.1, 0.5)) + 0.25 * off * (1 - come);
  return (
    <AbsoluteFill>
      {bloom > 0 && (
        <AbsoluteFill style={{ background: `conic-gradient(from ${t * 14}deg at ${c.x}px ${c.y}px, transparent 0deg, ${C.amber}24 12deg, transparent 26deg, transparent 52deg, ${C.amber}1C 64deg, transparent 76deg, transparent 112deg, ${C.amber}24 124deg, transparent 136deg, transparent 172deg, ${C.amber}1C 184deg, transparent 196deg, transparent 242deg, ${C.amber}24 254deg, transparent 266deg, transparent 302deg, ${C.amber}1C 314deg, transparent 326deg)`, opacity: bloom }} />
      )}
      <Cam s={0.96 + 0.06 * E(t, a, 5)} ox={c.x} oy={c.y} opacity={inK}>
        <svg style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "visible" }}>
          {RING_APPS.map((_, i) => {
            const an = ((-90 + i * 45) * Math.PI) / 180;
            const ex = c.x + Math.cos(an) * (G.R - G.icon * 0.62), ey = c.y + Math.sin(an) * (G.R - G.icon * 0.62);
            const sx = c.x + Math.cos(an) * 46, sy = c.y + Math.sin(an) * 46;
            const d = clamp01(out * 1.4 - i * 0.05);
            const o = (1 - off) * (d > 0 ? 1 : 0);
            const pk = ((t - ten) * 1.6 + i * 0.13) % 1;
            return (
              <g key={i} opacity={o}>
                <line x1={sx} y1={sy} x2={lerp(sx, ex, d)} y2={lerp(sy, ey, d)} stroke={C.coral} strokeWidth={4} strokeDasharray="10 12" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${C.coral})` }} />
                {d >= 1 && <circle cx={lerp(sx, ex, pk)} cy={lerp(sy, ey, pk)} r={7} fill="#FFD0D2" opacity={Math.sin(pk * Math.PI)} />}
              </g>
            );
          })}
          {come > 0 &&
            RING_APPS.map((_, i) => {
              const an = ((-90 + i * 45 + spin) * Math.PI) / 180;
              const rr = lerp(G.R, G.r, Math.min(1, come));
              const tip = rr - G.icon * 0.6 - 10;
              const o = win(t, tvin, tti + 0.6, 0.1, 0.5);
              return (
                <g key={"in" + i} opacity={o}>
                  <path d={`M ${c.x + Math.cos(an) * (tip + 30)} ${c.y + Math.sin(an) * (tip + 30)} L ${c.x + Math.cos(an) * tip} ${c.y + Math.sin(an) * tip}`} stroke={C.amber} strokeWidth={6} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${C.amber})` }} />
                  <path
                    d={`M ${c.x + Math.cos(an - 0.09) * (tip + 14)} ${c.y + Math.sin(an - 0.09) * (tip + 14)} L ${c.x + Math.cos(an) * tip} ${c.y + Math.sin(an) * tip} L ${c.x + Math.cos(an + 0.09) * (tip + 14)} ${c.y + Math.sin(an + 0.09) * (tip + 14)}`}
                    fill="none" stroke={C.amber} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"
                  />
                </g>
              );
            })}
        </svg>
        {/* tú: el punto que iba a todo */}
        {youK > 0 && light < 0.9 && <div style={{ position: "absolute", left: c.x - 30, top: c.y - 30, width: 60, height: 60, borderRadius: 99, background: C.coral, boxShadow: `0 0 40px ${C.coral}`, transform: `scale(${Math.min(1.1, youK) * (1 - light)})`, opacity: 1 - 0.4 * off }} />}
        {/* la luz a la que llega todo */}
        {light > 0 && (
          <>
            <div style={{ position: "absolute", left: c.x - 220, top: c.y - 220, width: 440, height: 440, borderRadius: 999, background: `radial-gradient(circle, ${C.amber}88 0%, ${C.amber}22 40%, transparent 70%)`, opacity: light * (0.8 + 0.2 * Math.sin(t * 5)), transform: `scale(${0.6 + 0.6 * bloom})` }} />
            <div style={{ position: "absolute", left: c.x - 42, top: c.y - 42, width: 84, height: 84, borderRadius: 99, background: "radial-gradient(circle, #FFF3D6, #FFB547 70%)", boxShadow: `0 0 ${60 + 60 * bloom}px ${C.amber}`, transform: `scale(${light * (1 + 0.25 * bloom)})` }} />
          </>
        )}
        {RING_APPS.map((ap, i) => {
          const an = ((-90 + i * 45 + spin) * Math.PI) / 180;
          const rr = lerp(G.R, G.r, Math.min(1.04, come));
          const k = spr(t, a + 0.15 + i * 0.05, 1.8, 7);
          const s = G.icon * (1 - 0.18 * Math.min(1, come));
          return (
            <div key={i} style={{ position: "absolute", left: c.x + Math.cos(an) * rr - s / 2, top: c.y + Math.sin(an) * rr - s / 2, opacity: clamp01(k * 3), transform: `scale(${Math.min(1.05, k)})`, filter: `grayscale(${dim * 1.2}) brightness(${1 - dim})`, boxShadow: come > 0.3 ? `0 0 ${30 * bloom}px ${C.amber}88` : undefined, borderRadius: s * 0.24 }}>
              <AppIcon app={ap} size={s} radius={s * 0.24} />
            </div>
          );
        })}
      </Cam>
      <AbsoluteFill style={{ background: "#000", opacity: 0.35 * off * (1 - light), pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// ───────── 13 · «Ya no eres el recadero de tus apps. Ahora trabajan para ti.» ─────────
export const S13: React.FC<P> = ({ t, L }) => {
  const a = ESC.t13.a;
  const tre = at("t13", "recadero"), tah = at("t13", "ahora"), ttr = at("t13", "trabajan");
  const fin = atEnd("t13", "ti") + 0.25;
  const pts = sample((x) => courier(L, x), HOP_T[0], HOP_END, 1 / 45);
  const inK = E(t, a, 0.4);
  const hot = win(t, tre - 0.05, tre + 0.7, 0.08, 0.4);
  const undo = ease.inOut(prog(t, atEnd("t13", "apps") - 0.05, tah + 0.55));
  const gather = spr(t, tah - 0.1, 1.3, 6.5);
  const green = E(t, ttr - 0.05, 0.5);
  const fade = E(t, fin, 0.9, ease.inOut);
  const c = L.c;
  const G = RING(L);
  const bs = L.vertical ? 1.7 : 1.45;
  const bw = 400;
  const pillK = E(t, tah - 0.05, 0.5);
  return (
    <AbsoluteFill>
      <Cam s={0.97 + 0.05 * E(t, a, 4) - 0.06 * fade} ox={c.x} oy={c.y} opacity={inK * (1 - 0.82 * fade)} filter={fade > 0 ? `blur(${fade * 6}px)` : undefined}>
        <div style={{ opacity: 1 - E(t, tah - 0.1, 0.5) }}>
          <LooseWins L={L} t={t} dim={0.35} flash={false} />
        </div>
        <Trail pts={pts} width={5 + 3 * hot} opacity={0.9 * (1 - 0.3 * undo)} erase={undo} />
        {RING_APPS.map((ap, i) => {
          const lw = LOOSE(L)[i % LOOSE(L).length].r;
          const from = { x: lw.x + lw.w / 2, y: lw.y + lw.h / 2 };
          const an = ((-90 + i * 45 + (t - tah) * 7) * Math.PI) / 180;
          const to = { x: c.x + Math.cos(an) * (L.vertical ? 430 : 420), y: c.y + Math.sin(an) * (L.vertical ? 330 : 270) };
          const g = Math.min(1.03, gather);
          const s = G.icon * 0.82;
          if (gather <= 0) return null;
          return (
            <div key={i} style={{ position: "absolute", left: lerp(from.x, to.x, g) - s / 2, top: lerp(from.y, to.y, g) - s / 2, opacity: clamp01(gather * 3), borderRadius: s * 0.24, boxShadow: `0 0 ${36 * green}px ${C.green}99`, transform: `scale(${0.6 + 0.4 * Math.min(1, gather)})` }}>
              <AppIcon app={ap} size={s} radius={s * 0.24} />
            </div>
          );
        })}
        {RING_APPS.map((_, i) => {
          const an = ((-90 + i * 45 + (t - tah) * 7) * Math.PI) / 180;
          const rx = L.vertical ? 430 : 420, ry = L.vertical ? 330 : 270, f0 = 0.8, f1 = 0.55;
          return green > 0 ? (
            <svg key={"g" + i} style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "visible" }}>
              <line x1={c.x + Math.cos(an) * rx * f0} y1={c.y + Math.sin(an) * ry * f0} x2={c.x + Math.cos(an) * rx * lerp(f0, f1, green)} y2={c.y + Math.sin(an) * ry * lerp(f0, f1, green)} stroke={C.green} strokeWidth={4} strokeLinecap="round" opacity={0.7 * green} style={{ filter: `drop-shadow(0 0 6px ${C.green})` }} />
            </svg>
          ) : null;
        })}
        <Omnibar x={c.x} y={c.y - 30 * bs} s={bs} w={bw} k={pillK} pill={{ t, text: "", caret: true, focus: green > 0.3 }} />
        <Spark x={c.x} y={c.y} k={prog(t, ttr, ttr + 0.7)} color="#B9FFD6" size={2} />
      </Cam>
    </AbsoluteFill>
  );
};

export { courier, HOP_T, HOP_END, LOOSE };
