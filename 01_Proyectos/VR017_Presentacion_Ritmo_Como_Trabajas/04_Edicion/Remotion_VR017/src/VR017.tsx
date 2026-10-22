import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { at, compasesDe, LOSER, PROPIA, pulse, setRejilla } from "./ritmo";
import { C, clamp01, makeLayout } from "./theme";
import { Background, Flash, shake } from "./components/Bits";
import { Intro } from "./scenes/Intro";
import { SubidaA, SubidaB } from "./scenes/Subidas";
import { Drop } from "./scenes/Drop";
import { Corte, Final } from "./scenes/Final";
import { sfx } from "./sonido";

const useFonts = () => {
  const [h] = useState(() => delayRender("fuentes"));
  useEffect(() => {
    Promise.all([
      loadFont({ family: "InterX", url: staticFile("fonts/Inter-ExtraBold.woff2"), weight: "800" }),
      loadFont({ family: "InterX", url: staticFile("fonts/Inter-Bold.woff2"), weight: "700" }),
      loadFont({ family: "Jakarta", url: staticFile("fonts/PlusJakartaSans.ttf"), weight: "200 800" }),
    ]).then(() => continueRender(h));
  }, [h]);
};

export type Props = { musica: "propia" | "loser" };

export const VR017: React.FC<Props> = ({ musica }) => {
  const R = musica === "loser" && LOSER ? LOSER : PROPIA;
  setRejilla(R);
  useFonts();
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const L = makeLayout(width, height);
  const T = {
    intro: at("intro", 0, 0), a: at("subidaA", 0, 0), b: at("subidaB", 0, 0), corte: at("corte", 0, 0), drop: at("drop", 0, 0), final: at("final", 0, 0),
  };
  const nDrop = compasesDe("drop");
  const dropHits = Array.from({ length: nDrop }, (_, c) => at("drop", c, 0));
  const rafaga = Array.from({ length: 8 }, (_, i) => at("drop", nDrop - 1, i * 0.5));
  const sh = shake(t, [...dropHits, at("intro", 2, 0), at("intro", 2, 1), at("intro", 2, 2), at("subidaB", 0, 2), at("subidaB", 2, 2)], L.V ? 12 : 14);
  const inDrop = t >= T.drop && t < T.final;
  const bump = inDrop ? 1 + 0.012 * pulse(t, 10) : t >= T.a && t < T.corte ? 1 + 0.006 * pulse(t, 10) : 1;
  const bgBeat = t >= T.a && t < T.final && !(t >= T.corte && t < T.drop) ? pulse(t, 6) : 0;
  const tint = t >= T.corte && t < T.drop ? C.ai : t >= T.final ? C.amber : C.amber;
  const tintAmt = t >= T.corte && t < T.drop ? 0.1 : t >= T.final ? 0.08 * clamp01((t - T.final) / 1.5) : 0;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <Background t={t} W={width} H={height} beat={bgBeat} tint={tint} tintAmt={tintAmt} />
      <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px) scale(${bump})` }}>
        {t < T.a + 0.05 && <Intro t={t} L={L} />}
        {t >= T.a - 0.4 && t < T.b + 0.05 && <SubidaA t={t} L={L} />}
        {t >= T.b - 0.05 && t < T.corte && <SubidaB t={t} L={L} />}
        {t >= T.corte && t < T.drop && <Corte t={t} L={L} />}
        {t >= T.drop - 0.4 && t < T.final + 0.05 && <Drop t={t} L={L} />}
        {t >= T.final - 0.05 && <Final t={t} L={L} />}
      </AbsoluteFill>
      <Flash t={t} at={[T.a, ...dropHits]} max={0.32} />
      <Flash t={t} at={rafaga.slice(1)} max={0.14} />
      <Flash t={t} at={[at("subidaB", 0, 2)]} max={0.7} />
      <Audio src={staticFile(R.audio)} volume={R.volumen} />
      {sfx().map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s.t * fps))} durationInFrames={Math.max(1, Math.round((s.dur ?? 2) * fps))} layout="none">
          <Audio src={staticFile(`audio/sfx/${s.f}`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
