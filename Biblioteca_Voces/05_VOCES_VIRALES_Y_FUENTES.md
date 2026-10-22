---
title: Voces virales, estilos con retención y fuentes
status: active
created: 2026-10-20
tags: [project/workspace-launcher, marketing, video, voz, investigacion]
---

# Voces virales, estilos que retienen y de dónde sacar más

Búsqueda hecha el 2026-10-20. **Resultado honesto:** no existe un estudio fiable que compare tipos de voz y retención; casi todo lo publicado son guías de proveedores de voz sintética y blogs de marketing. Lo útil es qué estilos se repiten, y todos se pueden recrear con voces **originales** en el proyecto sin clonar a nadie.

## Qué dicen las fuentes (todas de proveedores o blogs; tratarlas como hipótesis)

- **Ritmo y sincronía > timbre.** La narración funciona como capa de retención cuando está apretada y sincronizada con la imagen; el silencio muerto o el texto en pantalla sin voz se abandona antes. Escribir para el oído: leer el guion en voz alta antes de generar. ([socialk.it](https://socialk.it/es/blog/voiceover-videos-for-social-media))
- **Coherencia.** «Misma voz, mismo ritmo, mismo nivel de energía» construye un canal reconocible; y variar el ritmo con sorpresas crea picos de atención. ([InVideo](https://info.invideo.io/best-ai-voiceovers-faceless-short-videos))
- **Estilos que repiten las guías:** narrador cálido y de confianza (storytelling, «¿sabías que…?», canales sin cara) · voz enérgica y expresiva (tendencias, estilo de vida) · documental autoritario (explicativos, educativo) · voz neutra y clara tipo «voz de TikTok» · voz masculina grave para seriedad. ([OfflineTTS](https://offlinetts.com/blog/tts-for-tiktok-shorts-reels/), [Top TikTok Voiceovers](https://vpn.ijoomla.com/blog/top-tiktok-voiceovers-the-voices-you-need-to-know-1764796831))
- **Subtítulos siempre:** muchas personas ven sin sonido. ([Submagic](https://www.submagic.co/es/blog/voiceover-instagram-reels))
- Una biblioteca de voces comercial lista, entre las «TikTok», un narrador americano enérgico y un británico cálido y cercano (página de proveedor, no dato de popularidad). ([ElevenLabs](https://elevenlabs.io/voice-library/tiktok))

## Estilos virales conocidos → equivalente propio (ya creado)

Los estilos de la columna izquierda son los que más se ven en vídeos cortos (lista basada en lo anterior y en conocimiento general, no en una medición). Todos se hacen con una voz **diseñada**, no copiada.

| Estilo viral | Equivalente propio | Clave(s) |
| --- | --- | --- |
| Narrador cálido «de confianza» (storytelling, canales sin cara) | Narrador cálido | `en_warm_narrator`, `narradora_tutorial`, `lat_narradora` |
| Voz enérgica y expresiva de tendencias | Chica/chico TikTok, youtuber | `chica_tiktok`, `chico_tiktok`, `youtuber_tech`, `en_tiktok_girl` |
| Documental autoritario («¿sabías que…?», explicativos) | Documental, noticiero, datos curiosos | `doc_naturaleza`, `datos_curiosos`, `noticiero`, `en_deep_narrator` |
| Voz plana de sintetizador / «voz de TikTok» clásica | Voz de sistema (humor) | `sistema_robot`, `megafonia` |
| Narrador de historias/relatos sobre fondo de juego (storytime) | Narrador de historias | `historias_foro`, `en_story_reddit` |
| Voz grave seria / tráiler | Tráiler épico | `trailer_epico`, `en_trailer` |
| Deadpan irónico de meme | Dev harto, mujer deadpan | `dev_harto`, `deadpan_ella`, `es_H_deadpan` |
| ASMR / susurro | Susurro ASMR | `asmr`, `en_asmr` |
| Narrador deportivo / hype | Narrador deportivo | `locutor_deportes`, `en_sports` |
| Parodia de teletienda | Locutor de teletienda | `teletienda`, `en_teleshop` |

## Lo que NO hacemos

- **Voces de celebridades, políticos, actores o personajes con voz de actor** (la «voz de Peter Griffin», Trump/Obama, Tony Stark/RDJ…), muy vistas en vídeos virales: son clonaciones de terceros, chocan con derechos de voz/imagen y con las políticas de las plataformas, y dan a entender un respaldo que no existe. Se sustituyen por arquetipos propios (ver [../03_VOCES_Y_LOCUCION.md](../03_VOCES_Y_LOCUCION.md)).
- **Clonar voces descargadas de internet** (audiolibros, bancos de voces de voluntarios, vídeos de creadores): aunque el archivo sea de dominio público o CC0, la voz es de una persona. El estudio exige marcar «autorizado» al importar una referencia: solo con permiso de esa persona.

## Fuentes externas de voz (si algún día hace falta algo que no cubra el estudio)

| Opción | Qué ofrece | Condiciones (verificar en la web oficial antes de decidir) |
| --- | --- | --- |
| **Local Voice Studio (Qwen3-TTS)** — lo que usamos | Voces diseñadas a medida, clonación de voz propia, ES/EN + 8 idiomas más, local, gratis | Calidad variable según la toma; sin sincronía labial |
| ElevenLabs | Mucha variedad y expresividad, biblioteca de voces | Según blogs de precios: el plan gratuito no incluye licencia comercial; la comercial empieza en planes de pago (~5–6 $/mes, las fuentes discrepan). La cuenta del usuario es gratuita (ver la nota del vídeo promo). No usar para publicar sin plan de pago. ([BigVu](https://bigvu.tv/blog/elevenlabs-pricing-2026-plans-credits-commercial-rights-api-costs/), [Smallest.ai](https://smallest.ai/blog/elevenlabs-pricing-explained-plans-limits-hidden-costs-calculator)) |
| Voces de TikTok / CapCut / Reels integradas | Sin coste dentro de la propia app | Solo dentro de la plataforma; no controlas el archivo ni sirven para otras plataformas |
| Qwen3-TTS **CustomVoice** (mejora posible del estudio) | 9 voces premium con control de emoción por instrucción en cada frase | No instalado. Ver [04_EXPRESIVIDAD_Y_PERSONALIZACION.md](04_EXPRESIVIDAD_Y_PERSONALIZACION.md) |

## Cómo probar qué voz retiene más (A/B real)

1. Publica **el mismo guion** en dos tomas con voces o emociones distintas (un cambio cada vez) en horarios comparables.
2. Compara en cada plataforma el porcentaje que ve más allá del segundo 3 y la retención media; con 10 o 20 vídeos por variante ya se ve una tendencia, con uno no.
3. Anota el resultado en la ficha del vídeo (qué voz, qué semilla, qué emoción) y, si es reutilizable, súbelo a esta carpeta.
