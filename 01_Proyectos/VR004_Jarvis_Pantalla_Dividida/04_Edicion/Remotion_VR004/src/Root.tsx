import { Composition } from "remotion";
import cfg from "../edit.config.json";
import { VR004 } from "./VR004";

export const Root: React.FC = () => (
  <Composition
    id="VR004-Jarvis"
    component={VR004}
    width={cfg.width}
    height={cfg.height}
    fps={cfg.fps}
    durationInFrames={Math.round(cfg.duration * cfg.fps)}
  />
);
