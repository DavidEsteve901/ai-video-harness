---
title: "VR011 — Conecta tu agente a Workspace Launcher"
id: VR011
status: edicion
tags: [project/workspace-launcher, marketing, video-corto, explicador-conceptual]
---

# VR011 — Conecta tu agente a Workspace Launcher

> [!info] Idea de origen
> [IDEA-041](../../00_Ideas/Conceptos/IDEA-041_tu-agente-prepara-tu-entorno.md) · guion base y encargo en `00_Ideas/Conceptos/IDEA-041_Agente_MCP/`. Formato: [FMT-003](../../Biblioteca_Formatos/FMT-003_Explicador_Conceptual_Animado.md) (explicador conceptual animado).
> **Estado:** producido el 2026-10-21. V1 con voz local (CosyVoice), **V2 con voz de Gemini (versión vigente)**, pendiente de que el usuario la vea y la valide. No publicado.

## Ficha breve

- Promesa única: el agente que ya usas puede conectarse a Workspace Launcher y **actuar dentro de la app** a lo que le pides; tú decides.
- Plataforma prevista: Shorts / TikTok / Reels (vertical) y versión horizontal (web, YouTube). Por decidir.
- Duración: V2 33,5 s (voz 31,1 s); V1 31,6 s. 30 fps.
- Formato: dibujo estilo cuaderno (papel, trazo irregular, figuras que se dibujan solas), sin grabaciones de pantalla ni pantallas inventadas; iconos reales de agentes y apps.
- Público: quien ya trabaja con un agente (Claude, Codex, Antigravity, OpenCode, Gemini…) y quiere saber qué puede hacer con la app.

## Guion v2 (con ejemplos) — tiempos medidos sobre la locución

Cambio respecto a la IDEA-041 original (decisión del usuario, 2026-10-21): además de explicar la conexión, **mostrar el potencial con tres ejemplos concretos** (un espacio de estudio, un atajo de teclado, un ajuste de la app). La promesa sigue siendo una sola.

| Voz | Seg. | Dibujo | Qué aporta |
|---|---|---|---|
| ¿Y si el agente que ya usas pudiera actuar dentro de Workspace Launcher? | 0–4 | Persona, cinco iconos de agentes como opciones, ventana de WL vacía con «?» | Gancho: la posibilidad |
| Lo conectas una vez. | 4,2–5,2 | Una ficha se elige, las demás se esfuman; cable ámbar con enchufe; chispa | Elección del usuario, un solo agente activo |
| Y le hablas como a una persona. | 5,5–7,2 | Línea punteada persona → agente, bocadillo «…» | Intención en lenguaje natural |
| Pídele un espacio para estudiar, con tus apuntes, el navegador y la terminal. | 7,5–12,4 | Bocadillo «Prepárame un espacio para estudiar» + Obsidian, navegador, terminal al nombrarlos; el mensaje viaja al agente | **Ejemplo 1** |
| Y él lo prepara, cada cosa en su sitio. | 12,7–15,9 | Las tres piezas viajan por el cable y encajan en las zonas de la ventana; visto | Resultado |
| Pídele un atajo de teclado para lanzarlo. | 16,3–18,6 | Teclas Ctrl + Alt + E que se pulsan; destellos | **Ejemplo 2** |
| O que ajuste la aplicación a tu manera. | 18,9–21,2 | Interruptores y deslizador que se mueven | **Ejemplo 3** |
| Él propone. Tú revisas y decides. | 21,4–24 | Tarjeta «propuesta», lupa y visto de la persona | Control del usuario |
| Tu agente, conectado a tu forma de trabajar. | 24,4–27 | Piezas circulan por todo el circuito | Beneficio |
| ¿Qué le pedirías primero? | 27,3–29,2 | Bocadillo de pensamiento de la persona | Pregunta abierta |

Capacidades (herramientas MCP de la app listadas en esta sesión; **no se ejecutaron**, solo se comprobó que existen): `create_workspace` con borrador/confirmación (ejemplo 1 y «propone / decides»), `set_hotkey` (ejemplo 2), `set_app_setting` (ejemplo 3). La tecla «E» es solo ilustrativa. Los clientes que muestran los iconos son los que lista `McpAgentConnections.jsx`; **el agente elegido en el dibujo (Claude) es un parámetro editable** (`agenteElegido` en `edit.config.json`). Antes de publicar, confirmar disponibilidad en la versión que se anuncie.

## Producción

- Editable: `04_Edicion/Remotion_VR011/` (Remotion 4.0.448; composiciones `VR011-Vertical` 1080×1920 y `VR011-Horizontal` 1920×1080, mismo código, composición adaptada).
- **Voz V2 (vigente): Gemini (API de Google), modelo `gemini-3.8-flash-tts`, voz castellana `es-es-training-9`** (anfitrión de vídeos instructivos, 23 años). Estilo emocional distinto por toma en `03_Recursos/voz/gemini/estilos_vr011.json` (campo `speech_metadata.style`). Tomas, mezcla y tiempos en `03_Recursos/voz/gemini/v3_es-es-training-9/`; audio usado: `03_Recursos/voz/locucion_final_gemini.wav`. Whisper confirma las palabras de las 10 tomas (en la 3 la voz une «como a una» y se oye «como una»; el subtítulo conserva el texto del guion). Coste de las 5 voces de prueba + el vídeo: ≈ 3,7 céntimos de dólar. El usuario las oyó y valoró bien la voz y la energía; **eligió una voz por vídeo y no mezclar**. La voz concreta la escogí yo (la que mejor encajaba) tras su «usa esta voz»: cambiarla cuesta céntimos y un nuevo render.
- Voces probadas y descartadas por el usuario o sustituidas: V1 local CosyVoice `tutorial_el` (susurrada, mini cortes, poca emoción); Chatterbox Multilingual (instalado en `local-voice-studio/.venv-chatterbox`, sin emoción real porque copia la referencia sintética); Qwen3-TTS. Otras voces Gemini generadas para comparar: `es-es-commercial-7`, `es-es-concierge-4`, `es-es-csagent-3`, `Puck` (`03_Recursos/voz/gemini/A_B/`).
- Locuciones antiguas guardadas por trazabilidad: `voz/v1_guion_corto`, `voz/v2_intenciones_pronunciadas` (el motor local leía en voz alta las intenciones largas de dirección).
- La herramienta, el catálogo de voces y la guía de uso viven en `Biblioteca_Voces/` (`06_GEMINI_VOCES.md`, `herramientas/gemini_tts.py`, `gemini_uso.jsonl`).- Efectos propios de `Biblioteca_Sonidos/sfx_propios` (pop, whoosh, ding, scribble, hit) en cada evento del dibujo.
- Tipografía manuscrita: Ink Free (fuente de Windows, solo usada para renderizar; no redistribuir fuera de este proyecto).
- Iconos y su origen: `03_Recursos/iconos/` (repositorio del producto, solo lectura); marcas solo para identificar herramientas, sin implicar colaboración.

## Exportaciones

- **V2 (voz Gemini, vigente):** `VR011_V2_1080x1920_30fps_voz_gemini.mp4` (vertical) y `VR011_H2_1920x1080_30fps_voz_gemini.mp4` (horizontal), 33,5 s, pico de audio −1,6 dBFS (limitador tras renderizar). Los tiempos de cada escena se reajustaron a la voz nueva (`edit.config.json`; el anterior queda en `edit.config.v1_cosyvoice.json`).`n- V1 (voz local, antigua): `VR011_V1_1080x1920_30fps.mp4` y `VR011_H1_1920x1080_30fps.mp4`, 31,6 s. Hojas de fotogramas `*_revision_fotogramas.png` extraídas de los MP4 exportados.
- Subtítulos incrustados para accesibilidad (`captions` en `edit.config.json`).
- Revisión hecha: fotogramas y niveles de audio. Revisadas por mí solo las hojas de fotogramas, no el movimiento completo ni el sonido en el vídeo final (la voz sí la escuchó el usuario por separado); queda su visto bueno al vídeo.

## Tareas

- [x] Guion v2 con ejemplos y tiempos medidos.
- [x] Voz generada y revisada con Whisper (palabras).
- [x] Animación vertical y horizontal.
- [ ] El usuario ve el vídeo y escucha la voz; retoques.
- [ ] Confirmar capacidades en la versión que se anuncie.
- [ ] Decidir plataforma, portada y texto (`06_Publicacion/`); publicar solo con su aprobación.

## Aprendizajes (provisionales, sin revisión del usuario)

- CosyVoice pronuncia las intenciones largas de dirección: usar 1–2 palabras sin punto.
- SVG con `feDisplacementMap` y semilla que cambia cada 4 fotogramas da el trazo vivo de cuaderno sin tocar el resto del código; el render aguanta bien a 30 fps.