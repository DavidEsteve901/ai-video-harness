import { Composition } from "remotion";
import cfg from "../edit.config.json";
import { VR011 } from "./VR011";

const frames = Math.round(cfg.duration * cfg.fps);

export const Root: React.FC = () => (
  <>
    <Composition id="VR011-Vertical" component={VR011} durationInFrames={frames} width={1080} height={1920} fps={cfg.fps} />
    <Composition id="VR011-Horizontal" component={VR011} durationInFrames={frames} width={1920} height={1080} fps={cfg.fps} />
  </>
);
