---
name: video-recursos-conectados
description: Localizar y usar los recursos propios del usuario (vídeo, imagen, audio, brutos, fuentes) que viven fuera del repositorio, en carpetas conectadas por configuración local con catálogos de descripciones. Usar siempre antes de buscar material en internet o cuando el encargo diga "usa mis recursos", "busca en mi biblioteca" o necesite SFX, música, B-roll, GIFs o brutos.
---

# Recursos conectados

Los recursos pesados no están en el repo. Cada equipo declara dónde están en `conexion_recursos/recursos.config.local.json` y cada biblioteca tiene un `catalogo.json` con qué es cada archivo. Detalle completo en [conexion_recursos/00_LEEME.md](../../../conexion_recursos/00_LEEME.md).

## Procedimiento

1. Si no existe `conexion_recursos/recursos.config.local.json`, no inventes rutas: ejecuta `python herramientas/recursos.py init` y pide al usuario dónde están sus bibliotecas en este equipo.
2. `python herramientas/recursos.py list` y `check`: usa solo bibliotecas marcadas OK. Si una no está montada (disco/Drive desconectado), dilo y sigue sin ella; no la sustituyas en silencio.
3. Busca por necesidad: `python herramientas/recursos.py search "<palabras>" [--tipo video|audio|imagen] [--id <biblioteca>]`. Para decisiones finas lee el `catalogo.json` de la biblioteca (o el índice por categorías si lo tiene, p. ej. `INDICES_IA/00_LEEME.md`).
4. Elige por escena, tono, duración y **licencia**. Los recursos con derechos de terceros (memes, canciones, clips de películas) solo en piezas cortas y con aviso al usuario de posible reclamación. Ante un recurso sin descripción, míralo/escúchalo antes de usarlo.
5. **Copia** el elegido a `01_Proyectos/<VR###>/03_Recursos/` (ruta absoluta con `recursos.py resolve <id> <ruta_relativa>`). Nunca edites ni muevas archivos dentro de la biblioteca.
6. Registra en la ficha del vídeo: id del recurso, ruta relativa, biblioteca y licencia/procedencia.
7. Si el usuario incorpora material nuevo: `scan <id>` y después describe los pendientes (`pending <id>`) editando `descripcion`, `etiquetas`, `licencia` y `notas` del catálogo. `scan` conserva lo ya escrito.

## Reglas

- La ruta `ruta` del catálogo es relativa a la raíz de la biblioteca; la raíz sale de la configuración local, nunca de un valor escrito en docs.
- No subas a git nada que cuelgue de las rutas de recursos ni `recursos.config.local.json`.
- Si el recurso ideal no existe en las bibliotecas, entonces —y solo entonces— usa [video-recursos-visuales](../video-recursos-visuales/SKILL.md) para buscarlo en internet y, si se incorpora, añádelo a la biblioteca con su descripción y licencia.
