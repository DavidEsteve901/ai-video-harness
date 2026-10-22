---
title: "VR015 — Guía y guion: «Llevas años haciendo de recadero de tus apps» (Omnibar)"
id: VR015
status: edicion
created: 2026-10-22
tags: [project/workspace-launcher, marketing, video, presentacion, omnibar, ia]
formato: FMT-004
---

# VR015 — El Omnibar: «Llevas años haciendo de recadero de tus apps»

Tercer vídeo con el formato aprobado [FMT-004](../../Biblioteca_Formatos/FMT-004_Presentacion_Concepto_Motion_Karaoke.md) (texto karaoke con claves, voz Gemini, música propia, vertical y horizontal). Encargo del usuario (2026-10-21): un vídeo **solo del Omnibar**: abrir apps y colocar ventanas, sugerencias de la IA según la app de delante, búsqueda en internet con resumen, marcar ventanas para que la IA proponga (web → Notion/Obsidian), funciones personalizadas que conectan con otras apps.

**Novedad respecto a VR012/VR013:** aquí el Omnibar se ve **fiel a la app**. Se reconstruyó en Remotion con los tokens del CSS real (`OmnibarQuick.css`: `--ob-solid`, `--ob-ai #f2c14e`, acento `#00D2FF`, radios 22/18 px, Plus Jakarta Sans), los iconos Lucide que usa el componente y los textos reales de `locales/es.json`. Referencia visual tomada del banco real `frontend/preview-omnibar.html` (app 1.2.7). El resto del vídeo mantiene el lenguaje FMT-004.

## 1. La idea (una sola)

> **Llevas años yendo tú a las apps: copias, pegas, buscas, abres y colocas. El Omnibar le da la vuelta: una barra encima de lo que haces, que ya sabe qué tienes delante y te trae lo que necesitas.**

Metáfora: **el recadero**. Un puntero que corre de ventana en ventana con un paquete, dejando un rastro coral que se enreda. El giro invierte las flechas: las cosas vienen a ti. El cierre responde al gancho: «Ya no eres el recadero de tus apps. Ahora trabajan para ti».

## 2. Ganchos (familias distintas)

| # | Mecanismo | Primer fotograma | Voz | Valoración |
|---|---|---|---|---|
| **A** | **Concepto provocador** | Puntero que corre entre ventanas con un paquete; rastro coral enredado | «Llevas años haciendo de recadero de tus apps.» | **Recomendado.** Metáfora visual inmediata, sin cifras; abre el bucle que cierra el final |
| B | Acusación amable | Menú Inicio abriéndose otra vez | «Sigues abriendo el menú Inicio para todo.» | Concreto, pero solo cubre abrir apps |
| C | Corrección de expectativa | Pila de pestañas | «No te falta otra app. Te sobra ir de una a otra.» | Bueno, más abstracto |
| D | Pregunta | Ventanas que se acercan solas | «¿Y si las apps vinieran a ti?» | Es el giro (escena 4), no el arranque |
| E | Revelación | Barra que aparece sobre un vídeo | «Hay una barra en tu PC que todavía no usas.» | Promete sin concepto |

## 3. Estructura (FMT-004)

Gancho-concepto → problema en tres latidos (**los recados** → **cuántos viajes** → **lo que se pierde en cada viaje**) → giro con pregunta → mecanismo (**un atajo / una barra encima** + **ya sabe qué tienes delante**) → abanico de funciones, un cambio visual por frase (apps y ventanas · búsqueda con fuentes · ventanas marcadas → notas · comandos propios) → beneficio (sin salir de lo que haces) → cierre que responde al gancho.

## 4. Guion

Voz `es-es-training-9` (la de VR012/VR013), una sola voz, estilo por toma (`03_Recursos/voz/gemini/plan_vocal.json`).

| # | Voz | Estilo | Lo que se ve | Claves |
|---|---|---|---|---|
| 1 | Llevas años haciendo de recadero de tus apps. | intrigante y cómplice | Ventanas sueltas en la oscuridad; un puntero corre de una a otra con un paquete brillante; el rastro coral se enreda | **recadero** (coral) |
| 2 | Copias de aquí. Pegas allí. Buscas en otra pestaña. Abres, colocas, vuelves. | enumerando con ritmo, agobiado | Un monitor: selección + «Ctrl C», viaje a las notas + «Ctrl V», pestañas que pasan, rejilla de apps, ventana arrastrada, vuelta | **copias · pegas · buscas · vuelves** (coral) |
| 3 | Y en cada viaje se te escapa un poco de lo que estabas pensando. | reflexivo, lento | Una idea ámbar (bocadillo de pensamiento) sobre la tarea; cada viaje del puntero le arranca partículas hasta dejarla gris | **se te escapa** (coral) |
| 4 | ¿Y si, en vez de ir tú a todo… todo viniera a ti? | ilusionado, bajando el ritmo | Todo se apaga; silencio; las flechas se invierten y las apps viajan hacia un punto de luz ámbar | **viniera a ti** (ámbar) |
| 5 | Pulsas tu atajo, y aparece una barra encima de lo que estés haciendo. | seguro y claro | Tecla «tu atajo» que se hunde; **el Omnibar real** cae sobre el escritorio con Chrome delante: píldora «Pide algo a la IA o explora con /» | **tu atajo · encima** (cian) |
| 6 | Ya sabe qué app tienes delante, y la IA te sugiere qué hacer con ella. | sorprendido para bien | Se despliega la tarjeta: «Sugerencias · Chrome» (Chrome a la izquierda, Solo Chrome…) y la franja dorada «Sugerencias de la IA según tu contexto» con brillo de carga → ideas | **delante · te sugiere** (ámbar) |
| 7 | Abre cualquier app con media palabra… y colócala donde quieras. | ágil y juguetón | Se teclea «spo» con autocompletado fantasma; fila «Abrir Spotify · App» seleccionada (acento); se abre; «Spotify a la derecha» y la ventana encaja en su mitad | **media palabra · donde quieras** (cian) |
| 8 | Pregúntale lo que sea: busca en internet y te lo resume, con sus fuentes. | claro y convencido | Pregunta escrita; luz ámbar corre por la base de la píldora; tarjeta de respuesta con «Fuentes de la búsqueda» y «Con estas páginas: Resume las páginas encontradas» | **busca en internet** (cian) · **con sus fuentes** (verde) |
| 9 | Marca varias ventanas con Control y clic, y te propone qué hacer con ellas. | didáctico | Ctrl + clic en Chrome y en las notas: contorno y número; en la barra, «Ventanas seleccionadas» e «Ideas para estas ventanas» | **marca · te propone** (ámbar) |
| 10 | Por ejemplo: resume esta web y pásalo a tus notas de Notion u Obsidian. | práctico, satisfecho | Se elige la idea; estado «Leyendo Chrome → Redactando → Escribiendo»; partículas de la web a la nota; tarjeta «¿Escribo este texto…?» → la nota se escribe | **resume esta web** (ámbar) · **Notion u Obsidian** (verde) |
| 11 | Y con tus propios comandos la conectas con lo que uses: un script, una web, un servicio. | con ritmo, enumerando | Se teclea «/»; explorador con el filtro «Personalizadas»; filas con «/comando»; de cada una sale un cable a un icono: terminal, globo, servidor | **tus propios comandos** (cian) |
| 12 | Todo, sin salir de lo que estás haciendo. | cálido y tranquilo | La barra se recoge; la ventana de trabajo sigue delante, intacta; marcas verdes de lo hecho | **sin salir** (verde) |
| 13 | Ya no eres el recadero de tus apps. Ahora trabajan para ti. | cálido, cerrando con una sonrisa | Vuelve el enredo del gancho: el rastro se deshace; las apps se ordenan alrededor de la barra; verde. Frase final al centro | **recadero** (coral) · **trabajan para ti** (verde) |

Duración estimada: 65–70 s. Vertical 1080×1920 y horizontal 1920×1080, 60 fps.

## 5. Funciones verificadas (app 1.2.7, solo lectura)

Raíz: `C:\Herramientas\Launcher pro\workspace-automator\WorkspaceLauncher\`.

| Lo que dice el vídeo | Comprobado en |
|---|---|
| Barra que aparece con un atajo encima de lo que haces (configurable; preset recomendado `Ctrl+Alt+Shift+Espacio`) | `Core/Input/RecommendedHotkeys.cs` (`chatbot_omnibar`), `OmnibarWindow.xaml.cs`; web `omnibar.ui.shortcut` «Tu atajo». El vídeo dice «tu atajo», sin fijar combinación |
| Sabe qué app tienes delante: «Sugerencias · estás en Chrome» (chips como «Chrome a la izquierda») | `Core/Omnibar/OmnibarService.cs` (chips por la ventana delantera, `win_left` l.280), `locales/es.json` `omnibar_suggested_for` |
| La IA sugiere según el contexto («Sugerencias de la IA según tu contexto», ideas doradas) | `OmnibarService.MarkIdeasAsync` → `AmbientIdeasAsync` → `WindowAssist.IdeasAsync`; `omnibar_ideas_ambient` |
| Abrir apps con media palabra (autocompletado) y colocarlas | `omnibarAutocomplete.js`, `omnibarCommands.js`, `Core/Omnibar/OmnibarCommands.cs` (`app_open`, `win_left`, `win_right`, `win_monitor`, `win_only`, `win_new_desktop`…) |
| Busca en internet y resume con fuentes | `OmnibarService.cs` (`search_web`, «Fuentes de la búsqueda», abrir una o todas), `OmnibarService.Research.cs`, `WebResearchFollowUps.cs` («Resume las páginas encontradas», citas [n] y referencias) |
| Marcar ventanas con Ctrl + clic y que proponga | `WindowAssist.cs`, `OmnibarQuick.jsx` («Ventanas seleccionadas», «Ideas para estas ventanas», «Para las seleccionadas») |
| Resumen de una web → notas | Lectura de la ventana origen (`read_window_content`) y escritura una vez: `ui_write_text` en apps normales (Notion como ventana abierta, el mismo ejemplo que la demo de la web `omnibar.demo.ideas`) u `obsidian_note` en Obsidian (nota real del vault, con tarjeta de revisión) — `OmnibarService.cs` l.1908-1912, `VaultWindowAssist.cs`, `WebResearchFollowUps.cs` («Pon el resumen en {ventana}») |
| Comandos propios que conectan con otras apps (script, web, servicio) | `Core/CustomActions/CustomActionModels.cs` (conexiones `process`, `command`, `open`, `url`, `http`), `CustomActionService.CatalogAsync` (aparecen en el Omnibar como «/comando», filtro «Personalizadas») |

Notas de honestidad: Obsidian tiene soporte propio (notas del vault); Notion se escribe como cualquier ventana abierta (tal y como lo enseña la web). Sin cifras. Los comandos personalizados del vídeo («/publicar», «/tarea», «/informe») son ejemplos de lo que el usuario puede crear, no comandos que vengan de serie.

## 6. Lenguaje y sonido

FMT-004: fondo #07090F con luces que respiran, viñeta y grano; colores con significado (coral problema · ámbar IA · cian control · verde listo). Coinciden con los de la propia barra: ámbar `--ob-ai` = IA, acento cian = selección, verde = hecho. Objetos nuevos: **el recadero** (puntero con paquete y rastro), **la idea ámbar** que se deshace, **el Omnibar real** (píldora + tarjeta), **cables** de los comandos a sus destinos.

Música propia: inquieta y con prisa en los recados (se acelera hasta «vuelves»), se vacía en «se te escapa», silencio en el giro, floración en «a ti», tema con *drop* cuando aparece la barra, ritmo ligero en el abanico de funciones, calma en «sin salir» y acorde final.
