---
title: "VR017 — Guía y guion de ritmo: presentación global al compás de la música"
id: VR017
created: 2026-10-22
status: "V1 producida (música propia), pendiente de que el usuario la vea y la escuche; variante «Loser» sin generar (no hay pista)"
formato: "Presentación de lanzamiento a ritmo (derivado de FMT-004, sin voz ni karaoke)"
---

# VR017 — Guion de ritmo

## Encargo

Presentación global de la app de escritorio, **montada al ritmo de la música**, al estilo de un vídeo de lanzamiento muy trabajado (referencia del usuario: «Introducing EDITKIT – All-in-one Free Plugin»): tipografía cinética, tarjetas de interfaz que entran en 3D, zooms a la interfaz real, cortes y gestos clavados a los golpes, ritmo creciente, *drop* con montaje rápido de funciones y final limpio. Sin voz en off: el texto cuenta la historia. Español, vertical y horizontal, 60 fps.

**Concepto:** «Tu PC recuerda cómo trabajas. Tú decides.» El vídeo empieza con el ritual diario de volver a colocarlo todo a mano, pregunta «¿y si tu PC lo recordara?», enseña cómo se guarda y se abre un entorno, cómo se captura y se adapta a las pantallas, y en el *drop* despliega la capa de IA y las herramientas. Cierra con la filosofía.

**Reglas:** sin logo ni nombre de la app, sin precio, URL ni cifras inventadas; cada texto respaldado por el código (tabla de verificación en la [ficha](00_FICHA_VIDEO.md)). Lenguaje visual de FMT-004: fondo #07090F con luces que respiran, viñeta y grano; colores con significado (coral problema, ámbar IA/memoria, cian control/zonas, verde listo); Inter ExtraBold.

## Rejilla de pulsos (fuente única: `src/ritmo.ts`)

- **100 BPM** (pulso 0,6 s = 36 fotogramas; compás 4/4 = 2,4 s), primer golpe en **0,10 s**.
- 24 compases + cola de 2,2 s ≈ **59,9 s**.
- Cambiar de pista = cambiar BPM/offset (o la lista de golpes detectados) y, si hace falta, los compases por sección. Todo (escenas, efectos y música) se calcula desde esa rejilla.

| Sección | Compases | Tiempo (propia) | Música | Imagen |
|---|---|---|---|---|
| Intro | 1–4 | 0,1–9,7 s | Piano eléctrico filtrado, bajo marcado, bombo apagado | Palabras sueltas a golpe, ventanas que se amontonan (coral) |
| Subida A | 5–8 | 9,7–19,3 s | Entra la batería, acordes completos | Interfaz real: guardar y lanzar; las apps vuelan a sus pantallas y zonas |
| Subida B | 9–12 | 19,3–28,9 s | Arpegio en semicorcheas, charles abierto, redoble y subida | Captura del escritorio y perfiles de pantallas |
| Corte | 13 | 28,9–31,3 s | Todo se corta; queda el barrido y un silencio de un pulso | «Y ahora, pídeselo.» en ámbar |
| *Drop* | 14–21 | 31,3–50,5 s | Tema completo con melodía, bombo fuerte y bombeo | Una función por compás: tarjeta en 3D, golpe, flash; el último compás, ráfaga en corcheas |
| Final | 22–24 | 50,5–57,7 s (+ cola) | Sin batería; acordes y bajo; acorde final | «Tu PC recuerda cómo trabajas. Tú decides.» |

## Mapa compás → texto → visual

Pulsos numerados 1–4 dentro de cada compás. «+» = corchea.

| Compás | Pulso | Texto en pantalla | Visual | Respaldo |
|---|---|---|---|---|
| 1 | 1·2·3·4 | Apps. / Pestañas. / Carpetas. / Terminales. | Cada palabra golpea en el centro; aparecen ventanas sueltas | Web `hero`: «apps, pestañas y proyectos»; captura Store 05: «Apps, webs, carpetas y terminales» |
| 2 | 1·2·3·4 | Cada día / a mano / otra / vez. | Las ventanas se amontonan desordenadas (coral) | Planteamiento (filosofía web: «Preparar no es trabajar») |
| 3 | 1·2·3 | Abrir. Colocar. Buscar. | Caos de ventanas sobre la pantalla, sacudida | Ídem |
| 4 | 1–3 | ¿Y si tu PC lo recordara? | Las ventanas se congelan y se deshacen en polvo ámbar | Concepto |
| 5 | 1 | Guárdalo una vez. | **Lista real del workspace** entra en 3D | Web `philosophy`: «Guarda tu entorno una vez» |
| 6 | 1·3 | Ábrelo con un clic. | Zoom al botón **Lanzar**; clic en el pulso 3 | Web `landing.steps`: «Ábrelo con un clic» |
| 7 | 1 + corcheas | Cada app en su pantalla, | Dos monitores; 6 ventanas vuelan a su sitio en corcheas | Captura 05: «en su monitor, escritorio y zona» |
| 8 | 1·3 | su escritorio / y su zona. | Cambio de escritorio 1→2; rejilla de zonas cian | Ídem; `Core/ZoneEngine`, `Core/DesktopMover` |
| 9 | 1·3 | ¿Ya lo tienes abierto? / Captúralo. | Destello de obturador; marcos discontinuos sobre las ventanas | `snapshot.title` «Capturar workspace»; web `toolkit.capture` |
| 10 | 1–4 | (tarjeta) Capturando espacio de trabajo en vivo… · Monitores · Ventanas · Zonas CZE · Pestañas web | Fichas que entran una por pulso | `snapshot.capturing_title`, `snapshot.chip_*` |
| 11 | 1·3 | ¿Cambias de pantallas? | Portátil solo; en el 3 se enchufa un monitor | Web `toolkit.monitor` |
| 12 | 1·3 | Se adapta solo. / Perfil detectado: Casa · 2 pantallas | Tarjeta de perfil; las ventanas saltan a su sitio; redoble | `workspace_profiles.detected`; nombre ilustrativo de la web |
| 13 | 1·3 | Y ahora, / pídeselo. | Negro, chispa ámbar; silencio en el pulso 4 | — |
| 14 | 1 | Desde cualquier app. | **Omnibar real** en 3D; zoom a «Ideas para estas ventanas» | Web `omnibar`; captura 02 |
| 15 | 1 | Díselo en voz alta. | **Asistente de voz real** (orbe + «Prepara mi workspace») | Captura 04; `Core/Voice` |
| 16 | 1 | La IA te monta el workspace. | **Chat real**: borrador creado por la IA | Captura 03; `Core/Chatbot` |
| 17 | 1·2·4 | Dicta en cualquier app. | Tarjeta del transcriptor: Escuchando… → Transcribiendo… → Pegado | `dictation_osd.*`; web `toolkit.dictation` |
| 18 | 1 + corcheas | Conecta tu agente de IA. | Claude Code, Codex, Cursor, Antigravity, GitHub Copilot → «Conectado» | `McpAgentConnections.jsx`; `config.mcp_agents_*` |
| 19 | 1·3 | Detecta tus rutinas. | Tarjeta: «Llevas 3 días abriendo…» «¿Lo guardo como workspace?» | `Core/Routines/RoutineService.cs` (MinDays = 3) |
| 20 | 1·3 | Te avisa si algo falla. | Aviso: «“Focus” se abrió a medias…» · Reintentar lo que falta | `Core/Proactive/ProactiveEvents.cs` |
| 21 | corcheas | Layouts · Escritorios virtuales · Gestos del ratón · Atajos · Fijar ventanas · Limpiar · Notas rápidas · Temporizadores | Ráfaga: un rótulo por corchea, destellos de interfaz real (layouts, gestos) | Ver ficha |
| 22 | 1·2·3·4 | Tu PC / recuerda / cómo / trabajas. | Palabras grandes; «recuerda» en ámbar | Filosofía: rutinas, perfiles «recordado para estas pantallas» |
| 23 | 1·3 | Tú / decides. | Visto verde en el 3 | `RoutineService`: «no abro nada sin que lo digas»; voz: «Lo destructivo siempre te lo pregunta» |
| 24 | 1 → cola | (se mantiene) | Acorde final, cámara que se aleja, fundido | — |

## Música

- **V1 publicable:** música propia por código (`scripts/sintetizar_audio.py`), aire *indie-psych* de medio tiempo: bajo con *groove* marcado, piano eléctrico con trémolo, acordes con *phaser*, batería con bombeo, melodía con portamento en el *drop*. Progresión Dm9 – G13 – Cmaj9 – Am9.
- **Variante «Loser» (Tame Impala):** solo si el usuario deja el audio en `03_Recursos/musica/`. `scripts/sincronizar_musica.py` detecta tempo y golpes, elige el tramo de la canción cuyo bloque de más energía coincide con el *drop*, recorta y escribe `src/ritmo_loser.json`; las composiciones `VR017-*-Loser` usan esos golpes reales. Música comercial con derechos: la variante es solo para el uso que decida el usuario. En TikTok/Reels puede añadirse desde la biblioteca de sonidos de la plataforma sobre la versión sin música o con música propia.
