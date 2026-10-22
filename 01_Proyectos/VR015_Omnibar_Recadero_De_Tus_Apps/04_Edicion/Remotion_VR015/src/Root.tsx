import { Composition } from "remotion";
import cfg from "../edit.config.json";
import { VOCES } from "./theme";
import { VR015 } from "./VR015";

const frames = Math.round(VOCES.es.duracion * cfg.fps);

export const Root: React.FC = () => (
  <>
    <Composition id="VR015-Vertical" component={VR015} durationInFrames={frames} width={1080} height={1920} fps={cfg.fps} defaultProps={{ lang: "es" as const }} />
    <Composition id="VR015-Horizontal" component={VR015} durationInFrames={frames} width={1920} height={1080} fps={cfg.fps} defaultProps={{ lang: "es" as const }} />
  </>
);
