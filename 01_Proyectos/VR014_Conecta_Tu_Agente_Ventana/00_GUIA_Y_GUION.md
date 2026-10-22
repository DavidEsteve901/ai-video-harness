---
title: "VR014 — Guía y guion: «Tu agente de IA vive encerrado en una ventana»"
id: VR014
status: producido
created: 2026-10-22
tags: [project/workspace-launcher, marketing, video, presentacion, agentes, mcp, omnibar]
formato: FMT-004
ideas: [IDEA-041, IDEA-042]
---

# VR014 — Conecta tu agente: «Tu agente de IA vive encerrado en una ventana»

Tercer vídeo con el formato aprobado [FMT-004](../../Biblioteca_Formatos/FMT-004_Presentacion_Concepto_Motion_Karaoke.md) (después de VR012 y VR013): mismo lenguaje visual, texto karaoke con claves, voz Gemini y música propia. Encargo del usuario (2026-10-21): rehacer de cero el concepto de VR011 (conecta tu agente) en el formato aprobado, sin reutilizar el estilo cuaderno de VR011 (no le gusta). Une en una sola pieza [IDEA-041](../../00_Ideas/Conceptos/IDEA-041_tu-agente-prepara-tu-entorno.md) (el agente controla la app) e [IDEA-042](../../00_Ideas/Conceptos/IDEA-042_tus-proyectos-desde-el-omnibar.md) (funciones de tus proyectos en el Omnibar): el perfil editorial pedía separarlas, pero el usuario las pide juntas.

## 1. La idea (una sola promesa)

> **Tu agente ya conoce tu proyecto; conéctalo y que prepare también tu forma de trabajar.**

El agente de IA (Claude, Codex, Cursor, Antigravity, Copilot…) es muy capaz, pero vive dentro de su propia ventana: sabe todo del código y nada de tu escritorio. Conectado a Workspace Launcher, **controla la app**: entiende en qué trabajas y te monta el entorno (espacios, ventanas, atajos, ajustes) y, además, **lleva funciones de tu proyecto al Omnibar**, para lanzarlas con un atajo desde cualquier app. La lógica sigue en tu proyecto; el Omnibar da el acceso; el agente lo configura; tú revisas y decides.

Metáfora central: **la ventana como jaula** (el agente rebota contra el cristal → barrotes → «¿y si le abrieras la ventana?» → sale y conecta con todo → al final la ventana se deshace). Encaja con la serie: VR013 hablaba de «ventanas abiertas» en la cabeza.

Funciones que sostienen cada frase (comprobadas en el código 1.2.7 y en la web; detalle en la [ficha](00_FICHA_VIDEO.md)):

| Frase | Respaldo |
|---|---|
| Lo conectas una vez | Ajustes → Agentes: conexión con un clic para Codex, Claude Code/Desktop, Antigravity, OpenCode, Gemini CLI, **GitHub Copilot**, Cursor y Windsurf (`McpAgentConnections.jsx`, `McpClientInstaller.cs`) |
| Te monta el entorno: espacios, ventanas, atajos, ajustes | Herramientas MCP `create_workspace` (borrador + confirmación), `arrange_window`/`organize_windows`, `create_virtual_desktop`, `set_hotkey`, `set_app_setting`; web «Tu agente de IA monta la app por ti» |
| Entiende en qué trabajas | El agente conoce el repositorio (contexto propio) + `inspect_project_commands`, `get_personalization_context` (instrucciones del servidor MCP: «tú conoces el proyecto, la app conoce al usuario») |
| Lleva sus funciones a tu Omnibar | `get_custom_action_guide` + `save_custom_action` (command/process/open/url/http, atajo propio `/atajo`, sugerencias y formularios); web «Tus proyectos, a una orden de distancia» |
| Pulsas tu atajo, eliges una función… tu proyecto hace el trabajo. Desde cualquier app | Omnibar con atajo encima de cualquier app (web `omnibar`); la acción ejecuta el comando/servicio del proyecto y devuelve el resultado en la barra (`custom_actions_guide.md`, «Output protocol») |
| Él propone. Tú revisas y decides | Borradores con confirmación (`create_workspace` → `commit_workspace_draft`); `save_custom_action` no ejecuta y se guarda desactivada salvo autorización; ejecución por agente es un permiso aparte |

`/informe`, `deploy`, `backup` y «Ctrl + Alt + 1» son **ilustrativos** (como en la web), no funciones nativas.

## 2. Banco de ganchos (familias distintas)

| # | Mecanismo | Primer fotograma | Voz | Valoración |
|---|---|---|---|---|
| **A** | **Concepto provocador** | Ventana oscura; dentro, un núcleo ámbar rebota contra el cristal y en cada golpe es otro agente (Claude, Codex, Cursor, Antigravity, Copilot); caen barrotes | «Tu agente de IA vive encerrado en una ventana.» | **Recomendado y usado.** Replantea el problema en una imagen, enseña los logos en los 2 primeros segundos y abre el bucle que cierra el final («ya no vive en una ventana») |
| B | Contraste irónico | Agente escribiendo código / persona arrastrando ventanas | «Tu IA escribe tu código… y tú sigues colocando ventanas.» | Muy claro, pero es el problema, no el concepto; queda como frase 3 |
| C | Pregunta directa | Núcleo ámbar con «?» | «¿Tu agente sabe dónde trabajas?» | Bueno para TikTok; menos visual |
| D | Acusación amable | Árbol de proyecto enorme frente a un escritorio vacío | «Le das todo tu proyecto a la IA… menos tu escritorio.» | Alternativa para un segundo corte |
| E | Tesoro enterrado | Funciones brillando bajo capas de terminal | «Lo mejor de tu proyecto está enterrado en una terminal.» | Gancho fuerte para un vídeo solo del Omnibar (IDEA-042 en solitario) |

## 3. Estructura (FMT-004)

Gancho-concepto (agente encerrado) → problema en tres latidos (**lo sabe todo** → **pero el escritorio lo montas tú** → **tus funciones, enterradas**) → giro con pregunta y luz («¿Y si le abrieras la ventana?») → mecanismo en dos gestos (**lo conectas una vez** con los logos / **te monta el entorno**) → segunda capa (**sus funciones, en tu Omnibar** → **las usas con un atajo**) → control (**él propone, tú decides**) → cierre que responde al gancho.

## 4. Guion (voz real: 61,3 s)

Voz Gemini `es-es-training-9` (la misma de VR012/VR013), una sola voz, estilo por toma.

| # | Voz | Estilo | Lo que se ve | Claves |
|---|---|---|---|---|
| 1 | Tu agente de IA vive encerrado en una ventana. | intrigante y con aplomo | Ventana con conversación abstracta; un núcleo ámbar rebota contra el cristal y cada golpe muestra otro logo; en «encerrado» caen barrotes, candado coral, sacudida | **encerrado** (coral) |
| 2 | Conoce tu proyecto por dentro: cada carpeta, cada script. | admirado, con ritmo | La ventana se hace pequeña; su luz atraviesa los barrotes e ilumina el árbol del proyecto: se encienden carpetas y luego scripts (engranajes) | **por dentro · cada carpeta · cada script** (ámbar) |
| 3 | Pero el escritorio lo sigues montando tú: abrir, colocar, recordar comandos. | ironía cómplice | Dos pantallas se encienden vacías; aparece tu cursor; se abren ventanas desordenadas; arrastras una con torpeza; en la terminal «$ npm run ???» y una «?» | **tú · abrir · colocar · recordar comandos** (coral) |
| 4 | Y lo mejor de tu proyecto se queda enterrado en una terminal. | pena contenida | Tres funciones doradas (informe, deploy, backup) se hunden en la terminal; capas de registro las tapan; polvo; borde coral | **lo mejor** (ámbar) · **enterrado** (coral) |
| 5 | ¿Y si le abrieras la ventana? | ilusionado, bajando el ritmo | Silencio y luz: los barrotes suben, el candado se abre, las hojas de cristal se abren y el agente sale entre rayos | **abrieras la ventana** (ámbar) |
| 6 | Claude, Codex, Cursor, Antigravity, Copilot… el que ya uses, lo conectas una vez. | ágil con los nombres, luego cercano | Cada logo salta al decir su nombre y orbita al agente; un cable ámbar se enchufa a tu pantalla (chispa, borde cian) | **el que ya uses** (ámbar) · **una vez** (cian) |
| 7 | Entiende en qué trabajas y te monta el entorno: espacios, ventanas, atajos, ajustes. | seguro, enumerando | El agente «piensa» (ondas); cables a las dos pantallas; tira de escritorios; las ventanas vuelan a su sitio; teclas Ctrl + Alt + 1; interruptores; visto verde | **te monta el entorno** (ámbar) · **espacios · ventanas · atajos · ajustes** (cian) |
| 8 | Y desentierra lo mejor de tu proyecto: lleva sus funciones a tu Omnibar. | con chispa | Vuelve la terminal; la luz del agente saca las funciones de debajo del registro; vuelan a una barra de órdenes y se vuelven «/informe», «/deploy», «/backup» | **desentierra** (ámbar) · **Omnibar** (cian) |
| 9 | Pulsas tu atajo, eliges una función… y tu proyecto hace el trabajo. Desde cualquier app. | satisfecho y claro | Tecla «Tu atajo»; la barra aparece encima de otra app; eliges «/informe»; un cable cian lleva la orden a la caja del proyecto (engranajes); vuelve «informe listo»; la app de detrás cambia dos veces y la barra sigue ahí | **tu atajo · cualquier app** (cian) · **tu proyecto hace el trabajo** (verde) |
| 10 | Él propone. Tú revisas y decides. | tranquilo y firme | Tarjeta «Propuesta» con borde discontinuo sale del agente; lupa que revisa cada fila; clic en «Aplicar» → borde verde y visto | **tú revisas y decides** (verde) |
| 11 | Tu agente ya no vive en una ventana. | pausado, con intención | La ventana vacía se deshace en polvo de cristal mientras el agente gira libre a su alrededor y acaba en el centro | **ya no** (verde) |
| 12 | Ahora prepara tu forma de trabajar. | cálido, cerrando | El entorno completo: pantallas con ventanas, escritorios, barra con «/informe», cables del agente, visto verde; la frase sube al centro | **tu forma de trabajar** (verde) |

## 5. Lenguaje y sonido

Igual que FMT-004: oscuro premium, colores con significado (coral problema · ámbar IA/agente · cian control · verde listo), metáforas abstractas, resortes. Objetos nuevos: **núcleo del agente** (orbe ámbar con destello y anillo), **ventana-jaula** (barrotes, candado, hojas de cristal), **árbol del proyecto**, **cable con pulsos**, **fichas de función** con engranaje, **barra de órdenes** (metáfora del Omnibar, no su interfaz), **caja del proyecto** con engranajes, **tarjeta de propuesta**. Logos reales de los agentes solo para identificarlos.

Música propia (`scripts/sintetizar_audio.py`): latido oscuro en el gancho y el problema, acumulación en «se queda enterrado» y corte seco; brillo y floración en «ventana»; tema ligero con los nombres, hueco y **drop en «conectas»** (el enchufe); sin bombo en «él propone»; suspensión suave mientras la ventana se deshace; acorde final en «Ahora».
