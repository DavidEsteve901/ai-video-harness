import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio, Video } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import cfg from "../edit.config.json";
import { cornerPin } from "./homography";

// ───────────────────────── Tiempos del montaje (segundos de salida) ─────────────────────────
const HOOK_END = cfg.hook.duration; // 2,3 · Tony gritando (gancho)
const WAKE_OUT = cfg.wake.outStart; // 2,3 · "Wake up, daddy's home" (clip normal)
const WAKE_LEN = cfg.wake.srcEnd - cfg.wake.srcStart;
const [SEG1, SEG2] = cfg.part2.segments;
const S1_OUT = cfg.part2.start; // 5,5 · mi PC dentro del monitor de Tony
const S1_LEN = SEG1.demoEnd - SEG1.demoStart;
const S2_OUT = S1_OUT + S1_LEN; // 13,5 · corte al cierre
const S2_LEN = SEG2.demoEnd - SEG2.demoStart;
const END_OUT = cfg.end.start; // 16,4
const XF = 0.3; // duración de los fundidos entre escenas (suaves, sin flashes)
const demoToOut = (d: number) => (d < 15 ? S1_OUT + (d - SEG1.demoStart) : S2_OUT + (d - SEG2.demoStart));
const CLAP1 = demoToOut(3.24);
const CLAP2 = demoToOut(3.51);
const OPEN = demoToOut(4.9); // se empiezan a abrir las ventanas
const CLAPS2 = [20.81, 21.07].map(demoToOut); // otras DOS palmadas
const CLOSE = demoToOut(21.8);
const WAKE_VOICE = WAKE_OUT + (3.0 - cfg.wake.srcStart); // Tony dice la frase

// Locución: cada frase se ancla a un momento de la escena (ver edit.config.json → vo)
const ANCHORS: Record<string, number> = { hook: 0, wake: WAKE_OUT, s1: S1_OUT, open: OPEN, s2: S2_OUT, end: END_OUT };
const VO = (() => {
  let prevEnd = 0;
  return cfg.vo.map((v) => {
    const at = v.anchor === "prev" ? prevEnd + v.offset : ANCHORS[v.anchor] + v.offset;
    prevEnd = at + v.dur;
    return { ...v, at };
  });
})();

// ───────────────────────── Estilo ─────────────────────────
const ANTON = "Anton, Impact, sans-serif";
const W = cfg.width;
const PLATE = cfg.plateB.plate;
const Y_C = 800; // centro vertical de las tomas de Tony
const SB = 1.05; // escala del monitor gigante
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const decay = (t: number, from: number, tau: number) => (t < from ? 0 : Math.exp(-(t - from) / tau));
const fade = (t: number, from: number, to: number, d = XF) => clamp01((t - from) / d) * (1 - clamp01((t - to) / d));

const QUAD = (() => {
  const q = cfg.plateB.quad as number[][];
  const cx = q.reduce((s, p) => s + p[0], 0) / 4;
  const cy = q.reduce((s, p) => s + p[1], 0) / 4;
  return q.map(([x, y]) => [cx + (x - cx) * 1.03, cy + (y - cy) * 1.03]) as [number, number][];
})();
const DEMO_TRANSFORM = cornerPin(1920, 1080, QUAD);
const QUAD_C = {
  x: (cfg.plateB.quad as number[][]).reduce((s, p) => s + p[0], 0) / 4,
  y: (cfg.plateB.quad as number[][]).reduce((s, p) => s + p[1], 0) / 4,
};

// ───────────────────────── Piezas ─────────────────────────
// Texto estilo meme: Anton en mayúsculas, blanco con contorno negro; entra suave (sin rebotes bruscos)
const Cap: React.FC<{
  t: number;
  from: number;
  to: number;
  text: string;
  y: number;
  size?: number;
  color?: string;
  bumps?: number[];
}> = ({ t, from, to, text, y, size = 112, color = "#fff", bumps = [] }) => {
  if (t < from || t > to + 0.2) return null;
  const a = clamp01((t - from) / 0.18) * (1 - clamp01((t - to) / 0.18));
  const rise = (1 - easeOut(clamp01((t - from) / 0.28))) * 26;
  const bump = bumps.reduce((s, b) => s + 0.1 * decay(t, b, 0.1), 0);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y + rise,
        display: "flex",
        justifyContent: "center",
        padding: "0 34px",
        textAlign: "center",
        transform: `scale(${1 + bump})`,
        opacity: a,
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

// Meme flotante: sin marco ni bordes; aparece con fundido, sube y baja suavemente y se inclina un poco
const Float: React.FC<{
  t: number;
  from: number;
  to: number;
  x: number;
  y: number;
  w: number;
  h: number;
  src: string;
  rot?: number;
  feather?: boolean;
  children?: React.ReactNode;
}> = ({ t, from, to, x, y, w, h, src, rot = 0, feather = true, children }) => {
  if (t < from || t > to + 0.4) return null;
  const a = clamp01((t - from) / 0.35) * (1 - clamp01((t - to) / 0.35));
  const k = t - from;
  const bob = Math.sin(k * 2.3) * 10;
  const sway = rot + Math.sin(k * 1.6) * 2;
  const grow = 0.9 + 0.1 * easeOut(clamp01(k / 0.5));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        width: w,
        height: h,
        opacity: a,
        transform: `rotate(${sway}deg) scale(${grow})`,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          WebkitMaskImage: feather ? "radial-gradient(ellipse 72% 72% at 50% 50%, #000 62%, transparent 100%)" : undefined,
        }}
      />
      {children}
    </div>
  );
};

// ───────────────────────── Composición ─────────────────────────
export const VR002: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const [handle] = useState(() => delayRender("fuentes"));
  useEffect(() => {
    loadFont({ family: "Anton", url: staticFile("fonts/Anton-Regular.woff2"), weight: "400" })
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);

  // Visibilidad de cada escena (las nuevas entran con fundido sobre la anterior)
  const showWake = t >= WAKE_OUT && t < S1_OUT + XF;
  const showDemo = t >= S1_OUT && t < END_OUT + XF;
  const showEnd = t >= END_OUT;

  // Pequeñas sacudidas solo en palmadas y apertura
  const shake = 7 * decay(t, OPEN, 0.16) + [CLAP1, CLAP2, ...CLAPS2].reduce((s, c) => s + 4 * decay(t, c, 0.07), 0);
  const shakeX = shake * Math.sin(frame * 3.1);
  const shakeY = shake * Math.cos(frame * 2.3);

  // Alarma: viñeta roja suave mientras suena
  const alarm = t >= OPEN && t < OPEN + 1.5 ? (0.18 + 0.14 * Math.sin((t - OPEN) * 14)) * (1 - clamp01((t - OPEN - 1.1) / 0.4)) : 0;

  // Zoom lento en cada escena (da vida sin cortes bruscos)
  const hookZoom = 1 + 0.07 * (t / HOOK_END);
  const wakeZoom = 1 + 0.05 * clamp01((t - WAKE_OUT) / WAKE_LEN);
  const demoZoom = SB * (1 + 0.012 * clamp01((t - S1_OUT) / (END_OUT - S1_OUT)));

  // Duck del audio de la demo mientras habla la voz
  const voActive = (absT: number) => VO.some((v) => absT >= v.at - 0.1 && absT <= v.at + v.dur + 0.1);
  const demoVol = (absT: number) => (voActive(absT) ? 0.45 : 0.85);

  const K = 640 / cfg.wake.crop.w; // (se usa abajo para recortar el clip normal)
  const wk = 1080 / cfg.wake.crop.w;

  return (
    <AbsoluteFill style={{ background: "#04070c", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(900px 700px at 50% 42%, rgba(30,160,210,0.2), transparent 70%), radial-gradient(1200px 900px at 50% 100%, rgba(10,60,90,0.32), transparent 70%)",
        }}
      />

      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>
        {/* ───────── ESCENA 1 · GANCHO: Tony gritando ───────── */}
        {t < WAKE_OUT + XF && (
          <AbsoluteFill style={{ opacity: 1 - clamp01((t - WAKE_OUT - 0.05) / XF) }}>
            {/* fondo: el mismo vídeo muy desenfocado (tapa los lados sin pixelar) */}
            <Video
              src={staticFile("media/hook_up.mp4")}
              muted
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(36px) brightness(0.5)", transform: "scale(1.25)" }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 555,
                width: W,
                height: 810,
                overflow: "hidden",
                transform: `scale(${hookZoom})`,
                transformOrigin: "50% 50%",
              }}
            >
              <Video
                src={staticFile("media/hook_up.mp4")}
                volume={(f) => 0.9 * (1 - clamp01((f / fps - HOOK_END) / XF))}
                style={{ width: W, height: 810 }}
              />
            </div>
          </AbsoluteFill>
        )}

        {/* ───────── ESCENA 2 · "Wake up, daddy's home" (clip normal) ───────── */}
        {showWake && (
          <AbsoluteFill style={{ opacity: fade(t, WAKE_OUT, S1_OUT) }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: Y_C - (cfg.wake.crop.h * wk) / 2,
                width: W,
                height: cfg.wake.crop.h * wk,
                overflow: "hidden",
                transform: `scale(${wakeZoom})`,
              }}
            >
              <Sequence from={Math.round(WAKE_OUT * fps)} durationInFrames={Math.round(WAKE_LEN * fps)} layout="none">
                <Video
                  src={staticFile("media/wake.mp4")}
                  muted
                  trimBefore={Math.round(cfg.wake.srcStart * fps)}
                  style={{
                    position: "absolute",
                    left: -cfg.wake.crop.x * wk,
                    top: -cfg.wake.crop.y * wk,
                    width: 852 * wk,
                    height: 480 * wk,
                  }}
                />
              </Sequence>
            </div>
          </AbsoluteFill>
        )}

        {/* ───────── ESCENA 3 · mi PC dentro del monitor gigante de Tony ───────── */}
        {showDemo && (
          <AbsoluteFill style={{ opacity: fade(t, S1_OUT, END_OUT) }}>
            <div
              style={{
                position: "absolute",
                left: W / 2 - QUAD_C.x * SB,
                top: Y_C - QUAD_C.y * SB,
                width: PLATE.w,
                height: PLATE.h,
                transform: `scale(${demoZoom / SB})`,
                transformOrigin: `${QUAD_C.x * SB}px ${QUAD_C.y * SB}px`,
              }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, width: PLATE.w, height: PLATE.h, transform: `scale(${SB})`, transformOrigin: "0 0" }}>
                <Sequence from={Math.round(S1_OUT * fps)} durationInFrames={Math.round(S1_LEN * fps)} layout="none">
                  <DemoLayer start={SEG1.demoStart} vol={(f) => demoVol(S1_OUT + f / fps)} />
                </Sequence>
                <Sequence from={Math.round(S2_OUT * fps)} durationInFrames={Math.round(S2_LEN * fps)} layout="none">
                  <DemoLayer start={SEG2.demoStart} vol={(f) => demoVol(S2_OUT + f / fps)} />
                </Sequence>
                <Img src={staticFile("media/plateB.png")} style={{ position: "absolute", left: 0, top: 0, width: PLATE.w, height: PLATE.h }} />
              </div>
            </div>
          </AbsoluteFill>
        )}

        {/* ───────── CIERRE ───────── */}
        {showEnd && (
          <AbsoluteFill style={{ opacity: clamp01((t - END_OUT) / XF) }}>
            <Img
              src={staticFile("img/jarvis_face.png")}
              style={{ position: "absolute", left: 40, top: Y_C - 290, width: W - 80, height: 580, objectFit: "cover", borderRadius: 24 }}
            />
          </AbsoluteFill>
        )}

        {/* ───────── TEXTOS ───────── */}
        <Cap t={t} from={0.1} to={HOOK_END - 0.05} y={120} text={"TONY STARK AL VER\nMI PC ABRIRSE SOLO 💀"} size={100} />
        <Cap t={t} from={WAKE_OUT + 0.15} to={S1_OUT - 0.05} y={130} text={"ÉL NECESITÓ MILLONES\nPARA DESPERTAR A JARVIS"} size={92} />
        <Cap t={t} from={WAKE_VOICE} to={WAKE_VOICE + 1.1} y={1250} text={"“WAKE UP,\nDADDY'S HOME”"} size={90} color="#ffe14a" />
        <Cap t={t} from={S1_OUT + 0.1} to={CLAP1 + 1.5} y={130} text={"YO CON MI PC:"} size={118} />
        <Cap t={t} from={CLAP1 - 0.1} to={OPEN - 0.05} y={1170} text={"DOS PALMADAS 👏👏"} size={96} bumps={[CLAP1, CLAP2]} />
        <Cap t={t} from={OPEN} to={OPEN + 1.9} y={130} text={"¿¿Y SE ABRE\nTODO SOLO??"} size={108} />
        <Cap t={t} from={OPEN + 2.2} to={S2_OUT - 0.05} y={130} text={"SIN TOCAR NADA 😎"} size={108} />
        <Cap t={t} from={S2_OUT + 0.05} to={CLOSE - 0.05} y={130} text={"OTRAS DOS\nPALMADAS…"} size={108} bumps={CLAPS2} />
        <Cap t={t} from={CLOSE} to={END_OUT - 0.05} y={130} text={"…Y TODO\nCERRADO ✌️"} size={108} />
        <Cap t={t} from={END_OUT + 0.1} to={99} y={130} text={"MI PROPIO\nJARVIS"} size={128} color="#7ff0ff" />

        {/* ───────── MEMES FLOTANDO (sin marcos) ───────── */}
        {/* "Yo" señalado con círculo y flecha mientras hago las palmadas */}
        <Float t={t} from={CLAP1 - 0.2} to={OPEN - 0.1} x={270} y={1360} w={540} h={303} src="img/yo.jpg" rot={-3}>
          <svg viewBox="0 0 540 303" width="540" height="303" style={{ position: "absolute", inset: 0 }}>
            <ellipse cx="270" cy="160" rx="92" ry="132" fill="none" stroke="#ff2a2a" strokeWidth="9" strokeLinecap="round" transform="rotate(-4 270 160)" />
            <path d="M 70 70 C 120 80 160 110 196 140" fill="none" stroke="#ff2a2a" strokeWidth="9" strokeLinecap="round" />
            <path d="M 196 140 L 168 138 M 196 140 L 184 114" fill="none" stroke="#ff2a2a" strokeWidth="9" strokeLinecap="round" />
            <text x="22" y="62" fontFamily="Anton, Impact" fontSize="70" fill="#fff" stroke="#000" strokeWidth="7" paintOrder="stroke fill">
              YO
            </text>
          </svg>
        </Float>
        <Float t={t} from={OPEN + 0.05} to={OPEN + 1.9} x={590} y={1230} w={430} h={402} src="img/scream.jpg" rot={4} />
        <Float t={t} from={OPEN + 2.3} to={S2_OUT - 0.1} x={40} y={1220} w={420} h={420} src="img/bow.png" rot={-5} feather={false} />
        <Float t={t} from={S2_OUT + 0.6} to={CLOSE + 0.9} x={530} y={1250} w={470} h={376} src="img/chill.jpg" rot={4} />
      </AbsoluteFill>

      {/* Viñeta roja de alarma (suave) */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(255,30,30,0.85) 100%)", opacity: alarm }} />

      {/* ───────── AUDIO ───────── */}
      <Sequence from={Math.round(WAKE_OUT * fps)} durationInFrames={Math.round(WAKE_LEN * fps)} layout="none">
        <Audio src={staticFile("audio/wake_normal.wav")} volume={1} />
      </Sequence>
      <At t={OPEN} src="audio/alarm.mp3" volume={0.2} dur={1.5} fade={0.4} />
      {VO.map((v) => (
        <At key={v.file} t={v.at} src={"audio/" + v.file} volume={1} />
      ))}
    </AbsoluteFill>
  );
};

// Demo real en perspectiva (esquinas del monitor gigante)
const DemoLayer: React.FC<{ start: number; vol: (f: number) => number }> = ({ start, vol }) => {
  const { fps } = useVideoConfig();
  return (
    <Video
      src={staticFile("media/demo.mp4")}
      trimBefore={Math.round(start * fps)}
      volume={vol}
      style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: DEMO_TRANSFORM }}
    />
  );
};

// Reproduce un audio en el instante t (con salida suave si tiene duración)
const At: React.FC<{ t: number; src: string; volume: number; dur?: number; fade?: number }> = ({ t, src, volume, dur, fade: fd = 0.05 }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(t * fps))} durationInFrames={dur ? Math.round(dur * fps) : undefined} layout="none">
      <Audio
        src={staticFile(src)}
        volume={(f) => {
          if (!dur) return volume;
          return volume * clamp01((dur - f / fps) / fd);
        }}
      />
    </Sequence>
  );
};
