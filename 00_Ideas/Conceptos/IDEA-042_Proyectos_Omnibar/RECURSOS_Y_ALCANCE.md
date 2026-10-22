# Recursos y verdad funcional de IDEA-042

## Recursos para que Claude seleccione al producir

- Símbolo de Workspace Launcher: recurso existente `C:\Herramientas\Launcher pro\workspace-automator\WorkspaceLauncher\Assets\Square150x150Logo.png`.
- Proyectos, lógica, conectores, datos y resultados: ilustración/vector propio, con un sistema visual coherente. No dibujar pantallas de la aplicación como si fueran reales.
- Iconos de herramientas: biblioteca compartida y recursos de apps del repositorio; usar solo los del ejemplo seleccionado. Una caja de proyecto puede ser genérica si no se necesita una marca concreta.
- Voz y efectos: Biblioteca_Voces y Biblioteca_Sonidos, con sus índices/skills. Sin identidad ni archivos seleccionados aquí.
- No se han preparado, descargado ni generado medios para esta revisión documental.

## Fuentes de producto revisadas el 21-10-2026

En `C:\Herramientas\Launcher pro\workspace-automator\WorkspaceLauncher`:

- `Core/MCP/Resources/custom_actions_guide.md`: el agente puede descubrir acciones y configurar conexiones de tipo command, process, open, url y http. La herramienta externa conserva reglas de dominio, plantillas, credenciales y flujo. Hay entrada, sugerencias y salidas de texto/resultado estructurado.
- `Core/MCP/Tools/CustomActionsTool.cs`: campos de definición como `acceptsInput`, `inputHint` e `inputSuggestions`. Esto no equivale a un esquema de formulario arbitrario.
- La guía establece que guardar una acción no la ejecuta; uso y activación siguen sus permisos. Un proyecto que solo exponga MCP necesita un adaptador CLI/HTTP documentado o un wrapper adecuado, no una conexión directa inventada.

Estas fuentes describen código y documentación locales. No se ha ejecutado ni probado una integración concreta en esta revisión. La disponibilidad en una build pública se verificará al preparar la publicación.

## Reglas del relato

1. El agente ayuda a configurar con contexto del proyecto y la guía/skill de integración; no se necesita enseñar al usuario el contrato técnico en el vídeo.
2. El Omnibar concentra accesos e invoca acciones. La lógica de consultar, generar o transformar pertenece a la herramienta externa que tenga esa capacidad.
3. Los datos dibujados son una metáfora. Formularios nativos dinámicos no están acreditados por los campos observados; no anunciarlos como disponibles.
4. Elegir un ejemplo ilustra la posibilidad sin prometer que todas las apps se integran sin requisitos. Mantener ese rigor sin llenar el vídeo de implementación.
5. Esta idea corresponde al concepto Omnibar; la conexión general agente–app queda en IDEA-041.
