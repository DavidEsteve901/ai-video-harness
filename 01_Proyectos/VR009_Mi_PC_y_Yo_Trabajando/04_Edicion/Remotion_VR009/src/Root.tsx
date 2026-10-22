import { Composition } from "remotion";
import cfg from "../edit.config.json";
import { VR009 } from "./VR009";

export const Root: React.FC = () => (
  <Composition id="VR009-MiPCyYo" component={VR009} durationInFrames={Math.round(cfg.duration * cfg.fps)} width={cfg.width} height={cfg.height} fps={cfg.fps} />
);