// Línea de tiempo DERIVADA de la locución: la animación sigue a la voz, no al revés.
// Cada bloque de voz (voNN.wav) empieza en S[n]; los golpes de imagen y sonido salen de las palabras (Whisper).
import voz from "./voz.json";
import cfg from "../edit.config.json";

type Word = { w: string; s: number; e: number };
type Take = { n: number; dur: number; words: Word[] };
const takes = voz as Take[];
const take = (n: number) => {
  const t = takes.find((x) => x.n === n);
  if (!t) throw new Error("falta la toma " + n);
  return t;
};
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase();

/** índice de la palabra `nth` que encaja con alguno de los patrones */
export const wi = (n: number, pats: (string | RegExp)[], nth = 0) => {
  const ws = take(n).words;
  let c = 0;
  for (let i = 0; i < ws.length; i++) {
    const w = norm(ws[i].w);
    if (pats.some((p) => (typeof p === "string" ? w === p : p.test(w)))) {
      if (c === nth) return i;
      c++;
    }
  }
  throw new Error(`no encuentro ${pats.join("|")} en la toma ${n}: ${ws.map((x) => x.w).join(" ")}`);
};

const G = cfg.gaps;
export const S: Record<number, number> = {};
const end = (n: number) => S[n] + take(n).dur;

S[1] = cfg.start;
export const I1 = { esta: wi(1, ["esta"]), lucas: wi(1, ["lucas"]), y: wi(1, ["y"]) };
const rewindStart = end(1) + G.rewindAfterVo;
const cut1 = rewindStart + 0.45;
const rewindEnd = rewindStart + 0.95;
S[2] = rewindStart + G.deskVo;
S[3] = end(2) + G.beforeMontage;
const montageStart = S[3] - 0.15;

/** tiempo absoluto del inicio / final de una palabra de un bloque */
export const ws = (n: number, i: number) => S[n] + take(n).words[i].s;
export const we = (n: number, i: number) => S[n] + take(n).words[i].e;

// ── bloque 2: «Lunes, nueve en punto. Abre el editor, la terminal, el navegador. Y cuando por fin… el café ya está frío.»
const i2 = {
  lunes: wi(2, ["lunes"]),
  nueve: wi(2, ["9", "nueve"]),
  punto: wi(2, ["punto"]),
  abre: wi(2, ["abre"]),
  editor: wi(2, ["editor"]),
  terminal: wi(2, ["terminal"]),
  navegador: wi(2, ["navegador"]),
  y: wi(2, ["y"]),
  fin: wi(2, ["fin"]),
  trabajar: wi(2, ["trabajar"]),
  cafe: wi(2, ["cafe"]),
  frio: wi(2, ["frio"]),
};
export const I2 = i2;
const plopEditor = ws(2, i2.editor) - 0.05;
const plopTerminal = ws(2, i2.terminal) - 0.05;
const plopBrowser = ws(2, i2.navegador) - 0.05;
const relief = Math.max(ws(2, i2.fin), plopBrowser + 1.15);
const cold = ws(2, i2.frio);

// ── bloque 3: «Mañana, lo mismo. Catorce mil seiscientas veces.»
export const I3 = {
  manana: wi(3, ["manana"]),
  lo: wi(3, ["lo"]),
  mismo: wi(3, ["mismo"]),
  catorce: wi(3, [/^(14|catorce)/]),
  seis: wi(3, [/^(600|seiscientas|seiscientos)/]),
  veces: wi(3, ["veces"]),
};
const m0 = ws(3, I3.manana);
const lomismoEnd = we(3, I3.mismo);
const slam = ws(3, I3.seis);
// 4 pasos mientras dice «Mañana»; 8 pasos cada vez más rápidos hasta «seiscientas»; el último es el golpe
const slow = [m0 + 0.1, m0 + 0.36, m0 + 0.6, m0 + 0.8];
const fastFrom = Math.max(slow[3] + 0.3, lomismoEnd + 0.05);
const fastN = 8;
const fast = Array.from({ length: fastN }, (_, k) => fastFrom + (slam - fastFrom - 0.12) * (1 - Math.pow(1 - (k + 1) / (fastN + 1), 1.7)));
const montageSteps = [...slow, ...fast, slam];
const montageEnd = Math.max(end(3) + 0.15, slam + 1.0);

// ── bloque 4: «Hasta que Sofía se sienta a su lado. Un botón.»
const sofiaStart = montageEnd;
S[4] = sofiaStart + 0.2;
export const I4 = { hasta: wi(4, ["hasta"]), lado: wi(4, ["lado"]), un: wi(4, ["un"]), boton: wi(4, ["boton"]) };
const swapEnd = sofiaStart + 0.65;
const clip0 = Math.max(swapEnd + 0.1, ws(4, I4.un) - 0.45);
const zoomIn = clip0 + 0.9;
const click = clip0 + 2.23;
const drop = clip0 + 2.38;
const clipDone = drop + 0.83;

// ── bloque 5: «Tres segundos.»
S[5] = drop + 0.12;
const sofiaEnd = Math.max(end(5) + 0.9, clipDone + 1.0);

// ── bloque 6: «Esta es la lápida de Lucas. Ahora.»
S[6] = sofiaEnd + 0.3;
export const I6 = { esta: wi(6, ["esta"]), lucas: wi(6, ["lucas"]), ahora: wi(6, ["ahora"]) };
const total = end(6) + 1.4;

export const T = {
  rewindStart, cut1, rewindEnd, plopEditor, plopTerminal, plopBrowser, relief, cold,
  montageStart, montageSteps, montageEnd, sofiaStart, swapEnd, clip0, zoomIn, click, drop, clipDone, sofiaEnd, total,
};
export const take_ = take;
export const voDur = (n: number) => take(n).dur;
