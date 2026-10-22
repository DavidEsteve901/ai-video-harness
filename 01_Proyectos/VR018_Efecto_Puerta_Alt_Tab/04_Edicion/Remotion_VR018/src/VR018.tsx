import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { at, atEnd, C, clamp01, E, ease, ESC, FONT, lerp, rnd, spr } from "./theme";
import { makeLayout } from "./layout";
import { Background, shake } from "./components/Bits";
import { Captions } from "./components/Captions";
import { sfx, SWITCH } from "./sonido";

// VR018 — «Efecto puerta»: cruzar una puerta hace olvidar a qué ibas → en el ordenador, cada ventana que cambias
// es una puerta y pierdes el hilo → una habitación por tarea, con todo abierto y en su sitio → vuelve la cara del gancho.
// Vertical 1080×1920, 60 fps, ~23 s.

const useFonts = () => {
  const [h] = useState(() => delayRender("fuentes"));
  useEffect(() => {
    Promise.all([
      loadFont({ family: "InterX", url: staticFile("fonts/Inter-ExtraBold.woff2"), weight: "800" }),
      loadFont({ family: "InterX", url: staticFile("fonts/Inter-Bold.woff2"), weight: "700" }),
    ]).then(() => continueRender(h));
  }, [h]);
};

const W = 1080, H = 1920;
const fill: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };

/** Puerta: marco + hoja que gira sobre la bisagra izquierda (open 0..1) y luz detrás */
const Door: React.FC<{ x: number; y: number; w: number; h: number; open: number; color?: string; glow?: number; children?: React.ReactNode; light?: string }> = ({
  x, y, w, h, open, color = C.coral, glow = 0, children, light = "#FFE7B8",
}) => {
  const b = Math.max(3, w * 0.045);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, perspective: w * 3.2 }}>
      {/* hueco con luz */}
      <div style={{ position: "absolute", inset: 0, borderRadius: w * 0.04, background: `radial-gradient(circle at 50% 45%, ${light}, #FFB547 45%, #2A1A08 100%)`, opacity: clamp01(open * 3) }} />
      {/* hoja */}
      <div
        style={{
          position: "absolute", inset: b * 0.9, transformOrigin: "left center", transform: `rotateY(${-open * 78}deg)`,
          background: "linear-gradient(180deg,#1A2030,#121724)", borderRadius: w * 0.03, overflow: "hidden",
          boxShadow: open > 0.02 ? `${12 * open}px 0 ${30 * open}px rgba(0,0,0,0.6)` : undefined,
        }}
      >
        {children ?? (
          <>
            <div style={{ position: "absolute", left: "14%", right: "14%", top: "8%", height: "36%", border: `${b * 0.5}px solid rgba(255,255,255,0.07)`, borderRadius: w * 0.02 }} />
            <div style={{ position: "absolute", left: "14%", right: "14%", top: "52%", height: "40%", border: `${b * 0.5}px solid rgba(255,255,255,0.07)`, borderRadius: w * 0.02 }} />
            <div style={{ position: "absolute", right: "10%", top: "50%", width: w * 0.07, height: w * 0.07, borderRadius: 99, background: color }} />
          </>
        )}
      </div>
      {/* marco */}
      <div style={{ position: "absolute", inset: 0, border: `${b}px solid ${color}`, borderRadius: w * 0.04, boxShadow: glow ? `0 0 ${w * 0.25 * glow}px ${color}AA, inset 0 0 ${w * 0.1 * glow}px ${color}55` : undefined }} />
    </div>
  );
};

/** Miniatura de ventana (abstracta) para el selector de Alt+Tab */
const Thumb: React.FC<{ kind: number; label?: string }> = ({ kind, label }) => {
  const bar = [C.cyan, C.amber, C.violet, C.green][kind];
  return (
    <div style={{ position: "absolute", inset: 0, background: C.win, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ height: 30, background: "#1B2232", display: "flex", alignItems: "center", gap: 7, paddingLeft: 12 }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ width: 10, height: 10, borderRadius: 9, background: i === 0 ? bar : "rgba(255,255,255,0.2)" }} />)}
        {label && <div style={{ marginLeft: 8, fontFamily: FONT, fontWeight: 700, fontSize: 19, color: C.ink, opacity: 0.85, whiteSpace: "nowrap" }}>{label}</div>}
      </div>
      {kind === 0 && [0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ margin: "12px 14px 0", height: 10, width: `${40 + rnd("c" + i) * 50}%`, background: i % 2 ? C.cyan + "88" : "rgba(255,255,255,0.22)", borderRadius: 4 }} />)}
      {kind === 1 && (
        <>
          <div style={{ margin: "14px", height: 70, borderRadius: 8, background: `linear-gradient(135deg, ${C.amber}88, ${C.coral}66)` }} />
          {[0, 1, 2].map((i) => <div key={i} style={{ margin: "10px 14px 0", height: 9, width: `${50 + i * 12}%`, background: "rgba(255,255,255,0.2)", borderRadius: 4 }} />)}
        </>
      )}
      {kind === 2 && [0, 1, 2].map((i) => <div key={i} style={{ margin: `14px ${i % 2 ? 14 : 60}px 0 ${i % 2 ? 60 : 14}px`, height: 26, borderRadius: 12, background: i % 2 ? C.violet + "88" : "rgba(255,255,255,0.16)" }} />)}
      {kind === 3 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, margin: 14 }}>
          {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ height: 22, borderRadius: 4, background: i % 4 === 0 ? C.green + "77" : "rgba(255,255,255,0.12)" }} />)}
        </div>
      )}
    </div>
  );
};

// ── tiempos clave (todos anclados a palabras de la voz) ──
const T = () => ({
  door: at("t01", "puerta"),
  olv: at("t01", "olvida"),
  s2: ESC.t02.a,
  ef: at("t02", "efecto"),
  tu: at("t02", "tu"),
  cie: at("t02", "cierra"),
  arc: at("t02", "archiva"),
  s3: ESC.t03.a,
  ord: at("t03", "ordenador"),
  pue: at("t03", "puerta"),
  s4: ESC.t04.a,
  cor: at("t04", "correo"),
  pes: at("t04", "pestanas"),
  car: at("t04", "carpetas"),
  pier: at("t04", "pierdes"),
  hilo: at("t04", "hilo"),
  s5: ESC.t05.a,
  tarea: at("t05", "tarea"),
  hab: at("t05", "habitacion"),
  s6: ESC.t06.a,
  todo: at("t06", "todo"),
  sitio: at("t06", "sitio"),
  s7: ESC.t07.a,
  olv2: at("t07", "olvida"),
  ven2: at("t07", "venias"),
  end: atEnd("t07", "venias"),
});

// 4 · el hilo cruza tres puertas
const CORR = [
  { x: 200, label: "Correo", icon: "✉" },
  { x: 540, label: "Pestañas", icon: "▤" },
  { x: 880, label: "Carpetas", icon: "▰" },
];
const CORR_Y = 600, CORR_W = 230, CORR_H = 340;

// 5 · plano de la casa: una habitación por tarea
const ROOMS = [
  { x: 80, y: 330, label: "Informe", win: [C.cyan, C.amber, C.violet] },
  { x: 560, y: 330, label: "Estudio", win: [C.green, C.cyan] },
  { x: 80, y: 730, label: "Diseño", win: [C.pink, C.amber, C.cyan] },
  { x: 560, y: 730, label: "Ocio", win: [C.violet, C.green] },
];
const ROOM_W = 440, ROOM_H = 360;

// 6 · dentro de la habitación «Informe»: cada cosa vuela a su zona
const MON = [
  { x: 40, y: 290, w: 1000, h: 563 },
  { x: 230, y: 920, w: 620, h: 349 },
];
const ZONES: { m: 0 | 1; f: [number, number, number, number]; kind: number; label: string }[] = [
  { m: 0, f: [0, 0, 0.55, 1], kind: 1, label: "Documento" },
  { m: 0, f: [0.55, 0, 0.45, 0.5], kind: 0, label: "Web" },
  { m: 0, f: [0.55, 0.5, 0.45, 0.5], kind: 2, label: "Correo" },
  { m: 1, f: [0, 0, 0.6, 1], kind: 3, label: "Carpeta" },
  { m: 1, f: [0.6, 0, 0.4, 1], kind: 0, label: "Notas" },
];

export const VR018: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const L = makeLayout(W, H);
  const k = T();
  const sh = shake(t, [k.door, k.arc + 0.05, k.pier + 0.05, k.s6], 9);

  // ─────────── 1+2 · puerta y cara congelada ───────────
  const s12 = t < k.s3;
  const push = 1 + 0.06 * E(t, 0, 3.1, ease.inOut) + 0.08 * E(t, k.s2, 3.6, ease.inOut);
  const dark = E(t, k.tu - 0.2, 0.8); // la cara se oscurece mientras se explica
  const qmark = E(t, k.olv - 0.05, 0.35, ease.back);

  // ─────────── 3 · cada ventana es una puerta ───────────
  const swTimes = SWITCH();
  const sel = Math.min(3, swTimes.filter((x) => t >= x).length);
  const swOn = E(t, k.ord - 0.1, 0.35, ease.backSoft);
  const swing = E(t, k.pue - 0.05, 0.5, ease.out);

  // ─────────── 6-7 · habitación y vuelta a la cara ───────────
  const green = E(t, k.sitio - 0.05, 0.6);

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <Background t={t} W={W} H={H} tintAmt={t > k.s5 ? 0.18 * green : 0} tint={C.green + "55"} />

      {/* 1 · el chico cruza la puerta (Pexels, cottonbro studio) → 2 · fotograma congelado */}
      {s12 && (
        <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px) scale(${push})`, transformOrigin: "55% 32%" }}>
          <Sequence durationInFrames={Math.round((k.s2 + 0.05) * fps)} layout="none">
            <OffthreadVideo src={staticFile("video/puerta.mp4")} muted style={fill} />
          </Sequence>
          {t >= k.s2 - 0.01 && (
            <Img
              src={staticFile("img/cara.png")}
              style={{ ...fill, filter: `brightness(${1 - 0.55 * dark}) saturate(${1 - 0.6 * dark}) blur(${2.5 * dark}px)` }}
            />
          )}
          {/* destello del congelado */}
          {t > k.s2 - 0.02 && t < k.s2 + 0.2 && <AbsoluteFill style={{ background: "#fff", opacity: 0.55 * (1 - (t - k.s2 + 0.02) / 0.22) }} />}
        </AbsoluteFill>
      )}
      {/* signo de interrogación junto a la cabeza */}
      {t < k.s2 + 0.5 && qmark > 0 && (
        <div
          style={{
            position: "absolute", left: 790, top: 250, fontFamily: FONT, fontWeight: 800, fontSize: 260, color: C.coral, lineHeight: 1,
            transform: `scale(${qmark}) rotate(${12 - 8 * qmark + Math.sin(t * 9) * 3}deg)`, opacity: 1 - E(t, k.s2 + 0.15, 0.3),
            textShadow: `0 0 60px ${C.coral}AA, 0 10px 30px rgba(0,0,0,0.6)`,
          }}
        >
          ?
        </div>
      )}

      {/* 2 · EFECTO PUERTA + la escena se archiva */}
      {t >= k.s2 && t < k.s3 && (() => {
        const st = spr(t, k.ef - 0.04, 2.4, 9);
        const cite = E(t, k.ef + 0.35, 0.4);
        const card = E(t, k.tu - 0.1, 0.45, ease.backSoft);
        const clap = E(t, k.cie - 0.08, 0.14, ease.in); // la claqueta se cierra en «cierra»
        const drop = E(t, k.arc - 0.12, 0.42, ease.in);
        const drawer = E(t, k.cie + 0.15, 0.35, ease.out) * (1 - 0.0 * drop);
        const shut = E(t, k.arc + 0.28, 0.2, ease.out);
        const cy = lerp(830, 1120, drop);
        const cs = lerp(1, 0.42, drop);
        return (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", flexDirection: "column", alignItems: "center", opacity: clamp01(st * 3) }}>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 26, padding: "22px 40px", border: `8px solid ${C.amber}`, borderRadius: 26,
                  transform: `scale(${lerp(1.7, 1, clamp01(st))}) rotate(-3deg)`, background: "rgba(7,9,15,0.55)", boxShadow: `0 0 60px ${C.amber}66`,
                }}
              >
                <div style={{ position: "relative", width: 70, height: 104 }}>
                  <Door x={0} y={0} w={70} h={104} open={0.35 + 0.1 * Math.sin(t * 3)} color={C.amber} />
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: C.amber, letterSpacing: "-0.02em", lineHeight: 1 }}>EFECTO PUERTA</div>
              </div>
              <div style={{ marginTop: 26, fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.ink, opacity: 0.75 * cite, letterSpacing: "0.01em" }}>
                Radvansky y cols. · Universidad de Notre Dame, 2011
              </div>
            </div>
            {/* cajón del archivo */}
            {drawer > 0 && (
              <div style={{ position: "absolute", left: 540 - 300, top: 1090, width: 600, height: 170, opacity: drawer * (1 - E(t, k.s3 - 0.25, 0.2)), transform: `translateY(${(1 - drawer) * 60}px)` }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: lerp(-60, 0, shut), height: 70, background: "#1E2636", borderRadius: "14px 14px 0 0", border: "3px solid rgba(255,255,255,0.12)" }} />
                <div style={{ position: "absolute", inset: 0, top: 40, background: "linear-gradient(180deg,#232C3D,#151B28)", borderRadius: 16, border: "3px solid rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ padding: "8px 26px", border: `3px solid ${C.amber}`, borderRadius: 10, fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.amber, letterSpacing: "0.08em" }}>ARCHIVADO</div>
                </div>
              </div>
            )}
            {/* tarjeta de la escena (claqueta) */}
            {card > 0 && drop < 1 && (
              <div style={{ position: "absolute", left: 540 - 330, top: cy - 200, width: 660, height: 400, transform: `scale(${card * cs}) rotate(${-2 + drop * 6}deg)`, opacity: 1 - E(t, k.arc + 0.2, 0.12) }}>
                {/* palo de la claqueta */}
                <div
                  style={{
                    position: "absolute", left: 0, right: 0, top: -6, height: 74, borderRadius: 12, transformOrigin: "left bottom",
                    transform: `rotate(${-14 * (1 - clap)}deg)`, background: "repeating-linear-gradient(120deg,#F3F1EA 0 46px,#0A0C12 46px 92px)",
                  }}
                />
                <div style={{ position: "absolute", left: 0, right: 0, top: 70, bottom: 0, borderRadius: 18, background: "#0F1320", border: "3px solid rgba(255,255,255,0.16)", padding: "26px 36px" }}>
                  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.dim, letterSpacing: "0.12em" }}>ESCENA 1 · EL PASILLO</div>
                  <div style={{ marginTop: 18, fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.ink, lineHeight: 1.1 }}>
                    Iba a por<span style={{ color: C.amber }}>…</span>
                    <span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0.15, color: C.amber }}> ?</span>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      })()}

      {/* 3 · en el ordenador pasa igual: cada ventana que cambias es una puerta (teclado: Pexels, Azhaan Bashmil) */}
      {t >= k.s3 && t < k.s4 + 0.3 && (
        <AbsoluteFill style={{ opacity: 1 - E(t, k.s4, 0.25) }}>
          <Sequence from={Math.round(k.s3 * fps)} layout="none">
            <OffthreadVideo src={staticFile("video/teclado.mp4")} muted style={{ ...fill, filter: "brightness(0.5) saturate(1.1)", transform: `scale(${1.05 + 0.05 * E(t, k.s3, 3)})` }} />
          </Sequence>
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(7,9,15,0.6) 0%, rgba(7,9,15,0.3) 40%, rgba(7,9,15,0.85) 75%, #07090F 100%)" }} />
          {swOn > 0 && (
            <div style={{ position: "absolute", left: 40, top: 420, width: 1000, height: 560, transform: `scale(${(0.85 + 0.15 * swOn) * (1 + 0.04 * E(t, k.pue, 0.8))})`, opacity: clamp01(swOn * 2) }}>
              {/* monitor */}
              <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "rgba(14,18,28,0.92)", border: "10px solid #1E2433", boxShadow: "0 40px 90px rgba(0,0,0,0.7)" }} />
              <div style={{ position: "absolute", left: 440, top: 560, width: 120, height: 70, background: "#1E2433" }} />
              <div style={{ position: "absolute", left: 360, top: 626, width: 280, height: 18, borderRadius: 9, background: "#1E2433" }} />
              {[0, 1, 2, 3].map((i) => {
                const x = 40 + i * 236, y = 150, w = 196, h = 260;
                const on = i === sel;
                return (
                  <Door key={i} x={x} y={y} w={w} h={h} open={on ? swing : 0} color={on ? (swing > 0 ? C.coral : C.cyan) : "rgba(255,255,255,0.18)"} glow={on ? 0.6 + 0.4 * swing : 0}>
                    <Thumb kind={i} />
                  </Door>
                );
              })}
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* 4 · correo, pestañas, carpetas… y por el camino pierdes el hilo */}
      {t >= k.s4 - 0.05 && t < k.s5 + 0.3 && (() => {
        const head = lerp(-40, 1120, E(t, k.cor - 0.15, k.hilo - k.cor + 0.25, (x) => x)); // punta del hilo
        const brk = E(t, k.pier + 0.05, 0.45, ease.out); // el hilo se rompe
        const bx = 700; // punto de rotura (tras la segunda puerta)
        const out = E(t, k.s5 - 0.05, 0.3);
        const words = [
          { w: "Ibas a:", t0: 99 },
          { w: "responder", t0: k.car + 0.25 },
          { w: "a", t0: k.pes + 0.25 },
          { w: "Marta", t0: k.cor + 0.25 },
        ];
        const lost = E(t, k.hilo - 0.05, 0.3, ease.backSoft);
        return (
          <AbsoluteFill style={{ opacity: (1 - out) * E(t, k.s4 - 0.05, 0.25), transform: `translate(${sh.x}px, ${sh.y}px)` }}>
            {/* lo que ibas a hacer */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", gap: 18, alignItems: "center", padding: "22px 38px", borderRadius: 26, background: "rgba(18,23,36,0.9)", border: `3px solid ${lost > 0 ? C.coral : C.amber}`, boxShadow: `0 0 50px ${lost > 0 ? C.coral : C.amber}55`, fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.ink }}>
                <span style={{ color: C.amber }}>💡</span>
                {words.map((x, i) => {
                  const g = E(t, x.t0, 0.35);
                  return (
                    <span key={i} style={{ opacity: 1 - g, filter: `blur(${g * 10}px)`, transform: `translateY(${-g * 30}px)`, display: "inline-block", color: i === 0 ? C.dim : C.ink }}>
                      {x.w}
                    </span>
                  );
                })}
                {lost > 0 && <span style={{ color: C.coral, transform: `scale(${lost})`, display: "inline-block", marginLeft: -40 }}>¿…?</span>}
              </div>
            </div>
            {/* tres puertas */}
            {CORR.map((d, i) => {
              const ti = [k.cor, k.pes, k.car][i];
              const p = spr(t, ti - 0.12, 2.4, 8);
              if (p <= 0) return null;
              const opn = clamp01(1 - Math.abs(head - d.x) / 220) * (brk > 0 && d.x > bx ? 0 : 1);
              return (
                <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `scale(${clamp01(p)})`, transformOrigin: `${d.x}px ${CORR_Y + CORR_H / 2}px` }}>
                  <div style={{ position: "absolute", left: d.x - 150, width: 300, top: CORR_Y - 92, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.ink }}>
                    <span style={{ color: C.coral, marginRight: 10 }}>{d.icon}</span>
                    {d.label}
                  </div>
                  <Door x={d.x - CORR_W / 2} y={CORR_Y} w={CORR_W} h={CORR_H} open={0.15 + 0.75 * opn} color={C.coral} />
                </div>
              );
            })}
            {/* el hilo */}
            <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
              {(() => {
                const y0 = CORR_Y + CORR_H * 0.55;
                // sag: tras romperse, el extremo del hilo cae
                const pts = (a: number, b: number, sag = 0, a0 = a) =>
                  Array.from({ length: 40 }, (_, i) => {
                    const x = lerp(a, b, i / 39);
                    const f = clamp01((x - a0) / Math.max(1, b - a0));
                    return `${x.toFixed(1)},${(y0 + Math.sin(x / 70 + t * 5) * 14 * (1 - sag * f) + sag * Math.pow(f, 3) * 170).toFixed(1)}`;
                  }).join(" ");
                const end = brk > 0 ? Math.min(head, bx) : head;
                return (
                  <>
                    <polyline points={pts(-40, end, brk, 380)} fill="none" stroke={C.amber} strokeWidth={10} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 14px ${C.amber})` }} />
                    {brk > 0 && <polyline points={pts(end - 90, end, brk, 380)} fill="none" stroke={C.coral} strokeWidth={10} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 14px ${C.coral})` }} />}
                    {brk > 0 && (
                      <polyline points={pts(bx + 30, bx + 30 + 260 * (1 - brk))} fill="none" stroke={C.coral} strokeWidth={8} strokeLinecap="round" opacity={1 - brk} transform={`translate(${brk * 60}, ${brk * 160}) rotate(${brk * 25}, ${bx}, ${y0})`} />
                    )}
                    {brk > 0 && brk < 1 &&
                      Array.from({ length: 14 }).map((_, i) => {
                        const a = rnd("sp" + i) * Math.PI * 2, r = 30 + 140 * brk * rnd("sr" + i);
                        return <circle key={i} cx={bx + Math.cos(a) * r} cy={y0 + Math.sin(a) * r} r={6 * (1 - brk)} fill={C.coral} />;
                      })}
                    {!(brk > 0) && <circle cx={head} cy={y0 + Math.sin(head / 70 + t * 5) * 14} r={14} fill="#FFE7B8" style={{ filter: `drop-shadow(0 0 18px ${C.amber})` }} />}
                  </>
                );
              })()}
            </svg>
          </AbsoluteFill>
        );
      })()}

      {/* 5 · ¿y si cada tarea tuviera su propia habitación? (plano de la casa) */}
      {t >= k.s5 - 0.05 && t < k.s6 + 0.6 && (() => {
        const into = E(t, k.s6 - 0.1, 0.55, ease.in); // la cámara entra en «Informe»
        const r0 = ROOMS[0];
        const ox = r0.x + ROOM_W / 2, oy = r0.y + ROOM_H - 20;
        return (
          <AbsoluteFill style={{ transform: `scale(${1 + 4 * into})`, transformOrigin: `${ox}px ${oy}px`, opacity: (1 - E(t, k.s6 + 0.25, 0.25)) * E(t, k.s5 - 0.05, 0.3) }}>
            {ROOMS.map((r, i) => {
              const p = spr(t, k.s5 + 0.12 + i * 0.18, 2.2, 8);
              if (p <= 0) return null;
              const lit = E(t, k.hab - 0.1 + (i === 0 ? 0 : 0.08 * i), 0.5);
              const sel0 = i === 0 ? E(t, k.hab + 0.4, 0.4) : 0;
              const col = sel0 > 0 ? C.green : C.amber;
              return (
                <div key={i} style={{ position: "absolute", left: r.x, top: r.y, width: ROOM_W, height: ROOM_H, transform: `scale(${clamp01(p)})`, opacity: clamp01(p * 2) }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: 22, border: `7px solid ${lit > 0 ? col : "rgba(255,255,255,0.25)"}`, background: `rgba(${sel0 > 0 ? "0,230,118" : "255,181,71"},${0.04 + 0.1 * lit})`, boxShadow: lit > 0 ? `0 0 ${50 * lit}px ${col}66` : undefined }} />
                  {/* hueco de la puerta en la pared inferior */}
                  <div style={{ position: "absolute", left: ROOM_W / 2 - 55, bottom: -7, width: 110, height: 7, background: C.bg }} />
                  <div style={{ position: "absolute", left: ROOM_W / 2 - 55, bottom: 0, width: 110, height: 110, borderLeft: `4px solid ${lit > 0 ? col : "rgba(255,255,255,0.25)"}`, borderTopLeftRadius: 0, borderRight: "none", transformOrigin: "left bottom", transform: `rotate(${-20 - 50 * (i === 0 ? into : 0)}deg)` }} />
                  <div style={{ position: "absolute", left: 30, top: 24, fontFamily: FONT, fontWeight: 800, fontSize: 50, color: lit > 0 ? col : C.ink }}>{r.label}</div>
                  {r.win.map((c, j) => (
                    <div key={j} style={{ position: "absolute", left: 30 + j * 128, top: 110, width: 112, height: 82, borderRadius: 10, background: C.win, border: `2px solid rgba(255,255,255,0.12)`, overflow: "hidden", opacity: E(t, k.tarea + 0.1 * i + 0.06 * j, 0.3) }}>
                      <div style={{ height: 16, background: c }} />
                    </div>
                  ))}
                </div>
              );
            })}
          </AbsoluteFill>
        );
      })()}

      {/* 6 · entras, y ya está todo abierto y en su sitio */}
      {t >= k.s6 + 0.15 && t < k.s7 + 0.3 && (() => {
        const inn = E(t, k.s6 + 0.15, 0.4);
        const out = E(t, k.s7 - 0.1, 0.3);
        return (
          <AbsoluteFill style={{ opacity: inn * (1 - out), transform: `scale(${lerp(1.08, 1, inn) * (1 + 0.04 * E(t, k.s6, 3, ease.inOut))})` }}>
            {MON.map((m, i) => (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: m.x, top: m.y, width: m.w, height: m.h, borderRadius: 26, background: "#0C1018", border: `9px solid ${green > 0 ? C.green : "#1E2433"}`, boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 ${80 * green}px ${C.green}66` }} />
                {i === 1 && <div style={{ position: "absolute", left: m.x + m.w / 2 - 60, top: m.y + m.h, width: 120, height: 40, background: "#1E2433" }} />}
              </React.Fragment>
            ))}
            {ZONES.map((z, i) => {
              const m = MON[z.m], pad = 9 + 8;
              const sx = m.x + pad, sy = m.y + pad, sw = m.w - 2 * pad, shh = m.h - 2 * pad;
              const tgt = { x: sx + z.f[0] * sw + 6, y: sy + z.f[1] * shh + 6, w: z.f[2] * sw - 12, h: z.f[3] * shh - 12 };
              const p = spr(t, k.s6 + 0.4 + i * 0.12, 2.0, 7.5);
              if (p <= 0) return null;
              const from = { x: 540 - 90, y: 1500, w: 180, h: 120 };
              const q = clamp01(p);
              const r = { x: lerp(from.x, tgt.x, p), y: lerp(from.y, tgt.y, p), w: lerp(from.w, tgt.w, q), h: lerp(from.h, tgt.h, q) };
              return (
                <div key={i} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, boxShadow: "0 12px 30px rgba(0,0,0,0.5)", borderRadius: 14 }}>
                  <Thumb kind={z.kind} label={z.label} />
                </div>
              );
            })}
            {green > 0 && (
              <div style={{ position: "absolute", left: 540 - 60, top: 1300 - 60 * green, width: 120, height: 120, borderRadius: 99, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${spr(t, k.sitio - 0.05, 2, 7)})`, boxShadow: `0 0 60px ${C.green}99` }}>
                <svg width={64} height={64} viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="#06130B" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            )}
          </AbsoluteFill>
        );
      })()}

      {/* 7 · y ya no se te olvida a qué venías: vuelve la cara del gancho, esta vez con la escena resuelta */}
      {t >= k.s7 - 0.15 && (() => {
        const inn = E(t, k.s7 - 0.15, 0.35);
        const card = E(t, k.olv2 - 0.2, 0.45, ease.backSoft);
        const ok = E(t, k.ven2 - 0.05, 0.35, ease.back);
        return (
          <AbsoluteFill style={{ opacity: inn }}>
            <Img src={staticFile("img/cara.png")} style={{ ...fill, filter: "brightness(0.85) saturate(1.05)", transform: `scale(${1.14 + 0.06 * E(t, k.s7, 3, ease.inOut)})`, transformOrigin: "55% 32%" }} />
            <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, ${C.green}22, transparent 60%)`, opacity: ok }} />
            {card > 0 && (
              <div style={{ position: "absolute", left: 540 - 330, top: 960 - 200, width: 660, height: 400, transform: `scale(${card}) rotate(-2deg)` }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: -6, height: 74, borderRadius: 12, background: `repeating-linear-gradient(120deg,#F3F1EA 0 46px,#0A0C12 46px 92px)` }} />
                <div style={{ position: "absolute", left: 0, right: 0, top: 70, bottom: 0, borderRadius: 18, background: "#0F1320", border: `3px solid ${ok > 0 ? C.green : "rgba(255,255,255,0.16)"}`, padding: "26px 36px", boxShadow: ok > 0 ? `0 0 ${60 * ok}px ${C.green}77` : undefined }}>
                  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.dim, letterSpacing: "0.12em" }}>ESCENA 2 · EL INFORME</div>
                  <div style={{ marginTop: 18, fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.ink, lineHeight: 1.1 }}>
                    Iba a por…
                    <br />
                    <span style={{ color: C.green }}>el informe</span>
                    <span style={{ display: "inline-block", marginLeft: 14, color: C.green, transform: `scale(${ok})` }}>✓</span>
                  </div>
                </div>
              </div>
            )}
          </AbsoluteFill>
        );
      })()}
      {/* oscurecido inferior para que el texto se lea sobre el vídeo */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 58%, rgba(5,6,10,0.75) 82%, rgba(5,6,10,0.9) 100%)", pointerEvents: "none" }} />
      <Captions t={t} L={L} scale={t > k.s7 ? 1 + 0.05 * E(t, k.end, 0.6) : 1} />

      <Audio src={staticFile("audio/voz.wav")} />
      <Audio src={staticFile("audio/musica.wav")} volume={0.6} />
      {sfx().map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s.t * fps))} durationInFrames={Math.round((s.dur ?? 2) * fps)} layout="none">
          <Audio src={staticFile(`audio/sfx/${s.f}`)} volume={s.v * 0.8} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

