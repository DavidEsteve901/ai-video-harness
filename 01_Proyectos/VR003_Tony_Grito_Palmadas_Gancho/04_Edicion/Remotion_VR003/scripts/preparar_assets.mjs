// Prepara los recursos de la composición a partir de 02_Brutos y 03_Recursos.
//   node scripts/preparar_assets.mjs
// Requiere ffmpeg en el PATH. Los efectos de sonido se sintetizan aquí (sin derechos de autor).
import { spawnSync } from "node:child_process";
import { mkdirSync, copyFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Si trabajas en una copia local (node_modules no vive en Drive), indica la carpeta del vídeo:
//   node scripts/preparar_assets.mjs --proyecto "G:\...\VR003_Tony_Grito_Palmadas_Gancho"
const pi = process.argv.indexOf("--proyecto");
const proyecto = pi > -1 ? resolve(process.argv[pi + 1]) : resolve(root, "../..");
const brutos = join(proyecto, "02_Brutos");
const recursos = join(proyecto, "03_Recursos");
const pub = join(root, "public");
for (const d of ["media", "audio"]) mkdirSync(join(pub, d), { recursive: true });

const ff = (args) => {
  const r = spawnSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
  if (r.status !== 0) throw new Error("ffmpeg falló: " + args.join(" "));
};
const copy = (from, to) => {
  if (!existsSync(from)) throw new Error("No encuentro " + from);
  copyFileSync(from, join(pub, to));
};

// Vídeos y fotos
copy(join(brutos, "Palmadas_demo_original.mp4"), "media/demo.mp4");
copy(join(recursos, "videos_tony", "Tony-stark-gritando-SnapYT.App.mp4"), "media/scream.mp4");
copy(join(recursos, "fotos", "complete-this-version-of-meme-v0-31rzleau9eoh1.webp"), "media/jarvis.webp");
copy(join(recursos, "fotos", "images (2).jpg"), "media/tony_brazos.jpg");
copy(join(recursos, "Logo_WorkspaceLauncher.png"), "media/logo.png");
// V2: más imágenes de Tony para no repetir la misma foto
copy(join(recursos, "videos_tony", "tony-taller-v3.mp4"), "media/taller.mp4"); // taller con hologramas (sin audio)
copy(join(recursos, "fotos", "images (5).jpg"), "media/snap.jpg"); // Tony con el guantelete (chasquido)
copy(join(recursos, "fotos", "images (8).jpg"), "media/hud.jpg"); // Tony con el HUD de Jarvis
copy(join(recursos, "sonidos", "danger-alarm-sound-effect-meme.mp3"), "audio/alarm.mp3");

// Voz (si ya está generada): normaliza a ~-15 LUFS
const vozDir = join(recursos, "voz");
if (existsSync(vozDir)) {
  for (const f of readdirSync(vozDir).filter((x) => /^voz_\d+\.wav$/.test(x))) {
    ff(["-i", join(vozDir, f), "-af", "loudnorm=I=-15:TP=-1.5:LRA=7,aresample=48000", "-ar", "48000", join(pub, "audio", f)]);
  }
}

// Voz V2 («Tony se entera»): tomas cortas → una ganancia COMÚN (medida sobre todas juntas) para llegar a ~-18 LUFS (la mezcla final se sube luego)
// sin que loudnorm destroce frases de 0,6 s ni cambie el volumen relativo entre frases.
const vozV2 = join(recursos, "voz_v2");
if (existsSync(vozV2)) {
  const tomas = readdirSync(vozV2).filter((x) => /^voz_v2_\d+\.wav$/.test(x)).sort();
  if (tomas.length) {
    const args = tomas.flatMap((f) => ["-i", join(vozV2, f)]);
    const medida = spawnSync(
      "ffmpeg",
      ["-nostats", ...args, "-filter_complex", `${tomas.map((_, i) => `[${i}:a]`).join("")}concat=n=${tomas.length}:v=0:a=1,ebur128=peak=true`, "-f", "null", "-"],
      { encoding: "utf8" },
    );
    const lufs = [...(medida.stderr || "").matchAll(/I:\s+(-?\d+(?:\.\d+)?) LUFS/g)].pop();
    const ganancia = lufs ? -18 - parseFloat(lufs[1]) : 0;
    tomas.forEach((f, i) => {
      const n = String(i + 1).padStart(2, "0");
      ff(["-i", join(vozV2, f), "-af", `volume=${ganancia.toFixed(2)}dB,alimiter=limit=0.8:level=false,aresample=48000`, "-ar", "48000", join(pub, "audio", `v2_${n}.wav`)]);
    });
    console.log(`voz V2: ${tomas.length} tomas, ganancia ${ganancia.toFixed(2)} dB`);
  }
}

// Efectos de sonido sintetizados (ver 03_Recursos/sonidos/LEEME_SFX.md en la carpeta de ideas)
const synth = (name, expr, d, extra = "") =>
  ff(["-f", "lavfi", "-i", `aevalsrc='${expr}':d=${d}:s=48000`, "-af", `${extra}alimiter=limit=0.95`, join(pub, "audio", name)]);
synth("sfx_whoosh.wav", "(random(0)-0.5)*1.6*pow(sin(PI*t/0.45),2)*(0.4+0.6*t/0.45)", 0.45);
synth("sfx_boom.wav", "0.95*sin(2*PI*(46+130*exp(-14*t))*t)*exp(-3.2*t)+0.3*(random(0)-0.5)*exp(-40*t)", 1.0);
synth("sfx_pop.wav", "0.7*sin(2*PI*(900-4500*t)*t)*exp(-38*t)", 0.12);
synth("sfx_ding.wav", "0.5*(sin(2*PI*1318*t)+0.6*sin(2*PI*1760*t))*exp(-4.5*t)", 0.9);
synth("sfx_scribble.wav", "(random(0)-0.5)*1.4*(0.55+0.45*sin(2*PI*31*t))*sin(PI*t/0.4)", 0.4, "highpass=f=2200,");
synth("sfx_riser.wav", "0.55*sin(2*PI*(200*t+1000*t*t))*pow(t/1.1,1.6)+0.25*(random(0)-0.5)*pow(t/1.1,2)", 1.1);
synth("sfx_hit.wav", "0.9*sin(2*PI*(90+300*exp(-30*t))*t)*exp(-9*t)+0.35*(random(0)-0.5)*exp(-70*t)", 0.35);

// Ventanas que aparecen (V2): suave, sin riser ni boom. Aire corto + golpecito grave + blip que sube; 3 tonos.
[[1, 330], [2, 420], [3, 520]].forEach(([n, f]) =>
  synth(
    `sfx_win${n}.wav`,
    `0.5*(random(0)-0.5)*exp(-16*t)*(1-exp(-300*t))+0.45*sin(2*PI*68*t)*exp(-26*t)+0.22*sin(2*PI*(${f}+1500*t)*t)*exp(-20*t)*(1-exp(-400*t))`,
    0.26,
    "highpass=f=60,lowpass=f=7000,",
  ),
);
synth("sfx_tick.wav", "1.1*(random(0)-0.5)*exp(-110*t)+0.25*sin(2*PI*2400*t)*exp(-140*t)", 0.06, "highpass=f=900,");

console.log("OK -> public/media, public/audio");
