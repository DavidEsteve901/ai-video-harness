# Remotion VR009 — «Mi PC y yo trabajando en un proyecto»

Comp `VR009-MiPCyYo`, 1080×1920, 60 fps, 13,6 s. Tiempos y voz en `edit.config.json`.

```powershell
$w='C:\Herramientas\_work\VR009'; robocopy "<04_Edicion\Remotion_VR009>" $w /MIR /XD node_modules out public
New-Item -ItemType Junction -Path "$w\node_modules" -Target 'C:\Herramientas\Videos Workspace launcher\video-editor\node_modules'
robocopy "<04_Edicion\Remotion_VR009>\public" "$w\public" /E /XD vo media audio
cd $w; node scripts/preparar_assets.mjs --grabaciones <Grabaciones_Personales> --sfx <Biblioteca_Sonidos\sfx_propios> --voz <03_Recursos\voz\locucion_tomas>
npx remotion render src/index.ts VR009-MiPCyYo out/VR009_raw.mp4 --crf=16 --pixel-format=yuv420p
ffmpeg -i out/VR009_raw.mp4 -c:v copy -af "volume=2.5dB,alimiter=limit=0.72:level=false" -c:a aac -b:a 192k out/VR009_V1_1080x1920_60fps.mp4
```

Voz: `03_Recursos/voz/plan_vocal.json` → `Biblioteca_Voces/herramientas/locutor.py decir --plan … --motor qwen-base-1.7b --revisar` (CosyVoice no está instalado en el estudio). Los pops de ventana (`WINDOW_POPS` en `src/VR009.tsx`) salen de `ffmpeg select=scene` sobre `public/media/asist_full.mp4`: si cambian los cortes, hay que volver a detectarlos.