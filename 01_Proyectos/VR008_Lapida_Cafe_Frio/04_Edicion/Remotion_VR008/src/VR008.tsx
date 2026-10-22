import React, { useEffect, useState } from "react";
import { AbsoluteFill, Img, Sequence, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { ANTON, C, clamp01, decay, easeBack, easeInOut, easeOut, lerp, prog } from "./theme";
import { Mug, Person } from "./Characters";
import { DeskFront, LucasScreen, Monitor, Office, RealScreen, SCREEN_H, SCREEN_W, kf } from "./Desk";
import { Montage, Rewind, Tomb } from "./Scenes";
import { I1, I2, I3, I4, I6, S, T, voDur, we, ws } from "./timeline";

// ───────────────────────── utilidades ─────────────────────────
const useFonts = () => {
  const [h] = useState(() => delayRender("fuentes"));
  useEffect(() => {
    Promise.all([
      loadFont({ family: "Anton", url: staticFile("fonts/Anton-Regular.woff2"), weight: "400" }),
      loadFont({ family: "Inter", url: staticFile("fonts/Inter-ExtraBold.woff2"), weight: "800" }),
    ]).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
};

const At: React.FC<{ t: number; src: string; volume?: number | ((f: number) => number); dur?: number }> = ({ t, src, volume = 1, dur }) => {
  const { fps } = useVideoConfig();
  // la voz manda: efectos y música van más bajos que la locución
  const gain = src.startsWith("audio/vo") ? 1 : 0.6;
  const vol = typeof volume === "number" ? volume * gain : (f: number) => volume(f) * gain;
  return (
    <Sequence from={Math.max(0, Math.round(t * fps))} durationInFrames={dur ? Math.round(dur * fps) : undefined} layout="none">
      <Audio src={staticFile(src)} volume={vol} />
    </Sequence>
  );
};

/** Subtítulo grande tipo documental-meme */
const Cap: React.FC<{ t: number; from: number; to: number; children: React.ReactNode; color?: string; size?: number; y?: number; hit?: number }> = ({ t, from, to, children, color = "#fff", size = 92, y = 1430, hit }) => {
  if (t < from || t > to + 0.15) return null;
  const a = clamp01((t - from) / 0.1) * (1 - clamp01((t - to) / 0.12));
  const pop = 1 + 0.16 * decay(t, hit ?? from, 0.09) - 0.1 * (1 - easeOut(clamp01((t - from) / 0.16)));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", padding: "0 44px", textAlign: "center", opacity: a, transform: `scale(${pop})`, fontFamily: ANTON, fontSize: size, lineHeight: 1.04, letterSpacing: 2, color, WebkitTextStroke: `${Math.round(size * 0.1)}px #0A0C16`, paintOrder: "stroke fill", whiteSpace: "pre-line" }}>
      <span>{children}</span>
    </div>
  );
};

const blink = (t: number) => Math.max(0, 1 - Math.abs(((t + 0.9) % 3.1) - 2.9) / 0.07);
/** fuerza tiempos estrictamente crecientes en una lista de puntos clave */
const asc = (pts: [number, number][]): [number, number][] => {
  const out: [number, number][] = [];
  pts.forEach(([x, v], i) => out.push([i && x <= out[i - 1][0] ? out[i - 1][0] + 0.02 : x, v]));
  return out;
};

// ═════════════════════════ ESCENA: Lucas «a mano» ═════════════════════════
const DeskLucas: React.FC<{ t: number }> = ({ t }) => {
  const s0 = T.cut1, pe = T.plopEditor, pt = T.plopTerminal, pb = T.plopBrowser, rl = T.relief, cd = T.cold;
  const hot = kf(t, asc([[s0, 1], [pb, 0.8], [cd - 0.8, 0.65], [cd, 0.6], [cd + 0.35, 0]]));
  const curve = kf(t, asc([[s0, 0.9], [pe - 0.5, 0.9], [pe + 0.4, 0.3], [pb, -0.1], [rl, 0.7], [cd - 1.0, 0.6], [cd - 0.3, 0.2], [cd, -0.4], [cd + 0.4, -1]]));
  const lid = clamp01(kf(t, asc([[s0, 0.1], [pt, 0.15], [pb, 0.25], [rl, 0.1], [cd - 0.1, 0.1], [cd + 0.4, 0.55]])) + blink(t) * 0.9);
  const sweat = kf(t, asc([[pe - 0.4, 0], [pb, 0.9], [rl - 0.1, 0.9], [rl + 0.2, 0]]));
  const browTilt = kf(t, asc([[s0, -4], [pe - 0.4, 6], [pb, 12], [rl, -6], [cd, 0], [cd + 0.4, 16]]));
  const sad = kf(t, asc([[s0, 0], [cd, 0], [cd + 0.7, 1]]));
  const lx = kf(t, asc([[s0, 0], [pe, -0.3], [pt, 0.2], [pb + 0.3, 0.4], [rl, 0], [cd - 0.2, 0], [cd + 0.3, 0.9]]));
  const ly = kf(t, asc([[s0, -0.8], [cd - 0.2, -0.8], [cd + 0.3, 0.9]]));
  const open = kf(t, asc([[pb, 0], [pb + 0.3, 0.25], [rl - 0.1, 0], [cd, 0]]));
  const mins = Math.round(kf(t, asc([[s0, 0], [pe - 0.3, 0], [rl - 0.2, 17], [cd - 1.5, 22], [cd, 31]])));
  const chipPop = easeBack(clamp01((t - (s0 + 0.5)) / 0.25));
  const sc = 1 + 0.05 * clamp01((t - s0) / (T.montageStart - s0));
  const frio = t >= cd;
  return (
    <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: "50% 40%" }}>
      <Office warm={0} t={t} />
      <Monitor glow={frio ? "rgba(90,150,255,0.35)" : "rgba(120,170,255,0.4)"}>
        <LucasScreen t={t} times={{ editor: pe, terminal: pt, browser: pb }} />
      </Monitor>
      <div style={{ position: "absolute", left: 540 - 520 * 0.45, top: 1340 - 560 * 0.9 + Math.sin(t * 2) * 3 }}>
        <Person who="lucas" scale={0.9} look={{ x: lx, y: ly }} lid={lid} browTilt={browTilt} curve={curve} open={open} sweat={sweat} sad={sad} bob={Math.sin(t * 2) * 3} />
      </div>
      <DeskFront warm={0} />
      <div style={{ position: "absolute", left: 760, top: 1125, transform: `rotate(${frio ? -2 : 0}deg)` }}>
        <Mug t={t} hot={hot} scale={0.95} />
      </div>
      <div style={{ position: "absolute", left: 60, top: 880, transform: `scale(${chipPop})`, transformOrigin: "0 50%", padding: "10px 26px 12px", borderRadius: 20, background: "rgba(10,12,22,0.85)", boxShadow: "0 0 0 3px rgba(255,255,255,0.14)", fontFamily: ANTON, fontSize: 68, letterSpacing: 3, color: frio ? C.coldBlue : "#fff" }}>
        LUN {`9:${String(mins).padStart(2, "0")}`}
      </div>
    </AbsoluteFill>
  );
};

// ═════════════════════════ ESCENA: Sofía llega ═════════════════════════
const DeskSofia: React.FC<{ t: number }> = ({ t }) => {
  const sw = prog(t, T.sofiaStart + 0.05, T.swapEnd, easeInOut);
  const enter = prog(t, T.sofiaStart + 0.2, T.swapEnd + 0.25, easeBack);
  const drop = T.drop;
  const shock = prog(t, drop, drop + 0.12, easeOut);
  const sofSmirk = prog(t, drop + 0.25, drop + 0.7, easeOut);
  const lucasOpen = kf(t, asc([[T.sofiaStart, 0], [T.zoomIn, 0.05], [T.click, 0.15], [drop, 0.15], [drop + 0.1, 1]]));
  const warm = prog(t, T.sofiaStart, T.drop, easeInOut) * 0.4 + (t > drop ? 0.4 : 0);
  const chipT = t - T.clipDone;
  return (
    <AbsoluteFill>
      <Office warm={warm} t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-1150 * sw}px)` }}>
        <Monitor>
          <LucasScreen t={999} times={{ editor: 0, terminal: 0, browser: 0 }} settled />
        </Monitor>
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${1150 * (1 - sw)}px)` }}>
        <Monitor glow="rgba(80,255,150,0.35)" warm={0.3}>
          {t < T.clip0 ? (
            <Img src={staticFile("media/senior_start.png")} style={{ width: SCREEN_W, height: SCREEN_H }} />
          ) : (
            <Sequence from={Math.round(T.clip0 * 60)} layout="none">
              <RealScreen t={t} t0={T.clip0} clickT={T.click} dropT={T.drop} zoomIn={T.zoomIn} />
            </Sequence>
          )}
          {t >= T.clipDone - 0.02 && (
            <div style={{ position: "absolute", right: 22, bottom: 40, transform: `scale(${easeBack(clamp01(chipT / 0.22))})`, transformOrigin: "100% 100%", padding: "6px 22px 8px", borderRadius: 16, background: "rgba(8,20,14,0.9)", boxShadow: `0 0 0 3px ${C.green}`, fontFamily: ANTON, fontSize: 58, letterSpacing: 2, color: C.green }}>
              ⏱ 2,8 s
            </div>
          )}
        </Monitor>
      </div>
      <div style={{ position: "absolute", left: 270 - 520 * 0.4, top: 1340 - 560 * 0.8 + Math.sin(t * 2) * 3 }}>
        <Person
          who="lucas"
          scale={0.8}
          look={{ x: lerp(0.9, 0.7, shock), y: lerp(-0.2, -0.7, shock) }}
          lid={blink(t) * 0.9 + 0.18 * (1 - shock) + (t > T.sofiaStart && t < T.zoomIn ? 0.1 : 0)}
          browTilt={lerp(10, -18, shock)}
          browLift={shock * 26}
          curve={lerp(-0.8, -0.2, shock)}
          open={lucasOpen}
          sad={1 - shock}
          sweat={shock * 0.8}
          bob={Math.sin(t * 2) * 3}
        />
      </div>
      <div style={{ position: "absolute", left: 790 - 520 * 0.5 + 760 * (1 - enter), top: 1340 - 560 * 0.95 + Math.sin(t * 1.8) * 3 }}>
        <Person
          who="sofia"
          scale={0.95}
          look={{ x: lerp(-0.2, -0.9, sofSmirk), y: lerp(-0.7, 0.1, sofSmirk) }}
          lid={blink(t + 0.8) * 0.9 + 0.05}
          browTilt={lerp(-6, -14, sofSmirk)}
          browLift={sofSmirk * 14}
          curve={lerp(0.4, 1, sofSmirk)}
          skew={lerp(0.3, 1, sofSmirk)}
          bob={Math.sin(t * 1.8) * 3}
        />
      </div>
      <DeskFront warm={warm} />
      <div style={{ position: "absolute", left: 40, top: 1175 }}>
        <Mug t={t} hot={0} scale={0.8} tilt={-3} />
      </div>
      <div style={{ position: "absolute", left: 830 + 700 * (1 - enter), top: 1110 }}>
        <Mug t={t} hot={1} scale={0.95} />
      </div>
    </AbsoluteFill>
  );
};

// ═════════════════════════ COMPOSICIÓN ═════════════════════════
export const VR008: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  useFonts();
  const last = T.montageSteps[T.montageSteps.length - 1];

  const shake = 16 * decay(t, 0.0, 0.14) + 7 * decay(t, T.cold, 0.15) + 16 * decay(t, last, 0.2) + 18 * decay(t, T.drop, 0.16) + 8 * decay(t, T.sofiaEnd, 0.12);
  const sx = Math.sin(t * 91) * shake, sy = Math.cos(t * 77) * shake * 0.7;
  const flash =
    0.5 * decay(t, last, 0.1) + 0.9 * decay(t, T.sofiaStart - 0.04, 0.12) + 1.0 * decay(t, T.drop - 0.01, 0.09) + 0.9 * decay(t, T.sofiaEnd - 0.02, 0.14) + 0.7 * decay(t, T.cut1 - 0.03, 0.1);

  let scene: React.ReactNode;
  if (t < T.cut1) scene = <Tomb t={t} dawn={0} slamAt={-0.1} oldOpacity={1} strike={0} newReveal={0} />;
  else if (t < T.montageStart) scene = <DeskLucas t={t} />;
  else if (t < T.sofiaStart) scene = <Montage t={t} stepTimes={T.montageSteps} end={T.montageEnd} />;
  else if (t < T.sofiaEnd) scene = <DeskSofia t={t} />;
  else {
    const dawn = prog(t, T.sofiaEnd + 0.1, T.sofiaEnd + 1.9, easeInOut);
    scene = (
      <Tomb t={t} dawn={dawn} oldOpacity={1 - prog(t, T.sofiaEnd + 0.45, T.sofiaEnd + 0.9, easeInOut)} strike={prog(t, T.sofiaEnd + 0.25, T.sofiaEnd + 0.6, easeOut)} newReveal={prog(t, T.sofiaEnd + 1.0, T.sofiaEnd + 2.0, (x) => x)} mugHot={1} showMug={dawn > 0.5} />
    );
  }

  const w2 = (i: number) => ({ s: ws(2, i), e: we(2, i) });
  const w3 = (i: number) => ({ s: ws(3, i), e: we(3, i) });
  const w4 = (i: number) => ({ s: ws(4, i), e: we(4, i) });
  const w6 = (i: number) => ({ s: ws(6, i), e: we(6, i) });
  const w1 = (i: number) => ({ s: ws(1, i), e: we(1, i) });
  const endOf = (n: number) => S[n] + voDur(n);
  const total = T.total;

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px)` }}>{scene}</AbsoluteFill>
      <Rewind t={t} from={T.rewindStart} to={T.rewindEnd} />

      {/* subtítulos: salen de las palabras de la locución */}
      <Cap t={t} from={w1(I1.esta).s} to={w1(I1.lucas).e + 0.2}>ESTA SERÁ LA LÁPIDA{"\n"}DE LUCAS</Cap>
      <Cap t={t} from={w1(I1.y).s - 0.05} to={endOf(1) + 0.3} color={C.amber}>Y SI NADA CAMBIA…</Cap>
      <Cap t={t} from={w2(I2.lunes).s} to={w2(I2.lunes).e + 0.35} y={1450}>LUNES.</Cap>
      <Cap t={t} from={w2(I2.nueve).s - 0.05} to={w2(I2.punto).e + 0.3} y={1450}>9:00 EN PUNTO.</Cap>
      <Cap t={t} from={w2(I2.abre).s - 0.03} to={Math.min(w2(I2.editor).e + 0.2, w2(I2.terminal - 1).s - 0.05)} y={1450}>ABRE EL EDITOR</Cap>
      <Cap t={t} from={w2(I2.terminal - 1).s - 0.03} to={Math.min(w2(I2.terminal).e + 0.2, w2(I2.navegador - 1).s - 0.05)} y={1450}>LA TERMINAL</Cap>
      <Cap t={t} from={w2(I2.navegador - 1).s - 0.03} to={w2(I2.navegador).e + 0.25} y={1450}>EL NAVEGADOR</Cap>
      <Cap t={t} from={w2(I2.y).s - 0.03} to={w2(I2.trabajar).e + 0.2} size={84} y={1440}>…Y CUANDO POR FIN{"\n"}EMPIEZA A TRABAJAR</Cap>
      <Cap t={t} from={w2(I2.cafe - 1).s - 0.03} to={T.montageStart + 0.1} y={1450} hit={w2(I2.frio).s}>EL CAFÉ YA ESTÁ <span style={{ color: C.coldBlue }}>FRÍO</span></Cap>
      <Cap t={t} from={w3(I3.manana).s} to={w3(I3.manana).e + 0.25} y={1450}>MAÑANA</Cap>
      <Cap t={t} from={w3(I3.lo).s - 0.05} to={w3(I3.mismo).e + 0.3} y={1450}>LO MISMO</Cap>
      <Cap t={t} from={w3(I3.catorce).s - 0.05} to={T.sofiaStart - 0.02} y={1440} color={C.red} size={112} hit={w3(I3.seis).s}>14.600 VECES</Cap>
      <Cap t={t} from={w4(I4.hasta).s} to={w4(I4.lado).e + 0.2} size={84} y={1450}>HASTA QUE <span style={{ color: C.amberHot }}>SOFÍA</span>{"\n"}SE SIENTA A SU LADO</Cap>
      <Cap t={t} from={w4(I4.un).s - 0.03} to={T.click - 0.05} y={1440} size={110}>UN BOTÓN.</Cap>
      <Cap t={t} from={S[5]} to={T.sofiaEnd - 0.05} y={1440} size={110} color={C.green} hit={S[5]}>TRES SEGUNDOS.</Cap>
      <Cap t={t} from={w6(I6.esta).s} to={w6(I6.lucas).e + 0.25} size={88} y={1560} hit={S[6]}>ESTA ES LA LÁPIDA DE LUCAS</Cap>
      <Cap t={t} from={w6(I6.ahora).s - 0.05} to={total} size={140} y={1560} color={C.amberHot} hit={w6(I6.ahora).s}>AHORA.</Cap>

      <AbsoluteFill style={{ background: "#fff", opacity: Math.min(1, flash), pointerEvents: "none" }} />

      {/* ───────── audio ───────── */}
      {[1, 2, 3, 4, 5, 6].map((n) => (<At key={n} t={S[n]} src={`audio/vo0${n}.wav`} volume={1} />))}
      <At t={0} src="audio/mus_drone.wav" volume={(f) => 0.5 * (1 - clamp01((f / 60 - (T.cut1 - 0.9)) / 0.8))} dur={T.cut1 + 0.2} />
      <At t={0} src="audio/sfx_wind.wav" volume={0.3} dur={T.cut1} />
      <At t={0.0} src="audio/sfx_thud.wav" volume={0.95} />
      <At t={T.rewindStart} src="audio/sfx_rewind.wav" volume={0.7} />
      {[0.1, 1.1, 2.1].map((x, i) => (<At key={"tc" + i} t={S[2] + x} src={i % 2 ? "audio/sfx_toc.wav" : "audio/sfx_tic.wav"} volume={0.22} />))}
      <At t={T.plopEditor} src="audio/sfx_plop1.wav" volume={0.7} />
      <At t={T.plopTerminal} src="audio/sfx_plop2.wav" volume={0.7} />
      <At t={T.plopBrowser} src="audio/sfx_plop3.wav" volume={0.7} />
      {[T.plopEditor + 0.45, T.plopTerminal + 0.45, T.plopBrowser + 0.45].map((x, i) => (<At key={"ck" + i} t={x} src="audio/sfx_click.wav" volume={0.55} />))}
      {[0, 0.13, 0.24, 0.38].map((x, i) => (<At key={"kb" + i} t={T.plopBrowser + 1.2 + x} src="audio/sfx_click.wav" volume={0.3} />))}
      <At t={T.cold - 0.05} src="audio/sfx_womp.wav" volume={0.55} />
      <At t={T.cold + 0.1} src="audio/sfx_ice.wav" volume={0.6} />
      {T.montageSteps.map((x, i) => (<At key={"pg" + i} t={x} src="audio/sfx_page.wav" volume={0.45} />))}
      {T.montageSteps.map((x, i) => (<At key={"tk" + i} t={x + 0.04} src={i % 2 ? "audio/sfx_toc.wav" : "audio/sfx_tic.wav"} volume={0.2} />))}
      <At t={last - 1.1} src="audio/sfx_riser.wav" volume={(f) => 0.4 * clamp01(f / 60 / 1.0)} dur={1.1} />
      <At t={last} src="audio/sfx_thud.wav" volume={0.9} />
      <At t={T.sofiaStart} src="audio/sfx_whoosh.wav" volume={0.55} />
      <At t={T.sofiaStart + 0.35} src="audio/sfx_step.wav" volume={0.5} />
      <At t={T.sofiaStart + 0.55} src="audio/sfx_step.wav" volume={0.45} />
      <At t={T.swapEnd + 0.1} src="audio/sfx_clink.wav" volume={0.55} />
      <At t={T.click - 1.98} src="audio/sfx_riser.wav" volume={(f) => 0.42 * clamp01(f / 60 / 1.2) * (1 - clamp01((f / 60 - 1.5) / 0.1))} dur={1.7} />
      <At t={T.click} src="audio/sfx_click.wav" volume={0.9} />
      <At t={T.drop} src="audio/sfx_drop.wav" volume={0.95} />
      {[T.drop + 0.12, T.drop + 0.3, T.drop + 0.48].map((x, i) => (<At key={"pl" + i} t={x} src={`audio/sfx_plop${i + 1}.wav`} volume={0.6} />))}
      <At t={T.clipDone} src="audio/sfx_ding.wav" volume={0.6} />
      <At t={T.drop} src="audio/mus_warm.wav" volume={(f) => 0.3 * (1 - clamp01((f / 60 - (total - T.drop - 1.1)) / 1.0))} dur={total - T.drop} />
      <At t={T.sofiaEnd - 0.05} src="audio/sfx_whoosh.wav" volume={0.5} />
      <At t={T.sofiaEnd + 0.9} src="audio/sfx_birds.wav" volume={0.45} />
      <At t={T.sofiaEnd + 1.0} src="audio/sfx_ding.wav" volume={0.4} />
    </AbsoluteFill>
  );
};
