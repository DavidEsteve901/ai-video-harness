# Una misma voz, distintas interpretaciones

Decisión del usuario, 20 de octubre de 2026: **mantener la voz de cada personaje y variar cómo habla según el contexto**. La elección de timbre identifica al hablante. Emoción, intención, energía, pausas y entonación construyen su interpretación.

## Regla para el agente editor

Fijar el reparto una vez: personaje → clave de biblioteca → `voice_id` → referencia. Para cada frase decidir qué siente, qué pretende comunicar y con qué intensidad lo expresa. Si hay varios personajes, cada uno mantiene su voz a lo largo del vídeo y de sus variantes, salvo que el usuario pida cambiarla.

No sustituir un narrador por `es_H_enfado`, `es_H_grito` u otra clave para cambiar su estado. Las voces de la paleta son referencias de interpretación y, cuando se generan, identidades independientes; compartir descripción o semilla no garantiza que sean la misma persona. `nueva-voz --base --emocion` crea otra voz: no es el procedimiento para actuar una frase de un personaje existente.

## Motor de interpretación local

En `C:\Herramientas\local-voice-studio`, **CosyVoice 3** se añade como `cosyvoice3-0.5b`: utiliza la misma referencia de voz y recibe la dirección en el canal separado `inference_instruct2`. Admite español y estados por frase. La referencia, los motores y los archivos siguen siendo locales; no requiere una API de síntesis de pago. [Repositorio oficial](https://github.com/QwenAudio/CosyVoice).

Qwen Base sigue disponible para las locuciones anteriores, pero no aplica instrucciones emocionales por frase. VoiceDesign diseña una referencia distinta y no se usa para sustituir de emoción a un personaje. La nueva capacidad mantiene la referencia; la identidad percibida y la naturalidad deben comprobarse escuchando, especialmente con estados intensos o al cambiar de motor.

## Cómo preparar el guion

El [ejemplo editable](herramientas/ejemplo_plan_vocal.json) tiene un personaje con tres estados: frustración contenida, asombro y alivio. Es un ejemplo de dirección, no una locución aprobada.

| Campo | Qué decide el agente |
| --- | --- |
| `personajes.<nombre>.voz` | Clave fija de la biblioteca; respetar la elegida por el usuario |
| `tomas[].texto` | Solo las palabras que deben oírse; las instrucciones van aparte |
| `emocion` | `neutral`, `alegria`, `tristeza`, `enfado`, `asombro`, `calma`, `susurro`, `serio`, `urgencia` o `sarcasmo` |
| `intencion` | Para qué dice esa frase: tranquilizar, descubrir, provocar complicidad, advertir… |
| `intensidad` | De 0 a 1; se traduce en dirección contenida, moderada o intensa. Cero pide neutralidad. No es un porcentaje logrado ni un mando continuo exacto |
| `direccion` | Matiz interpretativo adicional; no cambiar identidad, edad ni acento del personaje |
| `ritmo` | Factor de velocidad de esa toma; 1 conserva el resultado generado |
| `pausa_ms` | Pausa después de la toma; 0 une directamente con la siguiente |

No hace falta que cada frase cambie de estado. En un tutorial, la calma y claridad pueden mantenerse; en un chiste, un contraste pequeño puede ser más natural que gritar. Las emociones se eligen por lo que ocurre, no por una receta fija de retención.

## Generar con locutor

```powershell
$py = 'C:\Herramientas\local-voice-studio\.venv\Scripts\python.exe'
$h = '<RAIZ_REPO>\Biblioteca_Voces\herramientas'
& $py "$h\locutor.py" decir --plan plan_vocal.json --preparar --salida .\locucion
& $py "$h\locutor.py" decir --plan plan_vocal.json --salida .\locucion
```

`--preparar` valida el reparto y guarda `.plan.json` sin usar GPU ni crear audio. Al generar, `--motor auto` elige CosyVoice para un plan contextual; cada toma conserva su personaje y referencia. En una frase simple también puedes usar `--voz CLAVE --texto "..." --emocion asombro --intencion "Sorpresa contenida"`.

Para API directa, cada segmento mantiene `speaker`, `text` y `language`; añade `emotion`, `emotion_intensity`, `intention` y `style`. El mapa `voices` fija los IDs por personaje. La dirección viaja separada del texto; cambiarla invalida la caché de esa toma para que el nuevo estado se genere de verdad.

## Revisión y archivos del proyecto

Conserva `plan_vocal.json`, el plan preparado, el guion, las tomas originales y las procesadas en `03_Recursos/voz/` del vídeo. El `.json` final incluye personaje, voz, ID, dirección, semilla y duración de cada toma para sincronizarla en Remotion.

Escuchar tomas consecutivas y revisar continuidad, intención, pronunciación y encaje con imagen. Si cambia demasiado el timbre, bajar intensidad o regenerar con la referencia fija. Ecualizar, subir volumen o cambiar el pitch no sustituye una interpretación; Whisper comprueba palabras, no actuación. Si aún no se ha escuchado, registrarlo como pendiente y no declarar conseguida la emoción.
