# Herramientas, requisitos y estado real

Estado de esta entrega: **documentación y skills preparadas**, sin instalación de motores ni generación externa. Los requisitos siguientes proceden de README oficiales consultados; comprobar la versión elegida antes de instalar.

| Herramienta | Para qué | Requisitos / coste que comprobar | Estado y criterio local |
|---|---|---|---|
| Remotion | Montaje y animación precisos | Proyecto actual y APIs compatibles | Flujo existente; 4.0.448 declarada en la guía, comprobar instalación al ejecutar |
| HyperFrames | Vídeo desde HTML, CSS y animación | Node 22+, FFmpeg y su render; Apache-2.0 | Skills originales archivadas; CLI no instalado/probado aquí |
| onetake | Motion de producto | Licencia PolyForm Noncommercial y permisos para uso de negocio | Solo referencia; no activado ni copiado al paquete |
| Collage B-roll | Collage mediante imagen + modelo de vídeo | Python 3.10+, google-genai, FFmpeg/ffprobe, clave Google y facturación; imagen en otra herramienta si Claude no dispone de ella | Referencia original MIT; alternativa propia por capas en Remotion |
| Claude Animation Base | Personaje pintado con p5.js / p5.brush | Node, Chrome, FFmpeg, dependencias npm, recursos del proyecto completo | Guía descargada; motor no instalado aquí |
| Lemo-Opuscar | Películas de código y 51 estilos | Node, Python, FFmpeg y dependencias que indique el estilo; biblioteca completa al producir | Guías y estilos archivados; código MIT, ejemplos CC BY 4.0 según README |
| YouTube Agent Skill | Guion, cortes, título/miniatura y análisis | Python 3 estándar para seis ayudantes; datos reales para retención | Once módulos y ayudantes archivados; coordinados con planificación existente |
| SupoClip | Recortes y captions de material hablado | Docker y servicios/modelos según README; las APIs pueden costar | README AGPL-3.0, aplicación no instalada |
| Shotcut | Editor manual por pistas | Instalador oficial y proyecto con formato elegido | Alternativa cuando se pida edición manual; no sustituye el editor actual por defecto |
| HandBrake | Comprimir/convertir derivados | Ajuste de calidad, tamaño, fps y códec | Puede resolver una entrega pesada; no recomprimir el master cada vez |
| OBS Studio | Capturar demo/cámara/audio | Captura y niveles verificados con una toma corta | Guardar brutos originales; proteger datos personales en escena |
| Claude Motion | Animación desde el chat de Claude | Beta de Team/Enterprise; disponibilidad real en su cuenta | No es un plugin ni una función habilitada por estos archivos |
| VoiceStudio (debpalash) | Aplicación de voz/doblaje | Hardware, modelos, licencias y descargas propios; AGPL-3.0 | Proyecto distinto de `C:\Herramientas\local-voice-studio`; no cambiar el sistema de voces actual |
| Veo / Omni / Runway / Kling | Generar material adicional | Modelo vigente, región, duración, precio, claves y permiso de gasto | Opcionales; no necesarios para mejorar la edición local |

## Al ejecutar en Windows

1. Reutilizar `04_Edicion` y la copia de trabajo local, sin `node_modules` en Drive. Los comandos bash del artículo y de algunos originales no se pegan directamente en PowerShell.
2. Comprobar herramientas con `Get-Command node, ffmpeg, ffprobe` y `node --version`. Buscar una instalación Python real: en este equipo `python`/`py` visibles no garantizan un intérprete instalado; las comprobaciones de esta entrega usaron el runtime Python de Codex. Claude debe localizar uno disponible en su sesión, sin depender de una ruta efímera de Codex.
3. Revisar scripts y `package.json` antes de ejecutar instalaciones. Las referencias guardadas no autorizan actualizar Remotion, cambiar motor, crear cuentas ni activar servicios de pago.
4. Si se necesita el motor de un repositorio, obtener una copia de la versión elegida bajo `C:\Herramientas\_work\` y registrar versión, comando y prueba. No ejecutar desde el archivo documental parcial como si fuera un checkout completo.
5. Probar una escena corta. Después verificar duración, fps, resolución, imagen decodificada y audio del resultado. Un exit code correcto no demuestra que el movimiento tenga sentido.

## Datos de salida que conviene conservar

Fuente original, autor/condiciones cuando aplique, commit o versión del motor, archivos de escena, recursos empleados, tiempos medidos, parámetros y ruta de exportación. Para generación facturable añadir modelo, resolución, segundos e intentos autorizados; evitar claves o secretos en documentos y prompts.

Las condiciones de cada herramienta no resuelven las licencias de música, tipografías, imágenes o personajes incorporados. Usar el catálogo local y las reglas de voz ya establecidas; no introducir clonación de voces reales por seguir ejemplos de otra aplicación.
