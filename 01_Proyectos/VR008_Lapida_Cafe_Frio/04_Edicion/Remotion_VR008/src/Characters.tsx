import React from "react";
import { C, clamp01, lerp, mix } from "./theme";

// ───────────────────────── Persona (busto, estilo plano) ─────────────────────────
export type PersonProps = {
  who: "lucas" | "sofia";
  look?: { x: number; y: number }; // -1..1
  lid?: number; // 0 abiertos .. 1 cerrados (cansancio / parpadeo)
  browTilt?: number; // grados: + = preocupado (extremo interno arriba), - = enfadado/escéptico
  browLift?: number; // px
  curve?: number; // -1 ceño .. 1 sonrisa
  open?: number; // 0..1 boca abierta
  skew?: number; // -1..1 sonrisa ladeada
  age?: number; // 0..1 pelo blanco, barba y arrugas
  sweat?: number; // 0..1
  bob?: number; // px de respiración
  scale?: number;
  sad?: number; // 0..1 ojeras
};

export const Person: React.FC<PersonProps> = ({
  who, look = { x: 0, y: 0 }, lid = 0.15, browTilt = 0, browLift = 0, curve = 0.2, open = 0, skew = 0,
  age = 0, sweat = 0, bob = 0, scale = 1, sad = 0,
}) => {
  const lucas = who === "lucas";
  const skin = lucas ? C.skinL : C.skinS;
  const hair = lucas ? mix(C.hairL, "#E9E9F0", age) : C.hairS;
  const shirt = lucas ? C.hoodie : C.jacket;
  const ex = 213, ex2 = 307, ey = 262;
  const px = look.x * 11, py = look.y * 10;
  const y0 = 352;
  const yc = y0 + curve * 34;
  const mouthD = `M ${212 + skew * -6} ${y0 - skew * 10} Q 260 ${yc} ${308} ${y0 + skew * 10} Q 260 ${yc + open * 95 + 2} ${212 + skew * -6} ${y0 - skew * 10} Z`;
  const jawDrop = open * 22;
  const lidH = lerp(0, 66, clamp01(lid));
  return (
    <svg viewBox="0 0 520 560" width={520 * scale} height={560 * scale} style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${bob})`}>
        {/* pelo trasero (Sofía) */}
        {!lucas && <path d="M122 250 C100 90 420 90 398 250 L424 470 C340 520 180 520 96 470 Z" fill={hair} />}
        {/* cuerpo */}
        <path d={`M-10 570 C0 470 80 440 160 428 L360 428 C440 440 520 470 530 570 Z`} fill={shirt} />
        {lucas ? (
          <>
            <ellipse cx="260" cy="440" rx="112" ry="40" fill={mix(shirt, "#000000", 0.18)} />
            <rect x="228" y="452" width="7" height="70" rx="3" fill="#E6E9F5" />
            <rect x="285" y="452" width="7" height="70" rx="3" fill="#E6E9F5" />
          </>
        ) : (
          <>
            <path d="M160 428 L260 520 L360 428 L330 420 L260 480 L190 420 Z" fill={mix(shirt, "#000000", 0.2)} />
            <path d="M200 428 L260 500 L320 428 Z" fill="#FFF4E6" />
            <circle cx="398" cy="466" r="9" fill="#FFE08A" />
          </>
        )}
        {/* cuello */}
        <rect x="222" y="372" width="76" height="70" rx="30" fill={mix(skin, "#000000", 0.12)} />
        {/* orejas */}
        <ellipse cx="143" cy="270" rx="20" ry="30" fill={skin} />
        <ellipse cx="377" cy="270" rx="20" ry="30" fill={skin} />
        {!lucas && <circle cx="144" cy="304" r="7" fill="#FFD36B" />}
        {/* cabeza */}
        <ellipse cx="260" cy="258" rx="120" ry="136" fill={skin} />
        <ellipse cx="190" cy="312" rx="22" ry="13" fill="#FF7A7A" opacity={0.18} />
        <ellipse cx="330" cy="312" rx="22" ry="13" fill="#FF7A7A" opacity={0.18} />
        {/* barba (edad) */}
        {lucas && (
          <path
            d="M146 292 C150 400 200 442 260 444 C320 442 370 400 374 292 C350 372 300 388 260 388 C220 388 170 372 146 292 Z"
            fill={mix("#3A3140", "#EDEDF3", age)}
            opacity={clamp01(age * 1.4)}
          />
        )}
        {/* arrugas */}
        <g stroke={mix(skin, "#000000", 0.35)} strokeWidth="4" strokeLinecap="round" fill="none" opacity={age * 0.75}>
          <path d="M200 196 Q260 184 320 196" />
          <path d="M210 212 Q260 202 310 212" />
          <path d="M175 330 Q182 346 192 352" />
          <path d="M345 330 Q338 346 328 352" />
        </g>
        {/* ojos */}
        {[ex, ex2].map((x, i) => (
          <g key={i}>
            <clipPath id={`eye-${who}-${i}`}>
              <ellipse cx={x} cy={ey} rx="31" ry="35" />
            </clipPath>
            <ellipse cx={x} cy={ey} rx="31" ry="35" fill="#FFFFFF" />
            <g clipPath={`url(#eye-${who}-${i})`}>
              <circle cx={x + px} cy={ey + py} r="14" fill="#2A2233" />
              <circle cx={x + px - 4} cy={ey + py - 5} r="4.5" fill="#FFFFFF" />
              <rect x={x - 34} y={ey - 38} width="68" height={lidH + 4} fill={skin} />
              <rect x={x - 34} y={ey - 38 + lidH} width="68" height="3.5" fill={mix(skin, "#000000", 0.4)} />
            </g>
          </g>
        ))}
        {/* ojeras */}
        <g opacity={sad * 0.5} fill="none" stroke="#6E5A8A" strokeWidth="6" strokeLinecap="round">
          <path d={`M${ex - 26} ${ey + 44} Q${ex} ${ey + 54} ${ex + 26} ${ey + 44}`} />
          <path d={`M${ex2 - 26} ${ey + 44} Q${ex2} ${ey + 54} ${ex2 + 26} ${ey + 44}`} />
        </g>
        {/* cejas */}
        <g stroke={hair} strokeWidth="13" strokeLinecap="round" fill="none">
          <path d="M184 213 L236 213" transform={`translate(0 ${-browLift}) rotate(${-browTilt} 236 213)`} />
          <path d="M284 213 L336 213" transform={`translate(0 ${-browLift}) rotate(${browTilt} 284 213)`} />
        </g>
        {/* nariz */}
        <path d="M252 292 Q262 318 276 306" stroke={mix(skin, "#000000", 0.3)} strokeWidth="6" strokeLinecap="round" fill="none" />
        {/* boca */}
        <g transform={`translate(0 ${jawDrop * 0.3})`}>
          <path d={mouthD} fill={open > 0.04 ? "#5A1F2B" : "none"} stroke="#3A1F26" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
          {open > 0.3 && <ellipse cx="260" cy={yc + open * 62} rx={28 * open} ry={12 * open} fill="#E46A78" />}
        </g>
        {/* sudor */}
        <g opacity={sweat}>
          <path d="M380 190 q-12 24 0 34 q12 -10 0 -34 z" fill="#9AD8FF" />
          <path d="M150 170 q-9 18 0 26 q9 -8 0 -26 z" fill="#9AD8FF" />
        </g>
        {/* pelo delantero */}
        {lucas ? (
          <g fill={hair}>
            <path d="M134 250 C120 110 230 70 272 88 C350 78 404 140 386 250 C372 186 330 160 262 160 C198 160 152 188 134 250 Z" />
            <path d="M214 98 L196 52 L248 86 Z" />
            <path d="M268 88 L284 36 L316 94 Z" />
            <path d="M330 104 L372 66 L372 126 Z" />
          </g>
        ) : (
          <g fill={hair}>
            <path d="M136 244 C132 108 388 100 384 244 C340 176 262 196 196 150 C172 182 150 214 136 244 Z" />
            <circle cx="338" cy="84" r="44" />
            <circle cx="338" cy="84" r="20" fill={mix(hair, "#000000", 0.25)} />
          </g>
        )}
      </g>
    </svg>
  );
};

// ───────────────────────── Taza de café ─────────────────────────
export const Mug: React.FC<{ t: number; hot: number; scale?: number; tilt?: number }> = ({ t, hot, scale = 1, tilt = 0 }) => {
  const frost = clamp01(1 - hot * 1.4);
  const body = mix("#F5EFE6", "#B7D5EC", frost);
  const coffee = mix("#5A3622", "#8A93A0", frost);
  const steam = (i: number) => {
    const pts: string[] = [];
    for (let k = 0; k <= 16; k++) {
      const y = 80 - k * 8;
      const x = 62 + i * 36 + Math.sin(k * 0.55 - t * 3.1 + i * 1.7) * (4 + k * 0.9);
      pts.push(`${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };
  return (
    <svg viewBox="0 -60 220 330" width={220 * scale} height={330 * scale} style={{ overflow: "visible", transform: `rotate(${tilt}deg)` }}>
      {[0, 1, 2].map((i) => (
        <path key={i} d={steam(i)} fill="none" stroke="#FFFFFF" strokeWidth={9 - i} strokeLinecap="round" opacity={clamp01(hot) * (0.55 - i * 0.08) * (0.7 + 0.3 * Math.sin(t * 2 + i))} />
      ))}
      <path d="M160 128 C214 120 214 206 156 206" fill="none" stroke={body} strokeWidth="20" strokeLinecap="round" />
      <rect x="30" y="92" width="136" height="150" rx="22" fill={body} />
      <rect x="30" y="92" width="136" height="150" rx="22" fill="none" stroke="#00000018" strokeWidth="3" />
      <ellipse cx="98" cy="96" rx="68" ry="15" fill={mix("#E9E1D3", "#9FC2DC", frost)} />
      <ellipse cx="98" cy="98" rx="58" ry="10" fill={coffee} />
      <ellipse cx="80" cy="95" rx="16" ry="3" fill="#FFFFFF" opacity={0.22 * hot} />
      {/* caritas / logo de taza */}
      <path d="M58 150 h80" stroke="#00000014" strokeWidth="10" strokeLinecap="round" />
      {/* cristales de hielo cuando está frío */}
      <g opacity={clamp01((frost - 0.35) * 2)} fill="#FFFFFF">
        <path d="M70 94 l5 -9 l5 9 l-5 5 z" />
        <path d="M108 100 l4 -7 l4 7 l-4 4 z" />
        <path d="M130 92 l5 -9 l5 9 l-5 5 z" />
      </g>
    </svg>
  );
};
