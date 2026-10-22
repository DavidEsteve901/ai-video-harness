---
title: "VR013 — Guía y guion: «Tu cabeza tiene demasiadas ventanas abiertas»"
id: VR013
status: guion
created: 2026-10-21
tags: [project/workspace-launcher, marketing, video, presentacion, flujo, foco]
formato: FMT-004
---

# VR013 — Entrar en flujo: «Tu cabeza tiene demasiadas ventanas abiertas»

Segundo vídeo con el formato aprobado [FMT-004](../../Biblioteca_Formatos/FMT-004_Presentacion_Concepto_Motion_Karaoke.md) (mismo lenguaje visual, texto karaoke, voz y música propia). Encargo del usuario (2026-10-21): enseñar el **concepto** que explota la app —escritorios virtuales, atajos del ratón, rotación de zonas y pestañas— no como lista de funciones sino como **psicología del foco**: hoy usamos mal el PC (buscar, apuntar, arrastrar), eso es carga mental innecesaria que nos saca de la concentración; con un esquema espacial fijo y gestos rápidos dejamos de pensar en las ventanas y entramos en flujo. No se centra en lanzar escritorios (eso ya lo cuenta VR012).

## 1. La idea (una sola)

> **Tu cabeza no está para recordar dónde está cada ventana. Dale un mapa y unos gestos, y vuelve a pensar solo en tu trabajo.**

Pruebas del concepto (todas comprobadas en la app 1.2.7 y en la web, sección «Flujo ergonómico»; se activan con *Configuración → Atajos → Añadir preset opcional*):

| Gesto | Qué hace | Comprobado en |
|---|---|---|
| X2 / X1 (botones laterales) | Siguiente / anterior escritorio virtual | `HotkeyProcessor` → `DesktopCycleFwd/Bwd`; web `mouseFlow.scenes[0]` |
| Alt + X2 / X1 con el puntero encima de una zona | Rota las ventanas de esa zona, sin clic ni foco | `ZoneCycler` (usa la posición del cursor); web `scenes[2]` |
| Shift + X2 / X1 con el puntero encima de una ventana | Recorre sus pestañas (navegador, terminal, explorador), sin clic | `TabCycler` (posición del cursor); web `scenes[3]` |

Sin cifras: la web cita «23 s» y «40 %», pero no tenemos su fuente aquí, así que el vídeo no da números.

## 2. Ganchos (familias distintas)

| # | Mecanismo | Primer fotograma | Voz | Valoración |
|---|---|---|---|---|
| **A** | **Concepto provocador** | Silueta de una cabeza llena de ventanas que se multiplican y se amontonan | «Tu cabeza tiene demasiadas ventanas abiertas.» | **Recomendado.** Lleva la metáfora de la pantalla a la mente; abre el bucle que cierra el final («una sola ventana abierta») |
| B | Corrección de expectativa | Móvil tachado, cursor buscando | «No te distrae el móvil. Te distrae buscar ventanas.» | Potente pero atribuye una causa sin prueba |
| C | Acusación amable | Cursor en zigzag | «Estás usando el ordenador al revés.» | Buen tono; menos visual |
| D | Pregunta | Hilo ámbar que se rompe | «¿Qué ibas a hacer?» | Es el remate de la escena 3, no el arranque |
| E | POV | Escritorio desordenado | «POV: tienes 40 pestañas y no encuentras ninguna.» | Típico |

## 3. Estructura (FMT-004)

Gancho-concepto → problema en tres latidos (**buscar → perder el hilo → cansancio mental**) → giro con pregunta → mecanismo (**mapa espacial** + **tres gestos del pulgar**) → beneficio (dejas de pensar dónde está todo) → nombre del estado (**flujo**) → cierre que responde al gancho.

## 4. Guion

Voz `es-es-training-9` (la misma de VR012), una sola voz, estilo por toma.

| # | Voz | Estilo | Lo que se ve | Claves |
|---|---|---|---|---|
| 1 | Tu cabeza tiene demasiadas ventanas abiertas. | intrigante y con aplomo | Perfil de una cabeza; dentro, ventanas que entran y se multiplican hasta saturarla; avisos que parpadean | **demasiadas** (coral) |
| 2 | Buscas una pestaña. Apuntas. Arrastras. Cambias de escritorio a ciegas. | enumerando con ritmo, algo agobiado | Pantalla desordenada; el cursor busca en zigzag dejando estela, apunta a una pestaña diminuta, arrastra una ventana, el escritorio cambia de golpe | **buscas · apuntas · arrastras · a ciegas** |
| 3 | Y cuando por fin la encuentras… ¿qué ibas a hacer? | pausa, luego desconcierto cómplice | El cursor llega; un hilo ámbar que unía la cabeza con la tarea se tensa y **se rompe**; «?» | **¿qué ibas a hacer?** |
| 4 | Cada búsqueda es una pequeña decisión. Y cien pequeñas decisiones te vacían la cabeza. | reflexivo, con peso | Cada decisión cae como un bloque dentro de la cabeza; un medidor de energía mental se vacía | **pequeña decisión · vacían** |
| 5 | ¿Y si tu mano supiera llegar sola? | ilusionado, bajando el ritmo | Todo se apaga; aparece un ratón luminoso con los botones laterales en ámbar | **sola** (ámbar) |
| 6 | Tu cerebro recuerda lugares mejor que listas. Así que dale un mapa. | seguro, didáctico | Las ventanas sueltas se ordenan en un **mapa**: tres escritorios como habitaciones contiguas, cada uno con su distribución | **lugares · un mapa** |
| 7 | Un escritorio para cada cosa. El pulgar avanza… el pulgar vuelve. | ágil, con ritmo | El botón X2 se ilumina y el mapa se desplaza a la derecha; X1 y vuelve. Entra el ritmo de la música | **avanza · vuelve** (ámbar) |
| 8 | Pones el puntero sobre una zona, un toque de pulgar, y sus ventanas rotan. Sin clic. | satisfecho, claro | Puntero quieto sobre una zona; teclas «Alt + X2»; las ventanas apiladas giran como un carrusel | **rotan · sin clic** (cian) |
| 9 | Y las pestañas cambian igual: sin apuntar a ninguna. | ligero | Navegador con fila de pestañas; el puntero está en el contenido, no en las pestañas; «Shift + X2»; la pestaña activa avanza | **sin apuntar** (cian) |
| 10 | Dejas de pensar dónde está todo. Y empiezas a pensar en lo que haces. | cálido, convencido | Vuelve la cabeza: las ventanas salen de ella y se colocan fuera, en su mapa; dentro queda espacio y calma | **dónde** (coral) · **lo que haces** (verde) |
| 11 | Eso es entrar en flujo. | pausado, con intención | Líneas de flujo suaves que recorren la cabeza; el medidor de energía se llena | **flujo** (verde) |
| 12 | Ahora tu cabeza tiene una sola ventana abierta: la que importa. | cálido, cerrando con una sonrisa | Dentro de la cabeza, una única ventana, nítida y verde. Frase final al centro | **una sola ventana** (verde) |

Duración estimada: 60–65 s. Vertical y horizontal.

## 5. Lenguaje y sonido

Igual que FMT-004: oscuro premium, colores con significado (coral problema · ámbar IA/memoria · cian control · verde listo), ventanas abstractas, resortes. Objetos nuevos: **cabeza de perfil** (la mente), **hilo ámbar** (el foco), **medidor de energía mental**, **ratón con X1/X2**, **teclas** y **mapa de escritorios**.

Música propia: tensa y saturada en el problema (va acumulando capas hasta «vacían»), silencio en el giro, floración en «sola», tema con *drop* en «avanza», calma en el beneficio, gran floración en «flujo» y acorde final.
