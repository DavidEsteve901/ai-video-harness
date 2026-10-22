import { at, atEnd, ESC, LANG } from "./theme";
import { HOP_T } from "./scenes/Recados";

// Cada efecto está atado a un evento visual (palabra de la voz o gesto de la animación).
export type Sfx = { t: number; f: string; v: number; dur?: number };
const POPS = ["pop4.wav", "pop1.wav", "pop6.wav"];
const WD = ["wd1.wav", "wd2.wav", "wd5.wav"];

const build = (): Sfx[] => {
  const s: Sfx[] = [];
  // 1 · el recadero salta de ventana en ventana
  HOP_T.forEach((h, i) => {
    if (i > 0) s.push({ t: h - 0.16, f: WD[i % 3], v: 0.12 });
    s.push({ t: h, f: POPS[i % 3], v: 0.17 });
  });
  const tr = at("t01", "recadero");
  s.push({ t: tr, f: "sfx_hit.wav", v: 0.32 });
  s.push({ t: tr + 0.02, f: "glitch_corto.wav", v: 0.22 });
  s.push({ t: atEnd("t01", "apps") + 0.3, f: "whoosh_low.wav", v: 0.28 });
  // 2 · copias, pegas, buscas, abres, colocas, vuelves
  const tC = at("t02", "copias"), tP = at("t02", "pegas"), tB = at("t02", "buscas"), tA = at("t02", "abres"), tCo = at("t02", "colocas"), tV = at("t02", "vuelves");
  s.push({ t: tC + 0.02, f: "click.wav", v: 0.38 });
  s.push({ t: tC + 0.05, f: "pop1.wav", v: 0.22 });
  s.push({ t: tP - 0.12, f: "wd2.wav", v: 0.28 });
  s.push({ t: tP + 0.04, f: "pop4.wav", v: 0.28 });
  [0.06, 0.3, 0.55].forEach((d) => s.push({ t: tB + d, f: "click.wav", v: 0.3 }));
  s.push({ t: tA - 0.08, f: "pop6.wav", v: 0.3 });
  s.push({ t: tA + 0.25, f: "click.wav", v: 0.36 });
  s.push({ t: tA + 0.42, f: "pop3.wav", v: 0.28 });
  s.push({ t: tCo + 0.04, f: "wd4.wav", v: 0.38 });
  s.push({ t: tV, f: "whoosh_big.wav", v: 0.34 });
  s.push({ t: tV + 0.28, f: "sfx_hit.wav", v: 0.22 });
  // 3 · cada viaje le arranca un trozo a la idea
  [at("t03", "cada") - 0.05, at("t03", "se") + 0.1, at("t03", "escapa") - 0.08, at("t03", "de") + 0.05, at("t03", "estabas") - 0.05].forEach((o, i) => {
    s.push({ t: o, f: WD[i % 3], v: 0.22 });
    s.push({ t: o + 0.06, f: "glitch_corto.wav", v: i === 2 ? 0.3 : 0.12 });
  });
  s.push({ t: at("t03", "escapa") + 0.02, f: "glitch.wav", v: 0.28 });
  s.push({ t: atEnd("t03", "pensando") + 0.15, f: "apagar.wav", v: 0.3 });
  // 4 · ¿y si todo viniera a ti?
  const ttu = at("t04", "tu"), tvin = at("t04", "viniera"), tti = at("t04", "ti");
  s.push({ t: ttu - 0.06, f: "pop4.wav", v: 0.3 });
  s.push({ t: at("t04", "en") - 0.02, f: "data8.wav", v: 0.16 });
  s.push({ t: tvin - 0.05, f: "magia.wav", v: 0.16, dur: 2.6 });
  s.push({ t: tti - 1.06, f: "sfx_riser.wav", v: 0.26 });
  s.push({ t: tti, f: "sfx_boom.wav", v: 0.3 });
  s.push({ t: tti + 0.02, f: "quickwin.wav", v: 0.2 });
  // 5 · pulsas tu atajo y aparece la barra
  const tAt = at("t05", "atajo"), tAp = at("t05", "aparece"), tEn = at("t05", "encima");
  s.push({ t: at("t05", "pulsas") - 0.06, f: "pop1.wav", v: 0.26 });
  s.push({ t: tAt - 0.01, f: "click.wav", v: 0.5 });
  s.push({ t: tAt + 0.02, f: "sfx_hit.wav", v: 0.26 });
  s.push({ t: tAp - 0.08, f: "encender.wav", v: 0.36 });
  s.push({ t: tAp - 0.04, f: "uizoom.wav", v: 0.26 });
  s.push({ t: tEn - 0.1, f: "sfx_ding.wav", v: 0.18 });
  // 6 · sugerencias según la app de delante + ideas de la IA
  const tSabe = at("t06", "sabe"), tSug = at("t06", "sugiere");
  s.push({ t: tSabe - 0.1, f: "pop1.wav", v: 0.24 });
  [0, 1, 2, 3].forEach((i) => s.push({ t: tSabe + 0.06 + i * 0.07, f: POPS[i % 3], v: 0.12 }));
  s.push({ t: at("t06", "delante") - 0.05, f: "sfx_ding.wav", v: 0.18 });
  s.push({ t: tSug + 0.25, f: "magia.wav", v: 0.14, dur: 1.6 });
  s.push({ t: tSug + 0.3, f: "pop3.wav", v: 0.22 });
  // 7 · media palabra… y donde quieras
  const tMed = at("t07", "media"), tY = at("t07", "y"), tCol = at("t07", "colocala"), tDon = at("t07", "donde"), tQui = at("t07", "quieras");
  s.push({ t: tMed - 0.68, f: "tecleo.wav", v: 0.3, dur: 0.62 });
  s.push({ t: tMed, f: "pop1.wav", v: 0.18 });
  s.push({ t: tY + 0.03, f: "enter.wav", v: 0.42 });
  s.push({ t: tY + 0.1, f: "pop6.wav", v: 0.3 });
  s.push({ t: tCol - 0.1, f: "pop4.wav", v: 0.16 });
  s.push({ t: tDon - 0.02, f: "click.wav", v: 0.4 });
  s.push({ t: tDon + 0.02, f: "wd5.wav", v: 0.38 });
  s.push({ t: tQui - 0.05, f: "sfx_ding.wav", v: 0.22 });
  // 8 · busca en internet y lo resume con sus fuentes
  const tPre = at("t08", "preguntale"), tBus = at("t08", "busca"), tInt = at("t08", "internet"), tRes = at("t08", "resume"), tCon = at("t08", "con"), tFue = at("t08", "fuentes");
  s.push({ t: tPre + 0.05, f: "tecleo.wav", v: 0.3, dur: tBus - tPre - 0.2 });
  s.push({ t: tBus - 0.02, f: "enter.wav", v: 0.42 });
  [0, 1, 2].forEach((i) => {
    s.push({ t: tInt - 0.35 + i * 0.12, f: WD[i], v: 0.2 });
    s.push({ t: tInt + 0.33 + i * 0.12, f: POPS[i], v: 0.16 });
  });
  s.push({ t: tRes - 0.02, f: "pop3.wav", v: 0.28 });
  [0, 1, 2].forEach((i) => s.push({ t: tCon + 0.05 + i * 0.1, f: POPS[i], v: 0.14 }));
  s.push({ t: tFue - 0.1, f: "sfx_ding.wav", v: 0.24 });
  // 9 · Ctrl + clic en dos ventanas
  const a9 = ESC.t09.a, tCtl = at("t09", "control"), tCli = at("t09", "clic"), tPro = at("t09", "propone");
  s.push({ t: a9 + 0.05, f: "whoosh_low.wav", v: 0.2 });
  s.push({ t: a9 + 0.2, f: "pop6.wav", v: 0.26 });
  s.push({ t: tCtl - 0.2, f: "pop1.wav", v: 0.22 });
  [tCtl + 0.04, tCli + 0.02].forEach((c) => {
    s.push({ t: c, f: "click.wav", v: 0.5 });
    s.push({ t: c + 0.04, f: "pop4.wav", v: 0.2 });
  });
  s.push({ t: tPro + 0.33, f: "magia.wav", v: 0.13, dur: 1.5 });
  s.push({ t: tPro + 0.35, f: "pop3.wav", v: 0.2 });
  // 10 · resume esta web y pásalo a tus notas
  const tRe = at("t10", "resume"), tPas = at("t10", "pasalo"), tNot = at("t10", "notion"), tObs = at("t10", "obsidian");
  const tAsk = tPas + 0.5, tYes = tNot - 0.32;
  s.push({ t: tRe - 0.05, f: "click.wav", v: 0.42 });
  s.push({ t: tRe + 0.24, f: "data8.wav", v: 0.2 });
  s.push({ t: tRe + 0.3, f: "whoosh_low.wav", v: 0.2 });
  s.push({ t: tAsk, f: "pop1.wav", v: 0.28 });
  s.push({ t: tYes, f: "click.wav", v: 0.48 });
  s.push({ t: tYes + 0.15, f: "tecleo.wav", v: 0.22, dur: 1.0 });
  s.push({ t: tNot - 0.05, f: "pop4.wav", v: 0.28 });
  s.push({ t: tObs - 0.05, f: "pop6.wav", v: 0.28 });
  s.push({ t: tObs + 0.2, f: "sfx_ding.wav", v: 0.26 });
  s.push({ t: tObs + 0.22, f: "quickwin.wav", v: 0.16 });
  // 11 · tus propios comandos: script, web, servicio
  const a11 = ESC.t11.a, tCom = at("t11", "comandos");
  s.push({ t: a11 + 0.3, f: "click.wav", v: 0.32 });
  s.push({ t: a11 + 0.34, f: "uizoom.wav", v: 0.22 });
  s.push({ t: tCom + 0.02, f: "click.wav", v: 0.34 });
  [0, 1, 2].forEach((i) => s.push({ t: tCom + 0.08 + i * 0.08, f: POPS[i], v: 0.14 }));
  [at("t11", "script"), at("t11", "web"), at("t11", "servicio")].forEach((w, i) => {
    s.push({ t: w - 0.32, f: WD[i], v: 0.24 });
    s.push({ t: w - 0.22, f: "pop3.wav", v: 0.24 });
    s.push({ t: w + 0.1, f: "sfx_hit.wav", v: 0.16 });
  });
  // 12 · sin salir de lo que estás haciendo
  const tTodo = at("t12", "todo"), tSin = at("t12", "sin"), tSal = at("t12", "salir");
  s.push({ t: tTodo - 0.05, f: "apagar.wav", v: 0.26 });
  [0, 1, 2].forEach((i) => s.push({ t: tSin + 0.05 + i * 0.2, f: POPS[i], v: 0.22 }));
  s.push({ t: tSal, f: "sfx_ding.wav", v: 0.26 });
  // 13 · ya no eres el recadero: el enredo se deshace y todo trabaja para ti
  const tre = at("t13", "recadero"), tah = at("t13", "ahora"), ttr = at("t13", "trabajan");
  s.push({ t: ESC.t13.a + 0.02, f: "whoosh_low.wav", v: 0.22 });
  s.push({ t: tre, f: "glitch_corto.wav", v: 0.2 });
  s.push({ t: atEnd("t13", "apps") - 0.05, f: "whoosh_big.wav", v: 0.26 });
  s.push({ t: tah - 0.1, f: "magia.wav", v: 0.18, dur: 2.6 });
  s.push({ t: ttr, f: "sfx_boom.wav", v: 0.22 });
  s.push({ t: ttr + 0.02, f: "quickwin.wav", v: 0.22 });
  s.push({ t: atEnd("t13", "ti") + 0.25, f: "sfx_ding.wav", v: 0.18 });
  return s;
};

const cache: Record<string, Sfx[]> = {};
/** efectos del idioma activo (los tiempos dependen de la locución) */
export const sfx = () => (cache[LANG] ??= build());
