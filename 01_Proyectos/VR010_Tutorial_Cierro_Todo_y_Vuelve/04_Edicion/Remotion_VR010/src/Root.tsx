import { Composition } from "remotion";
import cfg from "../edit.config.json";
import cfg2 from "../edit.v2.json";
import { VR010 } from "./VR010";
import { VR010V2 } from "./VR010V2";

export const Root: React.FC = () => (
  <>
    <Composition id="VR010-CierroTodo" component={VR010} durationInFrames={Math.round(cfg.duration * cfg.fps)} width={cfg.width} height={cfg.height} fps={cfg.fps} />
    <Composition id="VR010-V2-Voz" component={VR010V2} durationInFrames={Math.round(cfg2.duration * cfg2.fps)} width={cfg2.width} height={cfg2.height} fps={cfg2.fps} />
  </>
);
