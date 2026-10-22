import React from "react";
import { Layout, place, Rect, screenOf } from "../layout";
import { Slot } from "../windows";
import { Monitor } from "./Monitor";
import { Win } from "./Win";

export type WS = {
  slot: Slot;
  r?: Rect;
  opacity?: number;
  scale?: number;
  rotate?: number;
  glow?: string;
  glowAmt?: number;
  blur?: number;
  ghost?: number;
  desat?: number;
  live?: number;
};

type Props = {
  L: Layout;
  t: number;
  wins: WS[];
  power?: [number, number];
  crt?: [number, number];
  opacity?: [number, number];
  clip?: boolean; // recortar ventanas a la pantalla (cambio de escritorio)
  edge?: string;
  edgeAmt?: number;
  overlay?: [React.ReactNode, React.ReactNode]; // capas encima de cada pantalla (zonas, etc.)
};

export const Desk: React.FC<Props> = ({ L, t, wins, power = [1, 1], crt = [0, 0], opacity = [1, 1], clip = false, edge, edgeAmt = 0, overlay }) => (
  <>
    {([0, 1] as const).map((i) => {
      const scr = screenOf(L.mon[i], L.u);
      const r = 7 * L.u;
      return (
        <Monitor key={i} L={L} i={i} power={power[i]} crt={crt[i]} opacity={opacity[i]} edge={edge} edgeAmt={edgeAmt}>
          <div style={{ position: "absolute", inset: 0, clipPath: clip ? `inset(${scr.y}px ${L.W - scr.x - scr.w}px ${L.H - scr.y - scr.h}px ${scr.x}px round ${r}px)` : undefined }}>
            {overlay?.[i]}
            {wins
              .filter((w) => w.slot.mon === i)
              .map((w) => (
                <Win
                  key={w.slot.id}
                  r={w.r ?? place(L, w.slot.mon, w.slot.f)}
                  kind={w.slot.kind}
                  t={t}
                  seed={w.slot.id}
                  opacity={w.opacity}
                  scale={w.scale}
                  rotate={w.rotate}
                  glow={w.glow}
                  glowAmt={w.glowAmt}
                  blur={w.blur}
                  ghost={w.ghost}
                  desat={w.desat}
                  live={w.live}
                />
              ))}
          </div>
        </Monitor>
      );
    })}
  </>
);

/** Cámara: escala/desplaza todo el escenario alrededor de un origen */
export const Cam: React.FC<{ s?: number; x?: number; y?: number; ox: number; oy: number; filter?: string; opacity?: number; children: React.ReactNode }> = ({ s = 1, x = 0, y = 0, ox, oy, filter, opacity = 1, children }) => (
  <div style={{ position: "absolute", inset: 0, transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: `${ox}px ${oy}px`, filter, opacity }}>{children}</div>
);
