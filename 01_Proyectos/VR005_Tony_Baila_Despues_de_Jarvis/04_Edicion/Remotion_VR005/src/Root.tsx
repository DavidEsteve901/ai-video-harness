import { Composition } from "remotion";
import cfg from "../edit.config.json";
import { VR005 } from "./VR005";

export const Root: React.FC = () => (
  <>
  <Composition
    id="VR005-Baila"
    component={VR005}
    width={cfg.width}
    height={cfg.height}
    fps={cfg.fps}
    durationInFrames={Math.round(cfg.duration * cfg.fps)}
  />
  {/* Versión B: texto sobre el vídeo, sin banda blanca */}
  <Composition
    id="VR005-Baila-Overlay"
    component={VR005}
    defaultProps={{ overlay: true }}
    width={cfg.width}
    height={cfg.height}
    fps={cfg.fps}
    durationInFrames={Math.round(cfg.duration * cfg.fps)}
  />
  {/* Versiones sin Jarvis («Felicidad»): mismos tiempos, otros textos */}
  <Composition
    id="VR005-Felicidad"
    component={VR005}
    defaultProps={{ felicidad: true }}
    width={cfg.width}
    height={cfg.height}
    fps={cfg.fps}
    durationInFrames={Math.round(cfg.duration * cfg.fps)}
  />
  <Composition
    id="VR005-Felicidad-Overlay"
    component={VR005}
    defaultProps={{ overlay: true, felicidad: true }}
    width={cfg.width}
    height={cfg.height}
    fps={cfg.fps}
    durationInFrames={Math.round(cfg.duration * cfg.fps)}
  />
  {/* Felicidad con el texto fijo (sin pulsación) */}
  <Composition
    id="VR005-Felicidad-Overlay-Fijo"
    component={VR005}
    defaultProps={{ overlay: true, felicidad: true, fijo: true }}
    width={cfg.width}
    height={cfg.height}
    fps={cfg.fps}
    durationInFrames={Math.round(cfg.duration * cfg.fps)}
  />
  <Composition
    id="VR005-Felicidad-Fijo"
    component={VR005}
    defaultProps={{ felicidad: true, fijo: true }}
    width={cfg.width}
    height={cfg.height}
    fps={cfg.fps}
    durationInFrames={Math.round(cfg.duration * cfg.fps)}
  />
  {/* Versión en inglés («Felicidad»): overlay/banda × pulsación/fijo */}
  {[
    { id: "VR005-EN-Overlay", props: { overlay: true } },
    { id: "VR005-EN", props: {} },
    { id: "VR005-EN-Overlay-Fijo", props: { overlay: true, fijo: true } },
    { id: "VR005-EN-Fijo", props: { fijo: true } },
  ].map((c) => (
    <Composition
      key={c.id}
      id={c.id}
      component={VR005}
      defaultProps={{ ...c.props, felicidad: true, en: true }}
      width={cfg.width}
      height={cfg.height}
      fps={cfg.fps}
      durationInFrames={Math.round(cfg.duration * cfg.fps)}
    />
  ))}
  </>
);
