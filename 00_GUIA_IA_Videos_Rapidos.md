---
title: Guía para IA — Cómo se hacen los vídeos rápidos
status: active
created: 2026-10-20
tags: [project/workspace-launcher, marketing, video, ia, guia]
---

# Guía para IA — Vídeos rápidos (Shorts / TikTok / Reels)

**Léela entera antes de tocar nada.** Resume cómo trabaja este proyecto, qué herramientas hay y qué reglas no se rompen. Se escala: cada vídeo nuevo añade ideas, recursos y aprendizajes aquí o en los documentos enlazados.

## Mapa de documentos

| Necesito… | Documento |
| --- | --- |
| Entender el flujo de carpetas y crear un vídeo | [00_LEEME.md](00_LEEME.md) |
| **Esta guía** (método, herramientas, reglas) | `00_GUIA_IA_Videos_Rapidos.md` |
| Planificar formatos, conceptos, ganchos, guion y recursos antes de producir | [Planificación y retención](08_PLANIFICACION_GANCHOS_Y_RETENCION.md), con skills de la comunidad y perfil editable |
| Ver, capturar o desarrollar **ideas** de vídeo | [Catálogo de ideas](00_Ideas/00_INDICE.md) y [captura rápida](00_Ideas/01_CAPTURA_RAPIDA.md) |
| Referencias guardadas y conceptos TikTok importados | [Referencias](00_Ideas/02_REFERENCIAS.md) y [mapa de conceptos anteriores](00_Ideas/Archivo_Importacion/00_MAPA_IMPORTACION.md) |
| Buscar por internet fotos, GIFs o clips que encajen en una escena | [Búsqueda y selección visual](09_BUSQUEDA_RECURSOS_VISUALES.md) · skill `video-recursos-visuales` |
| Imágenes, GIFs, clips y packs de sonido compartidos | [Biblioteca de recursos](01_Proyectos/Recursos%20videos/README_RECURSOS.md) |
| **Sonidos, ganchos y ritmo** (la receta dopamínica) | [02_SONIDOS_Y_GANCHOS.md](02_SONIDOS_Y_GANCHOS.md) |
| **Voces** y locución local (decisión sobre clonar, receta de VR003) | [03_VOCES_Y_LOCUCION.md](03_VOCES_Y_LOCUCION.md) |
| **Biblioteca de Voces** y generación local | [Catálogo](Biblioteca_Voces/INDICE_VOCES.md) · [skill voces-locucion](.agents/skills/voces-locucion/SKILL.md) · [escuchar voces](Biblioteca_Voces/Escuchar_Voces.html) |
| Mantener la misma voz con emociones y tonos según la escena | [Dirección vocal contextual](Biblioteca_Voces/04_EXPRESIVIDAD_Y_PERSONALIZACION.md): identidad fija por personaje, emoción e intención por frase y plan vocal guardado en el proyecto |
| Qué **recursos** ya existen (memes, clips, música, grabaciones) | [04_INVENTARIO_RECURSOS.md](04_INVENTARIO_RECURSOS.md) |
| Ocurrencias de vídeos desde el móvil | [Captura rápida de vídeos](00_Ideas/01_CAPTURA_RAPIDA.md); el Centro de Ideas sigue disponible para notas generales |
| Música en tendencia (phonk/slowed) | `../../00_Centro_de_Ideas/04_Biblioteca_Creativa/Musica_y_Audio.md` |

## Objetivo y estilo

La receta siguiente describe la serie rápida de memes y demostración. Para YouTube largo, tutoriales, animación u otra intención, adapta el formato al encargo usando la [biblioteca de planificación](08_PLANIFICACION_GANCHOS_Y_RETENCION.md) y el [perfil editorial](Biblioteca_Planificacion/PERFIL_EDITORIAL.md); no traslades automáticamente esos tiempos o intensidad de efectos.

Vídeos verticales 9:16 (1080×1920, 60 fps, 10–20 s) que **capten en el primer segundo** y mantengan un cambio (imagen, texto o sonido) cada 1–2,5 s. Humor de meme + **demostración real** de Workspace Launcher. El producto se enseña funcionando; el humor es la excusa.

La receta completa (gancho visual + gancho de sonido, ritmo, bucle final) está en [02_SONIDOS_Y_GANCHOS.md](02_SONIDOS_Y_GANCHOS.md).

## Flujo de trabajo (de la idea al vídeo)

1. **Idea** → nota libre en [captura rápida](00_Ideas/01_CAPTURA_RAPIDA.md) o ficha en el [catálogo](00_Ideas/00_INDICE.md). Una frase basta para capturar; al elegir producir, concreta apertura, desarrollo, intención y recursos. El sonido y la demo se deciden según la pieza.
2. **Carpeta, cuando se elija producir:** `01_Proyectos/VR00X_Nombre/` copiando `00_Plantilla_Video` (ver [00_LEEME.md](00_LEEME.md)). Rellena su `00_FICHA_VIDEO.md`.
3. **Recursos**: lo propio en `02_Brutos/`, lo de terceros (memes, clips, sonidos) en `03_Recursos/`. Apunta procedencia en la ficha. Además del material aportado y la biblioteca, la IA puede [buscar recursos visuales en internet](09_BUSQUEDA_RECURSOS_VISUALES.md), revisar su encaje y preparar los seleccionados; respetar «solo mis archivos» cuando se indique.
4. **Voz** si hace falta → carga [voces-locucion](.agents/skills/voces-locucion/SKILL.md) y consulta [la guía de locución](03_VOCES_Y_LOCUCION.md). Fija una voz y referencia por personaje; adapta emoción, intención, intensidad y ritmo a cada frase y escena sin cambiar esa identidad. Guarda el plan vocal y las tomas en `03_Recursos/voz/` del vídeo; revisa la interpretación y la continuidad antes de montarlas.
5. **Montaje** con **Remotion** (preferido: tiempos exactos, textos y sonido sincronizados) o ffmpeg para cosas triviales. Ejemplos funcionando: `VR003` (montaje completo con voz) y `VR004` (pantalla dividida sencilla).
6. **Exportación** a `05_Exportaciones/` y textos de publicación en `06_Publicacion/`.
7. **Registro**: actualiza el estado en la ficha, la tabla de [00_LEEME.md](00_LEEME.md) y la ficha de idea relacionada (qué se hizo e ideas derivadas; los resultados requieren evidencia).

## Herramientas y cómo usarlas (lo que ya funciona)

### Remotion (montaje)
- Cada vídeo lleva su proyecto en `04_Edicion/Remotion_VR00X/` con `edit.config.json` (tiempos), `src/VR00X.tsx` (montaje), `scripts/preparar_assets.mjs` (copia/prepara recursos y **sintetiza los efectos de sonido sin derechos**).
- **`node_modules` NO puede vivir en Drive** (npm falla escribiendo en G: y sincronizaría miles de archivos). Método usado: **copia de trabajo local** `C:\Herramientas\_work\VR00X` con un *junction* a `C:\Herramientas\Videos Workspace launcher\video-editor\node_modules` (Remotion 4.0.448).
  ```powershell
  $w='C:\Herramientas\_work\VR00X'; robocopy "<04_Edicion\Remotion_VR00X>" $w /MIR /XD node_modules out public
  New-Item -ItemType Junction -Path "$w\node_modules" -Target 'C:\Herramientas\Videos Workspace launcher\video-editor\node_modules'
  cd $w; node scripts/preparar_assets.mjs --proyecto "<carpeta del vídeo VR00X>"
  npx remotion still src/index.ts <Composicion> out/f.png --frame=120 --scale=0.35   # revisar fotogramas
  npx remotion render src/index.ts <Composicion> out/VR00X.mp4 --crf=16 --pixel-format=yuv420p
  ```
  El código fuente se edita en Drive y se vuelve a sincronizar con `robocopy` (excluir `public` para no machacar los assets ya preparados salvo que cambien).
- Escribe `package.json` y demás **sin BOM** (Windows PowerShell `Set-Content -Encoding utf8` añade BOM y rompe webpack).
- Revisa siempre fotogramas clave con `remotion still` y mide el audio (`ffmpeg … ebur128`, `silencedetect`). Limita el pico (`alimiter`) tras renderizar.
- Fuentes: Anton (títulos meme) e Inter ExtraBold (licencias OFL), en `public/fonts`.

### Local Voice Studio (voces locales)
Ver [03_VOCES_Y_LOCUCION.md](03_VOCES_Y_LOCUCION.md). Local, gratis, sin claves: `C:\Herramientas\local-voice-studio` (API `http://127.0.0.1:7860`).

### ffmpeg
En el PATH. Para recortes, acelerar, medir audio, contact sheets de revisión. `drawtext` falla sin fuentes del sistema (Fontconfig): para texto con emoji o tipografías usa Remotion.

## Reglas que no se rompen

1. **No fabricar funciones de la app.** Lo que se muestra es la grabación real. Si una función aún no está publicada, no se enseña como disponible.
2. **El vídeo es contenido, no un anuncio** (criterio del usuario, VR003 V2): el gancho y el remate son el chiste o la sorpresa; no se acaba con logo, nombre de la app ni eslogan, y no se fuerza la venta. Si a alguien le interesa, pregunta en comentarios y se le responde. Nunca URL ni precio en el vídeo. Evitar frases-eslogan que riman («ni un clic, ni un drama»): suenan a anuncio.
3. **No clonar la voz de personas reales** (actores, famosos, personajes con voz de actor). Ni con Local Voice Studio ni con servicios externos. Detalle y alternativas en [03_VOCES_Y_LOCUCION.md](03_VOCES_Y_LOCUCION.md).
4. **Material de terceros** (clips de películas, memes, canciones) se usa como recurso de meme corto y se apunta su origen; no se garantiza que plataformas como YouTube no lo marquen. Preferir sonidos sintetizados propios para los efectos y mantener fuera lo que no haga falta.
5. **No publicar sin aprobación del usuario** y no rellenar URL/fecha de publicación hasta que exista. Ocultar datos personales en grabaciones (perfil `tester`/`dev` de la app).
6. **Conserva los brutos originales**; trabaja sobre copias. Un vídeo = una carpeta.
7. El usuario puede dictar mucho y con erratas desde el móvil: **interpretar la intención**, resumirla en la ficha y, si algo es ambiguo (qué clip, qué texto), decidirlo, dejarlo editable y decirlo en el resumen.

## Cómo aprender de cada vídeo

Al cerrar un vídeo escribe en su ficha: qué funcionó, qué cambiarías y una idea derivada. Si es una lección reutilizable (un truco técnico, una receta de sonido, una regla de ritmo), súbela a esta guía o a [02_SONIDOS_Y_GANCHOS.md](02_SONIDOS_Y_GANCHOS.md).

## Vídeos hechos con este método

| ID | Qué es | Notas |
| --- | --- | --- |
| VR001 | Junior vs Senior / Noob vs Pro | Kdenlive → Remotion V3 con drop sincronizado a la canción |
| VR002 | Tony + JARVIS + palmadas (en el monitor gigante) | Chroma key, HUD, alarma |
| VR003 | Grito de Tony → «Jarvis,» → «Ese tío» (círculo y flecha) → palmadas aceleradas → cierre; con voz y sin voz | Primer vídeo con voz sintética propia |
| VR003 V2 | «Tony se entera»: grito → plantilla «Jarvis,» que se escribe con la voz → demo real → «Jarvis, tenemos que hablar» | **Sin logo ni eslogan**: el vídeo es un chiste, no un anuncio |
| VR004 | Pantalla dividida: Tony gritando + palmadas, con texto «Jarvis…» | Sin efectos añadidos |
| VR010 | «Cierro todo y vuelve con un clic»: recorte vertical del tutorial largo ES (cerrar y relanzar el workspace) | Primer **recorte de tutorial**: cámara animada (recorte + zoom) sobre la pantalla 16:9, rótulos, efectos propios, sin voz; ver ficha para otros 4 tramos posibles |
| VR009 | «Mi PC y yo trabajando en un proyecto» (molde de TikTok de @midudev): demo real del asistente, voz `dev_harto` con plan vocal, pops suaves por ventana | Primer vídeo con `plan_vocal.json` + `locutor.py` y revisión Whisper; sin logo ni eslogan |

## Estilos y herramientas adicionales (2026-10-21)

[La guía de estilos IA](10_ESTILOS_Y_HERRAMIENTAS_IA.md) integra la investigación de El Telar con seis skills locales y referencias verificadas: cámara continua, collage de papel, motion/HyperFrames, personajes pintados y cine programado. Empieza por [video-estilos-creativos](.agents/skills/video-estilos-creativos/SKILL.md) solo cuando el encargo necesite esa mejora. [Ejemplos para VR009 y VR010](Biblioteca_Estilos_IA/06_APLICACION_VR009_VR010.md). Para Claude, la entrada es [CLAUDE.md](CLAUDE.md). Se han preparado instrucciones; no se han cambiado los motores ni las exportaciones existentes.


## Coordinación y formatos reutilizables (decisión del usuario, 21-10-2026)

Para nuevas ideas, guiones y coordinación, usa [video-orquestacion](.agents/skills/video-orquestacion/SKILL.md) y [el flujo de trabajo](11_FLUJO_IDEA_GUION_Y_PRODUCCION.md). Codex prepara guion/plan y Claude produce; una petición documental no autoriza medios ni renders. El encargo expreso posterior puede ampliar el alcance. Reutiliza [formatos documentados](Biblioteca_Formatos/00_INDICE.md) y registra los que el usuario quiera repetir con origen, herramientas y decisiones; no deduzcas aprobación por que exista una exportación.
