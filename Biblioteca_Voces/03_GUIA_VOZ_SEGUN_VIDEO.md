---
title: Qué voz y qué emoción según el vídeo
status: active
created: 2026-10-20
tags: [project/workspace-launcher, marketing, video, voz]
---

# Qué voz, qué emoción y qué ritmo según el vídeo

Guía para elegir la identidad inicial. **Una vez elegido un personaje, conserva su voz en todos los estados**: aplica emoción por frase con el [plan contextual](04_EXPRESIVIDAD_Y_PERSONALIZACION.md), no cambiando de clave. Las voces que aparecen en la tabla son candidatos de reparto, no sustituciones durante la actuación. Las claves (`doc_naturaleza`, `es_H_grito`…) están en [INDICE_VOCES.md](INDICE_VOCES.md); para oírlas, abre [Escuchar_Voces.html](Escuchar_Voces.html).

> [!note] Qué es dato y qué es hipótesis
> No hay un estudio fiable que diga «tal tipo de voz retiene más». Lo que sí repiten las guías de creadores es que pesan más **el ritmo, la sincronía con la imagen y la coherencia** (misma voz, mismo nivel de energía en una serie) que el timbre en sí. Las columnas de «por qué» son hipótesis editoriales para probar, no resultados medidos. Mide con las analíticas de cada plataforma (ver la skill `video-planificacion-retencion`).

## Elección por tipo de vídeo

| Tipo de vídeo | Voz (ES) | Voz (EN) | Estado / emoción | Ritmo y tratamiento |
| --- | --- | --- | --- | --- |
| **Gancho de meme de 1–3 s** (grito, exclamación) | `es_H_grito`, `es_H_euforia`, `locutor_deportes` | `en_H_grito`, `en_sports` | Máxima energía desde la primera sílaba | Sin pausa inicial; limitar pico (`alimiter`); sonido de impacto debajo |
| **Demo «mira esto»** | `youtuber_tech`, `youtubera_tech`, `chico_tiktok`, `chica_tiktok` | `en_tech`, `en_tech_ella`, `en_tiktok_guy` | Alegre → asombro en el momento WOW | `--acelerar 1.08`, frases ≤ 2 s |
| **Antes (caos) vs después (orden)** | Una sola voz elegida (p. ej., `dev_harto`) antes y después | Una sola voz elegida (p. ej., `en_dev_tired`) antes y después | Del estrés a la calma: la voz cuenta la historia | Antes rápido y cortante (1.1), después lento (0.95) |
| **«El humano en su hábitat»** | `doc_naturaleza`, `doc_naturaleza_ella` | `en_doc_naturaleza`, `en_doc_ella` | Asombro contenido, seriedad absurda | Lento, pausas largas; fx `eco` mínimo |
| **Tráiler / función estrella** | `trailer_epico`, `trailer_ella`, `lat_locutor_epico` | `en_trailer` | Épico, crescendo | fx `trailer`; música grave debajo |
| **Parodia de anuncio** | `teletienda`, `teletienda_ella` | `en_teleshop` | Entusiasmo exagerado | Rápido; «¡pero espera, hay más!» |
| **Serie Junior vs Senior** | Senior: `dev_harto` · Junior: `colega_joven`, `youtuber_tech` | `en_dev_tired` + `en_tiktok_guy` | Contraste de energía: hype contra deadpan | Un personaje = una voz fija en toda la serie |
| **Diálogo con el asistente de la app** | Humano: `colega_joven`; asistente: `asistente_ia` / `asistente_ia_ella` | `en_ai_assistant`, `en_ai_assistant_ella` | Asistente: educado, seco; humano: reactivo | Asistente con fx `limpio`; opcional `robot` leve |
| **Avisos / HUD / cuenta atrás** | `sistema_robot`, `megafonia`, `es_H_urgente` | `en_pilot` | Frío, mecánico o urgente | fx `robot`, `megafono`, `telefono` |
| **Intriga / misterio** | `misterio`, `villano`, `es_H_susurro` | `en_villain` | Susurro, tensión | Lento; silencios; sonido ambiente |
| **Datos y curiosidades** | `datos_curiosos`, `noticiero` | `en_news`, `en_deep_narrator` | Curiosidad, seriedad | 3,0–3,5 palabras/s; el dato al final |
| **Storytime / anécdota** | `historias_foro`, `cuentacuentos` | `en_story_reddit` | Calmado con picos | Voz constante; pausas antes del giro |
| **Tutorial largo** | `narradora_tutorial`, `tutorial_el` | `en_warm_narrator` | Calma, amabilidad | 2,3–2,6 palabras/s, sin efectos |
| **Vídeo oficial / web** | `presentador_pro`, `presentadora_pro` | `en_deep_narrator`, `en_warm_narrator` | Seguro, limpio | Sin exageración |
| **Cierre relajante / satisfactorio** | `asmr`, `meditacion`, `locutor_radio` | `en_asmr` | Calma, sonrisa | Lento; fx `susurro` |
| **Público latino** | `lat_narrador`, `lat_narradora`, `lat_joven_tiktok` | — | Cercano | Revisar la toma (acento experimental) |

## El arco de energía de un short (10–20 s)

1. **0–2 s, gancho:** el estado más intenso del vídeo (grito, asombro, pregunta, susurro inquietante). Sin saludo ni introducción.
2. **2–10 s, desarrollo:** energía media y estable; un cambio de imagen o sonido cada 1–2,5 s.
3. **Remate:** pico o contraste (silencio brusco, tono seco tras el hype, carcajada).
4. **Cierre:** frase corta con la energía baja para dar peso, o idéntica al gancho para que el bucle encaje.

## Velocidad orientativa (palabras por segundo)

| Formato | Velocidad | Cómo |
| --- | --- | --- |
| Shorts de meme | 3,3–3,8 | `--velocidad 1.08` y/o `--acelerar 1.1` |
| Demo / reacción | 3,0–3,5 | `--acelerar 1.05` |
| Tutorial | 2,3–2,6 | sin cambios |
| Documental / trailer / misterio | 1,8–2,2 | `--velocidad 0.95` y pausas largas (`--pausa 600`) |

Referencia en español: unas 3 palabras por segundo ≈ 180 palabras por minuto. Acelerar más de ×1,15 resta naturalidad; mejor acortar el texto.

## Mezcla de voces en un mismo vídeo

- Máximo **2–3 voces** distintas; más cansa y se pierde el personaje.
- Contrasta por **género + energía** (grave tranquila vs aguda rápida), no solo por timbre.
- Misma identidad por personaje en la serie; emoción e intención según lo que comunica cada escena. No exigir una emoción fija en todos los capítulos.
- Para actuación contextual usa `plan_vocal.json`: reparto fijo en `personajes` y dirección en cada toma. `guion.txt` conserva compatibilidad para locuciones simples.

## Ideas de composición rápida

- **Documental con sorpresa:** `doc_naturaleza` mantiene su identidad y cambia de calma a asombro. Si se añade otro personaje, definir su voz por separado.
- **Teletienda + dev harto:** `teletienda` vende la función; `dev_harto` responde «ya».
- **Asistente que baja la voz:** `asistente_ia` responde y cierra con emoción `susurro`, sin sustituirlo por la voz `asmr`.
- **Locutor deportivo:** el momento en que la app abre todo: `locutor_deportes` en `--acelerar 1.05`.
