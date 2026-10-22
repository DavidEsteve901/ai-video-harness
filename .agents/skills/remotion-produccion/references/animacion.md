# Crear animación o combinarla con vídeo

## Dar intención al movimiento

Define qué debe mirar el espectador y qué cambia en cada escena. Anima para dirigir la atención, mostrar una relación o revelar información. Una escena breve puede necesitar solo una entrada, una permanencia legible y una salida; los tiempos dependen del contenido y del estilo solicitado.

Mantén una familia coherente de tipografía, colores, márgenes y curvas de movimiento. Los valores de una referencia son puntos de partida, no requisitos para todos los vídeos. Adapta el diseño al encuadre final y comprueba el texto con la tipografía real cargada.

## Elegir la técnica más útil

| Encargo | Técnica a considerar |
| --- | --- |
| Título, cifras, rótulos o subtítulos | Texto y formas con animación por fotograma |
| Explicación de una captura o grabación | Reencuadre, máscara, flecha, resaltado y zoom sobre el recurso real |
| Intro o cierre de marca | Logo aportado y coreografía breve de texto y formas |
| Gráfico o dato | Gráfico que conserve escalas, unidades y cifras del usuario |
| Ilustración vectorial o animación ya creada | SVG, Lottie o Rive según el archivo disponible |
| Pieza con perspectiva o modelo 3D | React Three Fiber solo si la escena lo justifica |
| Animación que irá encima de otro montaje | Overlay con transparencia y exportación compatible con el editor receptor |

Las animaciones deben depender de los fotogramas de Remotion; no uses temporizadores o animaciones CSS autónomas para controlar el tiempo de la composición. Para variaciones aleatorias que deban repetirse al renderizar, usa una semilla estable.

## Reutilizar componentes de la comunidad

Consulta la selección del proyecto si necesitas una solución ya hecha. Elige el componente concreto por su movimiento y editabilidad; no importes una plantilla completa para resolver un solo título. Un marco de dispositivo o una interfaz de demostración puede decorar una captura, pero no sustituye una función real del producto.

Cuando la versión instalada no tenga la API usada por un ejemplo, adapta el componente o evalúa si actualizar es necesario para el encargo. Conserva el proyecto editable y las versiones coherentes.

## Referencias técnicas instaladas

- [Guía de composición visual](../../remotion-create/video-layout.md).
- [Texto y ajuste al espacio](../../remotion-markup/measuring-text.md).
- [Animación y timing](../../remotion-markup/timing.md).
- [Resaltados, flechas y anotaciones](../../remotion-markup/text-highlights.md).
- [Fuentes locales](../../remotion-markup/local-fonts.md).
- [Lottie](../../remotion-markup/lottie.md).
- [3D](../../remotion-markup/3d.md).
- [Interactividad](../../remotion-interactivity/SKILL.md).
- [Vídeo transparente](../../remotion-render/transparent-videos.md).
