import { at, atEnd, ESC } from "./theme";

// Cada efecto está atado a un evento visual (palabra de la voz o gesto de la animación).
export type Sfx = { t: number; f: string; v: number; dur?: number };
const POPS = ["pop4.wav", "pop1.wav", "pop6.wav", "pop3.wav"];

/** saltos de la selección entre ventanas (escena 3); la tercera se abre como una puerta en «puerta» */
export const SWITCH = () => [at("t03", "cada"), at("t03", "cambias"), at("t03", "puerta") - 0.25];

const build = (): Sfx[] => {
  const s: Sfx[] = [];
  // 1 · se abre la puerta, la cruza, cara de «¿a qué venía yo?»
  s.push({ t: 0.02, f: "bisagra.wav", v: 0.22 });
  s.push({ t: at("t01", "puerta") - 0.18, f: "whoosh_big.wav", v: 0.3 });
  s.push({ t: at("t01", "olvida") - 0.03, f: "pop4.wav", v: 0.32 });
  s.push({ t: at("t01", "olvida"), f: "glitch_corto.wav", v: 0.2 });
  s.push({ t: ESC.t02.a - 0.08, f: "scratch.wav", v: 0.42 });
  // 2 · efecto puerta: sello, claqueta, cajón
  s.push({ t: at("t02", "efecto") - 0.02, f: "sello.wav", v: 0.5 });
  s.push({ t: at("t02", "tu") - 0.12, f: "whoosh_low.wav", v: 0.25 });
  s.push({ t: at("t02", "cierra") + 0.05, f: "claqueta.wav", v: 0.5 });
  s.push({ t: at("t02", "archiva") - 0.1, f: "cajon.wav", v: 0.45 });
  // 3 · cada ventana es una puerta
  s.push({ t: ESC.t03.a, f: "uizoom.wav", v: 0.22 });
  s.push({ t: at("t03", "ordenador") - 0.08, f: "pop1.wav", v: 0.22 });
  SWITCH().forEach((x, i) => {
    s.push({ t: x - 0.02, f: "click.wav", v: 0.34 });
    s.push({ t: x, f: ["wd1.wav", "wd2.wav", "wd5.wav"][i], v: 0.18 });
  });
  s.push({ t: at("t03", "puerta") - 0.05, f: "bisagra.wav", v: 0.35 });
  // 4 · tres puertas y el hilo se rompe
  ["correo", "pestanas", "carpetas"].forEach((w, i) => {
    s.push({ t: at("t04", w) - 0.12, f: POPS[i], v: 0.3 });
    s.push({ t: at("t04", w) + 0.05, f: "bisagra.wav", v: 0.14 });
  });
  s.push({ t: at("t04", "pierdes") + 0.05, f: "glitch.wav", v: 0.3 });
  s.push({ t: at("t04", "pierdes") + 0.06, f: "sfx_hit.wav", v: 0.3 });
  s.push({ t: at("t04", "hilo") - 0.05, f: "pop6.wav", v: 0.22 });
  // 5 · una habitación por tarea
  [0, 1, 2, 3].forEach((i) => s.push({ t: ESC.t05.a + 0.12 + i * 0.18, f: POPS[i], v: 0.2 }));
  s.push({ t: at("t05", "tarea") + 0.05, f: "data8.wav", v: 0.14 });
  s.push({ t: at("t05", "habitacion") - 1.0, f: "sfx_riser.wav", v: 0.2 });
  s.push({ t: at("t05", "habitacion") - 0.05, f: "magia.wav", v: 0.16, dur: 2.4 });
  // 6 · entras: todo vuela a su sitio
  s.push({ t: ESC.t06.a - 0.12, f: "bisagra.wav", v: 0.26 });
  s.push({ t: ESC.t06.a + 0.05, f: "whoosh_big.wav", v: 0.3 });
  s.push({ t: ESC.t06.a + 0.15, f: "sfx_boom.wav", v: 0.26 });
  [0, 1, 2, 3, 4].forEach((i) => s.push({ t: ESC.t06.a + 0.55 + i * 0.12, f: POPS[i % 4], v: 0.2 }));
  s.push({ t: at("t06", "sitio") - 0.03, f: "quickwin.wav", v: 0.24 });
  // 7 · vuelve la cara: la escena se resuelve
  s.push({ t: ESC.t07.a - 0.15, f: "whoosh_low.wav", v: 0.25 });
  s.push({ t: at("t07", "olvida") - 0.2, f: "claqueta.wav", v: 0.35 });
  s.push({ t: at("t07", "venias") - 0.03, f: "sfx_ding.wav", v: 0.24 });
  s.push({ t: atEnd("t07", "venias") + 0.1, f: "pop3.wav", v: 0.14 });
  return s;
};

let cache: Sfx[] | null = null;
export const sfx = () => (cache ??= build());
