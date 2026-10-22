import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Img, Sequence, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio, Video } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import cfg from "../edit.config.json";

const ANTON = "Anton, Impact, sans-serif";
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const decay = (t: number, from: number, tau: number) => (t < from ? 0 : Math.exp(-(t - from) / tau));

// ───────── piezas comunes ─────────
const Cap: React.FC<{ t: number; from: number; to: number; text: string; y: number; size?: number; color?: string; bumps?: number[] }> = ({
  t, from, to, text, y, size = 110, color = "#fff", bumps = [],
}) => {
  if (t < from || t > to + 0.2) return null;
  const a = clamp01((t - from) / 0.18) * (1 - clamp01((t - to) / 0.18));
  const rise = (1 - easeOut(clamp01((t - from) / 0.28))) * 26;
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

// Meme flotante: sin marco, bordes difuminados, sube y baja suavemente
const Float: React.FC<{ t: number; from: number; to: number; x: number; y: number; w: number; h: number; src: string; rot?: number }> = ({
  t, from, to, x, y, w, h, src, rot = 0,
}) => {
  if (t < from || t > to + 0.4) return null;
  const a = clamp01((t - from) / 0.35) * (1 - clamp01((t - to) / 0.35));
  const k = t - from;
  return (
    <div style={{ position: "absolute", left: x, top: y + Math.sin(k * 2.3) * 10, width: w, height: h, opacity: a, transform: `rotate(${rot + Math.sin(k * 1.6) * 2}deg) scale(${0.9 + 0.1 * easeOut(clamp01(k / 0.5))})` }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "contain", WebkitMaskImage: "radial-gradient(ellipse 72% 72% at 50% 50%, #000 62%, transparent 100%)" }} />
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

const Panel: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode; color?: string; opacity?: number }> = ({ x, y, w, h, children, color = "rgba(255,255,255,0.22)", opacity = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 22, overflow: "hidden", boxShadow: `0 0 0 3px ${color}`, opacity }}>{children}</div>
);

// Etiqueta de quién hace cada cosa
const Tag: React.FC<{ x: number; y: number; text: string; bg: string; fg?: string }> = ({ x, y, text, bg, fg = "#04070c" }) => (
  <div style={{ position: "absolute", left: x, top: y, padding: "6px 22px 8px", borderRadius: 14, background: bg, color: fg, fontFamily: ANTON, fontSize: 44, letterSpacing: 3 }}>{text}</div>
);

// Instantes en que aparece una ventana en la demo (detectados con ffmpeg scene sobre asist_full.mp4): un pop suave por cada una
const WINDOW_POPS = [3.15, 6.4, 7.3, 7.85, 9.3, 10.7, 11.85];

// ═════════ VR009 · «Mi PC y yo trabajando en un proyecto» ═════════
export const VR009: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const T = cfg.t;
  const D = cfg.duration;
  useFonts();
  const zoom = 1 + 0.03 * (t / D) + 0.05 * decay(t, T.organize, 0.4) + 0.03 * decay(t, T.browser, 0.3);
  const shake = 6 * decay(t, T.think, 0.12) + 5 * decay(t, T.browser, 0.1) + 6 * decay(t, T.organize, 0.1) + 5 * decay(t, T.done, 0.12);
  const end = clamp01((t - T.done) / 0.4);
  return (
    <AbsoluteFill style={{ background: "#04070c", overflow: "hidden" }}>
      <Bg />
      <AbsoluteFill style={{ transform: `translate(${shake * Math.sin(frame * 3.1)}px, ${shake * Math.cos(frame * 2.3)}px) scale(${zoom})` }}>
        <Panel x={0} y={340} w={1080} h={608}>
          <Video src={staticFile("media/asist_full.mp4")} muted style={{ width: 1080, height: 608 }} />
        </Panel>
        <Panel x={90} y={1000} w={900} h={600} color="rgba(51,255,122,0.5)" opacity={1 - 0.55 * end}>
          <Video src={staticFile("media/asist_card.mp4")} muted style={{ width: 900, height: 600 }} />
        </Panel>
        <Tag x={28} y={360} text="MI PC" bg="#7ff0ff" />
        <Tag x={118} y={1020} text="YO → MI PC" bg="#ffe14a" />
      </AbsoluteFill>

      {/* textos */}
      <Cap t={t} from={0.05} to={2.9} y={40} text={"MI PC Y YO\nTRABAJANDO\nEN UN PROYECTO"} size={92} />
      <Cap t={t} from={T.browser - 0.2} to={T.organize - 0.7} y={150} text={"MI PC:\nABRE TODO"} size={104} color="#7ff0ff" />
      <Cap t={t} from={T.browser - 0.2} to={T.organize - 0.7} y={1640} text={"YO: UNA FRASE"} size={92} color="#ffe14a" bumps={[T.browser]} />
      <Cap t={t} from={T.organize - 0.4} to={T.done - 0.1} y={150} text={"MI PC:\nLAS COLOCA"} size={104} color="#7ff0ff" bumps={[T.organize]} />
      <Cap t={t} from={T.organize - 0.4} to={T.done - 0.1} y={1640} text={"YO: OTRA FRASE"} size={92} color="#ffe14a" />
      <Cap t={t} from={T.done} to={D} y={150} text={"TRABAJO\nEN EQUIPO 🤝"} size={104} color="#7ff0ff" />
      <Cap t={t} from={T.done + 0.1} to={D} y={1690} text={"YO, HOY: TRABAJÉ\nMUCHÍSIMO 😎"} size={78} color="#ffe14a" />

      {/* memes flotando: reacción al terminar, y el «yo» que no ha movido un dedo */}
      <Float t={t} from={T.browser + 0.1} to={T.browser + 1.9} x={640} y={1300} w={400} h={190} src="img/scream.jpg" rot={4} />
      <Float t={t} from={T.organize + 0.2} to={T.organize + 2.2} x={560} y={1300} w={480} h={270} src="img/yo.jpg" rot={3} />
      <Float t={t} from={T.done + 0.05} to={D} x={190} y={1150} w={700} h={525} src="img/chill.jpg" rot={-3} />

      {/* audio: golpe de gancho, pop al hablar, whoosh al abrir, hit al colocar, ding al terminar + voz */}
      <At t={0} src="audio/boom.wav" volume={0.5} />
      <At t={T.think} src="audio/pop.wav" volume={0.6} />
      <At t={T.browser} src="audio/whoosh.wav" volume={0.3} />
      {WINDOW_POPS.map((s) => (
        <At key={s} t={s} src="audio/pop.wav" volume={0.16} />
      ))}
      <At t={T.organize} src="audio/hit.wav" volume={0.4} />
      <At t={T.done} src="audio/ding.wav" volume={0.45} />
      {cfg.vo.map((v) => (
        <At key={v.file} t={v.at} src={"audio/" + v.file} volume={1} />
      ))}
    </AbsoluteFill>
  );
};