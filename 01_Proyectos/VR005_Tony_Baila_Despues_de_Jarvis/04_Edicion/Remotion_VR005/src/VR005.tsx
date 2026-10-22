import React, { useEffect, useState } from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import cfg from "../edit.config.json";

// Estructura: demo rápida (hasta que vuelve el ritmo de la música) → corte a Tony bailando
const S1 = cfg.demo.seg1;
const S2 = cfg.demo.seg2;
const S1_LEN = S1.srcEnd - S1.srcStart; // 0,7 s a velocidad normal
const CUT = cfg.demo.duration; // 2,0 s: lo primero que se ve, mudo y cortísimo
const S2_LEN = CUT - S1_LEN; // lo que queda para las ventanas
const S2_SPEED = (S2.srcEnd - S2.srcStart) / S2_LEN; // ≈ ×2,1
const AREA_TOP_OVERLAY = 60; // versión B: el vídeo se centra en el área 60…1860
const AREA_H_OVERLAY = cfg.height - 2 * AREA_TOP_OVERLAY;
const BAND_H = 420; // altura de la banda blanca (versión A) / zona de texto (versión B)
const DEMO_H = 608;
const BAILE_H = 1080; // el clip trae barras negras: contenido 360×360 desde x=140

const decay = (t: number, from: number, tau: number) => (t < from ? 0 : Math.exp(-(t - from) / tau));

const BEAT = 0.498; // la música de Tony: ~120 BPM; el primer golpe cae justo en el corte (6,9 s del clip)

// Texto simple en la banda blanca; lo único animado es la pulsación: late con cada golpe de la música
// fijo: texto quieto, sin pulsación
const PulseBand: React.FC<{ text: string; overlay?: boolean; fijo?: boolean }> = ({ text, overlay, fijo }) => {
  const f = useCurrentFrame();
  const { fps, width: W } = useVideoConfig();
  const phase = ((f / fps) % BEAT) / BEAT;
  const pulse = fijo ? 1 : 1 + 0.06 * Math.exp(-phase * 7);
  if (overlay) return <div style={{ ...overlayBox(AREA_TOP_OVERLAY + (AREA_H_OVERLAY - BAILE_H) / 2, text), transform: `scale(${pulse})`, transformOrigin: "50% 100%" }}>{text}</div>;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: W,
        height: BAND_H,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 56px",
        textAlign: "center",
        fontFamily: "Inter, 'Segoe UI', Arial, sans-serif",
        fontWeight: 800,
        fontSize: 82,
        lineHeight: 1.12,
        color: "#000",
      }}
    >
      <div style={{ transform: `scale(${pulse})` }}>{text}</div>
    </div>
  );
};

// Versión B: texto directamente sobre el vídeo (sin banda), estilo TikTok: mayúsculas blancas con contorno negro
// El texto queda pegado al borde superior de la imagen (bottom = hueco entre el texto y el vídeo)
const overlayFont = (text: string) => (text.length > 50 ? 84 : text.length > 34 ? 96 : 124);
const overlayBox = (videoTop: number, text = ""): React.CSSProperties => ({
  position: "absolute",
  left: 0,
  top: 0,
  width: 1080,
  height: videoTop - 30,
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  padding: "0 50px",
  textAlign: "center",
  textTransform: "uppercase",
  fontFamily: "Anton, Impact, 'Arial Narrow', sans-serif",
  fontSize: overlayFont(text),
  lineHeight: 1.08,
  color: "#fff",
  WebkitTextStroke: "14px #000",
  paintOrder: "stroke fill",
  textShadow: "0 8px 0 #000, 0 10px 30px rgba(0,0,0,0.6)",
});
const bgBlur: React.CSSProperties = { position: "absolute", inset: 0, filter: "blur(40px) brightness(0.45)" };

// felicidad: versión sin Jarvis (textos «Felicidad» del edit.config.json): mismo montaje, otro mensaje
export const VR005: React.FC<{ overlay?: boolean; felicidad?: boolean; fijo?: boolean; en?: boolean }> = ({ overlay = false, felicidad = false, fijo = false, en = false }) => {
  const textoDemo = en ? cfg.textoDemoFelicidadEN : felicidad ? cfg.textoDemoFelicidad : cfg.textoDemo;
  const textoBaile = en ? cfg.textoBaileFelicidadEN : felicidad ? cfg.textoBaileFelicidad : cfg.textoBaile;
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const t = frame / fps;
  const inDemo = t < CUT;
  // Versión A (banda blanca): el vídeo ocupa el área bajo la banda. Versión B (overlay): el vídeo se centra en toda la pantalla y el texto va encima
  const AREA_TOP = overlay ? AREA_TOP_OVERLAY : BAND_H;
  const AREA_H = overlay ? AREA_H_OVERLAY : cfg.height - BAND_H;

  const [handle] = useState(() => delayRender("fuentes"));
  useEffect(() => {
    loadFont({ family: "Inter", url: staticFile("fonts/Inter-ExtraBold.woff2"), weight: "800" })
      .then(() => (overlay ? loadFont({ family: "Anton", url: staticFile("fonts/Anton-Regular.woff2"), weight: "400" }) : undefined))
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);

  // Un único golpe visual en el corte (cuando vuelve el ritmo): flash y zoom breve
  const flash = t < CUT ? 0 : interpolate(t - CUT, [0, 0.03, 0.2], [0, 0.7, 0], { extrapolateRight: "clamp" });
  const punch = 1 + 0.05 * decay(t, CUT, 0.12);

  const band = (text: string) => overlay ? <div style={overlayBox(AREA_TOP + (AREA_H - DEMO_H) / 2, text)}>{text}</div> : (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: W,
        height: BAND_H,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 56px",
        textAlign: "center",
        fontFamily: "Inter, 'Segoe UI', Arial, sans-serif",
        fontWeight: 800,
        fontSize: 82,
        lineHeight: 1.12,
        color: "#000",
      }}
    >
      {text}
    </div>
  );

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {/* ───── 1 · demo rápida ───── */}
      {inDemo && (
        <AbsoluteFill>
          {/* fondo desenfocado */}
          <Sequence from={0} durationInFrames={Math.round(S1_LEN * fps)} layout="none">
            <OffthreadVideo src={staticFile("media/demo.mp4")} trimBefore={Math.round(S1.srcStart * fps)} muted style={{ ...bgBlur, width: W, height: H, objectFit: "cover", transform: "scale(1.15)" }} />
          </Sequence>
          <Sequence from={Math.round(S1_LEN * fps)} durationInFrames={Math.round(S2_LEN * fps) + 2} layout="none">
            <OffthreadVideo src={staticFile("media/demo.mp4")} trimBefore={Math.round(S2.srcStart * fps)} playbackRate={S2_SPEED} muted style={{ ...bgBlur, width: W, height: H, objectFit: "cover", transform: "scale(1.15)" }} />
          </Sequence>
          {/* demo nítida 16:9 */}
          <div style={{ position: "absolute", left: 0, top: AREA_TOP + (AREA_H - DEMO_H) / 2, width: W, height: DEMO_H, boxShadow: "0 0 70px rgba(0,0,0,0.85)" }}>
            <Sequence from={0} durationInFrames={Math.round(S1_LEN * fps)} layout="none">
              <OffthreadVideo src={staticFile("media/demo.mp4")} trimBefore={Math.round(S1.srcStart * fps)} volume={S1.volume} style={{ width: W, height: DEMO_H, objectFit: "cover" }} />
            </Sequence>
            <Sequence from={Math.round(S1_LEN * fps)} durationInFrames={Math.round(S2_LEN * fps) + 2} layout="none">
              <OffthreadVideo src={staticFile("media/demo.mp4")} trimBefore={Math.round(S2.srcStart * fps)} playbackRate={S2_SPEED} muted style={{ width: W, height: DEMO_H, objectFit: "cover" }} />
            </Sequence>
          </div>
          {textoDemo ? band(textoDemo) : overlay ? null : band("")}
        </AbsoluteFill>
      )}

      {/* ───── 2 · Tony bailando (vuelve el ritmo) ───── */}
      <Sequence from={Math.round(CUT * fps)} layout="none">
        <AbsoluteFill style={{ transform: `scale(${punch})` }}>
          {/* fondo: el mismo clip recortado a su contenido (360×360), ampliado y desenfocado */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <OffthreadVideo
              src={staticFile("media/baile.mp4")}
              trimBefore={Math.round(cfg.baile.srcStart * fps)}
              muted
              style={{ position: "absolute", width: 3413, height: 1920, left: -1167, top: 0, filter: "blur(40px) brightness(0.45)" }}
            />
          </div>
          <div style={{ position: "absolute", left: 0, top: AREA_TOP + (AREA_H - BAILE_H) / 2, width: W, height: BAILE_H, overflow: "hidden", boxShadow: "0 0 70px rgba(0,0,0,0.85)" }}>
            <OffthreadVideo
              src={staticFile("media/baile.mp4")}
              trimBefore={Math.round(cfg.baile.srcStart * fps)}
              muted
              style={{ position: "absolute", width: 1920, height: 1080, left: -420, top: 0 }}
            />
          </div>
          <PulseBand text={textoBaile} overlay={overlay} fijo={fijo} />
        </AbsoluteFill>
      </Sequence>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />

      {/* ───── Música: la del propio clip de Tony; entra de golpe en el corte (la demo es muda) ───── */}
      <Sequence from={Math.round(CUT * fps)} layout="none">
        <Audio src={staticFile("media/baile.mp4")} trimBefore={Math.round(cfg.baile.srcStart * fps)} volume={cfg.baile.volume} />
      </Sequence>
    </AbsoluteFill>
  );
};
