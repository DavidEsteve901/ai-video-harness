// Prepara los recursos de VR010: un solo clip 2560x1440 con los cortes del tutorial + efectos propios.
//   node scripts/preparar_assets.mjs --src <T01_Tutorial_ES_1440p.mp4> --sfx <Biblioteca_Sonidos/sfx_propios>
// Requiere ffmpeg en el PATH.
import { spawnSync } from "node:child_process";
import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cfg = JSON.parse(readFileSync(join(root, "edit.config.json"), "utf8"));
const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  if (i < 0) throw new Error(`Falta --${n}`);
  return process.argv[i + 1];
};
const src = arg("src"), sfx = arg("sfx");
const pub = join(root, "public");
for (const d of ["media", "audio"]) mkdirSync(join(pub, d), { recursive: true });
const need = (p) => { if (!existsSync(p)) throw new Error("No encuentro " + p); return p; };
const ff = (a) => { const r = spawnSync("ffmpeg", ["-v", "error", "-y", ...a], { stdio: "inherit" }); if (r.status) throw new Error("ffmpeg: " + a.join(" ")); };

const g =
  cfg.cuts.map((c, i) => `[0:v]trim=start=${c.from}:end=${c.to},setpts=(PTS-STARTPTS)/${c.speed},fps=${cfg.fps}[v${i}]`).join(";") +
  ";" + cfg.cuts.map((_, i) => `[v${i}]`).join("") + `concat=n=${cfg.cuts.length}:v=1:a=0[cat]`;
ff(["-i", need(src), "-filter_complex", `${g};[cat]tpad=stop_mode=clone:stop_duration=3,trim=duration=${cfg.duration},setpts=PTS-STARTPTS[o]`, "-map", "[o]",
  "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", "-movflags", "+faststart", join(pub, "media", "main.mp4")]);

for (const n of ["boom", "ding", "hit", "pop", "whoosh", "riser"]) {
  ff(["-i", need(join(sfx, `sfx_${n}.wav`)), "-ar", "48000", join(pub, "audio", `${n}.wav`)]);
}
console.log("OK -> public/media, public/audio");
