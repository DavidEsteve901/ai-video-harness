import { Composition } from "remotion";
import cfg from "../edit.config.json";
import { VOCES } from "./theme";
import { VR018 } from "./VR018";

const frames = Math.round(VOCES.es.duracion * cfg.fps);

// VR018 es solo vertical (Shorts / Reels / TikTok)
export const Root: React.FC = () => (
  <Composition id="VR018-Vertical" component={VR018} durationInFrames={frames} width={1080} height={1920} fps={cfg.fps} />
);
