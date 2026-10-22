---
title: Skills de Remotion para la edición de vídeos
status: active
created: 2026-10-20
tags: [project/workspace-launcher, video, remotion, skills, ia]
---

# Skills de Remotion

Colección oficial de [remotion-dev/skills](https://github.com/remotion-dev/skills), instalada en `.agents/skills/` dentro de `Videos_Rapidos`. Contiene instrucciones técnicas, referencias y ejemplos para que un agente consulte lo que necesita al crear o modificar un vídeo.

## Montaje con tus recursos y animación

La skill local [remotion-produccion](.agents/skills/remotion-produccion/SKILL.md) coordina el trabajo cuando aportas clips, fotos, música, voz o un encargo de animación. Revisa los medios, organiza las escenas y usa las referencias oficiales necesarias. La [guía de recursos y encargos](07_RECURSOS_REMOTION_Y_ENCARGOS.md) reúne componentes de la comunidad, plantillas y ejemplos de cómo pedir el resultado. Esta skill propia complementa las 12 oficiales de la tabla siguiente.

La búsqueda de fotos, GIFs y clips externos se coordina con [video-recursos-visuales](.agents/skills/video-recursos-visuales/SKILL.md), que revisa los candidatos y justifica su función dentro del vídeo. Puede completar tus archivos salvo que indiques usar solo tu material. Consulta [la guía de búsqueda visual](09_BUSQUEDA_RECURSOS_VISUALES.md).

Para voces en off y diálogos, usa [voces-locucion](.agents/skills/voces-locucion/SKILL.md): conserva la misma voz y referencia por personaje y dirige emoción, intención, intensidad y ritmo según cada frase y escena. La [guía de interpretación](Biblioteca_Voces/04_EXPRESIVIDAD_Y_PERSONALIZACION.md) explica el plan vocal y la generación local gratuita. Guarda el plan y las tomas en el proyecto del vídeo.

## Qué leer según el trabajo

| Necesidad | Skill local |
| --- | --- |
| Empezar y decidir qué guía cargar | [remotion-best-practices](.agents/skills/remotion-best-practices/SKILL.md) |
| Crear un vídeo o una composición | [remotion-create](.agents/skills/remotion-create/SKILL.md) |
| Montaje, animaciones, textos, audio, cortes y transiciones | [remotion-markup](.agents/skills/remotion-markup/SKILL.md) |
| Previsualizar y revisar en Remotion Studio | [remotion-studio](.agents/skills/remotion-studio/SKILL.md) |
| Exportar vídeo o fotogramas | [remotion-render](.agents/skills/remotion-render/SKILL.md) |
| Subtítulos y captions sincronizados | [remotion-captions](.agents/skills/remotion-captions/SKILL.md) |
| Consultar APIs y documentación actual | [remotion-docs](.agents/skills/remotion-docs/SKILL.md) |
| Metadatos de audio y vídeo con Mediabunny | [remotion-multimedia](.agents/skills/remotion-multimedia/SKILL.md) |
| Elementos y líneas de tiempo editables en Studio | [remotion-interactivity](.agents/skills/remotion-interactivity/SKILL.md) |
| Mapas, rutas y cámaras geográficas | [remotion-maps](.agents/skills/remotion-maps/SKILL.md) |
| Integrar Remotion en aplicaciones | [remotion-saas](.agents/skills/remotion-saas/SKILL.md) |
| Actualizar Remotion y sus paquetes cuando sea necesario | [remotion-upgrade](.agents/skills/remotion-upgrade/SKILL.md) |

La skill principal distribuye el trabajo entre referencias; no hace falta cargar toda la colección para cada retoque.

## Referencias directas para editar

- [Estructura del montaje con clips](.agents/skills/remotion-markup/video-editing.md).
- [Tiempos, secuencias y recortes](.agents/skills/remotion-markup/timing-props.md).
- [Transiciones entre escenas](.agents/skills/remotion-markup/transitions.md).
- [Audio: volumen, recorte y velocidad](.agents/skills/remotion-markup/audio.md).
- [Fuentes locales](.agents/skills/remotion-markup/local-fonts.md).
- [Tamaño de texto y desbordamientos](.agents/skills/remotion-markup/measuring-text.md).
- [Composición visual y tamaños de texto](.agents/skills/remotion-create/video-layout.md).

## Aplicación a este proyecto

1. Lee [la guía actual de vídeos rápidos](00_GUIA_IA_Videos_Rapidos.md) y la ficha del vídeo. Usa su formato y el brief; los valores que ya tiene un proyecto prevalecen sobre ejemplos genéricos.
2. Abre la skill principal y las referencias pertinentes. Para editar un vídeo existente, conserva su proyecto y sus recursos.
3. Trabaja y ejecuta Remotion en una copia local de `C:\Herramientas\_work\`, siguiendo el método ya documentado. Los fuentes permanecen en Drive; no instales dependencias en `G:`.
4. Si necesitas un efecto, consulta [el índice de sonidos para IA](01_Proyectos/Recursos%20videos/Efectos%20sonido/INDICES_IA/00_LEEME.md) y su buscador. Usa el nombre exacto, la duración y la ruta del recurso. Copia solo los archivos elegidos a los assets del proyecto, normalmente `public/`, y referencia esos assets con las APIs de Remotion; no pases una ruta de disco `G:` directamente al navegador.
5. Sincroniza los cortes y los efectos con los fps del proyecto. Revisa el resultado en Studio y comprueba los fotogramas relevantes cuando haya cambios de composición. Exporta el MP4 cuando el encargo lo pida y revisa su imagen y audio.

### Compatibilidad de versiones

Las skills descargadas llevan la versión **4.0.537**. El `package.json` del editor compartido `C:\Herramientas\Videos Workspace launcher\video-editor` declara **4.0.448**. Antes de usar componentes o propiedades nuevos, comprueba la versión instalada y su API. La instalación de estas instrucciones no modifica dependencias, lockfiles ni vídeos existentes. La skill `remotion-upgrade` explica el procedimiento si un trabajo requiere una actualización.

### Cómo invocarlas

Abre `Videos_Rapidos` como carpeta de trabajo para que Codex descubra `.agents/skills/`. Estarán disponibles en el siguiente turno de una sesión que tenga esa carpeta como raíz. Desde una conversación situada en otra ubicación, indica la ruta de `AGENTS.md` o de este documento para que el agente lea las guías locales. Si la lista no se refresca, vuelve a abrir la sesión.

Ejemplo de encargo:

> Usa `$remotion-best-practices` y la ficha de VR00X para mejorar sus cortes, textos y mezcla. Busca los efectos en el catálogo local. Conserva los brutos y entrega el proyecto editable; exporta una revisión MP4.

Las referencias oficiales conservan su idioma original. Esta guía conecta esas instrucciones con el flujo local y los recursos compartidos.

## Procedencia y mantenimiento

- [Documentación oficial de Agent Skills](https://www.remotion.dev/docs/ai/skills).
- Repositorio: `remotion-dev/skills`.
- Commit descargado: `039e8a2fc78b67efc228d5645367838b85818a1c`.
- Consulta: 20 de octubre de 2026.
- Las 12 carpetas oficiales se conservan sin modificar. La adaptación al proyecto está en este documento y en `AGENTS.md`.
- Para sustituir la colección en el futuro, revisa primero el origen y la versión y conserva cualquier cambio local del usuario. La procedencia de esta entrega está en `.agents/remotion-skills-source.json`.

La [documentación de skills de Codex](https://learn.chatgpt.com/docs/build-skills) explica el descubrimiento de `.agents/skills/` y la invocación explícita o automática.

## Skills creativas que complementan Remotion

La investigación de El Telar está integrada en [estilos y herramientas IA](10_ESTILOS_Y_HERRAMIENTAS_IA.md). La entrada [video-estilos-creativos](.agents/skills/video-estilos-creativos/SKILL.md) selecciona cámara, collage, personaje o tratamiento de cine. Se puede aplicar a Remotion sin migrar el editor. HyperFrames es una ruta opcional cuando se elige ese motor; sus instrucciones originales están archivadas como referencias, no como runtime instalado.
