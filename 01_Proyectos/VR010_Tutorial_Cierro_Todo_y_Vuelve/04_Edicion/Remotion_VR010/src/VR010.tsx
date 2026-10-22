import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Sequence, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio, Video } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import cfg from "../edit.config.json";

const ANTON = "Anton, Impact, sans-serif";
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeIO = Easing.bezier(0.65, 0, 0.35, 1);
const decay = (t: number, from: number, tau: number) => (t < from ? 0 : Math.exp(-(t - from) / tau));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

const SRC_W = 2560, SRC_H = 1440, VIEW_W = 1080, VIEW_CY = 880;

// ───────── cámara: recorte vertical animado sobre el vídeo 16:9 ─────────
type Key = { t: number; cx: number; cy: number; s: number; H: number };
const camera = (t: number): Key => {
  const K = cfg.camera as Key[];
  if (t <= K[0].t) return K[0];
  for (let i = 0; i < K.length - 1; i++) {
    const a = K[i], b = K[i + 1];
    if (t <= b.t) {
      const k = easeIO(clamp01((t - a.t) / (b.t - a.t)));
      return { t, cx: lerp(a.cx, b.cx, k), cy: lerp(a.cy, b.cy, k), s: lerp(a.s, b.s, k), H: lerp(a.H, b.H, k) };
    }
  }
  return K[K.length - 1];
};

// ───────── piezas comunes (mismo estilo que VR009) ─────────
const Cap: React.FC<{ t: number; from: number; to: number; text: string; y: number; size?: number; color?: string; bumps?: number[] }> = ({
  t, from, to, text, y, size = 110, color = "#fff", bumps = [],
}) => {
  if (t < from || t > to + 0.2) return null;
  const a = clamp01((t - from) / 0.16) * (1 - clamp01((t - to) / 0.14));
  const rise = (1 - easeOut(clamp01((t - from) / 0.28))) * 30;
  const bump = bumps.reduce((s, b) => s + 0.1 * decay(t, b, 0.1), 0);
  return (
    <div
      style={{
        position: "absolute", left: 0, right: 0, top: y + rise, display: "flex", justifyContent: "center",
        padding: "0 34px", textAlign: "center", transform: `scale(${1 + bump})`, opacity: a,
        fontFamily: ANTON, fontSize: size, lineHeight: 1.02, letterSpacing: 2, color,
        WebkitTextStroke: `${Math.round(size * 0.09)}px #000`, paintOrder: "stroke fill", whiteSpace: "pre-line",
      }}
    >
      {text}
    </div>
  );
};

const Pill: React.FC<{ t: number; at: number; to: number; x: number; y: number; text: string }> = ({ t, at, to, x, y, text }) => {
  if (t < at || t > to + 0.2) return null;
  const k = easeOut(clamp01((t - at) / 0.3));
  const out = 1 - clamp01((t - to) / 0.15);
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, transform: `scale(${0.4 + 0.6 * k + 0.08 * decay(t, at, 0.12)})`, transformOrigin: "left center", opacity: k * out,
        padding: "6px 24px 10px", borderRadius: 16, background: "#33ff7a", color: "#04110a", fontFamily: ANTON, fontSize: 52, letterSpacing: 3, whiteSpace: "nowrap",
        boxShadow: "0 0 24px rgba(51,255,122,0.55)",
      }}
    >
      ✓ {text}
    </div>
  );
};

const At: React.FC<{ t: number; src: string; volume: number }> = ({ t, src, volume }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(t * fps))} layout="none">
      <Audio src={staticFile(src)} volume={volume} />
    </Sequence>
  );
};

const useFonts = () => {
  const [h] = useState(() => delayRender("fuentes"));
  useEffect(() => {
    loadFont({ family: "Anton", url: staticFile("fonts/Anton-Regular.woff2"), weight: "400" }).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
};

const Bg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(900px 700px at 50% 42%, rgba(30,160,210,0.18), transparent 70%), radial-gradient(1200px 900px at 50% 100%, rgba(10,60,90,0.32), transparent 70%), #04070c",
    }}
  />
);

// Cortes duros del montaje (para flash + whoosh)
const CUTS = [cfg.t.close, 4.8, cfg.t.launch, cfg.t.win1, cfg.t.result];

export const VR010: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const T = cfg.t;
  const D = cfg.duration;
  useFonts();

  const c = camera(t);
  const cx = Math.max(VIEW_W / 2 / c.s, Math.min(SRC_W - VIEW_W / 2 / c.s, c.cx));
  const cy = Math.max(c.H / 2 / c.s, Math.min(SRC_H - c.H / 2 / c.s, c.cy));
  const shake = 5 * decay(t, T.click, 0.1) + 4 * decay(t, T.win1, 0.1) + 4 * decay(t, T.win2, 0.1) + 4 * decay(t, T.win3, 0.1) + 5 * decay(t, T.page, 0.1) + 6 * decay(t, T.result, 0.12);
  const flash = CUTS.reduce((s, b) => s + 0.35 * decay(t, b, 0.07), 0) + 0.5 * decay(t, 0, 0.06);
  const frameGlow = t >= T.result ? 0.55 + 0.45 * easeOut(clamp01((t - T.result) / 0.6)) : 0.3;

  return (
    <AbsoluteFill style={{ background: "#04070c", overflow: "hidden" }}>
      <Bg />
      {/* pantalla: recorte animado */}
      <div
        style={{
          position: "absolute", left: 0, top: VIEW_CY - c.H / 2 + shake * Math.sin(frame * 3.1), width: VIEW_W, height: c.H, overflow: "hidden",
          borderRadius: 22, boxShadow: `0 0 0 3px rgba(127,240,255,${frameGlow}), 0 0 60px rgba(30,160,210,${frameGlow * 0.45})`,
        }}
      >
        <Video
          src={staticFile("media/main.mp4")} muted
          style={{ position: "absolute", width: SRC_W * c.s, height: SRC_H * c.s, left: VIEW_W / 2 - cx * c.s, top: c.H / 2 - cy * c.s }}
        />
      </div>

      {/* textos: arriba la idea, abajo el «yo» */}
      <Cap t={t} from={0.1} to={2.3} y={110} text={"ESTE ES MI ESCRITORIO\nDE TRABAJO"} size={90} />
      <Cap t={t} from={1.25} to={2.3} y={1470} text={"VOY A CERRAR TODO"} size={86} color="#ffe14a" bumps={[1.25]} />
      <Cap t={t} from={T.close} to={4.7} y={95} text={"LO CIERRO\nTODO"} size={106} color="#7ff0ff" bumps={[T.close]} />
      <Cap t={t} from={T.close + 0.5} to={4.7} y={1480} text={"ADIÓS, VENTANAS 👋"} size={80} color="#ffe14a" />
      <Cap t={t} from={4.8} to={5.7} y={150} text={"UN CLIC"} size={170} color="#ffe14a" bumps={[T.click]} />
      <Cap t={t} from={T.launch} to={T.win1 - 0.05} y={110} text={"Y ÉL SOLO…"} size={120} color="#7ff0ff" bumps={[T.launch]} />
      <Cap t={t} from={T.launch + 0.35} to={T.win1 - 0.05} y={1480} text={"…LO ABRE Y LO COLOCA"} size={74} color="#ffe14a" />
      <Cap t={t} from={T.win1} to={T.result - 0.05} y={100} text={"SE ABRE TODO\nY EN SU SITIO"} size={94} color="#7ff0ff" />
      <Pill t={t} at={T.win1 + 0.05} to={T.result - 0.05} x={34} y={1470} text="EDITOR" />
      <Pill t={t} at={T.win2 + 0.05} to={T.result - 0.05} x={338} y={1470} text="TERMINAL" />
      <Pill t={t} at={T.win3 + 0.05} to={T.result - 0.05} x={690} y={1470} text="WEB" />
      <Cap t={t} from={T.result} to={D} y={95} text={"TODO COMO\nLO DEJÉ"} size={106} color="#7ff0ff" bumps={[T.result]} />
      <Cap t={t} from={T.result + 0.3} to={D} y={1300} text={"3 APPS · 1 CLIC"} size={96} color="#ffe14a" bumps={[T.result + 0.3]} />

      {/* flash de corte */}
      <AbsoluteFill style={{ background: "#fff", opacity: Math.min(0.6, flash), pointerEvents: "none" }} />

      {/* audio: golpe de gancho, whoosh en cada corte, clic, riser en la carga, pop por ventana, ding final */}
      <At t={0} src="audio/boom.wav" volume={0.5} />
      {CUTS.map((s) => (
        <At key={s} t={s - 0.04} src="audio/whoosh.wav" volume={0.28} />
      ))}
      <At t={T.click} src="audio/hit.wav" volume={0.45} />
      <At t={T.launch} src="audio/riser.wav" volume={0.3} />
      {[T.win1, T.win2, T.win3, T.page].map((s) => (
        <At key={s} t={s} src="audio/pop.wav" volume={0.35} />
      ))}
      <At t={T.result + 0.1} src="audio/ding.wav" volume={0.45} />
    </AbsoluteFill>
  );
};
