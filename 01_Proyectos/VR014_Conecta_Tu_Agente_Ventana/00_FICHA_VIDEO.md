---
title: "VR014 — «Tu agente de IA vive encerrado en una ventana» (conecta tu agente)"
id: VR014
status: edicion
created: 2026-10-22
tags: [project/workspace-launcher, marketing, video, presentacion, agentes, mcp, omnibar, motion-graphics]
formato: FMT-004
ideas: [IDEA-041, IDEA-042]
---

# VR014 — Conecta tu agente

> [!info] Estado (2026-10-22)
> **V1 producida** en vertical y horizontal con el formato aprobado [FMT-004](../../Biblioteca_Formatos/FMT-004_Presentacion_Concepto_Motion_Karaoke.md). Pendiente de que el usuario la vea y la escuche. No publicada. Sustituye en concepto a [VR011](../VR011_Conecta_Tu_Agente/00_FICHA_VIDEO.md) (estilo cuaderno, descartado por el usuario); VR011 no se ha tocado.

**Guía, ganchos y guion:** [00_GUIA_Y_GUION.md](00_GUIA_Y_GUION.md) · **Textos para publicar:** [06_Publicacion/TEXTOS_PUBLICACION.md](06_Publicacion/TEXTOS_PUBLICACION.md)

## Ficha breve

- Concepto: el agente de IA conoce tu proyecto pero vive encerrado en su ventana; el escritorio lo montas tú y las funciones de tu proyecto quedan enterradas en una terminal. Conectado una vez a la app, el agente **controla la app**: entiende en qué trabajas y te monta el entorno (espacios, ventanas, atajos, ajustes) y **lleva funciones de tu proyecto al Omnibar**, que lanzas con tu atajo desde cualquier app. Él propone; tú revisas y decides. Cierre en bucle: «vive encerrado en una ventana» → «ya no vive en una ventana. Ahora prepara tu forma de trabajar».
- Une IDEA-041 e IDEA-042 en una sola promesa (petición expresa del usuario).
- **61,3 s** · 60 fps · vertical 1080×1920 y horizontal 1920×1080. Sin logo ni nombre de la app, sin eslogan, precio ni URL dentro del vídeo; sin cifras.

## Verificación de funciones (app 1.2.7, código local, solo lectura)

| Lo que dice el vídeo | Dónde se comprobó |
|---|---|
| Claude, Codex, Cursor, Antigravity, **Copilot**: «lo conectas una vez» | `frontend/src/components/ConfigPanel/McpAgentConnections.jsx` (lista: Codex, Claude Code, Claude Desktop, Antigravity, OpenCode, Gemini CLI, **GitHub Copilot**, Cursor, Windsurf) y `Core/MCP/McpClientInstaller.cs` (escribe `~/.copilot/mcp-config.json`; `McpClientLocator.cs` detecta la CLI `copilot` o VS Code `code`, que lee ese mismo archivo). Copilot **sí está soportado**: se muestra con los demás, sin «y otros». Panel en Configuración (`ConfigPanel.jsx`). Web: sección `agents` («Conecta Claude Code, Codex, Antigravity, OpenCode y más con un clic desde Ajustes») |
| Te monta el entorno: espacios, ventanas, atajos, ajustes | Herramientas del servidor MCP `workspace-launcher` (listadas en esta sesión, **no ejecutadas**): `create_workspace` + `commit_workspace_draft` (borrador y confirmación), `create_virtual_desktop`, `arrange_window`/`organize_windows`, `set_hotkey`, `set_app_setting` (los tres últimos ya comprobados en VR011). Web `agents`: «él crea los workspaces, ajusta la configuración…» |
| Entiende en qué trabajas | Contexto propio del agente (el repositorio) + `inspect_project_commands`, `get_personalization_context`, `get_workspace_reference`; las instrucciones del servidor piden combinar «tú conoces el proyecto, la app conoce al usuario» |
| Lleva sus funciones a tu Omnibar | `Core/MCP/Resources/custom_actions_guide.md` + herramientas `get_custom_action_guide`, `save_custom_action`, `get_custom_actions`, `run_custom_action`: conexiones command/process/open/url/http con atajo propio `/atajo`, entrada, sugerencias y formularios; el Omnibar la descubre sola. Web `gateway`: «Tus proyectos, a una orden de distancia… Tu agente de IA lo configura por ti» |
| Pulsas tu atajo… tu proyecto hace el trabajo. Desde cualquier app | Web `omnibar`: «Una barra que aparece con tu atajo encima de lo que estés haciendo»; la guía: la lógica es del proyecto, el resultado vuelve a la barra («Output protocol») |
| Él propone. Tú revisas y decides | Borradores con confirmación; `save_custom_action` no ejecuta y guarda la acción desactivada salvo autorización; la ejecución por agente es un permiso aparte (guía y web `gateway`: «un agente solo la ejecuta si tú lo permites») |

Ilustrativo, no nativo: `/informe`, `deploy`, `backup`, `informe listo`, «Ctrl + Alt + 1», `mi-proyecto` y su árbol (igual que los ejemplos de la web). La barra de órdenes y la tarjeta «Propuesta» son metáforas abstractas, no capturas.

**Antes de publicar:** confirmar que la versión publicada en la Store incluye la conexión de agentes y las acciones del Omnibar (el código es 1.2.7; la guía indica que «la disponibilidad de acciones y del transporte MCP mantiene los requisitos de plan de la app»: el vídeo no menciona planes ni precio).

## Logos de agentes (solo identifican herramientas; no implican colaboración)

En `03_Recursos/iconos/` (copia en `public/img/agentes/` del editable):

| Archivo | Procedencia |
|---|---|
| `claude.svg`, `cursor.svg` | simple-icons (datos CC0), copiados de `VR011/03_Recursos/iconos/` (comprobados allí). Claude en su color de marca `#D97757`; Cursor en blanco |
| `codex.png`, `antigravity.svg` | Recursos del repositorio del producto (`frontend/src/assets/agents/`), vía VR011 |
| `githubcopilot.svg` | **Nuevo.** simple-icons **16.33.0** (`node_modules/simple-icons/icons/githubcopilot.svg` del frontend de la app, el mismo paquete con el que la app dibuja el icono `siGithubcopilot`); fuente declarada por simple-icons: https://primer.style/foundations/icons/copilot-24. En blanco |

## Producción

- Editable: copia de trabajo `C:\Herramientas\_work\VR014` (derivada de VR013; `node_modules` = junction a `Videos Workspace launcher\video-editor\node_modules`, Remotion 4.0.448). Copia de fuentes en `04_Edicion/Remotion_VR014/` (sin dependencias ni renders).
  - Escenas: `src/scenes/Agente.tsx` (12 escenas). Componentes nuevos: `src/components/Agent.tsx` (núcleo del agente, ventana-jaula con barrotes/candado/hojas, logos, árbol del proyecto, cable con pulsos, chispa, fichas de función, barra de órdenes, caja del proyecto, interruptor, visto). Reutilizados: `Win`, `Monitor`, `Desk`, `Captions` (karaoke + `CLAVES`), `Bits`, `Mind` (`Keys`, iconos).
  - Texto karaoke: ahora un bloque que se alarga para que se lea su última palabra retrasa la entrada del siguiente (sin solapes).
- **Voz** Gemini `es-es-training-9`, modelo `gemini-3.8-flash-lite-tts` (el principal estaba sin cupo; aprobado de oído por el usuario en VR013). 1 toma por frase (`NVALIDAS=1`, máx. 3 intentos): **12 peticiones**, 12 tomas válidas al primer intento (un fallo previo de red no llegó a la API). Comprobadas con Whisper large-v3 (`03_Recursos/voz/gemini/generar_voz.py`, `generar.log`); las marcas se aceptan con parecido ≥ 0,85 (Whisper escribe «Cloud» por «Claude»). **A revisar de oído:** en la t06 Whisper puntuó «¿lo conectas una vez?» como pregunta; si la entonación suena a pregunta, regenerar solo la t06 (1 petición).
- **Música propia** (`scripts/sintetizar_audio.py`): latido oscuro en gancho y problema, acumulación en «se queda», corte seco, floración en «ventana», tema ligero con los nombres, hueco y *drop* en «conectas», sin bombo en «él propone», suspensión mientras la ventana se deshace, acorde final en «Ahora». Ducking −10 dB con la envolvente de la voz.
- **Efectos**: `src/sonido.ts`, cada uno atado a un gesto (golpes contra el cristal, barrotes, candado, nombres de los agentes, enchufe, ventanas, teclas, interruptores, Omnibar, resultado, «Aplicar»).
- **Mezcla** (medida en los renders finales, no escuchada): voz **11,1 dB** sobre el fondo (mediana por segundo, `scripts/medir_mezcla.py`; 58 s con voz; mínimo −13,5 dB en los huecos entre frases y bajo el acorde final), igual en V y H. Máster (`scripts/masterizar.py`, loudnorm en dos pasadas): **−13,9 LUFS** integrados, pico real **−2,7 dBTP**, en V y H; las versiones `_publicar` copian el mismo audio. `medir_mezcla.py` se corrigió: el desfase del contenedor era de 2048 muestras, fuera de su ventana de búsqueda (±2000), y daba 0 segundos con voz; ahora correlaciona por FFT en ±1 s.

## Exportaciones (`05_Exportaciones/`)

- `VR014_V1_1080x1920_60fps.mp4` y `VR014_H1_1920x1080_60fps.mp4` (máster, CRF 16, −13,9 LUFS; 61,38 s, 3680 fotogramas a 60 fps).
- `VR014_V1_1080x1920_60fps_publicar.mp4` y `VR014_H1_1920x1080_60fps_publicar.mp4` (para subir: x264 CRF 20, maxrate 24M, bufsize 48M, preset slow, audio copiado del máster; ≈ 24 Mb/s).
- `VR014_V1_revision_fotogramas.png` y `VR014_H1_revision_fotogramas.png`: un fotograma por frase (al final de su última palabra), 6×2 a media escala (`python scripts/hojas.py <máster> <png> claves`).

## Revisión hecha por Claude

Render a escala 0,4 y hojas de fotogramas cada 0,5 s en vertical y horizontal. Corregido: logos y árbol del proyecto pequeños, teclas e interruptores que pisaban el texto en vertical, fichas enterradas que se veían sobre el registro y se solapaban en horizontal, fichas en vuelo por debajo de la barra, cursor fuera de la tarjeta en la escena 10 y palabras finales de bloque que duraban 0,16 s («dentro»).

Render final a escala completa (un primer intento se cortó al unir los fotogramas: FFmpeg salió con 0xC0000142; el segundo terminó bien) y nuevas hojas cada 0,5 s de los dos másteres. Corregido tras ellas: en horizontal, escena 8 (≈ 37,5–40 s), las tres fichas desenterradas «informe / deploy / backup» se solapaban en fila; ahora suben en pila vertical como en el vertical (`S08` en `Agente.tsx`) y se volvió a renderizar el horizontal. El vertical no cambia con ese ajuste. Audio medido, no escuchado: la escucha final es del usuario.

## Tareas

- [x] Guía, banco de ganchos y guion (61,3 s).
- [x] Verificación de funciones y de Copilot; icono de Copilot con procedencia.
- [x] Voz, animación, música, render V+H y versiones de publicación.
- [ ] El usuario lo ve y lo escucha (especialmente la entonación de la t06); retoques.
- [ ] Confirmar disponibilidad en la versión publicada antes de anunciar.
- [ ] Versión en inglés si se pide (textos EN ya preparados; necesita voz inglesa: 12 peticiones de Gemini).
