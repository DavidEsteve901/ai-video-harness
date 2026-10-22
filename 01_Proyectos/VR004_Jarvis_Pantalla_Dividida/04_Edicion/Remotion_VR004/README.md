# VR004 — Jarvis pantalla dividida (Remotion)

1080×1920, 60 fps, 25,45 s. Banda de texto + Tony gritando (4:3) + demo de palmadas (16:9). Sin efectos añadidos.

`edit.config.json`: `texto`, `duration`, `tonyAudio`, `demoAudio`. `src/VR004.tsx`: maquetación.

Reproducir (node_modules no vive en Drive; ver README de VR003 para el detalle de la copia local + junction):

```powershell
$src='…\01_Proyectos\VR004_Jarvis_Pantalla_Dividida'; $w='C:\Herramientas\_work\VR004'
robocopy "$src\04_Edicion\Remotion_VR004" $w /MIR /XD node_modules out public
New-Item -ItemType Junction -Path "$w\node_modules" -Target 'C:\Herramientas\Videos Workspace launcher\video-editor\node_modules'
cd $w; node scripts/preparar_assets.mjs --proyecto $src
npx remotion render src/index.ts VR004-Jarvis out/VR004.mp4 --crf=16 --pixel-format=yuv420p
```
