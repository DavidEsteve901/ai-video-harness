---
id: FMT-003
title: "Explicador conceptual animado"
estado: "Candidato"
preferencia_editorial: "Confirmada por el usuario"
created: 2026-10-21
video_origen: "Sin producción; dirección conceptual de IDEA-041 e IDEA-042"
---

# Explicador conceptual animado

## Qué ha confirmado el usuario

El 21-10-2026 expresó que le gusta el concepto animado y pidió explicar visualmente **la posibilidad, la relación entre elementos y lo que resuelve**, sin recrear una interfaz o intentar plasmar una operación real. Cuando quiera demostrar la realidad, grabará su pantalla. Esta preferencia se aplica a la serie explicativa conceptual; no cambia el tratamiento de tutoriales o demos.

**Estado:** dirección editorial confirmada. La receta técnica sigue **candidata**: no hay un vídeo final producido/revisado ni herramientas/versiones acreditadas por una producción. No confundir que le guste la orientación con una aprobación de una voz, un render o el rendimiento.

## Receta narrativa

Una promesa y una función/concepto por pieza. Gancho comprensible → relación visual → intención del usuario → transformación/acción → beneficio → pregunta o cierre pertinente. Las metáforas se eligen por concepto; no repetir siempre la misma estructura si no ayuda.

Las relaciones importantes pueden representarse como persona, herramienta, caja, conector, datos, mecanismo y resultado. Conservar identidad visual y mostrar causa/consecuencia. Iconos reales ayudan al reconocimiento cuando importan las marcas; las formas propias explican procesos sin depender de una pantalla.

## Lenguaje visual

Dibujo, esquemas, iconos y movimiento expresivo con poco texto y reposos. El usuario pide calidad y claridad, no un diagrama inmóvil lleno de flechas. Evitar reconstrucciones de UI, secuencias de clics, mensajes de éxito simulados y pantallas inventadas. Una metáfora puede ser libre siempre que la función que comunica sea verdadera.

La animación no necesita incorporar grabaciones para ser válida. Si el brief pide demostración real, esa pieza o segmento usa recursos reales revisados. No mezclar idiomas visuales sin una razón del encargo.

## Casos iniciales

- [IDEA-041](../00_Ideas/Conceptos/IDEA-041_tu-agente-prepara-tu-entorno.md): el agente elegido se conecta y puede actuar en Workspace Launcher.
- [IDEA-042](../00_Ideas/Conceptos/IDEA-042_tus-proyectos-desde-el-omnibar.md): los proyectos externos aportan lógica y Omnibar da acceso a sus acciones; el agente ayuda a preparar la conexión.

## Herramientas y parámetros

Skills de planificación, estilos, voces y producción disponibles para que Claude elija las necesarias. Remotion es una opción del flujo existente, no un dato de producción de este formato. Aquí no se han generado medios ni elegido una nueva herramienta obligatoria.

Variables: concepto, metáfora, marcas, ejemplo, duración, voz, paleta y composición por orientación. Conservar una sola promesa, roles claros y distinción entre explicación y prueba real.

## Qué registrar cuando se produzca

Vídeo/versión y fuentes, herramientas y versiones realmente usadas, recursos por escena, identidad de voz, tiempos medidos, parámetros y correcciones. Si el usuario aprueba una versión, registrar qué le gustó y la fecha; entonces completar la receta con evidencia del proyecto. Las métricas se añaden solo si existen.

## Primera producción: VR011 (2026-10-21)

[VR011](../01_Proyectos/VR011_Conecta_Tu_Agente/00_FICHA_VIDEO.md) aplica la receta en estilo **cuaderno dibujado**. Indicación del usuario ese día: usar las skills y todos los recursos disponibles, mantener el estilo de dibujo y explicar el **potencial** del concepto con **algunos ejemplos**, no solo la relación entre elementos. Estado: producido, **sin revisión del usuario**; no aprobado.

- Herramientas realmente usadas: Remotion 4.0.448 (un único SVG por composición), filtro SVG `feTurbulence` + `feDisplacementMap` con semilla que cambia cada 4 fotogramas (trazo vivo), trazos que se dibujan con `pathLength`, `@remotion/media` para audio; Local Voice Studio (CosyVoice 3, voz `tutorial_el`), Whisper para validar palabras, ffmpeg (normalización).
- Estructura que funcionó para añadir ejemplos: gancho de posibilidad → conexión (una vez) → intención en lenguaje natural → 3 ejemplos de acción de duración breve, cada uno con su dibujo-símbolo → control del usuario → pregunta final.
- Parámetros editables: `edit.config.json` (tiempos por escena, agente mostrado, subtítulos). Lección de voz: las intenciones de dirección largas se pronuncian; usar 1–2 palabras.
- Pendiente: que el usuario lo vea y diga qué le gustó antes de pasar a «Aprobado».