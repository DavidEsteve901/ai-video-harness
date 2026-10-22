import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { atEnd, E, ease, ESC, Lang, setLang } from "./theme";
import { makeLayout } from "./layout";
import { Background } from "./components/Bits";
import { Captions } from "./components/Captions";
import { S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12 } from "./scenes/Mente";
import { sfx } from "./sonido";

const SCENES: [string, React.FC<{ t: number; L: ReturnType<typeof makeLayout> }>][] = [
  ["t01", S01], ["t02", S02], ["t03", S03], ["t04", S04], ["t05", S05], ["t06", S06],
  ["t07", S07], ["t08", S08], ["t09", S09], ["t10", S10], ["t11", S11], ["t12", S12],
];

const useFonts = () => {
  const [h] = useState(() => delayRender("fuentes"));
  useEffect(() => {
    Promise.all([
      loadFont({ family: "InterX", url: staticFile("fonts/Inter-ExtraBold.woff2"), weight: "800" }),
      loadFont({ family: "InterX", url: staticFile("fonts/Inter-Bold.woff2"), weight: "700" }),
    ]).then(() => continueRender(h));
  }, [h]);
};

export const VR013: React.FC<{ lang?: Lang }> = ({ lang = "es" }) => {
  setLang(lang);
  useFonts();
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const L = makeLayout(width, height);
  const tintAmt = t > ESC.t05.a && t < ESC.t06.a ? 0.18 : t > ESC.t11.a ? 0.12 : 0;
  return (
    <AbsoluteFill style={{ background: "#07090F", overflow: "hidden" }}>
      <Background t={t} W={width} H={height} tintAmt={tintAmt} tint={t > ESC.t11.a ? "#00E67655" : undefined} />
      {SCENES.map(([id, S]) => (t >= ESC[id].a && t < ESC[id].b ? <S key={id} t={t} L={L} /> : null))}
      {/* remate: la última frase sube al centro y crece */}
      {(() => {
        const k = E(t, atEnd("t12", "importa") + 0.25, 1.0, ease.inOut);
        return <Captions t={t} L={L} yShift={(L.c.y + (L.vertical ? 60 : 40) - L.cap.y) * k} scale={1 + (L.vertical ? 0 : 0.32) * k} />;
      })()}
      <Audio src={staticFile(lang === "en" ? "audio/voz_en.wav" : "audio/voz.wav")} />
      <Audio src={staticFile(lang === "en" ? "audio/musica_en.wav" : "audio/musica.wav")} volume={0.6} />
      {sfx().map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s.t * fps))} durationInFrames={Math.round((s.dur ?? 3) * fps)} layout="none">
          <Audio src={staticFile(`audio/sfx/${s.f}`)} volume={s.v * 0.8} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
