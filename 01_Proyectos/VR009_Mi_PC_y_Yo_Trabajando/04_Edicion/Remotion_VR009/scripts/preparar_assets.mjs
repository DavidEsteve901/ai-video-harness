// Prepara los recursos de VR009 desde el bruto del asistente y la locución.
//   node scripts/preparar_assets.mjs --grabaciones <Grabaciones_Personales> --sfx <Biblioteca_Sonidos/sfx_propios> --voz <03_Recursos/voz/locucion_tomas>
// Requiere ffmpeg en el PATH. La voz sale de Biblioteca_Voces/herramientas/locutor.py con 03_Recursos/voz/plan_vocal.json.
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
const grab = arg("grabaciones"), sfx = arg("sfx"), voz = arg("voz");
const pub = join(root, "public");
for (const d of ["media", "audio"]) mkdirSync(join(pub, d), { recursive: true });
const need = (p) => { if (!existsSync(p)) throw new Error("No encuentro " + p); return p; };
const ff = (a) => { const r = spawnSync("ffmpeg", ["-v", "error", "-y", ...a], { stdio: "inherit" }); if (r.status) throw new Error("ffmpeg: " + a.join(" ")); };
const enc = ["-an", "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", "-movflags", "+faststart"];

const cutsGraph = (cuts, fps) =>
  cuts.map((c, i) => `[0:v]trim=start=${c.from}:end=${c.to},setpts=(PTS-STARTPTS)/${c.speed},fps=${fps}[v${i}]`).join(";") +
  ";" + cuts.map((_, i) => `[v${i}]`).join("") + `concat=n=${cuts.length}:v=1:a=0[cat]`;

// Dos vistas del mismo montaje: pantalla completa y zoom a la tarjeta del asistente
{
  const c = cfg.cardCrop, src = need(join(grab, "01_Brutos", "T01_Tutorial_Desde_Cero", cfg.src));
  const g = cutsGraph(cfg.cuts, cfg.fps);
  const tail = `tpad=stop_mode=clone:stop_duration=3`;
  ff(["-i", src, "-filter_complex", `${g};[cat]scale=1080:608:flags=lanczos,${tail},trim=duration=${cfg.duration},setpts=PTS-STARTPTS[o]`, "-map", "[o]", ...enc, join(pub, "media", "asist_full.mp4")]);
  ff(["-i", src, "-filter_complex", `${g};[cat]crop=${c.w}:${c.h}:${c.x}:${c.y},scale=900:600:flags=lanczos,unsharp=3:3:0.6,${tail},trim=duration=${cfg.duration},setpts=PTS-STARTPTS[o]`, "-map", "[o]", ...enc, join(pub, "media", "asist_card.mp4")]);
}

// Voz: normaliza las tomas (v1..v4 = locucion_tomas/0001..0004.wav)
["v1", "v2", "v3", "v4"].forEach((n, i) => {
  ff(["-i", need(join(voz, String(i + 1).padStart(4, "0") + ".wav")), "-af", "loudnorm=I=-15:TP=-1.5:LRA=7,aresample=48000", join(pub, "audio", `${n}.wav`)]);
});

// Efectos propios sintetizados (sin derechos)
for (const n of ["boom", "ding", "hit", "pop", "whoosh"]) {
  ff(["-i", need(join(sfx, `sfx_${n}.wav`)), "-ar", "48000", join(pub, "audio", `${n}.wav`)]);
}
console.log("OK -> public/media, public/audio");