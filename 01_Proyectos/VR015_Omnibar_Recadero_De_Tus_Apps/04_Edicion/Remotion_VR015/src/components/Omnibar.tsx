import React from "react";
import icons from "../icons.json";
import { clamp01, ease } from "../theme";

// El Omnibar tal y como se ve en la app 1.2.7: tokens, medidas y textos copiados de
// WorkspaceLauncher/frontend/src/components/Chatbot/OmnibarQuick.css (+ locales/es.json).
// Todo se dibuja en px CSS de la app y se escala entero con `s`.
export const OB = {
  ai: "#f2c14e",
  ok: "#00e676",
  accent: "#00D2FF",
  accentDim: "rgba(0,210,255,.12)",
  accentEdge: "rgba(0,210,255,.38)",
  solid: "rgba(22,22,22,.97)",
  glassTop: "rgba(30,30,30,.72)",
  glass: "rgba(18,18,18,.80)",
  edge: "rgba(255,255,255,.08)",
  edgeStrong: "rgba(255,255,255,.14)",
  highlight: "rgba(255,255,255,.05)",
  text: "#E0E0E0",
  muted: "#9A9A9A",
  faint: "#6E6E6E",
  tile: "rgba(255,255,255,.04)",
  tileEdge: "rgba(255,255,255,.07)",
  hover: "rgba(255,255,255,.075)",
  sep: "rgba(255,255,255,.06)",
  pop: "#262626",
  ring: "#1c1c1c",
};
export const OB_FONT = "Jakarta, 'Plus Jakarta Sans', Inter, 'Segoe UI', sans-serif";

export type IconName = keyof typeof icons;
export const Icon: React.FC<{ name: IconName; size?: number; color?: string; stroke?: number; style?: React.CSSProperties }> = ({ name, size = 16, color = "currentColor", stroke = 2, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
    {(icons[name] as [string, Record<string, string>][]).map(([tag, a], i) => React.createElement(tag, { key: i, ...a }))}
  </svg>
);

/** Icono de programa como en el banco de la app: cuadrado de color con su inicial (sin logos de marcas) */
export type App = { n: string; bg: string; fg?: string };
export const APPS = {
  chrome: { n: "C", bg: "#1a73e8" },
  spotify: { n: "S", bg: "#1db954" },
  obsidian: { n: "O", bg: "#7c3aed" },
  notion: { n: "N", bg: "#EDEDED", fg: "#111" },
  code: { n: "<", bg: "#0078d4" },
  excel: { n: "X", bg: "#1d6f42" },
  figma: { n: "F", bg: "#a259ff" },
  word: { n: "W", bg: "#2b579a" },
} satisfies Record<string, App>;
export const AppIcon: React.FC<{ app: App; size?: number; radius?: number; style?: React.CSSProperties }> = ({ app, size = 20, radius, style }) => (
  <div
    style={{
      width: size, height: size, borderRadius: radius ?? size * 0.21, background: app.bg, color: app.fg ?? "#fff", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: size * 0.52, ...style,
    }}
  >
    {app.n}
  </div>
);

/** entrada «obRise» del CSS: 3 px de subida + opacidad (k 0..1) */
export const rise = (k: number): React.CSSProperties => (k >= 1 ? {} : { opacity: clamp01(k), transform: `translateY(${(1 - ease.out(clamp01(k))) * 6}px)` });

// ───────── píldora ─────────
export type PillProps = {
  text?: string; // lo escrito
  ghost?: string; // autocompletado gris tras el cursor
  placeholder?: string;
  caret?: boolean; // cursor ámbar visible (parpadea)
  running?: number; // ≥0: segundos desde que la IA trabaja (luz ámbar en el borde inferior)
  mic?: boolean; // dictando
  focus?: boolean; // borde de acento
  t: number;
};
const Pill: React.FC<PillProps> = ({ text = "", ghost, placeholder = "Pide algo a la IA o explora con /", caret = true, running = -1, focus = true, t }) => {
  const blink = Math.floor(t * 1.9) % 2 === 0;
  return (
    <div
      style={{
        position: "relative", display: "flex", alignItems: "flex-start", gap: 10, minHeight: 60, padding: 12, overflow: "hidden", borderRadius: 22,
        boxShadow: `inset 0 0 0 1px ${focus ? OB.accentEdge : OB.edge}, inset 0 1px 0 ${OB.highlight}`,
      }}
    >
      <Glass />
      <div style={{ position: "relative", width: 32, height: 32, marginTop: 2, borderRadius: 10, background: OB.tile, color: OB.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="mic" size={16} />
      </div>
      <Icon name="sparkles" size={18} color={OB.ai} style={{ position: "relative", marginTop: 9, opacity: running >= 0 ? 0.5 + 0.5 * Math.abs(Math.sin(running * 2)) : 0.9 }} />
      <div style={{ position: "relative", flex: 1, minWidth: 0, marginTop: 6, fontSize: 17, fontWeight: 450, letterSpacing: "-.01em", lineHeight: "24px", color: OB.text, whiteSpace: "nowrap" }}>
        {text.length === 0 && <span style={{ color: OB.faint, fontWeight: 400 }}>{placeholder}</span>}
        <span>{text}</span>
        {caret && <span style={{ display: "inline-block", width: 2, height: 21, marginLeft: 1, marginRight: -3, verticalAlign: -4, background: OB.ai, opacity: blink ? 1 : 0 }} />}
        {ghost && <span style={{ color: OB.faint }}>{ghost}</span>}
        {ghost && <Kb style={{ marginLeft: 8, verticalAlign: 2 }}>Tab</Kb>}
      </div>
      <div style={{ position: "relative", width: 30, height: 30, marginTop: 3, borderRadius: 9, color: OB.faint, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="arrowUpRight" size={16} />
      </div>
      <div style={{ position: "relative", width: 1, height: 18, marginTop: 9, background: OB.sep }} />
      <div style={{ position: "relative", width: 28, height: 28, marginTop: 4, borderRadius: 8, color: OB.faint, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="x" size={16} />
      </div>
      {running >= 0 && (
        <div
          style={{
            position: "absolute", left: 0, right: 0, bottom: 0, height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${OB.ai} 50%, transparent 100%) no-repeat`, backgroundSize: "40% 100%",
            backgroundPosition: `${-60 + 220 * ease.out((running % 1.4) / 1.4)}% 0`, opacity: 0.75,
          }}
        />
      )}
    </div>
  );
};

/** cristal: desenfoque de lo que hay detrás + tinte (como DesktopBehindCard + .omnibar-glass::after) */
const Glass: React.FC = () => (
  <div
    style={{
      position: "absolute", inset: 0, borderRadius: "inherit", backdropFilter: "blur(14px) saturate(1.5)",
      background: `linear-gradient(180deg, ${OB.glassTop}, ${OB.glass})`,
    }}
  />
);

export const Kb: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span style={{ display: "inline-block", padding: "1px 5px", borderRadius: 5, border: `1px solid ${OB.tileEdge}`, background: OB.tile, color: OB.faint, fontSize: 10.5, fontWeight: 500, lineHeight: "14px", ...style }}>
    {children}
  </span>
);

// ───────── tarjeta ─────────
export const Section: React.FC<{ children: React.ReactNode; first?: boolean; style?: React.CSSProperties }> = ({ children, first, style }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "10px 14px 12px", borderTop: first ? undefined : `1px solid ${OB.sep}`, ...style }}>{children}</div>
);

export const Heading: React.FC<{ children: React.ReactNode; ai?: boolean; app?: string; style?: React.CSSProperties; appStyle?: React.CSSProperties }> = ({ children, ai, app, style, appStyle }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 4px", fontSize: 10.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: ai ? OB.ai : OB.muted, ...style }}>
    {ai && <Icon name="sparkles" size={12} color={OB.ai} />}
    <span>{children}</span>
    {app && (
      <>
        <span style={{ color: OB.faint, fontWeight: 400 }}>·</span>
        <span style={{ color: OB.text, fontWeight: 600, textTransform: "none", letterSpacing: ".01em", borderRadius: 5, padding: "0 3px", margin: "0 -3px", ...appStyle }}>{app}</span>
      </>
    )}
  </div>
);

export type ChipSpec = { label: string; hint?: string; app?: App; apps?: App[]; icon?: IconName; badge?: IconName; idea?: boolean; loading?: boolean };
export const Chip: React.FC<{ c: ChipSpec; k?: number; press?: number; glow?: number; t?: number }> = ({ c, k = 1, press = 0, glow = 0, t = 0 }) => {
  const idea = c.idea;
  const pressS = press > 0 && press < 1 ? 1 - 0.03 * Math.sin(Math.PI * press) : 1;
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 10, minWidth: 0, padding: "7px 8px", borderRadius: 11, fontSize: 13, color: OB.text,
        border: `1px solid ${idea ? `rgba(242,193,78,${0.18 + 0.3 * glow})` : glow > 0 ? `rgba(0,210,255,${0.38 * glow})` : OB.tileEdge}`,
        background: idea
          ? `linear-gradient(135deg, rgba(242,193,78,${0.07 + 0.08 * glow}), rgba(242,193,78,${0.015 + 0.03 * glow}))`
          : glow > 0 ? `rgba(0,210,255,${0.12 * glow})` : OB.tile,
        boxShadow: idea && glow > 0 ? `0 0 ${18 * glow}px rgba(242,193,78,${0.25 * glow})` : undefined,
        ...rise(k), transform: `${rise(k).transform ?? ""} scale(${pressS})`,
      }}
    >
      <ChipIcon c={c} />
      <div style={{ display: "flex", flex: 1, flexDirection: "column", minWidth: 0, gap: 1 }}>
        {c.loading ? (
          <span style={{ display: "block", width: "70%", height: 10, borderRadius: 5, background: `linear-gradient(90deg, rgba(242,193,78,.06), rgba(242,193,78,.2), rgba(242,193,78,.06))`, backgroundSize: "200% 100%", backgroundPosition: `${200 - ((t * 1.6) % 2) * 100}% 0` }} />
        ) : (
          <span style={{ fontWeight: 500, lineHeight: idea ? 1.3 : 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.label}</span>
        )}
        {c.hint && !c.loading && <span style={{ fontSize: 11, color: OB.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.hint}</span>}
      </div>
    </div>
  );
};
const ChipIcon: React.FC<{ c: ChipSpec }> = ({ c }) => {
  const idea = c.idea;
  const stack = c.apps && c.apps.length > 1;
  return (
    <div
      style={{
        position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, height: 30, borderRadius: 8,
        width: stack ? undefined : 30, minWidth: 30, padding: stack ? "0 6px 0 5px" : 0,
        background: idea ? "rgba(242,193,78,.08)" : OB.tile, boxShadow: `inset 0 0 0 1px ${idea ? "rgba(242,193,78,.15)" : OB.tileEdge}`, color: idea ? OB.ai : OB.muted,
      }}
    >
      {idea ? <Icon name="sparkles" size={15} color={OB.ai} /> : stack ? (
        c.apps!.map((a, i) => <AppIcon key={i} app={a} size={18} radius={5} style={{ marginLeft: i ? -5 : 0, boxShadow: `0 0 0 2px ${OB.ring}` }} />)
      ) : c.app ? <AppIcon app={c.app} size={20} /> : c.icon ? <Icon name={c.icon} size={15} /> : null}
      {c.badge && (
        <span style={{ position: "absolute", right: -4, bottom: -4, width: 15, height: 15, borderRadius: 5, background: OB.pop, color: "rgba(255,255,255,.85)", boxShadow: `0 0 0 1.5px ${OB.ring}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={c.badge} size={9} />
        </span>
      )}
    </div>
  );
};

export const Chips: React.FC<{ chips: ChipSpec[]; cols: number; k?: (i: number) => number; press?: (i: number) => number; glow?: (i: number) => number; t?: number }> = ({ chips, cols, k, press, glow, t }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 6 }}>
    {chips.map((c, i) => <Chip key={i} c={c} k={k ? k(i) : 1} press={press ? press(i) : 0} glow={glow ? glow(i) : 0} t={t} />)}
  </div>
);

/** filas de coincidencias al teclear (.omnibar-row) */
export type RowSpec = { label: string; meta?: string; app?: App; icon?: IconName; badge?: IconName; ai?: boolean };
export const Row: React.FC<{ r: RowSpec; selected?: boolean; k?: number }> = ({ r, selected, k = 1 }) => (
  <div
    style={{
      display: "flex", alignItems: "center", gap: 10, padding: "6px 8px", borderRadius: 11, fontSize: 13, color: OB.text,
      border: `1px solid ${selected ? OB.accentEdge : "transparent"}`, background: selected ? OB.accentDim : "none", ...rise(k),
    }}
  >
    <ChipIcon c={{ label: r.label, app: r.app, icon: r.icon ?? (r.ai ? "sparkles" : undefined), badge: r.badge }} />
    <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500 }}>
      <span style={{ color: r.ai ? OB.ai : OB.text }}>{r.label}</span>
      {r.meta && <span style={{ color: OB.muted, fontWeight: 400, fontSize: 11.5 }}> · {r.meta}</span>}
    </span>
    {selected && <Icon name="enter" size={14} color={OB.accent} />}
  </div>
);

/** filas del explorador «/» (icono + etiqueta + pista debajo) */
export const BrowseRow: React.FC<{ r: RowSpec & { hint?: string }; selected?: boolean; k?: number; glow?: number }> = ({ r, selected, k = 1, glow = 0 }) => (
  <div
    style={{
      display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 11, fontSize: 13.5, color: OB.text,
      border: `1px solid ${selected ? OB.accentEdge : glow > 0 ? `rgba(0,210,255,${0.38 * glow})` : "transparent"}`,
      background: selected ? OB.accentDim : glow > 0 ? `rgba(0,210,255,${0.08 * glow})` : "none", ...rise(k),
    }}
  >
    <ChipIcon c={{ label: r.label, app: r.app, icon: r.icon, badge: r.badge }} />
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
      <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.label}</span>
      {r.hint && <span style={{ fontSize: 11, color: OB.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.hint}</span>}
    </div>
    {selected && <Icon name="enter" size={14} color={OB.accent} />}
  </div>
);

export const Btn: React.FC<{ children: React.ReactNode; icon?: IconName; style?: React.CSSProperties; active?: boolean }> = ({ children, icon, style, active }) => (
  <span
    style={{
      display: "inline-flex", alignItems: "center", gap: 6, height: 28, padding: "0 10px", borderRadius: 8, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap",
      border: `1px solid ${active ? OB.accentEdge : OB.tileEdge}`, background: active ? OB.accentDim : OB.tile, color: active ? OB.text : OB.muted, ...style,
    }}
  >
    {icon && <Icon name={icon} size={13} />}
    {children}
  </span>
);

/** cabecera de inicio: «¿Qué quieres hacer?» + ayuda + «Explorar acciones /» */
export const HomeToolbar: React.FC<{ narrow?: boolean }> = ({ narrow }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px 4px" }}>
    <Icon name="sparkles" size={16} color={OB.ai} />
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: OB.text }}>¿Qué quieres hacer?</span>
      <span style={{ fontSize: 11.5, color: OB.muted }}>Pídelo a la IA o elige una acción</span>
    </div>
    {!narrow && (
      <span style={{ width: 30, height: 28, borderRadius: 8, border: `1px solid ${OB.tileEdge}`, background: OB.tile, color: OB.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="circleHelp" size={14} />
      </span>
    )}
    <Btn icon="search" style={{ color: OB.text, height: 30 }}>
      Explorar acciones <Kb>/</Kb>
    </Btn>
  </div>
);

/** «Ventanas seleccionadas» (Ctrl + clic) */
export const Marks: React.FC<{ marks: { app: App; kind: string; label: string; k: number }[] }> = ({ marks }) => (
  <Section first style={{ paddingBottom: 8 }}>
    <div style={{ padding: "0 4px", fontSize: 11.5, fontWeight: 600, letterSpacing: ".01em", color: OB.muted }}>Ventanas seleccionadas</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {marks.map((m, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 6px", borderRadius: 8, fontSize: 12, color: OB.text,
            border: `1px solid ${i === marks.length - 1 ? OB.edgeStrong : OB.tileEdge}`, background: OB.tile, ...rise(m.k),
          }}
        >
          <AppIcon app={m.app} size={14} radius={3} />
          <span style={{ color: OB.muted, fontSize: 11 }}>{m.kind}</span>
          <span style={{ fontWeight: 500 }}>{m.label}</span>
          <Icon name="x" size={11} color={OB.faint} />
        </span>
      ))}
    </div>
  </Section>
);

/** estado mientras trabaja: «Leyendo Chrome…» + Parar */
export const Status: React.FC<{ text: string; t: number; done?: boolean }> = ({ text, t, done }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 12px 12px 16px", fontSize: 13, color: done ? OB.text : OB.muted }}>
    {done ? <Icon name="circleCheck" size={16} color={OB.ok} /> : <Icon name="loader" size={15} color={OB.ai} style={{ transform: `rotate(${t * 360}deg)` }} />}
    <span style={{ flex: 1 }}>{text}</span>
    {!done && <Btn icon="square">Parar</Btn>}
  </div>
);

// ───────── el Omnibar completo ─────────
export type OmnibarProps = {
  x: number; // centro horizontal (px del fotograma)
  y: number; // borde superior
  s: number; // escala
  w: number; // ancho en px CSS de la app
  k?: number; // aparición 0..1
  cardK?: number; // tarjeta 0..1
  pill: PillProps;
  card?: React.ReactNode;
  opacity?: number;
  origin?: string;
};
export const Omnibar: React.FC<OmnibarProps> = ({ x, y, s, w, k = 1, cardK = 1, pill, card, opacity = 1, origin = "50% 0%" }) => {
  if (k <= 0 || opacity <= 0) return null;
  const e = ease.out(clamp01(k));
  const ck = ease.out(clamp01(cardK));
  return (
    <div
      style={{
        position: "absolute", left: x - (w * s) / 2, top: y, width: w, transformOrigin: "0 0",
        transform: `scale(${s})`, fontFamily: OB_FONT, color: OB.text, opacity: opacity * clamp01(k * 1.6), zIndex: 60,
      }}
    >
      <div style={{ transform: `translateY(${(1 - e) * -14}px) scale(${0.96 + 0.04 * e})`, transformOrigin: origin, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ borderRadius: 22, boxShadow: "0 24px 60px rgba(0,0,0,.55)" }}>
          <Pill {...pill} />
        </div>
        {card && ck > 0 && (
          <div
            style={{
              position: "relative", overflow: "hidden", borderRadius: 18, opacity: ck, transform: `translateY(${(1 - ck) * -4}px)`,
              boxShadow: `inset 0 0 0 1px ${OB.edge}, inset 0 1px 0 ${OB.highlight}, 0 30px 70px rgba(0,0,0,.55)`,
            }}
          >
            <Glass />
            <div style={{ position: "relative", zIndex: 1 }}>{card}</div>
          </div>
        )}
      </div>
    </div>
  );
};
