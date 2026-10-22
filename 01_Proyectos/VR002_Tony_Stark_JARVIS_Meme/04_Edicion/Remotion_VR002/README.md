# VR002 — Tony Stark / JARVIS meme (Remotion) · V3

Vertical 1080×1920, 60 fps, 19,5 s. Humor tipo meme: Tony Stark grita al ver mi PC abrirse solo, una voz sintética original, **emotiva y bilingüe**, comenta, y la demo real de las dos palmadas se ve dentro del monitor gigante de Tony.

## Qué cambió en la V3

- **Gancho:** ahora es el clip de Robert Downey Jr. donde se oye el grito (`Robert-Downey-Jr-SnapYT.App (1).mp4`): medio segundo de calma y luego el grito. Se recorta a la cara y se amplía con lanczos sobre un fondo desenfocado.
- **Voz más emotiva** y **bilingüe**: la misma voz habla en español y en inglés. «JARVIS» se dice en inglés con la misma voz (la frase «¡Que se entere… JARVIS!» son dos tomas seguidas: español + inglés).
- **Son DOS palmadas**, no una: rótulo «DOS PALMADAS 👏👏», frase «Solo… dos palmadas.» y, al cerrar, «Otras dos palmadas… ¡y fuera!». Las palmadas reales están en 3,24 y 3,51 s de la demo (abrir) y 20,81 y 21,07 s (cerrar).
- Se mantiene lo de la V2: memes flotando sin marcos, fundidos suaves, pocos efectos de sonido, clip normal de «Wake up, daddy's home».

## Línea de tiempo (segundos del vídeo final)

| Tiempo | Escena | Voz |
| --- | --- | --- |
| 0,0–2,8 | **Gancho:** Tony grita · «TONY STARK AL VER MI PC ABRIRSE SOLO 💀» | Grito original |
| 2,8–6,0 | Clip normal «Wake up, daddy's home» · «ÉL NECESITÓ MILLONES PARA DESPERTAR A JARVIS» | «Tranquilo, Tony…» |
| 6,0–14,0 | Mi demo dentro del monitor gigante · «YO CON MI PC: / DOS PALMADAS 👏👏» (7,64 y 7,91) con el meme «YO» (círculo y flecha) · alarma y Tony gritando al abrirse (9,3) · «SIN TOCAR NADA 😎» | «Solo… dos palmadas.» · «¿¡Ves!? ¡Se abre todo solo!» · «Sin teclado… sin ratón…» |
| 14,0–16,9 | «OTRAS DOS PALMADAS… / …Y TODO CERRADO ✌️» (14,81 y 15,07) | «Otras dos palmadas… ¡y fuera!» |
| 16,9–19,5 | Cara de JARVIS · «MI PROPIO JARVIS · SOLO CON PALMADAS 👏» | «¡Que se entere…» (ES) + «JARVIS!» (EN) |

La posición de cada frase de la voz se define en `edit.config.json → vo` con un **ancla** (`hook`, `wake`, `s1`, `open`, `s2`, `end` o `prev`) y un desfase en segundos; así, si cambian las escenas, la voz sigue a su momento.

## Estructura

| Ruta | Qué es |
|---|---|
| `edit.config.json` | Tiempos de todas las tomas, esquinas del monitor gigante y anclas de la voz |
| `voz/` | `generar_voz.py` (diseña la voz y genera las frases con Local Voice Studio), `voz.json` (descripción de la voz), `locucion.json` (frases con idioma `lang` por frase) |
| `public/vo/zip/` | Tomas de voz generadas (`0001.wav`…) con su `timeline.json` y subtítulos |
| `scripts/preparar_assets.mjs` | Prepara lo pesado desde `02_Brutos`, `03_Recursos` y `public/vo`: gancho, audio del clip normal, chroma del monitor, voz normalizada, fotos |
| `src/VR002.tsx` | Montaje: escenas, textos meme, memes flotantes, audio. **Aquí se cambia casi todo** |
| `src/homography.ts` | Deformación de perspectiva (corner pin) para meter la demo en el monitor |
| `public/fonts/` | Anton (textos meme), licencia OFL |

`public/media`, `public/audio` y `public/img` no se guardan aquí: los crea el script.

## Cómo reproducirlo

Necesita Node, ffmpeg en el PATH y Remotion 4.0.448 (`npm install`, o enlazar el `node_modules` de `Videos Workspace launcher/video-editor`).

```bash
npm install
npm run assets     # genera public/media, public/audio, public/img
npm run dev        # Remotion Studio
npm run render     # -> out/VR002_Tony_Stark_JARVIS_1080x1920_60fps.mp4
```

El archivo entregado lleva además una pasada a −14 LUFS:

```bash
ffmpeg -i out/VR002_Tony_Stark_JARVIS_1080x1920_60fps.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 -movflags +faststart VR002_..._V3_1080x1920_60fps.mp4
```

## La voz (emotiva y bilingüe)

- Voz **inventada por descripción** (VoiceDesign de Local Voice Studio): «Voz emotiva bilingue», descrita en `voz/voz.json` (actor sentimental, dramático, hablante bilingüe de español de España e inglés americano). Su muestra de referencia mezcla español e inglés (incluye «JARVIS») para que la misma voz pronuncie bien en ambos idiomas.
- Cada frase lleva su idioma en `voz/locucion.json` (`"lang": "es"` o `"en"`). El texto emocional se logra con puntuación expresiva (`…`, `¡!`, `¿¡ !?`).
- Para cambiarla: edita `voz/locucion.json` o `voz/voz.json`, enciende Local Voice Studio (`Iniciar.cmd`) y ejecuta `C:\Herramientas\local-voice-studio\.venv\Scripts\python.exe voz\generar_voz.py` (`--rediseñar` crea una voz nueva; `--voz ID` usa una voz existente, por ejemplo la tuya). Después actualiza `dur` de cada frase en `edit.config.json → vo` (salen de `public/vo/zip/timeline.json`), `npm run assets` y renderiza.
- **No se clona la voz de Robert Downey Jr.** ni de ningún actor (derechos sobre su voz/imagen, uso engañoso y las plataformas exigen etiquetar la IA que imita a personas reales). Alternativas: otra voz inventada, tu propia voz de la biblioteca o los clips originales del meme (grito, «Wake up»).
- Comprobado con Whisper local: las 7 tomas se transcriben bien; en la toma en inglés sale «Jarvis!». La emoción y la pronunciación fina solo se pueden juzgar escuchando.

## Cómo está hecho (por si hay que retocar)

- **Monitor gigante:** `chromakey` de un solo fotograma del clip green screen + `cornerPin()` con las esquinas de `plateB.quad`. La demo va detrás; la máscara del chroma recorta lo que sobra.
- **Cortes de la demo:** segmento 1 = 1,6–9,6 s (palmadas + apertura), segmento 2 = 20,0–22,9 s (palmadas + cierre). El audio de la demo se baja mientras habla la voz.
- **Memes:** componente `Float` de `src/VR002.tsx` (posición, tamaño, inclinación, tiempos). Fotos en `03_Recursos/fotos`; `preparar_assets.mjs` copia las elegidas a `public/img`.

## Ajustes habituales

- **Texto o su momento:** líneas `<Cap ... />` de `src/VR002.tsx` (`from`/`to` en segundos del vídeo final).
- **Meme:** líneas `<Float ... />` y la lista de fotos de `scripts/preparar_assets.mjs`.
- **Parte de la demo que se enseña:** `edit.config.json → part2.segments` (y `duration`, `end`).
- **Gancho distinto:** `edit.config.json → hook` (clip, inicio, recorte) y su caja en `src/VR002.tsx`.
