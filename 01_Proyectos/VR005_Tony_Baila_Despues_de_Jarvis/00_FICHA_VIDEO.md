---
title: "VR005 — Cómo se siente tener a Jarvis (Tony bailando)"
id: VR005
status: edicion
created: 2026-10-20
tags: [project/workspace-launcher, marketing, video-corto]
---

# VR005 — «Yo usando mi Jarvis» → Tony bailando

> [!info] Idea (muy básica, a propósito)
> Lo primero que se ve es **tu demo de las palmadas, cortísima** (2,2 s), con solo las palmadas audibles, para que nadie haga scroll. Después **Tony Stark bailando con su música**, feliz, con el mensaje «Cómo se siente tener a Jarvis».

## Línea de tiempo (14,2 s · 1080×1920 · 60 fps)

| Tiempo | Qué se ve | Qué se oye | Texto |
| --- | --- | --- | --- |
| 0–2,2 | Demo de las palmadas: dos palmadas a velocidad normal (0–0,7 s) y ventanas abriéndose a ≈×3,5 (16:9 sobre fondo desenfocado) | **Se oyen las dos palmadas** (audio real de la grabación); después silencio | «Yo usando mi Jarvis» |
| 2,2–14,2 | Tony bailando (12 s, clip recortado a su contenido 360×360), flash y pequeño zoom en el corte | La **música del propio clip** entra de golpe justo cuando vuelve su ritmo (≈120 BPM) | «Cómo se siente tener a Jarvis» (afirmación, texto simple en negro) con **solo animación de pulsación**: late con cada golpe de la música |

Sin efectos ni sonidos añadidos: el contraste palmadas → silencio → música de golpe es el único «efecto».

## Historial de cambios pedidos por el usuario (2026-10-20)

1. Primera versión: demo muda de 2 s. → **Que se escuchen las palmadas en el primer tramo** (hecho).
2. El texto del baile debe ser una **afirmación** («Cómo se siente tener a Jarvis», sin interrogantes) y **sin animaciones salvo la pulsación** al ritmo de la música (hecho; se probó y se descartó la entrada palabra a palabra y el cambio de color).
3. El baile de Tony **más largo** (de 5 a 12 s).
4. El primer tramo debe decir **«Yo usando mi Jarvis»** y luego aparece Tony bailando.
5. No convence el texto en banda blanca → **versión B con el texto sobre el vídeo** (hecho; la A se conserva).
6. **Versión «Felicidad» sin Jarvis**: los textos hablan de lo que hace el producto (rapidez, facilidad, ya no hacerlo a mano) y Tony bailando es la felicidad que da. Mismos tiempos, audio y montaje (hecho; las versiones Jarvis se conservan). Ajuste del usuario: primer tramo **sin texto** y el baile con «Yo al no tener que perder mi pu** tiempo montándome el setup» (la letra del overlay se reduce sola si el texto es largo).

## Textos de la versión «Felicidad» (sin Jarvis)

| Tramo | Texto |
| --- | --- |
| Demo (0–2,2 s) | *(sin texto)* |
| Baile (2,2–14,2 s) | «Yo al no tener que perder mi pu** tiempo montándome el setup» |

Claves en `edit.config.json`: `textoDemoFelicidad` y `textoBaileFelicidad`. Composiciones: `VR005-Felicidad-Overlay` (texto sobre el vídeo) y `VR005-Felicidad` (banda blanca).

Primera propuesta, descartada: «Yo empezando a trabajar ahora» / «Cuando ya no abres todo a mano». Se escribe «pu**» (censurado) para que la plataforma no lo detecte como insulto. Otras opciones cortas: «Cuando todo se abre en 2 segundos» · «Cuando empiezas el día sin esperar» · «Lo que antes eran 10 minutos» · «Cuando ya no pierdes la mañana».

## Versión en inglés

| Tramo | Texto |
| --- | --- |
| Demo (0–2,2 s) | *(sin texto)* |
| Baile (2,2–14,2 s) | «Me not having to waste my f**king time setting up my workspace» |

Claves: `textoDemoFelicidadEN` y `textoBaileFelicidadEN`. Archivos en `05_Exportaciones/`: `VR005_EN_TextoSobreVideo.mp4`, `VR005_EN_TextoSobreVideo_Fijo.mp4`, `VR005_EN_BandaBlanca.mp4`, `VR005_EN_BandaBlanca_Fijo.mp4` (composiciones `VR005-EN-*`; «_Fijo» = sin pulsación).

## Decisiones (editables en `04_Edicion/Remotion_VR005/edit.config.json`)

- Textos: `textoDemo` y `textoBaile`. La duración del baile es `baile.duration` (y `duration` total = demo + baile).
- Duración de la demo (`demo.duration`, 2,2 s): bajarla acelera aún más; las palmadas deben seguir oyéndose.
- Clip de baile: `Tony-Stark-Dancing-SnapYT.App.mp4` (hay otro, `bailando`, vertical y de menor calidad). Quedan 4,5 s de clip sin usar tras los 12 s.
- Estilo igual que VR004: banda blanca superior con texto negro.

## Archivos

- Versión A (banda blanca): `05_Exportaciones/VR005_Tony_Baila_1080x1920_60fps.mp4`
- Versión B (texto sobre el vídeo): `05_Exportaciones/VR005_Tony_Baila_1080x1920_60fps_TextoSobreVideo.mp4` — composición `VR005-Baila-Overlay`: sin banda, vídeo centrado sobre fondo desenfocado y texto en mayúsculas blancas (Anton) con contorno negro pegado al borde superior de la imagen; mismo ritmo, pulsación y audio que la A.
- Versión Felicidad: `05_Exportaciones/VR005_Felicidad_TextoSobreVideo.mp4` y `05_Exportaciones/VR005_Felicidad_BandaBlanca.mp4`.
- Versión Felicidad con **texto fijo** (sin pulsación, a petición del usuario): `05_Exportaciones/VR005_Felicidad_TextoSobreVideo_Fijo.mp4` y `..._BandaBlanca_Fijo.mp4` (composiciones `VR005-Felicidad-Overlay-Fijo` y `VR005-Felicidad-Fijo`).
- Proyecto: `04_Edicion/Remotion_VR005/` (misma mecánica que VR003/VR004: copia de trabajo local + junction a `node_modules`).

## Tareas

- [x] Montar y exportar
- [ ] Revisión del usuario (texto, duración de la demo y del baile)
- [ ] Texto de publicación y publicar

## Aprendizajes

- Palmadas reales → 1,3 s de silencio → música de golpe funciona como gancho de sonido sin añadir nada: la música del meme es el «drop».
- La música del clip tiene una pausa entre 4,4 y 6,9 s y el ritmo vuelve en 6,9: ahí cae el corte. El pulso es de ≈0,498 s; el texto animado se sincroniza con él.
