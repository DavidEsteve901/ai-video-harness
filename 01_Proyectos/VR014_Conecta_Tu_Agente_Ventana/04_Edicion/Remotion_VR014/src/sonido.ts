import { at, atEnd, ESC, LANG, toma } from "./theme";

// Cada efecto está atado a un evento visual (palabra de la voz o gesto de la animación).
export type Sfx = { t: number; f: string; v: number; dur?: number };
const POPS = ["pop4.wav", "pop1.wav", "pop6.wav"];
const HITS = [0.5, 0.88, 1.26, 1.64, 2.02, 2.4]; // golpes del agente contra el cristal (escenas/Agente.tsx)

const build = (): Sfx[] => {
  const s: Sfx[] = [];
  // 1 · el agente rebota dentro de su ventana y lo encierran
  s.push({ t: 0.04, f: "pop3.wav", v: 0.3 });
  HITS.slice(1).forEach((h, i) => s.push({ t: h - 0.02, f: POPS[i % 3], v: 0.26 }));
  const te = at("t01", "encerrado");
  s.push({ t: te - 0.02, f: "whoosh_low.wav", v: 0.35 });
  s.push({ t: te + 0.3, f: "sfx_hit.wav", v: 0.5 });
  s.push({ t: te + 0.3, f: "glitch_corto.wav", v: 0.3 });
  s.push({ t: te + 0.55, f: "click.wav", v: 0.4 }); // candado
  // 2 · conoce el proyecto: árbol y haz de luz
  s.push({ t: at("t02", "conoce") + 0.2, f: "data8.wav", v: 0.3 });
  [0, 0.12, 0.24].forEach((d, i) => s.push({ t: at("t02", "carpeta") + d, f: POPS[i], v: 0.22 }));
  s.push({ t: at("t02", "script") + 0.05, f: "sfx_ding.wav", v: 0.25 });
  // 3 · el escritorio lo montas tú
  s.push({ t: ESC.t03.a + 0.1, f: "encender.wav", v: 0.3 });
  s.push({ t: at("t03", "tu") - 0.03, f: "pop1.wav", v: 0.3 });
  [0, 1, 2, 3].forEach((i) => s.push({ t: at("t03", "abrir") - 0.1 + i * 0.13, f: POPS[i % 3], v: 0.26 }));
  s.push({ t: at("t03", "colocar") + 0.1, f: "click.wav", v: 0.4 });
  s.push({ t: at("t03", "colocar") + 0.15, f: "wd4.wav", v: 0.4 });
  s.push({ t: at("t03", "recordar") - 0.1, f: "pop4.wav", v: 0.25 });
  s.push({ t: at("t03", "comandos"), f: "glitch_corto.wav", v: 0.3 });
  s.push({ t: at("t03", "comandos") + 0.02, f: "pop6.wav", v: 0.3 });
  // 4 · lo mejor, enterrado en una terminal
  [0, 1, 2].forEach((i) => s.push({ t: at("t04", "mejor") - 0.1 + i * 0.12, f: POPS[i], v: 0.28 }));
  s.push({ t: at("t04", "queda") - 0.1, f: "whoosh_low.wav", v: 0.4 });
  s.push({ t: at("t04", "enterrado"), f: "sfx_hit.wav", v: 0.35 });
  s.push({ t: at("t04", "terminal"), f: "apagar.wav", v: 0.3 });
  // 5 · ¿y si le abrieras la ventana?
  const tv = at("t05", "ventana");
  s.push({ t: ESC.t05.a + 0.2, f: "magia.wav", v: 0.14, dur: 2.5 });
  s.push({ t: at("t05", "abrieras") - 0.1, f: "wd5.wav", v: 0.4 });
  s.push({ t: at("t05", "abrieras") + 0.05, f: "click.wav", v: 0.35 });
  s.push({ t: tv - 1.06, f: "sfx_riser.wav", v: 0.3 });
  s.push({ t: tv, f: "sfx_boom.wav", v: 0.35 });
  s.push({ t: tv + 0.02, f: "quickwin.wav", v: 0.22 });
  // 6 · los agentes, uno por nombre; el cable se enchufa
  ["claude", "codex", "cursor", "antigravity", "copilot"].forEach((w, i) => s.push({ t: at("t06", w) - 0.06, f: POPS[i % 3], v: 0.32 }));
  s.push({ t: at("t06", "conectas") - 0.12, f: "whoosh_big.wav", v: 0.35 });
  s.push({ t: at("t06", "una"), f: "sfx_hit.wav", v: 0.4 });
  s.push({ t: at("t06", "una") + 0.02, f: "sfx_ding.wav", v: 0.3 });
  // 7 · te monta el entorno
  s.push({ t: at("t07", "entiende"), f: "data8.wav", v: 0.28 });
  s.push({ t: at("t07", "monta") - 0.2, f: "whoosh_big.wav", v: 0.32 });
  s.push({ t: at("t07", "monta") - 0.1, f: "encender.wav", v: 0.25 });
  [0, 1, 2].forEach((i) => s.push({ t: at("t07", "espacios") - 0.1 + i * 0.09, f: POPS[i], v: 0.22 }));
  ["wd1.wav", "wd2.wav", "wd5.wav", "wd4.wav"].forEach((f, i) => s.push({ t: at("t07", "ventanas") - 0.12 + i * 0.1, f, v: 0.3 }));
  s.push({ t: at("t07", "atajos") - 0.06, f: "click.wav", v: 0.4 });
  [0, 1].forEach((i) => s.push({ t: at("t07", "ajustes") + 0.08 + i * 0.12, f: "click.wav", v: 0.35 }));
  s.push({ t: at("t07", "ajustes") + 0.55, f: "sfx_ding.wav", v: 0.28 });
  // 8 · desentierra las funciones y las lleva al Omnibar
  s.push({ t: at("t08", "desentierra") - 0.15, f: "reverse_riser.wav", v: 0.3 });
  s.push({ t: at("t08", "desentierra") + 0.1, f: "whoosh_low.wav", v: 0.3 });
  s.push({ t: at("t08", "mejor") - 0.05, f: "pop1.wav", v: 0.25 });
  s.push({ t: at("t08", "lleva") - 0.3, f: "uizoom.wav", v: 0.3 });
  [0, 1, 2].forEach((i) => s.push({ t: at("t08", "lleva") + 0.55 + i * 0.12, f: POPS[i], v: 0.28 }));
  s.push({ t: at("t08", "omnibar"), f: "quickwin.wav", v: 0.2 });
  // 9 · atajo, función, el proyecto trabaja, desde cualquier app
  const ttr = at("t09", "trabajo");
  s.push({ t: at("t09", "pulsas") + 0.05, f: "click.wav", v: 0.45 });
  s.push({ t: at("t09", "atajo"), f: "uizoom.wav", v: 0.3 });
  [0, 1, 2].forEach((i) => s.push({ t: at("t09", "eliges") + i * 0.08, f: POPS[i], v: 0.2 }));
  s.push({ t: at("t09", "funcion"), f: "click.wav", v: 0.35 });
  s.push({ t: at("t09", "proyecto") - 0.1, f: "whoosh_low.wav", v: 0.3 });
  s.push({ t: at("t09", "hace") - 0.1, f: "tictac.wav", v: 0.25, dur: ttr + 0.5 - at("t09", "hace") });
  s.push({ t: ttr + 0.7, f: "sfx_ding.wav", v: 0.3 });
  s.push({ t: at("t09", "cualquier") - 0.12, f: "wd1.wav", v: 0.35 });
  s.push({ t: at("t09", "app") - 0.12, f: "wd2.wav", v: 0.35 });
  // 10 · él propone, tú decides
  s.push({ t: at("t10", "propone") - 0.2, f: "whoosh_big.wav", v: 0.3 });
  s.push({ t: at("t10", "revisas") - 0.1, f: "data8.wav", v: 0.22 });
  s.push({ t: at("t10", "decides"), f: "click.wav", v: 0.45 });
  s.push({ t: at("t10", "decides") + 0.15, f: "quickwin.wav", v: 0.22 });
  // 11 · la ventana se deshace; el agente queda libre
  s.push({ t: at("t11", "ya") + 0.15, f: "magia.wav", v: 0.18, dur: 2.4 });
  s.push({ t: at("t11", "ventana") - 0.1, f: "whoosh_low.wav", v: 0.3 });
  // 12 · tu forma de trabajar
  s.push({ t: at("t12", "ahora") - 0.1, f: "encender.wav", v: 0.3 });
  s.push({ t: at("t12", "prepara") - 0.15, f: "whoosh_big.wav", v: 0.28 });
  s.push({ t: at("t12", "forma"), f: "sfx_ding.wav", v: 0.28 });
  s.push({ t: atEnd("t12", "trabajar") + 0.1, f: "quickwin.wav", v: 0.18 });
  return s.filter((x) => x.t >= 0 && x.t < toma("t12").fin + 2.2);
};

const cache: Record<string, Sfx[]> = {};
/** efectos del idioma activo (los tiempos dependen de la locución) */
export const sfx = () => (cache[LANG] ??= build());
