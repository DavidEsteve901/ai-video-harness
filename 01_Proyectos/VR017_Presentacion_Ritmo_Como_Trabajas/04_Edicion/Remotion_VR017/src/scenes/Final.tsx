import React from "react";
import { Img, staticFile } from "remotion";
import { at, duracionTotal } from "../ritmo";
import { C, clamp01, E, ease, Layout, rnd } from "../theme";
import { Linea } from "../components/Kinetic";
import { Icon } from "../components/Bits";

// CORTE (1 compás): todo se apaga; «Y ahora, pídeselo.» en ámbar; silencio en el último pulso.
export const Corte: React.FC<{ t: number; L: Layout }> = ({ t, L }) => {
  const a = (p: number) => at("corte", 0, p);
  const end = at("drop", 0, 0);
  const pull = ease.in(clamp01((t - (end - 0.36)) / 0.24)); // se va en el pulso de silencio, antes de que entre el drop
  const spark = E(t, a(0), 0.3) * (0.7 + 0.3 * Math.sin((t - a(0)) * 9));
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + pull * 0.6})`, filter: pull > 0.02 ? `blur(${pull * 14}px)` : undefined, opacity: 1 - pull }}>
      <div style={{ position: "absolute", left: L.cx - 260, top: L.cy - 260 - (L.V ? 40 : 0), width: 520, height: 520, borderRadius: 999, background: `radial-gradient(circle, ${C.ai}55, transparent 65%)`, opacity: spark }} />
      <Linea t={t} x={L.cx} y={L.cy - (L.V ? 40 : 0)} size={L.V ? 128 : 150} maxW={L.V ? 980 : 1700} entrada="rise"
        palabras={[{ w: "Y ahora,", at: a(0) }, { w: "pídeselo.", at: a(2), color: C.ai, mark: C.ai }]} />
    </div>
  );
};

// FINAL (3 compases): «Tu PC recuerda cómo trabajas. Tú decides.»
const RECUERDOS = [
  { src: "img/ui/ws.jpg", r: 1689 / 1470 },
  { src: "img/ui/omnibar.jpg", r: 2367 / 1386 },
  { src: "img/ui/voz.jpg", r: 2400 / 966 },
  { src: "img/ui/chat.jpg", r: 1947 / 1092 },
  { src: "img/ui/gestos.jpg", r: 2094 / 1530 },
  { src: "img/ui/layouts.jpg", r: 1533 / 1041 },
];
export const Final: React.FC<{ t: number; L: Layout }> = ({ t, L }) => {
  const a = (c: number, p = 0) => at("final", c, p);
  const V = L.V;
  const fin = duracionTotal();
  const zoomOut = 1 - 0.06 * ease.inOut(clamp01((t - a(2, 0)) / (fin - a(2, 0))));
  const fade = 1 - clamp01((t - (fin - 1.0)) / 0.95);
  const checkK = E(t, a(1, 2), 0.35);
  const y1 = V ? L.cy - 240 : L.cy - 150;
  const y2 = V ? L.cy + 175 : L.cy + 190;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${zoomOut})`, opacity: fade }}>
      {/* recuerdos: la interfaz real flotando al fondo */}
      {RECUERDOS.map((m, i) => {
        const k = E(t, a(0, i * 0.5), 0.8);
        const ang = (i / RECUERDOS.length) * Math.PI * 2 + 0.4;
        const rad = V ? 560 : 640;
        const x = L.cx + Math.cos(ang + t * 0.05) * rad * (V ? 0.75 : 1.15) * (1.3 - 0.3 * k);
        const y = L.cy + Math.sin(ang + t * 0.05) * rad * (V ? 1.25 : 0.62) * (1.3 - 0.3 * k);
        const w = (V ? 330 : 380) * (0.85 + 0.3 * rnd("m" + i));
        return (
          <div key={i} style={{ position: "absolute", left: x - w / 2, top: y - w / m.r / 2, width: w, opacity: 0.2 * k, filter: "blur(1.5px)", transform: `rotate(${(rnd("q" + i) - 0.5) * 10}deg)` }}>
            <Img src={staticFile(m.src)} style={{ width: "100%", borderRadius: 12, display: "block", boxShadow: "0 20px 60px rgba(0,0,0,.6)" }} />
          </div>
        );
      })}
      <Linea t={t} x={L.cx} y={y1} size={V ? 112 : 130} maxW={V ? 1000 : 1300} entrada="rise"
        palabras={[{ w: "Tu PC", at: a(0, 0) }, { w: "recuerda", at: a(0, 1), color: C.amber, mark: C.amber }, { w: "cómo", at: a(0, 2) }, { w: "trabajas.", at: a(0, 3) }]} />
      <Linea t={t} x={L.cx} y={y2} size={V ? 150 : 160} maxW={V ? 1000 : 1700} entrada="slam"
        palabras={[
          { w: "Tú", at: a(1, 0) },
          { w: "decides.", at: a(1, 2), color: C.green },
          {
            w: "", at: a(1, 2) + 0.08, entrada: "drop",
            node: (
              <span style={{ display: "inline-grid", placeItems: "center", width: (V ? 0.78 : 0.8) * (V ? 150 : 160), height: (V ? 0.78 : 0.8) * (V ? 150 : 160), borderRadius: 999, background: C.green, color: "#04140b", verticalAlign: "middle", boxShadow: `0 0 ${60 * checkK}px ${C.green}88`, transform: "translateY(-6%)" }}>
                <Icon name="check" size={(V ? 150 : 160) * 0.5} stroke={3.4} />
              </span>
            ),
          },
        ]} />
    </div>
  );
};
