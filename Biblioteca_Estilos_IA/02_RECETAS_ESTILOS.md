# Recetas de estilo para Videos_Rapidos

Estas recetas son decisiones de producción propias. Los originales técnicos y sus licencias están en [el índice](00_INDICE.md). Una receta puede ejecutarse con el motor existente cuando resuelva el encargo; el estilo visual no obliga a migrar de framework.

## Cámara continua sobre una demo real

**Útil:** la acción está repartida por una grabación horizontal y el recorte vertical pierde contexto. **Evitar:** una cámara que persigue cada detalle sin descanso o un zoom que oculta el resultado.

1. Marca en el bruto los eventos que hay que entender: orden, clic, cierre, carga y resultado. Trabaja con tiempos medidos, no deducidos del nombre del archivo.
2. Define un estado de cámara por evento: centro en coordenadas normalizadas, escala y tiempo de reposo. Mantén margen para captions. Separa el contenedor de recorte del de transformación para evitar saltos.
3. Interpola entre estados de forma determinista con los frames de Remotion. El movimiento comienza para llevar la mirada a una acción, se asienta durante esa acción y abre el encuadre cuando importa el conjunto.
4. En una transición conserva una referencia visible —ventana, cursor real, borde o color— cuando ayude a entender el cambio. No impongas un plano secuencia si un corte cuenta mejor el chiste.
5. Verifica antes, durante y después del desplazamiento, incluido el momento de máxima escala. Ajusta velocidad para lectura y mareo, no para cumplir un intervalo universal.

**Entregable:** estados y tiempos editables, rangos de origen y revisión exportada si se pide. La técnica es general; no se reutilizan código, presets, oráculo ni textos de onetake.

## Collage de papel por capas

**Útil:** representar una frase abstracta como «cada mañana monto el mismo caos» sin añadir otra captura de escritorio. **Evitar:** sustituir la prueba real del producto por una metáfora.

Diseña una sola imagen comprensible con pocos recortes protagonistas: papel, flechas, herramientas genéricas y una textura discreta. Define un orden causal: los papeles se acumulan; un gesto los agrupa; aparece la demo real. Mantén el contenido importante dentro del área visible al publicar.

**Ruta local preferida:** capas separadas en Remotion (PNG, SVG o formas propias), sombras y desplazamientos que simulan recortes; textura creada con código o recursos permitidos. Conserva entradas, rotación, escala y orden de capas editables. No requiere generar un vídeo mediante una API. No necesita una imagen IA si las formas y el material existente bastan.

**Ruta original opcional:** [gbro-collage-broll](Fuentes_Comunidad/gbro-collage-broll/SKILL.md) genera una imagen y después vídeo externo. El flujo original exige confirmar metáfora y estática; además usa un servicio facturable y dependencias propias. Solo aplicarlo si se elige ese flujo y se cuenta con acceso y autorización adecuados. Revisar el modelo vigente antes de ejecutar sus scripts; las instrucciones descargadas pueden referirse a un endpoint antiguo. Claude no debe asumir que dispone del imagegen de Codex.

**Revisión:** metáfora entendible, contornos limpios, capas sin saltos, texto legible y ausencia de logos o cifras inventados. Si el montaje local ya estaba autorizado, una prueba de collage local no requiere adoptar los checkpoints del flujo generativo original.

## Motion limpio: HyperFrames o Remotion

**Útil:** titulares, contadores medidos, gráficos y tarjetas explicativas. Para el editor actual se puede construir la misma intención en Remotion. Elegir HyperFrames cuando el encargo pida HTML/GSAP, un proyecto suyo o su catálogo.

HyperFrames requiere Node 22+, FFmpeg y su entorno de render. Leer el [contrato mínimo](Fuentes_Comunidad/hyperframes/skills/hyperframes-core/references/minimal-composition.md) antes de escribir HTML. El tiempo debe poder buscarse y repetirse; medios, tracks y animación siguen el contrato del motor. Consultar [CLI](Fuentes_Comunidad/hyperframes/skills/hyperframes-cli/SKILL.md) para `init`, `check`, `preview` y `render`; comprobar el `--help` de la versión realmente instalada. No convertir los comandos `npx` en evidencia de instalación hasta que hayan concluido.

Una pieza puede tener entrada rápida, pausa para leer y salida enlazada a la demo. El número representa un dato medido; si no existe, usar una etiqueta o una comparación visual honesta. Los frames finales deben revisarse, no solo la validación estructural.

## Animación pintada con personaje

**Útil:** una reacción o remate original, sin recurrir siempre a clips de películas. **Proyecto de referencia:** Claude Animation Base, p5.js y p5.brush.

Antes de programar: intención del personaje, acción que se entiende sin narración, pose inicial, anticipación, acción y reacción final. Leer [ANIMATION_GUIDE](Fuentes_Comunidad/ClaudeAnimationBase/ANIMATION_GUIDE.md). Mantener silueta y proporciones; el movimiento de ojos, cuerpo y accesorios tiene que servir a esa acción. Una pose intercambiada cada segundo no basta para actuar.

El repositorio completo necesita Node, Chrome, FFmpeg y dependencias npm; aquí solo se ha archivado la documentación. Su README confirma `node render.mjs --clip --out=out/video.mp4`. Ejecutarlo desde una copia de trabajo local del proyecto completo, no desde esta carpeta documental. Revisar los fotogramas de acción y el clip completo; reducir rellenos complejos si el render no es viable en el equipo.

Para una superposición con transparencia, comprobar la salida real del render y su canal alfa. Un MP4 H.264 normal no es un recorte transparente. Si no hay salida alfa compatible, usar un plano completo o una secuencia con alfa y verificarla al integrar.

## Cine programado: elegir entre los 51 estilos

El [índice de Lemo](Fuentes_Comunidad/lemo-opuscar/styles/README.md) contiene **51 estilos**, incluidas ocho propuestas Evidence Films; OPUSCAR 98 es una colección distinta de ejemplos. Leer únicamente el `STYLE.md` elegido y las guías comunes necesarias. Para crear una película completa con sus herramientas hace falta obtener la biblioteca ejecutable; los documentos descargados no sustituyen su motor.

| Intención en nuestros vídeos | Familias que conviene explorar | Adaptación propia |
|---|---|---|
| Explicar una organización de ventanas | Blueprint, Isometric Infographic, Living Screencast | Esquema de reparto que conduce a una captura real |
| Humor sobre trabajo repetido | Silent Film, Rubber Hose Cartoon, Microgame | Microescena de reacción con remate claro |
| Explicación calmada | Whiteboard, One-line Drawing, Swiss Motion | Una idea que se construye y se lee |
| Ambiente de asistente futurista | Hologram HUD, ASCII/CRT, Dark Tech Keynote | Etiquetas y marcos decorativos sin atribuir funciones falsas |
| Imagen artesanal | Watercolor, Risograph, Halftone Dossier | Un tratamiento consistente para el plano de apoyo |

Elegir por función narrativa y material, no por prestigio del nombre. Para una escena de tutorial evita filtros que destruyan texto de interfaz. Registrar el estilo, el archivo consultado y los parámetros propios (paleta, trazo, textura, movimiento y audio). El código del repositorio es MIT; sus películas de ejemplo son CC BY 4.0 y los medios de terceros conservan sus condiciones, según su README. No copiar una película o música de demostración como si fuera un recurso sin atribución.
