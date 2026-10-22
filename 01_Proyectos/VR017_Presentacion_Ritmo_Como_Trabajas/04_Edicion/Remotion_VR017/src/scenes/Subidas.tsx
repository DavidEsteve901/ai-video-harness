import React from "react";
import { at } from "../ritmo";
import { C, clamp01, E, ease, Layout, lerp } from "../theme";
import { inside, lerpRect, Rect } from "../geom";
import { Eyebrow, Linea } from "../components/Kinetic";
import { UICard, zoomPoint } from "../components/UICard";
import { Win } from "../components/Win";
import { Cursor, Icon } from "../components/Bits";
import { Laptop, laptopScreen, Monitor, screenOf } from "../components/Screens";
import { CaptureCard, Float, ProfileCard } from "../components/Osd";
import { Kind } from "../windows";

// ── composición por orientación ──
export const head = (L: Layout) =>
  L.V ? { x: L.cx, y: 330, size: 100, maxW: 1000, align: "center" as const, ey: { x: L.cx, y: 205 } } : { x: 110, y: 480, size: 92, maxW: 680, align: "left" as const, ey: { x: 112, y: 255 } };
export const cardBox = (L: Layout) => (L.V ? { cx: 540, cy: 1130, w: 1000, maxH: 1080 } : { cx: 1300, cy: 560, w: 1040, maxH: 860 });
const topHead = (L: Layout) => (L.V ? { x: L.cx, y: 330, size: 96, maxW: 1000 } : { x: L.cx, y: 120, size: 84, maxW: 1800 });
const monitors = (L: Layout): [Rect, Rect] =>
  L.V ? [{ x: 90, y: 620, w: 900, h: 506 }, { x: 190, y: 1270, w: 700, h: 394 }] : [{ x: 150, y: 250, w: 980, h: 551 }, { x: 1220, y: 330, w: 560, h: 315 }];

type Slot = { kind: Kind; mon: 0 | 1; f: Rect };
const D1: Slot[] = [
  { kind: "code", mon: 0, f: { x: 0, y: 0, w: 0.62, h: 1 } },
  { kind: "browser", mon: 0, f: { x: 0.62, y: 0, w: 0.38, h: 0.56 } },
  { kind: "terminal", mon: 0, f: { x: 0.62, y: 0.56, w: 0.38, h: 0.44 } },
  { kind: "notes", mon: 1, f: { x: 0, y: 0, w: 0.5, h: 1 } },
  { kind: "music", mon: 1, f: { x: 0.5, y: 0, w: 0.5, h: 0.5 } },
  { kind: "chat", mon: 1, f: { x: 0.5, y: 0.5, w: 0.5, h: 0.5 } },
];
const D2: Slot[] = [
  { kind: "design", mon: 0, f: { x: 0, y: 0, w: 0.68, h: 1 } },
  { kind: "reader", mon: 0, f: { x: 0.68, y: 0, w: 0.32, h: 1 } },
  { kind: "browser", mon: 1, f: { x: 0, y: 0, w: 0.6, h: 1 } },
  { kind: "chat", mon: 1, f: { x: 0.6, y: 0, w: 0.4, h: 1 } },
];

// ═════════ SUBIDA A: guardar una vez → un clic → cada app en su pantalla, escritorio y zona ═════════
export const SubidaA: React.FC<{ t: number; L: Layout }> = ({ t, L }) => {
  const a = (c: number, p = 0) => at("subidaA", c, p);
  const h = head(L), cb = cardBox(L), th = topHead(L);
  const M = monitors(L);
  const S = M.map(screenOf);
  // botón «Lanzar» en la captura ws.jpg (1689×1470)
  const LANZAR = { x: 0.882, y: 0.012, w: 0.104, h: 0.05 };
  const zoomS = L.V ? 2.7 : 2.3;
  const clickT = a(1, 2);
  // posición del botón en pantalla tras el zoom = centro de la tarjeta
  const curK = ease.inOut(clamp01((t - a(1, 1)) / (clickT - a(1, 1) - 0.05)));
  const btn = zoomPoint(1689, 1470, cb.w, cb.maxH, LANZAR, zoomS, LANZAR.x + LANZAR.w / 2, LANZAR.y + LANZAR.h / 2);
  const curX = lerp(cb.cx + (L.V ? -220 : -260), cb.cx + btn.x + 6, curK), curY = lerp(cb.cy + (L.V ? 260 : 200), cb.cy + btn.y + 6, curK);
  const launch = a(1, 3);
  const monK = E(t, a(2, 0) - 0.25, 0.35);
  const switchT = a(3, 0), zonesT = a(3, 2);
  const sw = ease.inOut(clamp01((t - switchT + 0.1) / 0.32));
  return (
    <>
      {/* compás 1–2: la lista REAL del workspace, guardar y lanzar */}
      <Eyebrow t={t} at={a(0, 0)} x={h.ey.x} y={h.ey.y} text="Workspaces" align={h.align} out={a(2, 0) - 0.15} />
      <Linea t={t} x={h.x} y={h.y} size={h.size} maxW={h.maxW} align={h.align} entrada="rise"
        palabras={[{ w: "Guárdalo", at: a(0, 0), out: a(1, 0) - 0.08 }, { w: "una vez.", at: a(0, 1), out: a(1, 0) - 0.08 }]} />
      <Linea t={t} x={h.x} y={h.y} size={h.size} maxW={h.maxW} align={h.align} entrada="rise"
        palabras={[{ w: "Ábrelo", at: a(1, 0), out: a(2, 0) - 0.12 }, { w: "con un", at: a(1, 0.5), out: a(2, 0) - 0.12 }, { w: "clic.", at: a(1, 1), out: a(2, 0) - 0.12, color: C.green, mark: C.green }]} />
      <UICard
        t={t} src="img/ui/ws.jpg" iw={1689} ih={1470} cx={cb.cx} cy={cb.cy} w={cb.w} maxH={cb.maxH} at={a(0, 0)}
        zoom={[{ at: a(1, 0) - 0.05, d: 0.5, r: LANZAR, s: zoomS }]}
        glows={[{ r: LANZAR, at: clickT, color: C.green, dur: 0.5, radius: 10 }]}
        out={launch} outMode="scale"
      />
      {t > a(1, 0.8) && t < launch + 0.1 && <Cursor x={curX} y={curY} s={1.3} click={t >= clickT ? t - clickT : -1} opacity={clamp01((t - a(1, 0.8)) / 0.15) * (1 - clamp01((t - launch) / 0.1))} />}
      {/* compás 3–4: pantallas, escritorios y zonas */}
      {monK > 0 &&
        M.map((m, i) => {
          const s = 0.85 + 0.15 * monK;
          return (
            <div key={i} style={{ position: "absolute", inset: 0, opacity: monK, transform: `scale(${s})`, transformOrigin: `${m.x + m.w / 2}px ${m.y + m.h / 2}px` }}>
              <Monitor r={m} edge={C.cyan} edgeAmt={t > zonesT ? 0.6 * (1 - clamp01((t - zonesT - 0.5) / 0.6)) + 0.2 : 0} />
            </div>
          );
        })}
      {monK > 0 && t < switchT &&
        D1.map((sl, i) => {
          const land = a(2, i * 0.5);
          const k = ease.out(clamp01((t - land + 0.26) / 0.26));
          if (k <= 0) return null;
          const tgt = inside(S[sl.mon], sl.f, 5);
          const src: Rect = { x: L.cx - 60, y: L.cy - 40, w: 120, h: 80 };
          return <Win key={i} r={lerpRect(src, tgt, k)} kind={sl.kind} t={t} seed={"a" + i} opacity={clamp01(k * 3)} glow={C.cyan} glowAmt={t > land ? 0.8 * (1 - clamp01((t - land) / 0.4)) : 0} />;
        })}
      {t >= switchT &&
        [0, 1].map((mi) => (
          <div key={mi} style={{ position: "absolute", left: S[mi].x, top: S[mi].y, width: S[mi].w, height: S[mi].h, overflow: "hidden", borderRadius: 6 }}>
            {D1.filter((s) => s.mon === mi).map((sl, i) => {
              const r = inside({ x: 0, y: 0, w: S[mi].w, h: S[mi].h }, sl.f, 5);
              return <Win key={"o" + i} r={{ ...r, x: r.x - sw * S[mi].w * 1.05 }} kind={sl.kind} t={t} seed={"a" + D1.indexOf(sl)} opacity={1 - sw * 0.5} />;
            })}
            {D2.filter((s) => s.mon === mi).map((sl, i) => {
              const r = inside({ x: 0, y: 0, w: S[mi].w, h: S[mi].h }, sl.f, 5);
              const zg = t > zonesT ? 1 - clamp01((t - zonesT - 0.35) / 0.6) : 0;
              return <Win key={"n" + i} r={{ ...r, x: r.x + (1 - sw) * S[mi].w * 1.05 }} kind={sl.kind} t={t} seed={"b" + i + mi} glow={C.cyan} glowAmt={zg} />;
            })}
            {/* rejilla de zonas */}
            {t > zonesT &&
              D2.filter((s) => s.mon === mi).map((sl, i) => {
                const r = inside({ x: 0, y: 0, w: S[mi].w, h: S[mi].h }, sl.f, 5);
                const zk = ease.out(clamp01((t - zonesT - i * 0.06) / 0.25));
                return (
                  <div key={"z" + i} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 8, border: `3px solid ${C.cyan}`, background: `${C.cyan}22`, opacity: zk * (1 - 0.6 * clamp01((t - zonesT - 0.5) / 0.5)), boxShadow: `0 0 30px ${C.cyan}88`, transform: `scale(${1.06 - 0.06 * zk})` }}>
                    <div style={{ position: "absolute", left: 12, top: 10, fontFamily: "InterX", fontWeight: 800, fontSize: L.V ? 30 : 32, color: C.cyan }}>{i + 1}</div>
                  </div>
                );
              })}
          </div>
        ))}
      {/* indicador de escritorio */}
      {t > switchT - 0.1 && t < a(4, 0) && (
        <div style={{ position: "absolute", left: M[0].x + M[0].w / 2, top: M[0].y - 34, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * E(t, switchT - 0.1, 0.25)})`, opacity: E(t, switchT - 0.1, 0.2), display: "flex", gap: 10, fontFamily: "InterX", fontWeight: 700, fontSize: L.V ? 34 : 24 }}>
          {[1, 2].map((d) => {
            const on = d === 2 ? sw > 0.5 : sw <= 0.5;
            return (
              <div key={d} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 99, border: `1.5px solid ${on ? C.cyan : "rgba(255,255,255,.15)"}`, background: on ? `${C.cyan}22` : "rgba(255,255,255,.04)", color: on ? C.ink : C.dim }}>
                <Icon name="layers" size={L.V ? 28 : 20} /> Escritorio {d}
              </div>
            );
          })}
        </div>
      )}
      <Linea t={t} x={th.x} y={th.y} size={th.size} maxW={th.maxW} entrada="rise"
        palabras={[{ w: "Cada", at: a(2, 0), out: a(3, 0) - 0.1 }, { w: "app", at: a(2, 0.5), out: a(3, 0) - 0.1 }, { w: "en su", at: a(2, 1), out: a(3, 0) - 0.1 }, { w: "pantalla,", at: a(2, 1.5), out: a(3, 0) - 0.1, color: C.cyan }]} />
      <Linea t={t} x={th.x} y={th.y} size={th.size} maxW={th.maxW} entrada="rise"
        palabras={[{ w: "su", at: a(3, 0), out: a(4, 0) - 0.1 }, { w: "escritorio", at: a(3, 0.5), out: a(4, 0) - 0.1 }, { w: "y su", at: a(3, 2), out: a(4, 0) - 0.1 }, { w: "zona.", at: a(3, 2.5), out: a(4, 0) - 0.1, color: C.cyan, mark: C.cyan }]} />
    </>
  );
};

// ═════════ SUBIDA B: captura del escritorio y perfiles de pantallas ═════════
export const SubidaB: React.FC<{ t: number; L: Layout }> = ({ t, L }) => {
  const a = (c: number, p = 0) => at("subidaB", c, p);
  const th = topHead(L);
  const M = monitors(L);
  const S = M.map(screenOf);
  const shot = a(0, 2);
  const capK = 1 - 0.65 * E(t, a(1, 0) - 0.15, 0.3);
  const monOut = 1 - E(t, a(2, 0) - 0.15, 0.25);
  // portátil + monitor (compases 3–4)
  const lapA: Rect = L.V ? { x: 240, y: 860, w: 600, h: 380 } : { x: 660, y: 360, w: 600, h: 380 };
  const lapB: Rect = L.V ? { x: 290, y: 1250, w: 500, h: 316 } : { x: 210, y: 470, w: 520, h: 330 };
  const monB: Rect = L.V ? { x: 140, y: 600, w: 800, h: 450 } : { x: 860, y: 240, w: 880, h: 495 };
  const plug = a(2, 2);
  const lk = ease.inOut(clamp01((t - plug + 0.3) / 0.35));
  const lap = lerpRect(lapA, lapB, lk);
  const mk = ease.out(clamp01((t - plug + 0.3) / 0.32));
  const mon: Rect = { ...monB, x: monB.x + (1 - mk) * (L.V ? 900 : 1100) };
  const lapIn = E(t, a(2, 0) - 0.2, 0.3);
  const LS = laptopScreen(lap), MS = screenOf(mon);
  const power = clamp01((t - plug - 0.05) / 0.25);
  // ventanas del portátil que saltan al monitor
  const jumps = [a(3, 1), a(3, 1.5), a(3, 2)];
  const wins: { kind: Kind; small: Rect; big: Rect; onMon: boolean }[] = [
    { kind: "code", small: { x: 0, y: 0, w: 0.6, h: 1 }, big: { x: 0, y: 0, w: 0.62, h: 1 }, onMon: true },
    { kind: "browser", small: { x: 0.6, y: 0, w: 0.4, h: 0.5 }, big: { x: 0.62, y: 0, w: 0.38, h: 1 }, onMon: true },
    { kind: "music", small: { x: 0.6, y: 0.5, w: 0.4, h: 0.5 }, big: { x: 0, y: 0, w: 1, h: 1 }, onMon: false },
  ];
  const push = 1 + 0.07 * ease.in(clamp01((t - a(3, 0)) / (a(4, 0) - a(3, 0))));
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: "50% 50%" }}>
      {/* compás 1–2: lo que ya tienes abierto → captura */}
      {monOut > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: capK * monOut }}>
          {M.map((m, i) => (
            <Monitor key={i} r={m} />
          ))}
          {D2.map((sl, i) => {
            const r = inside(S[sl.mon], sl.f, 5);
            const dk = ease.out(clamp01((t - shot - i * 0.075) / 0.2));
            return (
              <React.Fragment key={i}>
                <Win r={r} kind={sl.kind} t={t} seed={"b" + (sl.mon === 0 ? i : i - 2) + sl.mon} />
                {dk > 0 && <div style={{ position: "absolute", left: r.x - 4, top: r.y - 4, width: r.w + 8, height: r.h + 8, borderRadius: 10, border: `3px dashed ${C.cyan}`, opacity: dk, boxShadow: `0 0 24px ${C.cyan}66`, transform: `scale(${1.08 - 0.08 * dk})` }} />}
              </React.Fragment>
            );
          })}
          {/* barrido de lectura */}
          {t > shot && t < shot + 1.2 &&
            M.map((m, i) => {
              const k = clamp01((t - shot) / 1.1);
              return <div key={"s" + i} style={{ position: "absolute", left: m.x, top: m.y + m.h * k, width: m.w, height: 4, background: C.cyan, boxShadow: `0 0 30px 6px ${C.cyan}`, opacity: Math.sin(Math.PI * k) }} />;
            })}
        </div>
      )}
      <Linea t={t} x={th.x} y={th.y} size={th.size} maxW={th.maxW} entrada="rise"
        palabras={[{ w: "¿Ya lo", at: a(0, 0), out: shot - 0.22 }, { w: "tienes", at: a(0, 0.5), out: shot - 0.22 }, { w: "abierto?", at: a(0, 1), out: shot - 0.22 }]} />
      <Linea t={t} x={th.x} y={th.y} size={th.size * 1.25} maxW={th.maxW} entrada="slam" glow={30}
        palabras={[{ w: "Captúralo.", at: shot, out: a(2, 0) - 0.12, color: C.cyan }]} />
      <Float t={t} at={a(1, 0)} x={L.cx} y={L.V ? 1000 : 600} s={L.V ? 1.95 : 1.75} w={470} out={a(2, 0) - 0.15}>
        <CaptureCard
          t={t} at={a(1, 0)} dur={a(2, 0) - a(1, 0) - 0.2}
          chips={[
            { label: "Monitores", icon: "monitor", at: a(1, 0) },
            { label: "Ventanas", icon: "appWindow", at: a(1, 1) },
            { label: "Zonas CZE", icon: "layoutGrid", at: a(1, 2) },
            { label: "Pestañas web", icon: "globe", at: a(1, 3) },
          ]}
        />
      </Float>
      {/* compás 3–4: cambias de pantallas → se adapta solo */}
      {lapIn > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: lapIn }}>
          {mk > 0 && <Monitor r={mon} power={power} edge={C.cyan} edgeAmt={power * (t < a(3, 3) ? 0.7 : 0.3)} />}
          <Laptop r={lap} />
          {wins.map((w, i) => {
            const jk = ease.out(clamp01((t - jumps[i] + 0.22) / 0.24));
            const from = inside(LS, w.small, 4);
            const to = w.onMon ? inside(MS, w.big, 5) : inside(LS, w.big, 4);
            return <Win key={i} r={lerpRect(from, to, jk)} kind={w.kind} t={t} seed={"l" + i} glow={C.green} glowAmt={t > jumps[i] ? 0.8 * (1 - clamp01((t - jumps[i]) / 0.5)) : 0} />;
          })}
          {/* chispa del enchufe */}
          {t > plug && t < plug + 0.5 && (
            <div style={{ position: "absolute", left: mon.x - 10, top: mon.y + mon.h / 2 - 60, width: 120, height: 120, borderRadius: 99, background: `radial-gradient(circle, ${C.cyan}, transparent 70%)`, opacity: 1 - (t - plug) / 0.5, transform: `scale(${1 + (t - plug) * 3})` }} />
          )}
        </div>
      )}
      <Linea t={t} x={th.x} y={th.y} size={th.size} maxW={th.maxW} entrada="rise"
        palabras={[{ w: "¿Cambias", at: a(2, 0), out: a(3, 2) - 0.24 }, { w: "de", at: a(2, 0.5), out: a(3, 2) - 0.24 }, { w: "pantallas?", at: a(2, 1), out: a(3, 2) - 0.24 }]} />
      <Linea t={t} x={th.x} y={th.y} size={th.size * 1.1} maxW={th.maxW} entrada="slam"
        palabras={[{ w: "Se adapta", at: a(3, 2), out: a(4, 0) - 0.03 }, { w: "solo.", at: a(3, 3), out: a(4, 0) - 0.03, color: C.green }]} />
      <Float t={t} at={a(3, 0)} x={L.V ? L.cx : 1300} y={L.V ? 1760 : 930} s={L.V ? 1.75 : 1.3} w={420} out={a(4, 0) - 0.05}>
        <ProfileCard t={t} name="Casa · 2 pantallas" at={a(3, 0.5)} />
      </Float>
    </div>
  );
};
