import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import cfg from "../edit.config.json";

// ───────────────────────── Tiempos (segundos del vídeo final) ─────────────────────────
const HOOK_END = cfg.hook.end; // 1,5 · grito
const B_END = cfg.jarvis.end; // 3,7 · «Jarvis,» + alarma
const C_END = cfg.point.end; // 7,4 · círculo y flecha
const D0 = cfg.demo.start; // 7,4 · demo real
const S1 = cfg.demo.seg1;
const S2 = cfg.demo.seg2;
const S1_LEN = S1.srcEnd - S1.srcStart;
const S2_OUT = D0 + S1_LEN; // arranca el tramo acelerado
const S2_LEN = (S2.srcEnd - S2.srcStart) / S2.speed;
const E0 = S2_OUT + S2_LEN; // todo montado
const CLAPS = cfg.demo.claps.map((c) => D0 + (c - S1.srcStart));
const OPEN = S2_OUT + (4.9 - S2.srcStart) / S2.speed; // empiezan a abrirse las ventanas

// ───────────────────────── Estilo ─────────────────────────
export const ANTON = "Anton, Impact, sans-serif";
export const INTER = "Inter, 'Segoe UI', Arial, sans-serif";
export const YELLOW = "#ffe14a";
export const RED = "#ff2d2d";
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const decay = (t: number, from: number, tau: number) => (t < from ? 0 : Math.exp(-(t - from) / tau));
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// Foto de Tony con los brazos abiertos (597×335) escalada a 1080 de ancho
const IMG_S = 1080 / 597;
const IMG_TOP = 560;
const FACE = { x: 293 * IMG_S, y: IMG_TOP + 60 * IMG_S };

// Texto estilo meme: Anton, relleno con contorno negro y «pop» al entrar
export const Cap: React.FC<{
  t: number;
  from: number;
  to: number;
  text: string;
  y: number;
  size?: number;
  color?: string;
  rot?: number;
}> = ({ t, from, to, text, y, size = 116, color = "#fff", rot = 0 }) => {
  const { fps } = useVideoConfig();
  if (t < from || t > to + 0.1) return null;
  const pop = spring({ frame: (t - from) * fps, fps, config: { damping: 11, stiffness: 240, mass: 0.55 } });
  const out = t > to ? 1 - clamp01((t - to) / 0.1) : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent: "center",
        padding: "0 34px",
        textAlign: "center",
        transform: `rotate(${rot}deg) scale(${(0.55 + 0.45 * pop) * out})`,
        opacity: out,
        fontFamily: ANTON,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: 2,
        color,
        WebkitTextStroke: `${Math.round(size * 0.09)}px #000`,
        paintOrder: "stroke fill",
        whiteSpace: "pre-line",
      }}
    >
      {text}
    </div>
  );
};

// Reproduce un efecto de sonido en el instante t
export const At: React.FC<{ t: number; src: string; volume: number; dur?: number; fade?: number }> = ({ t, src, volume, dur, fade = 0.05 }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(t * fps))} durationInFrames={dur ? Math.round(dur * fps) : undefined} layout="none">
      <Audio
        src={staticFile(src)}
        volume={(f) => {
          if (!dur) return volume;
          return volume * clamp01((dur - f / fps) / fade);
        }}
      />
    </Sequence>
  );
};

// Trazo que se dibuja (pathLength=1 normaliza cualquier longitud)
export const Stroke: React.FC<{ p: number; children: (dash: React.CSSProperties) => React.ReactNode }> = ({ p, children }) => (
  <>{children({ strokeDasharray: 1, strokeDashoffset: 1 - clamp01(p) })}</>
);

export const VR003: React.FC<{ voice: boolean }> = ({ voice }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const t = frame / fps;

  const [handle] = useState(() => delayRender("fuentes"));
  useEffect(() => {
    Promise.all([
      loadFont({ family: "Anton", url: staticFile("fonts/Anton-Regular.woff2"), weight: "400" }),
      loadFont({ family: "Inter", url: staticFile("fonts/Inter-ExtraBold.woff2"), weight: "800" }),
    ])
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);

  const inHook = t < HOOK_END;
  const inJarvis = t >= HOOK_END && t < B_END;
  const inPoint = t >= B_END && t < C_END;
  const inDemo = t >= C_END;

  // Sacudidas: cada corte, cada palmada y la aparición de las ventanas
  const shake =
    (inHook ? 7 + 10 * clamp01((t - 0.2) / 0.8) : 0) +
    16 * decay(t, HOOK_END, 0.13) +
    10 * decay(t, B_END, 0.1) +
    9 * decay(t, C_END, 0.1) +
    CLAPS.reduce((s, c) => s + 9 * decay(t, c, 0.07), 0) +
    14 * decay(t, OPEN, 0.16) +
    8 * decay(t, E0, 0.12);
  const shakeX = shake * Math.sin(frame * 3.1);
  const shakeY = shake * Math.cos(frame * 2.3);

  const flashAt = (ft: number, peak: number) =>
    t < ft ? 0 : interpolate(t - ft, [0, 0.03, 0.18], [0, peak, 0], { extrapolateRight: "clamp" });
  const flash = Math.max(flashAt(HOOK_END, 0.9), flashAt(B_END, 0.6), flashAt(C_END, 0.8), flashAt(OPEN, 0.35), flashAt(E0, 0.4));

  // Alarma: viñeta roja que late mientras suena
  const alarmOn = t >= HOOK_END && t < B_END;
  const alarm = alarmOn ? (0.4 + 0.4 * Math.sin((t - HOOK_END) * 17)) * (1 - clamp01((t - B_END + 0.35) / 0.35)) : 0;

  // Zoom de impacto de la demo
  const zoomDemo = 1 + CLAPS.reduce((s, c) => s + 0.06 * decay(t, c, 0.12), 0) + 0.09 * decay(t, OPEN, 0.2) + 0.05 * decay(t, E0, 0.15);

  // Plano «brazos abiertos»: empuje lento hacia la cara + círculo/flecha
  const pt = t - B_END;
  const push = 1 + 0.16 * easeOut(clamp01(pt / 3.2)) + 0.08 * decay(t, B_END, 0.18);
  const circleP = clamp01((t - cfg.point.circleAt) / 0.38);
  const arrowP = clamp01((t - cfg.point.arrowAt) / 0.22);
  const headP = clamp01((t - cfg.point.arrowAt - 0.2) / 0.12);

  // Cierre
  const endT = t - (E0 + 1.2);
  const endPop = endT > 0 ? spring({ frame: endT * fps, fps, config: { damping: 12, stiffness: 140, mass: 0.7 } }) : 0;

  return (
    <AbsoluteFill style={{ background: "#05060a", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>
        {/* ───────── 1 · GANCHO: Tony gritando ───────── */}
        {inHook && (
          <AbsoluteFill style={{ transform: `scale(${1.02 + 0.1 * clamp01(t / HOOK_END)})`, overflow: "hidden" }}>
            {/* el clip (360×640) trae barras negras: el contenido real es 360×462 desde y=90, se amplía para llenar la pantalla */}
            <OffthreadVideo
              src={staticFile("media/scream.mp4")}
              trimBefore={Math.round(cfg.hook.srcStart * fps)}
              volume={0.75}
              style={{ position: "absolute", width: 1496, height: 2660, left: -208, top: -374, filter: "contrast(1.12) saturate(1.2)" }}
            />
          </AbsoluteFill>
        )}

        {/* ───────── 2 · «Jarvis,» + alarma ───────── */}
        {inJarvis && (
          <AbsoluteFill style={{ background: "#000" }}>
            <Img
              src={staticFile("media/jarvis.webp")}
              style={{
                position: "absolute",
                left: 0,
                top: 270,
                width: W,
                transform: `scale(${1 + 0.22 * decay(t, HOOK_END, 0.12) + 0.03 * clamp01((t - HOOK_END) / (B_END - HOOK_END))})`,
                transformOrigin: "50% 40%",
              }}
            />
          </AbsoluteFill>
        )}

        {/* ───────── 3 · «Este tío»: círculo + flecha ───────── */}
        {inPoint && (
          <AbsoluteFill style={{ background: "#07090f" }}>
            <Img
              src={staticFile("media/tony_brazos.jpg")}
              style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover", filter: "blur(38px) brightness(0.35)", transform: "scale(1.2)" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `scale(${push})`,
                transformOrigin: `${FACE.x}px ${FACE.y}px`,
              }}
            >
              <Img
                src={staticFile("media/tony_brazos.jpg")}
                style={{ position: "absolute", left: 0, top: IMG_TOP, width: W, height: 335 * IMG_S, boxShadow: "0 0 60px rgba(0,0,0,0.8)" }}
              />
              <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }} fill="none" stroke={RED} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round">
                <Stroke p={circleP}>
                  {(d) => <ellipse cx={FACE.x} cy={FACE.y + 4} rx={108} ry={132} transform={`rotate(-14 ${FACE.x} ${FACE.y})`} pathLength={1} style={d} />}
                </Stroke>
                <Stroke p={arrowP}>{(d) => <path d="M 900 1020 Q 830 840 650 772" pathLength={1} style={d} />}</Stroke>
                <Stroke p={headP}>{(d) => <path d="M 700 826 L 648 772 L 720 760" pathLength={1} style={d} />}</Stroke>
              </svg>
            </div>
            <Cap t={t} from={cfg.point.labelAt} to={C_END - 0.05} y={1040} text={"ESTE TÍO"} size={190} color={YELLOW} rot={-6} />
            <Cap t={t} from={cfg.point.captionAt} to={C_END - 0.05} y={1370} text={"ABRE TODO CON\n2 PALMADAS"} size={112} />
          </AbsoluteFill>
        )}

        {/* ───────── 4 · DEMO real (palmadas) ───────── */}
        {inDemo && (
          <AbsoluteFill style={{ background: "#05060a" }}>
            {/* fondo: la misma demo desenfocada, en vertical */}
            <Sequence from={Math.round(D0 * fps)} durationInFrames={Math.round(S1_LEN * fps)} layout="none">
              <OffthreadVideo src={staticFile("media/demo.mp4")} trimBefore={Math.round(S1.srcStart * fps)} muted style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover", filter: "blur(40px) brightness(0.42)", transform: "scale(1.15)" }} />
            </Sequence>
            <Sequence from={Math.round(S2_OUT * fps)} durationInFrames={Math.round(S2_LEN * fps)} layout="none">
              <OffthreadVideo src={staticFile("media/demo.mp4")} trimBefore={Math.round(S2.srcStart * fps)} playbackRate={S2.speed} muted style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover", filter: "blur(40px) brightness(0.42)", transform: "scale(1.15)" }} />
            </Sequence>
            <Sequence from={Math.round(E0 * fps)} layout="none">
              <OffthreadVideo src={staticFile("media/demo.mp4")} trimBefore={Math.round(cfg.payoff.srcStart * fps)} muted style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover", filter: "blur(40px) brightness(0.42)", transform: "scale(1.15)" }} />
            </Sequence>

            {/* demo nítida en 16:9 */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 656,
                width: W,
                height: 608,
                transform: `scale(${zoomDemo})`,
                boxShadow: "0 0 70px rgba(0,0,0,0.85)",
                borderTop: "3px solid rgba(255,255,255,0.25)",
                borderBottom: "3px solid rgba(255,255,255,0.25)",
              }}
            >
              <Sequence from={Math.round(D0 * fps)} durationInFrames={Math.round(S1_LEN * fps)} layout="none">
                <OffthreadVideo src={staticFile("media/demo.mp4")} trimBefore={Math.round(S1.srcStart * fps)} volume={(f) => (f / fps > S1_LEN - 0.15 ? clamp01((S1_LEN - f / fps) / 0.15) : 1)} style={{ width: W, height: 608, objectFit: "cover" }} />
              </Sequence>
              <Sequence from={Math.round(S2_OUT * fps)} durationInFrames={Math.round(S2_LEN * fps)} layout="none">
                <OffthreadVideo src={staticFile("media/demo.mp4")} trimBefore={Math.round(S2.srcStart * fps)} playbackRate={S2.speed} muted style={{ width: W, height: 608, objectFit: "cover" }} />
              </Sequence>
              <Sequence from={Math.round(E0 * fps)} layout="none">
                <OffthreadVideo src={staticFile("media/demo.mp4")} trimBefore={Math.round(cfg.payoff.srcStart * fps)} muted style={{ width: W, height: 608, objectFit: "cover" }} />
              </Sequence>
            </div>

            {/* textos de la demo */}
            <Cap t={t} from={CLAPS[0] - 0.02} to={CLAPS[1] - 0.02} y={300} text={"¡CLAP!"} size={230} color={YELLOW} rot={-5} />
            <Cap t={t} from={CLAPS[1] - 0.02} to={OPEN - 0.05} y={260} text={"¡CLAP!"} size={290} color={YELLOW} rot={4} />
            <Cap t={t} from={OPEN} to={E0 + 1.15} y={210} text={"SIN TOCAR\nNADA"} size={140} />
            <Cap t={t} from={E0 + 0.1} to={E0 + 1.15} y={1370} text={"TODO EN\nSU SITIO"} size={120} color={YELLOW} />

            {/* cierre */}
            {endT > 0 && (
              <AbsoluteFill
                style={{
                  background: `rgba(5,6,10,${0.88 * clamp01(endT / 0.2)})`,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 36,
                }}
              >
                <Img src={staticFile("media/logo.png")} style={{ width: 300, height: 300, objectFit: "contain", transform: `scale(${0.5 + 0.5 * endPop})` }} />
                <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 84, color: "#fff", transform: `scale(${0.6 + 0.4 * endPop})` }}>Workspace Launcher</div>
                <div style={{ fontFamily: ANTON, fontSize: 70, color: YELLOW, letterSpacing: 2, opacity: clamp01((endT - 0.25) / 0.2) }}>TU ESCRITORIO, LISTO.</div>
              </AbsoluteFill>
            )}
          </AbsoluteFill>
        )}

        {/* ───────── Textos fijos de las primeras escenas ───────── */}
        <Cap t={t} from={0.05} to={HOOK_END - 0.02} y={170} text={"TÚ ABRIENDO LAS\nAPPS A MANO:"} size={124} />
        <Cap t={t} from={HOOK_END + 0.12} to={B_END - 0.03} y={1330} text={"¿OTRA VEZ\nA MANO?"} size={150} color={YELLOW} />
      </AbsoluteFill>

      {/* Viñeta roja de alarma + flash de cortes */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(255,25,25,0.95) 100%)", opacity: alarm }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />

      {/* ───────── AUDIO ───────── */}
      {/* gancho de sonido: grito original (viene en el vídeo) → boom + alarma */}
      <At t={HOOK_END - 0.03} src="audio/sfx_boom.wav" volume={0.85} />
      <At t={HOOK_END} src="audio/alarm.mp3" volume={0.26} dur={B_END - HOOK_END} fade={0.35} />
      <At t={HOOK_END + 0.12} src="audio/sfx_pop.wav" volume={0.5} />
      <At t={B_END - 0.1} src="audio/sfx_whoosh.wav" volume={0.6} />
      <At t={B_END} src="audio/sfx_hit.wav" volume={0.7} />
      <At t={cfg.point.circleAt} src="audio/sfx_scribble.wav" volume={0.5} />
      <At t={cfg.point.arrowAt} src="audio/sfx_scribble.wav" volume={0.45} dur={0.3} fade={0.05} />
      <At t={cfg.point.labelAt} src="audio/sfx_hit.wav" volume={0.75} />
      <At t={cfg.point.captionAt} src="audio/sfx_pop.wav" volume={0.5} />
      <At t={C_END - 0.1} src="audio/sfx_whoosh.wav" volume={0.6} />
      <At t={C_END} src="audio/sfx_boom.wav" volume={0.6} />
      {CLAPS.map((c) => (
        <At key={c} t={c - 0.02} src="audio/sfx_hit.wav" volume={0.55} />
      ))}
      <At t={OPEN - 1.05} src="audio/sfx_riser.wav" volume={0.55} />
      <At t={OPEN} src="audio/sfx_boom.wav" volume={0.7} />
      {/* cada ventana «encaja» en su sitio: pops rápidos hasta que está todo montado */}
      {[0.5, 0.85, 1.2, 1.55, 1.9, 2.2].filter((d) => OPEN + d < E0 - 0.1).map((d) => (
        <At key={d} t={OPEN + d} src="audio/sfx_pop.wav" volume={0.4} />
      ))}
      <At t={E0} src="audio/sfx_ding.wav" volume={0.5} />
      <At t={E0 + 0.1} src="audio/sfx_pop.wav" volume={0.5} />
      <At t={E0 + 1.15} src="audio/sfx_whoosh.wav" volume={0.55} />
      <At t={E0 + 1.2} src="audio/sfx_hit.wav" volume={0.6} />
      {/* locución (opcional) */}
      {voice && cfg.voz.map((v) => <At key={v.file} t={v.at} src={v.file} volume={1} />)}
    </AbsoluteFill>
  );
};
