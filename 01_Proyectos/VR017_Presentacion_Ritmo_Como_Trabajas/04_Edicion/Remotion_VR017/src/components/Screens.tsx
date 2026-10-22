import React from "react";
import { Rect } from "../geom";

/** Monitor abstracto (marco + pantalla + pie). `r` es el marco exterior. */
export const Monitor: React.FC<{ r: Rect; power?: number; edge?: string; edgeAmt?: number; children?: React.ReactNode; label?: string; opacity?: number; stand?: boolean }> = ({
  r, power = 1, edge, edgeAmt = 0, children, label, opacity = 1, stand = true,
}) => {
  if (opacity <= 0.001) return null;
  const b = Math.max(7, r.w * 0.012);
  const neckW = r.w * 0.07, neckH = r.h * 0.09, baseW = r.w * 0.26;
  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {stand && (
        <>
          <div style={{ position: "absolute", left: r.x + r.w / 2 - neckW / 2, top: r.y + r.h - 2, width: neckW, height: neckH, background: "linear-gradient(90deg,#141924,#232A3A,#141924)" }} />
          <div style={{ position: "absolute", left: r.x + r.w / 2 - baseW / 2, top: r.y + r.h + neckH - 4, width: baseW, height: 9, borderRadius: 6, background: "linear-gradient(180deg,#2A3245,#121621)" }} />
        </>
      )}
      <div
        style={{
          position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 14, background: "linear-gradient(160deg,#1B2130,#0C0F17)",
          border: `1.5px solid ${edge && edgeAmt > 0 ? edge : "#2A3142"}`, boxShadow: `0 30px 80px rgba(0,0,0,0.6)${edge && edgeAmt > 0 ? `, 0 0 ${50 * edgeAmt}px ${edge}66` : ""}`,
        }}
      />
      <div style={{ position: "absolute", left: r.x + b, top: r.y + b, width: r.w - 2 * b, height: r.h - 2 * b, borderRadius: 6, background: "#020305", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: power, background: "radial-gradient(120% 90% at 30% 20%, #18223A 0%, #0D1322 45%, #070A12 100%)" }} />
      </div>
      {children}
      {label && (
        <div style={{ position: "absolute", left: r.x + r.w / 2, top: r.y + r.h + neckH + 14, transform: "translateX(-50%)", fontFamily: "InterX, Inter, sans-serif", fontWeight: 700, fontSize: 20, color: "#8A90A2", letterSpacing: ".1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          {label}
        </div>
      )}
    </div>
  );
};
export const screenOf = (r: Rect): Rect => {
  const b = Math.max(7, r.w * 0.012);
  return { x: r.x + b, y: r.y + b, w: r.w - 2 * b, h: r.h - 2 * b };
};

/** Portátil abstracto: pantalla + base */
export const Laptop: React.FC<{ r: Rect; children?: React.ReactNode; label?: string }> = ({ r, children, label }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 12, background: "linear-gradient(160deg,#1B2130,#0C0F17)", border: "1.5px solid #2A3142", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }} />
    <div style={{ position: "absolute", left: r.x + 9, top: r.y + 9, width: r.w - 18, height: r.h - 18, borderRadius: 5, background: "radial-gradient(120% 90% at 30% 20%, #18223A 0%, #0D1322 45%, #070A12 100%)" }} />
    <div style={{ position: "absolute", left: r.x - r.w * 0.08, top: r.y + r.h, width: r.w * 1.16, height: r.h * 0.07, borderRadius: "0 0 14px 14px", background: "linear-gradient(180deg,#2A3245,#121621)" }} />
    {children}
    {label && (
      <div style={{ position: "absolute", left: r.x + r.w / 2, top: r.y + r.h * 1.07 + 18, transform: "translateX(-50%)", fontFamily: "InterX, Inter, sans-serif", fontWeight: 700, fontSize: 20, color: "#8A90A2", letterSpacing: ".1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
        {label}
      </div>
    )}
  </div>
);
export const laptopScreen = (r: Rect): Rect => ({ x: r.x + 9, y: r.y + 9, w: r.w - 18, h: r.h - 18 });
