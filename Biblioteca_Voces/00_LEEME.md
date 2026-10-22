---
title: Biblioteca de Voces — léeme
status: active
created: 2026-10-20
tags: [project/workspace-launcher, marketing, video, voz]
---

# Biblioteca de Voces

Banco de voces **originales** (diseñadas por descripción, sin clonar a nadie) para poner voz a los vídeos rápidos, hecho con el proyecto local **Local Voice Studio** (`C:\Herramientas\local-voice-studio`, Qwen3-TTS). Español, inglés y español latino; arquetipos de personaje, paleta de emociones y herramientas para generar locuciones y crear voces nuevas.

## Para ti: escuchar y elegir

1. Haz doble clic en **`..\00_ABRIR_VOCES.cmd`** (carpeta `Videos_Rapidos`): arranca un servidor local y abre la web con todas las muestras, buscador y filtros (idioma, familia). Pulsa ▶ para oír y **⭐ para marcar tus favoritas**.
2. **El agente lo sabe solo:** cada ⭐ se guarda al instante en [FAVORITAS.md](FAVORITAS.md) / `FAVORITAS.json`, y la skill del agente manda leerlas antes de elegir voz (si encajan con el vídeo, las usa). Puedes quitar ⭐ cuando quieras; la barra de abajo muestra tu selección y la web indica «● Conectado con el agente» cuando todo se está guardando. Si abres `Escuchar_Voces.html` sin el servidor, funciona para escuchar, pero avisa de que el agente no verá las favoritas.
3. También puedes decirle al agente: «usa `doc_naturaleza`, primero con curiosidad y después con asombro, manteniendo la misma voz» o solo el tipo de vídeo; elegirá según [03_GUIA_VOZ_SEGUN_VIDEO.md](03_GUIA_VOZ_SEGUN_VIDEO.md).
3. Si quieres que suene distinto (más expresiva, otro tono), mira [04_EXPRESIVIDAD_Y_PERSONALIZACION.md](04_EXPRESIVIDAD_Y_PERSONALIZACION.md).

## Regla de interpretación

Una identidad por personaje, emoción e intención según la frase y el contexto. El [plan vocal](04_EXPRESIVIDAD_Y_PERSONALIZACION.md) separa quién habla de cómo habla. CosyVoice 3 añade ese canal al estudio local; Qwen Base sigue disponible para las locuciones anteriores.

## Para el agente editor

Empieza por la skill **`.agents/skills/voces-locucion/SKILL.md`** y por [INDICE_VOCES.md](INDICE_VOCES.md).

## Qué hay en la carpeta

| Archivo / carpeta | Qué es |
| --- | --- |
| `Escuchar_Voces.html` | Web con todas las muestras, filtros y ⭐ de favoritas (se abre con `00_ABRIR_VOCES.cmd`) |
| `FAVORITAS.md` / `FAVORITAS.json` | Tus voces con ⭐: las escribe la web y las lee el agente (no editar a mano) |
| `INDICE_VOCES.md` | Índice compacto para agentes (clave, idioma, uso) — autogenerado |
| `01_CATALOGO_ARQUETIPOS.md` | Ficha de cada voz: descripción de diseño, frase, uso, por qué engancha — autogenerado |
| `02_PALETA_EMOCIONES.md` | Matriz emoción × timbre × idioma — autogenerado |
| `03_GUIA_VOZ_SEGUN_VIDEO.md` | Qué voz, emoción y ritmo para cada tipo de vídeo |
| `04_EXPRESIVIDAD_Y_PERSONALIZACION.md` | Cómo hacerlas menos monótonas y a medida |
| `05_VOCES_VIRALES_Y_FUENTES.md` | Estilos de voz que se usan en vídeos virales, sus equivalentes propios y fuentes |
| `muestras/arquetipos`, `muestras/emociones`, `muestras/bilingue` | Muestras mp3 (−16 LUFS) de cada voz y su prueba en el otro idioma |
| `_wav_originales/` | Audios originales de cada voz (24 kHz) |
| `herramientas/` | `locutor.py` (generar locuciones, crear voces), `generar_biblioteca.py` + `especificaciones.py` (regenerar o ampliar el banco), `construir_indices.py`, `catalogo_voces.json` (fuente de verdad) |

## Cómo está organizado el banco

- **Arquetipo** = *quién habla*: documental, tráiler, teletienda, youtuber, asistente IA, villano, ASMR… (con versión masculina/femenina cuando tiene sentido; ES, EN y latino).
- **Emoción** = *cómo lo dice*: alegre, euforia, asombro, sarcasmo, enfado, grito, tristeza, susurro, miedo, calma, serio, deadpan, épico, pícaro, urgente, orgulloso. La paleta permite escuchar muestras, pero compartir descripción o semilla no garantiza la misma identidad. Para actuar un personaje, mantener su referencia y usar la dirección por toma.
- Cada voz dice si está **verificada en los dos idiomas** («ES+EN»): se clonó su timbre en el otro idioma y Whisper confirmó que lee bien el texto.

## Ampliar el banco

1. Añade una línea en `herramientas/especificaciones.py` (clave, nombre, descripción, frase, semilla, para qué).
2. Ejecuta `generar_biblioteca.py` (solo genera lo que falta) y luego `construir_indices.py`.
3. Para una voz suelta y rápida: `locutor.py nueva-voz …` (queda en la sección «personalizadas» del catálogo).

## Límites

- Whisper comprueba que el **texto** se lee bien, no que suene natural: la última palabra la tiene tu oído.
- Voces generadas por IA: dos tomas con la misma frase y semilla distinta no suenan igual. Si una te gusta, conserva su semilla.
- No hay sincronía labial. Un solo trabajo de síntesis a la vez (una GPU).
- Voces latinas con acento latinoamericano: experimentales.
