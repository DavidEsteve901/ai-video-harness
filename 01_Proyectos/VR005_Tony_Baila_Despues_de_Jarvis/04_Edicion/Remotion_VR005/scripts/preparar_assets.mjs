// Copia los dos vídeos a public/media.  node scripts/preparar_assets.mjs [--proyecto <carpeta VR005>]
import { mkdirSync, copyFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pi = process.argv.indexOf("--proyecto");
const proyecto = pi > -1 ? resolve(process.argv[pi + 1]) : resolve(root, "../..");
mkdirSync(join(root, "public/media"), { recursive: true });
copyFileSync(join(proyecto, "03_Recursos/Tony_bailando.mp4"), join(root, "public/media/baile.mp4"));
copyFileSync(join(proyecto, "02_Brutos/Palmadas_demo_original.mp4"), join(root, "public/media/demo.mp4"));
console.log("OK -> public/media");
