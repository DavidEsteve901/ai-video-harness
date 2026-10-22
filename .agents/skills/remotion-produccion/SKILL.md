---
name: remotion-produccion
description: Montar vídeos con clips, imágenes, voz, música y efectos aportados, disponibles o seleccionados para el encargo, y crear animaciones o piezas mixtas en Remotion dentro de Videos_Rapidos.
---

# Producción de vídeo con recursos y animación

Interpreta el encargo como una pieza audiovisual editable: el usuario explica qué quiere conseguir y puede aportar recursos. Combina su material con la biblioteca y, cuando ayude al encargo, recursos visuales de internet seleccionados con criterio. Lee la ficha del vídeo y las convenciones de `Videos_Rapidos` antes de elegir formato o estilo. Mantén las instrucciones oficiales de Remotion como referencia técnica, empezando por [remotion-best-practices](../remotion-best-practices/SKILL.md).

## Elegir el modo de trabajo

Si el encargo requiere definir concepto, gancho, guion o recursos antes del montaje, consulta [video-planificacion-retencion](../video-planificacion-retencion/SKILL.md) y el perfil editorial del proyecto. Si el usuario ya trae un plan o pide un retoque preciso, conserva esas decisiones y procede con la edición.

- **Montaje con recursos:** vídeo grabado, capturas, fotos, narración, música o una secuencia de clips. Lee [montaje.md](references/montaje.md).
- **Animación:** escenas creadas con texto, formas, logos, datos, ilustraciones o movimiento de interfaz. Lee [animacion.md](references/animacion.md).
- **Mixto:** conserva los clips reales como base y anima lo que ayude a explicarlos. Combina las referencias pertinentes.

Si falta una imagen, reacción o plano, o conviene completar una escena, usa [video-recursos-visuales](../video-recursos-visuales/SKILL.md). Conserva el material elegido por el usuario y respeta «solo mis archivos» o «sin internet». Cuando se pida producir, la búsqueda puede continuar hasta preparar los seleccionados y sus rutas para el montaje; no exige que el usuario consiga cada recurso.

No conviertas un encargo de edición en la construcción de una aplicación de edición. Usa el proyecto existente cuando lo haya.

## Pasar del encargo al montaje

1. Identifica el mensaje, el material que el usuario señala y los cambios pedidos. Reutiliza el formato de la pieza existente; para una pieza nueva aplica los valores locales solo si el encargo no define otros. Pregunta únicamente por decisiones que afecten materialmente al resultado y no puedan inferirse.
2. Inspecciona los recursos: metadatos para duración y dimensiones; fotogramas o contact sheets para el contenido visual. Una transcripción es necesaria si la edición depende de palabras concretas. No afirmes haber escuchado una pista si solo has leído sus metadatos o su nombre.
3. Para una carpeta de medios puedes ejecutar [inventariar-medios.mjs](scripts/inventariar-medios.mjs), que requiere Node y `ffprobe` en PATH. Ejemplo: `node <ruta-script> <carpeta-recursos> --out <ruta-inventario.json>`. Escribe solo el JSON solicitado y conserva los medios originales.
4. Organiza las escenas con inicio, duración, recurso y tramo de origen, texto, tratamiento visual y sonido. Para retoques pequeños basta con actualizar el montaje existente. Si el usuario ya autorizó producir, avanza con decisiones razonables y déjalas editables; el esquema no exige una aprobación adicional.
5. Consulta la [selección de recursos de Remotion](../../../07_RECURSOS_REMOTION_Y_ENCARGOS.md) cuando necesites componentes o ejemplos concretos. Reutiliza primero lo que ya tenga el proyecto. Comprueba compatibilidad con su versión antes de adoptar APIs o dependencias nuevas.
6. Trabaja con dependencias y render local, según la guía del proyecto; conserva los fuentes en Drive. Copia a `public/` únicamente los recursos usados y referencia esas copias servidas por Remotion. Mantén el vínculo con la ruta de origen para poder cambiarlos después.
7. Abre Studio y verifica la pieza. Si se pide un MP4, exporta y revisa además el archivo exportado. Entrega el proyecto editable y señala las suposiciones relevantes o el material que falte.

## Dirección vocal contextual

Cuando haya voz, usa [voces-locucion](../voces-locucion/SKILL.md). Fija una identidad y referencia por personaje; decide emoción, intención e intensidad frase a frase según lo que cuenta y muestra el vídeo. Con varias voces, cada personaje mantiene la suya. Conserva el plan vocal y sus tomas en el proyecto; una etiqueta emocional o un filtro no equivalen a una interpretación revisada. No cambiar de voz para cambiar de estado.

## Elegir y sincronizar sonido

La biblioteca compartida empieza en `01_Proyectos/Recursos videos/Efectos sonido/INDICES_IA/00_LEEME.md`, relativa a `Videos_Rapidos`. Busca por familia y consulta el índice de esa categoría o `catalogo.json`. La descripción del catálogo deriva de nombres y carpetas; la duración está medida. Elige un archivo existente y comprueba el fragmento cuando su contenido exacto importe.

Relaciona cada efecto con un evento concreto: corte, entrada de texto, clic, énfasis o aparición de un elemento. Mantén voz, música y efectos en capas independientes y evita que una cola sonora quede cortada por el final de una escena. Conserva la música o el audio de origen que el usuario pida mantener.

## Qué debe quedar fácil de retocar

- Texto, recursos, encuadre, tiempos, velocidad y volumen de cada escena o clip.
- Capas que el usuario deba mover por separado, siguiendo las prácticas de interactividad compatibles con su versión.
- Cambios locales: un retoque de una frase o un corte no debe rehacer el resto de la pieza.

Para revisión, comprueba el inicio, los cortes modificados, las entradas y salidas de texto, la legibilidad al tamaño de destino y el cierre. Escucha la mezcla si dispones de una herramienta que permita hacerlo; las mediciones de nivel y silencio complementan esa escucha y no la sustituyen.
