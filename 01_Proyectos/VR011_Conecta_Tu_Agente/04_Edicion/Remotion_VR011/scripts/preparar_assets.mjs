// Prepara los recursos de VR011 (iconos, voz, efectos, tipografias) en public/.
//   node scripts/preparar_assets.mjs --proyecto <carpeta VR011> --sfx <Biblioteca_Sonidos/sfx_propios> --wl <WorkspaceLauncher (repo, solo lectura)>
// Requiere ffmpeg en el PATH. La voz sale de 03_Recursos/voz/locucion_final_gemini.wav (Gemini es-es-training-9, ver 03_Recursos/voz/gemini/).
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n) => { const i = process.argv.indexOf(`--${n}`); if (i < 0) throw new Error(`Falta --${n}`); return process.argv[i + 1]; };
const proy = arg("proyecto"), sfx = arg("sfx"), wl = arg("wl");
const pub = join(root, "public");
for (const d of ["img", "audio"]) mkdirSync(join(pub, d), { recursive: true });
const need = (p) => { if (!existsSync(p)) throw new Error("No encuentro " + p); return p; };
const ff = (a) => { const r = spawnSync("ffmpeg", ["-v", "error", "-y", ...a], { stdio: "inherit" }); if (r.status) throw new Error("ffmpeg: " + a.join(" ")); };

// Iconos de agentes y apps (origen: repo del producto; simple-icons se tiñe con su color de marca)
const ic = join(proy, "03_Recursos", "iconos");
copyFileSync(need(join(ic, "Square150x150Logo.png")), join(pub, "img", "wl.png"));
copyFileSync(need(join(ic, "codex.png")), join(pub, "img", "codex.png"));
copyFileSync(need(join(ic, "antigravity.svg")), join(pub, "img", "antigravity.svg"));
const tint = { claude: "#D97757", opencode: "#1f2538", googlegemini: "#6E8BE8", cursor: "#1f2538" };
for (const [n, c] of Object.entries(tint)) {
  const s = readFileSync(need(join(ic, `${n}.svg`)), "utf8").replace("<svg ", `<svg fill="${c}" `);
  writeFileSync(join(pub, "img", `${n}.svg`), s);
}
const apps = join(wl, "frontend", "public", "images", "apps");
for (const n of ["chrome", "terminal", "vscode"]) copyFileSync(need(join(apps, `${n}.svg`)), join(pub, "img", `${n}.svg`));
copyFileSync(need(join(wl, "frontend", "src", "assets", "custom_icons", "obsidian.svg")), join(pub, "img", "obsidian.svg"));

// Voz: la mezcla completa (las pausas ya van en la mezcla; los tiempos de cada toma estan en edit.config.json)
ff(["-i", need(join(proy, "03_Recursos", "voz", "locucion_final_gemini.wav")), "-af", "loudnorm=I=-15:TP=-1.5:LRA=7,aresample=48000", join(pub, "audio", "voz.wav")]);

// Efectos propios sintetizados (sin derechos)
for (const n of ["pop", "whoosh", "ding", "scribble", "hit"]) ff(["-i", need(join(sfx, `sfx_${n}.wav`)), "-ar", "48000", join(pub, "audio", `${n}.wav`)]);
console.log("OK -> public/img, public/audio");