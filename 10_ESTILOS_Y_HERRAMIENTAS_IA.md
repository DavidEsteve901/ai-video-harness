---
title: Estilos y herramientas IA para mejorar los vídeos
status: active
created: 2026-10-21
tags: [project/workspace-launcher, video, edicion, skills, claude]
---

# Estilos y herramientas IA para tus vídeos

> [!info] Preparado para retomar con Claude
> Lee `CLAUDE.md`, la ficha del vídeo y la skill [video-estilos-creativos](.agents/skills/video-estilos-creativos/SKILL.md). Aquí se conecta la investigación de [El Telar](https://eltelar.es/articulos/video-ia-herramientas.html#estilos-video) con el método de producción de esta carpeta. Consulta: **21 de octubre de 2026**.

## Qué está preparado

- **Seis skills propias**, con instrucciones específicas para el proyecto, en `.agents/skills/`; Claude Code tiene entradas equivalentes en `.claude/skills/` que remiten al mismo contenido.
- Documentación original de HyperFrames, Collage B-roll, Claude Animation Base, Lemo-Opuscar y YouTube Agent Skill, con licencias, commits y hashes en [la biblioteca](Biblioteca_Estilos_IA/00_INDICE.md). Los originales son referencias; las skills locales adaptan el flujo a tus vídeos.
- Un [mapa de todo el artículo](Biblioteca_Estilos_IA/01_MAPA_ARTICULO.md), [recetas por estilo](Biblioteca_Estilos_IA/02_RECETAS_ESTILOS.md), [recortes y subtítulos](Biblioteca_Estilos_IA/03_RECORTES_Y_SUBTITULOS.md), [herramientas y requisitos](Biblioteca_Estilos_IA/04_HERRAMIENTAS_Y_REQUISITOS.md) y [encargos listos para Claude](Biblioteca_Estilos_IA/05_ENCARGOS_CLAUDE.md).
- [Aplicación a VR009 y VR010](Biblioteca_Estilos_IA/06_APLICACION_VR009_VR010.md), basada en sus fichas, como propuesta de edición. No se han cambiado sus proyectos ni exportaciones.

**Instalado como conocimiento:** skills y referencias. **No instalado ni probado aquí:** motores nuevos, plugins globales, modelos, servicios o APIs. Remotion y Local Voice Studio siguen siendo el flujo principal descrito en las guías existentes. Guardar una skill no demuestra que su motor esté operativo.

## Qué elegir para mejorar una escena

| Lo que quieres mejorar | Skill local | Resultado que puede preparar |
|---|---|---|
| No sabes qué estilo conviene | [video-estilos-creativos](.agents/skills/video-estilos-creativos/SKILL.md) | Diagnóstico breve y tratamiento ligado al problema de esa escena |
| Títulos, gráficos y motion en HTML | [video-hyperframes-wl](.agents/skills/video-hyperframes-wl/SKILL.md) | Composición HyperFrames si se elige ese motor; alternativa Remotion para el editor actual |
| Cámara que sigue la acción y transiciones continuas | [video-camara-continua](.agents/skills/video-camara-continua/SKILL.md) | Movimiento editable en Remotion sobre grabaciones reales |
| Metáfora visual con recortes de papel | [video-collage-papel](.agents/skills/video-collage-papel/SKILL.md) | Capas animadas en Remotion; ruta generativa externa documentada como opcional |
| Personaje dibujado y pequeñas reacciones | [video-animacion-pintada](.agents/skills/video-animacion-pintada/SKILL.md) | Guion de acción, poses, animación y ruta de render p5.js |
| Una estética de cine concreta | [video-estilos-cine](.agents/skills/video-estilos-cine/SKILL.md) | Selección entre los 51 estilos de Lemo y adaptación visual al encargo |
| Sacar Shorts de un tutorial largo | [Planificación existente](.agents/skills/video-planificacion-retencion/SKILL.md) + [recortes](Biblioteca_Estilos_IA/03_RECORTES_Y_SUBTITULOS.md) | Selección de momentos, lista de cortes, cámara vertical y captions |

## Criterio del proyecto

El estilo resuelve una necesidad: entender la acción, enfatizar el chiste, leer una pantalla o representar una idea. No introducir cinco estilos en un vídeo solo porque estén disponibles. La función real de Workspace Launcher se demuestra con sus grabaciones; un esquema animado se reconoce como explicación. Conserva brutos, voz elegida, remate y tiempos ajenos al cambio solicitado. Consulta las guías de voz y sonido existentes.

**onetake:** la referencia original tiene licencia PolyForm Noncommercial. El contenido promocional de Workspace Launcher no debe dar por supuesto ese permiso. La skill propia de cámara usa técnicas generales implementadas en Remotion y no copia el código, presets ni herramientas de onetake. El original queda enlazado para evaluar una autorización si alguna vez se pide usarlo.

## Información que hay que refrescar

Google anuncia que los endpoints **Veo 3.1 Preview se apagarán el 22 de octubre de 2026** y remite a Gemini Omni Flash o a modelos GA de su plataforma empresarial. No comenzar una integración nueva con esos endpoints. [Aviso oficial](https://ai.google.dev/gemini-api/docs/veo).

Los scripts originales de Collage B-roll mencionan `gemini-omni-flash-preview`; la documentación actual muestra `gemini-omni-1.1-flash`. No basta cambiar ese nombre: comprobar compatibilidad del SDK y de la petición antes de ejecutarlos. Google también limita la edición y extensión de vídeos subidos desde el EEE, incluida España; no ofrecer esa ruta para nuestras grabaciones sin verificar disponibilidad. [Documentación oficial](https://ai.google.dev/gemini-api/docs/omni).

Precios, planes, duración y licencias de recursos deben comprobarse cuando se vaya a utilizar una herramienta. Las puntuaciones de gancho de una skill no prueban que un vídeo vaya a funcionar. No se han hecho llamadas de generación de pago.

## Cómo retomar

Abre esta carpeta en Claude Code y escribe, por ejemplo:

> Lee CLAUDE.md y la ficha de VR010. Usa las skills locales para mejorar la legibilidad y continuidad de cámara de la V2, conservando su voz original. Trabaja sobre una nueva revisión editable con Remotion y exporta un MP4 para revisar. Evita servicios de pago.

En otro chat sin acceso a esta carpeta, adjunta `CLAUDE.md`, esta guía y la ficha del vídeo; la memoria no se comparte automáticamente entre aplicaciones. Más ejemplos en [encargos para Claude](Biblioteca_Estilos_IA/05_ENCARGOS_CLAUDE.md).
