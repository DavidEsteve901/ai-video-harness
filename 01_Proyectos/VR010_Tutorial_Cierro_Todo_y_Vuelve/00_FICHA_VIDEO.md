---
title: Cierro todo y vuelve (recorte vertical del tutorial)
id: VR010
status: edicion
created: 2026-10-20
tags: [project/workspace-launcher, marketing, video-corto, recorte-tutorial, demo]
---

# VR010 — «Cierro todo… y vuelve con un clic»

> [!info] Idea
> **Origen:** el tutorial largo en español `Grabaciones_Personales/05_Exportaciones/T01_Tutorial_ES/T01_Tutorial_ES_1440p.mp4` (4:31, 2560×1440, 60 fps). No se reutiliza su voz ni su estructura: se extrae **un momento que se entiende solo** (regla del perfil editorial para recortes) y se reencuadra a vertical con cámara animada.
> **Promesa única:** cierras todo tu entorno de trabajo y un clic lo devuelve entero y en su sitio.
> **Función real:** limpiar y lanzar un workspace (grabación real del tutorial, sin trucos; solo acelerada en las esperas).
> **Sin anuncio** (regla 2): sin logo, eslogan, URL ni precio. Solo asoma «Web» (nombre del workspace de la demo) en la pantalla de carga.

## V2 — con la voz original del tutorial (2026-10-20)
- Pedido del usuario: explicarlo con recursos limpios y **la voz que ya tenía el vídeo**, mejor pensado para vertical.
- Voz: el narrador del tutorial (`narrador-launcher-es-286f8b`), con sus tomas originales de `Grabaciones_Personales/02_Audio` recortadas por frase: Introducción 1-3 («Te sientas al ordenador… ¿Te suena?… Con Workspace Launcher… un clic») + Creación 17, 18, 19 («Vamos a comprobarlo… Ahora lo lanzamos de nuevo… Y aquí está el resultado… La próxima vez…»). Montaje de voz: `03_Recursos/voz/build_voice_v2.py` → `narracion_v2.wav`; tiempos en `voz_v2.json`. Ojo: las tomas ya vienen recortadas, empiezan en 0,0 s (cortar en 0,18 s se comía «Te», «Con», «Y»).
- Imagen: brutos limpios `Creacion Workspace Bueno.mp4` e `Introduccion.mp4` (sin rótulos ni transiciones del tutorial). Cortes en `04_Edicion/Remotion_VR010/edit.v2.json`; composición `VR010-V2-Voz`.
- Estructura: problema (¿otra vez lo mismo? + ABRIR APPS / BUSCAR ARCHIVOS / COLOCAR VENTANAS en el momento de cada palabra) → promesa (un clic, con avance del resultado) → prueba (cierro todo → lo lanzo de nuevo → ¡resultado!) → cierre (zoom-out al escritorio entero en verde).
- Diseño: subtítulos palabra a palabra (Whisper por palabra, palabra activa en amarillo), titulares por fase, barra de progreso, cámara animada, efectos propios muy bajos bajo la voz.
- Exportación: [MP4](05_Exportaciones/VR010_V2_voz_1080x1920_60fps.mp4) · [fotogramas](05_Exportaciones/VR010_V2_revision_fotogramas.png). 38,8 s, −14 LUFS, pico −1,5 dB. No publicado.
- Esta versión **nombra la app** (la voz dice «Workspace Launcher») y explica: es la excepción de formato tutorial, no de la serie de memes. Sin voz de la V1 sigue en 05_Exportaciones.
- Pendiente de tu revisión: ritmo (38 s), si prefieres recortar «Primero limpiamos…» y añadir música.

## Ficha V1
- Duración: 14,9 s · vertical 1080×1920 · 60 fps · H.264/AAC, −14 LUFS, pico −1,5 dB.
- Exportación V1: [MP4](05_Exportaciones/VR010_V1_1080x1920_60fps.mp4) · [fotogramas](05_Exportaciones/VR010_V1_revision_fotogramas.png). No publicado.
- Sin voz: la voz del tutorial no encaja en un corto. Va con rótulos grandes + efectos propios (`Biblioteca_Sonidos/sfx_propios`, sin derechos).
- Proyecto: `04_Edicion/Remotion_VR010` (cortes y cámara en `edit.config.json`). Copia local de trabajo `C:\Herramientas\_work\VR010` con junction a `node_modules` (método de la guía).
- Reencuadre: la pantalla 16:9 no cabe en 9:16 sin perder legibilidad, así que una **cámara** (recorte + zoom animado) sigue la acción: izquierda → derecha en el gancho, diálogo central, botón Lanzar en primer plano, pantalla de carga, ventanas que aparecen, y al final **zoom-out** al escritorio entero.

## Guion
| Tiempo | Texto | Qué se ve (origen) | Sonido |
| --- | --- | --- | --- |
| 0–2,4 | ESTE ES MI ESCRITORIO DE TRABAJO · VOY A CERRAR TODO | Escritorio ya montado, barrido de cámara (181–183,4 s) | Golpe |
| 2,4–4,8 | LO CIERRO TODO · ADIÓS, VENTANAS 👋 | Diálogo «Clean workspace» y cierre (164,6–167,6 ×1,25) | Whoosh |
| 4,8–5,8 | UN CLIC | Zoom al botón Lanzar y clic (168,6–170,6 ×2) | Hit al clic |
| 5,8–7,4 | Y ÉL SOLO… · …LO ABRE Y LO COLOCA | Pantalla de carga con progreso (171,4–174,6 ×2) | Riser |
| 7,4–11,25 | SE ABRE TODO Y EN SU SITIO · ✓ EDITOR ✓ TERMINAL ✓ WEB | Aparecen editor, terminal, navegador y carga la página (174,6–179,4 ×1,25) | Pop por ventana |
| 11,25–14,9 | TODO COMO LO DEJÉ · 3 APPS · 1 CLIC | Resultado final y zoom-out (179,4–182,8) | Ding |

«3 APPS» es literal: el log de la propia app dice «3 app(s)». Los tiempos de los pops por ventana (7,4 / 7,7 / 8,1 / 10,7) son estimados sobre el origen; ajustables en `edit.config.json`.

## Variantes de apertura (planificación)
| Familia | Apertura | Decisión |
| --- | --- | --- |
| Resultado primero | Escritorio ya montado + «voy a cerrar todo» | **Elegida** |
| Situación reconocible | «Cada mañana: abrir, buscar, colocar…» | Variante (usa la frase 2 del tutorial) |
| Pregunta | «¿Cuántos clics te cuesta montar tu escritorio?» | Variante |
| Humor | Tony reaccionando al cierre (IDEA-016/002) | Variante; encaja con el tono de la serie |

## Otros recortes posibles del mismo tutorial (no hechos)
| ID tentativo | Tramo origen | Promesa | Nota |
| --- | --- | --- | --- |
| A | 1:19–1:31 | «Arrastras la ventana en el panel y se mueve en tu escritorio» | Muy visual (zona cian sobre el escritorio); mismo método de cámara |
| B | 1:09–1:19 | «Eliges cómo repartir las ventanas: una grande y dos pequeñas» | Zona del layout |
| C | 3:29–4:31 | «Añado Spotify al workspace y se abre con el DJ puesto» | Hook musical; pide revisar derechos visuales de la portada |
| D | 0:00–0:27 | Voz original sobre «te sientas… y otra vez lo mismo» | Único tramo donde la voz del tutorial funciona sola |

## Tareas
- [x] Plan, cortes, cámara, rótulos, efectos, montaje y medición.
- [ ] Revisión del usuario (ritmo, textos, si se quiere voz o música).
- [ ] Versión con voz (`voces-locucion`) y/o inglés.
- [ ] Portada y publicación.

## Publicación
| Plataforma | Fecha | URL |
| --- | --- | --- |
| TikTok / Reels / Shorts | | |
