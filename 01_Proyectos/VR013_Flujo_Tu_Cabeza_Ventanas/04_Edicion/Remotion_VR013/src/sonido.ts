import { at, atEnd, ESC, LANG, toma } from "./theme";

// Cada efecto está atado a un evento visual (palabra de la voz o gesto de la animación).
export type Sfx = { t: number; f: string; v: number; dur?: number };
const POPS = ["pop4.wav", "pop1.wav", "pop6.wav"];

const build = (): Sfx[] => {
  const s: Sfx[] = [];
  // 1 · la cabeza se llena de ventanas
  const td = at("t01", "demasiadas");
  for (let i = 0; i < 6; i++) s.push({ t: 0.25 + i * 0.17 + 0.2, f: POPS[i % 3], v: 0.24 });
  for (let i = 0; i < 9; i++) s.push({ t: td + i * 0.1, f: POPS[i % 3], v: 0.16 });
  s.push({ t: td - 0.05, f: "data8.wav", v: 0.35 });
  s.push({ t: atEnd("t01", "abiertas") - 0.1, f: "glitch_corto.wav", v: 0.4 });
  // 2 · buscar, apuntar, arrastrar, cambiar a ciegas
  const tb = at("t02", "buscas");
  [0, 0.35, 0.7].forEach((d, i) => s.push({ t: tb + d, f: ["wd1.wav", "wd2.wav", "wd5.wav"][i], v: 0.35 }));
  s.push({ t: at("t02", "apuntas") + 0.25, f: "click.wav", v: 0.45 });
  s.push({ t: at("t02", "arrastras") + 0.2, f: "wd4.wav", v: 0.4 });
  s.push({ t: at("t02", "cambias"), f: "whoosh_big.wav", v: 0.4 });
  s.push({ t: at("t02", "ciegas") - 0.1, f: "glitch_corto.wav", v: 0.25 });
  // 3 · la encuentras… y se rompe el hilo
  s.push({ t: at("t03", "encuentras"), f: "click.wav", v: 0.45 });
  s.push({ t: at("t03", "que") - 0.05, f: "pop4.wav", v: 0.3 });
  s.push({ t: at("t03", "ibas") - 0.05, f: "sfx_hit.wav", v: 0.45 });
  s.push({ t: at("t03", "ibas") - 0.03, f: "glitch.wav", v: 0.4 });
  // 4 · decisiones que caen y la energía que se vacía
  ["busqueda", "pequena", "decision"].forEach((w) => s.push({ t: at("t04", w) + 0.3, f: "pop3.wav", v: 0.4 }));
  const tc = at("t04", "cien");
  const tv = at("t04", "vacian");
  for (let i = 0; i < 14; i++) s.push({ t: tc + 0.3 + i * ((tv - tc) / 14), f: POPS[i % 3], v: 0.13 });
  s.push({ t: tc, f: "tictac.wav", v: 0.3, dur: toma("t04").fin - tc + 0.1 });
  s.push({ t: tv, f: "apagar.wav", v: 0.4 });
  // 5 · ¿y si tu mano supiera llegar sola?
  const ts = at("t05", "sola");
  s.push({ t: ESC.t05.a + 0.25, f: "magia.wav", v: 0.14, dur: 2.5 });
  s.push({ t: ts - 1.06, f: "sfx_riser.wav", v: 0.3 });
  s.push({ t: ts, f: "sfx_boom.wav", v: 0.35 });
  s.push({ t: ts + 0.02, f: "quickwin.wav", v: 0.22 });
  // 6 · de la lista al mapa
  s.push({ t: at("t06", "listas") - 0.05, f: "glitch_corto.wav", v: 0.2 });
  s.push({ t: at("t06", "asi") - 0.1, f: "whoosh_big.wav", v: 0.35 });
  [0, 1, 2].forEach((i) => s.push({ t: at("t06", "mapa") - 0.25 + i * 0.12 + 0.15, f: POPS[i], v: 0.28 }));
  s.push({ t: at("t06", "mapa") + 0.25, f: "sfx_ding.wav", v: 0.3 });
  // 7 · el pulgar avanza… el pulgar vuelve
  ["escritorio", "cada", "cosa"].forEach((w, i) => s.push({ t: at("t07", w) - 0.03, f: POPS[i], v: 0.22 }));
  s.push({ t: at("t07", "el") - 0.1, f: "uizoom.wav", v: 0.3 });
  s.push({ t: at("t07", "avanza"), f: "click.wav", v: 0.45 });
  s.push({ t: at("t07", "avanza"), f: "wd4.wav", v: 0.45 });
  s.push({ t: at("t07", "vuelve"), f: "click.wav", v: 0.45 });
  s.push({ t: at("t07", "vuelve"), f: "wd2.wav", v: 0.45 });
  // 8 · la zona rota sin clic
  s.push({ t: at("t08", "toque") - 0.1, f: "pop1.wav", v: 0.3 });
  const tr = at("t08", "rotan");
  [tr - 0.05, tr + 0.65].forEach((x) => s.push({ t: x, f: "wd5.wav", v: 0.45 }));
  // 9 · las pestañas cambian
  s.push({ t: at("t09", "pestanas") - 0.1, f: "pop1.wav", v: 0.3 });
  ["cambian", "igual", "ninguna"].forEach((w, i) => s.push({ t: at("t09", w) - 0.05, f: ["wd1.wav", "wd2.wav", "wd1.wav"][i], v: 0.4 }));
  s.push({ t: at("t09", "apuntar") - 0.1, f: "glitch_corto.wav", v: 0.15 });
  // 10 · las ventanas salen de la cabeza
  s.push({ t: at("t10", "donde") - 0.1, f: "whoosh_big.wav", v: 0.4 });
  s.push({ t: at("t10", "lo") - 0.1, f: "sfx_ding.wav", v: 0.3 });
  // 11 · flujo
  s.push({ t: at("t11", "flujo") - 0.3, f: "magia.wav", v: 0.2, dur: 2.6 });
  s.push({ t: at("t11", "flujo"), f: "quickwin.wav", v: 0.22 });
  // 12 · una sola ventana
  s.push({ t: at("t12", "ventana") - 0.15, f: "sfx_ding.wav", v: 0.25 });
  return s;
};

const cache: Record<string, Sfx[]> = {};
/** efectos del idioma activo (los tiempos dependen de la locución) */
export const sfx = () => (cache[LANG] ??= build());
