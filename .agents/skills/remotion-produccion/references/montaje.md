# Montar con material del usuario

## Leer los medios antes de cortar

El nombre orienta, pero no demuestra qué aparece en un vídeo. Comprueba duración, resolución, orientación, fps y pistas. Revisa fotogramas del tramo relevante antes de prometer un encuadre. Si el usuario señala una frase, localízala mediante escucha o transcripción disponible; si solo especifica tiempos, trabaja con esos tiempos.

El helper de inventario produce rutas y metadatos; no describe escenas ni transcribe sonido. Si detecta un error, conserva el registro y resuelve ese archivo antes de usarlo.

## Una lista de decisiones de edición suficiente

Para cada escena guarda los datos que realmente cambien el montaje:

| Dato | Qué representa |
| --- | --- |
| Inicio y duración | Posición y longitud en la pieza final |
| Recurso y entrada de origen | Archivo elegido y punto desde el que se usa |
| Velocidad y audio original | Cómo se retima y qué sonido se conserva |
| Encuadre | Contain, cover, recorte o reencuadre de la acción |
| Texto y gráficos | Contenido y periodo de aparición |
| Sonido añadido | Archivo, entrada, duración y volumen |

No hace falta crear una capa de configuración nueva si el proyecto ya tiene una editable. Conserva la precisión en fotogramas y convierte segundos usando los fps de la composición. Si cambias la velocidad de un clip, recalcula su duración de salida y ajusta sus capas sincronizadas.

## Cortes y continuidad

- Usa cortes directos cuando una transición no aporte información. Para solapes, calcula la duración total considerando el solape y revisa ambos lados del corte.
- Un plano de recurso que cubra a una persona hablando no debe eliminar accidentalmente su voz.
- Reencuadra el contenido importante en lugar de aplicar el mismo recorte centrado a todo. En capturas de software, conserva visibles el cursor, la acción y las zonas que prueban lo que se explica.
- Los subtítulos deben seguir al audio y mantenerse legibles; no los fabriques a partir de un título de archivo.
- El ritmo viene del mensaje, la acción y el sonido. No impongas cortes rápidos a todos los estilos.

## Referencias técnicas instaladas

- [Timeline de clips](../../remotion-markup/video-editing.md).
- [Secuencias](../../remotion-markup/sequencing.md).
- [Tiempos y recortes](../../remotion-markup/timing-props.md).
- [Vídeo: velocidad, audio y encaje](../../remotion-markup/embedding-videos.md).
- [Audio](../../remotion-markup/audio.md).
- [Transiciones](../../remotion-markup/transitions.md).
- [Subtítulos](../../remotion-captions/SKILL.md).

Las referencias oficiales pueden mostrar APIs posteriores a las del proyecto. Comprueba su versión antes de trasladar un ejemplo literalmente.
