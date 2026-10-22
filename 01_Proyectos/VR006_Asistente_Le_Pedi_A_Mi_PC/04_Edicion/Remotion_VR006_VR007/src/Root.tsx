import { Composition } from "remotion";
import cfg from "../edit.config.json";
import { VR006, VR007 } from "./VRS";

const base = { width: cfg.width, height: cfg.height, fps: cfg.fps };

export const Root: React.FC = () => (
  <>
    <Composition id="VR006-Asistente" component={VR006} durationInFrames={Math.round(cfg.asistente.duration * cfg.fps)} {...base} />
    <Composition id="VR007-CuentaAtras" component={VR007} durationInFrames={Math.round(cfg.cuentaatras.duration * cfg.fps)} {...base} />
  </>
);
