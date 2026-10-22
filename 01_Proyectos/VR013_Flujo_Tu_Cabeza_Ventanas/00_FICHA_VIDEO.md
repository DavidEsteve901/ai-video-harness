---
title: "VR013 — «Tu cabeza tiene demasiadas ventanas abiertas» (entrar en flujo)"
id: VR013
status: edicion
created: 2026-10-21
tags: [project/workspace-launcher, marketing, video, presentacion, flujo, foco, motion-graphics]
formato: FMT-004
---

# VR013 — Entrar en flujo

> [!info] Estado (2026-10-21)
> **V1 producida** en vertical y horizontal con el formato aprobado [FMT-004](../../Biblioteca_Formatos/FMT-004_Presentacion_Concepto_Motion_Karaoke.md). Pendiente de que el usuario la vea y la escuche. No publicada.

**Guía, ganchos y guion:** [00_GUIA_Y_GUION.md](00_GUIA_Y_GUION.md).

## Ficha breve

- Concepto: la carga mental de buscar, apuntar y arrastrar ventanas nos saca del foco; con un mapa espacial fijo (escritorios virtuales) y gestos del pulgar (X1/X2, Alt+X2 zona bajo el puntero, Shift+X2 pestañas bajo el puntero) dejamos de pensar en las ventanas y entramos en flujo. Cierre en bucle: «demasiadas ventanas abiertas» → «una sola ventana abierta: la que importa».
- Funciones comprobadas en el código (1.2.7) y en la web («Flujo ergonómico»); se activan con el preset opcional de atajos. Sin cifras.
- 62,2 s · 60 fps · vertical 1080×1920 y horizontal 1920×1080.

## Producción

- Editable: `04_Edicion/Remotion_VR013/` (copia de trabajo `C:\Herramientas\_work\VR013`), derivado del proyecto de VR012. Escenas en `src/scenes/Mente.tsx`; componentes nuevos en `src/components/Mind.tsx` (cabeza de perfil con recorte, ventanas mini, medidor de energía mental, hilo del foco que se rompe, ratón con X1/X2, teclas, habitaciones del mapa).
- Voz Gemini `es-es-training-9`, modelo `gemini-3.8-flash-lite-tts` (el principal no tenía cupo; el usuario no distingue ambos), 2 tomas por frase verificadas con Whisper large-v3 (`03_Recursos/voz/gemini/`). Arreglo: Whisper escribe «100» por «cien»; la comprobación ya acepta cifras.
- Música propia (`scripts/sintetizar_audio.py`, secciones ancladas a: «abiertas», «cien», «sola», «avanza» (drop), beneficio sin bombo, silencio antes de «flujo» y acorde final). Ducking −10 dB; voz ≈ 11,5 dB sobre el fondo (mediana); master −14 LUFS.

## Exportaciones (`05_Exportaciones/`)

- `VR013_V1_1080x1920_60fps.mp4`, `VR013_H1_1920x1080_60fps.mp4` (máster) y `*_publicar.mp4` (para subir).

## Exportaciones en inglés

`VR013_EN_V1_1080x1920_60fps.mp4`, `VR013_EN_H1_1920x1080_60fps.mp4` (+ `_publicar`), −13,9 LUFS, pico −2,9 dBFS. Vertical: 23 caracteres por línea (evita palabras sueltas en inglés).

## Revisión hecha por Claude

Hojas de fotogramas cada 0,5 s en los dos formatos; corregidos: tamaño de cabeza y ratón, desorden de la escena 2, pila de la zona más visible, teclas más grandes, habitaciones vacías que asomaban, ratón que tapaba un escritorio y solape de texto entre frases rápidas. Audio medido, no escuchado: la escucha final es del usuario.

## Tareas

- [x] Guía, ganchos y guion.
- [x] Voz, animación, música, render V+H.
- [ ] El usuario lo ve y lo escucha; retoques.
- [x] Versión en inglés (2026-10-22): voz `en-us-training-6` (flash-lite, una toma por frase por cupo), 67,1 s, `VR013_EN_*`; composiciones `VR013-EN-*`, anclas en `ANCLAS_EN`, claves en `CLAVES_EN`. Capítulos EN en `06_Publicacion`.
