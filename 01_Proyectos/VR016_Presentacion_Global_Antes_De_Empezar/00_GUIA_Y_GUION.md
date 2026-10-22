---
title: "VR016 — Guía y guion: «Cada día trabajas un rato antes de empezar a trabajar» (presentación global)"
id: VR016
status: edicion
created: 2026-10-22
tags: [project/workspace-launcher, marketing, video, presentacion, resumen, motion-graphics]
formato: FMT-004
---

# VR016 — Presentación global de la app

Encargo (2026-10-22): una **presentación global** de la app de escritorio que dé a conocer toda su potencia —filosofía, qué ofrecemos y lo más importante— como **resumen general del producto**, con el formato aprobado [FMT-004](../../Biblioteca_Formatos/FMT-004_Presentacion_Concepto_Motion_Karaoke.md). El usuario quiere ver el **software real**: capturas reales de la Store y reconstrucciones fieles con tokens, textos e iconos del frontend.

## 1. La idea (una sola)

> **Preparar no es trabajar.** Cada día pierdes un rato montando lo mismo antes de empezar. La app hace que tu ordenador esté listo cuando tú lo estás, y alrededor de esa idea crecen todas sus funciones.

Sale de la filosofía de la web (`WorkspaceLauncher-web/src/i18n/es.json` → `philosophy`): «Tu ordenador debería estar listo cuando tú lo estés» y sus tres principios («Preparar no es trabajar», «Menos fricción, no más horas», «A tu manera»). El vídeo no usa la frase como eslogan: la convierte en pregunta (t04) y en cierre narrativo (t17).

## 2. Banco de ganchos (familias distintas)

| # | Mecanismo | Primer fotograma | Voz | Valoración |
|---|---|---|---|---|
| **A** | **Paradoja reconocible** | Pantallas que se encienden, ventanas que se abren solas a trompicones, un reloj que corre | «Cada día trabajas un rato antes de empezar a trabajar.» | **Elegido.** Todo el mundo lo reconoce, no necesita cifras y abre un bucle que cierra el final («Ahora te sientas… y ya estás trabajando») |
| B | Filosofía como pregunta | Botón de encendido ámbar | «¿Y si tu ordenador estuviera listo cuando tú lo estás?» | Es el giro (t04); como gancho llega demasiado pronto a la respuesta |
| C | Corrección | Lista de tareas tachada: «abrir, colocar, buscar» | «Preparar no es trabajar.» | Potente pero suena a eslogan si abre el vídeo (regla de la guía) |
| D | Inventario | Muro de capturas reales | «Esto es todo lo que hace tu ordenador cuando tú no estás mirando.» | Vende potencia, pero sin problema no engancha |
| E | POV | Escritorio vacío a las 9:00 | «POV: son las nueve y aún no has empezado.» | Típico; mete una hora como si fuera dato |

## 3. Estructura (FMT-004 adaptada a pieza resumen)

Gancho-paradoja → problema en tres latidos (**abres → colocas → buscas**) → «y mañana, otra vez» → giro con pregunta (filosofía) → mecanismo en dos gestos (**lo preparas una vez / un clic y vuelve**) → **abanico de funciones** a ritmo, una por frase (captura, perfiles de pantallas, Omnibar, chat y voz, dictado, agentes, rutinas y avisos) → principio de control («tú decides») → beneficio con todo lo visto (muro de capturas reales) → cierre que responde al gancho.

**Duración: 75–100 s orientativos; queda en 85,3 s** (voz final medida). Justificación: es la pieza resumen. FMT-004 da 11±3 frases para un solo concepto (~60 s); aquí hay 9 pilares verificados y cada uno necesita su frase y su escena para que se vea el software real, al mismo ritmo de un cambio visual por frase. Recortar a 60 s obligaría a juntar funciones en enumeraciones sin imagen propia.

## 4. Guion

Voz `es-es-training-9` (la aprobada en FMT-004), una sola voz, estilo por toma en `03_Recursos/voz/gemini/plan_vocal.json`.

| # | Voz | Lo que se ve | Claves |
|---|---|---|---|
| 1 | Cada día trabajas un rato antes de empezar a trabajar. | Dos pantallas se encienden; seis ventanas se abren a trompicones y el cursor corre entre ellas; un reloj acelera y se pone en coral | **antes de empezar** (coral) |
| 2 | Abres las mismas apps. Las colocas en cada pantalla. Buscas dónde lo dejaste. | Se abren otra vez; dos se arrastran con torpeza a su mitad; el cursor busca en zigzag con estela, todo parpadea y aparece «?» | **abres · colocas · buscas** (coral) |
| 3 | Y mañana… otra vez. | Rebobinado con glitch; la tira de días avanza de LUN a MAR; las ventanas vuelven a desordenarse; flecha de bucle | **otra vez** (coral) |
| 4 | ¿Y si tu ordenador estuviera listo cuando tú lo estás? | Se apaga todo; un botón de encendido ámbar se ilumina en «listo», la luz converge y las pantallas despiertan | **listo** (ámbar) |
| 5 | Lo preparas una vez: apps, webs, proyectos y terminales. | **Captura real** de un workspace («Focus», 7 aplicaciones) inclinada en 3D; el foco salta por sus filas reales: Spotify, Web, Visual Studio Code y carpeta, terminales | **una vez** (ámbar) |
| 6 | Cada uno en su pantalla, en su escritorio y en su zona. | Los ítems vuelan a dos pantallas numeradas; píldoras «Escritorio 1 / 2»; rejilla de zonas cian; cada ventana encaja en su zona | **pantalla · escritorio · zona** (cian) |
| 7 | Y con un clic, todo vuelve a su sitio. | Pantallas vacías; botón verde «Lanzar» (el de la app); clic → todas las ventanas vuelan a su zona a la vez (*drop*) | **todo vuelve** (verde) |
| 8 | ¿Ya lo tienes abierto? Lo capturas tal cual. | Escritorio ya montado; **tarjeta real «Workspace desde una captura»**; clic en «Crear workspace», destello, barrido; cada ventana marcada; aviso «guardado» | **capturas tal cual** (cian) |
| 9 | ¿Cambias de pantallas? Detecta cuáles tienes y usa su perfil. | Portátil solo con todo amontonado; entran dos monitores; tarjeta «Perfiles de pantallas» → «Perfil detectado: Oficina»; las ventanas se reparten | **su perfil** (cian) |
| 10 | Desde cualquier app, tu atajo abre una barra: buscas, ordenas ventanas o se lo pides a la IA. | La app de delante cambia; tecla «Tu atajo»; cae el **Omnibar real** (captura de la Store); foco en la barra, en «Para las seleccionadas» y en «Ideas para estas ventanas» | **cualquier app** (cian) · **la IA** (ámbar) |
| 11 | O pídeselo con tus palabras, por chat o en voz alta, y te monta el espacio. | **Chat real del asistente** (se escribe la petición en su caja); la **bola del asistente** (esfera de puntos de la app, de escucha a trabajando) y la tarjeta de voz «Prepara mi workspace»; tres apps listas | **por chat · en voz alta** (ámbar) |
| 12 | Dictas en cualquier app, y el texto aparece donde escribías. | Ventana de texto con el cursor; tarjeta del transcriptor «Escuchando → Transcribiendo → Pegado»; la frase aparece en el cursor | **dictas · donde escribías** (cian) |
| 13 | Y si ya usas un agente de IA, lo conectas, y configura la app por ti. | Claude, Codex, Cursor, Antigravity y Copilot; cables que se enchufan; tarjeta «Workspace creado / Atajo asignado / Layout guardado» | **agente de IA · por ti** (ámbar) |
| 14 | Con el tiempo, nota tus rutinas y te las ofrece. Y solo te avisa cuando merece la pena. | Tres días con las mismas apps a las 9:00; **tarjeta «Rutina»** con los textos reales; avisos que no llegan se apagan; un aviso real ««Proyecto web» se abrió a medias: no arrancaron Spotify.» con «Reintentar lo que falta» | **tus rutinas** (ámbar) · **merece la pena** (verde) |
| 15 | Pero nada pasa a tus espaldas: tú decides. | Dos ventanas marcadas en ámbar (lo que la IA quiere tocar); tarjeta «¿Cierro Spotify y Discord?»; el cursor del usuario pulsa «Sí» → verde | **tú decides** (verde) |
| 16 | Tu ordenador recuerda cómo trabajas, para que tú pienses solo en tu trabajo. | **Muro de capturas reales** (workspace, Omnibar, gestos del ratón, chat, layouts) con partículas ámbar; se aleja y queda una sola ventana nítida en verde | **recuerda** (ámbar) · **tu trabajo** (verde) |
| 17 | Ahora te sientas… y ya estás trabajando. | Pantallas apagadas que se encienden; en «ya» todo aparece ya colocado; la frase sube al centro | **ya estás trabajando** (verde) |

Sin logo, nombre de la app, precio, URL ni cifras. Los datos de ejemplo (nombres de perfil «Portátil/Oficina», «Proyecto web», «9:00», la frase dictada) son ilustrativos y van en el formato de los textos reales de la app.

## 5. Lenguaje y sonido

Igual que FMT-004: oscuro premium, colores con significado (coral problema · ámbar IA/memoria · cian control · verde listo), resortes y curvas expo, empuje de cámara, sacudida en impactos. Novedad de VR016: **pantallas reales** de la Store recortadas sin nombre ni plan (`03_Recursos/capturas/recortar_capturas.py`), con inclinación 3D y un foco que recorre la interfaz, y **reconstrucciones fieles** (bola del asistente con el motor de `assistantOrb.js`, tarjetas OSD, transcriptor, tarjeta de rutina con sus textos de `RoutineService.cs`, botón «Lanzar»).

Música propia: oscura con latido en el problema, acumulación en «buscas», corte seco en «otra vez», floración en «listo», tema ligero al preparar, hueco en «zona» y *drop* en «todo vuelve», tema con ritmo durante el abanico de funciones, sin bombo en rutinas, suspensión en «tú decides», floración en «recuerda» y acorde final en «ya».
