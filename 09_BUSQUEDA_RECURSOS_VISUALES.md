# Buscar imágenes, GIFs y vídeos para mis piezas

La skill [video-recursos-visuales](.agents/skills/video-recursos-visuales/SKILL.md) se encarga de buscar por internet, revisar y seleccionar material visual según la intención del vídeo. Complementa tus archivos y la biblioteca compartida. Elige por lo que aporta a cada escena: gesto, acción, humor, contexto, explicación o remate.

## Cómo se usará

Cuando pidas un vídeo y falte material visual, o convenga completar el que aportas, la IA puede buscarlo y decidir qué encaja. Revisa los candidatos, explica su elección y prepara los elegidos para el montaje cuando el encargo incluya producir o recopilar recursos. Si indicas **«solo mis archivos»**, se respeta esa limitación.

El flujo queda conectado: [ideas y referencias](00_Ideas/00_INDICE.md) → [planificación](08_PLANIFICACION_GANCHOS_Y_RETENCION.md) → búsqueda y selección visual → [producción con Remotion](07_RECURSOS_REMOTION_Y_ENCARGOS.md). Una búsqueda concreta también puede hacerse por separado.

## Ejemplos de encargo

- «Desarrolla IDEA-001. Busca una foto que haga funcionar el chiste de Tony con la flecha; aprovecha las que ya tenemos si encajan mejor. Dime por qué eliges esa».
- «Con esta demo, monta un Reel divertido. Busca reacciones o planos que ayuden al chiste y prepara los recursos que vayas a usar».
- «Para este tutorial serio, busca un plano donde se vea conectar el portátil al monitor. Necesito la acción, no una persona cualquiera con un ordenador».
- «Usa `$video-recursos-visuales` para buscar imágenes para estas escenas. Hoy quiero solo la selección con enlaces; el montaje vendrá después».
- «Edita únicamente con estos archivos, sin buscar recursos externos».

## Qué deja preparado

Una selección por escena, con contenido observado, motivo de elección, procedencia y estado de preparación. Cuando se trabaja en un proyecto, el registro va en `03_Recursos/SELECCION_VISUAL.md` y los medios elegidos en `03_Recursos/Visuales_Internet/`. Si solo estás explorando una idea, los enlaces y notas se guardan junto a esa idea.

Incluye [criterios y ejemplos](.agents/skills/video-recursos-visuales/references/seleccion.md), [fuentes de búsqueda](.agents/skills/video-recursos-visuales/references/fuentes.md) y una [plantilla de selección](.agents/skills/video-recursos-visuales/assets/SELECCION_VISUAL.md). Encontrar una URL, revisar su contenido y tener un archivo listo para editar son estados distintos; el registro los mantiene claros.

## Disponibilidad

Instalada en `.agents/skills/video-recursos-visuales/`, local a esta carpeta de vídeos, junto con las otras skills. El [AGENTS.md](AGENTS.md) la conecta con los encargos nuevos. Desde otra carpeta de trabajo, indica esta guía o la ruta del `SKILL.md` para que la IA la lea. Las herramientas web y los permisos disponibles en cada sesión determinan qué puede buscar, revisar y descargar.
