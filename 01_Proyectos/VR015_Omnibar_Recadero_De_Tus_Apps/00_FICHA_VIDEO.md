---
title: "VR015 — «Llevas años haciendo de recadero de tus apps» (Omnibar)"
id: VR015
status: edicion
created: 2026-10-22
tags: [project/workspace-launcher, marketing, video, presentacion, omnibar, ia, motion-graphics]
formato: FMT-004
---

# VR015 — El Omnibar: el recadero de tus apps

> [!info] Estado (2026-10-22)
> **V1 producida** en vertical y horizontal con el formato aprobado [FMT-004](../../Biblioteca_Formatos/FMT-004_Presentacion_Concepto_Motion_Karaoke.md). Pendiente de que el usuario la vea y la escuche. No publicada.

**Guía, ganchos, guion y funciones verificadas:** [00_GUIA_Y_GUION.md](00_GUIA_Y_GUION.md) · **Textos para publicar:** [06_Publicacion/TEXTOS_PUBLICACION.md](06_Publicacion/TEXTOS_PUBLICACION.md)

## Ficha breve

- Concepto: llevas años yendo tú a las apps (copias, pegas, buscas, abres, colocas, vuelves) y en cada viaje pierdes el hilo. El Omnibar le da la vuelta: una barra encima de lo que haces que sabe qué tienes delante y te trae lo que necesitas. Cierre en bucle: «recadero de tus apps» → «Ya no eres el recadero de tus apps. Ahora trabajan para ti».
- Primer vídeo FMT-004 con **el Omnibar reconstruido fiel a la app** (tokens de `OmnibarQuick.css`, iconos Lucide del componente, textos de `locales/es.json`); el resto mantiene el lenguaje del formato.
- **63,5 s** · 60 fps · vertical 1080×1920 y horizontal 1920×1080. Sin logo ni nombre de la app, sin eslogan, precio, URL ni cifras dentro del vídeo.
- La verificación de cada frase contra el código (app 1.2.7) está en la sección 5 del guion. Ilustrativo, no de serie: los comandos `/publicar`, `/tarea`, `/informe` y la pregunta del bonsái.

## Producción

- Editable: copia de trabajo `C:\Herramientas\_work\VR015` (derivada de VR013; `node_modules` = junction a `Videos Workspace launcher\video-editor\node_modules`, Remotion 4.0.448). Copia de fuentes en `04_Edicion/Remotion_VR015/` (sin dependencias ni renders).
  - Escenas: `src/scenes/Recados.tsx` (gancho, problema y giro) y `src/scenes/Barra.tsx` (Omnibar y funciones), composición `src/VR015.tsx`. Componente nuevo `src/components/Omnibar.tsx` (píldora + tarjeta: sugerencias, ideas IA, resultados de búsqueda con fuentes, ventanas seleccionadas, explorador de acciones). Reutilizados de VR013/VR014: `Win`, `Monitor`, `Desk`, `Captions` (karaoke + claves), `Bits`, `Mind`.
- **Voz** Gemini `es-es-training-9`, modelo `gemini-3.8-flash-lite-tts`, 1 toma por frase: **13 peticiones**, 13 tomas válidas al primer intento, comprobadas con Whisper (`03_Recursos/voz/gemini/generar_voz.py`, `generar.log`).
- **Música propia** (`scripts/sintetizar_audio.py`) y **efectos** atados a gestos (`src/sonido.ts`: tecleo, Enter, encender/apagar la barra, pops de chips, whooshes de viajes).
- **Mezcla** (medida, no escuchada): voz **10,5 dB** sobre el fondo en V y **10,3 dB** en H (mediana por segundo, `scripts/medir_mezcla.py`, 62 s con voz; los segundos flojos son pausas entre frases). Máster (`scripts/masterizar.py`, loudnorm en dos pasadas): **−13,9 LUFS** integrados y pico −2,8 dBFS, en V y H.

## Exportaciones (`05_Exportaciones/`)

- `VR015_V1_1080x1920_60fps.mp4` y `VR015_H1_1920x1080_60fps.mp4` (máster, CRF 16, 63,57 s, 3811 fotogramas a 60 fps).
- `VR015_V1_1080x1920_60fps_publicar.mp4` y `VR015_H1_1920x1080_60fps_publicar.mp4` (x264 CRF 20, maxrate 24M, bufsize 48M, preset slow, audio copiado del máster; `scripts/publicar.py`).
- `VR015_V1_revision_fotogramas.png` y `VR015_H1_revision_fotogramas.png`: un fotograma por frase (al final de su última palabra), 7×2 a media escala (`python scripts/hojas.py <máster> <png> claves`).

## Revisión hecha por Claude

Render a escala 0,4 y hojas cada 0,5 s en V y H, dos rondas: se corrigieron posiciones de la pantalla de los recados, tiempos de la escena de notas (lectura → redacción → confirmación) y los chips de «Con estas páginas» (una columna en vertical). Tras la última ronda se ajustó `layout.ts` y se renderizaron los finales; las hojas de los másteres (una por frase) se revisaron: textos completos, sin solapes ni elementos fuera de cuadro. Audio medido, no escuchado: la escucha final es del usuario.

**Corrección tras verla el usuario (2026-10-22):** en el horizontal, hacia 0:32 («y colócala donde quieras»), la tarjeta del Omnibar se cerraba y se reabría en menos de medio segundo y Spotify se movía con un resorte, tapado por la tarjeta: se veía saltar. Ahora (solo H, `steady` en `S07` de `Barra.tsx`) la tarjeta se queda abierta y funde las filas en las sugerencias de Spotify, Spotify se abre debajo de la tarjeta y encaja a la derecha con curvas suaves sin rebote. Horizontal re-renderizado y re-exportado (−13,9 LUFS); el vertical no cambia.

## Tareas

- [x] Guía, banco de ganchos, guion y verificación de funciones.
- [x] Voz, animación, música, render V+H y versiones de publicación.
- [ ] El usuario lo ve y lo escucha; retoques.
- [ ] Confirmar que la versión publicada en la Store incluye las funciones del Omnibar mostradas (código 1.2.7).
- [ ] Versión en inglés si se pide (textos EN preparados; necesita voz inglesa: 13 peticiones de Gemini).
