import { Composition } from "remotion";
import cfg from "../edit.config.json";
import { VR002 } from "./VR002";

export const Root: React.FC = () => (
  <Composition
    id="VR002-TonyJarvis"
    component={VR002}
    width={cfg.width}
    height={cfg.height}
    fps={cfg.fps}
    durationInFrames={Math.round(cfg.duration * cfg.fps)}
  />
);
