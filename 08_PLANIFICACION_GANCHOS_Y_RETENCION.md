---
title: Planificación de vídeos — ganchos, formatos y retención
status: active
created: 2026-10-20
tags: [project/workspace-launcher, video, planificacion, ganchos, retencion, youtube, tiktok, reels, ia]
---

# Planificar antes de grabar, crear recursos o editar

Esta biblioteca parte de **ocho skills de la comunidad**, conservadas con sus referencias y licencias, y las combina con documentación primaria y estudios. La entrada para la IA es [video-planificacion-retencion](.agents/skills/video-planificacion-retencion/SKILL.md).

No hace falta empezar de cero ni cargar toda la biblioteca en cada conversación. La skill orienta la lectura según se pidan ideas, aperturas, un guion, recursos de rodaje, adaptación de formato o análisis de resultados.

## Por dónde empezar

| Necesito… | Documento |
| --- | --- |
| Definir cómo queremos nuestros vídeos | [Perfil editorial editable](Biblioteca_Planificacion/PERFIL_EDITORIAL.md) |
| Ver qué skills creó otra gente y de dónde salen | [Ocho skills reutilizadas, autores y licencias](Biblioteca_Planificacion/SKILLS_COMUNIDAD.md) |
| Decidir estructura para Reels, TikTok, Shorts o YouTube largo | [Formatos y adaptación](.agents/skills/video-planificacion-retencion/references/formatos.md) |
| Encontrar distintos tipos de apertura | [Ganchos: capas, mecanismos y ejemplos](.agents/skills/video-planificacion-retencion/references/ganchos.md) |
| Dar forma al cuerpo, los capítulos y el montaje | [Estructura, ritmo y recursos](.agents/skills/video-planificacion-retencion/references/estructura.md) |
| Entender qué dicen las métricas y qué probar después | [Medición e hipótesis](.agents/skills/video-planificacion-retencion/references/medicion.md) |
| Comprobar respaldo y límites de las recomendaciones | [Fuentes primarias y estudios](.agents/skills/video-planificacion-retencion/references/fuentes.md) |
| Pasar una idea a un documento de producción | [Plantilla de plan](Biblioteca_Planificacion/Plantillas/PLAN_VIDEO.md) |
| Preparar una prueba, registrar resultados o agrupar grabaciones | [Plantilla de aprendizaje](Biblioteca_Planificacion/Plantillas/RESULTADOS_Y_PRUEBAS.md) |
| Ver un ejemplo cercano a nuestros archivos | [Plan de ejemplo: palmadas](Biblioteca_Planificacion/EJEMPLO_PALMADAS.md) |
| Empezar el montaje cuando ya sabemos qué queremos | [Remotion: recursos y encargos](07_RECURSOS_REMOTION_Y_ENCARGOS.md) |

## Qué se ha reutilizado

- **Storytelling Skills, de yaxeen:** ganchos, guion de YouTube largo, pareja título-miniatura, auditoría de retención y aprendizaje del canal.
- **YouTube Scriptwriting, de cdeistopened/skill-stack:** investigación, estructuras y revisión de guiones.
- **TikTok Skills, de sergebulaev:** apertura en capas, fórmulas y planificación por lotes.

Los tres repositorios declaran licencia MIT, conservada en la biblioteca. Los originales están en `Biblioteca_Planificacion/Fuentes_Comunidad/`, y se consultan como referencias. La adaptación local está en la skill activa y en el perfil; así podemos cambiar nuestro estilo sin perder el material de origen.

## Qué debería devolver la IA al planificar

Un concepto claro para un público y un objetivo; aperturas apropiadas al formato; una recomendación explicada; estructura y tiempos estimados; texto o guion; plan de imágenes, grabaciones, animaciones y sonido; y qué material falta realmente. Para YouTube largo, también título, miniatura y capítulos. Si ya existe una pieza, debe conservar lo que no se haya pedido cambiar.

La revisión posterior usa los datos que haya. Sin analíticas puede valorar claridad y montaje, pero no inventar una curva de retención ni afirmar que una variante se hará viral. Las recomendaciones de plataformas, los estudios y las recetas de creadores están identificados por separado.

## Cómo encargarlo

> Usa `$video-planificacion-retencion`. Quiero un vídeo sobre **[idea]** para **[formato y público si lo sé]**. Busco **[resultado]**. Tengo estos recursos: **[carpeta, grabaciones o referencias]**. Propón el concepto, varios ganchos y la estructura; dime qué material falta y deja el plan preparado para editarlo con Remotion. Mantén **[cosas obligatorias]**.

También sirve una petición mucho más corta: «Con los recursos de Tony y la demo de palmadas, dame tres enfoques para un Reel» o «Ahora quiero explicarlo como tutorial largo; planifica lo que tendría que grabar».

## Qué podemos modificar nosotros

Edita primero [PERFIL_EDITORIAL.md](Biblioteca_Planificacion/PERFIL_EDITORIAL.md): audiencia, tono, referencias, intensidad de humor y efectos, objetivo y decisiones por serie. Añade aprendizajes con su fuente: preferencia del usuario, práctica de producción o dato medido.

El formato actual de vídeos rápidos es un punto de partida para esa serie. No obliga a que un vídeo de YouTube largo dure 20 segundos, use memes o tenga cambios visuales cada dos segundos.

## Alcance de esta entrega

Se instalaron instrucciones, referencias, plantillas y un ejemplo de plan. No se han publicado vídeos, conectado servicios comerciales ni modificado proyectos de edición. Los originales están fijados a commits concretos y documentados para poder actualizarlos o adaptarlos después.
