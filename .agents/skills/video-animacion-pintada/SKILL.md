---
name: video-animacion-pintada
description: Preparar y producir personajes o reacciones dibujadas para Videos_Rapidos usando animación editable o Claude Animation Base con p5.js y p5.brush. Usar para un plano pintado o un personaje original; no aplica a clonar voces reales ni a cambiar una demo por ficción.
---

# Personaje pintado y actuación

Lee la ficha, [la receta](../../../Biblioteca_Estilos_IA/02_RECETAS_ESTILOS.md) y, si se usa el kit, [ANIMATION_GUIDE](../../../Biblioteca_Estilos_IA/Fuentes_Comunidad/ClaudeAnimationBase/ANIMATION_GUIDE.md). El personaje resuelve un momento narrativo: intención, anticipación, acción y reacción. Define la silueta y poses clave antes de programar.

Reutiliza el personaje y recursos elegidos por el usuario o crea uno propio. Mantén proporciones y dirección de mirada; el movimiento sirve al chiste. No añadir voz si el gesto basta. Si hay diálogo, usar [voces-locucion](../voces-locucion/SKILL.md) y conservar identidad por personaje.

Para formas y una reacción sencilla puede bastar Remotion. Para el aspecto de p5.brush, el [README](../../../Biblioteca_Estilos_IA/Fuentes_Comunidad/ClaudeAnimationBase/README.md) explica el proyecto completo, Node, Chrome, FFmpeg y sus dependencias. Aquí se ha guardado la documentación: obtener el checkout elegido en una carpeta local antes de ejecutar `render.mjs`. La carpeta de referencias no contiene un motor operativo.

Trabaja plano por plano y revisa poses/contact sheets más el movimiento. Ajusta complejidad del pincel al equipo; los rellenos de acuarela pueden ser lentos. No prometas render rápido sin medir una prueba. Verifica transparencia si se necesita superposición: un MP4 H.264 normal no lleva alfa.

Guarda storyboard, fuentes y parámetros en la edición del vídeo. Integra los derivados con [remotion-produccion](../remotion-produccion/SKILL.md) y revisa entrada, remate y sonido. Distingue un ejemplo original de una animación propia producida: no dar por reutilizables todos los medios de una demo por la licencia del código.
