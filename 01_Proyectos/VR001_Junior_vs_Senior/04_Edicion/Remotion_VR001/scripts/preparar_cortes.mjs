// Genera los clips que usa la composición a partir de los brutos.
//   node scripts/preparar_cortes.mjs [--raw <carpeta brutos>] [--music <mp3 original>]
// Requiere ffmpeg en el PATH. Lee edit.config.json (tiempos y velocidades).
import { spawnSync } from "node:child_process";
import { readFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cfg = JSON.parse(readFileSync(join(root, "edit.config.json"), "utf8"));
const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : def;
};
const raw = resolve(root, arg("raw", "../../02_Brutos"));
const musicSrc = arg("music", null);
const out = join(root, "public", "clips");
mkdirSync(out, { recursive: true });
mkdirSync(join(root, "public", "audio"), { recursive: true });

const run = (args) => {
  const r = spawnSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
  if (r.status !== 0) throw new Error("ffmpeg falló: " + args.join(" "));
};
const enc = ["-an", "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", "-g", "30", "-movflags", "+faststart"];

// JUNIOR: un único tramo acelerado, duración = duration (el resto del bruto se descarta)
const j = cfg.junior;
run([
  "-ss", String(j.start), "-t", String(cfg.duration * j.speed + 0.5),
  "-i", join(raw, j.src),
  "-vf", `setpts=(PTS-STARTPTS)/${j.speed},fps=${cfg.fps},scale=1280:720:flags=lanczos`,
  "-t", String(cfg.duration), ...enc, join(out, "junior.mp4"),
]);

// SENIOR: segmentos concatenados, cada uno con su velocidad
const s = cfg.senior;
const parts = s.segments.map(
  (g, i) =>
    `[0:v]trim=start=${g.start}:end=${g.end},setpts=(PTS-STARTPTS)/${g.speed},fps=${cfg.fps},scale=1920:1080:flags=lanczos[v${i}]`,
);
const concat = s.segments.map((_, i) => `[v${i}]`).join("") + `concat=n=${s.segments.length}:v=1:a=0[v]`;
run([
  "-i", join(raw, s.src),
  "-filter_complex", `${parts.join(";")};${concat}`,
  "-map", "[v]", "-t", String(cfg.duration), ...enc, join(out, "senior.mp4"),
]);

// Música (copia del recurso original) y efecto de clic sintetizado
if (musicSrc && existsSync(musicSrc)) copyFileSync(musicSrc, join(root, "public", "audio", "scopin.mp3"));
run([
  "-f", "lavfi", "-i",
  "aevalsrc='0.9*exp(-70*t)*sin(2*PI*2400*t)+0.5*exp(-120*t)*(random(0)-0.5)':d=0.12:s=48000",
  join(root, "public", "audio", "click.wav"),
]);
console.log("OK -> public/clips/junior.mp4, public/clips/senior.mp4, public/audio/click.wav");
