---
title: Índice de voces (para agentes)
status: active
tags: [project/workspace-launcher, marketing, video, voz]
---

# Índice de voces — Biblioteca de Voces

> Generado por `herramientas/construir_indices.py` desde `herramientas/catalogo_voces.json` (fuente de verdad: ahí están el `voice_id`, la descripción de diseño y la semilla).
> **Todas son voces sintéticas diseñadas por descripción; no imitan ni clonan a nadie.** Muestras: `muestras/…` (mp3) o abre `Escuchar_Voces.html`.

> **Voces en la nube (Gemini):** 30 base + 22 castellanas + 86 latinas, voces propias guardadas y control de emoción por toma: [06_GEMINI_VOCES.md](06_GEMINI_VOCES.md). Costes: céntimos por vídeo.

> **Antes de elegir:** lee [FAVORITAS.md](FAVORITAS.md): son las voces que el usuario marcó con ⭐ en la web. Si alguna encaja con el encargo, úsala.

## Cómo usarlas (resumen)

```powershell
$py = 'C:\Herramientas\local-voice-studio\.venv\Scripts\python.exe'   # vale cualquier Python 3
$h  = '<RAIZ_REPO>\Biblioteca_Voces\herramientas'
& $py "$h\locutor.py" listar --lang es --buscar documental
& $py "$h\locutor.py" decir --voz doc_naturaleza --texto "Aquí, en su hábitat natural…" --salida C:\ruta\locucion
& $py "$h\locutor.py" decir --archivo guion.txt --lang es --fx radio --salida C:\ruta\locucion   # varias voces con [clave] por línea
```

Salida: `locucion.wav` (mezcla), `locucion_tomas\0001.wav…` (una por línea) y `locucion.json` (inicio/duración de cada toma para sincronizar en Remotion). Detalle en la skill `.agents/skills/voces-locucion/SKILL.md`.

**36 arquetipos · 0 voces de la paleta de emociones**.

- **Bilingüe (ES+EN)** = el timbre se clonó en el otro idioma y Whisper confirmó que lee bien el texto. «ES» o «EN» = solo verificada en su idioma (puede funcionar en el otro; revisa la toma).
- **Continuidad**: una voz fija por personaje; emoción e intención por toma. La paleta no es un selector de estados de la misma identidad.

- **Emociones**: claves `{es|en}_{H|M}_{emoción}` (H = timbre de hombre, M = mujer). Ver la sección final.

## Narradores

| Clave | Voz | Idioma | Para qué |
| --- | --- | --- | --- |
| `abuela_cuentos` | Abuela cuentacuentos | ES | Contraste generacional, humor tierno, historias. |
| `tutorial_el` | Instructor cercano (él) | ES | Tutoriales largos y demos paso a paso. |
| `historias_foro` | Narrador de historias (foro) | ES | Historias en primera persona, «storytime», anécdotas. |
| `narradora_tutorial` | Narradora de tutorial | ES | Tutoriales, demos de funciones, vídeos largos con pasos. |
| `presentador_pro` | Presentador de producto (él) | ES | Vídeo oficial, web, anuncios serios, explicación de beneficios. |
| `presentadora_pro` | Presentadora de producto (ella) | ES | Vídeo oficial, web, anuncios, mensaje de marca. |
| `trailer_ella` | Tráiler épico (ella) | ES | Gancho misterioso o épico con otro color de voz. |
| `trailer_epico` | Tráiler épico (él) | ES | Presentar una función como estreno del año; ganchos de 3 s; cierre. |
| `datos_curiosos` | «¿Sabías que…?» | ES | Datos, estadísticas, shorts educativos y de curiosidades. |

## Energía y marketing

| Clave | Voz | Idioma | Para qué |
| --- | --- | --- | --- |
| `chica_tiktok` | Chica TikTok | ES | Shorts/Reels de descubrimiento, «cosas que no sabías». |
| `influencer_pija` | Influencer pija | ES | Parodia ligera, contraste cómico. |
| `megafonia` | Megafonía / capitán de vuelo | ES | Avisos graciosos, «atención por megafonía». |
| `youtubera_tech` | Youtubera tech (ella) | ES | Reacción, demo rápida, tutoriales dinámicos. |

## Humor y personaje

| Clave | Voz | Idioma | Para qué |
| --- | --- | --- | --- |
| `asistente_ia_ella` | Asistente IA irónica (ella) | ES | Respuesta del asistente de la app con voz femenina. |
| `detective_noir` | Detective noir | ES | Intriga cómica, narración «en off» de misterio. |
| `dev_harto` | Dev senior harto (él) | ES | Serie Junior vs Senior; humor de oficina. |
| `mafioso` | Jefe de la mafia | ES | Humor de «ofertas que no puedes rechazar». |
| `mayordomo` | Mayordomo elegante | ES | Asistente de lujo, humor refinado. |
| `robot_simpatico` | Robot simpático | ES | Mascota de la app, guiños simpáticos. |
| `soporte_tecnico` | Soporte técnico amable | ES | Parodia de atención al cliente. |
| `sistema_robot` | Voz de sistema / aviso | ES | Avisos tipo alerta, cuenta atrás, estética HUD. |

## Íntimas y ambiente

| Clave | Voz | Idioma | Para qué |
| --- | --- | --- | --- |
| `misterio` | Misterio / true crime | ES | Ganchos de intriga («nadie sabe por qué…»). |
| `asmr` | Susurro ASMR | ES | Vídeos «satisfactorios»; orden perfecto; cierre relajante. |
| `meditacion` | Voz de calma / meditación | ES | Tono de paz en cierres; contraste cómico con imágenes de caos. |

## Español latino

| Clave | Voz | Idioma | Para qué |
| --- | --- | --- | --- |
| `lat_narradora` | Narradora latina neutra (ella) | ES | Vídeos dirigidos a Latinoamérica. |

## Inglés

| Clave | Voz | Idioma | Para qué |
| --- | --- | --- | --- |
| `en_deep_narrator` | Deep narrator (he) | EN | Serious explainers, facts. |
| `en_trailer` | Epic trailer (he) | EN | EN hook/closing. |
| `en_ai_assistant` | Ironic AI assistant (he, British) | EN | EN version of the app's assistant. |
| `en_ai_assistant_ella` | Ironic AI assistant (she) | EN | EN female assistant. |
| `en_doc_naturaleza` | Nature documentary (he) | EN | Same joke as the ES documentary. |
| `en_doc_ella` | Nature documentary (she) | EN | Alternate voice for series. |
| `en_story_reddit` | Story narrator | EN | Storytime, anecdotes. |
| `en_tech_ella` | Tech youtuber (she) | EN | EN demos and reactions. |
| `en_tiktok_girl` | TikTok girl | EN | EN shorts. |
| `en_dev_tired` | Tired senior dev | EN | EN Junior vs Senior. |
| `en_warm_narrator` | Warm narrator (she) | EN | Explainers, storytelling, web. |

## Paleta de emociones — muestras de interpretación

Claves: `es_H_alegre`, `es_M_grito`, `en_H_sarcasmo`… Emociones disponibles: `alegre`, `euforia`, `asombro`, `sarcasmo`, `enfado`, `grito`, `tristeza`, `susurro`, `miedo`, `calma`, `serio`, `deadpan`, `epico`, `picaro`, `urgente`, `orgulloso`.

| Emoción | Mejor para |
| --- | --- |
| `alegre` — Alegre | Resultados, logros, cierres amables, «funciona». |
| `euforia` — Euforia / hype | Ganchos de 1 s, drops de música, momento WOW. |
| `asombro` — Asombro | Primera reacción ante la demo; «no me lo creo». |
| `sarcasmo` — Sarcasmo / ironía | Memes, humor, réplica a un error absurdo. |
| `enfado` — Enfado / frustración | El «antes» caótico, bugs, problemas que resuelve la app. |
| `grito` — Grito | Gancho de meme, escena de pánico (limitar el pico). |
| `tristeza` — Tristeza | El «antes» dramático; melodrama cómico; despedidas. |
| `susurro` — Susurro | Secretos, trucos escondidos, ASMR, suspense. |
| `miedo` — Miedo / tensión | Terror cómico («otra pestaña abierta»), cuenta atrás. |
| `calma` — Calma / tranquilizador | El «después» ordenado, soluciones, cierres relajantes. |
| `serio` — Serio / autoridad | Datos, avisos, normas, parte formal. |
| `deadpan` — Aburrido / deadpan | Humor seco, Senior harto, contraste con hype. |
| `epico` — Épico / dramático | Tráiler, presentación de función estrella. |
| `picaro` — Pícaro / cómplice | «Truco que no te cuentan», humor ligero. |
| `urgente` — Urgente | Ganchos tipo «¡para!», avisos, cuenta atrás. |
| `orgulloso` — Orgulloso / triunfal | Mic-drop final, «lo conseguí», resultado. |

Cómo se combinan voz y emoción: ver [04_EXPRESIVIDAD_Y_PERSONALIZACION.md](04_EXPRESIVIDAD_Y_PERSONALIZACION.md). Qué elegir según el vídeo: [03_GUIA_VOZ_SEGUN_VIDEO.md](03_GUIA_VOZ_SEGUN_VIDEO.md).
