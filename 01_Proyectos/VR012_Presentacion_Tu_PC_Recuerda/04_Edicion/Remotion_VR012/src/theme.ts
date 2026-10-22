import { Easing, random } from "remotion";
import voz from "./voz.json";
import vozEn from "./voz_en.json";

// ───────── colores con significado (mismos que la guía de animación de la app) ─────────
export const C = {
  bg: "#07090F",
  ink: "#F3F1EA",
  dim: "#8A90A2",
  faint: "rgba(243,241,234,0.08)",
  coral: "#FF5A5F", // problema
  amber: "#FFB547", // memoria / IA
  cyan: "#4FD1FF", // control (zonas)
  green: "#00E676", // listo
  violet: "#9B8CFF",
  pink: "#FF7AB6",
  win: "#121724",
  win2: "#0E121C",
};
export type Tono = "coral" | "amber" | "cyan" | "green";

export const FONT = "InterX, Inter, 'Segoe UI', sans-serif";

// ───────── curvas ─────────
export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
  backSoft: Easing.bezier(0.3, 1.35, 0.6, 1),
};
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const prog = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const E = (t: number, a: number, d = 0.5, f = ease.out) => f(prog(t, a, a + d));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const win = (t: number, a: number, b: number, fi = 0.25, fo = 0.25) => clamp01((t - a) / fi) * (1 - clamp01((t - b) / fo));
/** resorte amortiguado analítico (0→1, con rebote) */
export const spr = (t: number, a: number, freq = 2.2, damp = 7) => {
  const x = t - a;
  if (x <= 0) return 0;
  return 1 - Math.exp(-damp * x) * Math.cos(2 * Math.PI * freq * x);
};
export const rnd = (seed: string | number) => random(seed);

// ───────── idioma y tiempos de la locución ─────────
type Palabra = { w: string; s: number; e: number };
type Toma = { id: string; inicio: number; fin: number; palabras: Palabra[] };
type Voz = { duracion: number; tomas: Toma[] };
export type Lang = "es" | "en";
export const VOCES: Record<Lang, Voz> = { es: voz as Voz, en: vozEn as Voz };
// Las animaciones se anclan a palabras del guion español; en inglés cada ancla apunta a su palabra equivalente.
const ANCLAS_EN: Record<string, Record<string, string>> = {
  t02: { enciendes: "on", olvida: "forgets" },
  t03: { programas: "programs", "pestañas": "tabs", ventana: "window", pantalla: "screen" },
  t04: { reconstruirlo: "rebuild", todos: "every" },
  t05: { escritorio: "desktop", memoria: "memory" },
  t06: { montas: "set", "pestañas": "tabs", proyectos: "projects", cada: "everything", sitio: "place" },
  t07: { clic: "click", vuelve: "comes", tal: "exactly" },
  t08: { programar: "coding", estudiar: "studying", crear: "creating", saltas: "jump", sin: "without", hilo: "thread" },
  t09: { encajan: "snap", solas: "own", zona: "zones", y: "and", voz: "voice" },
  t10: { trabajar: "working", colocar: "arranging" },
  t11: { ahora: "now", ordenador: "computer", recuerda: "remembers", trabajas: "work" },
};
export let LANG: Lang = "es";
export let VOZ: Voz = VOCES.es;
export const toma = (id: string) => VOZ.tomas.find((t) => t.id === id)!;
const n = (s: string) => s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "");
const ancla = (id: string, palabra: string) => (LANG === "en" ? ANCLAS_EN[id]?.[palabra] ?? palabra : palabra);
/** instante en que empieza la palabra `palabra` (n-ésima aparición) dentro de la toma */
export const at = (id: string, palabra: string, nth = 0) => {
  const ps = toma(id).palabras.filter((p) => n(p.w) === n(ancla(id, palabra)));
  if (!ps[nth]) throw new Error(`No encuentro «${ancla(id, palabra)}» en ${id} (${LANG})`);
  return ps[nth].s;
};
export const atEnd = (id: string, palabra: string, nth = 0) => {
  const ps = toma(id).palabras.filter((p) => n(p.w) === n(ancla(id, palabra)));
  if (!ps[nth]) throw new Error(`No encuentro «${ancla(id, palabra)}» en ${id} (${LANG})`);
  return ps[nth].e;
};
/** inicio de cada escena = inicio de su toma (con un pequeño adelanto visual) */
const calcEsc = () => {
  const ids = VOZ.tomas.map((t) => t.id);
  const ini = ids.map((id, i) => (i === 0 ? 0 : toma(id).inicio - 0.12));
  return Object.fromEntries(ids.map((id, i) => [id, { a: ini[i], b: i + 1 < ids.length ? ini[i + 1] : VOZ.duracion }])) as Record<
    string,
    { a: number; b: number }
  >;
};
export let ESC = calcEsc();
/** Cambia el idioma activo (lo llama la composición antes de dibujar cada fotograma) */
export const setLang = (l: Lang) => {
  if (l === LANG) return;
  LANG = l;
  VOZ = VOCES[l];
  ESC = calcEsc();
};
