import React, { useEffect, useState } from "react";
import { AbsoluteFill, OffthreadVideo, continueRender, delayRender, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import cfg from "../edit.config.json";

// Reparto vertical sin recortar nada: 1080×1920 = banda 502 + Tony 4:3 (810) + demo 16:9 (608)
const TONY_H = 810;
const DEMO_H = 608;
const BAND_H = cfg.height - TONY_H - DEMO_H;

export const VR004: React.FC = () => {
  const [handle] = useState(() => delayRender("fuentes"));
  useEffect(() => {
    loadFont({ family: "Inter", url: staticFile("fonts/Inter-ExtraBold.woff2"), weight: "800" })
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Banda de texto estilo meme */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: cfg.width,
          height: BAND_H,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 56px",
          textAlign: "center",
          fontFamily: "Inter, 'Segoe UI', Arial, sans-serif",
          fontWeight: 800,
          fontSize: 86,
          lineHeight: 1.12,
          color: "#000",
        }}
      >
        {cfg.texto}
      </div>
      {/* Arriba: Tony gritando, con su audio original */}
      {/* el clip (480×360) trae barras negras: el contenido real es 480×268 desde y=46; se amplía para llenar la caja */}
      <div style={{ position: "absolute", left: 0, top: BAND_H, width: cfg.width, height: TONY_H, overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("media/tony.mp4")}
          muted={!cfg.tonyAudio}
          style={{ position: "absolute", width: 1451, height: 1088, left: -185, top: -139 }}
        />
      </div>
      {/* Abajo: tu demo de las palmadas */}
      <OffthreadVideo
        src={staticFile("media/demo.mp4")}
        muted={!cfg.demoAudio}
        style={{ position: "absolute", left: 0, top: BAND_H + TONY_H, width: cfg.width, height: DEMO_H, objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};
