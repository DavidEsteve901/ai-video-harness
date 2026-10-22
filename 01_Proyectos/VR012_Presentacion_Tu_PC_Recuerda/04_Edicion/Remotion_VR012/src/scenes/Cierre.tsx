import React from "react";
import { AbsoluteFill } from "remotion";
import { at, atEnd, C, clamp01, E, ease, ESC, prog, VOZ, win } from "../theme";
import { Layout, place } from "../layout";
import { BASE } from "../windows";
import { Cam, Desk, WS } from "../components/Desk";
import { shake } from "../components/Bits";

type P = { t: number; L: Layout };

// ───────── 10 · «Porque tu tiempo es para trabajar, no para colocar ventanas.» ─────────
export const barGeom = (L: Layout) => (L.vertical ? { w: 840, h: 116, y: L.c.y } : { w: 1320, h: 112, y: L.c.y + 20 });

export const S10: React.FC<P> = ({ t, L }) => {
  const a = ESC.t10.a;
  const tw = at("t10", "trabajar");
  const tc = at("t10", "colocar");
  const B = barGeom(L);
  const dim = E(t, a, 0.5);
  const barIn = E(t, a + 0.1, 0.6);
  const shrink = E(t, tc - 0.05, 0.7, ease.inOut);
  const fc = 0.42 - 0.38 * shrink; // fracción coral: «colocar ventanas»
  const greenLit = E(t, tw - 0.05, 0.4);
  const x0 = L.W / 2 - B.w / 2;
  const ticks = 11;
  return (
    <AbsoluteFill>
      <Cam s={1 - 0.05 * dim} ox={L.c.x} oy={L.c.y} opacity={1 - 0.8 * dim} filter={`blur(${dim * 6}px)`}>
        <Desk L={L} t={t} wins={BASE.map((s) => ({ slot: s }))} />
      </Cam>
      <div style={{ position: "absolute", left: x0, top: B.y - B.h / 2, width: B.w, height: B.h, opacity: barIn, transform: `scaleX(${0.6 + 0.4 * barIn})` }}>
        {/* reloj */}
        <svg viewBox="0 0 40 40" style={{ position: "absolute", left: -B.h * 0.95, top: B.h * 0.16, width: B.h * 0.68, height: B.h * 0.68 }}>
          <circle cx="20" cy="20" r="16" fill="none" stroke={C.ink} strokeWidth="3" opacity="0.8" />
          <line x1="20" y1="20" x2={20 + 10 * Math.sin(t * 3)} y2={20 - 10 * Math.cos(t * 3)} stroke={C.ink} strokeWidth="3" strokeLinecap="round" />
          <line x1="20" y1="20" x2={20 + 7 * Math.sin(t * 0.4)} y2={20 - 7 * Math.cos(t * 0.4)} stroke={C.ink} strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", inset: 0, borderRadius: B.h / 2, background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: `${fc * 100}%`,
              background: `repeating-linear-gradient(-45deg, ${C.coral} 0 14px, #D9454A 14px 28px)`, backgroundPosition: `${t * 60}px 0`,
              boxShadow: `inset -6px 0 12px rgba(0,0,0,0.4)`,
            }}
          />
          <div
            style={{
              position: "absolute", left: `${fc * 100}%`, right: 0, top: 0, bottom: 0,
              background: `linear-gradient(90deg, #00B85C, ${C.green})`, opacity: 0.55 + 0.45 * greenLit,
              boxShadow: greenLit > 0 ? `0 0 ${60 * greenLit}px ${C.green}` : undefined,
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)`, width: "30%", transform: `translateX(${((t * 0.6) % 1.6) * 100 * 2.2 - 60}%)`, opacity: greenLit }} />
          </div>
        </div>
        {Array.from({ length: ticks }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: (B.w * i) / (ticks - 1) - 1, top: B.h + 14, width: 2, height: i % 5 === 0 ? 18 : 10, background: "rgba(243,241,234,0.35)" }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ───────── 11 · «Ahora sí: tu ordenador recuerda cómo trabajas.» ─────────
export const S11: React.FC<P> = ({ t, L }) => {
  const a = ESC.t11.a;
  const tA = at("t11", "ahora");
  const tO = at("t11", "ordenador");
  const tR = at("t11", "recuerda");
  const B = barGeom(L);
  const barOut = E(t, a, 0.35, ease.in);
  const deskIn = E(t, a + 0.05, 0.4);
  const off = prog(t, tA + 0.05, tA + 0.38);
  const on = ease.out(prog(t, tO - 0.12, tO + 0.18));
  const crt = on > 0 ? 1 - on : off;
  const flash = t > tO - 0.12 ? Math.max(0, 1 - (t - tO + 0.12) / 1.1) : 0;
  const end = VOZ.duracion;
  const fadeOut = E(t, end - 0.55, 0.5, ease.in);
  const lastE = atEnd("t11", "trabajas");
  const pull = E(t, tR, end - tR, ease.inOut);
  const final = E(t, lastE + 0.25, 1.0, ease.inOut);
  const wins: WS[] = BASE.map((s) => ({ slot: s, glow: C.green, glowAmt: flash }));
  const sh = shake(t, [tO + 0.05], 8);
  return (
    <AbsoluteFill style={{ opacity: 1 - fadeOut }}>
      {barOut < 1 && (
        <div style={{ position: "absolute", left: L.W / 2 - B.w / 2, top: B.y - B.h / 2, width: B.w, height: B.h, borderRadius: B.h / 2, background: C.green, transform: `scaleY(${1 - barOut})`, opacity: 1 - barOut, boxShadow: `0 0 50px ${C.green}` }} />
      )}
      <Cam s={1.06 - 0.06 * deskIn + 0.05 * pull} x={sh.x} y={sh.y} ox={L.c.x} oy={L.c.y} opacity={deskIn * (1 - 0.72 * final)} filter={final > 0 ? `blur(${final * 7}px)` : undefined}>
        <Desk L={L} t={t} wins={wins} crt={[crt, crt]} edge={C.green} edgeAmt={flash * 0.9 + win(t, tR, end, 0.4, 0.4) * 0.35} />
      </Cam>
      {flash > 0 && <AbsoluteFill style={{ background: `radial-gradient(circle at ${L.c.x}px ${L.c.y}px, ${C.green}33, transparent 60%)`, opacity: flash }} />}
    </AbsoluteFill>
  );
};
export { clamp01, place };
