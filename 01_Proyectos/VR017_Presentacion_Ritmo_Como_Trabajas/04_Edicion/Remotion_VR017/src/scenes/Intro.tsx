import React from "react";
import { at } from "../ritmo";
import { C, clamp01, ease, Layout, lerp, rnd, E } from "../theme";
import { Linea } from "../components/Kinetic";
import { Win } from "../components/Win";
import { Dust, Icon, IconName } from "../components/Bits";
import { Kind } from "../windows";

// INTRO (4 compases): el ritual de cada día → «¿Y si tu PC lo recordara?»
const SLOTS: [number, number][] = [[0.3, 0.25], [0.72, 0.3], [0.25, 0.74], [0.76, 0.7], [0.52, 0.16], [0.18, 0.48], [0.83, 0.5], [0.5, 0.84], [0.38, 0.4], [0.64, 0.6], [0.44, 0.62], [0.6, 0.36]];
const KINDS: Kind[] = ["browser", "code", "notes", "terminal", "music", "chat", "design", "reader", "browser", "code", "terminal", "notes"];

export const Intro: React.FC<{ t: number; L: Layout }> = ({ t, L }) => {
  const { W, H, V } = L;
  const a = (c: number, p = 0) => at("intro", c, p);
  const big = V ? 150 : 176;
  // compás 1: cuatro palabras, una por pulso, con su icono
  const w1: [string, IconName][] = [["Apps.", "appWindow"], ["Pestañas.", "globe"], ["Carpetas.", "folder"], ["Terminales.", "terminal"]];
  // ventanas que se amontonan (compases 2–3), una por corchea
  const spawn = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 6.5].map((q) => a(1 + Math.floor(q / 4), q % 4));
  const ww = V ? 430 : 520, wh = V ? 290 : 330;
  const dissolve = a(3, 0);
  const shakeAmt = t > a(2) && t < a(3) ? 1 : 0;
  return (
    <>
      {/* ventanas del caos */}
      {spawn.map((ts, i) => {
        if (t < ts - 0.2) return null;
        const k = ease.out(clamp01((t - ts + 0.2) / 0.2));
        const ang = rnd("ang" + i) * Math.PI * 2;
        const [fx0, fy0] = SLOTS[i % SLOTS.length];
        const px = W * fx0 + (rnd("px" + i) - 0.5) * 60 - ww / 2;
        const py = H * (V ? 0.12 + 0.76 * fy0 : fy0) + (rnd("py" + i) - 0.5) * 40 - wh / 2;
        const fx = px + Math.cos(ang) * 900 * (1 - k), fy = py + Math.sin(ang) * 900 * (1 - k);
        const rot = (rnd("r" + i) - 0.5) * 16 + (1 - k) * 30 * (rnd("rr" + i) - 0.5);
        const jit = shakeAmt * Math.sin(t * 40 + i) * 4;
        const dk = clamp01((t - dissolve - i * 0.06) / 0.7);
        const op = (0.62 - 0.25 * clamp01((t - a(2)) / 2)) * (1 - ease.in(dk));
        if (op <= 0.01 && dk >= 1) return null;
        return (
          <React.Fragment key={i}>
            <Win r={{ x: fx + jit, y: fy, w: ww, h: wh }} kind={KINDS[i % KINDS.length]} t={t} seed={"i" + i} opacity={op} rotate={rot} glow={C.coral} glowAmt={t > a(2) ? 0.45 : 0} desat={dk} blur={dk * 6} />
            <Dust x={px} y={py} w={ww} h={wh} k={dk} seed={"d" + i} n={26} color={C.amber} />
          </React.Fragment>
        );
      })}
      {/* compás 1: palabras con icono */}
      {w1.map(([w, ic], i) => {
        const ts = a(0, i);
        const te = i < 3 ? a(0, i + 1) : a(1, 0) - 0.05;
        if (t < ts || t > te + 0.15) return null;
        const k = ease.out(clamp01((t - ts) / 0.18));
        const ko = clamp01((t - te) / 0.12);
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: L.cy - (V ? 250 : 210), width: W, display: "flex", justifyContent: "center", opacity: k * (1 - ko) }}>
            <div style={{ display: "grid", placeItems: "center", width: 120, height: 120, borderRadius: 30, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: C.ink, transform: `scale(${lerp(0.6, 1, k)}) rotate(${(1 - k) * -14}deg)` }}>
              <Icon name={ic} size={62} stroke={1.8} />
            </div>
          </div>
        );
      })}
      {w1.map(([w], i) => (
        <Linea key={w} t={t} x={L.cx} y={L.cy} size={big} maxW={W} entrada="slam" palabras={[{ w, at: a(0, i), out: i < 3 ? a(0, i + 1) - 0.17 : a(1, 0) - 0.17 }]} />
      ))}
      {/* compás 2: cada día, a mano, otra vez */}
      <Linea
        t={t} x={L.cx} y={L.cy} size={V ? 112 : 132} maxW={V ? 980 : 1700} entrada="rise"
        palabras={[
          { w: "Cada", at: a(1, 0), out: a(2, 0) - 0.1 },
          { w: "día,", at: a(1, 0.5), out: a(2, 0) - 0.1 },
          { w: "a mano,", at: a(1, 1), out: a(2, 0) - 0.1, color: C.coral },
          { w: "otra", at: a(1, 2), out: a(2, 0) - 0.1 },
          { w: "vez.", at: a(1, 3), out: a(2, 0) - 0.1 },
        ]}
      />
      {/* compás 3: abrir, colocar, buscar */}
      {["Abrir.", "Colocar.", "Buscar."].map((w, i) => (
        <Linea key={w} t={t} x={L.cx} y={L.cy} size={big} maxW={W} entrada="slam" color={C.coral} palabras={[{ w, at: a(2, i), out: i < 2 ? a(2, i + 1) - 0.17 : a(3, 0) - 0.17 }]} glow={30} />
      ))}
      {/* compás 4: ¿y si tu PC lo recordara? */}
      <Linea
        t={t} x={L.cx} y={L.cy} size={V ? 118 : 140} maxW={V ? 940 : 1700} entrada="rise"
        palabras={[
          { w: "¿Y si", at: a(3, 0), out: a(4 - 0, 0) - 0.12 },
          { w: "tu PC", at: a(3, 0.5), out: a(4, 0) - 0.12 },
          { w: "lo", at: a(3, 2), out: a(4, 0) - 0.12 },
          { w: "recordara?", at: a(3, 2.5), out: a(4, 0) - 0.12, color: C.amber, mark: C.amber },
        ]}
      />
      {/* brillo ámbar del giro */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(${W * 0.5}px ${H * 0.35}px at 50% 50%, ${C.amber}, transparent 70%)`, opacity: 0.16 * E(t, a(3, 2), 0.5) * (1 - clamp01((t - a(4, 0) + 0.2) / 0.2)), mixBlendMode: "screen" }} />
    </>
  );
};
