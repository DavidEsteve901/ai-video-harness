import { Rect } from "./layout";

// Ventanas abstractas: metáforas de programas, no capturas de ninguna interfaz.
export type Kind = "code" | "browser" | "notes" | "terminal" | "music" | "chat" | "design" | "reader";
export const ACCENT: Record<Kind, string> = {
  code: "#7C8CFF",
  browser: "#5AB0FF",
  notes: "#C9A7FF",
  terminal: "#9AA4B8",
  music: "#FF7AB6",
  chat: "#6EE7D8",
  design: "#FF9F6E",
  reader: "#E9E6DD",
};

export type Slot = { id: string; kind: Kind; mon: 0 | 1; f: Rect };

/** El espacio «de siempre»: el que se monta, se guarda y vuelve */
export const BASE: Slot[] = [
  { id: "w1", kind: "code", mon: 0, f: { x: 0, y: 0, w: 0.62, h: 1 } },
  { id: "w2", kind: "browser", mon: 0, f: { x: 0.62, y: 0, w: 0.38, h: 0.56 } },
  { id: "w3", kind: "terminal", mon: 0, f: { x: 0.62, y: 0.56, w: 0.38, h: 0.44 } },
  { id: "w4", kind: "notes", mon: 1, f: { x: 0, y: 0, w: 0.5, h: 1 } },
  { id: "w5", kind: "music", mon: 1, f: { x: 0.5, y: 0, w: 0.5, h: 0.5 } },
  { id: "w6", kind: "chat", mon: 1, f: { x: 0.5, y: 0.5, w: 0.5, h: 0.5 } },
];

export const PROGRAMAR: Slot[] = [
  { id: "p1", kind: "code", mon: 0, f: { x: 0, y: 0, w: 0.66, h: 1 } },
  { id: "p2", kind: "browser", mon: 0, f: { x: 0.66, y: 0, w: 0.34, h: 0.5 } },
  { id: "p3", kind: "terminal", mon: 0, f: { x: 0.66, y: 0.5, w: 0.34, h: 0.5 } },
  { id: "p4", kind: "reader", mon: 1, f: { x: 0, y: 0, w: 1, h: 1 } },
];
export const ESTUDIAR: Slot[] = [
  { id: "e1", kind: "notes", mon: 0, f: { x: 0, y: 0, w: 0.5, h: 1 } },
  { id: "e2", kind: "reader", mon: 0, f: { x: 0.5, y: 0, w: 0.5, h: 1 } },
  { id: "e3", kind: "browser", mon: 1, f: { x: 0, y: 0, w: 0.62, h: 1 } },
  { id: "e4", kind: "music", mon: 1, f: { x: 0.62, y: 0, w: 0.38, h: 1 } },
];
export const CREAR: Slot[] = [
  { id: "c1", kind: "design", mon: 0, f: { x: 0, y: 0, w: 0.72, h: 1 } },
  { id: "c2", kind: "browser", mon: 0, f: { x: 0.72, y: 0, w: 0.28, h: 1 } },
  { id: "c3", kind: "music", mon: 1, f: { x: 0, y: 0, w: 0.45, h: 1 } },
  { id: "c4", kind: "chat", mon: 1, f: { x: 0.45, y: 0, w: 0.55, h: 1 } },
];
