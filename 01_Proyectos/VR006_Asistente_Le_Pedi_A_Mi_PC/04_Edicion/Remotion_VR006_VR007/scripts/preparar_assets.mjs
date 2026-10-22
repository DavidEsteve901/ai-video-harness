// Prepara los recursos de VR006 (asistente) y VR007 (cuenta atrás) desde los brutos y el pack de sonidos.
//   node scripts/preparar_assets.mjs --grabaciones <Grabaciones_Personales> --senior <Video Senior.mp4> \
//        --cohete <clip cohete.mp4> --sfx <carpeta 'PACK SONIDOS 2025 (manuDT)'>
// Requiere ffmpeg en el PATH. La voz sale de voz/generar_voz.py (public/vo/zip/000N.wav).
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
const grab = arg("grabaciones"), senior = arg("senior"), cohete = arg("cohete"), sfx = arg("sfx");
const pub = join(root, "public");
for (const d of ["media", "audio"]) mkdirSync(join(pub, d), { recursive: true });
const need = (p) => { if (!existsSync(p)) throw new Error("No encuentro " + p); return p; };
const ff = (a) => { const r = spawnSync("ffmpeg", ["-v", "error", "-y", ...a], { stdio: "inherit" }); if (r.status) throw new Error("ffmpeg: " + a.join(" ")); };
const enc = ["-an", "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", "-movflags", "+faststart"];

// Concatena tramos con su velocidad; `post` = filtro final por salida; `hold` = segundos que se congela el último fotograma
const cutsGraph = (cuts, fps) =>
  cuts.map((c, i) => `[0:v]trim=start=${c.from}:end=${c.to},setpts=(PTS-STARTPTS)/${c.speed},fps=${fps}[v${i}]`).join(";") +
  ";" + cuts.map((_, i) => `[v${i}]`).join("") + `concat=n=${cuts.length}:v=1:a=0[cat]`;

// ── VR006: asistente. Dos vistas del mismo montaje: pantalla completa y zoom a la tarjeta
{
  const a = cfg.asistente, c = a.cardCrop, src = need(join(grab, "01_Brutos", "T01_Tutorial_Desde_Cero", a.src));
  const g = cutsGraph(a.cuts, cfg.fps);
  const tail = `tpad=stop_mode=clone:stop_duration=3`;
  ff(["-i", src, "-filter_complex", `${g};[cat]scale=1080:608:flags=lanczos,${tail},trim=duration=${a.duration},setpts=PTS-STARTPTS[o]`, "-map", "[o]", ...enc, join(pub, "media", "asist_full.mp4")]);
  ff(["-i", src, "-filter_complex", `${g};[cat]crop=${c.w}:${c.h}:${c.x}:${c.y},scale=900:600:flags=lanczos,unsharp=3:3:0.6,${tail},trim=duration=${a.duration},setpts=PTS-STARTPTS[o]`, "-map", "[o]", ...enc, join(pub, "media", "asist_card.mp4")]);
}

// ── VR007: cohete + escritorio del Senior
{
  const r = cfg.cuentaatras.rocket;
  ff(["-ss", String(r.from), "-t", String((r.to - r.from) / r.speed), "-i", need(cohete),
    "-vf", `setpts=(PTS-STARTPTS)/${r.speed},fps=${cfg.fps},scale=1080:608:flags=lanczos`, ...enc, join(pub, "media", "rocket.mp4")]);
  const s = cfg.cuentaatras.senior;
  ff(["-i", need(senior), "-filter_complex", `${cutsGraph(s.cuts, cfg.fps)};[cat]scale=1080:608:flags=lanczos,tpad=stop_mode=clone:stop_duration=3[o]`, "-map", "[o]", ...enc, join(pub, "media", "senior.mp4")]);
}

// ── Voz: normaliza las 5 tomas (a1-a4 del asistente, b1 de la cuenta atrás)
["a1", "a2", "a3", "a4", "b1"].forEach((n, i) => {
  ff(["-i", need(join(pub, "vo", "zip", String(i + 1).padStart(4, "0") + ".wav")), "-af", "loudnorm=I=-15:TP=-1.5:LRA=7,aresample=48000", join(pub, "audio", `${n}.wav`)]);
});

// ── Efectos del pack (pocos y limpios): cortes y normalización de nivel
const P = (f) => need(join(sfx, f));
ff(["-i", P("BOOM (IMPACTO)/Vine Boom dramatico.mp4"), "-vn", "-t", "1.2", "-af", "afade=t=out:st=0.9:d=0.3,volume=0.8", join(pub, "audio", "hook_boom.wav")]);
ff(["-i", P("CLICK/Mouse Click 1.wav"), "-af", "volume=1.0", join(pub, "audio", "click.wav")]);
ff(["-i", P("DING/quick-win.mp3"), "-af", "afade=t=out:st=1.2:d=0.5", join(pub, "audio", "ding.wav")]);
ff(["-i", P("BOOM (IMPACTO)/Bass Impact sound Effect ( By Ashish Editz ) .wav"), "-t", "1.6", "-af", "afade=t=out:st=1.1:d=0.5", join(pub, "audio", "impact.wav")]);
ff(["-ss", "0", "-t", "0.25", "-i", P("ALARMA/countdown-beep-tones-more-higher-tone-version-SBA-300419347.mp3"), "-af", "afade=t=out:st=0.18:d=0.07", join(pub, "audio", "beep.wav")]);
ff(["-ss", "10", "-t", "0.7", "-i", P("ALARMA/countdown-beep-tones-more-higher-tone-version-SBA-300419347.mp3"), "-af", "afade=t=out:st=0.55:d=0.15", join(pub, "audio", "beep_long.wav")]);

console.log("OK -> public/media, public/audio");
