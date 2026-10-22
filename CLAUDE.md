# Contexto de edición para Claude



Este repositorio es **AI Video Harness**: el arnés de producción de vídeos cortos (originado en Workspace Launcher). Los recursos pesados NO están aquí: se conectan con [conexion_recursos/00_LEEME.md](conexion_recursos/00_LEEME.md). Las instrucciones locales están en [AGENTS.md](AGENTS.md); léelo primero y después la [guía de producción](00_GUIA_IA_Videos_Rapidos.md) y la ficha de la versión del vídeo que se vaya a editar.



Para mejoras de estilo consulta [10_ESTILOS_Y_HERRAMIENTAS_IA.md](10_ESTILOS_Y_HERRAMIENTAS_IA.md) y [video-estilos-creativos](.agents/skills/video-estilos-creativos/SKILL.md). Las entradas de `.claude/skills/` remiten a la fuente canónica `.agents/skills/`. Planificación, recursos, voces y producción siguen usando las skills existentes enlazadas desde AGENTS.



Aplica el brief actual. Reutiliza Remotion, los brutos reales y las voces del proyecto. Dependencias y ejecución en una copia local (no dentro de carpetas sincronizadas); recursos en las bibliotecas conectadas. Las referencias de otras herramientas no las instalan ni autorizan gasto, publicación o cambios de motor. Carga solo los documentos del modo que necesites.



## Ideas, producción y formatos reutilizables

Empieza por [video-orquestacion](.agents/skills/video-orquestacion/SKILL.md), [el flujo](11_FLUJO_IDEA_GUION_Y_PRODUCCION.md) y la ficha/encargo del vídeo. Codex prepara guion y plan; Claude se encarga de producir cuando el usuario lo pida. Una petición solo de guion permanece documental. Elige los recursos y skills pertinentes sin que el usuario tenga que conocerlos. Para repetir un formato lee [Biblioteca_Formatos](Biblioteca_Formatos/00_INDICE.md); guarda nuevas recetas con vídeo, versión, herramientas y preferencias reales.


## Recursos propios del usuario

Antes de buscar material en internet, usa [video-recursos-conectados](.agents/skills/video-recursos-conectados/SKILL.md): `python herramientas/recursos.py list|check|search|resolve`. Si no existe `conexion_recursos/recursos.config.local.json`, pide al usuario dónde están sus carpetas de recursos y créalo (`init`).
