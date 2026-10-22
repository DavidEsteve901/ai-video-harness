---
title: "VR018 — «¿Por qué al cruzar una puerta se te olvida a qué ibas?» (efecto puerta → trabajar en el ordenador)"
id: VR018
status: edicion
created: 2026-10-22
tags: [project/workspace-launcher, marketing, video, video-corto, concepto, gancho, stock]
formato: "Concepto científico + metáfora animada (clips de stock + motion + karaoke de FMT-004, sin logo)"
---

# VR018 — El efecto puerta

> [!info] Estado (2026-10-22)
> **V2 producida** (solo vertical, 22,87 s) tras la revisión del usuario. Pendiente de verla y escucharla. No publicada.

## Revisión del usuario sobre la V1 (2026-10-22)

Le gustó mucho el concepto y **el gancho (frases 1 y 2) le encanta**. Pidió cambiar lo que viene después: quitar la grabación de su escritorio, no decir «Alt+Tab» (demasiado nicho, un atajo) y trasladar el concepto de forma más general al trabajo en el ordenador y a lo que hace la app; podía alargarse un poco. La V1 se conserva en `05_Exportaciones/VR018_V1_*` y su código en `04_Edicion/Remotion_VR018/VR018_V1_referencia.tsx.txt`.

## La idea (V2)

Gancho universal con respaldo científico: **a todos se nos olvida a qué íbamos al cruzar una puerta** (efecto puerta: el cerebro trata la puerta como el final de una escena y la archiva). Traslado general: **en el ordenador, cada ventana que cambias es una puerta** (correo, pestañas, carpetas) y por el camino pierdes el hilo. Giro: **¿y si cada tarea tuviera su propia habitación?** (= un workspace por tarea) → entras y ya está todo abierto y en su sitio → vuelve la cara del gancho: «Y ya no se te olvida a qué venías» (bucle con el inicio). Sin logo, nombre, eslogan, precio, URL ni grabación de la app.

## Guion V2 (22,87 s · 60 fps · 1080×1920)

| Tiempo | Voz (Gemini `es-es-training-9`, ×1,15) | Imagen | Sonido |
|---|---|---|---|
| 0,0–3,1 | ¿Por qué al cruzar una puerta **se te olvida** a qué ibas? | Chico que cruza una puerta a contraluz y se queda con la mirada en blanco (Pexels, rampa de velocidad); «?» coral | Bisagra, whoosh y golpe al cruzar; tic-tac; scratch al congelar |
| 3,1–6,6 | Se llama **efecto puerta**: tu cerebro cierra la escena y **la archiva**. | Cara congelada que se oscurece; sello «EFECTO PUERTA» + cita; claqueta «ESCENA 1 · EL PASILLO — Iba a por… ?» que cae a un cajón «ARCHIVADO» | Sello, claqueta, cajón |
| 6,6–9,8 | En el ordenador pasa igual: **cada ventana** que cambias es **una puerta**. | Teclado RGB real (Pexels) de fondo; monitor con cuatro ventanas; la selección salta y la tercera se abre como una puerta | Clics, whooshes, bisagra; entra el ritmo |
| 9,8–13,2 | Correo, pestañas, carpetas… y por el camino, **pierdes el hilo**. | Tarjeta «💡 Ibas a: responder a Marta»; un hilo ámbar cruza tres puertas (Correo, Pestañas, Carpetas) y en cada una se borra una palabra; el hilo se rompe y cae (coral) → «¿…?» | Pops y bisagras por puerta; aceleración y corte seco con glitch en «pierdes» |
| 13,2–16,7 | ¿Y si cada tarea tuviera **su propia habitación**? | Plano de una casa: cuatro habitaciones (Informe, Estudio, Diseño, Ocio) con sus ventanas dentro; se iluminan en ámbar e «Informe» pasa a verde | Silencio → brillo que crece → floración |
| 16,7–19,6 | Entras, y ya está **todo abierto** y **en su sitio**. | La cámara entra por la puerta de «Informe»: dos pantallas y cada cosa vuela a su zona (Documento, Web, Correo, Carpeta, Notas); borde verde y ✓ | Drop cálido, pops por ventana |
| 19,6–22,9 | Y **ya no se te olvida** a qué venías. | Vuelve la cara del gancho, iluminada; la claqueta regresa: «ESCENA 2 · EL INFORME — Iba a por… el informe ✓» | Claqueta, ding, acorde final |

## Verificación

- **Ciencia:** Radvansky, Krawietz y Tamplin (2011), *Quarterly Journal of Experimental Psychology*, Universidad de Notre Dame: cruzar una puerta hace olvidar más que recorrer la misma distancia en una sala; pasó en un entorno virtual (en pantalla) y en uno real; la explicación propuesta es que la puerta es un **límite de evento** que archiva el episodio anterior. Fuentes consultadas el 2026-10-22: [nota de la universidad](https://provost.nd.edu/news/walking-through-doorways-causes-forgetting-new-research-shows) y [BPS Research Digest](https://www.bps.org.uk/research-digest/how-walking-through-doorway-increases-forgetting). No se leyó el artículo original.
- **«Cada ventana que cambias es una puerta» es una metáfora**, no un resultado del estudio (no mide cambios de ventana). Si alguien lo discute: dar la razón con matiz (ver textos).
- **App (concepto, sin enseñarla):** «una habitación por tarea» = un workspace por tarea; «entras y ya está todo abierto y en su sitio» = al lanzar un workspace se abren sus apps, webs y carpetas, cada una en su pantalla y zona (función principal, ver VR012/VR017). Ventanas y nombres de habitaciones son ilustrativos.

## Producción

- Copia de trabajo: `C:\Herramientas\_work\VR018` (derivada de VR015; `node_modules` = junction a `Videos Workspace launcher\video-editor\node_modules`, Remotion 4.0.448). Fuentes sin dependencias en `04_Edicion/Remotion_VR018/`. Composición `VR018-Vertical` en `src/VR018.tsx`; karaoke y claves en `src/components/Captions.tsx`; efectos en `src/sonido.ts`.
- **Voz:** `03_Recursos/voz/gemini/` (`plan_vocal.json` = V2; `plan_vocal_V1.json`; `generar.log`, `generar_V2.log`): 2 tomas válidas por frase verificadas con Whisper large-v3 (V1: 11 peticiones; V2: 10 más, `gemini-3.8-flash-tts`). Elegidas en `edit.config.json`: t01 A, t02 A, t03 A, t04 B, t05 A, t06 A, t07 A, aceleradas ×1,15 (`tomas_x115/`). Las tomas de la V1 que ya no se usan están en `tomas/descartadas_V1/`.
- **Clips:** `public/video/puerta.mp4` (rampa 1,65× → 4× → 1,45×) y `teclado.mp4` (×1,5); fotograma congelado `public/img/cara.png`. Ya no se usa la demo de las palmadas. Procedencia en [03_Recursos/SELECCION_VISUAL.md](03_Recursos/SELECCION_VISUAL.md).
- **Música y efectos propios** (`scripts/sintetizar_audio.py`): misterio en La menor → silencio en el congelado → pulso → ritmo 120 BPM desde «ordenador» → aceleración en «por el camino» y corte en «pierdes» → brillo del giro → floración en «habitación» → drop en «Entras» → acorde final en «venías». Efectos sintetizados: portazo, bisagra, claqueta, sello, cajón y tecla; scratch del pack manuDT.
- **Mezcla (medida, no escuchada):** voz 13,5 dB sobre el fondo (mediana); máster −14,0 LUFS, pico −3,2 dBFS.

## Exportaciones (`05_Exportaciones/`)

- **V2:** `VR018_V2_1080x1920_60fps.mp4` (máster) · `VR018_V2_1080x1920_60fps_publicar.mp4` (para subir) · `VR018_V2_revision_fotogramas.png`.
- V1 (final descartado): `VR018_V1_*`.

## Variantes posibles

- Apertura alternativa en texto: «Tu cerebro borra cosas cada vez que cruzas una puerta».
- Versión inglesa («The doorway effect»), con voz `en-us-training-6`.
- Cierre con persona real: se probó `pexels 4115291` (chico sonriendo al portátil, cottonbro); descartado porque saluda o habla a cámara casi todo el clip.
- Serie «conceptos de psicología × tu PC»: efecto Zeigarnik (tareas abiertas = pestañas abiertas), coste del cambio de tarea.

## Publicación

Textos en [06_Publicacion/TEXTOS_PUBLICACION.md](06_Publicacion/TEXTOS_PUBLICACION.md).

| Plataforma | Título / texto | Fecha | URL publicada |
| --- | --- | --- | --- |
| Por decidir | | | |
