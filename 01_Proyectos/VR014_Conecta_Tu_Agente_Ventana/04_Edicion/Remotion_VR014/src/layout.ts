// Composición por orientación: la misma historia, distinta colocación.
export type Rect = { x: number; y: number; w: number; h: number };
export type Layout = {
  W: number;
  H: number;
  vertical: boolean;
  u: number; // escala de detalles (bordes, sombras, tamaños de iconos)
  mon: [Rect, Rect]; // pantalla principal y secundaria (marco exterior)
  c: { x: number; y: number }; // centro del escenario
  cap: { y: number; size: number; maxW: number; perLine: number };
};

export const makeLayout = (W: number, H: number): Layout =>
  H > W
    ? {
        W, H, vertical: true, u: 1.05,
        mon: [
          { x: 70, y: 250, w: 940, h: 529 },
          { x: 230, y: 868, w: 620, h: 349 },
        ],
        c: { x: 540, y: 740 },
        cap: { y: 1440, size: 78, maxW: 1040, perLine: 22 },
      }
    : {
        W, H, vertical: false, u: 1,
        mon: [
          { x: 170, y: 70, w: 1010, h: 568 },
          { x: 1240, y: 170, w: 540, h: 304 },
        ],
        c: { x: 960, y: 400 },
        cap: { y: 940, size: 68, maxW: 1640, perLine: 34 },
      };

export const BEZEL = 11;
/** zona útil (pantalla) dentro del marco del monitor */
export const screenOf = (m: Rect, u: number): Rect => ({ x: m.x + BEZEL * u, y: m.y + BEZEL * u, w: m.w - 2 * BEZEL * u, h: m.h - 2 * BEZEL * u });
/** rectángulo fraccional (0..1) de una pantalla → píxeles del fotograma, con hueco entre ventanas */
export const place = (L: Layout, mon: 0 | 1, f: Rect, gap = 7): Rect => {
  const s = screenOf(L.mon[mon], L.u);
  return { x: s.x + f.x * s.w + gap, y: s.y + f.y * s.h + gap, w: f.w * s.w - 2 * gap, h: f.h * s.h - 2 * gap };
};
export const lerpRect = (a: Rect, b: Rect, k: number): Rect => ({
  x: a.x + (b.x - a.x) * k,
  y: a.y + (b.y - a.y) * k,
  w: a.w + (b.w - a.w) * k,
  h: a.h + (b.h - a.h) * k,
});
export const centerOf = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
