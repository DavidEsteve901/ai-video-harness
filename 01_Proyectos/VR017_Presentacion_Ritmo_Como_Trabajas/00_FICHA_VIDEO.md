---
title: "VR017 — Presentación global al ritmo de la música («Tu PC recuerda cómo trabajas»)"
id: VR017
status: edicion
created: 2026-10-22
tags: [project/workspace-launcher, marketing, video, presentacion, motion-graphics, ritmo, musica]
formato: "Derivado de FMT-004 (sin voz ni karaoke): tipografía cinética + interfaz real a golpe de música"
---

# VR017 — Presentación global al ritmo de la música

> [!info] Estado (2026-10-22)
> **V1 producida** en vertical y horizontal con **música propia**. **Pendiente de que el usuario la vea y la escuche.** No publicada. La variante con «Loser» (Tame Impala) **no existe todavía**: no hay audio en `03_Recursos/musica/`; el script para hacerla está listo y probado con audio sintético (ver «Música»).

**Guion de ritmo:** [00_GUIA_Y_GUION.md](00_GUIA_Y_GUION.md) · **Textos para publicar:** [06_Publicacion/TEXTOS_PUBLICACION.md](06_Publicacion/TEXTOS_PUBLICACION.md)

## Ficha breve

- Concepto: «Tu PC recuerda cómo trabajas. Tú decides.» Ritual diario de abrir y colocar todo a mano → «¿Y si tu PC lo recordara?» → guardar y abrir con un clic (cada app en su pantalla, escritorio y zona) → capturar lo que ya tienes abierto y adaptarse a las pantallas → corte «Y ahora, pídeselo.» → *drop*: una función por compás (Omnibar, voz, chat con IA, transcriptor, agentes MCP, rutinas, avisos) y ráfaga en corcheas → filosofía.
- Referencia del usuario: «Introducing EDITKIT – All-in-one Free Plugin» (tipografía cinética, tarjetas 3D, zooms a la interfaz, golpes clavados a la música).
- **59,9 s** (3594 fotogramas) · 60 fps · vertical 1080×1920 y horizontal 1920×1080 · **100 BPM**, 24 compases (intro 4 · subida A 4 · subida B 4 · corte 1 · *drop* 8 · final 3) + cola de 2,2 s.
- Sin voz en off. Sin logo ni nombre de la app, sin precio, URL ni cifras (el «3 días» y «9:00» de la tarjeta de rutina son valores de ejemplo dentro de una tarjeta real; el mínimo de días de la app es 3).

## Verificación de funciones (código local de la app, solo lectura)

Raíz: `C:\Herramientas\Launcher pro\workspace-automator\WorkspaceLauncher\`. Web: `C:\Herramientas\WorkspaceLauncher-web\src\i18n\es.json`.

| Lo que dice / enseña el vídeo | Dónde se comprobó |
|---|---|
| Apps. Pestañas. Carpetas. Terminales. | Tipos de ítem del lanzador (`Core/Launcher`); captura Store 05 «Apps, webs, carpetas y terminales» |
| Guárdalo una vez. Ábrelo con un clic. (lista real del workspace, botón **Lanzar**) | Web `philosophy` («Guarda tu entorno una vez…») y `landing.steps` («Ábrelo con un clic»); captura real `public/img/ui/ws.jpg` (Store 05) |
| Cada app en su pantalla, su escritorio y su zona | `Core/DesktopMover`, `Core/ZoneEngine`, `Core/CustomZoneEngine`; captura Store 05 |
| ¿Ya lo tienes abierto? Captúralo. · Monitores · Ventanas · Zonas CZE · Pestañas web | `Core/Snapshot`; `frontend/src/locales/es.json` → `snapshot.capturing_title` («Capturando espacio de trabajo en vivo…»), `snapshot.chip_monitors/chip_windows/chip_zones/chip_tabs` |
| ¿Cambias de pantallas? Se adapta solo. · «Perfil detectado: Casa · 2 pantallas» · Detección automática | `es.json` → `workspace_profiles.detected` («Perfil detectado: {{name}}») y `automatic`; «Casa» es nombre ilustrativo |
| Omnibar: «Desde cualquier app.» | Captura real `img/ui/omnibar.jpg` (Store 02); `Core/Omnibar`; web `omnibar` |
| Asistente de voz: «Díselo en voz alta.» | Captura real `img/ui/voz.jpg` (Store 04); `Core/Voice` |
| Chat con IA: «La IA te monta el workspace.» | Captura real `img/ui/chat.jpg` (Store 03: borrador creado por la IA); `Core/Chatbot` |
| Transcriptor: «Dicta en cualquier app.» Escuchando… → Transcribiendo… → Pegado | `frontend/src/osd/DictationCard.jsx` (`dictation_osd.state_listening/state_transcribing/state_pasted`); `Core/Dictation` |
| Agentes de IA · MCP: Claude Code, Codex, Cursor, Antigravity, GitHub Copilot | `frontend/src/components/ConfigPanel/McpAgentConnections.jsx`; `Core/MCP` |
| Rutinas sugeridas: «Llevas 3 días abriendo… sobre las 9:00.» «¿Lo guardo como workspace?» · Guardarlo como workspace / Ahora no / No volver a sugerirlo | `Core/Routines/RoutineService.cs` (`OfferSave`, `Seen`) y `RoutineDetector.cs` (`FormatMinute`) |
| Avisos: «“Focus” se abrió a medias: no arrancaron Spotify.» · Reintentar lo que falta | `Core/Proactive/ProactiveEvents.cs` (`LaunchFinishedWithFailures`) |
| Ráfaga: Layouts · Escritorios virtuales · Gestos del ratón · Atajos · Fijar ventanas · Limpiar · Notas rápidas · Temporizadores | `Core/MCP/Tools/`: `CreateLayoutTool.cs`/`AssignLayoutTool.cs`, `VirtualDesktopTools.cs`, `SetHotkeyTool.cs`, `PinWindowTool.cs`, `CleanWorkspaceTool.cs`, `QuickNotesTool.cs`, `TimersTool.cs`; `Core/MouseGestures`; capturas Store 06 (layouts) y 08 (gestos) |
| Tu PC recuerda cómo trabajas. Tú decides. | Web `philosophy`; rutinas y perfiles recordados; rutinas y avisos piden confirmación (`RoutineService`, `Core/Proactive/ProactiveNoticeService.cs`) |

Ilustrativo, no nativo: las ventanas dibujadas (código, navegador, notas, música…), monitores y portátil, «Focus», «Casa», el texto dictado. Las capturas reales salen del pack de la Store (`05_Marketing/imagenes/Microsoft Store/PACK STORE 10 capturas (ES-EN) 2026-10/es-ES`), recortadas con `scripts/preparar_ui.py`.

## Música

- **V1 (publicable): música propia** sintetizada por código (`scripts/sintetizar_audio.py`, lee la rejilla de `src/ritmo.ts`): *indie-psych* de medio tiempo, Dm9–G13–Cmaj9–Am9, bajo marcado, piano eléctrico con trémolo, batería con bombeo, corte con un pulso de silencio y *drop* con melodía. Comprobado por medición: los ataques del bombo caen en la rejilla (±0,5 ms).
- **Rejilla única** `src/ritmo.ts` (BPM, offset del primer golpe, compases por sección): escenas, efectos (`src/sonido.ts`) y música salen de ahí. Re-sincronizar a otra pista = cambiar BPM/offset o dar la lista de golpes (`src/ritmo_loser.json`).
- **Variante «Loser» (Tame Impala): no generada** (no hay pista en `03_Recursos/musica/`). Para hacerla:
  1. Deja el audio (mp3/wav/m4a/flac/ogg/opus/webm) en `03_Recursos/musica/`.
  2. En `C:\Herramientas\_work\VR017`: `python scripts/sincronizar_musica.py` (opcional `--bpm N`, `--fase 0-3`, `--compas-inicio N` para forzar tempo, el 1 del compás o el tramo). Detecta tempo y golpes (librosa si está instalada —ahora no lo está—; si no, detector propio numpy/scipy), elige el tramo de la canción cuyo bloque de más energía cae en el *drop* y con entrada tranquila, recorta `public/audio/musica_loser.wav` y escribe `src/ritmo_loser.json` con los golpes reales; aparecen las composiciones `VR017-Vertical-Loser` / `VR017-Horizontal-Loser`. La duración cambia con el tempo de la canción.
  3. Render y máster: el script imprime los comandos (máster con `--ref public/audio/musica_loser.wav`). Para volver a la música propia sola: `src/ritmo_loser.json` = `{"disponible": false}`.
  - **Probado** con una canción sintética de 118 BPM (silencio inicial de 1,37 s, secciones de distinta energía): tempo 117,5 BPM, golpes a ±7 ms de los reales, *drop* colocado a 10 ms del real; en una copia aparte, las composiciones Loser aparecen (51,1 s) y los fotogramas del *drop* y del final caen en sus golpes. **No probado con la canción real.**
  - Arreglado en esta sesión: la consola de Windows rompía el script al imprimir «≈» (UnicodeEncodeError, el *traceback* de la sesión anterior); detectaba medio tempo (59 en vez de 118 BPM) — ahora usa un peine de múltiplos en la autocorrelación —; golpes ~50 ms adelantados (se fechaban al inicio de la ventana FFT, ahora en su centro); fase del compás ambigua con bombo en 1 y 3 (ahora suma la novedad de energía en los límites de compás).
  - **Derechos:** «Loser» es música comercial: esa variante es solo para el uso que decida el usuario. Para redes, mejor la versión con música propia o añadir la canción desde la biblioteca de sonidos de TikTok/Reels.

## Producción

- Editable: `C:\Herramientas\_work\VR017` (Remotion 4.0.448; `node_modules` = junction a `Videos Workspace launcher\video-editor\node_modules`). Copia de fuentes en `04_Edicion/Remotion_VR017/` (sin `node_modules`, `out` ni renders).
  - `src/ritmo.ts` (rejilla), `src/VR017.tsx` (composición, sacudidas y destellos en los golpes), escenas `src/scenes/Intro.tsx`, `Subidas.tsx`, `Drop.tsx`, `Final.tsx`; componentes `Kinetic.tsx` (palabras a golpe), `UICard.tsx` (captura real en 3D con zoom dentro del marco), `Osd.tsx` (tarjetas reconstruidas con los estilos de `frontend/src/osd/osd.css`), `Screens.tsx`, `Win.tsx`, `Bits.tsx`.
  - Scripts: `sintetizar_audio.py`, `sincronizar_musica.py`, `masterizar.py`, `publicar.py`, `hojas.py`, `preparar_ui.py`.
- Máster: `npm run render:v` / `render:h` (CRF 16, yuv420p; se usó `--concurrency=4`) → `python scripts/masterizar.py <raw> <máster> --ref public/audio/musica.wav` → `python scripts/publicar.py <máster> <_publicar>`.

## Mezcla y exportaciones

- **Mezcla** (medida, no escuchada): música propia + efectos de `src/sonido.ts` (pops, clics, *whooshes*, zooms de interfaz, «ding»), cada uno atado a un gesto visual. Máster `scripts/masterizar.py`: limitador, loudnorm en dos pasadas y limitador final → **−13,8 LUFS** integrados, pico real **−1,8 dBTP**, en V y H (las `_publicar` copian el mismo audio: mismos valores).
- **Sincronía audio/imagen corregida:** el AAC que sale del render de Remotion llegaba **42,7 ms tarde** (≈ 2048 muestras de relleno del codificador sin lista de edición; medido por correlación con `musica.wav`). `masterizar.py --ref` lo mide y lo recorta: en los másteres queda a **5 ms**. Sin esto, cada golpe se oía ~2,5 fotogramas después de su corte.
- `masterizar.py` también se corrigió: con la ganancia de loudnorm salían picos por encima de 0 dBFS (+2,5 dBTP en una prueba); ahora lleva un limitador final a −2 dBFS.

### Exportaciones (`05_Exportaciones/`)

- `VR017_V1_1080x1920_60fps.mp4` y `VR017_H1_1920x1080_60fps.mp4`: máster, H.264 CRF 16, 4:2:0 8 bits (Remotion lo marca `yuvj420p`, rango completo, igual que VR012–VR014), 60 fps, **59,90 s**, 3594 fotogramas, ≈ 80 Mb/s, AAC 256k.
- `VR017_V1_1080x1920_60fps_publicar.mp4` y `VR017_H1_1920x1080_60fps_publicar.mp4`: x264 CRF 20, maxrate 24M, bufsize 48M, preset slow, audio copiado del máster.
- `VR017_V1_revision_fotogramas.png` y `VR017_H1_revision_fotogramas.png`: un fotograma por compás (pulso 3,5), 6×4 a media escala (`python scripts/hojas.py <máster> <png> claves`).
- Se probó pasar las `_publicar` a rango limitado bt709: oscurecía las sombras ~2 niveles frente al fotograma de Remotion, así que se dejaron como el máster.

## Revisión hecha por Claude

Render a escala 0,4 y hojas cada 0,5 s en vertical y horizontal (dos rondas) y hojas del máster final. Corregido:

- **Intro:** «Apps. Pestañas. Carpetas. Terminales.» estaban en una sola línea con las palabras ocultas ocupando sitio: cada palabra salía a otra altura (y en H a otro lado) y la primera tapaba su icono. Ahora una línea por palabra, centrada; y entre palabras seguidas (también «Abrir. Colocar. Buscar.») la anterior termina de salir antes de que golpee la siguiente.
- **Zooms a la interfaz real:** la captura crecía fuera de su tarjeta y pisaba los titulares (Lanzar y Omnibar en H, chat en V y H —se salía por arriba—, voz en H con el orbe encima del texto). Ahora el zoom ocurre dentro del marco de la tarjeta, sin dejar ver el borde de la captura; el cursor apunta al botón **Lanzar** donde queda tras el zoom (antes iba al centro). El zoom del chat ahora enseña el borrador que crea la IA (antes, líneas de chat ilegibles).
- **«¿Cambias de pantallas?» / «Se adapta solo.»** se montaban un instante; también «¿Ya lo tienes abierto?» / «Captúralo.». Ahora la frase anterior sale antes del golpe.
- **Final:** «Tu PC recuerda cómo trabajas.» ocupaba 4 líneas en V y 2 en H y tocaba «Tú decides.»; ahora dos líneas («Tu PC recuerda / cómo trabajas.») con aire.
- **Corte → *drop*:** «Y ahora, pídeselo.» seguía en pantalla cuando entraba la tarjeta del Omnibar; ahora se va en el pulso de silencio.
- **H:** el rótulo pequeño (eyebrow) tocaba los titulares de 3 líneas; titular a 92 px y rótulo más arriba. **V:** indicador «Escritorio 1 / Escritorio 2» más grande.
- **Audio:** desfase de 42,7 ms y picos por encima de 0 dBFS (ver «Mezcla»).

Comprobado por medición: el bombo de la música cae en la rejilla (±0,5 ms) y, tras el máster, el audio va a 5 ms de la imagen. **No comprobado de oído ni en pantalla de móvil:** la escucha y la legibilidad final en el teléfono son del usuario. Notas: los textos de las capturas reales (Omnibar, chat, lista de workspaces) son pequeños en vertical aunque se ven con zoom; el tercio inferior del vertical queda despejado en el *drop* (zona de la interfaz de Shorts/TikTok).

## Tareas

- [x] Guion de ritmo y rejilla.
- [x] Música propia + efectos atados a gestos.
- [x] Escenas; revisión a escala 0,4 con hojas cada 0,5 s (V y H) y correcciones.
- [x] Render final V+H, máster −14 LUFS y versiones `_publicar`.
- [x] `sincronizar_musica.py` arreglado y probado con audio sintético.
- [ ] El usuario lo ve y lo escucha; retoques.
- [ ] Si el usuario deja «Loser» en `03_Recursos/musica/`: generar y revisar la variante `_loser` (solo para el uso que él decida).
- [ ] Antes de publicar: confirmar que la versión de la Store incluye todo lo que se enseña (asistente de voz, transcriptor, agentes MCP, rutinas, avisos).
