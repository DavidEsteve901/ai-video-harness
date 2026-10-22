import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio, Video } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import cfg from "../edit.config.json";

const ANTON = "Anton, Impact, sans-serif";
const W = cfg.width;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const decay = (t: number, from: number, tau: number) => (t < from ? 0 : Math.exp(-(t - from) / tau));
const GREEN = "#33ff7a";

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

const Bg: React.FC<{ glow?: number }> = ({ glow = 0 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(900px 700px at 50% 42%, rgba(30,160,210,${0.18 + glow * 0.2}), transparent 70%), radial-gradient(1200px 900px at 50% 100%, rgba(10,60,90,0.32), transparent 70%), #04070c`,
    }}
  />
);

// Marco fino con esquinas redondeadas para los paneles de vídeo
const Panel: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode; color?: string }> = ({ x, y, w, h, children, color = "rgba(255,255,255,0.22)" }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 22, overflow: "hidden", boxShadow: `0 0 0 3px ${color}` }}>{children}</div>
);

// ═════════ VR006 · «Le pedí a mi PC» (asistente de voz) ═════════
export const VR006: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const A = cfg.asistente;
  const T = A.t;
  useFonts();
  const zoom = 1 + 0.03 * (t / A.duration);
  const shake = 6 * decay(t, T.think, 0.12) + 5 * decay(t, T.browser, 0.1) + 5 * decay(t, T.done, 0.12);
  return (
    <AbsoluteFill style={{ background: "#04070c", overflow: "hidden" }}>
      <Bg />
      <AbsoluteFill style={{ transform: `translate(${shake * Math.sin(frame * 3.1)}px, ${shake * Math.cos(frame * 2.3)}px) scale(${zoom})` }}>
        <Panel x={0} y={340} w={1080} h={608}>
          <Video src={staticFile("media/asist_full.mp4")} muted style={{ width: 1080, height: 608 }} />
        </Panel>
        <Panel x={90} y={1000} w={900} h={600} color="rgba(51,255,122,0.5)">
          <Video src={staticFile("media/asist_card.mp4")} muted style={{ width: 900, height: 600 }} />
        </Panel>
      </AbsoluteFill>

      {/* textos */}
      <Cap t={t} from={0.05} to={2.4} y={110} text={"LE PEDÍ A MI PC:"} size={118} />
      <Cap t={t} from={0.3} to={T.browser - 0.1} y={1640} text={"“ÁBREME UN VÍDEO DE RISA\nY UN ARTÍCULO PARA ESTUDIAR”"} size={58} color="#ffe14a" />
      <Cap t={t} from={T.browser} to={T.organize - 0.4} y={110} text={"¿¿Y SE ABRE\nTODO SOLO??"} size={108} />
      <Cap t={t} from={T.organize - 0.3} to={T.done - 0.1} y={110} text={"AHORA: “ORGANÍZAME\nLAS VENTANAS”"} size={88} />
      <Cap t={t} from={T.done} to={A.duration} y={110} text={"LISTO 😎\nCUATRO VENTANAS"} size={104} color="#7ff0ff" />

      {/* memes flotando */}
      <Float t={t} from={T.browser + 0.15} to={T.article - 0.3} x={560} y={1640} w={460} h={215} src="img/scream.jpg" rot={4} />
      <Float t={t} from={T.done + 0.1} to={A.duration} x={60} y={1625} w={440} h={330} src="img/chill.jpg" rot={-4} />

      {/* audio: gancho claro + clic cuando "habla" + ding al terminar + voz */}
      <At t={0} src="audio/hook_boom.wav" volume={0.55} />
      <At t={T.think} src="audio/click.wav" volume={0.7} />
      <At t={T.done} src="audio/ding.wav" volume={0.45} />
      {A.vo.map((v) => (
        <At key={v.file} t={v.at} src={"audio/" + v.file} volume={1} />
      ))}
    </AbsoluteFill>
  );
};

// ═════════ VR007 · «Cuenta atrás» (lanzamiento) ═════════
export const VR007: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const C = cfg.cuentaatras;
  const S = C.senior.startOut;
  useFonts();
  const clickT = S + 0.4;
  const rocketOp = 1 - clamp01((t - (S + 0.05)) / 0.35);
  const seniorOp = clamp01((t - S) / 0.3);
  const num = t < 3 ? 3 - Math.floor(t) : 0;
  const nk = t < 3 ? t - Math.floor(t) : 0;
  const numScale = 0.8 + 0.5 * easeOut(clamp01(nk / 0.25)) - 0.3 * clamp01((nk - 0.6) / 0.4);
  const fire = t >= 3 && t < 5.2;
  const shake = 10 * decay(t, 3, 0.2) + 8 * decay(t, clickT, 0.2);
  const flash = t < clickT ? 0 : 0.22 * Math.exp(-(t - clickT) / 0.08);
  return (
    <AbsoluteFill style={{ background: "#04070c", overflow: "hidden" }}>
      <Bg glow={fire ? 1 : 0} />
      <AbsoluteFill style={{ transform: `translate(${shake * Math.sin(frame * 3.1)}px, ${shake * Math.cos(frame * 2.3)}px)` }}>
        <Panel x={0} y={620} w={1080} h={608} color={fire ? "rgba(255,160,60,0.7)" : "rgba(255,255,255,0.22)"}>
          <AbsoluteFill style={{ opacity: rocketOp }}>
            <Video src={staticFile("media/rocket.mp4")} muted style={{ width: 1080, height: 608 }} />
          </AbsoluteFill>
          <AbsoluteFill style={{ opacity: seniorOp }}>
            <Sequence from={Math.round(S * fps)} layout="none">
              <Video src={staticFile("media/senior.mp4")} muted style={{ width: 1080, height: 608 }} />
            </Sequence>
          </AbsoluteFill>
        </Panel>
      </AbsoluteFill>

      {/* cuenta atrás grande */}
      {t < 3 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", fontFamily: ANTON, fontSize: 430, lineHeight: 1, color: "#fff", WebkitTextStroke: "34px #000", paintOrder: "stroke fill", transform: `scale(${numScale})` }}>
          {num}
        </div>
      )}
      <Cap t={t} from={0.05} to={2.95} y={1330} text={"POR ESO SE LLAMA\n“LAUNCHER”"} size={96} />
      <Cap t={t} from={3.0} to={5.3} y={150} text={"¡FUEGO! 🚀"} size={190} color="#ffb347" />
      <Cap t={t} from={5.2} to={9.6} y={1330} text={"…Y ASÍ SE LANZA\nMI ESCRITORIO"} size={92} />
      <Cap t={t} from={5.6} to={8.4} y={150} text={"UN CLIC"} size={170} color={GREEN} bumps={[clickT]} />
      <Cap t={t} from={8.7} to={C.duration} y={150} text={"ASÍ ARRANCA\nMI PC 😎"} size={120} color="#7ff0ff" />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />

      {/* audio: 3 pitidos, pitido largo + impacto, clic, ding y voz */}
      <At t={0} src="audio/beep.wav" volume={0.6} />
      <At t={1} src="audio/beep.wav" volume={0.6} />
      <At t={2} src="audio/beep.wav" volume={0.6} />
      <At t={3} src="audio/beep_long.wav" volume={0.55} />
      <At t={3} src="audio/impact.wav" volume={0.7} />
      <At t={clickT} src="audio/click.wav" volume={0.8} />
      <At t={clickT + 0.9} src="audio/ding.wav" volume={0.4} />
      {C.vo.map((v) => (
        <At key={v.file} t={v.at} src={"audio/" + v.file} volume={1} />
      ))}
    </AbsoluteFill>
  );
};
