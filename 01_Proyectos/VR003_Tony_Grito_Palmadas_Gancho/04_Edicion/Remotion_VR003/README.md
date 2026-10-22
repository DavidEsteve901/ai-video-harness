# VR003 — Tony grito + palmadas (Remotion)

Vertical 1080×1920, 60 fps, 16,9 s. Dos composiciones: `VR003-ConVoz` y `VR003-SinVoz` (misma pieza; la segunda sin locución).

| Archivo | Qué es |
| --- | --- |
| `edit.config.json` | Tiempos de cada escena, de la demo (tramos y velocidad) y de las líneas de voz |
| `scripts/preparar_assets.mjs` | Copia los recursos a `public/`, normaliza la voz y **sintetiza los efectos de sonido** |
| `src/VR003.tsx` | Montaje: escenas, textos meme, círculo/flecha, sacudidas, flashes y audio |
| `src/Root.tsx` | Registra las dos composiciones |

## Reproducir (node_modules NO vive en Drive)

```powershell
$src='…\Videos_Rapidos\01_Proyectos\VR003_Tony_Grito_Palmadas_Gancho'
$w='C:\Herramientas\_work\VR003'
robocopy "$src\04_Edicion\Remotion_VR003" $w /MIR /XD node_modules out
New-Item -ItemType Junction -Path "$w\node_modules" -Target 'C:\Herramientas\Videos Workspace launcher\video-editor\node_modules'
cd $w
node scripts/preparar_assets.mjs --proyecto $src
npm run dev                                   # Remotion Studio
npx remotion render src/index.ts VR003-ConVoz out/raw_ConVoz.mp4 --crf=16 --pixel-format=yuv420p
ffmpeg -i out/raw_ConVoz.mp4 -c:v copy -af "alimiter=limit=0.89:level=false" -c:a aac -b:a 192k out/VR003_ConVoz.mp4
```

Tras renderizar se pasa un limitador al audio (el grito del meme va a 0 dB y se suma con los efectos). Repite con `VR003-SinVoz`.

## V2 «Tony se entera»

Composiciones `VR003-V2-ConVoz` y `VR003-V2-SinVoz` (15 s). Tiempos y textos: `edit.v2.json`; montaje: `src/VR003V2.tsx` (reutiliza `Cap`, `At`, `Stroke` de `VR003.tsx`). `preparar_assets.mjs` también deja `audio/v2_0N.wav` (voz con una **ganancia común** medida sobre todas las tomas) y `sfx_tick.wav`.

```powershell
npx remotion render src/index.ts VR003-V2-ConVoz out/raw_V2_ConVoz.mp4 --crf=16 --pixel-format=yuv420p --concurrency=8
ffmpeg -i out/raw_V2_ConVoz.mp4 -c:v copy -af "loudnorm=I=-13:TP=-1.5:LRA=14,volume=2.5dB,alimiter=limit=0.89:level=false" -c:a aac -b:a 192k out/VR003_V2_ConVoz.mp4
```
