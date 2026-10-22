// ─────────────────────────────────────────────────────────────────────────────
// VR017 · REJILLA DE PULSOS — fuente única del ritmo de todo el vídeo.
// Escenas, efectos de sonido y la música sintetizada (scripts/sintetizar_audio.py lee el bloque JSON
// de abajo) se calculan desde aquí. Para re-sincronizar con otra pista basta con cambiar BPM/offset
// (o dar la lista de golpes detectados: src/ritmo_loser.json) y, si se quiere, los compases por sección.
// ─────────────────────────────────────────────────────────────────────────────
// RITMO-INICIO (JSON: lo lee Python; no añadir comentarios dentro)
export const RITMO = {
  "bpm": 100,
  "offset": 0.1,
  "pulsosPorCompas": 4,
  "cola": 2.2,
  "secciones": [
    ["intro", 4],
    ["subidaA", 4],
    ["subidaB", 4],
    ["corte", 1],
    ["drop", 8],
    ["final", 3]
  ]
} as const;
// RITMO-FIN

import loser from "./ritmo_loser.json";

export type Seccion = (typeof RITMO.secciones)[number][0];
export type Rejilla = {
  id: string;
  bpm: number;
  offset: number; // s: instante del primer golpe (pulso 0)
  golpes?: number[]; // s: golpes reales detectados (si existen, mandan sobre bpm/offset)
  cola: number; // s tras el último compás
  audio: string; // ruta en public/
  volumen: number;
};

export const PROPIA: Rejilla = { id: "propia", bpm: RITMO.bpm, offset: RITMO.offset, cola: RITMO.cola, audio: "audio/musica.wav", volumen: 1 };
type LoserJson = { disponible: boolean; bpm?: number; offset?: number; golpes?: number[]; cola?: number; audio?: string; volumen?: number };
const L = loser as LoserJson;
export const LOSER: Rejilla | null = L.disponible
  ? { id: "loser", bpm: L.bpm!, offset: L.offset!, golpes: L.golpes, cola: L.cola ?? RITMO.cola, audio: L.audio ?? "audio/musica_loser.wav", volumen: L.volumen ?? 1 }
  : null;

let R: Rejilla = PROPIA;
export const setRejilla = (r: Rejilla) => {
  R = r;
};
export const rejilla = () => R;

const PPC = RITMO.pulsosPorCompas;
const periodo = () => 60 / R.bpm;

/** instante (s) del pulso b (admite fracciones: 0.5 = corchea) */
export const beat = (b: number): number => {
  const g = R.golpes;
  if (!g || g.length < 2) return R.offset + b * periodo();
  const i = Math.floor(b);
  const f = b - i;
  const at = (k: number) => {
    if (k < 0) return g[0] + k * (g[1] - g[0]);
    if (k >= g.length) return g[g.length - 1] + (k - g.length + 1) * (g[g.length - 1] - g[g.length - 2]);
    return g[k];
  };
  return at(i) + f * (at(i + 1) - at(i));
};
/** pulso fraccionario en el instante t (inverso de beat) */
export const beatAt = (t: number): number => {
  const g = R.golpes;
  if (!g || g.length < 2) return (t - R.offset) / periodo();
  if (t < g[0]) return (t - g[0]) / (g[1] - g[0]);
  let lo = 0, hi = g.length - 1;
  if (t >= g[hi]) return hi + (t - g[hi]) / (g[hi] - g[hi - 1]);
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (g[m] <= t) lo = m; else hi = m;
  }
  return lo + (t - g[lo]) / (g[lo + 1] - g[lo]);
};

const INICIO: Record<string, number> = {};
let acc = 0;
for (const [n, c] of RITMO.secciones) {
  INICIO[n] = acc;
  acc += c;
}
export const TOTAL_COMPASES = acc;
export const compasesDe = (s: Seccion) => RITMO.secciones.find(([n]) => n === s)![1];
export const inicioDe = (s: Seccion) => INICIO[s];

/** instante del pulso `p` (0..3, admite fracción) del compás `c` (0-based) de la sección `s` */
export const at = (s: Seccion, c = 0, p = 0) => beat((INICIO[s] + c) * PPC + p);
/** compás global (0-based) + pulso */
export const bar = (c: number, p = 0) => beat(c * PPC + p);
export const duracionTotal = () => bar(TOTAL_COMPASES) + R.cola;

/** segundos desde el último pulso (o subdivisión) y su índice */
export const sinceBeat = (t: number, sub = 1) => {
  const b = beatAt(t) * sub;
  const i = Math.floor(b);
  return { i, d: t - beat(i / sub) };
};
/** golpe que decae (1 en el pulso → 0) para «latir» con la música */
export const pulse = (t: number, dec = 9, sub = 1, desde = 0, hasta = 1e9) => {
  if (t < desde || t > hasta) return 0;
  const { d } = sinceBeat(t, sub);
  return d >= 0 ? Math.exp(-d * dec) : 0;
};
