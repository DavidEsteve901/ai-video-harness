import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import cfg from "../edit.v2.json";
import { ANTON, At, Cap, RED, Stroke, YELLOW, clamp01, decay, easeOut } from "./VR003";

// VR003 V2 · «Tony se entera»
// Gag en 4 golpes, sin logo ni eslogan: grito → plantilla «Jarvis,» que se escribe → demo real (palmadas) → «Jarvis, tenemos que hablar.»

// ───────────────────────── Tiempos (segundos del vídeo final) ─────────────────────────
const HOOK_END = cfg.hook.end;
const D0 = cfg.demo.start; // entra la demo
const S1 = cfg.demo.seg1;
const S2 = cfg.demo.seg2;
const S1_LEN = S1.srcEnd - S1.srcStart;
const S2_OUT = D0 + S1_LEN; // arranca el tramo acelerado
const S2_LEN = (S2.srcEnd - S2.srcStart) / S2.speed;
const E0 = S2_OUT + S2_LEN; // todo montado
const SAD2 = cfg.sad2.start; // vuelve la plantilla «Jarvis,»
const CLAPS = cfg.demo.claps.map((c) => D0 + (c - S1.srcStart));
const OPEN = S2_OUT + (cfg.demo.openSrc - S2.srcStart) / S2.speed; // empiezan a abrirse las ventanas
const ET = cfg.demo.esteTio;
const WIN = cfg.demo.winSrc.map((w) => S2_OUT + (w - S2.srcStart) / S2.speed); // instantes en que aparece cada ventana
const CAM = cfg.demo.cam.map((k) => ({ t: OPEN + k.dt, s: k.s, x: k.x, y: k.y }));
// cámara sobre la demo: interpola entre fotogramas clave (escala y punto de interés en %)
const camAt = (t: number) => {
  if (t <= CAM[0].t) return CAM[0];
  for (let i = 1; i < CAM.length; i++) {
    if (t <= CAM[i].t) {
      const a = CAM[i - 1];
      const b = CAM[i];
      const e = easeOut(clamp01((t - a.t) / (b.t - a.t)));
      return { t, s: a.s + (b.s - a.s) * e, x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e };
    }
  }
  return CAM[CAM.length - 1];
};

// ───────────────────────── Texto que se escribe en la plantilla ─────────────────────────
type Item = { at: number; text: string; hl?: boolean };
const WORD_STEP = 0.1;
const wordTimes = (items: Item[]) =>
  items.flatMap((it) => it.text.split(" ").map((w, j) => ({ w, at: it.at + j * WORD_STEP, hl: !!it.hl })));

const Typed: React.FC<{ t: number; items: Item[] }> = ({ t, items }) => (
  <div style={{ display: "flex", flexWrap: "wrap", columnGap: 26, rowGap: 6 }}>
    {wordTimes(items).map((o, i) => {
      const p = clamp01((t - o.at) / 0.12);
      const hlP = o.hl ? easeOut(clamp01((t - o.at - 0.02) / 0.3)) : 0;
      return (
        <span
          key={i}
          style={{
            position: "relative",
            isolation: "isolate",
            opacity: p > 0 ? 1 : 0,
            transform: `translateY(${(1 - p) * 14}px) scale(${0.92 + 0.08 * p})`,
          }}
        >
          {o.hl && (
            <span
              style={{
                position: "absolute",
                left: -13,
                right: -13,
                top: "8%",
                bottom: "-2%",
                background: YELLOW,
                transform: `scaleX(${hlP})`,
                transformOrigin: "left center",
                zIndex: -1,
              }}
            />
          )}
          {o.w}
        </span>
      );
    })}
  </div>
);

// ───────────────────────── Plantilla «Jarvis,»: la franja de texto se mantiene y la imagen de abajo va cambiando ─────────────────────────
const K = 1080 / 640; // la foto original mide 640 de ancho; su franja blanca de arriba mide 255
const BAND_TOP = 250;
const BAND_H = 620;
const PHOTO_TOP = BAND_TOP + BAND_H;
const PHOTO_H = (654 - 255) * K;

type Shot = { kind: "sad" | "taller" | "snap" | "hud"; from: number; srcStart?: number };

// Un plano (se monta dentro de un <Sequence>: useCurrentFrame() es local al plano)
const ShotView: React.FC<{ shot: Shot; len: number; punchAt?: number }> = ({ shot, len, punchAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lt = f / fps;
  const p = clamp01(lt / len);
  const punch = punchAt !== undefined ? 0.06 * decay(shot.from + lt, punchAt, 0.14) : 0;
  const fill: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1080, height: PHOTO_H, objectFit: "cover" };
  if (shot.kind === "sad")
    return <Img src={staticFile("media/jarvis.webp")} style={{ position: "absolute", left: 0, top: -255 * K, width: 1080, transform: `scale(${1 + 0.07 * easeOut(p)})`, transformOrigin: "62% 72%" }} />;
  if (shot.kind === "taller")
    return (
      <OffthreadVideo
        src={staticFile("media/taller.mp4")}
        trimBefore={Math.round((shot.srcStart ?? 3.6) * fps)}
        muted
        style={{ ...fill, transform: `scale(${1.04 + 0.06 * p})`, filter: "saturate(1.1) brightness(1.1)" }}
      />
    );
  if (shot.kind === "snap")
    return (
      <Img
        src={staticFile("media/snap.jpg")}
        style={{ ...fill, objectPosition: "50% 20%", transform: `scale(${1.02 + 0.08 * p + punch})`, transformOrigin: "55% 25%" }}
      />
    );
  return (
    <Img src={staticFile("media/hud.jpg")} style={{ ...fill, objectPosition: "50% 40%", transform: `scale(${1.02 + 0.1 * easeOut(p)})`, transformOrigin: "50% 40%", filter: "brightness(0.95)" }} />
  );
};

const MemeScene: React.FC<{ t: number; t0: number; t1: number; items: Item[]; shots: Shot[]; punchAt?: number; size: number }> = ({ t, t1, items, shots, punchAt, size }) => {
  const { fps } = useVideoConfig();
  const bg = shots.find((sh, i) => t >= sh.from && (i === shots.length - 1 || t < shots[i + 1].from)) ?? shots[0];
  const bgSrc = bg.kind === "snap" ? "media/snap.jpg" : bg.kind === "hud" ? "media/hud.jpg" : "media/jarvis.webp";
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Img src={staticFile(bgSrc)} style={{ position: "absolute", inset: 0, width: 1080, height: 1920, objectFit: "cover", filter: "blur(40px) brightness(0.3)", transform: "scale(1.5)" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: BAND_TOP,
          width: 1080,
          height: BAND_H,
          background: "#fff",
          padding: "54px 72px 0 72px",
          boxSizing: "border-box",
          fontFamily: ANTON,
          fontSize: size,
          lineHeight: 1.1,
          color: "#0a0a0a",
        }}
      >
        <Typed t={t} items={items} />
      </div>
      <div style={{ position: "absolute", left: 0, top: PHOTO_TOP, width: 1080, height: PHOTO_H, overflow: "hidden", boxShadow: "0 0 70px rgba(0,0,0,0.8)", background: "#000" }}>
        {shots.map((sh, i) => {
          const to = i + 1 < shots.length ? shots[i + 1].from : t1;
          return (
            <Sequence key={i} from={Math.round(sh.from * fps)} durationInFrames={Math.max(1, Math.round((to - sh.from) * fps))} layout="none">
              <ShotView shot={sh} len={to - sh.from} punchAt={sh.kind === "snap" ? punchAt : undefined} />
            </Sequence>
          );
        })}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 55%, transparent 50%, rgba(0,0,0,0.55) 100%)" }} />
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── La demo (en vertical, 16:9 sobre fondo desenfocado) ─────────────────────────
const DemoLayers: React.FC<{ style: React.CSSProperties; audio?: boolean }> = ({ style, audio }) => {
  const { fps } = useVideoConfig();
  const src = staticFile("media/demo.mp4");
  const payoff = cfg.demo.payoffSrc;
  return (
    <>
      <Sequence from={Math.round(D0 * fps)} durationInFrames={Math.round(S1_LEN * fps)} layout="none">
        <OffthreadVideo
          src={src}
          trimBefore={Math.round(S1.srcStart * fps)}
          muted={!audio}
          volume={audio ? (f) => (f / fps > S1_LEN - 0.15 ? clamp01((S1_LEN - f / fps) / 0.15) : 1) : undefined}
          style={style}
        />
      </Sequence>
      <Sequence from={Math.round(S2_OUT * fps)} durationInFrames={Math.round(S2_LEN * fps)} layout="none">
        <OffthreadVideo src={src} trimBefore={Math.round(S2.srcStart * fps)} playbackRate={S2.speed} muted style={style} />
      </Sequence>
      <Sequence from={Math.round(E0 * fps)} durationInFrames={Math.round((SAD2 - E0) * fps)} layout="none">
        <OffthreadVideo src={src} trimBefore={Math.round(payoff * fps)} muted style={style} />
      </Sequence>
    </>
  );
};

export const VR003V2: React.FC<{ voice: boolean }> = ({ voice }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const t = frame / fps;

  const [handle] = useState(() => delayRender("fuentes"));
  useEffect(() => {
    loadFont({ family: "Anton", url: staticFile("fonts/Anton-Regular.woff2"), weight: "400" })
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);

  const inHook = t < HOOK_END;
  const inSad1 = t >= HOOK_END && t < D0;
  const inDemo = t >= D0 && t < SAD2;
  const inSad2 = t >= SAD2;

  const hlAt = cfg.sad1.items.find((i: Item) => i.hl)!.at;
  const boomAt = cfg.sad2.boomAt;

  // Sacudidas: grito, cortes, palmadas y apertura de ventanas
  const shake =
    (inHook ? 7 + 10 * clamp01((t - 0.2) / 0.8) : 0) +
    16 * decay(t, HOOK_END, 0.13) +
    8 * decay(t, hlAt, 0.1) +
    10 * decay(t, D0, 0.1) +
    CLAPS.reduce((s, c) => s + 9 * decay(t, c, 0.07), 0) +
    8 * decay(t, E0, 0.12) +
    6 * decay(t, SAD2, 0.1) +
    12 * decay(t, boomAt, 0.15);
  const shakeX = shake * Math.sin(frame * 3.1);
  const shakeY = shake * Math.cos(frame * 2.3);

  const flashAt = (ft: number, peak: number) =>
    t < ft ? 0 : interpolate(t - ft, [0, 0.03, 0.18], [0, peak, 0], { extrapolateRight: "clamp" });
  const flash = Math.max(flashAt(HOOK_END, 0.9), flashAt(D0, 0.7), flashAt(cfg.sad1.shots[1].from, 0.3), flashAt(cfg.sad1.shots[2].from, 0.35), flashAt(E0, 0.3), flashAt(SAD2, 0.3));

  const zoomDemo = 1 + CLAPS.reduce((s, c) => s + 0.06 * decay(t, c, 0.12), 0);

  // «Este tío»: círculo en el teclado y flecha (dibujo)
  const circleP = clamp01((t - ET.circleAt) / 0.32);
  const arrowP = clamp01((t - ET.arrowAt) / 0.2);
  const headP = clamp01((t - ET.arrowAt - 0.18) / 0.1);
  const etOut = t > ET.to ? 1 - clamp01((t - ET.to) / 0.1) : 1;

  // Última palabra: corte a negro tras el golpe final
  const black = t >= boomAt + 0.45 ? 1 : 0;

  const ticks = [...wordTimes(cfg.sad1.items as Item[]), ...wordTimes(cfg.sad2.items as Item[])].map((w) => w.at);

  return (
    <AbsoluteFill style={{ background: "#05060a", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>
        {/* ───────── 1 · GANCHO: Tony gritando ───────── */}
        {inHook && (
          <AbsoluteFill style={{ transform: `scale(${1.02 + 0.1 * clamp01(t / HOOK_END)})`, overflow: "hidden" }}>
            {/* el clip (360×640) trae barras negras: el contenido real es 360×462 desde y=90 */}
            <OffthreadVideo
              src={staticFile("media/scream.mp4")}
              trimBefore={Math.round(cfg.hook.srcStart * fps)}
              volume={0.75}
              style={{ position: "absolute", width: 1496, height: 2660, left: -208, top: -374, filter: "contrast(1.12) saturate(1.2)" }}
            />
          </AbsoluteFill>
        )}

        {/* ───────── 2 · «Jarvis, hay un tío que abre todo su ordenador con solo dos palmadas» ───────── */}
        {inSad1 && <MemeScene t={t} t0={HOOK_END} t1={D0} items={cfg.sad1.items as Item[]} shots={cfg.sad1.shots as Shot[]} punchAt={hlAt} size={106} />}

        {/* ───────── 3 · DEMO real (palmadas) ───────── */}
        {inDemo && (
          <AbsoluteFill style={{ background: "#05060a" }}>
            <DemoLayers style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover", filter: "blur(40px) brightness(0.42)", transform: "scale(1.15)" }} />
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
              <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: W,
                    height: 608,
                    transformOrigin: "0 0",
                    transform: (() => {
                      const c = camAt(t);
                      const tx = Math.min(0, Math.max(W - W * c.s, W / 2 - (c.x / 100) * W * c.s));
                      const ty = Math.min(0, Math.max(608 - 608 * c.s, 304 - (c.y / 100) * 608 * c.s));
                      return `translate(${tx}px, ${ty}px) scale(${c.s})`;
                    })(),
                  }}
                >
                  <DemoLayers style={{ width: W, height: 608, objectFit: "cover" }} audio />
                </div>
              </div>
              {/* círculo en las manos que dan las palmadas + flecha desde «ESTE TÍO» (coordenadas relativas al recuadro de la demo) */}
              <svg
                width={W}
                height={608}
                viewBox={`0 0 ${W} 608`}
                style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: etOut }}
                fill="none"
                stroke={RED}
                strokeWidth={13}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Stroke p={t >= ET.from ? circleP : 0}>{(d) => <ellipse cx={420} cy={225} rx={345} ry={205} transform="rotate(-6 420 225)" pathLength={1} style={d} />}</Stroke>
                <Stroke p={t >= ET.from ? arrowP : 0}>{(d) => <path d="M 700 700 Q 700 520 600 432" pathLength={1} style={d} />}</Stroke>
                <Stroke p={t >= ET.from ? headP : 0}>{(d) => <path d="M 619 483 L 600 432 L 653 445" pathLength={1} style={d} />}</Stroke>
              </svg>
            </div>

            {/* textos de la demo */}
            <Cap t={t} from={ET.labelAt} to={ET.to} y={1400} text={"ESTE TÍO"} size={170} color={YELLOW} rot={-5} />
            <Cap t={t} from={CLAPS[0] - 0.02} to={CLAPS[1] - 0.02} y={300} text={"¡CLAP!"} size={230} color={YELLOW} rot={-5} />
            <Cap t={t} from={CLAPS[1] - 0.02} to={OPEN - 0.05} y={260} text={"¡CLAP!"} size={290} color={YELLOW} rot={4} />
            <Cap t={t} from={OPEN} to={SAD2 - 0.1} y={210} text={"SIN TOCAR\nNADA"} size={140} />
          </AbsoluteFill>
        )}

        {/* ───────── 4 · «Jarvis, tenemos que hablar.» ───────── */}
        {inSad2 && <MemeScene t={t} t0={SAD2} t1={cfg.duration} items={cfg.sad2.items as Item[]} shots={cfg.sad2.shots as Shot[]} size={158} />}

        {/* texto del gancho */}
        <Cap t={t} from={0.05} to={HOOK_END - 0.02} y={170} text={cfg.hook.texto} size={124} />
      </AbsoluteFill>

      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <AbsoluteFill style={{ background: "#000", opacity: black }} />

      {/* ───────── AUDIO ───────── */}
      {/* el grito viene en el propio clip; justo después, corte seco y silencio (la voz entra tarde a propósito) */}
      <At t={HOOK_END - 0.03} src="audio/sfx_hit.wav" volume={0.45} />
      {ticks.map((tt, i) => (
        <At key={i} t={tt} src="audio/sfx_tick.wav" volume={0.35} />
      ))}
      <At t={hlAt} src="audio/sfx_hit.wav" volume={0.5} />
      {cfg.sad1.shots.slice(1).map((sh) => (
        <At key={sh.from} t={sh.from - 0.05} src="audio/sfx_whoosh.wav" volume={0.3} />
      ))}
      <At t={D0 - 0.1} src="audio/sfx_whoosh.wav" volume={0.5} />
      <At t={D0} src="audio/sfx_hit.wav" volume={0.5} />
      <At t={ET.circleAt} src="audio/sfx_scribble.wav" volume={0.45} />
      <At t={ET.arrowAt} src="audio/sfx_scribble.wav" volume={0.4} dur={0.3} fade={0.05} />
      <At t={ET.labelAt} src="audio/sfx_pop.wav" volume={0.5} />
      {CLAPS.map((c) => (
        <At key={c} t={c - 0.02} src="audio/sfx_hit.wav" volume={0.55} />
      ))}
      {/* ventanas: un sonido suave por cada ventana que aparece de verdad (sin riser ni boom) + barrido bajito en cada movimiento de cámara */}
      {WIN.map((w, i) => (
        <At key={w} t={w} src={`audio/sfx_win${(i % 3) + 1}.wav`} volume={0.5} />
      ))}
      {[CAM[0].t, CAM[3].t, CAM[5].t].map((c) => (
        <At key={c} t={c} src="audio/sfx_whoosh.wav" volume={0.22} />
      ))}
      <At t={E0} src="audio/sfx_ding.wav" volume={0.28} />
      <At t={SAD2 - 0.05} src="audio/sfx_hit.wav" volume={0.4} />
      <At t={boomAt} src="audio/sfx_boom.wav" volume={0.85} />
      {voice && cfg.voz.map((v) => <At key={v.file} t={v.at} src={v.file} volume={1} />)}
    </AbsoluteFill>
  );
};
