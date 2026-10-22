# Recursos y alcance para producir IDEA-041

**Revisión editorial, 21-10-2026:** esta pieza se limita a la conexión agente → Workspace Launcher y acciones dentro de la app. La integración de proyectos y acciones externas pasa a [IDEA-042](../IDEA-042_tus-proyectos-desde-el-omnibar.md). Se usarán ilustraciones conceptuales; las rutas de iconos son recursos de identificación, no una obligación de dibujar pantallas reales.


## Recursos que Claude puede aprovechar

| Necesidad | Fuente localizada | Estado |
|---|---|---|
| Logo WL | `C:\Herramientas\Launcher pro\workspace-automator\WorkspaceLauncher\Assets\Square150x150Logo.png` | Archivo existente, visto en esta preparación |
| Codex / Antigravity | `WorkspaceLauncher/frontend/src/assets/agents/codex.png` y `antigravity.svg`, en ese repositorio | Rutas localizadas; elegir variante de contraste adecuado |
| Iconos de herramientas | `WorkspaceLauncher/frontend/public/images/apps/`: VS Code, terminal, Chrome, Figma, etc.; Obsidian en `frontend/src/assets/custom_icons/obsidian.svg` | Archivos localizados; seleccionar solo los del caso |
| Claude / OpenCode / otros | Revisar los iconos de `simple-icons` que usa `McpAgentConnections.jsx`, o su fuente de marca | Preparar los elegidos al producir |
| Personaje, esquemas y movimiento | Formas vectoriales propias; skills de estilos + Remotion | Propuestos para que los cree Claude; no incluidos como medios |
| Voz | Biblioteca_Voces, favoritas e índice de Videos_Rapidos | Voz sin elegir ni generar |
| Efectos | Catálogo local de sonidos y Biblioteca_Sonidos | Funciones sonoras definidas; archivos por seleccionar |

Las rutas del repositorio son origen; Claude copiará solo lo necesario a los recursos del proyecto de vídeo al producir. Las marcas se usan para identificar herramientas y requieren revisar la variante y condiciones pertinentes; no implican colaboración comercial.

## Qué se contrastó del producto

Repositorio leído: `C:\Herramientas\Launcher pro\workspace-automator`. Referencia HEAD observada: `f5d1f83629eda6b13a66284fffece1f7f5b5fa58`; los archivos de trabajo pueden incluir cambios locales, por lo que ese commit no sustituye la revisión de la build que se mostrará.

- `WorkspaceLauncher/Core/MCP/McpClientInstaller.cs` y `frontend/src/components/ConfigPanel/McpAgentConnections.jsx`: cinco entradas observadas, Codex, Claude Code, Claude Desktop, Antigravity y OpenCode. El código no acredita una conexión automática de todas las herramientas mencionadas por el usuario.
- `Core/MCP/Resources/custom_actions_guide.md`: acciones de comandos, procesos, enlaces y HTTP; inspección del destino real; guardado y ejecución separados. El agente puede configurar lo que el contrato y los permisos permitan.
- `Core/MCP/Tools/GetCustomActionGuideTool.cs`: conexión neutral respecto al proveedor, local stdio y requisitos de conector cuando el agente está en la nube.
- `Core/MCP/Tools/CreateWorkspaceTool.cs`: protocolo de borrador/confirmación para componer workspaces con elementos.
- `Core/MCP/Tools/ProjectTerminalTools.cs`: inspección de proyectos para obtener comandos y directorios reales.

Las herramientas MCP de esta sesión devolvieron `Transport closed`. No se ha probado una conexión ni creado configuraciones. Código local, build pública y demostración funcional son evidencias distintas.

Cursor documenta MCP y stdio en su [documentación oficial](https://cursor.com/docs/mcp); la conexión concreta a WL y su experiencia de configuración deben validarse antes de presentarlas como comprobadas. Puede quedar en el plan como opción compatible a comprobar, no como un botón automático ya existente.

## Mensaje operativo

Usar «el agente compatible que ya usas». Mostrar un cliente seleccionado y un caso principal. La conexión no configura sin requisitos cualquier servicio ni sustituye credenciales, permisos o contratos. El usuario controla qué se prepara. En esta pieza la personalización se explica como intención y capacidad de actuar dentro de la app, sin prometer «todo para cualquiera». El catálogo y la lógica de herramientas externas se explican en IDEA-042.
