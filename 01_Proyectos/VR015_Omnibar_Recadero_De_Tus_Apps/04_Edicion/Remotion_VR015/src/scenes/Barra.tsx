import React from "react";
import { AbsoluteFill } from "remotion";
import { at, atEnd, C, clamp01, E, ease, ESC, lerp, prog, spr, win } from "../theme";
import { Layout, lerpRect, Rect } from "../layout";
import { Cam } from "../components/Desk";
import { Cursor, Dust, shake } from "../components/Bits";
import {
  APPS, AppIcon, BrowseRow, Btn, ChipSpec, Chips, Heading, HomeToolbar, Icon, Kb, Marks, OB, Omnibar, Row, Section, Status,
} from "../components/Omnibar";
import { AppWin, Cable, Check, DecisionCard, Dest, DonePill, KeyCap, Key, Spark, track } from "../components/Extra";

type P = { t: number; L: Layout };

// ───────── escritorio común: la ventana de trabajo (Chrome) y la barra encima ─────────
const DESK = (L: Layout): Rect => (L.vertical ? { x: 40, y: 150, w: 1000, h: 1140 } : { x: 150, y: 28, w: 1620, h: 792 });
const half = (L: Layout, side: 0 | 1): Rect => {
  const d = DESK(L);
  const w = (d.w - 12) / 2;
  return { x: d.x + side * (w + 12), y: d.y, w, h: d.h };
};
const BAR = (L: Layout) => ({ x: L.bar.cx, y: L.bar.top, s: L.bar.s, w: L.bar.w });
/** borde superior de la tarjeta, en px del fotograma (píldora de 60 px CSS + 6 de hueco) */
const cardTop = (L: Layout) => L.bar.top + 66 * L.bar.s;

const Chrome: React.FC<{ L: Layout; t: number; r?: Rect; dim?: number; blur?: number; glow?: string; glowAmt?: number; opacity?: number; scale?: number; mark?: number; badge?: string }> = ({ L, t, r, ...p }) => (
  <AppWin r={r ?? DESK(L)} kind="browser" app={APPS.chrome} name="Chrome" t={t} seed="chrome" {...p} />
);
const Notion: React.FC<{ L: Layout; t: number; r?: Rect; live?: number; dim?: number; blur?: number; glow?: string; glowAmt?: number; opacity?: number; scale?: number; mark?: number; badge?: string; children?: React.ReactNode }> = ({ L, t, r, ...p }) => (
  <AppWin r={r ?? half(L, 1)} kind="notes" app={APPS.notion} name="Notion" t={t} seed="notion" {...p} />
);
const Spotify: React.FC<{ r: Rect; t: number; opacity?: number; scale?: number; dim?: number; blur?: number; glow?: string; glowAmt?: number }> = ({ r, t, ...p }) => (
  <AppWin r={r} kind="music" app={APPS.spotify} name="Spotify" t={t} seed="spotify" {...p} />
);

// tarjeta de inicio (escena 6, y el arranque de la 7)
const IDEAS_AMB: ChipSpec[] = [
  { label: "Resume lo que muestra Chrome", idea: true },
  { label: "Explícame los puntos clave de esta página", idea: true },
];
const CHIPS_CHROME: ChipSpec[] = [
  { label: "Chrome a la izquierda", app: APPS.chrome, badge: "panelLeft" },
  { label: "Chrome a la derecha", app: APPS.chrome, badge: "panelRight" },
  { label: "Chrome al otro monitor", app: APPS.chrome, badge: "monitor" },
  { label: "Solo Chrome", hint: "Minimiza el resto", icon: "focus" },
];
const HomeCard: React.FC<{ L: Layout; t: number; open: number; loadingUntil: number; ideaGlow?: number; aiGlow?: number; appGlow?: number }> = ({ L, t, open, loadingUntil, ideaGlow = 0, aiGlow = 0, appGlow = 0 }) => {
  const loading = t < loadingUntil;
  const chips = L.bar.cols === 3 ? CHIPS_CHROME.slice(0, 3) : CHIPS_CHROME;
  return (
    <>
      <div style={rk(E(t, open, 0.3))}>
        <HomeToolbar />
      </div>
      <Section first style={{ ...rk(E(t, open + 0.06, 0.3)), paddingTop: 6 }}>
        <Heading ai style={{ textShadow: aiGlow > 0 ? `0 0 ${10 * aiGlow}px rgba(242,193,78,.9)` : undefined }}>Sugerencias de la IA según tu contexto</Heading>
        <Chips chips={IDEAS_AMB.map((c) => ({ ...c, loading }))} cols={L.vertical ? 1 : 2} t={t} glow={() => ideaGlow} k={(i) => (loading ? 1 : E(t, loadingUntil + i * 0.08, 0.3))} />
      </Section>
      <Section style={rk(E(t, open + 0.12, 0.3))}>
        <Heading app="Chrome" appStyle={appGlow > 0 ? { background: `rgba(242,193,78,${0.3 * appGlow})`, boxShadow: `0 0 ${14 * appGlow}px rgba(242,193,78,${0.6 * appGlow})` } : undefined}>Sugerencias</Heading>
        <Chips chips={chips} cols={L.bar.cols} t={t} k={(i) => E(t, open + 0.16 + i * 0.07, 0.3)} />
      </Section>
    </>
  );
};
/** entrada suave (0..1) de un bloque de la tarjeta */
const rk = (k: number): React.CSSProperties => (k >= 1 ? {} : { opacity: clamp01(k), transform: `translateY(${(1 - ease.out(clamp01(k))) * 6}px)` });

// ───────── 5 · «Pulsas tu atajo, y aparece una barra encima de lo que estés haciendo.» ─────────
export const S05: React.FC<P> = ({ t, L }) => {
  const a = ESC.t05.a;
  const tPul = at("t05", "pulsas"), tAt = at("t05", "atajo"), tAp = at("t05", "aparece"), tEn = at("t05", "encima");
  const B = BAR(L);
  const inK = E(t, a, 0.5);
  const keyK = spr(t, tPul - 0.06, 1.8, 7);
  const press = win(t, tAt - 0.02, tAt + 0.24, 0.05, 0.16);
  const barK = E(t, tAp - 0.06, 0.4);
  const dim = 0.32 * E(t, tEn - 0.12, 0.45);
  const halo = win(t, tEn - 0.12, tEn + 1.3, 0.15, 0.7);
  const keyPos = L.vertical ? { x: 540, y: 760 } : { x: 960, y: 470 };
  const pillW = B.w * B.s, pillH = 60 * B.s;
  const sh = shake(t, [tAt + 0.04], 6);
  return (
    <AbsoluteFill>
      <Cam s={0.985 + 0.015 * inK + 0.02 * E(t, tEn, 1.5)} ox={L.c.x} oy={L.c.y} opacity={inK} x={sh.x} y={sh.y}>
        <Chrome L={L} t={t} dim={0.12 + dim} blur={2.2 * E(t, tEn - 0.12, 0.45)} />
        <KeyCap x={keyPos.x} y={keyPos.y - 30 * E(t, tAp - 0.12, 0.25)} label="tu atajo" size={L.vertical ? 66 : 58} k={keyK} press={press} opacity={1 - E(t, tAp - 0.1, 0.22)} />
        {halo > 0 && <div style={{ position: "absolute", left: B.x - pillW / 2 - 12, top: B.y - 12, width: pillW + 24, height: pillH + 24, borderRadius: 22 * B.s + 12, boxShadow: `0 0 ${70 * halo}px ${C.cyan}88, 0 0 0 ${3 * halo}px ${C.cyan}`, opacity: halo, zIndex: 59 }} />}
        <Omnibar x={B.x} y={B.y} s={B.s} w={B.w} k={barK} pill={{ t, caret: true }} />
        <Spark x={B.x} y={B.y + pillH / 2} k={prog(t, tAp, tAp + 0.6)} color="#BFF0FF" size={1.6} />
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 6 · «Ya sabe qué app tienes delante, y la IA te sugiere qué hacer con ella.» ─────────
export const S06: React.FC<P> = ({ t, L }) => {
  const a = ESC.t06.a;
  const tSabe = at("t06", "sabe"), tDel = at("t06", "delante"), tIA = at("t06", "ia"), tSug = at("t06", "sugiere");
  const B = BAR(L);
  const open = tSabe - 0.1;
  const del = win(t, tDel - 0.08, tDel + 1.1, 0.12, 0.5);
  const loadingUntil = tSug + 0.3;
  return (
    <AbsoluteFill>
      <Cam s={1.005 + 0.02 * E(t, a, 4)} ox={L.c.x} oy={B.y} >
        <Chrome L={L} t={t} dim={0.38 - 0.18 * del} blur={2.2 * (1 - del)} glow={C.amber} glowAmt={del} />
        <Omnibar
          x={B.x} y={B.y} s={B.s} w={B.w} cardK={E(t, open, 0.35)} pill={{ t, caret: true }}
          card={<HomeCard L={L} t={t} open={open} loadingUntil={loadingUntil} appGlow={del} aiGlow={win(t, tIA - 0.05, tSug + 1.2, 0.1, 0.5)} ideaGlow={win(t, loadingUntil, loadingUntil + 1.3, 0.1, 0.6)} />}
        />
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 7 · «Abre cualquier app con media palabra… y colócala donde quieras.» ─────────
export const S07: React.FC<P> = ({ t, L }) => {
  const a = ESC.t07.a;
  const tAb = at("t07", "abre"), tMed = at("t07", "media"), tY = at("t07", "y"), tCol = at("t07", "colocala"), tDon = at("t07", "donde"), tQui = at("t07", "quieras");
  const B = BAR(L);
  const d = DESK(L);
  const typeT = [tMed - 0.66, tMed - 0.41, tMed - 0.16];
  const n = typeT.filter((x) => t >= x).length;
  const enter = tY + 0.04;
  const text = t < enter + 0.06 ? "spo".slice(0, n) : "";
  const ghost = t >= tMed && t < enter ? "tify" : undefined;
  // la app se abre en el centro y luego encaja en la mitad derecha
  // horizontal: sin resortes ni tarjeta que se cierra y se reabre (se veía «saltar» la barra); la vertical queda como estaba
  const steady = !L.vertical;
  const sp0: Rect = { x: d.x + d.w * 0.17, y: d.y + d.h * (L.vertical ? 0.34 : 0.42), w: d.w * 0.66, h: d.h * (L.vertical ? 0.44 : 0.5) };
  const spSmall: Rect = { x: B.x - 60, y: B.y + 40, w: 120, h: 70 };
  const openK = steady ? E(t, enter + 0.06, 0.55) : spr(t, enter + 0.06, 1.6, 7);
  const snap = steady ? E(t, tDon + 0.02, 0.5, ease.inOut) : spr(t, tDon + 0.02, 1.5, 7.5);
  const right = half(L, 1);
  const spR = snap > 0 ? lerpRect(sp0, right, Math.min(1.02, snap)) : lerpRect(spSmall, sp0, Math.min(1, openK));
  const zone = win(t, tDon - 0.14, tQui + 0.55, 0.12, 0.35);
  // tarjeta: inicio → filas al teclear → oculta → sugerencias de Spotify
  let card: React.ReactNode = null;
  let cardK = 0;
  const press = prog(t, tDon - 0.14, tDon + 0.12);
  const spotifyChips = (k0: number) => (
    <Section first>
      <Heading app="Spotify">Sugerencias</Heading>
      <Chips
        chips={[
          { label: "Spotify a la izquierda", app: APPS.spotify, badge: "panelLeft" },
          { label: "Spotify a la derecha", app: APPS.spotify, badge: "panelRight" },
          ...(L.bar.cols === 3 ? [{ label: "Spotify al otro monitor", app: APPS.spotify, badge: "monitor" } as ChipSpec] : []),
        ]}
        cols={L.bar.cols} t={t} k={(i) => E(t, k0 + i * 0.06, 0.28)} glow={(i) => (i === 1 ? E(t, tCol + 0.15, 0.2) : 0)} press={(i) => (i === 1 ? press : 0)}
      />
    </Section>
  );
  if (t < typeT[0]) {
    card = <HomeCard L={L} t={t} open={-9} loadingUntil={-9} />;
    cardK = 1;
  } else if (steady) {
    // la tarjeta no se cierra: las filas se funden en las sugerencias de Spotify (mismo hueco, apiladas en rejilla)
    const rowsK = 1 - E(t, enter, 0.18);
    const chipsK = E(t, enter + 0.1, 0.3);
    card = (
      <div style={{ display: "grid" }}>
        <div style={{ gridArea: "1 / 1", opacity: rowsK }}>
          <Section first style={{ gap: 4, paddingTop: 8 }}>
            <Row r={{ label: "Pedírselo al asistente", meta: text + (ghost ?? ""), ai: true }} />
            <Row r={{ label: "Abrir Spotify", meta: "App", app: APPS.spotify }} selected={n >= 2} k={E(t, typeT[1], 0.25)} />
          </Section>
        </div>
        {chipsK > 0 && <div style={{ gridArea: "1 / 1", opacity: chipsK }}>{spotifyChips(enter + 0.1)}</div>}
      </div>
    );
    cardK = 1 - E(t, tDon + 0.35, 0.35, ease.inOut);
  } else if (t < enter + 0.16) {
    card = (
      <Section first style={{ gap: 4, paddingTop: 8 }}>
        <Row r={{ label: "Pedírselo al asistente", meta: text + (ghost ?? ""), ai: true }} />
        <Row r={{ label: "Abrir Spotify", meta: "App", app: APPS.spotify }} selected={n >= 2} k={E(t, typeT[1], 0.25)} />
      </Section>
    );
    cardK = 1 - E(t, enter, 0.16);
  } else if (t > tCol - 0.12) {
    card = spotifyChips(tCol - 0.1);
    cardK = E(t, tCol - 0.12, 0.25) * (1 - E(t, tDon + 0.35, 0.25));
  }
  const flash = win(t, enter - 0.02, enter + 0.3, 0.03, 0.25);
  return (
    <AbsoluteFill>
      <Cam s={1.025 + 0.015 * E(t, a, 4)} ox={L.c.x} oy={B.y}>
        <Chrome L={L} t={t} dim={0.3 - 0.1 * E(t, enter, 0.4)} blur={1.5 * (1 - E(t, enter, 0.4))} />
        {zone > 0 && (
          <div style={{ position: "absolute", left: right.x + 6, top: right.y + 6, width: right.w - 12, height: right.h - 12, borderRadius: 14, border: `4px dashed ${C.cyan}`, background: `${C.cyan}1F`, boxShadow: `0 0 60px ${C.cyan}55, inset 0 0 60px ${C.cyan}22`, opacity: zone, zIndex: 3 }} />
        )}
        {openK > 0 && <Spotify r={spR} t={t} opacity={clamp01(openK * 3)} glow={C.cyan} glowAmt={win(t, tDon, tQui + 0.4, 0.1, 0.4)} />}
        <Omnibar x={B.x} y={B.y} s={B.s} w={B.w} cardK={cardK} card={card} pill={{ t, text, ghost, caret: true }} />
        {flash > 0 && <div style={{ position: "absolute", left: B.x - (B.w * B.s) / 2, top: B.y, width: B.w * B.s, height: 60 * B.s, borderRadius: 22 * B.s, boxShadow: `0 0 ${50 * flash}px ${C.cyan}, 0 0 0 ${3 * flash}px ${C.cyan}`, zIndex: 61 }} />}
        <Spark x={right.x + right.w / 2} y={right.y + right.h / 2} k={prog(t, tQui - 0.1, tQui + 0.55)} color="#BFF0FF" size={1.6} />
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 8 · «Pregúntale lo que sea: busca en internet y te lo resume, con sus fuentes.» ─────────
const Q = "¿Cómo cuido un bonsái en invierno?";
const SOURCES = ["Cuidados del bonsái en invierno", "Riego y luz en los meses fríos", "Cómo proteger el bonsái de las heladas"];
const ResultCard: React.FC<{ L: Layout; t: number; tRes: number; tCon: number; tFue: number }> = ({ L, t, tRes, tCon, tFue }) => {
  const green = win(t, tFue - 0.12, tFue + 1.4, 0.12, 0.6);
  return (
    <>
      <Section first style={{ ...rk(E(t, tRes, 0.3)), flexDirection: "row", alignItems: "flex-start", gap: 10, paddingTop: 12 }}>
        <Icon name="sparkles" size={15} color={OB.ai} style={{ marginTop: 3 }} />
        <div style={{ flex: 1, fontSize: 13.5, lineHeight: 1.5, color: OB.text }}>
          En invierno, <b>riega menos</b>, dale toda la luz que puedas y <b>protégelo de las heladas</b> <span style={{ color: OB.accent, fontSize: 11.5 }}>[1]</span> <span style={{ color: OB.accent, fontSize: 11.5 }}>[3]</span>
        </div>
        <Btn icon="copy">Copiar</Btn>
      </Section>
      <Section style={{ ...rk(E(t, tCon - 0.08, 0.3)), gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px", fontSize: 11.5, fontWeight: 600, color: green > 0 ? `rgba(0,230,118,${0.6 + 0.4 * green})` : OB.muted }}>
          <span style={{ textShadow: green > 0 ? `0 0 ${10 * green}px rgba(0,230,118,.8)` : undefined }}>Fuentes de la búsqueda</span>
          <Btn icon="arrowUpRight" style={{ height: 24 }}>Abrir todas</Btn>
        </div>
        {SOURCES.map((s, i) => (
          <div key={i} style={{ ...rk(E(t, tCon + 0.05 + i * 0.1, 0.28)), display: "flex", alignItems: "center", gap: 9, padding: "6px 8px", borderRadius: 10, border: `1px solid ${green > 0 ? `rgba(0,230,118,${0.15 + 0.35 * green})` : OB.tileEdge}`, background: OB.tile, fontSize: 12.5 }}>
            <Icon name="globe" size={13} color={green > 0 ? OB.ok : OB.muted} />
            <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s}</span>
              <span style={{ width: `${30 + i * 9}%`, height: 6, borderRadius: 4, background: "rgba(255,255,255,.12)" }} />
            </span>
            <Icon name="arrowUpRight" size={12} color={OB.faint} />
          </div>
        ))}
      </Section>
      <Section style={rk(E(t, tFue + 0.25, 0.3))}>
        <Heading ai>Con estas páginas</Heading>
        <Chips chips={[{ label: "Resume las páginas encontradas", idea: true }, ...(L.vertical ? [] : [{ label: "Copia los enlaces encontrados", idea: true }])]} cols={L.vertical ? 1 : 2} t={t} k={(i) => E(t, tFue + 0.3 + i * 0.08, 0.3)} />
      </Section>
    </>
  );
};
export const S08: React.FC<P> = ({ t, L }) => {
  const a = ESC.t08.a;
  const tPre = at("t08", "preguntale"), tBus = at("t08", "busca"), tInt = at("t08", "internet"), tRes = at("t08", "resume"), tCon = at("t08", "con"), tFue = at("t08", "fuentes");
  const B = BAR(L);
  const typed = Math.floor(clamp01(prog(t, tPre + 0.05, tBus - 0.18)) * Q.length);
  const running = t >= tBus && t < tRes + 0.05 ? t - tBus : -1;
  const statusK = E(t, tBus + 0.1, 0.25);
  let card: React.ReactNode = null;
  let cardK = 0;
  if (t >= tBus + 0.1 && t < tRes) {
    card = <Status text="Leyendo las páginas encontradas…" t={t} />;
    cardK = statusK;
  } else if (t >= tRes) {
    card = <ResultCard L={L} t={t} tRes={tRes} tCon={tCon} tFue={tFue} />;
    cardK = 1;
  }
  // tres páginas de internet que llegan a la barra
  const ct = cardTop(L);
  const globes = [0, 1, 2].map((i) => {
    const k = ease.inOut(prog(t, tInt - 0.35 + i * 0.12, tInt + 0.35 + i * 0.12));
    const from = { x: L.W + 80, y: ct + (L.vertical ? 260 + i * 120 : 120 + i * 90) };
    const to = { x: B.x + (i - 1) * 60, y: ct + 40 * B.s };
    return { k, x: lerp(from.x, to.x, k), y: lerp(from.y, to.y, k) - Math.sin(k * Math.PI) * 90 };
  });
  const gs = L.vertical ? 74 : 64;
  return (
    <AbsoluteFill>
      <Cam s={1.03 + 0.015 * E(t, a, 4)} ox={L.c.x} oy={B.y}>
        <Chrome L={L} t={t} dim={0.38} blur={1.6} />
        <Spotify r={half(L, 1)} t={t} dim={0.45} blur={1.6} />
        <Omnibar x={B.x} y={B.y} s={B.s} w={B.w} cardK={cardK} card={card} pill={{ t, text: Q.slice(0, typed), caret: t < tBus, running }} />
        {globes.map((g, i) =>
          g.k > 0 && g.k < 1 ? (
            <div key={i} style={{ position: "absolute", left: g.x - gs / 2, top: g.y - gs / 2, width: gs, height: gs, borderRadius: 99, background: "linear-gradient(160deg,#1A2433,#0C111A)", border: `3px solid ${C.cyan}`, boxShadow: `0 0 30px ${C.cyan}88`, display: "flex", alignItems: "center", justifyContent: "center", opacity: Math.min(1, (1 - g.k) * 5), zIndex: 70 }}>
              <Icon name="globe" size={gs * 0.56} color="#E6FAFF" stroke={1.8} />
            </div>
          ) : null,
        )}
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 9 · «Marca varias ventanas con Control y clic, y te propone qué hacer con ellas.» ─────────
const MARKS = (k1: number, k2: number) => [
  ...(k1 > 0 ? [{ app: APPS.chrome, kind: "Chrome", label: "Cuidados del bonsái", k: k1 }] : []),
  ...(k2 > 0 ? [{ app: APPS.notion, kind: "Notion", label: "Mis notas", k: k2 }] : []),
];
const IDEAS_MARKS: ChipSpec[] = [
  { label: "Resume esta web → Notion", idea: true },
  { label: "Explícame lo que muestra Chrome", idea: true },
];
const MarksCard: React.FC<{ cols: number; t: number; k1: number; k2: number; ideasFrom: number; loadingUntil: number; glow?: (i: number) => number; press?: (i: number) => number; status?: React.ReactNode }> = ({ cols, t, k1, k2, ideasFrom, loadingUntil, glow, press, status }) => (
  <>
    <Marks marks={MARKS(k1, k2)} />
    {status ??
      (t >= ideasFrom && (
        <Section style={rk(E(t, ideasFrom, 0.3))}>
          <Heading ai>Ideas para estas ventanas</Heading>
          <Chips chips={IDEAS_MARKS.map((c) => ({ ...c, loading: t < loadingUntil }))} cols={cols} t={t} k={(i) => (t < loadingUntil ? 1 : E(t, loadingUntil + i * 0.08, 0.3))} glow={glow} press={press} />
        </Section>
      ))}
  </>
);
const markSpots = (L: Layout) => ({ c: { x: half(L, 0).x + half(L, 0).w * 0.5, y: DESK(L).y + DESK(L).h * (L.vertical ? 0.8 : 0.76) }, n: { x: half(L, 1).x + half(L, 1).w * 0.45, y: DESK(L).y + DESK(L).h * (L.vertical ? 0.8 : 0.76) } });
export const S09: React.FC<P> = ({ t, L }) => {
  const a = ESC.t09.a;
  const tMar = at("t09", "marca"), tCtl = at("t09", "control"), tCli = at("t09", "clic"), tPro = at("t09", "propone");
  const B = BAR(L);
  const mv = E(t, a, 0.55, ease.inOut);
  const chromeR = lerpRect(DESK(L), half(L, 0), mv);
  const notK = spr(t, a + 0.18, 1.6, 7);
  const sp = markSpots(L);
  const c1 = tCtl + 0.04, c2 = tCli + 0.02;
  const keys: Key[] = [
    { t: a + 0.55, p: { x: L.c.x + 40, y: DESK(L).y + DESK(L).h * 0.95 } },
    { t: c1 - 0.04, p: sp.c, bend: 0.2 },
    { t: c1 + 0.12, p: sp.c },
    { t: c2 - 0.04, p: sp.n, bend: -0.25 },
    { t: c2 + 0.5, p: sp.n },
  ];
  const cur = track(keys, t);
  const curK = E(t, a + 0.45, 0.3);
  const k1 = E(t, c1, 0.3), k2 = E(t, c2, 0.3);
  const lastClick = t > c2 ? c2 : t > c1 ? c1 : -9;
  const ctrlK = spr(t, tCtl - 0.22, 1.8, 7) * (1 - E(t, c2 + 0.45, 0.2));
  const keyPos = L.vertical ? { x: 540, y: 1225 } : { x: 960, y: 770 };
  const loadingUntil = tPro + 0.35;
  return (
    <AbsoluteFill>
      <Cam s={1.02 + 0.015 * E(t, a, 4)} ox={L.c.x} oy={B.y}>
        <Spotify r={half(L, 1)} t={t} dim={0.45} blur={1.6} opacity={1 - E(t, a, 0.3)} scale={1 - 0.05 * E(t, a, 0.3)} />
        <Chrome L={L} t={t} r={chromeR} dim={0.25 - 0.15 * k1} mark={k1} badge="1" />
        {notK > 0 && <Notion L={L} t={t} live={0.34} opacity={clamp01(notK * 3)} scale={0.85 + 0.15 * Math.min(1.02, notK)} dim={0.25 - 0.15 * k2} mark={k2} badge="2" />}
        <Omnibar x={B.x} y={B.y} s={B.s} w={B.w} cardK={E(t, c1, 0.25)} card={k1 > 0 ? <MarksCard cols={L.vertical ? 1 : 2} t={t} k1={k1} k2={k2} ideasFrom={tPro - 0.15} loadingUntil={loadingUntil} glow={() => win(t, loadingUntil, loadingUntil + 1.2, 0.1, 0.6)} /> : null} pill={{ t, caret: true }} />
        <KeyCap x={keyPos.x} y={keyPos.y} label="Ctrl" size={L.vertical ? 50 : 44} k={ctrlK} press={win(t, tCtl - 0.1, c2 + 0.3, 0.08, 0.15)} color={C.amber} />
        <Cursor x={cur.x} y={cur.y} s={L.u * 1.35} color={C.amber} opacity={curK} click={lastClick > 0 && t - lastClick < 0.7 ? (t - lastClick) / 0.7 : -1} />
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 10 · «Por ejemplo: resume esta web y pásalo a tus notas de Notion u Obsidian.» ─────────
const NOTE_TEXT = "Bonsái en invierno\n• Riega menos que en verano.\n• Dale toda la luz que puedas.\n• Protégelo de las heladas.";
export const S10: React.FC<P> = ({ t, L }) => {
  const a = ESC.t10.a;
  const tEj = at("t10", "ejemplo"), tRes = at("t10", "resume"), tPas = at("t10", "pasalo"), tNot = at("t10", "notion"), tObs = at("t10", "obsidian");
  const B = BAR(L);
  const pick = tRes + 0.22;
  const tWrite = pick + 0.62; // «Escribiendo el texto para…»
  const tAsk = tPas - 0.2; // tarjeta de confirmación (se ve ~0,9 s)
  const tYes = tNot - 0.25;
  const tDone = tObs + 0.35;
  let status: React.ReactNode = null;
  if (t >= pick) {
    const txt = t < tWrite ? "Leyendo «Chrome»…" : t < tAsk ? "Escribiendo el texto para «Notion»…" : t < tYes + 0.1 ? "Esperando tu confirmación…" : "Escribiendo en «Notion»…";
    status = <Status text={txt} t={t} />;
  }
  const cardK = 1 - E(t, tDone, 0.3);
  const decK = E(t, tAsk, 0.3) * (1 - E(t, tYes + 0.12, 0.2));
  const press = prog(t, tYes - 0.1, tYes + 0.15);
  const write = prog(t, tYes + 0.15, tObs + 0.2);
  const n1 = half(L, 1);
  const flow = prog(t, pick + 0.05, tAsk + 0.1);
  const h0 = half(L, 0);
  const dc = L.vertical ? { x: 540, y: 965, s: 2.2, w: 420 } : { x: 960, y: 618, s: 1.6, w: 460 };
  const iconY = L.vertical ? n1.y + n1.h * 0.9 : n1.y + n1.h * 0.86;
  const is = L.vertical ? 86 : 74;
  const nk = spr(t, tNot - 0.05, 1.8, 7), ok = spr(t, tObs - 0.05, 1.8, 7);
  const done = E(t, tDone - 0.1, 0.4);
  const marksOut = 1 - E(t, tDone, 0.3);
  return (
    <AbsoluteFill>
      <Cam s={1.035 + 0.015 * E(t, a, 4)} ox={L.c.x} oy={B.y}>
        <Chrome L={L} t={t} r={h0} dim={0.1} mark={marksOut} badge="1" />
        <Notion L={L} t={t} live={0.34 + 0.66 * write} dim={0.1} mark={marksOut} badge="2" glow={C.green} glowAmt={write > 0 ? 0.4 + 0.6 * done : 0}>
          {write > 0 && (
            <div style={{ position: "absolute", left: n1.x + n1.w * 0.07, top: n1.y + n1.h * 0.56, width: n1.w * 0.86, height: n1.h * 0.24, borderRadius: 10, background: "rgba(0,230,118,0.08)", borderLeft: `5px solid ${C.green}`, opacity: clamp01(write * 4) }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ position: "absolute", left: "6%", top: `${12 + i * 21}%`, width: `${(i === 0 ? 55 : 78 - i * 8) * clamp01(write * 4 - i * 0.6)}%`, height: i === 0 ? "13%" : "9%", borderRadius: 9, background: i === 0 ? "rgba(243,241,234,0.85)" : "rgba(0,230,118,0.65)" }} />
              ))}
            </div>
          )}
        </Notion>
        <Dust x={h0.x + h0.w * 0.15} y={h0.y + h0.h * 0.45} w={h0.w * 0.7} h={h0.h * 0.4} k={flow} seed="web" n={56} color={C.amber} dir="in" tx={n1.x + n1.w * 0.5} ty={n1.y + n1.h * 0.66} size={6} />
        <Omnibar
          x={B.x} y={B.y} s={B.s} w={B.w} cardK={cardK} pill={{ t, caret: true, running: t >= pick && t < tYes + 0.6 ? t - pick : -1 }}
          card={<MarksCard cols={L.vertical ? 1 : 2} t={t} k1={1} k2={1} ideasFrom={-9} loadingUntil={-9} glow={(i) => (i === 0 ? E(t, tEj - 0.1, 0.3) : 0)} press={(i) => (i === 0 ? prog(t, tRes - 0.08, pick) : 0)} status={status ?? undefined} />}
        />
        <DecisionCard x={dc.x} y={dc.y} s={dc.s} w={dc.w} k={decK} question="¿Escribo este texto en Notion?" text={NOTE_TEXT} press={press} />
        {[{ app: APPS.notion, k: nk, dx: -0.65 }, { app: APPS.obsidian, k: ok, dx: 0.65 }].map((b, i) =>
          b.k > 0 ? (
            <div key={i} style={{ position: "absolute", left: n1.x + n1.w / 2 + b.dx * is - is / 2, top: iconY - is / 2, transform: `scale(${Math.min(1.08, b.k)})`, opacity: clamp01(b.k * 3), borderRadius: is * 0.24, boxShadow: `0 0 0 4px ${C.green}, 0 0 34px ${C.green}`, zIndex: 72 }}>
              <AppIcon app={b.app} size={is} radius={is * 0.24} />
            </div>
          ) : null,
        )}
        <Check x={n1.x + n1.w - 60} y={n1.y + n1.h * (L.vertical ? 0.5 : 0.47)} s={L.vertical ? 80 : 70} k={E(t, tDone - 0.15, 0.4)} />
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 11 · «Y con tus propios comandos la conectas con lo que uses: un script, una web, un servicio.» ─────────
const SCOPES = ["Recomendadas", "Todo", "Acciones", "Apps", "Ventanas", "Workspaces", "Personalizadas"];
const REC_ROWS = [
  { label: "Despejar escritorio", hint: "Minimiza o restaura todo", icon: "layers" as const },
  { label: "Nota rápida", hint: "Escribe y pulsa Enter", icon: "fileText" as const },
  { label: "¿Qué tengo abierto?", hint: undefined, icon: "messageQ" as const },
];
const CUSTOM_ROWS = [
  { label: "/publicar", hint: "Ejecuta tu script de publicación", icon: "terminal" as const },
  { label: "/tarea", hint: "Abre tu gestor de tareas en la web", icon: "globe" as const },
  { label: "/informe", hint: "Pide el informe a tu servicio", icon: "server" as const },
];
/** centro vertical de la fila i del explorador y borde inferior de la tarjeta (px del fotograma) */
const browseGeom = (L: Layout) => {
  const s = L.bar.s, top = cardTop(L);
  const filters = L.vertical ? 59 : 27; // los filtros ocupan dos líneas en vertical
  const row0 = 10 + 16 + 8 + filters + 8 + 15 + 8 + 24;
  return { row: (i: number) => top + (row0 + i * 56) * s, bottom: top + (row0 + 2 * 56 + 24 + 12) * s, right: L.bar.cx + (L.bar.w * s) / 2 };
};
export const S11: React.FC<P> = ({ t, L }) => {
  const a = ESC.t11.a;
  const tCom = at("t11", "comandos");
  const tw = [at("t11", "script"), at("t11", "web"), at("t11", "servicio")];
  const B = BAR(L);
  const slash = a + 0.3;
  const custom = t >= tCom + 0.05;
  const rows = custom ? CUSTOM_ROWS : REC_ROWS;
  const g = browseGeom(L);
  const lit = tw.map((x) => E(t, x - 0.18, 0.3));
  const card = (
    <Section first style={{ gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "0 2px", color: OB.text }}>
        <Icon name="search" size={13} color={OB.muted} /> Explorar acciones
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {SCOPES.map((sc) => {
          const on = custom ? sc === "Personalizadas" : sc === "Recomendadas";
          const pulse = sc === "Personalizadas" ? win(t, tCom - 0.05, tCom + 0.9, 0.08, 0.4) : 0;
          return (
            <span key={sc} style={{ border: `1px solid ${on ? OB.accentEdge : OB.tileEdge}`, borderRadius: 8, padding: "5px 10px", background: on ? OB.accentDim : OB.tile, color: on ? OB.text : OB.muted, fontSize: 12, lineHeight: "15px", boxShadow: pulse > 0 ? `0 0 ${14 * pulse}px rgba(0,210,255,${0.7 * pulse})` : undefined }}>
              {sc}
            </span>
          );
        })}
      </div>
      <div style={{ fontSize: 11, color: OB.muted, padding: "0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "15px" }}>↑ ↓ elegir · Enter ejecutar o completar · Tab filtros · Esc volver</div>
      {rows.map((r, i) => (
        <BrowseRow key={(custom ? "c" : "r") + i} r={r} k={custom ? E(t, tCom + 0.08 + i * 0.08, 0.28) : 1} selected={!custom && i === 0} glow={custom ? lit[i] : 0} />
      ))}
    </Section>
  );
  const dests = L.vertical
    ? [0, 1, 2].map((i) => ({ x: 230 + i * 310, y: Math.min(1160, g.bottom + 120), from: { x: 230 + i * 310, y: g.bottom - 4 } }))
    : [0, 1, 2].map((i) => ({ x: 1700, y: g.row(i) + (i - 1) * 55, from: { x: g.right - 4, y: g.row(i) } }));
  const ds = L.vertical ? 140 : 112;
  const icons = ["terminal", "globe", "server"] as const;
  return (
    <AbsoluteFill>
      <Cam s={1.03 + 0.015 * E(t, a, 5)} ox={L.c.x} oy={B.y}>
        <Chrome L={L} t={t} r={half(L, 0)} dim={0.42} blur={1.6} />
        <Notion L={L} t={t} live={1} dim={0.42} blur={1.6} />
        <Omnibar x={B.x} y={B.y} s={B.s} w={B.w} cardK={E(t, slash + 0.04, 0.28)} card={card} pill={{ t, text: t >= slash ? "/" : "", caret: true }} />
        {dests.map((d, i) => {
          const to = L.vertical ? { x: d.x, y: d.y - ds / 2 } : { x: d.x - ds / 2, y: d.y };
          return (
            <React.Fragment key={i}>
              <Cable a={d.from} b={to} t={t} draw={prog(t, tw[i] - 0.32, tw[i] + 0.12)} bend={L.vertical ? 0.06 : (i - 1) * -0.25} width={L.vertical ? 6 : 5} flow={1.3} />
              <Dest x={d.x} y={d.y} size={ds} icon={icons[i]} k={spr(t, tw[i] - 0.22, 1.8, 7)} lit={lit[i]} t={t} />
              <Spark x={d.x} y={d.y} k={prog(t, tw[i] + 0.1, tw[i] + 0.65)} color="#BFF0FF" size={L.vertical ? 1.4 : 1.1} />
            </React.Fragment>
          );
        })}
      </Cam>
    </AbsoluteFill>
  );
};

// ───────── 12 · «Todo, sin salir de lo que estás haciendo.» ─────────
export const S12: React.FC<P> = ({ t, L }) => {
  const a = ESC.t12.a;
  const tTodo = at("t12", "todo"), tSin = at("t12", "sin"), tSal = at("t12", "salir");
  const fin = atEnd("t12", "haciendo");
  const B = BAR(L);
  const barK = 1 - E(t, tTodo - 0.05, 0.35, ease.in);
  const green = E(t, tSin - 0.05, 0.5);
  const clear = E(t, a, 0.45);
  const labels = ["Spotify a la derecha", "Respuesta con sus fuentes", "Resumen en Notion"];
  const ys = L.vertical ? [500, 640, 780] : [300, 420, 540];
  const out = E(t, fin + 0.35, 0.35);
  return (
    <AbsoluteFill>
      <Cam s={1.03 - 0.03 * E(t, a, 2.5)} ox={L.c.x} oy={L.c.y} opacity={1 - 0.6 * out}>
        <Chrome L={L} t={t} r={half(L, 0)} dim={0.42 * (1 - clear)} blur={1.6 * (1 - clear)} glow={C.green} glowAmt={0.8 * green} />
        <Notion L={L} t={t} live={1} dim={0.42 * (1 - clear)} glow={C.green} glowAmt={0.8 * green} />
        <Omnibar x={B.x} y={B.y} s={B.s} w={B.w} k={barK} pill={{ t, text: "", caret: false }} />
        {labels.map((lb, i) => (
          <DonePill key={i} x={L.c.x} y={ys[i]} size={L.vertical ? 40 : 34} label={lb} k={spr(t, tSin + 0.05 + i * 0.2, 1.8, 7) * (1 - out)} />
        ))}
        <Check x={L.c.x} y={ys[0] - (L.vertical ? 130 : 110)} s={L.vertical ? 90 : 76} k={E(t, tSal, 0.4) * (1 - out)} />
      </Cam>
    </AbsoluteFill>
  );
};

export { Kb };
