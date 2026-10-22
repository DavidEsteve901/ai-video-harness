---
title: Inventario de recursos para vídeos
status: active
created: 2026-10-20
tags: [project/workspace-launcher, marketing, video, recursos]
---

# Inventario de recursos

Qué hay disponible para montar vídeos, dónde está y con qué condiciones. **Añade una fila cada vez que incorpores algo nuevo** (origen y licencia siempre).

Raíz de marketing: `<RAIZ_MARKETING>/`

## Material propio (grabaciones y marca)

| Recurso | Ruta (desde `Videos\Videos_Rapidos\`) | Notas |
| --- | --- | --- |
| **Demo de las palmadas** (1920×1080, 60 fps, 25,45 s; claps en 3,24 y 3,51 s; windows se abren ≈4,9–9 s; cierre ≈20–22 s) | `01_Proyectos/VR003_…/02_Brutos/Palmadas_demo_original.mp4` | La mejor demo vertical-friendly; sin datos personales visibles |
| Brutos Junior/Senior (escritorio con wallpaper) | `01_Proyectos/VR001_Junior_vs_Senior/02_Brutos/` | Usados en VR001 |
| Logo Workspace Launcher | `01_Proyectos/VR003_…/03_Recursos/Logo_WorkspaceLauncher.png` · marco `VR001…/03_Recursos/MARCO_MARCA*` | Marco con huecos para dos vídeos |
| Fuentes Anton + Inter (OFL) | `…/Remotion_VR00X/public/fonts/` | Licencias OFL incluidas |
| Voz propia del autor | `C:\Herramientas\local-voice-studio\data\voices\` | Referencia hablada, solo local |
| Voz diseñada «Genio sarcástico» | Misma biblioteca | Original, ver [03_VOCES_Y_LOCUCION.md](03_VOCES_Y_LOCUCION.md) |
| **Biblioteca de Voces** (arquetipos ES/EN/latino + paleta de emociones, muestras mp3, índice, `locutor.py`) | `Biblioteca_Voces/` · índice [INDICE_VOCES.md](Biblioteca_Voces/INDICE_VOCES.md) · escuchar: `Biblioteca_Voces/Escuchar_Voces.html` | Todas originales (diseñadas por descripción). Ids y semillas en `herramientas/catalogo_voces.json`; los modelos de voz viven en el estudio local (`C:\Herramientas\local-voice-studio\data\voices`) |

## Material de terceros (memes) — pack Tony Stark

Carpeta: `01_Proyectos/Tony Stark/` (colección suelta original del usuario; copias de trabajo dentro de cada `VR00X/03_Recursos`).
**Origen:** clips y fotos descargados de internet (películas Marvel/memes). Se usan como **recurso de meme corto**; pueden recibir reclamaciones de derechos en alguna plataforma. Anota aquí el clip exacto cuando lo uses.

| Archivo | Qué es | Notas |
| --- | --- | --- |
| `Videos/Robert-Downey-Jr-SnapYT.App.mp4` | Grito largo (27 s, 480×360, con audio) | Base de VR004 (el grito se repite en bucle) |
| `Videos/Tony-stark-gritando-SnapYT.App.mp4` | Grito corto (2,9 s, 360×640 con **barras negras**: contenido real 360×462 desde y=90) | Gancho de VR003; audio a 0 dB, bajar volumen |
| `Videos/Robert-Downey-Jr-SnapYT.App (1).mp4` | Variante corta del grito (4 s) | |
| `Videos/Tony Stark saying Wake Up, Daddy's Home!… Green Screen.mp4` | Escena del taller con pantallas verdes (chroma) | Usado en VR002 |
| `Videos/Wake up daddys home.mp4`, `vidoe largo wake upp…/Iron Man 2 Welcome home sir…mp4` | Escena de la frase «Wake up, daddy's home» | VR002 |
| `Videos/Tony-Stark-Dancing…`, `Tony-Stark-bailando…` | Tony bailando | Reacción para hitos |
| `Fotos/` (12) | Tony pensativo («Jarvis,» con hueco de texto), brazos abiertos con explosiones, HUD de JARVIS, gritando recortado, sticker, etc. | `g2txj6kqv6xf1.png` (cara JARVIS 2,3 MB) **no se abre con ffmpeg** (PNG dañado/no estándar); `images (1).jpg` lleva texto soez: no usar |
| `gifts/` (13 GIF/webp) | Reacciones: lol-rdj, jarvis-meme, tinkering, buhbuhbuh, etc. | |
| `Sonidos/danger-alarm-sound-effect-meme.mp3` | Alarma de meme (15 s) | También en `Biblioteca_Sonidos/memes_de_terceros/` |

## Otros recursos

| Recurso | Dónde | Notas |
| --- | --- | --- |
| Clip de cohete azul (IA) | `01_Proyectos/Elon roadster/A_metallic_blue_rocket_icon_…mp4` (2 MB) | Para ID-01 (cuenta atrás); origen: generado con IA, confirmar herramienta/licencia |
| Canción Kordhell — Scopin (mp3) | `01_Proyectos/VR001…/03_Recursos/` | Música con derechos; usada en VR001; ver nota en [02_SONIDOS_Y_GANCHOS.md](02_SONIDOS_Y_GANCHOS.md) |
| Efectos de sonido propios (7) | [Biblioteca_Sonidos/sfx_propios/](Biblioteca_Sonidos/sfx_propios/) | Sintetizados, sin derechos |
| **Pack de 37 efectos de meme** (vine boom, bass drop, bruh, suspend, alarma…) | `01_Proyectos/Recursos videos/Efectos sonido/` (WAV + `README.md` con índice y tiempos del MP3 original) | De la compilación «Modern Meme Sound Effects Compilation (2024)» de YouTube; contiene voces y música de terceros (Bob Esponja, Zelda, Goku…): usar cortos, no garantiza ausencia de reclamaciones |
| Voz «Listillo millonario ES» (`listillo-millonario-es-6404f1`) | Local Voice Studio; frases en `VR002…/04_Edicion/Remotion_VR002/voz/` | Creada en otra sesión para VR002 V2; misma política: original, no clona a nadie |
| Lista de canciones phonk/slowed | `00_Centro_de_Ideas/04_Biblioteca_Creativa/Musica_y_Audio.md` | Banco de exploración |
| Hooks y CTA de texto | `00_Centro_de_Ideas/04_Biblioteca_Creativa/Hooks_y_CTA.md` | Tono directo, sin promesas infladas |
| Carpetas hermanas de `05_Marketing\Videos\` | `Brutos`, `Cortes OpenScreen`, `Fondos videos`, `kdenlive`, `ElevenLabs`, `Material`, `FINALES`, `Videos Web Plan`, `Promo_Final_2026-09-30`, `Grabaciones_Personales` | Existen; sin catalogar aquí todavía → revisarlas al buscar material |
| Prompts de edición con IA | `Videos\Prompts ia editor de video.md`, `Prompt  editar video v2.md` | Estilo de edición «tech marketing» |

## Qué falta (para pedir/grabar cuando toque)

- Sonidos de meme con licencia clara: vine boom, scratch, bocina, «dun dun dun», error de Windows, notificación, teclado/clic, obturador, cuenta atrás y despegue.
- Una grabación vertical o en 4K de la demo (más nitidez al ampliar).
- Un «antes» caótico grabado (muchas apps sueltas) para los vídeos de contraste.
- ~~Más voces diseñadas~~ → hecho el 2026-10-20: ver **Biblioteca de Voces** abajo.


## Material de la app más reciente (añadido 2026-10-20)

Mapa completo y estado de cada grabación en [05_IDEAS_Y_GRABACIONES_PENDIENTES](05_IDEAS_Y_GRABACIONES_PENDIENTES.md). Lo más reciente son los brutos de `Videos/Grabaciones_Personales/01_Brutos/T01_Tutorial_Desde_Cero/` (asistente de voz, layouts, zonas, gestos, configuración). No hay grabación del omnibar.
