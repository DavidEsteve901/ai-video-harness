import React from "react";
import { Composition } from "remotion";
import { duracionTotal, LOSER, PROPIA, setRejilla } from "./ritmo";
import { VR017 } from "./VR017";

const FPS = 60;
const frames = (r: typeof PROPIA) => {
  setRejilla(r);
  const n = Math.round(duracionTotal() * FPS);
  setRejilla(PROPIA);
  return n;
};

export const Root: React.FC = () => (
  <>
    <Composition id="VR017-Vertical" component={VR017} durationInFrames={frames(PROPIA)} width={1080} height={1920} fps={FPS} defaultProps={{ musica: "propia" as const }} />
    <Composition id="VR017-Horizontal" component={VR017} durationInFrames={frames(PROPIA)} width={1920} height={1080} fps={FPS} defaultProps={{ musica: "propia" as const }} />
    {LOSER && (
      <>
        <Composition id="VR017-Vertical-Loser" component={VR017} durationInFrames={frames(LOSER)} width={1080} height={1920} fps={FPS} defaultProps={{ musica: "loser" as const }} />
        <Composition id="VR017-Horizontal-Loser" component={VR017} durationInFrames={frames(LOSER)} width={1920} height={1080} fps={FPS} defaultProps={{ musica: "loser" as const }} />
      </>
    )}
  </>
);
