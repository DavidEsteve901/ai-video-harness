import { Easing } from "remotion";

export const W = 1080;
export const H = 1920;
export const ANTON = "Anton, Impact, sans-serif";
export const INTER = "Inter, system-ui, sans-serif";

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeBack = Easing.bezier(0.34, 1.56, 0.64, 1);
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** progreso 0..1 entre dos instantes con una curva */
export const prog = (t: number, from: number, to: number, ease: (x: number) => number = easeOut) =>
  ease(clamp01((t - from) / Math.max(1e-6, to - from)));
export const decay = (t: number, from: number, tau: number) => (t < from ? 0 : Math.exp(-(t - from) / tau));
/** ruido determinista barato */
export const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const mix = (a: string, b: string, k: number) => {
  const A = hex(a), B = hex(b), c = clamp01(k);
  return `rgb(${Math.round(lerp(A[0], B[0], c))},${Math.round(lerp(A[1], B[1], c))},${Math.round(lerp(A[2], B[2], c))})`;
};

export const C = {
  night: "#0A0E1F",
  nightMid: "#1B2142",
  dawnA: "#FFB36B",
  dawnB: "#FFE3A6",
  ink: "#1A1D2B",
  stone: "#7A8296",
  stoneDark: "#4B5266",
  amber: "#FFB347",
  amberHot: "#FF8A2B",
  coldBlue: "#7CC4FF",
  green: "#22C55E",
  skinL: "#F3C9A4",
  skinS: "#E9B48E",
  hoodie: "#58648A",
  jacket: "#FF8A3D",
  hairL: "#2B2233",
  hairS: "#A8401F",
  red: "#FF4D4D",
};
