import React from "react";
import { at } from "../ritmo";
import { Img, staticFile } from "remotion";
import { C, clamp01, E, ease, Layout } from "../theme";
import { Eyebrow, Linea, Palabra } from "../components/Kinetic";
import { UICard } from "../components/UICard";
import { Icon, IconName } from "../components/Bits";
import { AgentCard, AGENTES, ChoiceCard, DictationCard, Float, Glass, NoticeCard, T } from "../components/Osd";
import { cardBox, head } from "./Subidas";

// DROP (8 compases): una función por compás; el último, ráfaga en corcheas.
const Titulo: React.FC<{ t: number; L: Layout; c: number; eyebrow: string; color: string; words: [string, number, string?][] }> = ({ t, L, c, eyebrow, color, words }) => {
  const h = head(L);
  const a = (p: number) => at("drop", c, p);
  const out = at("drop", c + 1, 0) - 0.14;
  const pal: Palabra[] = words.map(([w, p, col]) => ({ w, at: a(p), out, color: col }));
  return (
    <>
      <Eyebrow t={t} at={a(0) - 0.05} x={h.ey.x} y={h.ey.y} text={eyebrow} color={color} align={h.align} out={out} />
      <Linea t={t} x={h.x} y={h.y} size={h.size} maxW={h.maxW} align={h.align} entrada="slam" palabras={pal} />
    </>
  );
};

const vis = (t: number, c: number) => t > at("drop", c, 0) - 0.4 && t < at("drop", c + 1, 0) + 0.3;

export const Drop: React.FC<{ t: number; L: Layout }> = ({ t, L }) => {
  const cb = cardBox(L);
  const a = (c: number, p = 0) => at("drop", c, p);
  const nx = (c: number) => a(c + 1, 0) - 0.16;
  const V = L.V;
  return (
    <>
      {/* 1 · Omnibar REAL */}
      {vis(t, 0) && (
        <>
          <Titulo t={t} L={L} c={0} eyebrow="Omnibar" color={C.ai} words={[["Desde", 0], ["cualquier", 0.5], ["app.", 1, C.ai]]} />
          <UICard t={t} src="img/ui/omnibar.jpg" iw={2367} ih={1386} cx={cb.cx} cy={cb.cy - (V ? 60 : 0)} w={cb.w} maxH={cb.maxH} at={a(0, 0) + 0.08}
            from={{ rx: 60, ry: 0, y: 500, s: 0.7 }}
            zoom={[{ at: a(0, 2) - 0.1, d: 0.45, r: { x: 0, y: 0.43, w: 1, h: 0.3 }, s: V ? 1.35 : 1.3 }]}
            glows={[{ r: { x: 0.018, y: 0.527, w: 0.476, h: 0.105 }, at: a(0, 2.5), color: C.ai, dur: 1.2 }, { r: { x: 0.5, y: 0.527, w: 0.476, h: 0.105 }, at: a(0, 3), color: C.ai, dur: 0.8 }]}
            out={nx(0)} outMode="fly" />
        </>
      )}
      {/* 2 · Asistente de voz REAL */}
      {vis(t, 1) && (
        <>
          <Titulo t={t} L={L} c={1} eyebrow="Asistente de voz" color={C.ai} words={[["Díselo", 0], ["en voz", 0.5], ["alta.", 1, C.ai]]} />
          <UICard t={t} src="img/ui/voz.jpg" iw={2400} ih={966} cx={cb.cx} cy={cb.cy - (V ? 60 : 0)} w={V ? 1040 : cb.w} at={a(1, 0) + 0.08}
            from={{ rx: 0, ry: 70, x: 600, y: 0, s: 0.75 }}
            zoom={[{ at: a(1, 2) - 0.1, d: 0.45, r: { x: 0.43, y: 0.12, w: 0.45, h: 0.76 }, s: V ? 1.7 : 1.55 }]}
            out={nx(1)} outMode="fall">
            {[0, 1, 2, 3].map((p) => {
              const d = t - a(1, p);
              if (d < 0 || d > 0.8) return null;
              const k = d / 0.8;
              return <div key={p} style={{ position: "absolute", left: "19%", top: "50%", width: `${20 + 22 * k}%`, aspectRatio: "1", transform: "translate(-50%,-50%)", borderRadius: 999, border: `3px solid ${C.cyan}`, opacity: (1 - k) * 0.8, boxShadow: `0 0 30px ${C.cyan}` }} />;
            })}
          </UICard>
        </>
      )}
      {/* 3 · Chat con IA REAL */}
      {vis(t, 2) && (
        <>
          <Titulo t={t} L={L} c={2} eyebrow="Chat con IA" color={C.ai} words={[["La IA", 0, C.ai], ["te monta", 0.5], ["el workspace.", 1]]} />
          <UICard t={t} src="img/ui/chat.jpg" iw={1947} ih={1092} cx={cb.cx} cy={cb.cy - (V ? 60 : 0)} w={cb.w} maxH={cb.maxH} at={a(2, 0) + 0.08}
            from={{ rx: -55, ry: 10, y: -500, s: 0.75 }}
            glows={[{ r: { x: 0.005, y: 0.07, w: 0.99, h: 0.41 }, at: a(2, 1), color: C.ai, dur: 0.9, radius: 14 }]}
            zoom={[{ at: a(2, 2) - 0.1, d: 0.45, r: { x: 0, y: 0.08, w: 0.55, h: 0.34 }, s: V ? 1.9 : 1.6 }]}
            out={nx(2)} outMode="scale" />
        </>
      )}
      {/* 4 · Transcriptor */}
      {vis(t, 3) && (
        <>
          <Titulo t={t} L={L} c={3} eyebrow="Transcriptor" color={C.cyan} words={[["Dicta", 0], ["en cualquier", 0.5], ["app.", 1, C.cyan]]} />
          <Float t={t} at={a(3, 0) + 0.05} x={cb.cx} y={cb.cy - (V ? 170 : 110)} s={V ? 1.85 : 1.6} w={520} out={nx(3)}>
            <Glass style={{ width: 520, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: T.muted, marginBottom: 10 }}>Mensaje</div>
              <div style={{ minHeight: 64, padding: "12px 14px", borderRadius: 11, background: "rgba(255,255,255,.04)", border: `1px solid ${t > a(3, 3) ? T.accentEdge : T.tileEdge}`, fontSize: 16, lineHeight: 1.45, color: T.strong }}>
                {t < a(3, 3) ? (
                  <span style={{ color: T.faint }}>Escribe un mensaje…<span style={{ display: "inline-block", width: 2, height: 19, marginLeft: 2, verticalAlign: -3, background: T.ai, opacity: Math.floor(t * 2.4) % 2 ? 0 : 1 }} /></span>
                ) : (
                  <span>Te paso el informe en cinco minutos.<span style={{ display: "inline-block", width: 2, height: 19, marginLeft: 2, verticalAlign: -3, background: T.ai }} /></span>
                )}
              </div>
            </Glass>
          </Float>
          <Float t={t} at={a(3, 0.5)} x={cb.cx} y={cb.cy + (V ? 230 : 190)} s={V ? 2.0 : 1.75} w={340} out={nx(3)}>
            <DictationCard t={t} state={t < a(3, 2) ? "listening" : t < a(3, 3) ? "transcribing" : "pasted"} since={a(3, 2)} />
          </Float>
        </>
      )}
      {/* 5 · Agentes de IA conectados por MCP */}
      {vis(t, 4) && (
        <>
          <Titulo t={t} L={L} c={4} eyebrow="Agentes de IA · MCP" color={C.ai} words={[["Conecta", 0], ["tu agente", 0.5], ["de IA.", 1, C.ai]]} />
          {AGENTES.map((ag, i) => {
            const s = V ? 1.5 : 1.3;
            const cw = 190 * s, gap = 24;
            const row = i < 3 ? 0 : 1;
            const inRow = row === 0 ? 3 : 2;
            const col = row === 0 ? i : i - 3;
            const x = cb.cx - ((inRow * cw + (inRow - 1) * gap) / 2) + col * (cw + gap) + cw / 2;
            const y = cb.cy - (V ? 120 : 30) + (row === 0 ? -1 : 1) * (V ? 120 : 105);
            return (
              <Float key={i} t={t} at={a(4, i * 0.25) + 0.05} x={x} y={y} s={s} w={190} out={nx(4)} from={60}>
                <AgentCard t={t} a={ag} on={a(4, 2 + i * 0.25)} />
              </Float>
            );
          })}
        </>
      )}
      {/* 6 · Rutinas sugeridas */}
      {vis(t, 5) && (
        <>
          <Titulo t={t} L={L} c={5} eyebrow="Rutinas sugeridas" color={C.amber} words={[["Detecta", 0], ["tus", 0.5], ["rutinas.", 1, C.amber]]} />
          <Float t={t} at={a(5, 0) + 0.05} x={cb.cx} y={cb.cy - (V ? 80 : 0)} s={V ? 2.1 : 1.7} w={440} out={nx(5)}>
            <ChoiceCard
              t={t} kicker="Rutina" icon="calendarClock" question="¿Lo guardo como workspace?"
              context="Llevas 3 días abriendo VS Code, Chrome y Spotify sobre las 9:00."
              press={a(5, 3)}
              options={[
                { label: "Guardarlo como workspace", hint: "Revisas qué ventanas entran antes de guardar", rec: true, k: E(t, a(5, 1), 0.2) },
                { label: "Ahora no", k: E(t, a(5, 1.25), 0.2) },
                { label: "No volver a sugerirlo", k: E(t, a(5, 1.5), 0.2) },
              ]}
            />
          </Float>
        </>
      )}
      {/* 7 · Avisos del asistente */}
      {vis(t, 6) && (
        <>
          <Titulo t={t} L={L} c={6} eyebrow="Avisos del asistente" color={C.amber} words={[["Te avisa", 0], ["si algo", 0.5], ["falla.", 1, C.coral]]} />
          <Float t={t} at={a(6, 0) + 0.05} x={cb.cx} y={cb.cy - (V ? 80 : 0)} s={V ? 2.15 : 1.75} w={430} out={nx(6)}>
            <NoticeCard t={t} title="Asistente" text="«Focus» se abrió a medias: no arrancaron Spotify." action="Reintentar lo que falta" press={a(6, 2.5)} />
          </Float>
        </>
      )}
      {/* 8 · ráfaga en corcheas */}
      {vis(t, 7) && <Rafaga t={t} L={L} />}
    </>
  );
};

const ITEMS: { w: string; icon: IconName; img?: string; iw?: number; ih?: number }[] = [
  { w: "Layouts", icon: "layoutGrid", img: "img/ui/layouts.jpg", iw: 1533, ih: 1041 },
  { w: "Escritorios virtuales", icon: "layers" },
  { w: "Gestos del ratón", icon: "mouse", img: "img/ui/gestos.jpg", iw: 2094, ih: 1530 },
  { w: "Atajos", icon: "keyboard" },
  { w: "Fijar ventanas", icon: "pin" },
  { w: "Limpiar", icon: "eraser" },
  { w: "Notas rápidas", icon: "stickyNote" },
  { w: "Temporizadores", icon: "timer" },
];
const Rafaga: React.FC<{ t: number; L: Layout }> = ({ t, L }) => {
  const V = L.V;
  return (
    <>
      {ITEMS.map((it, i) => {
        const ts = at("drop", 7, i * 0.5);
        const te = at("drop", 7, i * 0.5 + 0.5);
        if (t < ts - 0.02 || t >= te) return null;
        const k = ease.out(clamp01((t - ts) / 0.12));
        const tint = i % 2 ? C.cyan : C.amber;
        return (
          <React.Fragment key={i}>
            {it.img && (
              <div style={{ position: "absolute", left: L.cx, top: L.cy, transform: `translate(-50%,-50%) scale(${1.25 - 0.1 * k}) rotate(${i % 4 === 0 ? -3 : 3}deg)`, opacity: 0.32 }}>
                <Img src={staticFile(it.img)} style={{ width: V ? 1000 : 1500, borderRadius: 18, display: "block", filter: "blur(1px)" }} />
              </div>
            )}
            <div style={{ position: "absolute", left: 0, top: 0, width: L.W, height: L.H, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 34 }}>
              <div style={{ display: "grid", placeItems: "center", width: V ? 170 : 160, height: V ? 170 : 160, borderRadius: 42, color: tint, background: `${tint}1c`, border: `2px solid ${tint}66`, boxShadow: `0 0 60px ${tint}55`, transform: `scale(${0.6 + 0.4 * k}) rotate(${(1 - k) * (i % 2 ? 20 : -20)}deg)` }}>
                <Icon name={it.icon} size={V ? 92 : 86} stroke={1.7} />
              </div>
              <div style={{ fontFamily: "InterX", fontWeight: 800, fontSize: V ? (it.w.length > 14 ? 92 : 110) : 120, letterSpacing: "-0.035em", color: C.ink, textAlign: "center", lineHeight: 1.02, maxWidth: V ? 980 : 1700, transform: `scale(${1.3 - 0.3 * k})`, filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined, textShadow: "0 8px 40px rgba(0,0,0,.6)" }}>
                {it.w}
              </div>
            </div>
          </React.Fragment>
        );
      })}
      {/* contador de progreso en corcheas */}
      <div style={{ position: "absolute", left: L.cx, top: L.V ? 1560 : 930, transform: "translateX(-50%)", display: "flex", gap: 12 }}>
        {ITEMS.map((_, i) => {
          const on = t >= at("drop", 7, i * 0.5);
          return <div key={i} style={{ width: 34, height: 6, borderRadius: 6, background: on ? (i % 2 ? C.cyan : C.amber) : "rgba(255,255,255,.12)" }} />;
        })}
      </div>
    </>
  );
};
