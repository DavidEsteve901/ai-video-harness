import { Easing, random } from "remotion";

// ───────── colores con significado (FMT-004) ─────────
export const C = {
  bg: "#07090F",
  ink: "#F3F1EA",
  dim: "#8A90A2",
  coral: "#FF5A5F", // problema
  amber: "#FFB547", // memoria / IA
  ai: "#F2C14E", // ámbar de la IA en la app (--osd-ai)
  cyan: "#4FD1FF", // control / zonas
  accent: "#00D2FF", // acento de la app
  green: "#00E676", // listo (botón «Lanzar»)
  violet: "#9B8CFF",
  win: "#121724",
  win2: "#0E121C",
};
export const FONT = "InterX, Inter, 'Segoe UI', sans-serif";
export const UI_FONT = "Jakarta, 'Plus Jakarta Sans', 'Segoe UI', sans-serif";

// ───────── curvas ─────────
export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
};
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const prog = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
/** curva 0→1 que empieza en `a` y dura `d` */
export const E = (t: number, a: number, d = 0.4, f = ease.out) => f(prog(t, a, a + d));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** visible entre a y b con fundidos */
export const win = (t: number, a: number, b: number, fi = 0.12, fo = 0.12) => clamp01((t - a) / fi) * (1 - clamp01((t - b) / fo));
/** resorte amortiguado analítico (0→1, con rebote) */
export const spr = (t: number, a: number, freq = 2.2, damp = 7) => {
  const x = t - a;
  if (x <= 0) return 0;
  return 1 - Math.exp(-damp * x) * Math.cos(2 * Math.PI * freq * x);
};
export const rnd = (seed: string | number) => random(seed);

// ───────── composición por orientación ─────────
export type Layout = { W: number; H: number; V: boolean; u: number; cx: number; cy: number; title: number; card: { cx: number; cy: number; w: number; h: number } };
export const makeLayout = (W: number, H: number): Layout =>
  H > W
    ? { W, H, V: true, u: 1, cx: W / 2, cy: H / 2, title: 470, card: { cx: 540, cy: 1110, w: 1000, h: 1100 } }
    : { W, H, V: false, u: 1, cx: W / 2, cy: H / 2, title: 150, card: { cx: 960, cy: 625, w: 1500, h: 760 } };
