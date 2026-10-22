import React from "react";
import { Img, staticFile } from "remotion";
import { Icon, IconName } from "./Bits";
import { C, clamp01, ease, spr, UI_FONT } from "../theme";

// Tarjetas flotantes de la app reconstruidas con sus tokens y textos reales:
//   frontend/src/osd/osd.css (.assistant-choice-*), osd/dictationCard.css, ConfigPanel/McpAgentConnections.css,
//   locales/es.json y Core/Routines, Core/Proactive. Se dibujan en px CSS de la app y se escalan con `s`.
export const T = {
  glassTop: "rgba(30,30,30,.86)", glass: "rgba(18,18,18,.92)", edge: "rgba(255,255,255,.09)", hi: "rgba(255,255,255,.05)",
  text: "#E0E0E0", strong: "#ffffff", muted: "#9A9A9A", faint: "#6E6E6E", tile: "rgba(255,255,255,.04)", tileEdge: "rgba(255,255,255,.08)",
  accent: "#00D2FF", accentDim: "rgba(0,210,255,.12)", accentEdge: "rgba(0,210,255,.40)", ai: "#f2c14e", ok: "#00e676",
};

/** Contenedor: aparece con resorte (sube y crece) centrado en (x, y) */
export const Float: React.FC<{ t: number; at: number; x: number; y: number; s: number; w: number; out?: number; children: React.ReactNode; z?: number; from?: number }> = ({ t, at, x, y, s, w, out, children, z = 50, from = 40 }) => {
  const d = t - at + 0.18;
  if (d < 0) return null;
  const k = ease.out(clamp01(d / 0.3));
  const sp = spr(t, at - 0.18, 1.8, 8);
  let o = clamp01(d / 0.12);
  let oy = 0;
  if (out !== undefined && t > out) {
    const q = ease.in(clamp01((t - out) / 0.18));
    o *= 1 - q; oy = -q * 60;
    if (q >= 1) return null;
  }
  return (
    <div
      style={{
        position: "absolute", left: x - (w * s) / 2, top: y, width: w, transformOrigin: "0 0", zIndex: z, fontFamily: UI_FONT, color: T.text, opacity: o,
        transform: `translateY(${(1 - k) * from + oy}px) scale(${s * (0.9 + 0.1 * sp)}) translateY(-50%)`,
      }}
    >
      {children}
    </div>
  );
};

export const Glass: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; radius?: number }> = ({ children, style, radius = 16 }) => (
  <div
    style={{
      position: "relative", borderRadius: radius, overflow: "hidden", color: T.text,
      background: `linear-gradient(180deg, ${T.glassTop}, ${T.glass})`,
      boxShadow: `inset 0 0 0 1px ${T.edge}, inset 0 1px ${T.hi}, 0 30px 80px rgba(0,0,0,.6)`, ...style,
    }}
  >
    {children}
  </div>
);

const Mark: React.FC<{ icon: IconName; color?: string }> = ({ icon, color = T.accent }) => (
  <div style={{ display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: 11, color, background: `${color}1f`, boxShadow: `inset 0 0 0 1px ${color}2e` }}>
    <Icon name={icon} size={18} />
  </div>
);

/** Tarjeta de decisión del asistente (.assistant-choice-card): rutinas sugeridas */
export const ChoiceCard: React.FC<{
  t: number; kicker: string; icon: IconName; question: string; context: string; options: { label: string; hint?: string; rec?: boolean; k?: number }[];
  press?: number; // instante del clic en la opción recomendada
}> = ({ t, kicker, icon, question, context, options, press = 1e9 }) => {
  const pk = t - press;
  return (
    <Glass style={{ width: 440, padding: 19 }}>
      <div style={{ display: "grid", gridTemplateColumns: "38px minmax(0,1fr) 28px", gap: 11, alignItems: "start" }}>
        <Mark icon={icon} />
        <div>
          <div style={{ color: T.accent, fontSize: 10.5, fontWeight: 750, letterSpacing: ".08em", textTransform: "uppercase" }}>{kicker}</div>
          <div style={{ marginTop: 5, fontSize: 16, fontWeight: 700, lineHeight: 1.35, color: T.strong }}>{question}</div>
          <div style={{ marginTop: 5, color: T.muted, fontSize: 12.5, lineHeight: 1.4 }}>{context}</div>
        </div>
        <div style={{ display: "grid", placeItems: "center", width: 28, height: 28, color: T.muted }}>
          <Icon name="x" size={15} />
        </div>
      </div>
      <div style={{ display: "grid", gap: 7, margin: "18px 0 4px" }}>
        {options.map((o, i) => {
          const k = o.k ?? 1;
          const pressed = o.rec && pk >= 0;
          const sc = o.rec && pk >= 0 && pk < 0.18 ? 0.975 : 1;
          return (
            <div
              key={i}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, minHeight: 43, padding: "9px 12px", borderRadius: 10,
                border: `1px solid ${o.rec ? (pressed ? T.accentEdge : "rgba(242,193,78,.35)") : T.tileEdge}`,
                background: o.rec ? (pressed ? T.accentDim : "rgba(242,193,78,.08)") : T.tile,
                opacity: k, transform: `translateY(${(1 - k) * 6}px) scale(${sc})`, color: T.text, fontSize: 13.5,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: o.rec ? 650 : 500, color: o.rec ? T.strong : T.text, display: "flex", alignItems: "center", gap: 7 }}>
                  {o.rec && <Icon name="sparkles" size={13} color={T.ai} />}
                  {o.label}
                </span>
                {o.hint && <span style={{ fontSize: 11, color: T.muted }}>{o.hint}</span>}
              </div>
              <Icon name={pressed ? "check" : "play"} size={14} color={pressed ? T.accent : T.faint} />
            </div>
          );
        })}
      </div>
    </Glass>
  );
};

/** Aviso proactivo (Core/Proactive): texto + acción */
export const NoticeCard: React.FC<{ t: number; title: string; text: string; action: string; press?: number }> = ({ t, title, text, action, press = 1e9 }) => {
  const pk = t - press;
  const on = pk >= 0;
  return (
    <Glass style={{ width: 430, padding: 18 }}>
      <div style={{ position: "absolute", left: 0, top: 14, bottom: 14, width: 3, borderRadius: 3, background: T.ai, boxShadow: `0 0 14px ${T.ai}` }} />
      <div style={{ display: "grid", gridTemplateColumns: "38px minmax(0,1fr) 28px", gap: 11, alignItems: "start" }}>
        <Mark icon="bell" color={T.ai} />
        <div>
          <div style={{ color: T.ai, fontSize: 10.5, fontWeight: 750, letterSpacing: ".08em", textTransform: "uppercase" }}>{title}</div>
          <div style={{ marginTop: 6, fontSize: 14.5, fontWeight: 650, lineHeight: 1.4, color: T.strong }}>{text}</div>
        </div>
        <div style={{ display: "grid", placeItems: "center", width: 28, height: 28, color: T.muted }}>
          <Icon name="x" size={15} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 16, paddingLeft: 49 }}>
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 7, height: 34, padding: "0 13px", borderRadius: 9, fontSize: 12.5, fontWeight: 700,
            color: on ? "#001419" : T.accent, background: on ? T.accent : T.accentDim, border: `1px solid ${T.accentEdge}`,
            transform: `scale(${on && pk < 0.16 ? 0.96 : 1})`, boxShadow: on ? `0 0 24px ${T.accent}66` : undefined,
          }}
        >
          <Icon name="rotateCcw" size={14} /> {action}
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", height: 34, padding: "0 12px", borderRadius: 9, fontSize: 12.5, color: T.muted, background: T.tile, border: `1px solid ${T.tileEdge}` }}>Cerrar</div>
      </div>
    </Glass>
  );
};

/** Tarjeta del transcriptor (osd/dictationCard.css): Escuchando… → Transcribiendo… → Pegado */
export const DictationCard: React.FC<{ t: number; state: "listening" | "transcribing" | "pasted"; since: number }> = ({ t, state, since }) => {
  const acc = state === "listening" ? "#22d3ee" : state === "transcribing" ? T.ai : T.ok;
  const title = state === "listening" ? "Escuchando…" : state === "transcribing" ? "Transcribiendo…" : "Pegado";
  const hint = state === "listening" ? "Haz una pausa para enviar" : state === "transcribing" ? "Esc cancela" : "Pegado donde escribías";
  return (
    <div
      style={{
        position: "relative", display: "grid", gridTemplateColumns: "42px minmax(0,1fr) auto", alignItems: "center", gap: 12, width: 340, minHeight: 72,
        padding: "12px 15px 12px 14px", overflow: "hidden", border: "1px solid rgba(191,219,229,.14)", borderRadius: 16, color: "#f5fafb",
        background: "linear-gradient(110deg, rgba(25,38,44,.92), rgba(10,15,20,.94) 58%)", boxShadow: "0 18px 48px rgba(0,0,0,.48), inset 0 1px rgba(255,255,255,.045)",
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 14, bottom: 14, width: 2, borderRadius: 2, background: acc, boxShadow: `0 0 12px ${acc}` }} />
      <div style={{ position: "relative", display: "grid", placeItems: "center", width: 42, height: 42, borderRadius: "50%", color: acc, background: `${acc}1f`, boxShadow: state === "listening" ? `0 0 0 4px ${acc}24, 0 0 16px ${acc}66` : undefined }}>
        {state === "transcribing" ? (
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${acc}40`, borderTopColor: acc, transform: `rotate(${(t - since) * 450}deg)` }} />
        ) : (
          <Icon name={state === "listening" ? "mic" : "check"} size={19} />
        )}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(165,224,233,.62)" }}>Transcriptor</div>
        <div style={{ marginTop: 3, fontSize: 15.5, fontWeight: 700 }}>{title}</div>
        <div style={{ marginTop: 2, fontSize: 11.5, color: "rgba(218,232,236,.6)" }}>{hint}</div>
      </div>
      {state === "listening" && (
        <div style={{ display: "flex", alignItems: "center", gap: 3, height: 28 }}>
          {Array.from({ length: 7 }).map((_, i) => {
            const h = 6 + 20 * Math.abs(Math.sin((t - since) * (6 + i * 1.3) + i));
            return <div key={i} style={{ width: 3, height: h, borderRadius: 2, background: acc, opacity: 0.85 }} />;
          })}
        </div>
      )}
    </div>
  );
};

/** Cabecera de la captura del escritorio (textos de snapshot.* en es.json) */
export const CaptureCard: React.FC<{ t: number; chips: { label: string; icon: IconName; at: number }[]; at: number; dur: number }> = ({ t, chips, at, dur }) => {
  const p = clamp01((t - at) / dur);
  return (
    <Glass style={{ width: 470, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Mark icon="camera" />
        <div>
          <div style={{ color: T.accent, fontSize: 10.5, fontWeight: 750, letterSpacing: ".08em", textTransform: "uppercase" }}>Capturar workspace</div>
          <div style={{ marginTop: 4, fontSize: 15.5, fontWeight: 700, color: T.strong }}>Capturando espacio de trabajo en vivo…</div>
        </div>
      </div>
      <div style={{ height: 4, borderRadius: 4, background: T.tile, marginTop: 16, overflow: "hidden" }}>
        <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${T.accent}, ${T.ok})`, boxShadow: `0 0 12px ${T.accent}` }} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 14 }}>
        {chips.map((c, i) => {
          const k = ease.out(clamp01((t - c.at) / 0.2));
          const on = t >= c.at;
          return (
            <div
              key={i}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 9, fontSize: 12.5, fontWeight: 600,
                border: `1px solid ${on ? T.accentEdge : T.tileEdge}`, background: on ? T.accentDim : T.tile, color: on ? T.strong : T.faint,
                transform: `scale(${0.9 + 0.1 * k})`, opacity: 0.35 + 0.65 * k,
              }}
            >
              <Icon name={on ? "check" : c.icon} size={13} color={on ? T.ok : T.faint} />
              {c.label}
            </div>
          );
        })}
      </div>
    </Glass>
  );
};

/** Perfil de pantallas detectado (workspace_profiles.* en es.json) */
export const ProfileCard: React.FC<{ t: number; name: string; at: number }> = ({ t, name, at }) => {
  const k = ease.out(clamp01((t - at) / 0.25));
  return (
    <Glass style={{ width: 420, padding: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "38px minmax(0,1fr)", gap: 11, alignItems: "center" }}>
        <Mark icon="monitorSmartphone" />
        <div>
          <div style={{ color: T.accent, fontSize: 10.5, fontWeight: 750, letterSpacing: ".08em", textTransform: "uppercase" }}>Perfiles de pantallas</div>
          <div style={{ marginTop: 4, fontSize: 15, fontWeight: 700, color: T.strong }}>Perfil detectado: {name}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, padding: "9px 12px", borderRadius: 10, background: T.tile, border: `1px solid ${T.tileEdge}`, fontSize: 12.5 }}>
        <span>Detección automática</span>
        <div style={{ width: 34, height: 19, borderRadius: 99, background: k > 0.5 ? T.accent : "#333", position: "relative", boxShadow: k > 0.5 ? `0 0 12px ${T.accent}88` : undefined }}>
          <div style={{ position: "absolute", top: 2, left: 2 + 15 * k, width: 15, height: 15, borderRadius: 99, background: "#fff" }} />
        </div>
      </div>
    </Glass>
  );
};

/** Tarjeta de agente (ConfigPanel/McpAgentConnections) */
export const AGENTES = [
  { n: "Claude Code", v: "Anthropic", img: "img/agentes/claude.svg" },
  { n: "Codex", v: "OpenAI", img: "img/agentes/codex.png" },
  { n: "Cursor", v: "Anysphere", img: "img/agentes/cursor.svg" },
  { n: "Antigravity", v: "Google", img: "img/agentes/antigravity.svg" },
  { n: "GitHub Copilot", v: "GitHub", img: "img/agentes/githubcopilot.svg" },
];
export const AgentCard: React.FC<{ t: number; a: (typeof AGENTES)[number]; on: number }> = ({ t, a, on }) => {
  const c = t >= on;
  const k = ease.out(clamp01((t - on) / 0.2));
  return (
    <div
      style={{
        width: 190, padding: 15, borderRadius: 14, fontFamily: UI_FONT,
        border: `1px solid ${c ? "rgba(0,210,255,.4)" : "rgba(255,255,255,.09)"}`, background: c ? "rgba(0,210,255,.06)" : "rgba(22,22,22,.94)",
        boxShadow: `0 20px 50px rgba(0,0,0,.5)${c ? `, 0 0 ${24 * (1 - 0.5 * k)}px rgba(0,210,255,${0.35 * (1 - 0.6 * k)})` : ""}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 12, background: "#151515", border: "1px solid #ffffff12" }}>
          <Img src={staticFile(a.img)} style={{ width: 26, height: 26, objectFit: "contain" }} />
        </div>
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 20, fontSize: 9.5, fontWeight: 700, padding: "5px 8px",
            color: c ? "#0b1a14" : T.muted, background: c ? T.accent : "rgba(255,255,255,.06)", transform: `scale(${c ? 1 + 0.25 * (1 - k) : 1})`,
          }}
        >
          {c && <Icon name="check" size={10} />}
          {c ? "Conectado" : "Sin conectar"}
        </div>
      </div>
      <div style={{ marginTop: 14, fontSize: 14.5, fontWeight: 650, color: T.strong, letterSpacing: "-.02em" }}>{a.n}</div>
      <div style={{ marginTop: 3, fontSize: 10.5, color: T.muted }}>{a.v}</div>
    </div>
  );
};
