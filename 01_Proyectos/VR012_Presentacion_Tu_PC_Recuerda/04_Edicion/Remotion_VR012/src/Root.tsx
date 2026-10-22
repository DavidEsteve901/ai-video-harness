import { Composition } from "remotion";
import cfg from "../edit.config.json";
import { VOCES } from "./theme";
import { VR012 } from "./VR012";

const frames = (lang: "es" | "en") => Math.round(VOCES[lang].duracion * cfg.fps);

export const Root: React.FC = () => (
  <>
    <Composition id="VR012-Vertical" component={VR012} durationInFrames={frames("es")} width={1080} height={1920} fps={cfg.fps} defaultProps={{ lang: "es" as const }} />
    <Composition id="VR012-Horizontal" component={VR012} durationInFrames={frames("es")} width={1920} height={1080} fps={cfg.fps} defaultProps={{ lang: "es" as const }} />
    <Composition id="VR012-EN-Vertical" component={VR012} durationInFrames={frames("en")} width={1080} height={1920} fps={cfg.fps} defaultProps={{ lang: "en" as const }} />
    <Composition id="VR012-EN-Horizontal" component={VR012} durationInFrames={frames("en")} width={1920} height={1080} fps={cfg.fps} defaultProps={{ lang: "en" as const }} />
  </>
);
