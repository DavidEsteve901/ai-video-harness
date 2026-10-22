---
title: "VR004 — Jarvis cuando se entera (pantalla dividida)"
id: VR004
status: edicion
created: 2026-10-20
tags: [project/workspace-launcher, marketing, video-corto]
---

# VR004 — Jarvis cuando se entera de que le he quitado el trabajo

> [!info] Idea (humor muy básico, a propósito)
> Pantalla dividida: **arriba** el vídeo de Tony Stark gritando (largo, con todo su tiempo); **abajo** tu demo de las palmadas usándolo. **Sin efectos de sonido ni añadidos**: solo los dos vídeos y un texto tipo «cuando Jarvis se entera de que le he quitado el trabajo». Un vídeo ridículo.

## Montaje

| Zona | Contenido |
| --- | --- |
| Banda blanca superior (502 px) | «Jarvis cuando se entera de que le he quitado el trabajo 😭» (Inter ExtraBold, texto negro) |
| Centro (810 px; el clip se amplía para quitar sus barras negras) | `Tony_gritando_27s.mp4` (el grito se repite en bucle) con su audio original |
| Abajo (608 px, 16:9 sin recortar) | `Palmadas_demo_original.mp4` (25,45 s) |

Duración 24,75 s: el clip del grito dura 27,3 s pero sus últimos 2,5 s están en negro, así que el vídeo termina donde acaba su contenido (se pierden 0,7 s finales de la demo, ya sin acción). 1080×1920, 60 fps. Sin aceleración; el grito se amplía para quitar sus barras negras.

## Decisiones (editables en `04_Edicion/Remotion_VR004/edit.config.json`)

- Audio: **solo el del grito** (`tonyAudio: true`); la demo va muda (`demoAudio: false`) porque los gritos taparían las palmadas. Se puede cambiar.
- Texto: variante alternativa «Jarvis cuando se entera de que lo he sustituido por unas palmadas».
- Orden: se hizo después de VR003, a petición del usuario.

## Archivos

- Vídeo: `05_Exportaciones/VR004_Jarvis_Pantalla_Dividida_1080x1920_60fps.mp4`
- Proyecto: `04_Edicion/Remotion_VR004/` (misma mecánica que VR003: copia de trabajo local + junction a `node_modules`).

## Tareas

- [x] Montar y exportar
- [ ] Revisión del usuario (texto, qué audio)
- [ ] Texto de publicación y publicar

## Publicación

| Plataforma | Título / texto | Fecha | URL publicada |
| --- | --- | --- | --- |
| Por decidir | | | |
