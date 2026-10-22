import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  delayRender,
  continueRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio, Video } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import cfg from "../edit.config.json";

// ───────────────────────── Paleta y medidas ─────────────────────────
const RED = "#ff2a3d";
const GREEN = "#33ff7a";
const PANEL_W = 960;
const PANEL_H = 540;
const PANEL_X = 60;
const JUNIOR_Y = 410;
const SENIOR_Y = 1130;
const ANTON = "Anton, Impact, sans-serif";
const INTER = "Inter, 'Segoe UI', Arial, sans-serif";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// ───────────────────────── Mapa de tiempos del Senior ─────────────────────────
// Convierte el tiempo del vídeo final en tiempo del bruto (para el cronómetro real).
const seniorSourceTime = (t: number) => {
  let acc = 0;
  for (const g of cfg.senior.segments) {
    const len = (g.end - g.start) / g.speed;
    if (t <= acc + len) return { src: g.start + (t - acc) * g.speed, speed: g.speed };
    acc += len;
  }
  const last = cfg.senior.segments[cfg.senior.segments.length - 1];
  return { src: last.end, speed: last.speed };
};

// ───────────────────────── Piezas ─────────────────────────
// Rótulo plano: color sólido, sin contorno ni sombras
const Label: React.FC<{ text: string; color: string; scale: number; y: number }> = ({
  text,
  color,
  scale,
  y,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: y - 80,
      height: 160,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: `scale(${scale})`,
      fontFamily: ANTON,
      fontSize: 132,
      letterSpacing: 5,
      color,
    }}
  >
    {text}
  </div>
);

const Chip: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 18px",
      borderRadius: 16,
      background: "rgba(5,6,10,0.72)",
      border: "1.5px solid rgba(255,255,255,0.18)",
      fontFamily: INTER,
      fontWeight: 800,
      fontSize: 34,
      color: "#fff",
      fontVariantNumeric: "tabular-nums",
      ...style,
    }}
  >
    {children}
  </div>
);

const ClockIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round">
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l3 2M9 2h6" />
  </svg>
);

// ───────────────────────── Pulso del borde del PRO ─────────────────────────
// Un pulso = ataque casi instantáneo + caída exponencial. Hay un impacto grande en el drop
// y un latido más pequeño en cada golpe de la canción (cfg.pulse), para que el borde "respire" con la música.
const pulseEnv = (x: number, tau: number, atk: number) => (x < 0 ? 0 : (1 - Math.exp(-x / atk)) * Math.exp(-x / tau));

// Dos estilos de efecto:
//  - "sync":  impacto grande en el drop + un latido en cada golpe de la canción.
//  - "suave": una sola respuesta limpia en el drop (subida suave, caída larga), sin latidos por el ritmo.
export type Fx = "sync" | "suave";

type PulseEvent = { t: number; amp: number; tau: number; atk: number; rings: number; ringDur: number; ringAlpha: number };
const buildEvents = (fx: Fx): PulseEvent[] => {
  if (fx === "suave") {
    return [{ t: cfg.dropTime, amp: cfg.suave.amp, tau: cfg.suave.tau, atk: cfg.suave.atk, rings: 1, ringDur: 1.0, ringAlpha: 0.5 }];
  }
  const ev: PulseEvent[] = [{ t: cfg.dropTime, amp: 1, tau: 0.26, atk: 0.015, rings: 3, ringDur: 0.6, ringAlpha: 1 }];
  for (let b = cfg.pulse.beatFirst; b < cfg.duration; b += cfg.pulse.beatPeriod) {
    ev.push({ t: b, amp: cfg.pulse.beatAmp, tau: 0.17, atk: 0.015, rings: 1, ringDur: 0.6, ringAlpha: 1 });
  }
  return ev;
};
const EVENTS: Record<Fx, PulseEvent[]> = { sync: buildEvents("sync"), suave: buildEvents("suave") };

const mixHex = (a: string, b: string, k: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [ar, ag, ab] = p(a);
  const [br, bg, bb] = p(b);
  const m = (x: number, y: number) => Math.round(x + (y - x) * k);
  return `rgb(${m(ar, br)}, ${m(ag, bg)}, ${m(ab, bb)})`;
};

const Panel: React.FC<{
  y: number;
  edge: string; // color del borde
  spread: number; // grosor del borde en px
  shadow: string; // halo exterior (CSS box-shadow)
  scale?: number;
  children: React.ReactNode;
}> = ({ y, edge, spread, shadow, scale = 1, children }) => (
  <div
    style={{
      position: "absolute",
      left: PANEL_X,
      top: y,
      width: PANEL_W,
      height: PANEL_H,
      borderRadius: 30,
      transform: `scale(${scale})`,
      boxShadow: `0 0 0 ${spread}px ${edge}, ${shadow}`,
      background: "#000",
    }}
  >
    <div style={{ position: "absolute", inset: 0, borderRadius: 30, overflow: "hidden" }}>{children}</div>
  </div>
);

// ───────────────────────── Composición ─────────────────────────
export type VR001Props = { top: string; bottom: string; fx: Fx };

export const VR001: React.FC<VR001Props> = ({ top, bottom, fx: fxMode }) => {
  const calm = fxMode === "suave";
  const events = EVENTS[fxMode];
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const td = cfg.dropTime;
  const dt = t - td;
  const dropFrame = Math.round(td * fps);

  // Fuentes locales (se esperan antes de pintar)
  const [handle] = useState(() => delayRender("fuentes"));
  useEffect(() => {
    Promise.all([
      loadFont({ family: "Anton", url: staticFile("fonts/Anton-Regular.woff2"), weight: "400" }),
      loadFont({ family: "Inter", url: staticFile("fonts/Inter-ExtraBold.woff2"), weight: "800" }),
      loadFont({ family: "Inter", url: staticFile("fonts/Inter-Bold.woff2"), weight: "700" }),
    ])
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);

  // ── Tensión previa: el segundo de silencio de la canción (td-1 → td)
  const tension = clamp01(interpolate(t, [td - 1.0, td - 0.05], [0, 1]));
  const heartbeat = tension * (0.5 + 0.5 * Math.sin(t * Math.PI * 2 * (3 + tension * 5)));

  // ── Impacto del drop
  const flash = dt < 0 ? 0 : calm
    ? interpolate(dt, [0, 0.05, 0.22], [0, 0.28, 0], { extrapolateRight: "clamp" })
    : interpolate(dt, [0, 0.03, 0.17], [0, 0.85, 0], { extrapolateRight: "clamp" });
  const shakeDur = calm ? 0.22 : 0.5;
  const shakeAmp = dt >= 0 && dt < shakeDur ? (calm ? 4 : 18) * Math.pow(1 - dt / shakeDur, 2) : 0;
  const shakeX = shakeAmp * Math.sin(frame * 2.9);
  const shakeY = shakeAmp * Math.cos(frame * 3.7);
  const juniorGlow = dt < 0 ? 0.25 + heartbeat * 0.55 : 0.2;

  // ── Pulso del borde del PRO: carga en el silencio previo + impacto del drop + latido por golpe
  const charge = calm
    ? tension * 0.08
    : tension * (0.12 + 0.2 * (0.5 + 0.5 * Math.sin(t * Math.PI * 2 * (4 + tension * 8))));
  const pulse = Math.min(
    1.25,
    charge + events.reduce((s, e) => s + e.amp * pulseEnv(t - e.t, e.tau, e.atk), 0),
  );
  const proEdge = mixHex(GREEN, "#e6fff0", Math.min(1, pulse * (calm ? 0.6 : 0.85)));
  const proSpread = 8 + pulse * (calm ? 6 : 9);
  const proShadow = `0 0 ${16 + pulse * (calm ? 44 : 80)}px ${pulse * (calm ? 8 : 16)}px rgba(51,255,122,${0.3 + Math.min(1, pulse) * (calm ? 0.3 : 0.55)})`;
  const proScale = 1 + pulse * (calm ? 0.026 : 0.032);
  // Ecos: contornos que salen del borde del panel y se desvanecen
  const echoes = events.flatMap((e) =>
    Array.from({ length: e.rings }, (_, r) => {
      const p = clamp01((t - e.t - r * 0.075) / e.ringDur);
      return { p, amp: e.amp, alpha: e.ringAlpha, on: t >= e.t + r * 0.075 && p < 1, key: `${e.t}-${r}` };
    }),
  ).filter((x) => x.on);

  // ── Entrada de rótulos
  const labelIn = (delay: number) =>
    spring({ frame: frame - delay, fps, config: { damping: 11, stiffness: 160, mass: 0.6 } });
  const juniorLabelScale = interpolate(labelIn(2), [0, 1], [0.4, 1]) * (dt >= 0 ? 1 : 1 + heartbeat * 0.03);
  const seniorLabelScale =
    interpolate(labelIn(9), [0, 1], [0.4, 1]) *
    (1 + pulse * (calm ? 0.07 : 0.1));

  // ── Cámara digital sobre el Senior: zoom al lanzador, y se abre de golpe en el drop
  // k = 0 → escritorio completo, k = 1 → zoom sobre el botón Lanzar.
  // Empuje suave mientras el cursor llega, se mantiene durante el clic, salida rápida en el drop.
  const sz = cfg.senior_zoom;
  const push = interpolate(t, [sz.pushStart, sz.pushEnd], [0, 1], {
    easing: Easing.bezier(0.45, 0, 0.15, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const openK = dt < 0 ? 0 : spring({ frame: frame - dropFrame, fps, config: { damping: 22, stiffness: 260, mass: 0.6, overshootClamping: true } });
  const k = push * (1 - openK);
  const Z = 1 + (sz.pre - 1) * k;
  const fx = (960 + (sz.focusX - 960) * k) * 0.5;
  const fy = (540 + (sz.focusY - 540) * k) * 0.5;
  const tx = Math.min(0, Math.max(PANEL_W - PANEL_W * Z, PANEL_W / 2 - fx * Z));
  const ty = Math.min(0, Math.max(PANEL_H - PANEL_H * Z, PANEL_H / 2 - fy * Z));

  // ── Ondita del clic (versión suave): nace en el botón Lanzar cuando se pulsa
  const BTN_X = cfg.launchButton.x * 0.5;
  const BTN_Y = cfg.launchButton.y * 0.5;
  // La ondita dura desde el clic hasta el corte del drop (después la escena cambia).
  const clickP = t >= td ? 1 : clamp01((t - cfg.clickTime) / (td - cfg.clickTime));
  const clickR = 8 + 52 * easeOut(clickP);

  // ── Cronómetros reales
  const juniorClock = t * cfg.junior.speed;
  const { src: seniorSrc } = seniorSourceTime(t);
  const seniorClock = Math.max(0, Math.min(seniorSrc, cfg.senior.doneInSource) - cfg.senior.clickInSource);

  // ── Fondo y brillos
  const greenBg = (dt < 0 ? 0.08 : 0.14) + pulse * 0.2;
  const redBg = dt < 0 ? 0.16 + heartbeat * 0.14 : 0.12;

  // ── Entrada del encabezado
  const headIn = easeOut(clamp01(frame / 14));

  const musicTrim = Math.round((cfg.music.dropInSong - cfg.dropTime) * fps);

  return (
    <AbsoluteFill style={{ background: "#050507", overflow: "hidden" }}>
      {/* Fondo con brillos de color por zona */}
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(900px 700px at 50% 25%, rgba(255,42,61,${redBg}), transparent 70%)`,
            `radial-gradient(1000px 800px at 50% 72%, rgba(51,255,122,${greenBg}), transparent 70%)`,
          ].join(", "),
        }}
      />

      {/* Todo el contenido tiembla con el drop */}
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>
        {/* Ondas de choque del drop (detrás de los paneles) */}
        {echoes.map((r) => {
          const d = 14 + (30 + 62 * r.amp) * easeOut(r.p); // px que se separa del borde
          return (
            <div
              key={r.key}
              style={{
                position: "absolute",
                left: PANEL_X - d,
                top: SENIOR_Y - d,
                width: PANEL_W + 2 * d,
                height: PANEL_H + 2 * d,
                borderRadius: 30 + d,
                border: `${Math.max(1.5, 7 * (1 - r.p))}px solid ${GREEN}`,
                opacity: Math.pow(1 - r.p, 1.4) * (0.35 + 0.6 * r.amp) * r.alpha,
              }}
            />
          );
        })}

        {/* Encabezado: marca + web */}
        <div
          style={{
            position: "absolute",
            top: 138,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 22,
            opacity: headIn,
            transform: `translateY(${(1 - headIn) * -24}px)`,
          }}
        >
          <Img
            src={staticFile("brand/logo.png")}
            style={{ width: 96, height: 96, borderRadius: 22 }}
          />
          <div
            style={{
              fontFamily: INTER,
              fontWeight: 800,
              fontSize: 40,
              color: "#fff",
              letterSpacing: 0.4,
            }}
          >
            workspacelauncher.meltvest.com
          </div>
        </div>

        <Label text={top} color={RED} scale={juniorLabelScale} y={320} />
        <Label text={bottom} color={GREEN} scale={seniorLabelScale} y={1040} />

        {/* ───── JUNIOR (arriba) ───── */}
        <Panel y={JUNIOR_Y} edge={RED} spread={8} shadow={`0 0 ${14 + juniorGlow * 26}px ${RED}55`}>
          <Video
            src={staticFile("clips/junior.mp4")}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", top: 16, left: 16 }}>
            <Chip>
              <ClockIcon color={RED} />
              {juniorClock.toFixed(1)} s
            </Chip>
          </div>
        </Panel>

        {/* ───── SENIOR (abajo) ───── */}
        <Panel y={SENIOR_Y} edge={proEdge} spread={proSpread} shadow={proShadow} scale={proScale}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: PANEL_W,
              height: PANEL_H,
              transformOrigin: "0 0",
              transform: `translate(${tx}px, ${ty}px) scale(${Z})`,
            }}
          >
            <Video
              src={staticFile("clips/senior.mp4")}
              muted
              style={{ width: PANEL_W, height: PANEL_H, objectFit: "cover" }}
            />
            {clickP > 0 && clickP < 1 && (
              <>
                {/* Respuesta al clic: ondita sobre el botón Lanzar */}
                <div
                  style={{
                    position: "absolute",
                    left: BTN_X - clickR,
                    top: BTN_Y - clickR,
                    width: clickR * 2,
                    height: clickR * 2,
                    borderRadius: "50%",
                    border: `${Math.max(1, 3 * (1 - clickP))}px solid rgba(190,255,215,${(1 - clickP) * 0.9})`,
                    background: `radial-gradient(circle, rgba(51,255,122,${(1 - clickP) * 0.22}) 0%, transparent 70%)`,
                  }}
                />
              </>
            )}
          </div>
          <div style={{ position: "absolute", top: 16, left: 16 }}>
            <Chip>
              <ClockIcon color={GREEN} />
              {seniorClock.toFixed(1)} s
            </Chip>
          </div>
        </Panel>

      </AbsoluteFill>

      {/* Viñeta de tensión en el segundo de silencio */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.85) 100%)",
          opacity: dt < 0 ? tension * (calm ? 0.3 : 0.55) : 0,
        }}
      />
      {/* Flash del drop */}
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />

      {/* Audio: la canción entra con el drop en dropTime; clic dentro del silencio previo */}
      <Audio
        src={staticFile(cfg.music.file)}
        trimBefore={musicTrim}
        volume={(f) => {
          const tt = f / fps;
          const fin = clamp01(tt / cfg.music.fadeIn);
          const fout = clamp01((durationInFrames / fps - tt) / cfg.music.fadeOut);
          return cfg.music.volume * fin * fout;
        }}
      />
      <Sequence from={Math.round(cfg.clickTime * fps)}>
        <Audio src={staticFile("audio/click.wav")} volume={0.9} />
      </Sequence>
    </AbsoluteFill>
  );
};

