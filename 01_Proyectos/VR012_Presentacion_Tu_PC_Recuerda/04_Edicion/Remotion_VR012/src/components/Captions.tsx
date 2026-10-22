import React from "react";
import { C, clamp01, E, ease, LANG, Tono, VOZ, FONT } from "../theme";
import { Layout } from "../layout";

// Palabras clave: se marcan con un subrayador de su color mientras se pronuncian.
export const CLAVES: Record<string, { p: string[]; c: Tono }[]> = {
  t01: [{ p: ["amnesia"], c: "coral" }],
  t02: [{ p: ["olvida"], c: "coral" }],
  t03: [{ p: ["programas"], c: "coral" }, { p: ["pestañas"], c: "coral" }, { p: ["ventana"], c: "coral" }, { p: ["pantalla"], c: "coral" }],
  t04: [{ p: ["reconstruirlo"], c: "coral" }, { p: ["todos", "los", "días"], c: "coral" }],
  t05: [{ p: ["memoria"], c: "amber" }],
  t06: [{ p: ["una", "vez"], c: "amber" }, { p: ["su", "sitio"], c: "amber" }],
  t07: [{ p: ["un", "clic"], c: "green" }, { p: ["vuelve", "todo"], c: "green" }],
  t08: [{ p: ["programar"], c: "amber" }, { p: ["estudiar"], c: "amber" }, { p: ["crear"], c: "amber" }, { p: ["el", "hilo"], c: "amber" }],
  t09: [{ p: ["zona"], c: "cyan" }, { p: ["voz"], c: "amber" }],
  t10: [{ p: ["trabajar"], c: "green" }],
  t11: [{ p: ["recuerda"], c: "green" }],
};
export const CLAVES_EN: Record<string, { p: string[]; c: Tono }[]> = {
  t01: [{ p: ["amnesia"], c: "coral" }],
  t02: [{ p: ["forgets"], c: "coral" }],
  t03: [{ p: ["programs"], c: "coral" }, { p: ["tabs"], c: "coral" }, { p: ["window"], c: "coral" }, { p: ["screen"], c: "coral" }],
  t04: [{ p: ["rebuild"], c: "coral" }, { p: ["every", "single", "day"], c: "coral" }],
  t05: [{ p: ["memory"], c: "amber" }],
  t06: [{ p: ["once"], c: "amber" }, { p: ["its", "place"], c: "amber" }],
  t07: [{ p: ["one", "click"], c: "green" }, { p: ["comes", "back"], c: "green" }],
  t08: [{ p: ["coding"], c: "amber" }, { p: ["studying"], c: "amber" }, { p: ["creating"], c: "amber" }, { p: ["the", "thread"], c: "amber" }],
  t09: [{ p: ["zones"], c: "cyan" }, { p: ["voice"], c: "amber" }],
  t10: [{ p: ["working"], c: "green" }],
  t11: [{ p: ["remembers"], c: "green" }],
};

const n = (s: string) => s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "");
type W = { w: string; s: number; e: number; tono?: Tono; first?: boolean; last?: boolean; take: string };
type Page = { words: W[]; lines: W[][]; a: number; b: number };

const buildPages = (perLine: number): Page[] => {
  const pages: Page[] = [];
  VOZ.tomas.forEach((t) => {
    const ws: W[] = t.palabras.map((p) => ({ ...p, take: t.id }));
    // marcar claves (secuencias consecutivas)
    for (const k of (LANG === "en" ? CLAVES_EN : CLAVES)[t.id] ?? []) {
      for (let i = 0; i + k.p.length <= ws.length; i++) {
        if (k.p.every((p, j) => n(ws[i + j].w) === n(p)) && !ws[i].tono) {
          k.p.forEach((_, j) => {
            ws[i + j].tono = k.c;
            ws[i + j].first = j === 0;
            ws[i + j].last = j === k.p.length - 1;
          });
          break;
        }
      }
    }
    const width = (arr: W[]) => arr.reduce((s, w) => s + w.w.length + 1, 0);
    const cap = perLine * 2;
    // 1) frases (hasta . ? : …), uniendo las muy cortas a la siguiente
    const frases: W[][] = [];
    let cur: W[] = [];
    ws.forEach((w, i) => {
      cur.push(w);
      if ((/[.?:…]$/.test(w.w) && width(cur) > 6) || i === ws.length - 1) (frases.push(cur), (cur = []));
    });
    // 2) cada frase larga se reparte en bloques equilibrados, cortando con preferencia tras una coma
    for (const f of frases) {
      const n = Math.ceil(width(f) / cap);
      if (n <= 1) {
        pages.push({ words: f, lines: [], a: f[0].s, b: 0 });
        continue;
      }
      const target = width(f) / n;
      let start = 0;
      for (let pg = 1; pg < n; pg++) {
        let best = -1, bestScore = 1e9, acc = 0;
        for (let k = start; k < f.length - 1; k++) {
          acc += f[k].w.length + 1;
          if (acc > cap) break;
          const score = Math.abs(acc - target) - (/[,;]$/.test(f[k].w) ? 8 : 0);
          if (score < bestScore) (bestScore = score), (best = k);
        }
        const chunk = f.slice(start, best + 1);
        pages.push({ words: chunk, lines: [], a: chunk[0].s, b: 0 });
        start = best + 1;
      }
      const rest = f.slice(start);
      pages.push({ words: rest, lines: [], a: rest[0].s, b: 0 });
    }
  });
  pages.forEach((p, i) => {
    const next = pages[i + 1];
    const lastE = p.words[p.words.length - 1].e;
    const lastS = p.words[p.words.length - 1].s;
    // sale antes de que entre el siguiente bloque, pero nunca antes de que se haya visto su última palabra
    p.b = next ? Math.max(lastS + 0.35, Math.min(next.a - 0.3, next.a - lastE > 1.3 ? lastE + 0.9 : next.a)) : VOZ.duracion + 1;
    // líneas equilibradas
    const total = p.words.reduce((s, w) => s + w.w.length + 1, 0);
    if (total <= perLine) p.lines = [p.words];
    else {
      let best = 1, bestDiff = 1e9;
      for (let k = 1; k < p.words.length; k++) {
        const l1 = p.words.slice(0, k).reduce((s, w) => s + w.w.length + 1, 0);
        const diff = Math.abs(l1 - (total - l1)) + (l1 > perLine || total - l1 > perLine ? 1000 : 0) - (/[,:]$/.test(p.words[k - 1].w) ? 6 : 0);
        if (diff < bestDiff) (bestDiff = diff), (best = k);
      }
      p.lines = [p.words.slice(0, best), p.words.slice(best)];
    }
  });
  return pages;
};

let cache: { per: number; lang: string; pages: Page[] } | null = null;
const pagesFor = (per: number) => {
  if (!cache || cache.per !== per || cache.lang !== LANG) cache = { per, lang: LANG, pages: buildPages(per) };
  return cache.pages;
};

const Word: React.FC<{ w: W; t: number; size: number }> = ({ w, t, size }) => {
  const k = E(t, w.s - 0.05, 0.3);
  if (k <= 0) return <span style={{ opacity: 0, marginRight: size * 0.26 }}>{w.w}</span>;
  const col = w.tono ? C[w.tono] : C.ink;
  const mk = w.tono ? E(t, w.s - 0.02, 0.24) : 0;
  const bump = w.tono ? 1 + 0.07 * Math.sin(Math.PI * clamp01((t - w.s) / 0.32)) : 1;
  const glitch = w.tono === "coral" && w.w.toLowerCase().startsWith("amnesia") && t - w.s > 0 && t - w.s < 0.55;
  const gx = glitch ? Math.sin(t * 160) * 4 : 0;
  return (
    <span style={{ position: "relative", display: "inline-block", marginRight: w.tono && !w.last ? 0 : size * 0.26, paddingRight: w.tono && !w.last ? size * 0.26 : 0 }}>
      {w.tono && (
        <span
          style={{
            position: "absolute", left: w.first ? -size * 0.12 : 0, right: w.last ? -size * 0.12 : 0, top: "12%", bottom: "4%",
            background: col, borderRadius: size * 0.12, transform: `scaleX(${mk}) skewX(-6deg)`, transformOrigin: "left center",
            boxShadow: `0 0 ${size * 0.5}px ${col}66`,
          }}
        />
      )}
      <span
        style={{
          position: "relative", display: "inline-block",
          transform: `translateY(${(1 - k) * size * 0.28}px) scale(${(0.92 + 0.08 * k) * bump})`,
          filter: k < 1 ? `blur(${(1 - k) * 7}px)` : undefined,
          opacity: k,
          color: w.tono ? (mk > 0.45 ? "#0A0C12" : C.ink) : C.ink,
          textShadow: w.tono && mk > 0.45 ? (glitch ? `${gx}px 0 rgba(0,229,255,0.8), ${-gx}px 0 rgba(255,0,80,0.8)` : "none") : "0 4px 18px rgba(0,0,0,0.7)",
        }}
      >
        {w.w}
      </span>
    </span>
  );
};

export const Captions: React.FC<{ t: number; L: Layout; hideFrom?: number; yShift?: number; scale?: number }> = ({ t, L, yShift = 0, scale = 1 }) => {
  const pages = pagesFor(L.cap.perLine);
  const size = L.cap.size * scale;
  return (
    <>
      {pages.map((p, i) => {
        if (t < p.a - 0.1 || t > p.b + 0.25) return null;
        const out = ease.in(clamp01((t - p.b) / 0.18));
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: (L.W - L.cap.maxW) / 2, width: L.cap.maxW, top: L.cap.y + yShift - (p.lines.length * size * 1.22) / 2,
              display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - out, transform: `translateY(${-out * 26}px)`,
              fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1.22, letterSpacing: "-0.015em", zIndex: 80,
            }}
          >
            {p.lines.map((ln, j) => (
              <div key={j} style={{ whiteSpace: "nowrap" }}>
                {ln.map((w, k) => (
                  <Word key={k} w={w} t={t} size={size} />
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
};
