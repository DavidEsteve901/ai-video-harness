---
title: Remotion — recursos útiles y cómo encargar vídeos
status: active
created: 2026-10-20
tags: [project/workspace-launcher, remotion, video, animacion, recursos, ia]
---

# Recursos, animación y montaje con la IA

Punto de entrada: [remotion-produccion](.agents/skills/remotion-produccion/SKILL.md). Complementa las [12 skills oficiales instaladas](06_SKILLS_REMOTION.md) con un flujo local para montar recursos, crear animación o combinar ambos.

## Formas de trabajar

| Quiero… | Cómo debe trabajarlo la IA |
| --- | --- |
| Editar clips, fotos, voz o música que doy | Revisar los archivos, seleccionar tramos, encuadrar, ordenar, ajustar ritmo, mezclar audio y añadir los textos pedidos |
| Crear una animación | Convertir el mensaje en escenas con texto, formas, logo, ilustración, datos y movimiento |
| Combinar vídeo y animación | Usar el material real y añadir rótulos, resaltados, zooms, transiciones o escenas animadas donde ayuden |
| Completar una pieza con imágenes, GIFs o clips de internet | Usar [video-recursos-visuales](.agents/skills/video-recursos-visuales/SKILL.md), buscar por la necesidad de cada escena y preparar los seleccionados para el montaje |

El formato, la duración y el estilo salen de tu encargo o del proyecto que ya exista. La IA debe poder cambiar luego una frase, un clip, un sonido o un corte sin rehacerlo todo.

## Recursos de la comunidad seleccionados

Estas opciones están documentadas para consultarlas cuando encajen. Sus librerías, plantillas y servicios no se han instalado como dependencias de tus proyectos. La selección parte del [directorio de recursos de Remotion](https://www.remotion.dev/docs/resources) y de las páginas de sus autores; consultada el 20 de octubre de 2026.

| Recurso | Qué aporta | Cuándo interesa | Fuente y estado |
| --- | --- | --- | --- |
| **Remotion Bits** | Componentes animados de texto, gráficos y transiciones | Reutilizar un bloque visual en una animación | [Repositorio del autor](https://github.com/av/remotion-bits), código MIT |
| **Onda** | Componentes de motion graphics que se incorporan como fuente editable | Mantener un lenguaje de movimiento coherente | [Repositorio del autor](https://github.com/degueba/onda), código MIT |
| **snapcn** | Marcos de dispositivo, terminales, texto y escenas de demos de software | Presentar capturas y explicar un producto | [Repositorio del autor](https://github.com/shadcn-labs/snapcn), código MIT |
| **video-shotcraft** | Recetas de planos y ejemplos de coreografía para vídeos de producto | Buscar referencias para una promo o un movimiento concreto | [Repositorio del autor](https://github.com/Vincentwei1021/video-shotcraft), código y documentación Apache-2.0; audio con atribuciones propias |

La IA puede consultar estas fuentes y adaptar un componente concreto. Debe comprobar la versión requerida y el componente elegido antes de incorporarlo al proyecto.

## Plantillas oficiales que sí aportan a la edición

| Plantilla | Aporta | Fuente |
| --- | --- | --- |
| **TikTok** | Base para subtítulos animados palabra a palabra | [Plantilla oficial](https://www.remotion.dev/templates/tiktok) |
| **Overlay** | Gráficos superpuestos para otro editor de vídeo | [Plantilla oficial](https://www.remotion.dev/templates/overlay) |
| **React Three Fiber** | Base para escenas y objetos 3D | [Plantilla oficial](https://www.remotion.dev/templates/three) |
| **Audiogram y Music Visualization** | Referencias para piezas centradas en voz o música | [Catálogo oficial de plantillas](https://www.remotion.dev/templates) |

El catálogo separa las plantillas gratuitas de las de pago. Editor Starter y Timeline son opciones para desarrollar una aplicación de edición; no son necesarias para que la IA monte tus vídeos en el proyecto de Remotion actual.

## Funciones prácticas a las que puede recurrir

- Cortes, recortes de origen, cambios de velocidad, pantalla dividida y reencuadres.
- Rótulos, subtítulos, títulos animados, cifras, flechas, máscaras y anotaciones.
- Transiciones con tiempos controlados y sincronización de sonido.
- Mezcla por capas de voz, música y efectos del [catálogo de sonidos local](01_Proyectos/Recursos%20videos/Efectos%20sonido/INDICES_IA/00_LEEME.md).
- Escenas con logos, imágenes, gráficos, Lottie o 3D cuando el encargo lo necesite.

Referencias: [componentes de Remotion](https://www.remotion.dev/docs/components), [secuencias](https://www.remotion.dev/docs/sequence), [transiciones](https://www.remotion.dev/docs/transitions) y [captions](https://www.remotion.dev/docs/captions). Las APIs disponibles dependen de la versión de cada proyecto.

## Cómo pedir un vídeo sin preparar un documento técnico

Basta con explicar el resultado y aportar los archivos que quieras usar. La IA también puede [buscar recursos visuales](09_BUSQUEDA_RECURSOS_VISUALES.md) para completar las escenas; si quieres limitarla, indica «solo mis archivos». Puedes copiar este texto y rellenar solo lo que tengas claro:

> Usa `$remotion-produccion`. Los recursos están en **[carpeta o archivos]**. Quiero **[qué debe contar o mostrar el vídeo]**, con un estilo **[referencia o explicación]**. Debe conservar **[voz, música, tomas o partes obligatorias]**. Formato y duración: **[si los tengo decididos]**. Puedes elegir efectos del catálogo y añadir **[textos, subtítulos, animación, etc.]**. Entrega **[previsualización, proyecto editable o MP4]**.

Ejemplos:

- «Con estas tres grabaciones, haz un montaje vertical de unos 20 segundos que muestre el antes y el después. Mantén mi voz y añade textos cortos y efectos discretos. Exporta un MP4».
- «Con este logo y estas frases, crea una intro animada limpia. Quiero ver una primera versión en Studio para ajustar el movimiento».
- «Usa esta captura real de la app, acércate a la acción y señala lo importante con una flecha. No cambies lo que enseña la grabación».

## Lo que hará la IA con tus archivos

Revisará el material, medirá los medios, organizará las escenas, elegirá los recursos necesarios y dejará el montaje editable. La skill incluye un helper local para inventariar duración, dimensiones y pistas de una carpeta; no analiza el contenido visual ni transcribe las voces automáticamente.

La ubicación habitual sigue siendo `01_Proyectos/<vídeo>/`: recursos en `02_Brutos/` o `03_Recursos/`, proyecto en `04_Edicion/` y entregas en `05_Exportaciones/`. La ejecución y las dependencias se mantienen en una copia local, como explica la [guía del proyecto](00_GUIA_IA_Videos_Rapidos.md).

## Nuevos tratamientos y encargos para Claude

Consulta [recetas de cámara, collage, motion y cine](Biblioteca_Estilos_IA/02_RECETAS_ESTILOS.md) y [encargos preparados](Biblioteca_Estilos_IA/05_ENCARGOS_CLAUDE.md). La skill [video-estilos-creativos](.agents/skills/video-estilos-creativos/SKILL.md) coordina estas técnicas con `remotion-produccion` y los recursos existentes. La [aplicación a VR009 / VR010](Biblioteca_Estilos_IA/06_APLICACION_VR009_VR010.md) es un ejercicio documental; antes de editar hay que revisar el vídeo y audio reales.
