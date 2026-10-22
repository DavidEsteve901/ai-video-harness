import React from "react";
import { clamp01 } from "../theme";
import { BEZEL, Layout, Rect, screenOf } from "../layout";

/** Transformación de apagado tipo tubo: 0 = normal, 0.5 = línea, 1 = punto */
export const crtStyle = (scr: Rect, crt: number): React.CSSProperties => {
  if (crt <= 0) return {};
  const sy = crt < 0.5 ? Math.max(0.006, 1 - clamp01(crt / 0.5) ** 0.7) : 0.006;
  const sx = crt < 0.5 ? 1 : Math.max(0.002, 1 - clamp01((crt - 0.5) / 0.5) ** 0.6);
  return {
    transform: `scale(${sx}, ${sy})`,
    transformOrigin: `${scr.x + scr.w / 2}px ${scr.y + scr.h / 2}px`,
    filter: `brightness(${1 + crt * 3})`,
  };
};

type Props = {
  L: Layout;
  i: 0 | 1;
  power?: number; // 0 apagada (negra) .. 1 encendida
  crt?: number;
  opacity?: number;
  edge?: string; // color del borde iluminado
  edgeAmt?: number;
  children?: React.ReactNode; // ventanas (en coordenadas del fotograma)
};

export const Monitor: React.FC<Props> = ({ L, i, power = 1, crt = 0, opacity = 1, edge, edgeAmt = 0, children }) => {
  const m = L.mon[i];
  const u = L.u;
  const scr = screenOf(m, u);
  const neckW = m.w * 0.07;
  const neckH = (i === 0 ? 42 : 30) * u;
  const baseW = m.w * 0.26;
  if (opacity <= 0.001) return null;
  const lineGlow = crt > 0 && crt < 1 ? 1 - Math.abs(crt - 0.5) * 1.6 : 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {/* pie */}
      <div style={{ position: "absolute", left: m.x + m.w / 2 - neckW / 2, top: m.y + m.h - 2, width: neckW, height: neckH, background: "linear-gradient(90deg,#141924,#232A3A,#141924)" }} />
      <div style={{ position: "absolute", left: m.x + m.w / 2 - baseW / 2, top: m.y + m.h + neckH - 4, width: baseW, height: 9 * u, borderRadius: 6, background: "linear-gradient(180deg,#2A3245,#121621)" }} />
      {/* marco */}
      <div
        style={{
          position: "absolute", left: m.x, top: m.y, width: m.w, height: m.h, borderRadius: 16 * u,
          background: "linear-gradient(160deg,#1B2130,#0C0F17)",
          border: `1.5px solid ${edge && edgeAmt > 0 ? edge : "#2A3142"}`,
          boxShadow: `0 30px 80px rgba(0,0,0,0.6)${edge && edgeAmt > 0 ? `, 0 0 ${50 * edgeAmt}px ${edge}55` : ""}`,
        }}
      />
      {/* pantalla */}
      <div style={{ position: "absolute", left: scr.x, top: scr.y, width: scr.w, height: scr.h, borderRadius: 7 * u, background: "#020305", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute", inset: 0, ...crtStyle({ x: 0, y: 0, w: scr.w, h: scr.h }, crt),
            opacity: power,
            background: "radial-gradient(120% 90% at 30% 20%, #18223A 0%, #0D1322 45%, #070A12 100%)",
          }}
        />
      </div>
      {/* línea de apagado */}
      {lineGlow > 0 && (
        <div
          style={{
            position: "absolute", left: scr.x + scr.w * (crt < 0.5 ? 0 : (0.5 * (crt - 0.5)) / 0.5), width: scr.w * (crt < 0.5 ? 1 : 1 - (crt - 0.5) / 0.5),
            top: scr.y + scr.h / 2 - 2, height: 4, borderRadius: 4, background: "#EAF6FF", boxShadow: "0 0 30px 8px rgba(160,210,255,0.8)", opacity: lineGlow,
          }}
        />
      )}
      {/* ventanas: comparten el apagado del tubo */}
      <div style={{ position: "absolute", inset: 0, ...crtStyle(scr, crt), opacity: crt >= 0.98 ? 0 : 1 }}>{children}</div>
      {/* brillo del cristal */}
      <div style={{ position: "absolute", left: scr.x, top: scr.y, width: scr.w, height: scr.h, borderRadius: 7 * u, pointerEvents: "none", background: "linear-gradient(125deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 38%)" }} />
    </div>
  );
};

export { BEZEL };
