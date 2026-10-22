import { Composition } from "remotion";
import cfg from "../edit.config.json";
import cfg2 from "../edit.v2.json";
import { VR003 } from "./VR003";
import { VR003V2 } from "./VR003V2";

const common = {
  component: VR003,
  width: cfg.width,
  height: cfg.height,
  fps: cfg.fps,
  durationInFrames: Math.round(cfg.duration * cfg.fps),
};

const v2 = {
  component: VR003V2,
  width: cfg2.width,
  height: cfg2.height,
  fps: cfg2.fps,
  durationInFrames: Math.round(cfg2.duration * cfg2.fps),
};

// V1: misma pieza en dos versiones (con locución / solo texto + efectos). V2 «Tony se entera»: igual, con y sin voz.
export const Root: React.FC = () => (
  <>
    <Composition id="VR003-ConVoz" {...common} defaultProps={{ voice: true }} />
    <Composition id="VR003-SinVoz" {...common} defaultProps={{ voice: false }} />
    <Composition id="VR003-V2-ConVoz" {...v2} defaultProps={{ voice: true }} />
    <Composition id="VR003-V2-SinVoz" {...v2} defaultProps={{ voice: false }} />
  </>
);
