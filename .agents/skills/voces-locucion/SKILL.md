---
name: voces-locucion
description: Elegir y generar voces en off para los vídeos de Videos_Rapidos con la Biblioteca de Voces y el proyecto local Local Voice Studio (ES/EN, arquetipos, emociones, efectos, voces a medida). Usar siempre que un vídeo necesite locución, diálogo entre personajes, voz de asistente, narrador o cambiar el tono/emoción de una voz.
---

# Voces y locución

Toda la voz de los vídeos sale del proyecto local **Local Voice Studio** (Qwen3-TTS y CosyVoice 3, generación local sin una API de voz de pago) y de la **Biblioteca de Voces** ya creada. No clones a personas reales. **Motor en la nube autorizado (decisión del usuario, 2026-10-21): voces de la API de Gemini** con la clave de la variable de entorno `GEMINI_API_KEY`; es el único servicio de pago permitido, cuesta céntimos por vídeo y su gasto queda en `Biblioteca_Voces/gemini_uso.jsonl`. Cuándo usarlo, cómo elegir voz, emoción por toma, voces propias y costes: [06_GEMINI_VOCES.md](../../../Biblioteca_Voces/06_GEMINI_VOCES.md). Para voz con emoción natural pruébalo antes que los motores locales; no uses otros servicios de pago.

## Dónde está todo (en el PC de David)

| Qué | Ruta |
| --- | --- |
| Biblioteca de Voces (muestras, índices, herramientas) | `<RAIZ_REPO>\Biblioteca_Voces\` (desde esta skill: `../../../Biblioteca_Voces/`) |
| **Índice para agentes** (léelo primero) | [INDICE_VOCES.md](../../../Biblioteca_Voces/INDICE_VOCES.md) |
| Fuente de verdad (ids, descripciones, semillas) | `Biblioteca_Voces\herramientas\catalogo_voces.json` |
| Herramienta de línea de comandos | `Biblioteca_Voces\herramientas\locutor.py` |
| Proyecto Local Voice Studio | `C:\Herramientas\local-voice-studio` (servidor `http://127.0.0.1:7860`; `locutor.py` lo arranca solo; token en `data\api-token`, nunca lo imprimas) |
| **Favoritas del usuario** (⭐ de la web; léelas antes de elegir) | `Biblioteca_Voces\FAVORITAS.md` y `FAVORITAS.json` |
| Web para escuchar y marcar favoritas (el usuario elige de oído) | `Videos_Rapidos\00_ABRIR_VOCES.cmd` (arranca `herramientas\servidor_voces.py` en `127.0.0.1:7861` y abre `Escuchar_Voces.html`) |

Las voces viven en el catálogo del estudio (`C:\Herramientas\local-voice-studio\data\voices\`, solo en este PC). Si falta una, el catálogo de Drive conserva su descripción y semilla para regenerarla con `herramientas\generar_biblioteca.py`.

## Flujo para poner voz a un vídeo

0. **Mira primero las favoritas del usuario**: lee [FAVORITAS.md](../../../Biblioteca_Voces/FAVORITAS.md) (o `python locutor.py favoritas`). Son las voces que David marcó con ⭐ en la web; si alguna encaja con el encargo, **úsala y dilo**. Si ninguna encaja, elige otra del índice y explica brevemente por qué. Si la lista está vacía, sigue con el paso 1. No edites ese archivo: lo escribe la web (`00_ABRIR_VOCES.cmd`).
1. **Entender el vídeo**: idioma, tono, duración, quién habla (narrador, personaje, asistente). Lee [03_GUIA_VOZ_SEGUN_VIDEO.md](../../../Biblioteca_Voces/03_GUIA_VOZ_SEGUN_VIDEO.md) para la elección por tipo de vídeo.
2. **Fijar la identidad de cada hablante**: elige una voz de la biblioteca por personaje y conserva su clave, `voice_id` y referencia. Si ya existe reparto o voz elegida, respétalo. **Cambiar emoción no autoriza a cambiar de voz**, diseñar otra con la misma semilla ni sustituirla por una clave de la paleta. Con varias voces, aplica esta continuidad a cada personaje por separado.
3. **Dirigir cada frase según el contexto**: decide emoción o estado, intención, intensidad y ritmo según lo que dice, a quién se dirige y lo que ocurre en imagen. Define un arco cuando cambie la situación: frustración → sorpresa → alivio, por ejemplo, manteniendo la misma identidad. Neutral, sobrio o contenido también son elecciones de interpretación; no exagerar ni usar el mismo estado para todo por defecto. Registra el reparto fijo y las indicaciones por toma en `plan_vocal.json`. Consulta [dirección contextual y límites reales del motor](../../../Biblioteca_Voces/04_EXPRESIVIDAD_Y_PERSONALIZACION.md).
4. **Escribir el guion para el oído**: frases con una longitud que permita entender la idea, una idea por línea, puntuación que marque el ritmo, números y siglas escritos como se dicen, nombres propios en inglés (p. ej. «Workspace Launcher») probados antes. Una línea por toma facilita sincronizar.
5. **Generar con el plan contextual**:
   ```powershell
   $py = 'C:\Herramientas\local-voice-studio\.venv\Scripts\python.exe'
   $h  = '<RAIZ_REPO>\Biblioteca_Voces\herramientas'
   & $py "$h\locutor.py" decir --plan plan_vocal.json --lang es --salida "<carpeta del vídeo>\03_Recursos\voz\locucion"
   ```
   El [ejemplo de plan](../../../Biblioteca_Voces/herramientas/ejemplo_plan_vocal.json) fija una voz por personaje y emoción/intención/intensidad por toma. `--preparar` guarda el plan sin sintetizar. `--motor auto` usa CosyVoice con dirección contextual; para guiones antiguos sin dirección conserva Qwen. CosyVoice debe estar instalado con `scripts/install-cosyvoice.ps1` en el estudio. `guion.txt` y `[clave_voz] texto` siguen disponibles para guiones simples, pero cambiar la etiqueta significa cambiar de voz, no de emoción. `--fx` aplica un efecto (radio, robot, trailer, megafono, eco…; `fx-lista`). `--revisar` pasa Whisper para detectar palabras mal leídas.
6. **Comprobar identidad e interpretación**: escucha las tomas consecutivas: debe reconocerse al mismo personaje y la emoción debe encajar con el texto, la imagen y el momento. Comprueba que una sorpresa no se convierte en grito, que el remate conserva su intención y que las instrucciones no se han pronunciado. Whisper valida el **texto**, no la identidad vocal, la emoción ni la naturalidad. Si una toma suena rara o lee mal una palabra (p. ej. «palmadas»→«palmaras»), vuelve a generar con otra `--semilla` (prueba 3–4). Nunca declares una voz «aprobada»: la última palabra es el oído del usuario; deja la locución en la carpeta del vídeo y avisa.
7. **Montar**: copia `locucion_tomas\0001.wav…` (o la mezcla) a los assets del proyecto Remotion; usa `locucion.json` (inicio y duración de cada toma) para fijar tiempos de texto en pantalla y cortes. Las líneas más largas que su hueco: acorta el texto o acelera (`--acelerar`, hasta ~1,15) antes de cortar palabras. Baja el pico tras renderizar (`alimiter`).
8. **Registrar**: guarda dentro del proyecto el reparto, `plan_vocal.json`, el `.plan.json` preparado, tomas originales y procesadas, emoción/intención/intensidad, semilla, motor y efecto de cada intervención; anota lo que se haya revisado. Si una toma falla, regenera ese fragmento manteniendo la referencia. Anota qué voz se usó y si añadiste una voz nueva, que quede en `catalogo_voces.json`.

## Reglas

- **Identidad y actuación son cosas distintas.** CosyVoice 3 recibe emoción y dirección por frase con la misma referencia. Qwen Base no aplica ese canal: no digas que una etiqueta, ecualización o `--fx susurro` crean una emoción real. La intensidad no mide naturalidad ni garantiza una interpretación exacta. Si el resultado deriva de timbre, repite con la referencia fija y menor intensidad; no aceptes el cambio como otra emoción.
- **Solo voces diseñadas/originales.** No clones ni imites a actores, famosos, creadores ni personajes con voz de actor (Tony Stark/RDJ, cartoons, políticos…). El estilo («listillo millonario», «trailer épico») se consigue con arquetipos propios. La voz propia del autor (`<voz-propia>-…`) solo si él lo pide expresamente.
- No publiques ni subas nada sin aprobación del usuario.
- **Una síntesis a la vez** en la GPU del estudio (RTX 4070): si hay otro trabajo en curso, espera. El servidor puede estar ya abierto; no lo reinicies sin necesidad.
- Español: el modelo es bueno, no perfecto. Revisa nombres en inglés, siglas y palabras con *d* intervocálica. Para público latino usa las voces de «Español latino» (experimentales).
- Las muestras de la biblioteca ya están normalizadas a −16 LUFS; las locuciones generadas por `locutor.py` también.
- Si el servidor no responde: `C:\Herramientas\local-voice-studio\scripts\start.ps1 -NoBrowser`. Si falla por memoria, cierra otras apps de GPU.

## Más recursos

- Cómo hacer una voz más expresiva, menos monótona, o personalizarla: [04_EXPRESIVIDAD_Y_PERSONALIZACION.md](../../../Biblioteca_Voces/04_EXPRESIVIDAD_Y_PERSONALIZACION.md).
- Estilos de voz que se usan en vídeos cortos virales y su equivalente propio: [05_VOCES_VIRALES_Y_FUENTES.md](../../../Biblioteca_Voces/05_VOCES_VIRALES_Y_FUENTES.md).
- Receta histórica de VR003 y límites del motor: [03_VOCES_Y_LOCUCION.md](../../../03_VOCES_Y_LOCUCION.md).
- Para ritmo, ganchos y retención del vídeo en sí: skill `video-planificacion-retencion`; para el montaje: `remotion-produccion`.
