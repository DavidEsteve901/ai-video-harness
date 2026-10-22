import { at, compasesDe } from "./ritmo";

// Efectos atados a gestos visuales (todos calculados desde la rejilla de src/ritmo.ts).
// La música marca el pulso; los efectos solo subrayan lo que se ve: tarjetas que aterrizan, clics, fichas.
export type Sfx = { t: number; f: string; v: number; dur?: number };
const POPS = ["pop4.wav", "pop1.wav", "pop6.wav", "pop3.wav"];

export const sfx = (): Sfx[] => {
  const s: Sfx[] = [];
  const add = (t: number, f: string, v: number, dur?: number) => s.push({ t, f, v, dur });
  // intro: icono por palabra, ventanas que se amontonan, el giro
  [0, 1, 2, 3].forEach((p) => add(at("intro", 0, p), POPS[p], 0.3));
  [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5].forEach((p, i) => add(at("intro", 1, p) - 0.03, ["wd1.wav", "wd2.wav", "wd4.wav", "wd5.wav"][i % 4], 0.16));
  [0, 1, 2].forEach((p) => add(at("intro", 2, p), "sfx_hit.wav", 0.22));
  add(at("intro", 3, 0), "magia.wav", 0.16, 2.5);
  add(at("intro", 3, 2) - 0.02, "glitch_corto.wav", 0.12);
  // subida A: la tarjeta aterriza, zoom al botón, clic, lanzamiento, ventanas a sus zonas
  add(at("subidaA", 0, 0) - 0.3, "whoosh_big.wav", 0.32);
  add(at("subidaA", 1, 0) - 0.05, "uizoom.wav", 0.3);
  add(at("subidaA", 1, 2), "click.wav", 0.55);
  add(at("subidaA", 1, 3) - 0.05, "whoosh_low.wav", 0.3);
  [0, 0.5, 1, 1.5, 2, 2.5].forEach((p, i) => add(at("subidaA", 2, p) - 0.02, POPS[i % 4], 0.22));
  add(at("subidaA", 3, 0) - 0.1, "whoosh_low.wav", 0.28);
  add(at("subidaA", 3, 2), "data8.wav", 0.22);
  // subida B: obturador de la captura, fichas, enchufe del monitor, ventanas que saltan
  add(at("subidaB", 0, 2), "click.wav", 0.5);
  add(at("subidaB", 0, 2), "glitch_corto.wav", 0.18);
  [0, 1, 2, 3].forEach((p) => add(at("subidaB", 1, p), POPS[p], 0.24));
  add(at("subidaB", 2, 2) - 0.2, "whoosh_low.wav", 0.3);
  add(at("subidaB", 2, 2), "encender.wav", 0.3);
  [1, 1.5, 2].forEach((p, i) => add(at("subidaB", 3, p) - 0.02, ["wd1.wav", "wd4.wav", "wd5.wav"][i], 0.22));
  add(at("subidaB", 3, 0.5), "sfx_ding.wav", 0.18);
  // corte: chispa y succión hacia el drop
  add(at("corte", 0, 0), "magia.wav", 0.14, 2.4);
  add(at("corte", 0, 3) - 0.6, "reverse_riser.wav", 0.18);
  // drop: cada tarjeta aterriza en su compás; detalles por función
  for (let c = 0; c < compasesDe("drop") - 1; c++) add(at("drop", c, 0) - 0.28, c % 2 ? "whoosh_low.wav" : "whoosh_big.wav", 0.22);
  add(at("drop", 0, 2) - 0.08, "uizoom.wav", 0.22);
  add(at("drop", 0, 2.5), "quickwin.wav", 0.16);
  add(at("drop", 1, 2) - 0.08, "uizoom.wav", 0.2);
  add(at("drop", 2, 1), "data8.wav", 0.2);
  add(at("drop", 2, 2) - 0.08, "uizoom.wav", 0.2);
  add(at("drop", 3, 2), "data8.wav", 0.18);
  add(at("drop", 3, 3), "click.wav", 0.4);
  [0, 0.25, 0.5, 0.75, 1].forEach((p, i) => add(at("drop", 4, p), POPS[i % 4], 0.24));
  [2, 2.25, 2.5, 2.75, 3].forEach((p) => add(at("drop", 4, p), "click.wav", 0.28));
  add(at("drop", 4, 3.1), "sfx_ding.wav", 0.18);
  add(at("drop", 5, 1), "pop1.wav", 0.2);
  add(at("drop", 5, 3), "click.wav", 0.45);
  add(at("drop", 6, 0.05), "sfx_ding.wav", 0.16);
  add(at("drop", 6, 2.5), "click.wav", 0.45);
  for (let i = 0; i < 8; i++) add(at("drop", 7, i * 0.5), POPS[i % 4], 0.22);
  // final: palabras y visto
  add(at("final", 1, 2) + 0.08, "sfx_ding.wav", 0.26);
  return s;
};
