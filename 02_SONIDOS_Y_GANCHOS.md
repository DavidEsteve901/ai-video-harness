---
title: Sonidos y ganchos — la receta dopamínica
status: active
created: 2026-10-20
tags: [project/workspace-launcher, marketing, video, audio, hooks]
---

# Sonidos y ganchos

El gancho **no es solo la imagen**: en un Short, el sonido decide si el pulgar se queda. Todo vídeo necesita **gancho visual + gancho de sonido** en el primer segundo y un golpe de sonido en cada cambio.

## Receta en una pantalla

| Tiempo | Qué debe pasar |
| --- | --- |
| 0–1,5 s | **Gancho**: imagen que obliga a mirar (cara a pantalla completa, caos, alarma) **con** sonido fuerte desde el fotograma 1. Texto ya en pantalla. |
| 1,5–4 s | **Giro**: corte con flash + golpe de sonido. Plantea la situación (humor/problema). |
| 4–8 s | **Señalar**: guiar el ojo (círculo, flecha, zoom, texto grande) hacia lo que importa. |
| 8–13 s | **Demo real** de la app, acelerada donde no pasa nada, con un sonido por cada hito visible (clic, ventana que encaja, palmada). |
| Final | **Pago**: sello/«listo» + sonido de cierre; frase corta + logo. Preparar el **bucle** (el final enlaza con el principio). |

Reglas de ritmo: algo cambia **cada 1–2,5 s** (imagen, texto, zoom o sonido); un texto nuevo por golpe; nunca más de una idea por pantalla; sacudida (shake) + flash en cada corte importante; el silencio breve (≈0,9 s) **antes** de un drop es un recurso, no un error (usado en VR001).

## Ganchos visuales (catálogo)

| Gancho | Ejemplo | Usado en |
| --- | --- | --- |
| Cara en pantalla completa gritando/flipando | Tony gritando con texto «TÚ ABRIENDO LAS APPS A MANO» | VR003 |
| Alarma + viñeta roja | «ALERTA: escritorio vacío» | VR003 |
| Meme con hueco a completar | «Jarvis,» + imagen pensativa | VR003 |
| Círculo + flecha sobre «ese tío» | Señalar al que lo hace bien | VR003 |
| Pantalla dividida (caos vs orden) | Junior/Noob vs Senior/Pro | VR001, VR004 |
| Cuenta atrás / lanzamiento de cohete | Juego de palabras «Launcher» | por hacer |
| Contador de tiempo/clics que vuela | «37 s → 2,8 s» | VR001 |
| POV | «Cuando abres el portátil y ya está todo» | por hacer |

## Ganchos de sonido (catálogo)

| Sonido | Para qué | Estado |
| --- | --- | --- |
| Grito / voz del propio meme | Abrir con el audio original del clip | ✅ VR003 |
| Alarma | Tensión inmediata antes del giro | ✅ (`memes_de_terceros`) |
| Boom / impacto grave | Cada corte fuerte, aparición de ventanas | ✅ `sfx_boom` |
| Whoosh | Transiciones entre escenas | ✅ `sfx_whoosh` |
| Riser (sube de tono) | Tensión antes de que todo se abra | ✅ `sfx_riser` |
| Pop | Aparición de cada texto | ✅ `sfx_pop` |
| Golpe seco (hit) | Palmadas, etiquetas, «ESTE TÍO» | ✅ `sfx_hit` |
| Garabato de rotulador | Dibujar círculo/flecha | ✅ `sfx_scribble` |
| Campanilla (ding) | «Listo» | ✅ `sfx_ding` |
| Vine boom (32), bass drop (04), boo-womp (06), «bruh» (23), suspend (31), tubo metálico (20), pitidos (27), campana (37)… | Remates de meme | ✅ pack de 37 en `01_Proyectos/Recursos videos/Efectos sonido/` (WAV + índice) |
| Scratch de disco, bocina, «dun dun dun» | Remates de meme | ⬜ por conseguir |
| Error de Windows / ping de notificación | Chiste del caos de apps | ⬜ por conseguir |
| Teclado, clic de ratón, obturador | ASMR satisfactorio de la demo | ⬜ por conseguir |
| Cuenta atrás y despegue de cohete | Vídeo «Launcher = lanzamiento» | ⬜ por conseguir |
| Música phonk/slowed con drop | Ritmo de todo el vídeo (ver [Musica_y_Audio](../../00_Centro_de_Ideas/04_Biblioteca_Creativa/Musica_y_Audio.md)) | ✅ lista de canciones |

## Biblioteca de efectos propios

Carpeta: [Biblioteca_Sonidos/](Biblioteca_Sonidos/) → `sfx_propios/` (sintetizados por nosotros, **sin derechos**, reutilizables en cualquier vídeo) y `memes_de_terceros/` (sonidos de meme descargados; origen externo).

Se generan con ffmpeg (`aevalsrc`) en el `preparar_assets.mjs` de cada proyecto. Recetas (48 kHz):

| Archivo | Expresión `aevalsrc` | Dur. |
| --- | --- | --- |
| `sfx_boom` | `0.95*sin(2*PI*(46+130*exp(-14*t))*t)*exp(-3.2*t)+0.3*(random(0)-0.5)*exp(-40*t)` | 1,0 s |
| `sfx_hit` | `0.9*sin(2*PI*(90+300*exp(-30*t))*t)*exp(-9*t)+0.35*(random(0)-0.5)*exp(-70*t)` | 0,35 s |
| `sfx_pop` | `0.7*sin(2*PI*(900-4500*t)*t)*exp(-38*t)` | 0,12 s |
| `sfx_ding` | `0.5*(sin(2*PI*1318*t)+0.6*sin(2*PI*1760*t))*exp(-4.5*t)` | 0,9 s |
| `sfx_whoosh` | `(random(0)-0.5)*1.6*pow(sin(PI*t/0.45),2)*(0.4+0.6*t/0.45)` | 0,45 s |
| `sfx_riser` | `0.55*sin(2*PI*(200*t+1000*t*t))*pow(t/1.1,1.6)+0.25*(random(0)-0.5)*pow(t/1.1,2)` | 1,1 s |
| `sfx_scribble` | ruido × `(0.55+0.45*sin(2*PI*31*t))`, filtro `highpass=f=2200` | 0,4 s |

## Mezcla

- Voz ≈ −15 LUFS (`loudnorm=I=-15:TP=-1.5:LRA=7`); efectos por debajo de la voz; alarma/música de fondo ≈ 25–30 %.
- **Pico real ≤ −1 dBTP**: tras renderizar pasa `alimiter` (el grito original de un meme suele ir a 0 dB y se suma con los efectos).
- No dejes **huecos mudos** largos entre hitos de la demo: rellénalos con micro-sonidos (pops por ventana que encaja).
- Con voz y **sin voz**: el texto en pantalla debe funcionar solo; saca las dos versiones (la de sin voz sirve para música en tendencia de la plataforma).

## Dónde conseguir sonidos nuevos

Apunta cada uno en [04_INVENTARIO_RECURSOS.md](04_INVENTARIO_RECURSOS.md) con **origen y licencia**.

- Propios: se sintetizan con la receta de arriba o se graban (clics y teclado del propio equipo, palmadas reales).
- Bancos con licencia clara: Freesound (filtrar CC0), Pixabay, biblioteca de audio de YouTube Studio.
- Audios de meme (vine boom, bruh…): copia local con origen anotado; úsalos cortos. No garantizan inmunidad a reclamaciones.
- Música: lista en [Musica_y_Audio](../../00_Centro_de_Ideas/04_Biblioteca_Creativa/Musica_y_Audio.md); para publicar en TikTok/Reels/Shorts lo más seguro es el audio dentro de la propia plataforma.

## Lecciones por vídeo

| Vídeo | Qué funcionó / qué aprender |
| --- | --- |
| VR001 | Silencio previo al drop + clic dentro del silencio da mucho impacto; el borde que late con el ritmo. |
| VR003 | El clip del grito trae barras negras: recortar al contenido real y ampliar. La voz hace de remate irónico; el texto + círculo/flecha funcionan sin ella. Medir voz y encajar escenas a su duración (no al revés). |
| VR003 V2 | Mejor gancho: reacción primero (grito) y la causa después. Tras el grito, corte seco y ~0,3 s de silencio antes de la voz. Voz en tomas sueltas (pausas dramáticas controladas) y texto que se escribe con ticks. En la demo, sin voz: que hablen las palmadas reales. Mezcla final −13/−14 LUFS (VR003 V1 salió a −7: demasiado fuerte). TTS: «palmadas» se lee «palmaras» → «con **solo** dos palmadas»; «Jarvis» → «Yárvis». |
| VR003 V2 (retoques) | Riser + boom + pops agudos en la apertura de ventanas **molestaban** al usuario: mejor un sonido suave y corto POR CADA ventana que aparece de verdad (detectar los instantes con `ffmpeg select=scene` sobre la grabación) y barridos bajitos en los movimientos de cámara. No usar la misma foto más de ~2 s: cambiar de imagen con cada frase y dar cámara a la demo. TTS: para más entonación, diseñar una voz nueva con VoiceDesign describiendo el estado de ánimo (la referencia manda); el nombre «Jarvis» va pegado a la frase siguiente. |
| VR009 | `locutor.py decir --plan` pide `--motor qwen-base-1.7b` (CosyVoice no instalado → HTTP 400) y solo acepta emociones neutral, alegria, tristeza, enfado, asombro, calma, susurro, serio, urgencia, sarcasmo (deadpan/orgulloso no existen: usar serio/calma). Mezcla: `volume=2.5dB,alimiter=limit=0.72:level=false` tras el render da −14 LUFS y pico −2,4 dB (limit 0,8 daba pico 0 dB tras AAC). Pops suaves por ventana: instantes con `ffmpeg select=scene>0.06` sobre la demo. |
