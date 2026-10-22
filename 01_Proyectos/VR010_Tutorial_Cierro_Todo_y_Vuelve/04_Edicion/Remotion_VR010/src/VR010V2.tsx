import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Easing, Sequence, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio, Video } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import cfg from "../edit.v2.json";
import words from "./palabras.json";

const ANTON = "Anton, Impact, sans-serif";
const INTER = "Inter, 'Segoe UI', sans-serif";
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeIO = Easing.bezier(0.65, 0, 0.35, 1);
const decay = (t: number, from: number, tau: number) => (t < from ? 0 : Math.exp(-(t - from) / tau));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

const SRC_W = 2560, SRC_H = 1440, VIEW_W = 1024, VIEW_X = 28, VIEW_CY = 890;
const CYAN = "#7ff0ff", YELLOW = "#ffe14a", GREEN = "#33ff7a", RED = "#ff5a6a";

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

// ───────── subtítulos palabra a palabra con la voz ─────────
type W = { w: string; s: number; e: number };
const phrases = (): W[][] => {
  const out: W[][] = [];
  let cur: W[] = [];
  (words as W[]).forEach((w, i) => {
    cur.push(w);
    const next = (words as W[])[i + 1];
    const end = /[.?!:;]$/.test(w.w) || /,$/.test(w.w) && cur.length >= 3;
    if (end || cur.length >= 5 || (next && next.s - w.e > 0.5)) { out.push(cur); cur = []; }
  });
  if (cur.length) out.push(cur);
  return out;
};
const clean = (s: string, first: boolean, last: boolean) => {
  let x = s.replace(/^¿/, "").replace(/[?]$/, "");
  const q = s.startsWith("¿") ? "¿" : "";
  const qe = s.endsWith("?") ? "?" : "";
  if (last) x = x.replace(/[.,:;]$/, "");
  if (first) x = x.charAt(0).toUpperCase() + x.slice(1);
  return q + x + qe;
};

const Subtitles: React.FC<{ t: number; y: number }> = ({ t, y }) => {
  const P = useMemo(phrases, []);
  const cur = P.find((p, i) => {
    const a = p[0].s - 0.05;
    const nextStart = P[i + 1] ? P[i + 1][0].s - 0.05 : 1e9;
    const b = Math.min(p[p.length - 1].e + 0.25, nextStart);
    return t >= a && t < b;
  });
  if (!cur) return null;
  const a = clamp01((t - (cur[0].s - 0.05)) / 0.12);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: y, display: "flex", justifyContent: "center", opacity: a, transform: `translateY(${(1 - easeOut(a)) * 14}px)` }}>
      <div
        style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 18px", padding: "16px 30px 20px", borderRadius: 30,
          background: "rgba(4,7,12,0.62)", backdropFilter: "blur(6px)", boxShadow: "0 8px 40px rgba(0,0,0,0.45)", maxWidth: 980,
        }}
      >
        {cur.map((w, i) => {
          const active = t >= w.s && t < (cur[i + 1] ? cur[i + 1].s : w.e + 0.25);
          const past = t >= w.s;
          const pop = active ? 1 + 0.09 * decay(t, w.s, 0.09) : 1;
          return (
            <span
              key={i}
              style={{
                fontFamily: INTER, fontWeight: 800, fontSize: 64, lineHeight: 1.12, letterSpacing: -0.5,
                color: active ? YELLOW : past ? "#fff" : "rgba(255,255,255,0.45)", transform: `scale(${pop})`, display: "inline-block",
                textShadow: active ? "0 0 24px rgba(255,225,74,0.45)" : "none",
              }}
            >
              {clean(w.w, i === 0, i === cur.length - 1)}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ───────── titulares ─────────
const Head: React.FC<{ t: number; from: number; to: number; text: string; size?: number; color?: string; bumps?: number[]; y?: number }> = ({
  t, from, to, text, size = 104, color = "#fff", bumps = [], y = 100,
}) => {
  if (t < from || t > to + 0.2) return null;
  const a = clamp01((t - from) / 0.18) * (1 - clamp01((t - to) / 0.16));
  const rise = (1 - easeOut(clamp01((t - from) / 0.3))) * 34;
  const bump = bumps.reduce((s, b) => s + 0.1 * decay(t, b, 0.1), 0);
  return (
    <div
      style={{
        position: "absolute", left: 0, right: 0, top: y + rise, height: 230, display: "flex", justifyContent: "center", alignItems: "center", padding: "0 34px",
        textAlign: "center", transform: `scale(${1 + bump})`, opacity: a, fontFamily: ANTON, fontSize: size, lineHeight: 1.03, letterSpacing: 2, color,
        WebkitTextStroke: `${Math.round(size * 0.07)}px #04070c`, paintOrder: "stroke fill", whiteSpace: "pre-line", textShadow: `0 0 40px ${color}55`,
      }}
    >
      {text}
    </div>
  );
};

const Chip: React.FC<{ t: number; at: number; to: number; y: number; text: string }> = ({ t, at, to, y, text }) => {
  if (t < at || t > to + 0.2) return null;
  const k = easeOut(clamp01((t - at) / 0.28));
  const out = 1 - clamp01((t - to) / 0.15);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", opacity: k * out, transform: `translateX(${(1 - k) * -60}px) scale(${1 + 0.07 * decay(t, at, 0.12)})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "4px 34px 8px 22px", borderRadius: 18, background: "rgba(255,90,106,0.16)", border: `3px solid ${RED}`, fontFamily: ANTON, fontSize: 50, letterSpacing: 3, color: "#fff", whiteSpace: "nowrap" }}>
        <span style={{ color: RED }}>✕</span>{text}
      </div>
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
    Promise.all([
      loadFont({ family: "Anton", url: staticFile("fonts/Anton-Regular.woff2"), weight: "400" }),
      loadFont({ family: "Inter", url: staticFile("fonts/Inter-ExtraBold.woff2"), weight: "800" }),
    ]).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
};

const Bg: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(900px 700px at ${50 + 6 * Math.sin(t * 0.5)}% 38%, rgba(30,160,210,0.20), transparent 70%), radial-gradient(1200px 900px at 50% 100%, rgba(10,60,90,0.34), transparent 70%), #04070c`,
    }}
  />
);

export const VR010V2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const T = cfg.t;
  const D = cfg.duration;
  useFonts();

  const c = camera(t);
  const cx = Math.max(VIEW_W / 2 / c.s, Math.min(SRC_W - VIEW_W / 2 / c.s, c.cx));
  const cy = Math.max(c.H / 2 / c.s, Math.min(SRC_H - c.H / 2 / c.s, c.cy));
  const shake = 4 * decay(t, T.click1, 0.1) + 4 * decay(t, T.click2, 0.1) + 5 * decay(t, T.result, 0.12) + 3 * decay(t, T.win, 0.1);
  const flash = 0.3 * decay(t, T.cut1, 0.07) + 0.3 * decay(t, T.cut2, 0.07);
  const done = t >= T.result;
  const glow = done ? 0.5 + 0.5 * easeOut(clamp01((t - T.result) / 0.6)) : 0.3;
  const border = done ? "51,255,122" : "127,240,255";
  const subY = VIEW_CY + c.H / 2 + 46;
  const prog = clamp01(t / D);

  return (
    <AbsoluteFill style={{ background: "#04070c", overflow: "hidden" }}>
      <Bg t={t} />

      {/* barra de progreso */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 70, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.14)" }}>
        <div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 4, background: done ? GREEN : CYAN, boxShadow: `0 0 14px ${done ? GREEN : CYAN}` }} />
      </div>

      {/* pantalla: recorte animado */}
      <div
        style={{
          position: "absolute", left: VIEW_X, top: VIEW_CY - c.H / 2 + shake * Math.sin(frame * 3.1), width: VIEW_W, height: c.H, overflow: "hidden",
          borderRadius: 30, boxShadow: `0 0 0 3px rgba(${border},${glow}), 0 0 70px rgba(${border},${glow * 0.4}), 0 30px 80px rgba(0,0,0,0.6)`,
        }}
      >
        <Video
          src={staticFile("media/main2.mp4")} muted
          style={{ position: "absolute", width: SRC_W * c.s, height: SRC_H * c.s, left: VIEW_W / 2 - cx * c.s, top: c.H / 2 - cy * c.s }}
        />
      </div>

      {/* titulares: qué se está explicando */}
      <Head t={t} from={0.15} to={5.7} text={"¿OTRA VEZ\nLO MISMO?"} size={118} bumps={[4.34]} />
      <Chip t={t} at={T.chip1} to={9.6} y={92} text="ABRIR APPS" />
      <Chip t={t} at={T.chip2} to={9.6} y={172} text="BUSCAR ARCHIVOS" />
      <Chip t={t} at={T.chip3} to={9.6} y={252} text="COLOCAR VENTANAS" />
      <Head t={t} from={9.7} to={11.45} text={"¿TE SUENA?"} size={130} color={YELLOW} bumps={[9.72]} />
      <Head t={t} from={11.5} to={13.1} text={"ES PARA TI"} size={130} color={CYAN} bumps={[11.5]} />
      <Head t={t} from={13.35} to={16.9} text={"TU ESPACIO,\nPREPARADO"} size={108} color={CYAN} />
      <Head t={t} from={17.0} to={19.1} text={"UN CLIC"} size={170} color={YELLOW} bumps={[T.click1]} />
      <Head t={t} from={19.3} to={25.4} text={"PRUÉBALO:\nCIERRO TODO"} size={108} color={CYAN} bumps={[19.3]} />
      <Head t={t} from={25.5} to={29.7} text={"LO LANZO\nDE NUEVO"} size={118} color={YELLOW} bumps={[T.click2]} />
      <Head t={t} from={29.8} to={33.5} text={"¡RESULTADO!"} size={140} color={GREEN} bumps={[T.result]} />
      <Head t={t} from={33.7} to={D} text={"LISTO PARA\nLA PRÓXIMA VEZ"} size={104} color={CYAN} bumps={[33.7]} />

      <Subtitles t={t} y={subY} />

      <AbsoluteFill style={{ background: "#fff", opacity: Math.min(0.55, flash), pointerEvents: "none" }} />

      {/* audio: voz original del tutorial + efectos suaves por debajo */}
      <At t={0} src="audio/voz.wav" volume={1} />
      <At t={0.05} src="audio/boom.wav" volume={0.22} />
      {[T.chip1, T.chip2, T.chip3, 9.72].map((s) => (
        <At key={s} t={s} src="audio/pop.wav" volume={0.18} />
      ))}
      <At t={T.cut1 - 0.04} src="audio/whoosh.wav" volume={0.18} />
      <At t={T.click1} src="audio/hit.wav" volume={0.3} />
      <At t={T.cut2 - 0.04} src="audio/whoosh.wav" volume={0.18} />
      <At t={T.click2} src="audio/hit.wav" volume={0.3} />
      <At t={T.splash} src="audio/riser.wav" volume={0.16} />
      <At t={T.win + 0.1} src="audio/pop.wav" volume={0.2} />
      <At t={T.result} src="audio/ding.wav" volume={0.3} />
    </AbsoluteFill>
  );
};
