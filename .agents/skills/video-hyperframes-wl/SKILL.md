---
name: video-hyperframes-wl
description: Crear o revisar una pieza HyperFrames para Videos_Rapidos cuando el usuario elija HTML, CSS, GSAP o ese motor. Conecta sus skills oficiales con los recursos locales; no migra por defecto los montajes Remotion.
---

# HyperFrames en este proyecto

Lee el encargo y [requisitos](../../../Biblioteca_Estilos_IA/04_HERRAMIENTAS_Y_REQUISITOS.md). Si se trata de mejorar un montaje Remotion, conserva ese proyecto salvo que se pida HyperFrames o se decida justificadamente una pieza independiente. No conviertas el router externo, que favorece su propio motor, en una orden de migrar.

Para trabajar realmente en HyperFrames consulta los originales descargados: [entrada](../../../Biblioteca_Estilos_IA/Fuentes_Comunidad/hyperframes/skills/hyperframes/SKILL.md), [contrato HTML](../../../Biblioteca_Estilos_IA/Fuentes_Comunidad/hyperframes/skills/hyperframes-core/SKILL.md) y [CLI](../../../Biblioteca_Estilos_IA/Fuentes_Comunidad/hyperframes/skills/hyperframes-cli/SKILL.md). Carga keyframes, audio, captions o recursos solo según la operación. Se conservan como referencias, no como runtime instalado.

Comprueba Node 22+, FFmpeg y CLI/version del proyecto. Para un motor nuevo usa una carpeta de trabajo local en C:, conserva fuentes y resultados del vídeo en su estructura de Drive y consulta el `--help` real antes de usar comandos del README. No instalar dependencias en G:.

Construye una composición válida, con tiempos deterministas, animación que pueda buscarse y medios administrados por el motor. No mezclar contratos de Remotion con atributos HTML de HyperFrames. Mantén texto, paleta, recursos y duraciones editables. Las cifras animadas se sustentan en datos medidos.

Valida con las herramientas de la versión elegida, revisa fotogramas y previsualización y exporta si se ha pedido. Un encargo de producir/exportar ya autoriza ese render local; no importar un checkpoint adicional solo por un ejemplo externo. Verifica también el archivo exportado. Las voces siguen [voces-locucion](../voces-locucion/SKILL.md); no activar TTS externo por defecto.
