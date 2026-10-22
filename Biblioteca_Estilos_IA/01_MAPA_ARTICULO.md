# Mapa del artículo completo de El Telar

Fuente: [Herramientas de vídeo con IA](https://eltelar.es/articulos/video-ia-herramientas.html), leída completa el **21-10-2026**; el enlace del usuario apunta a `#estilos-video`. Esto es un inventario comentado y una síntesis propia, no una copia del artículo. Los detalles operativos se contrastan con las fuentes primarias enlazadas.

## Síntesis

El texto separa generación de planos, edición y animación programada. Explica la continuidad temporal, los límites del movimiento complejo y el trabajo por clips. Para escribir prompts incorpora acción, cámara y evolución durante el plano. Propone conservar referencias visuales y archivos editables, montar después y contar los intentos al presupuestar. Trata también procedencia, contenido sintético y voces. A continuación recorre herramientas de captura, montaje, compresión, recortes y animación, y dedica una sección a cinco propuestas de estilo. La parte más útil para este proyecto es ampliar los recursos visuales sin perder el control de las demos reales.

## Cobertura por tema

| Tema presente | Qué conservar para nuestro trabajo | Referencia para ampliar o verificar |
|---|---|---|
| Generación de vídeo y coherencia temporal | Continuidad del sujeto, vestuario, escenario y movimiento; revisar el clip entero | [Veo](https://ai.google.dev/gemini-api/docs/veo), [Omni](https://ai.google.dev/gemini-api/docs/omni) |
| Comparativa de modelos | Veo 3.1, Gemini Omni Flash, Kling 3.0 y Runway Gen-4.5; separar modelo de plataforma | [Modelos Runway](https://docs.dev.runwayml.com/guides/models/), [Kling](https://klingai.com/) |
| Retirada de Sora | El artículo lo trata como herramienta retirada; no convertirlo en dependencia del proyecto | Registro histórico del artículo; verificar cualquier alternativa en documentación oficial antes de usarla |
| Prompt de vídeo | Acción del sujeto, cámara, luz, duración y continuidad como campos separados | Receta propia más abajo |
| Producción con varios planos | Referencia visual estable, planos revisados y montaje editable | [Recetas locales](02_RECETAS_ESTILOS.md) |
| Presupuesto por intentos | Coste = segundos generados × tarifa × intentos; añadir recursos auxiliares | [Precios Gemini](https://ai.google.dev/gemini-api/docs/pricing), [Runway](https://runway.com/pricing) |
| Derechos y contenido sintético | Registrar recursos y condiciones; revisar requisitos aplicables al publicar | [Comisión Europea](https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content) y normas de la plataforma elegida |
| SupoClip | Recortes, reencuadre de caras y captions desde una transcripción | [Repositorio](https://github.com/FujiwaraChoki/supoclip) |
| Shotcut | Montaje manual por pistas y exportación | [Oficial](https://shotcut.org/) |
| Claude Animation Base | Animación p5.js / p5.brush con personaje y poses | [Repositorio](https://github.com/JohnHeibel/ClaudeAnimationBase) |
| HandBrake | Conversión y compresión de una copia | [Oficial](https://handbrake.fr/) |
| Lemo-Opuscar | 51 estilos de cine programados; la obra OPUSCAR 98 es otro catálogo de ejemplos | [Repositorio](https://github.com/lemomo-ai/lemo-opuscar) |
| OBS Studio | Captura de pantalla, cámara y audio | [Oficial](https://obsproject.com/) |
| onetake | Propuesta de motion con continuidad; licencia restrictiva para uso comercial | [Repositorio](https://github.com/feitangyuan/onetake) |
| Claude Motion | Animación mediante código en el chat de Claude | [Ayuda oficial](https://support.claude.com/en/articles/17454997-get-started-with-claude-motion) |
| HyperFrames | HTML/CSS y animación con render a vídeo | [Repositorio](https://github.com/heygen-com/hyperframes) |
| YouTube Agent Skill | Once módulos de guion, edición, packaging, analítica y planificación | [Repositorio](https://github.com/Jakeschincariol/youtube-agent-skill) |
| VoiceStudio | TTS y doblaje en una aplicación diferente a nuestra instalación local | [Repositorio](https://github.com/debpalash/VoiceStudio) |
| Cinco estilos del reel | HyperFrames, onetake, Collage B-roll, Animation Base, Lemo | [Recetas y selección local](02_RECETAS_ESTILOS.md) |
| FAQ | Vídeo largo, experiencia de edición, audio variable, vídeo de entrada, región, retención de archivos y etiquetado | Enlaces oficiales anteriores; verificar cada límite al utilizarlo |

## Tarifas contrastadas el 21-10-2026

Datos de las páginas oficiales; son una fotografía de consulta, no una autorización de gasto. USD; el total real puede incluir entrada, otras salidas, impuestos, cambio y herramientas auxiliares.

| Modelo / opción | Coste publicado | 8 s de salida |
|---|---|---|
| Veo 3.1 Standard | 0,40 USD/s 720p–1080p; 0,60 USD/s 4K | 3,20 USD a 720p |
| Veo 3.1 Fast | 0,10 USD/s 720p; 0,12 USD/s 1080p; 0,30 USD/s 4K | 0,80 USD a 720p |
| Veo 3.1 Lite | 0,05 USD/s 720p; 0,08 USD/s 1080p; sin 4K | 0,40 USD a 720p |
| Gemini Omni Flash | Aproximadamente 0,10 USD/s a 720p de salida, facturado por tokens | Aproximadamente 0,80 USD de salida |
| Runway Standard | 625 créditos/mes; 12 USD/mes con facturación anual, 15 USD mensual; unos 52 s de Gen-4.5 | A 12 créditos/s, 96 créditos |

[Tarifas Google](https://ai.google.dev/gemini-api/docs/pricing), [tarifas Runway](https://runway.com/pricing). **Advertencia operativa:** la misma documentación de Google anuncia el cierre de Veo 3.1 Preview el **22-10-2026**. Se conserva la tabla para interpretar el artículo; no se recomienda iniciar una integración con esos endpoints.

Otros planes citados en el artículo: Runway Free (125 créditos una vez), Pro (28 USD/mes anual o 35 mensual) y Max (76 anual o 95 mensual). Comprobar las condiciones de cada modalidad al contratar. La tarifa de Kling se deja sin cifra: no se ha verificado una tarifa operativa aquí.

## Límites que afectan a una decisión

La documentación de [Omni](https://ai.google.dev/gemini-api/docs/omni) excluye actualmente la edición y extensión de vídeos subidos en el EEE, Suiza y Reino Unido. España está en el EEE. No confundir esa operación con generar vídeo nuevo o editar el generado por el modelo.

El artículo recoge límites de Veo como 4/6/8 segundos y conservación temporal en servidor; por la retirada anunciada no se incorporan como contrato estable de nuestras skills. La duración de Kling o de un modelo de Runway también debe leerse por endpoint, resolución y modo, no por marca comercial.

Claude Motion sigue documentado como beta para Team y Enterprise y permite exportar MP4. No es un generador de escenas realistas ni una skill local de esta carpeta. [Ayuda oficial](https://support.claude.com/en/articles/17454997-get-started-with-claude-motion).

Las observaciones editoriales del artículo sobre física, reintentos o calidad por modelo no son un benchmark reproducible de este proyecto. No convertir «puede fallar» en una garantía comparativa ni presupuestar un número universal de intentos.

## Plantilla propia para un plano generativo opcional

```
Función narrativa: qué debe entender o sentir el espectador.
Sujeto y contexto: elementos imprescindibles; referencia visual si existe.
Acción: estado inicial → acción concreta → estado final.
Cámara: encuadre, dirección, velocidad y punto de reposo.
Continuidad: qué debe permanecer igual durante el plano.
Duración / formato: los que admite el modelo seleccionado y requiere la escena.
Audio: sin audio, ambiente o diálogo; texto exacto si procede.
Integración: escena destino, hueco de texto y recursos editables que se añaden después.
Revisión: identidad, física, texto accidental, encuadre y sonido.
```

Para nuestras demos, usar la grabación del producto y animar el encuadre. Esta plantilla sirve para un apoyo ficticio o una previsualización, no para inventar funciones de la app. No se han copiado los prompts del artículo.
