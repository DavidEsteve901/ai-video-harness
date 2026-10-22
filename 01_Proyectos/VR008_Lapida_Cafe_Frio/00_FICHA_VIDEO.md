---
title: La lápida de Lucas — animación con historia
id: VR008
status: edicion
created: 2026-10-20
tags: [project/workspace-launcher, marketing, video-corto, animacion, storytelling]
---

# VR008 — «La lápida de Lucas»

> [!info] Idea
> **Gancho:** una lápida que dice «AQUÍ YACE LUCAS · Abrió Chrome 14.600 veces · A mano» y una voz de documental: «Esta será la lápida de Lucas. Y si nada cambia…»
> **Mensaje único:** montar el escritorio a mano cada mañana es una vida entera de café frío; hay otra forma.
> **Función real que enseña:** el clip auténtico del Senior de VR001 (lanzador → clic en «Lanzar» → ventanas en su zona), integrado en la historia. Nada inventado: las ventanas del «a mano» de Lucas son una caricatura, no la app.
> **Sin anuncio** (regla 2 de la guía): ni logo, ni nombre añadido, ni eslogan, ni URL. El remate es el chiste: la lápida cambia de epitafio.

## Ficha

- Duración: 28,6 s · vertical 1080×1920 · 60 fps · animación 2D propia (personajes en SVG, Remotion).
- Voz: `doc_naturaleza` (Biblioteca de Voces, original), semilla 5, ×1,05. Sin favoritas del usuario todavía en `FAVORITAS.md`: elegida por la guía («El humano en su hábitat» → seriedad absurda). **Pendiente de que la escuches.**
- Sonido: efectos y música sintetizados por nosotros (`scripts/sintetizar_sfx.py`), sin derechos. Sin canciones de terceros.
- Proyecto: [Remotion_VR008](04_Edicion/Remotion_VR008/README.md) · tiempos en `edit.config.json`.
- Clip real: `VR001…/02_Brutos/Video Senior.mp4` (12,9–15,28 ×1 · 16,3–17,95 ×2 · 17,95–20,4 ×1). El cronómetro «2,8 s» es el tiempo real medido en VR001.

- **V2 · voz continua (2026-10-20)**: [MP4](05_Exportaciones/VR008_Lapida_V2_voz_continua_1080x1920_60fps.mp4) · [fotogramas](05_Exportaciones/VR008_V2_revision_fotogramas.png). 30,3 s, −14,4 LUFS, pico −1,8 dB. Cambio pedido por el usuario: la V1 sonaba cortada (11 tomas sueltas, recortadas y normalizadas una a una). Ahora son **6 bloques continuos** (el bloque 2 es una sola toma de 9 s), un único ajuste de volumen para todos, recortes con holgura y fundidos suaves, ritmo ×1,07 igual en todos; los subtítulos, golpes y escenas se calculan desde las palabras de la voz (`src/timeline.ts`). El bloque «Un botón. / Tres segundos.» se generó junto y se partió en el silencio para que fluya.
- Voz: la V2 usa `vr008_narrador` (id `vb-vr008-narrador-documental-6ffc3c`, descripción de `doc_naturaleza`, semilla 101) creada en el estudio, porque otra sesión estaba reconstruyendo la Biblioteca de Voces y `doc_naturaleza` desapareció del estudio. No está en `catalogo_voces.json` (la reconstrucción lo sobrescribió).
- V1 (28,6 s, tomas sueltas) guardada en `05_Exportaciones/_anteriores`. No publicado.

## Guion (plan de retención)

| Tiempo | Voz / texto | Qué se ve | Sonido | Por qué |
| --- | --- | --- | --- | --- |
| 0–3,3 | «Esta será la lápida de Lucas. / Y si nada cambia…» | Lápida de noche con el epitafio ya legible; golpe | Golpe grave + viento | Resultado primero + pregunta abierta: ¿qué debe cambiar? |
| 3,3–4,2 | — | Rebobinado VHS «◀◀ REBOBINAR · DÍA 13.916» | Rebobinado | Giro de tiempo, promete la historia |
| 4,2–14,7 | «Lunes. Nueve en punto. / Abre el editor, la terminal, el navegador. / …y cuando por fin empieza a trabajar… el café ya está frío.» | Lucas con su café humeante; ventanas que se abren torcidas y se arrastran; reloj 9:00→9:31; la taza se congela | Reloj, plops, clics, trombón triste + hielo | Situación reconocible, tensión creciente, remate emocional («frío») |
| 14,7–18,6 | «Mañana, lo mismo. 14.600 veces.» | Calendario que se pasa cada vez más rápido, reloj enorme, torre de tazas frías, Lucas que envejece (14.600 = 40 años) | Páginas + tic-tac + riser + golpe | Aceleración: el espectador siente el coste acumulado |
| 18,6–24,5 | «Hasta que Sofía se sienta a su lado. / Un botón. / Tres segundos.» | Entra Sofía con café caliente; su monitor sustituye al de Lucas; clip REAL: zoom al botón Lanzar, silencio, clic, drop, ventanas encajan; cronómetro 2,8 s; Lucas flipando | Riser → silencio → clic → impacto + música cálida | Demo real en el pico emocional; el contraste (café frío / caliente) lo explica sin hablar |
| 24,5–28,6 | «Esta es la lápida de Lucas. Ahora.» | Tachón rojo, amanece, nuevo epitafio «Su café siempre estuvo caliente.» | Pájaros + ding | Se cierra el bucle abierto del segundo 0; enlaza con el inicio |

## Notas y suposiciones
- Los nombres (Lucas, Sofía) y «14.600 veces» son ficción: 40 años × 365 días, una vez al día. Es un chiste aritmético, no un dato de la app.
- Tiempo del lanzamiento: 2,8 s medidos en VR001 (desde el clic hasta todo colocado); el vídeo acelera ×2 el tramo de ventanas, como VR001.
- El clip lleva la interfaz real de la app (con su nombre dentro de la ventana): es la demo auténtica, no un añadido.
- Falta una versión **en inglés** y una **sin voz** (música de la plataforma); se pueden sacar cambiando `vo` y los subtítulos.

## Tareas
- [x] Plan de historia y gancho.
- [x] Voz, sonidos, animación y montaje V1.
- [ ] Revisión del usuario (escuchar la voz, ritmo, personajes).
- [ ] Portada y publicación (textos en `06_Publicacion/`).

## Publicación
| Plataforma | Fecha | URL |
| --- | --- | --- |
| TikTok / Reels / Shorts | | |
