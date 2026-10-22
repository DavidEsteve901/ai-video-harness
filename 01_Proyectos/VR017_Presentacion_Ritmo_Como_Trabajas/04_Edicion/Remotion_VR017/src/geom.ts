export type Rect = { x: number; y: number; w: number; h: number };
export const lerpRect = (a: Rect, b: Rect, k: number): Rect => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, w: a.w + (b.w - a.w) * k, h: a.h + (b.h - a.h) * k });
/** rectángulo fraccional (0..1) dentro de una pantalla → px del fotograma, con hueco entre ventanas */
export const inside = (s: Rect, f: Rect, gap = 6): Rect => ({ x: s.x + f.x * s.w + gap, y: s.y + f.y * s.h + gap, w: f.w * s.w - 2 * gap, h: f.h * s.h - 2 * gap });
