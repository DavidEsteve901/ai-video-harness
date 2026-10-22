import { Composition } from "remotion";
import cfg from "../edit.config.json";
import { VOCES } from "./theme";
import { VR014 } from "./VR014";

const frames = Math.round(VOCES.es.duracion * cfg.fps);

export const Root: React.FC = () => (
  <>
    <Composition id="VR014-Vertical" component={VR014} durationInFrames={frames} width={1080} height={1920} fps={cfg.fps} defaultProps={{ lang: "es" as const }} />
    <Composition id="VR014-Horizontal" component={VR014} durationInFrames={frames} width={1920} height={1080} fps={cfg.fps} defaultProps={{ lang: "es" as const }} />
  </>
);
