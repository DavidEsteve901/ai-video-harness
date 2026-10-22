---
title: Voces de Gemini (API de Google) — guía
status: active
created: 2026-10-21
tags: [project/workspace-launcher, marketing, video, voz, gemini]
---

# Voces de Gemini (API de Google)

Motor **en la nube y opcional** para las locuciones de `Videos_Rapidos`. Convive con el local (Local Voice Studio: Qwen, CosyVoice, Chatterbox). Decisión del usuario, 2026-10-21: las voces locales sonaban sin emoción y con pequeños cortes; las de Google se oyen más naturales y cuestan céntimos. Esto **sustituye, para este motor y con esta clave, la regla anterior de «no usar servicios de voz de pago»**. Seguimos sin clonar a personas reales.

## 1. Preparar (una vez)

La clave de la API de Gemini (proyecto de pago del usuario, con su crédito mensual de desarrollador) vive **solo** en la variable de entorno de usuario `GEMINI_API_KEY`. Nunca en archivos del proyecto, ni en el chat, ni en los registros.

```powershell
[Environment]::SetEnvironmentVariable('GEMINI_API_KEY','pega-aquí-tu-clave','User')
```

Quitarla: `[Environment]::SetEnvironmentVariable('GEMINI_API_KEY',$null,'User')`. Con clave de pago Google no usa lo enviado para entrenar; con la gratuita sí (enviar solo guiones públicos).

## 2. Dónde está cada cosa

| Qué | Archivo (en `Biblioteca_Voces/`) |
|---|---|
| Herramienta (CLI) | `herramientas/gemini_tts.py` |
| 30 voces base con género, estilo oficial y descripción | `gemini_voces_base30.json` |
| Voces castellanas de la biblioteca ampliada (es-ES, 22) | `gemini_voces_es-ES.json` |
| Voces latinas (es-419, 86) | `gemini_voces_es-419.json` |
| Voces propias creadas por nosotros (id `voice_…`) | `gemini_voces_propias.json` (se rellena al crear) |
| Registro de gasto (una línea por llamada) | `gemini_uso.jsonl` → `python gemini_tts.py gasto` |
| Pruebas y tomas de cada vídeo | `01_Proyectos/VR0XX/03_Recursos/voz/gemini/` |

Regenerar los catálogos: `python gemini_tts.py voces --idioma es` (castellano) o `--idioma latino`.

## 3. Elegir voz según el vídeo

| Vídeo | Probar primero | Por qué |
|---|---|---|
| Explicador / tutorial para España | `es-es-training-9` (23 años, anfitrión de vídeos instructivos), `es-es-training-11`, `es-es-training-12` (ella) | Acento castellano, tono de instructor |
| Humor / TikTok enérgico | `es-es-commercial-7` (ella, rápida y enérgica), `Puck`, `Fenrir`, `Sadachbia` | Energía alta |
| Producto / profesional | `es-es-concierge-4`, `Charon`, `Iapetus`, `Erinome` | Seguro y claro |
| Cercano, tipo colega | `es-es-csagent-3`, `Achird`, `Zubenelgenubi`, `Umbriel` | Conversacional |
| Íntimo / historias | `Enceladus`, `Sulafat`, `es-es-podcaster-7` | Suave o cálido |
| Dramático / épico | `Algenib`, `Orus`, `Alnilam` | Grave o firme |
| Latino | las `es-419-*` del catálogo (Argentina, México…) | Otro acento |

Las voces `es-es-*` hablan **castellano de forma nativa**; las 30 base son multilingües y su acento en español hay que oírlo. Filtrar por género/edad/descripción en los JSON. Una voz no está «aprobada» hasta que la oiga el usuario.

## 4. Emoción: el estilo va aparte del texto

El texto es una **transcripción literal**: lo que pongas ahí se lee en voz alta. Para el tono usa `--estilo` (campo `speech_metadata.style`), una frase corta por toma: «curioso e ilusionado», «tranquilizador y seguro», «susurrando con urgencia».

- Pausas y sonidos dentro del texto con etiquetas **en inglés**: `<short pause>`, `<long pause>`, `<sigh>`, `<laugh>`, `<chuckle>`, `<gasp>`, `<whispers>`…
- Una palabra en MAYÚSCULAS recibe énfasis.
- Evitar bloques largos de «notas del director» en el texto: provocan que la voz cambie entre tomas (y en mis pruebas el modelo las leyó en voz alta).
- Rasgos permanentes (edad, timbre, acento) van en la voz, no en el estilo. Para eso, voz propia (sección 5).

## 5. Voces propias guardadas (Voice design)

Se crea una voz describiéndola; queda guardada en el proyecto de Google (**máximo 200, caducan al año sin uso**) y se usa por su id `voice_…` como cualquier otra.

```powershell
python gemini_tts.py crear --nombre "Narrador cálido" --genero male --idioma es-ES --descripcion "Hombre de unos treinta años de España, voz cálida y cercana, ritmo natural, sonríe al hablar" --muestra muestra.wav
```

Anotar el id y su descripción en `gemini_voces_propias.json`. El coste de crear una voz no está publicado: probar con 1 y mirar el panel de Google.

## 6. Cuánto cuesta y límites

- Audio = **25 tokens por segundo**. Coste = tokens de salida × precio + tokens de entrada (texto, despreciable).
- Precios hasta 31-12-2026 (por millón de tokens, salida de audio): `gemini-3.8-flash-tts` 9 $, `gemini-3.8-flash-lite-tts` 6 $. **Desde 1-1-2027 se duplican.** Entrada de texto 0,50 $.
- Un vídeo de 30 s ≈ 750 tokens ≈ **0,7 céntimos** (Flash) o 0,45 céntimos (Flash-Lite). Diez versiones de ese vídeo ≈ 7 céntimos; 100 ≈ 0,70 $.
- Referencia de ElevenLabs (estimación de fuentes de terceros, ~0,15–0,30 $/min): 15–30 veces más caro.
- **Límite de ritmo**: ráfagas largas devuelven `429`. La herramienta reintenta sola (15 s, 30 s…) y deja 3–4 s entre tomas. Para ráfagas mayores, Google sube el nivel automáticamente con el gasto acumulado (Tier 2 desde 100 $). Ver límites activos en aistudio.google.com/rate-limit.
- Seguimiento: `python gemini_tts.py gasto`. La herramienta estima el coste con la tarifa publicada; el panel de Google es la fuente de verdad.

## 7. Uso rápido

```powershell
$py = 'C:\Herramientas\local-voice-studio\.venv\Scripts\python.exe'
$h  = '...\Videos_Rapidos\Biblioteca_Voces\herramientas'
# una frase
& $py "$h\gemini_tts.py" decir --voz es-es-training-9 --estilo "curioso e ilusionado" --texto "¿Qué le pedirías primero?" --salida toma.wav
# un guion entero (plan_vocal.json) con un estilo por toma (estilos.json: {"v1": "...", "v2": "..."})
& $py "$h\gemini_tts.py" plan --plan plan_vocal.json --estilos estilos.json --voz es-es-training-9 --salida carpeta
```

Salida: WAV 24 kHz mono, una toma por línea (`0001.wav`…). Como con cualquier motor: recortar colas con Whisper, comprobar palabras, anotar voz/estilo/modelo en el proyecto y **dejar la decisión final al oído del usuario**.