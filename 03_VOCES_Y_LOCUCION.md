---
title: Voces y locución
status: active
created: 2026-10-20
tags: [project/workspace-launcher, marketing, video, voz]
---

# Voces y locución para vídeos

> [!tip] Biblioteca de Voces (2026-10-20)
> Ya hay un banco organizado de voces originales (arquetipos ES/EN/latino + paleta de emociones), con muestras para escuchar, índice para agentes y la herramienta `locutor.py`. Empieza por [Biblioteca_Voces/INDICE_VOCES.md](Biblioteca_Voces/INDICE_VOCES.md) y la skill `.agents/skills/voces-locucion`. Este documento conserva la decisión sobre clonar a personajes reales y la receta histórica de VR003.

## Interpretación contextual actual

La [guía de expresividad](Biblioteca_Voces/04_EXPRESIVIDAD_Y_PERSONALIZACION.md) fija una voz por personaje y dirección por frase. CosyVoice 3 añade instrucciones de emoción con esa referencia en el estudio local. La receta Qwen de abajo es histórica y no equivale a control emocional por instrucciones.

## Decisión importante: ¿voz de Tony Stark / Robert Downey Jr.?

**No se clona** (ni con Local Voice Studio ni con servicios externos). Motivos:

1. Es la voz de una persona real (el actor y su doblaje en español): imitarla con IA para **promocionar un producto** sugiere un respaldo que no existe y choca con derechos de imagen/voz y con las políticas de las plataformas sobre voces sintéticas de terceros.
2. Local Voice Studio lo prohíbe en sus reglas: *«No añadas voces externas sin procedencia/permiso»* (`AGENTS.md`) y pide confirmar autorización al guardar una referencia.
3. No hace falta: el chiste funciona con **un tipo seguro, sarcástico y rápido** (el arquetipo), no con una voz concreta.

Lo que sí se hace:

| Opción | Cuándo | Estado |
| --- | --- | --- |
| **Voz diseñada original** («Genio sarcástico»), estilo arquetipo, sin imitar a nadie | Por defecto para chulería/ironía de meme | ✅ creada |
| **Tu voz** (`<voz-propia>`, grabada por ti) | Cuando quieras que hable «el creador» | ✅ en la biblioteca |
| **Audio original del clip de la película** como muestra corta de meme (el grito, «Wake up…») | Solo como recurso de meme breve, origen anotado | ✅ ya usado; riesgo de reclamación |
| Voces de biblioteca de pago (ElevenLabs) | Si se paga plan con licencia comercial; el plan gratuito **no** la tiene | ⬜ |

## Local Voice Studio (lo que hay)

- Proyecto: `C:\Herramientas\local-voice-studio` · app `http://127.0.0.1:7860` · se inicia con `scripts\start.ps1 -NoBrowser`.
- Local, sin claves ni coste. Motores: **Qwen3-TTS 1.7B** (recomendado en español, clonación con referencia propia y *VoiceDesign*) y VibeVoice 1.5B (inglés/diálogo; español experimental). GPU: RTX 4070.
- Voces en biblioteca: `<voz-propia>-…`, narradores del Launcher (ES/EN), voces de prueba y **`genio-sarcastico-stark-style-original--6c6d75`**.
- Documentación del propio proyecto: `README.md` y `docs/AGENTES.md` (API, CLI, guiones JSON).

### La voz «Genio sarcástico (Stark-style original)»

Creada el 2026-10-20 con *Qwen VoiceDesign* (no parte de ninguna grabación de nadie):

> Hombre adulto, voz grave y algo rasposa, seguridad de genio millonario cínico. Habla rápido, con ironía y chulería simpática, pausas cortas con media sonrisa, remata las frases con tono seco y divertido. Estilo narrador de meme, mucha energía.

Idioma `es`, acento «España, neutro», semilla 7.

### Receta usada en VR003

1. Guion por líneas cortas (≤ 2–3 s de habla cada una).
2. Trabajo `mode: segments`, `engine: qwen-base-1.7b`, `voices: {Genio: <id>}`, `settings: {seed: 11, max_tokens: 2048, speed: 1.08}`.
3. Descargar las tomas `GET /api/jobs/{id}/files/000N.wav`.
4. Post-proceso con ffmpeg: recortar silencios de los bordes y acelerar un 10 % (`atempo=1.1`) para que suene más ágil; en el montaje se normaliza a −15 LUFS.
5. Revisión Whisper (`POST /api/jobs/{id}/review`): comprueba el **texto**, no la naturalidad → escuchar siempre. En VR003 una toma leyó «palmadas» como «palmaras»: si pasa, regenerar con otra semilla (probar 3–4).

Esqueleto de la llamada (token en `data\api-token`, nunca en el código ni en el chat):

```python
import json, urllib.request
from pathlib import Path
tok = Path(r'C:\Herramientas\local-voice-studio\data\api-token').read_text().strip()
def api(path, payload):
    req = urllib.request.Request('http://127.0.0.1:7860'+path, data=json.dumps(payload).encode(),
        headers={'X-Local-Token': tok, 'Content-Type': 'application/json'})
    return json.load(urllib.request.urlopen(req))
job = api('/api/jobs', {'project': {'name': 'VR00X', 'engine': 'qwen-base-1.7b', 'mode': 'segments',
    'voices': {'Genio': 'genio-sarcastico-stark-style-original--6c6d75'},
    'settings': {'seed': 11, 'max_tokens': 2048, 'speed': 1.08},
    'segments': [{'speaker': 'Genio', 'language': 'es', 'text': 'Frase.', 'start': 0, 'pause_ms': 200}]}})
```

## Limitaciones a tener presentes

- El español de Qwen es bueno pero no perfecto: nombres propios en inglés («Workspace Launcher») y palabras con *d* intervocálica pueden salir raros. **Escuchar cada línea antes de publicar.**
- No hay sincronía labial ni garantía de que una etiqueta de acento cambie la voz.
- Solo se carga un motor a la vez; no lanzar dos generaciones en paralelo.
- Si una línea dura más que su hueco: acortar el texto, acelerar un poco (`atempo` hasta ~1,1–1,15) o alargar la escena. No cortar palabras.

## Ideas de voces nuevas (cuando haga falta)

Narrador de documental de naturaleza (para «el humano en su hábitat: abriendo 12 apps a mano»), locutor de teletienda, asistente robótico educado y sarcástico, voz de «sistema» tipo aviso. Todas **diseñadas por descripción**, sin copiar a nadie.
