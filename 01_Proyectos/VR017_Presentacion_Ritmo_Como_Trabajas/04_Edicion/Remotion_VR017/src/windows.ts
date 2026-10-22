// Ventanas abstractas (metáforas de programas) para las escenas de lanzamiento; la interfaz de la app se muestra con capturas reales.
export type Kind = "code" | "browser" | "notes" | "terminal" | "music" | "chat" | "design" | "reader";
export const ACCENT: Record<Kind, string> = {
  code: "#7C8CFF", browser: "#5AB0FF", notes: "#C9A7FF", terminal: "#9AA4B8", music: "#FF7AB6", chat: "#6EE7D8", design: "#FF9F6E", reader: "#E9E6DD",
};
