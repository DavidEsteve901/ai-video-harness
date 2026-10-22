---
title: "VR012 — Presentación: «Tu ordenador tiene amnesia»"
id: VR012
status: edicion
created: 2026-10-21
tags: [project/workspace-launcher, marketing, video, presentacion, motion-graphics]
---

# VR012 — Presentación de la app: «Tu ordenador tiene amnesia»

> [!info] Estado (2026-10-21)
> **V1 producida** en vertical y horizontal, **pendiente de que el usuario la vea y la escuche**. No publicada. Es el molde de una serie: si el formato gusta, se guarda como formato (FMT-004) y se repite por función.
> **Voz:** las frases 10 y 11 se generaron con `gemini-3.8-flash-lite-tts` (misma voz `es-es-training-9`) al agotarse el cupo diario del modelo principal (100 peticiones/día, Tier 1). **El usuario las escuchó junto a las del modelo principal el 2026-10-21 y no nota diferencia: se quedan definitivas.**

**Guía, ganchos y guion:** [00_GUIA_Y_GUION.md](00_GUIA_Y_GUION.md) (concepto, reglas de presentación, banco de 5 ganchos, guion por escenas, lenguaje visual, texto karaoke, sonido y serie siguiente).

## Ficha breve

- Promesa: el ordenador no recuerda cómo trabajas; Workspace Launcher hace que lo recuerde. Sin logo, nombre ni eslogan en el vídeo (petición del usuario).
- Duración: 61,5 s · 60 fps · vertical 1080×1920 y horizontal 1920×1080 (mismo guion, voz y tiempos; composición adaptada).
- Estilo: motion graphics oscuro y premium, ventanas abstractas (no capturas de la interfaz), colores con significado: coral = problema, ámbar = memoria/IA, cian = zonas, verde = listo.
- Texto: cada palabra aparece cuando se pronuncia (tiempos de Whisper large-v3 por palabra); las claves se marcan con subrayador de color al decirse; bloques cortados por frases y comas. La última frase sube al centro como remate.

## Producción

- **Editable (fuente):** `04_Edicion/Remotion_VR012/` (Remotion 4.0.448). Copia de trabajo con dependencias: `C:\Herramientas\_work\VR012` (junction a `Videos Workspace launcher\video-editor\node_modules`).
  - `edit.config.json`: toma elegida (A/B) y pausa tras cada frase.
  - `scripts/preparar_voz.py` (Python de `local-voice-studio\.venv`): recorta tomas, las coloca, procesa la voz (paso alto, presencia, de-esser, compresión, −16 LUFS lineal) y escribe `src/voz.json` con cada palabra.
  - `scripts/sintetizar_audio.py` (Python del sistema): música propia sincronizada con la voz + efectos de encender/apagar. Ducking −10 dB con la envolvente real de la voz.
  - `scripts/masterizar.py`: limitador + loudnorm en dos pasadas → −14 LUFS, pico ≤ −1,5 dBTP.
  - Escenas en `src/scenes/` (Problema, Solucion, Funciones, Cierre); texto en `src/components/Captions.tsx` (palabras clave en `CLAVES`); efectos en `src/sonido.ts`.
- **Voz:** Gemini `es-es-training-9`, una sola voz, estilo por toma en `03_Recursos/voz/gemini/plan_vocal.json`. Dos tomas válidas por frase (A y B) verificadas con Whisper large-v3 en `03_Recursos/voz/gemini/tomas/`. Usadas: todas A salvo **t07 B** (hace la pausa «un clic. Y vuelve todo»). Alternativas para escuchar: t03 B lee la lista como preguntas.
- **Música:** compuesta por código para este vídeo (sin derechos de terceros): La menor oscuro con latido en el problema, corte en «amnesia», aceleración en «todos los días», silencio en el giro, floración en «memoria», tema en Do mayor con *drop* exacto en «vuelve todo», acorde final al encenderse.
- **Efectos:** pack manuDT (pops, glitch, whoosh digitales, clic, tic-tac, risers) + `Biblioteca_Sonidos/sfx_propios`; cada uno atado a un evento.
- **Mezcla medida:** voz ≈ 12 dB por encima de música+efectos (mediana por segundo con voz).

## Exportaciones (`05_Exportaciones/`)

- `VR012_V1_1080x1920_60fps.mp4` y `VR012_H1_1920x1080_60fps.mp4`: máster (CRF 16, ~570 MB).
- `*_publicar.mp4`: versión para subir (~190 MB, CRF 20 con tope 24 Mb/s).
- Audio masterizado: −13,9 LUFS integrado, pico −2,6 dBFS. Hojas de revisión `*_revision_fotogramas.png` sacadas de los MP4 finales.

## Versión en inglés (2026-10-21)

Pedida por el usuario tras aprobar la española (formato guardado como [FMT-004](../../Biblioteca_Formatos/FMT-004_Presentacion_Concepto_Motion_Karaoke.md)). Guion EN en la guía §10.

- Voz `en-us-training-6` (Gemini, `flash-lite`), 2 tomas por frase verificadas con Whisper (inglés); usadas todas A salvo t09 B. Tomas en `03_Recursos/voz/gemini/tomas_en/`.
- Mismo proyecto, composiciones `VR012-EN-Vertical` / `VR012-EN-Horizontal` (prop `lang`). Anclas ES→EN en `src/theme.ts` (`ANCLAS_EN`), claves en `CLAVES_EN`, días en inglés. Comandos: `preparar_voz.py en`, `sintetizar_audio.py en`.
- Exportaciones: `VR012_EN_V1_1080x1920_60fps.mp4`, `VR012_EN_H1_1920x1080_60fps.mp4` (+ `_publicar`), 66,6 s, −13,9 LUFS, pico −2,8 dBFS.
- Mejora del texto aplicada al hacerla (afecta a futuros renders también en español): un bloque nunca sale antes de mostrar su última palabra; salida más rápida; vertical a 78 px y 22 caracteres por línea. La exportación española V1 no se ha vuelto a renderizar.

## Revisión hecha por Claude

- Hojas de fotogramas cada 0,5 s en vertical y horizontal (renders de prueba): legibilidad, cortes de texto, posiciones; corregidos solapes de texto, palabras sueltas, botón de encendido, hilo ámbar.
- Niveles de audio medidos (no escuchados: no puedo oír). **La escucha y el visto bueno final son del usuario.**

## Tareas

- [x] Guía de presentación, ganchos y guion.
- [x] Voz verificada con Whisper (t01–t09 flash, t10–t11 flash-lite; aprobado por el usuario).
- [x] Animación, texto karaoke, música y efectos; render vertical y horizontal.
- [ ] El usuario lo ve y lo escucha; retoques.
- [x] Formato aprobado y guardado como FMT-004 (2026-10-21).
- [x] Versión en inglés, vertical y horizontal.
- [ ] Seguir con la serie (guía §9).
- [ ] Texto de publicación en `06_Publicacion/` (nombre de la app y enlace solo en la descripción).
