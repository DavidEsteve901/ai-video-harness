import { Composition } from "remotion";
import cfg from "../edit.config.json";
import { VR001 } from "./VR001";

const common = {
  component: VR001,
  width: cfg.width,
  height: cfg.height,
  fps: cfg.fps,
  durationInFrames: Math.round(cfg.duration * cfg.fps),
};

// Cuatro salidas del mismo montaje: dos rótulos (Junior/Senior, Noob/Pro) x dos efectos
//   Sync  = el borde del Pro late con los golpes de la canción
//   Suave = una sola respuesta limpia en el clic y el drop, sin latidos
export const Root: React.FC = () => (
  <>
    <Composition id="VR001-NoobPro-Sync" {...common} defaultProps={{ top: "NOOB", bottom: "PRO", fx: "sync" as const }} />
    <Composition id="VR001-NoobPro-Suave" {...common} defaultProps={{ top: "NOOB", bottom: "PRO", fx: "suave" as const }} />
    <Composition id="VR001-JuniorSenior-Sync" {...common} defaultProps={{ top: "JUNIOR", bottom: "SENIOR", fx: "sync" as const }} />
    <Composition id="VR001-JuniorSenior-Suave" {...common} defaultProps={{ top: "JUNIOR", bottom: "SENIOR", fx: "suave" as const }} />
  </>
);
