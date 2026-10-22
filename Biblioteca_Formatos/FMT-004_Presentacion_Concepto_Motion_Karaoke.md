---
id: FMT-004
title: "Presentación de concepto en motion graphics con texto karaoke"
estado: "Aprobado por el usuario"
created: 2026-10-21
video_origen: "VR012 V1 (vertical y horizontal), 2026-10-21"
---

# Presentación de concepto en motion graphics con texto karaoke

## Qué conservar y por qué

**Aprobado por el usuario el 2026-10-21**, tras ver VR012 V1: «me parece muy chulo… guarda el formato y cómo lo has hecho, está súper chulo para futuros vídeos: cómo has hecho los textos, me gusta el guion, la idea». Pidió después la misma pieza en inglés.

Lo que le gustó, en sus palabras resumidas: **la idea/concepto, el guion, el texto que aparece palabra a palabra con claves marcadas, y la forma de producirlo**. Las métricas de rendimiento no existen todavía (no publicado).

También aprobado de oído: voz Gemini `es-es-training-9`; `flash-lite` con la misma voz no se distingue del modelo principal.

## Fuente que se puede volver a abrir

- Ficha: [VR012](../01_Proyectos/VR012_Presentacion_Tu_PC_Recuerda/00_FICHA_VIDEO.md) · guía y guion: [00_GUIA_Y_GUION.md](../01_Proyectos/VR012_Presentacion_Tu_PC_Recuerda/00_GUIA_Y_GUION.md) (reglas de presentación, banco de ganchos, tabla de escenas).
- Editable: `01_Proyectos/VR012_Presentacion_Tu_PC_Recuerda/04_Edicion/Remotion_VR012/` (copia de trabajo con dependencias `C:\Herramientas\_work\VR012`).
- Exportaciones: `05_Exportaciones/VR012_V1_*`, `VR012_H1_*` (máster y `_publicar`).

## Estructura y tratamiento

**Guion (el molde):** gancho-concepto provocador (una frase que replantea el problema, p. ej. «Tu ordenador tiene amnesia») → problema en tres latidos (qué se pierde → quién lo paga → cada cuánto, sin cifras inventadas) → giro con pregunta («¿Y si…?») con silencio + luz → mecanismo en dos gestos (montar una vez / un clic y vuelve) → abanico de funciones a ritmo, un cambio visual por frase → beneficio → **cierre que responde al gancho** (bucle). Sin logo, nombre, eslogan, precio ni URL. Una frase = una escena; cada frase verificada contra la versión publicada de la app.

**Visual:** motion graphics oscuro premium (#07090F, luces suaves que respiran, viñeta, grano). Ventanas y pantallas **abstractas** (no capturas de UI). Colores con significado: coral problema, ámbar memoria/IA, cian control/zonas, verde listo. Movimiento con resortes y curvas expo, empuje de cámara permanente, sacudida corta en impactos, desenfoque de movimiento en saltos.

**Texto karaoke (lo que más gustó):** cada palabra aparece al pronunciarse (tiempos por palabra de Whisper large-v3): sube, se enfoca y gana opacidad con resorte. Palabras clave con **subrayador de su color que barre** al decirse y leve salto de escala; «amnesia» con glitch RGB. Bloques por frase, frases largas partidas en bloques equilibrados cortando en comas, máx. 2 líneas. Última frase sube al centro como remate. Inter ExtraBold.

**Formato:** 60 fps; vertical 1080×1920 y horizontal 1920×1080 desde el mismo código (layout por orientación: dos pantallas lado a lado / apiladas; texto en tercio central-bajo en vertical, tercio inferior en horizontal).

**Voz:** una sola voz Gemini por vídeo, estilo emocional por toma en `speech_metadata.style`, 2 tomas válidas por frase (A/B) comprobadas con Whisper; la pausa dramática se elige entre tomas (t07 B).

**Música y efectos:** música compuesta por código y sincronizada con las palabras (oscura en el problema → corte en el gancho → aceleración → silencio en el giro → floración en la palabra clave → tema mayor con *drop* en el clímax → acorde final). Ducking −10 dB con la envolvente real de la voz. Cada efecto atado a un evento visual.

## Herramientas realmente utilizadas

| Herramienta / skill | Versión o referencia comprobada | Para qué se utilizó | Fuente o script reutilizable |
|---|---|---|---|
| Remotion | 4.0.448 (junction a `video-editor/node_modules`) | Animación DOM/CSS, 4 composiciones | `src/` de Remotion_VR012 |
| Gemini TTS | `gemini-3.8-flash-tts` y `-lite-tts`, voz `es-es-training-9` | Locución | `03_Recursos/voz/gemini/generar_vr012.py` (+ `MODELO_TTS`) |
| faster-whisper | large-v3, CUDA, `local-voice-studio/.venv` | Verificar tomas y tiempos por palabra | `scripts/preparar_voz.py` |
| numpy/scipy | Python del sistema | Música propia y SFX de encendido/apagado | `scripts/sintetizar_audio.py` |
| ffmpeg | PATH | Procesado de voz, loudnorm 2 pasadas, versiones de publicación | `scripts/masterizar.py` |
| Biblioteca de SFX | pack manuDT + `sfx_propios` | Pops, glitch, whoosh, clic, tic-tac, risers | `src/sonido.ts` |
| Skills locales | video-orquestacion, video-planificacion-retencion, remotion-produccion, voces-locucion | Plan → producción | `.agents/skills/` |

## Parámetros para el siguiente vídeo

Cambia: concepto/gancho, guion (11±3 frases), escenas, palabras clave y su color, ventanas/objetos de cada escena, idioma y voz. Se mantiene: estructura de guion, lenguaje visual y de color, sistema de texto karaoke, pipeline de voz (2 tomas + Whisper), música por código con secciones atadas a palabras, mezcla (voz ≥ 10 dB sobre el fondo, −14 LUFS), doble orientación a 60 fps, sin logo.

Para reutilizar: copiar Remotion_VR012, cambiar `plan_vocal.json`, `edit.config.json`, `CLAVES` y las escenas; `at(toma, palabra)` ancla cada animación/efecto a una palabra (si cambian las palabras, cambian las anclas). Coste de voz: céntimos; Gemini Tier 1 = 100 peticiones/día por modelo.

## Aprendizajes y revisión

- 2026-10-21: texto solapado entre bloques y palabras sueltas en vertical → bloque sale 0,24 s antes del siguiente y reparto equilibrado por frase cortando en comas.
- Música a 3–5 dB de la voz era demasiado: medir voz vs (mezcla − voz) por segundo, mediana ≥ 10 dB.
- Revisar con hojas de fotogramas cada 0,5 s de renders a escala 0,4 (≈ 80 s por formato) antes del render final.
