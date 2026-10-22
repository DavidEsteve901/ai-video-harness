# AI Video Harness

Un **arnés (harness) para que una IA produzca vídeos cortos** —Shorts, TikTok, Reels y presentaciones— con [Remotion](https://www.remotion.dev/): skills, guías de método, biblioteca de voces, formatos reutilizables, planificación de ganchos/retención y un sistema para **conectar tus propias carpetas de recursos** (vídeo, audio, imágenes) con índices que la IA puede leer.

No es una app: es el contexto que le das a un agente (Claude Code, Codex u otro) para que, con una frase tuya —«hazme un vídeo sobre X»—, ya sepa cómo planificar, qué recursos tienes, qué voz usar y cómo montarlo.

> Nació produciendo los vídeos de [Workspace Launcher](https://github.com/DavidEsteve901); por eso hay proyectos de ejemplo (`01_Proyectos/VR0xx`). Están aquí **solo como texto** (fichas, guiones, código Remotion); los vídeos no se incluyen.

## Empezar

```bash
git clone <este-repo> ai-video-harness
cd ai-video-harness
python herramientas/recursos.py init     # crea tu config local de rutas (no se sube a git)
```

1. Abre la carpeta con tu agente (Claude Code lee `CLAUDE.md`; otros agentes leen `AGENTS.md`).
2. Conecta tus recursos → [conexion_recursos/00_LEEME.md](conexion_recursos/00_LEEME.md).
3. Pídele una pieza: *«Hazme un Short de 15 s sobre por qué olvidamos al cambiar de ventana»*. La skill [`video-orquestacion`](.agents/skills/video-orquestacion/SKILL.md) decide el resto (idea → guion → recursos → voz → montaje).

Requisitos para producir: Node 18+ (Remotion), Python 3.10+, `ffmpeg`/`ffprobe`. Las dependencias de cada proyecto Remotion se instalan en una **copia local** (no dentro de carpetas sincronizadas) con `npm install`.

## Qué hay dentro

| Carpeta / archivo | Para qué |
| --- | --- |
| `CLAUDE.md`, `AGENTS.md` | Puerta de entrada y reglas para los agentes |
| `00_GUIA_IA_Videos_Rapidos.md` y `0x_*.md` | Método de producción, sonidos y ganchos, voces, inventario de recursos, flujo idea→guion→producción |
| `.agents/skills/` | Skills canónicas: orquestación, planificación/retención, recursos visuales, **recursos conectados**, voces/locución, Remotion (producción + guías oficiales), estilos (cámara continua, collage, cine, animación pintada, Hyperframes) |
| `.claude/skills/` | Entradas para Claude Code que remiten a `.agents/skills/` |
| `conexion_recursos/` | Plantilla de configuración y guía para enlazar tus carpetas de recursos |
| `herramientas/recursos.py` | CLI: listar, comprobar, resolver, catalogar y buscar recursos |
| `Biblioteca_Voces/` | ~150 voces de diseño original ES/EN (índice, muestras mp3, generador y escuchador web) |
| `Biblioteca_Formatos/` | Recetas de formatos de vídeo aprobados y reutilizables |
| `Biblioteca_Planificacion/` | Perfil editorial, ganchos, retención |
| `Biblioteca_Estilos_IA/` | Guías de estilos y herramientas (las fuentes de terceros se enlazan, no se copian) |
| `Biblioteca_Sonidos/` | Efectos propios sintetizados (sin derechos) |
| `00_Ideas/` | Banco de ideas y captura rápida |
| `00_Plantilla_Video/` | Estructura de carpetas de cada vídeo (`VR###_Nombre`) |
| `01_Proyectos/` | Ejemplos reales (solo texto y código) y un índice de ejemplo de 880 SFX |

## Conectar tus recursos (resumen)

```bash
python herramientas/recursos.py list                  # qué bibliotecas hay y si están montadas
python herramientas/recursos.py scan visuales         # crea/actualiza catalogo.json de esa carpeta
python herramientas/recursos.py search "teclado" --tipo video
```

Los archivos viven donde quieras (otro disco, NAS, Drive); el repo solo guarda las rutas **de tu equipo** (ignoradas por git) y cada biblioteca lleva su `catalogo.json` con descripciones, etiquetas y licencias. Mover todo a otro disco = cambiar una ruta.

## Notas legales

- El código y los textos de este repo están bajo licencia MIT (ver `LICENSE`).
- **Sin medios con derechos de terceros.** Los ejemplos mencionan clips/canciones de terceros (memes, películas) únicamente como metadato; si los usas en tus piezas, revisa su licencia.
- Las voces de `Biblioteca_Voces/` son **diseñadas por descripción**, no clonan a personas reales. No clones voces de personas sin su consentimiento.
- Las skills de Remotion provienen de la documentación oficial de Remotion; las fuentes de comunidad usadas como referencia se listan en `Biblioteca_Estilos_IA/FUENTES_Y_VERSIONES.json` con su licencia. Respeta las de cada proyecto.
- Las claves de API (p. ej. `GEMINI_API_KEY`) van en variables de entorno, nunca en el repo.

## Estado

Proyecto vivo: las skills y formatos evolucionan con cada vídeo producido. Contribuciones y issues bienvenidos.
