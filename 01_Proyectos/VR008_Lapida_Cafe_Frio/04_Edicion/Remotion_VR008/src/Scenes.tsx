import React from "react";
import { AbsoluteFill } from "remotion";
import { ANTON, C, H, INTER, W, clamp01, decay, easeBack, easeInOut, easeOut, lerp, mix, prog, rnd } from "./theme";
import { Mug, Person } from "./Characters";

// ═════════════════════════ LÁPIDA (gancho y remate) ═════════════════════════
const engraved: React.CSSProperties = {
  color: "#1C2033",
  textShadow: "0 3px 0 rgba(255,255,255,0.28), 0 -2px 0 rgba(0,0,0,0.25)",
  fontFamily: ANTON,
  textAlign: "center",
  lineHeight: 1.0,
};

export const Tomb: React.FC<{
  t: number;
  dawn: number; // 0 noche .. 1 amanecer
  slamAt?: number; // instante del golpe de la lápida (si se anima la caída)
  oldOpacity: number; // epitafio antiguo
  strike: number; // 0..1 tachón sobre el epitafio antiguo
  newReveal: number; // 0..1 epitafio nuevo (se escribe)
  mugHot?: number;
  showMug?: boolean;
}> = ({ t, dawn, slamAt, oldOpacity, strike, newReveal, mugHot = 1, showMug = false }) => {
  const k = slamAt === undefined ? 1 : prog(t, slamAt, slamAt + 0.22, easeOut);
  const stoneY = slamAt === undefined ? 0 : (1 - k) * -90;
  const stoneScale = slamAt === undefined ? 1 : 1 + (1 - k) * 0.1;
  const settle = slamAt === undefined ? 0 : decay(t, slamAt + 0.05, 0.12) * 14;
  const sky1 = mix(C.night, "#5B8FD8", dawn);
  const sky2 = mix(C.nightMid, C.dawnB, dawn);
  const sunY = lerp(1260, 700, easeOut(dawn));
  const stars = Array.from({ length: 46 }, (_, i) => ({ x: rnd(i) * W, y: rnd(i + 50) * 760, r: 1.5 + rnd(i + 90) * 2.6, ph: rnd(i + 7) * 6 }));
  const text = (n: number) => {
    // escribe el nuevo epitafio carácter a carácter
    const a = "Su café siempre";
    const b = "estuvo caliente.";
    const total = a.length + b.length;
    const shown = Math.floor(n * total + 0.0001);
    return [a.slice(0, Math.min(a.length, shown)), b.slice(0, Math.max(0, shown - a.length))];
  };
  const [n1, n2] = text(newReveal);
  const mist = (i: number) => (
    <div
      key={i}
      style={{
        position: "absolute", left: -300 + ((t * (14 + i * 6) + i * 420) % 1700), top: 1010 + i * 52, width: 700, height: 170, borderRadius: "50%",
        background: `radial-gradient(closest-side, rgba(220,230,255,${0.24 - dawn * 0.14}), transparent)`,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${sky1} 0%, ${sky2} 70%)` }}>
      {/* estrellas */}
      {stars.map((s, i) => (
        <div key={i} style={{ position: "absolute", left: s.x, top: s.y, width: s.r * 2, height: s.r * 2, borderRadius: "50%", background: "#fff", opacity: (1 - dawn) * (0.4 + 0.5 * Math.sin(t * 2 + s.ph)) }} />
      ))}
      {/* luna */}
      <div style={{ position: "absolute", left: 770, top: 250, width: 190, height: 190, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #FFFFFF, #CFCBFF)", boxShadow: "0 0 120px rgba(190,190,255,0.7)", opacity: 1 - dawn }} />
      {/* sol */}
      <div style={{ position: "absolute", left: 310, top: sunY - 230, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, #FFF6C9 0%, #FFD36B 45%, rgba(255,160,80,0) 72%)", opacity: dawn }} />
      {/* colinas */}
      <div style={{ position: "absolute", left: -200, right: -200, top: 1010, height: 700, borderRadius: "50% 50% 0 0", background: mix("#0C1126", "#4E8F5A", dawn) }} />
      <div style={{ position: "absolute", left: -400, right: 120, top: 1090, height: 800, borderRadius: "50% 50% 0 0", background: mix("#090D1E", "#3E7D4E", dawn) }} />
      {[0, 1].map(mist)}

      {/* la lápida */}
      <div style={{ position: "absolute", left: 220, top: 290 + stoneY + settle * 0.3, width: 640, height: 860, transform: `scale(${stoneScale})`, transformOrigin: "50% 100%" }}>
        <svg viewBox="0 0 640 860" width="640" height="860" style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))" }}>
          <defs>
            <linearGradient id="stoneG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={mix("#8D95AB", "#B7B1A4", dawn)} />
              <stop offset="1" stopColor={mix("#555D73", "#7C7569", dawn)} />
            </linearGradient>
          </defs>
          <path d="M0 860 L0 300 A320 300 0 0 1 640 300 L640 860 Z" fill="url(#stoneG)" />
          <path d="M26 860 L26 306 A294 274 0 0 1 614 306 L614 860 Z" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="6" />
          <path d="M470 60 l-30 80 l44 36 l-28 90" fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth="5" strokeLinecap="round" opacity={1 - dawn * 0.6} />
          <ellipse cx="70" cy="840" rx="70" ry="26" fill={mix("#2E5B3A", "#4F9A56", dawn)} />
          <ellipse cx="580" cy="844" rx="64" ry="22" fill={mix("#2E5B3A", "#4F9A56", dawn)} />
          <ellipse cx="520" cy="228" rx="46" ry="18" fill={mix("#2E5B3A", "#4F9A56", dawn)} opacity={0.8} />
        </svg>
        {/* texto */}
        <div style={{ position: "absolute", left: 40, right: 40, top: 150 }}>
          <div style={{ ...engraved, fontSize: 58, letterSpacing: 10 }}>AQUÍ YACE</div>
          <div style={{ ...engraved, fontSize: 168, letterSpacing: 4, marginTop: 4 }}>LUCAS</div>
          <div style={{ height: 6, background: "rgba(28,32,51,0.55)", margin: "20px 90px 26px", borderRadius: 3 }} />
          {/* epitafio antiguo */}
          <div style={{ position: "relative", height: 340 }}>
            <div style={{ opacity: oldOpacity * (1 - strike * 0.45) }}>
              <div style={{ ...engraved, fontSize: 60, letterSpacing: 2 }}>Abrió Chrome</div>
              <div style={{ ...engraved, fontSize: 158, letterSpacing: 2, marginTop: 2, color: "#3A1620" }}>14.600</div>
              <div style={{ ...engraved, fontSize: 60, letterSpacing: 2, marginTop: 4 }}>veces. A mano.</div>
            </div>
            {strike > 0 && (
              <div style={{ position: "absolute", left: 20, top: 150, height: 12, width: `${strike * 94}%`, background: C.red, borderRadius: 6, transform: "rotate(-3deg)", boxShadow: "0 0 16px rgba(255,77,77,0.7)", opacity: oldOpacity }} />
            )}
            {/* epitafio nuevo */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 40 }}>
              <div style={{ ...engraved, fontSize: 80, letterSpacing: 2, color: "#3B2A18", minHeight: 84 }}>{n1}</div>
              <div style={{ ...engraved, fontSize: 80, letterSpacing: 1, color: "#8A4A10", marginTop: 10, minHeight: 84 }}>{n2}</div>
            </div>
          </div>
        </div>
      </div>
      {/* tierra delantera */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, bottom: 0, background: `linear-gradient(180deg, ${mix("#0B1022", "#3D7A4A", dawn)}, ${mix("#070A16", "#2D5F3B", dawn)})` }} />
      {showMug && (
        <div style={{ position: "absolute", left: 770, top: 980 }}>
          <Mug t={t} hot={mugHot} scale={0.85} />
        </div>
      )}
      {/* flores del amanecer */}
      {dawn > 0.2 &&
        [140, 230, 860, 950].map((x, i) => (
          <div key={i} style={{ position: "absolute", left: x, top: 1060 + (i % 2) * 22, width: 34, height: 70, opacity: clamp01((dawn - 0.2) * 2) }}>
            <div style={{ position: "absolute", left: 15, top: 24, width: 5, height: 46, background: "#2F7A3E", borderRadius: 3 }} />
            <div style={{ position: "absolute", left: 0, top: 0, width: 34, height: 34, borderRadius: "50%", background: ["#FFB5C8", "#FFE066", "#FFFFFF", "#C9B5FF"][i], boxShadow: "inset 0 0 0 8px rgba(255,160,60,0.9)" }} />
          </div>
        ))}
    </AbsoluteFill>
  );
};

// ═════════════════════════ REBOBINADO (VHS) ═════════════════════════
export const Rewind: React.FC<{ t: number; from: number; to: number }> = ({ t, from, to }) => {
  const k = clamp01((t - from) / (to - from));
  const a = Math.sin(Math.PI * k);
  const fr = Math.floor(t * 60);
  const bars = Array.from({ length: 7 }, (_, i) => ({
    y: (rnd(fr * 3 + i) * H) | 0,
    h: 20 + rnd(fr + i * 9) * 120,
    dx: (rnd(fr * 5 + i) - 0.5) * 120,
    o: 0.18 + rnd(fr + i) * 0.3,
  }));
  return (
    <AbsoluteFill style={{ opacity: a, pointerEvents: "none", mixBlendMode: "screen" }}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(180deg, rgba(255,255,255,0.10) 0 3px, transparent 3px 7px)" }} />
      {bars.map((b, i) => (
        <div key={i} style={{ position: "absolute", left: b.dx, right: -b.dx, top: b.y, height: b.h, background: `rgba(255,255,255,${b.o})` }} />
      ))}
      <div style={{ position: "absolute", left: 60, top: 250, fontFamily: ANTON, fontSize: 120, color: "#fff", letterSpacing: 4, textShadow: "-6px 0 #ff2d55, 6px 0 #00e5ff" }}>◀◀ REBOBINAR</div>
      <div style={{ position: "absolute", left: 60, top: 400, fontFamily: INTER, fontWeight: 800, fontSize: 54, color: "#fff", textShadow: "-4px 0 #ff2d55, 4px 0 #00e5ff" }}>
        DÍA {Math.max(1, Math.round(lerp(14600, 1, easeInOut(k))))
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
      </div>
    </AbsoluteFill>
  );
};

// ═════════════════════════ MONTAJE: 14.600 mañanas ═════════════════════════
export const DAYS = [2, 3, 5, 9, 20, 50, 120, 365, 900, 2000, 4500, 9000, 14600];
export const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const Montage: React.FC<{ t: number; stepTimes: number[]; end: number }> = ({ t, stepTimes, end }) => {
  const idx = stepTimes.filter((s) => t >= s).length - 1; // paso actual (-1 = antes)
  const day = idx < 0 ? 1 : DAYS[Math.min(idx, DAYS.length - 1)];
  const since = idx < 0 ? 9 : t - stepTimes[idx];
  const squash = 1 - 0.14 * decay(t, stepTimes[Math.max(0, idx)] ?? 0, 0.06);
  const age = idx < 0 ? 0 : clamp01(Math.log(day) / Math.log(14600));
  const rot = (idx < 0 ? 0 : Math.pow(clamp01((t - stepTimes[0]) / (end - stepTimes[0])), 2.2)) * 3600;
  const last = day === 14600;
  const years = Math.floor(day / 365);
  const mugs = Math.max(0, idx + 1);
  const finalHit = last ? decay(t, stepTimes[stepTimes.length - 1], 0.18) : 0;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(900px 900px at 50% 40%, ${mix("#3A2A24", "#4A1F25", age)}, #0C0A12 75%)` }}>
      {/* reloj gigante que gira cada vez más rápido */}
      <svg viewBox="0 0 800 800" width="1000" height="1000" style={{ position: "absolute", left: 40, top: 250, opacity: 0.32 }}>
        <circle cx="400" cy="400" r="380" fill="none" stroke="#FFD9A8" strokeWidth="10" />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="400" y1="40" x2="400" y2="86" stroke="#FFD9A8" strokeWidth="10" strokeLinecap="round" transform={`rotate(${i * 30} 400 400)`} />
        ))}
        <line x1="400" y1="400" x2="400" y2="120" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" transform={`rotate(${rot} 400 400)`} />
        <line x1="400" y1="400" x2="400" y2="210" stroke="#FFB347" strokeWidth="18" strokeLinecap="round" transform={`rotate(${rot / 12} 400 400)`} />
      </svg>
      {/* hoja del calendario */}
      <div style={{ position: "absolute", left: 270, top: 190, width: 540, height: 560, transform: `scale(${1.0 + finalHit * 0.08}, ${squash * (1 + finalHit * 0.08)}) rotate(${last ? Math.sin(t * 70) * 1.2 * decay(t, stepTimes[stepTimes.length - 1], 0.5) : 0}deg)`, transformOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: "#FFF8EC", boxShadow: "0 30px 60px rgba(0,0,0,0.55)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 100, borderRadius: "26px 26px 0 0", background: last ? C.red : "#E8453C", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANTON, fontSize: 62, letterSpacing: 8, color: "#fff" }}>
          DÍA
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 112, textAlign: "center", fontFamily: ANTON, fontSize: day > 999 ? 160 : 220, color: last ? "#B3201A" : "#1D2133", lineHeight: 1.05 }}>{fmt(day)}</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 390, textAlign: "center", fontFamily: ANTON, fontSize: 64, color: "#6B6F85", letterSpacing: 4 }}>
          {years < 1 ? "LUNES…" : `AÑO ${years}`}
        </div>
      </div>
      {/* torre de tazas frías */}
      <div style={{ position: "absolute", left: 860, bottom: 600, width: 200 }}>
        {Array.from({ length: mugs }, (_, i) => {
          const born = stepTimes[i];
          const pop = easeBack(clamp01((t - born) / 0.25));
          return (
            <div key={i} style={{ position: "absolute", left: (i % 2 ? 8 : -6) + Math.sin(t * 3 + i) * (i * 0.6), bottom: i * 58, transform: `scale(${pop})`, transformOrigin: "50% 100%" }}>
              <Mug t={t} hot={0} scale={0.42} />
            </div>
          );
        })}
      </div>
      {/* Lucas envejeciendo */}
      <div style={{ position: "absolute", left: 290, top: 1340 - 560 * 0.9, transform: `translateY(${Math.sin(t * 2) * 4}px)` }}>
        <Person who="lucas" scale={0.9} age={age} lid={0.45 + age * 0.15} sad={1} curve={-0.9} look={{ x: 0, y: -0.3 }} browTilt={14} sweat={0} bob={Math.sin(t * 2) * 3} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(closest-side at 50% 50%, transparent 55%, rgba(0,0,0,0.6))" }} />
    </AbsoluteFill>
  );
};
