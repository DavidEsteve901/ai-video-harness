# VR008 · La lápida de Lucas (Remotion, 1080×1920, 60 fps)

Animación con historia: lápida «Abrió Chrome 14.600 veces» → rebobinado → Lucas abriendo sus apps a mano (café que se enfría) → 14.600 mañanas → Sofía lanza todo con un clic (clip real del Senior de VR001) → la lápida con otro epitafio.

## Estructura
- `edit.config.json` — duración y **todos los tiempos** (voz, golpes, escenas). Cambia ahí, no en el código.
- `src/VR008.tsx` — línea de tiempo, subtítulos y audio. `src/Scenes.tsx` — lápida, rebobinado, montaje de los 14.600 días. `src/Desk.tsx` — oficina, monitor, ventanas falsas y pantalla real. `src/Characters.tsx` — Lucas, Sofía y la taza. `src/voz.json` — duración y palabras de cada toma de voz.
- `scripts/sintetizar_sfx.py` — efectos y música propios (sin derechos). `scripts/preparar_voz.py` — recorta/normaliza la voz y genera `voz.json`.

## Preparar y renderizar (copia local; `node_modules` no vive en Drive)
```powershell
$w='C:\Herramientas\_work\VR008'
robocopy "<04_Edicion\Remotion_VR008>" $w /MIR /XD node_modules out
New-Item -ItemType Junction -Path "$w\node_modules" -Target 'C:\Herramientas\Videos Workspace launcher\video-editor\node_modules'
cd $w
python scripts/sintetizar_sfx.py "$w\public\audio"
# voz (tomas de 03_Recursos/voz/v2_tomas + 0002 de t2_s5_tomas):
& 'C:\Herramientas\local-voice-studio\.venv\Scripts\python.exe' -I -X utf8 scripts/preparar_voz.py <carpeta_tomas> "$w\public\audio" src\voz.json
# clip real del Senior (VR001/02_Brutos/Video Senior.mp4): 12,9–15,28 ×1 · 16,3–17,95 ×2 · 17,95–20,4 ×1
ffmpeg -y -i "Video Senior.mp4" -filter_complex "[0:v]trim=start=12.9:end=15.28,setpts=PTS-STARTPTS[a];[0:v]trim=start=16.3:end=17.95,setpts=(PTS-STARTPTS)/2[b];[0:v]trim=start=17.95:end=20.4,setpts=PTS-STARTPTS[c];[a][b][c]concat=n=3:v=1:a=0,fps=60,scale=1920:1080[o]" -map "[o]" -an -c:v libx264 -crf 14 -pix_fmt yuv420p public\media\senior.mp4
ffmpeg -y -i public\media\senior.mp4 -frames:v 1 public\media\senior_start.png
npm run render
```
Después: `alimiter=limit=0.8` al audio (ver guía).
