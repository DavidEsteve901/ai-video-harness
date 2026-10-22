import { Composition } from "remotion";
import cfg from "../edit.config.json";
import { VOCES } from "./theme";
import { VR013 } from "./VR013";

const frames = (lang: "es" | "en") => Math.round(VOCES[lang].duracion * cfg.fps);

export const Root: React.FC = () => (
  <>
    <Composition id="VR013-Vertical" component={VR013} durationInFrames={frames("es")} width={1080} height={1920} fps={cfg.fps} defaultProps={{ lang: "es" as const }} />
    <Composition id="VR013-Horizontal" component={VR013} durationInFrames={frames("es")} width={1920} height={1080} fps={cfg.fps} defaultProps={{ lang: "es" as const }} />
    <Composition id="VR013-EN-Vertical" component={VR013} durationInFrames={frames("en")} width={1080} height={1920} fps={cfg.fps} defaultProps={{ lang: "en" as const }} />
    <Composition id="VR013-EN-Horizontal" component={VR013} durationInFrames={frames("en")} width={1920} height={1080} fps={cfg.fps} defaultProps={{ lang: "en" as const }} />
  </>
);
