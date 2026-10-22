// Prepara los recursos que usa la composición a partir de 02_Brutos, 03_Recursos y las tomas de voz de public/vo.
//   node scripts/preparar_assets.mjs [--brutos <carpeta>] [--recursos <carpeta>]
// Requiere ffmpeg en el PATH. Lee edit.config.json (tiempos de las tomas).
import { spawnSync } from "node:child_process";
import { readFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cfg = JSON.parse(readFileSync(join(root, "edit.config.json"), "utf8"));
const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : d;
};
const brutos = resolve(root, arg("brutos", "../../02_Brutos"));
const recursos = resolve(root, arg("recursos", "../../03_Recursos"));
const pub = join(root, "public");
for (const d of ["media", "audio", "img"]) mkdirSync(join(pub, d), { recursive: true });

const ff = (args) => {
  const r = spawnSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
  if (r.status !== 0) throw new Error("ffmpeg falló: " + args.join(" "));
};
const need = (p) => {
  if (!existsSync(p)) throw new Error("No encuentro " + p);
  return p;
};
const copy = (from, to) => copyFileSync(need(from), join(pub, to));
const vids = join(recursos, "videos_tony");
const fotos = join(recursos, "fotos");

// 1) Gancho: el clip de RDJ donde se oye el grito, recortado a la cara y ampliado con lanczos + nitidez
const hc = cfg.hook.crop;
ff([
  "-ss", String(cfg.hook.srcStart), "-t", String(cfg.hook.duration), "-i", need(join(vids, cfg.hook.src)),
  "-vf", `crop=${hc.w}:${hc.h}:${hc.x}:${hc.y},scale=1080:810:flags=lanczos,unsharp=5:5:0.8:3:3:0.0,fps=60`,
  "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
  join(pub, "media", "hook_up.mp4"),
]);

// 2) Clip normal de "Wake up, daddy's home": copia + su audio normalizado (la voz es muy baja en el original)
copy(join(vids, cfg.wake.src), "media/wake.mp4");
ff([
  "-ss", String(cfg.wake.srcStart), "-t", String(cfg.wake.srcEnd - cfg.wake.srcStart), "-i", join(vids, cfg.wake.src), "-vn",
  "-af", "loudnorm=I=-15:TP=-1.5:LRA=7", "-ar", "48000", join(pub, "audio", "wake_normal.wav"),
]);

// 3) Plano del monitor gigante (solo un fotograma con el verde recortado) para meter la demo dentro
ff([
  "-ss", String(cfg.plateB.frameAt), "-i", need(join(vids, cfg.plateB.greenSrc)), "-frames:v", "1",
  "-vf", "format=rgba,chromakey=color=0x00FF00:similarity=0.12:blend=0.06,despill=type=green:mix=0.5",
  join(pub, "media", "plateB.png"),
]);

// 4) Demo real, alarma y fotos (los memes son fotos nítidas, no GIFs ampliados)
copy(join(brutos, "Palmadas_demo_original.mp4"), "media/demo.mp4");
copy(join(recursos, "sonidos", "danger-alarm-sound-effect-meme.mp3"), "audio/alarm.mp3");
copy(join(fotos, "g2txj6kqv6xf1.png"), "img/jarvis_face.png");
copy(join(fotos, "images (2).jpg"), "img/yo.jpg"); // Tony con los brazos abiertos (se rodea con círculo y flecha)
copy(join(fotos, "images (7).jpg"), "img/scream.jpg"); // Tony gritando
copy(join(fotos, "descarga.jpg"), "img/chill.jpg"); // Tony relajado
// Pegatina con fondo blanco -> PNG con transparencia (flota sin marco)
ff(["-i", need(join(fotos, "images (3).jpg")), "-vf", "format=rgba,colorkey=color=0xFFFFFF:similarity=0.14:blend=0.1", join(pub, "img", "bow.png")]);

// 5) Locución: normaliza cada toma generada con Local Voice Studio (voz/generar_voz.py -> public/vo/zip)
for (let i = 1; i <= cfg.vo.length; i++) {
  const take = join(pub, "vo", "zip", String(i).padStart(4, "0") + ".wav");
  ff(["-i", need(take), "-af", "loudnorm=I=-15:TP=-1.5:LRA=7,aresample=48000", join(pub, "audio", `vo_${i}.wav`)]);
}

console.log("OK -> public/media, public/audio, public/img");
