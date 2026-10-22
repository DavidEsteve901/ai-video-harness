# VR006 «Le pedí a mi PC» + VR007 «Cuenta atrás» (Remotion)

Dos vídeos verticales (1080×1920, 60 fps) que comparten proyecto. Humor + demo real del producto, con la receta de [02_SONIDOS_Y_GANCHOS](../../../../02_SONIDOS_Y_GANCHOS.md): gancho en el segundo 0, un cambio cada 1–2,5 s, pocos efectos de sonido y bien elegidos.

| Vídeo | Duración | Qué es |
| --- | --- | --- |
| **VR006** `VR006-Asistente` | 17,2 s | Pantalla completa + zoom a la tarjeta del asistente: «Le pedí a mi PC: ábreme un vídeo de risa y un artículo para estudiar» → se abre todo → «organízame las ventanas» → «Listo, cuatro ventanas». Voz sintética de «listillo» + memes flotando. |
| **VR007** `VR007-CuentaAtras` | 11,6 s | «3-2-1… ¡FUEGO!» con el cohete azul (juego de palabras *Launcher*) y corte al lanzamiento real del escritorio (tu `Video Senior`), «UN CLIC», «ASÍ ARRANCA MI PC». |

## Brutos y recursos que usa (no se copian aquí: pesan)

| Recurso | Dónde |
| --- | --- |
| Asistente de voz (2560×1440, 60 fps, 68 s) | `Videos/Grabaciones_Personales/01_Brutos/T01_Tutorial_Desde_Cero/Video Asistente 2.mp4` |
| Lanzamiento del escritorio (clic en 15,13 s) | `Videos_Rapidos/01_Proyectos/VR001_Junior_vs_Senior/02_Brutos/Video Senior.mp4` |
| Cohete azul (IA, 10 s) | `Videos_Rapidos/01_Proyectos/Elon roadster/A_metallic_blue_rocket_icon_*.mp4` |
| Efectos | `01_Proyectos/Recursos videos/Efectos sonido/PACK SONIDOS 2025 (manuDT)`: `ALARMA/countdown-beep-tones-more-higher-tone-version-SBA-300419347.mp3` (pitidos), `BOOM (IMPACTO)/Vine Boom dramatico.mp4` (gancho VR006) y `Bass Impact sound Effect…wav` (despegue), `CLICK/Mouse Click 1.wav`, `DING/quick-win.mp3` |
| Memes (fotos) | `VR002_…/03_Recursos/fotos` (copiados a `public/img`) |
| Voz | Local Voice Studio, voz «Listillo millonario ES» (inventada, no clona a nadie) |

## Cómo reproducirlo

Necesita Node, ffmpeg y Remotion 4.0.448 (`node_modules` fuera de Drive: `npm install` o enlazar el de `Videos Workspace launcher/video-editor`). Local Voice Studio encendido solo si cambias la voz.

```bash
python voz/generar_voz.py        # (con el python de local-voice-studio) genera public/vo/zip/0001..0005.wav
node scripts/preparar_assets.mjs --grabaciones <Videos/Grabaciones_Personales> --senior <Video Senior.mp4> --cohete <clip cohete.mp4> --sfx "<…/PACK SONIDOS 2025 (manuDT)>"
npm run dev                      # Remotion Studio
npm run render                   # out/VR006_… y out/VR007_… (luego loudnorm a −14 LUFS, ver abajo)
ffmpeg -i out/VR006_Asistente_1080x1920_60fps.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11,apad" -t 17.2 -c:a aac -b:a 192k -ar 48000 -movflags +faststart VR006_..._V1_1080x1920_60fps.mp4
```

## Qué tocar

- `edit.config.json`: cortes y velocidades de cada bruto (`cuts`), recorte de la tarjeta (`cardCrop`), momentos clave (`t`) y posición de cada frase de voz (`vo[].at`).
- `src/VRS.tsx`: textos (`<Cap …/>`), memes (`<Float …/>`) y sonidos (`<At …/>`) de cada vídeo.
- `voz/locucion.json`: frases (orden: a1–a4 = VR006, b1 = VR007). Tras cambiarlas, actualiza `vo[].at` según `public/vo/zip/timeline.json`.

## Notas

- La petición que se lee en la tarjeta del asistente («Ábreme en el navegador… un vídeo de risa y en otra pestañ…») está cortada en el bruto; el texto «y un artículo para estudiar» es una lectura de lo que se abre después (una página sobre estudiar). Si en el original pedías otra cosa, cámbialo en `src/VRS.tsx`.
- El audio original del asistente (su voz) no se usa: va acelerado ×1,5–3 y sonaría raro. Si quieres que se oiga «Listo, organicé tus cuatro ventanas», hay que dejar ese tramo a velocidad normal.
- Sin nombre de la app ni URL en pantalla (van en la descripción).
