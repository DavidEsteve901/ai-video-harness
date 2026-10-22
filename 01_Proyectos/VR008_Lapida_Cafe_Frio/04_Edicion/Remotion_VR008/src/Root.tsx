import { Composition } from "remotion";
import cfg from "../edit.config.json";
import { T } from "./timeline";
import { VR008 } from "./VR008";

export const Root: React.FC = () => (
  <Composition id="VR008" component={VR008} durationInFrames={Math.round(T.total * cfg.fps)} width={cfg.width} height={cfg.height} fps={cfg.fps} />
);