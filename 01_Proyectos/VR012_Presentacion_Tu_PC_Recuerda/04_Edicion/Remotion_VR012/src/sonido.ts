import { at, atEnd, ESC, LANG, toma } from "./theme";

// Cada efecto está atado a un evento visual (palabra de la voz o gesto de la animación).
export type Sfx = { t: number; f: string; v: number; dur?: number };
const POPS = ["pop4.wav", "pop1.wav", "pop6.wav"];

const build = (): Sfx[] => {
  const s: Sfx[] = [];
  // 1 · ventanas que encajan + glitch + apagado
  for (let i = 0; i < 6; i++) s.push({ t: 0.04 + i * 0.12 + 0.24, f: POPS[i % 3], v: 0.28 });
  s.push({ t: 0.0, f: "whoosh_low.wav", v: 0.25 });
  const ta = at("t01", "amnesia");
  s.push({ t: ta - 0.04, f: "glitch.wav", v: 0.55 });
  s.push({ t: ta + 0.3, f: "apagar.wav", v: 0.55 });
  // 2 · encendido y olvido
  const te = at("t02", "enciendes");
  s.push({ t: te, f: "click.wav", v: 0.4 });
  s.push({ t: te + 0.04, f: "encender.wav", v: 0.45 });
  s.push({ t: at("t02", "olvida") - 0.1, f: "magia.wav", v: 0.16, dur: 2.5 });
  // 3 · recuerdos que aparecen y se olvidan
  ["programas", "pestañas", "ventana", "pantalla"].forEach((w, i) => {
    s.push({ t: at("t03", w) - 0.08, f: "wd2.wav", v: 0.35 });
    s.push({ t: at("t03", w) + 0.48, f: "glitch_corto.wav", v: 0.16 + i * 0.02 });
  });
  s.push({ t: ESC.t03.b - 0.45, f: "whoosh_big.wav", v: 0.3 });
  // 4 · arrastres a mano y días que se repiten
  const tr = at("t04", "reconstruirlo");
  const td = at("t04", "todos");
  const dd = (td - tr) / 4.2;
  for (let i = 0; i < 4; i++) {
    s.push({ t: tr + i * dd + dd * 0.25, f: "click.wav", v: 0.3 });
    s.push({ t: tr + i * dd + dd * 0.4, f: "wd5.wav", v: 0.25 });
  }
  s.push({ t: td, f: "tictac.wav", v: 0.35, dur: toma("t04").fin - td + 0.1 });
  // 5 · giro: subida hacia la memoria
  const tm = at("t05", "memoria");
  s.push({ t: tm - 1.06, f: "sfx_riser.wav", v: 0.3 });
  s.push({ t: tm, f: "sfx_boom.wav", v: 0.35 });
  s.push({ t: tm + 0.02, f: "quickwin.wav", v: 0.22 });
  // 6 · aparecen, encajan y se guardan
  [at("t06", "apps"), at("t06", "apps") + 0.12, at("t06", "apps") + 0.24, at("t06", "pestañas"), at("t06", "proyectos"), at("t06", "proyectos") + 0.14].forEach((x, i) =>
    s.push({ t: x, f: POPS[i % 3], v: 0.22 })
  );
  const tsit = at("t06", "sitio");
  for (let i = 0; i < 6; i++) s.push({ t: tsit - 0.15 + i * 0.06 + 0.05, f: "pop3.wav", v: 0.3 });
  const ts = atEnd("t06", "sitio") + 0.08;
  s.push({ t: ts, f: "uizoom.wav", v: 0.35 });
  s.push({ t: ts + 0.3, f: "whoosh_big.wav", v: 0.3 });
  s.push({ t: ts + 0.5, f: "sfx_ding.wav", v: 0.35 });
  // 7 · un clic… y vuelve todo
  s.push({ t: at("t07", "clic"), f: "click.wav", v: 0.55 });
  const tv = at("t07", "vuelve");
  s.push({ t: tv - 0.05, f: "whoosh_big.wav", v: 0.4 });
  for (let i = 0; i < 6; i++) s.push({ t: tv - 0.04 + i * 0.05 + 0.3, f: POPS[i % 3], v: 0.22 });
  s.push({ t: tv + 0.32, f: "sfx_hit.wav", v: 0.3 });
  s.push({ t: at("t07", "tal") - 0.05, f: "data8.wav", v: 0.25 });
  // 8 · cambio de espacio
  const T = [at("t08", "programar"), at("t08", "estudiar"), at("t08", "crear")];
  T.forEach((x) => s.push({ t: x - 0.12, f: "wd4.wav", v: 0.45 }));
  const tsal = at("t08", "saltas");
  [-0.05, 0.22, 0.49, 0.76].forEach((d, i) => s.push({ t: tsal + d, f: ["wd1.wav", "wd2.wav", "wd5.wav", "wd4.wav"][i], v: 0.45 }));
  s.push({ t: at("t08", "sin") - 0.1, f: "magia.wav", v: 0.14, dur: 2 });
  // 9 · zonas que imantan + voz
  [at("t09", "encajan") - 0.05, at("t09", "encajan") + 0.12, at("t09", "solas") - 0.02, at("t09", "solas") + 0.15, at("t09", "zona") - 0.05].forEach((x, i) =>
    s.push({ t: x, f: POPS[i % 3], v: 0.3 })
  );
  s.push({ t: at("t09", "y") - 0.2, f: "magia.wav", v: 0.18, dur: 2.2 });
  s.push({ t: at("t09", "voz") + 0.08, f: "wd5.wav", v: 0.4 });
  s.push({ t: at("t09", "voz") + 0.6, f: "sfx_ding.wav", v: 0.2 });
  // 10 · barra del día
  s.push({ t: ESC.t10.a + 0.1, f: "whoosh_low.wav", v: 0.18 });
  s.push({ t: at("t10", "colocar") - 0.05, f: "uizoom.wav", v: 0.3 });
  // 11 · se apaga… y recuerda
  s.push({ t: at("t11", "ahora") + 0.05, f: "apagar.wav", v: 0.4 });
  s.push({ t: at("t11", "ordenador") - 0.12, f: "encender.wav", v: 0.45 });
  s.push({ t: at("t11", "ordenador") - 0.05, f: "quickwin.wav", v: 0.25 });
  return s;
};

const cache: Record<string, Sfx[]> = {};
/** efectos del idioma activo (los tiempos dependen de la locución) */
export const sfx = () => (cache[LANG] ??= build());
