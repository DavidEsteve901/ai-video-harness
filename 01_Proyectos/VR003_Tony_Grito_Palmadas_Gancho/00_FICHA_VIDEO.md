---
title: "VR003 — Tony gritando → «Jarvis,» → «Este tío» → palmadas"
id: VR003
status: edicion
created: 2026-10-20
tags: [project/workspace-launcher, marketing, video-corto]
---

# VR003 — Tony grito + palmadas (gancho dopamínico)

> [!info] Idea
> **Quiero hacer un vídeo sobre:** el meme de Tony Stark gritando como gancho gracioso → con voz irónica de fondo → enseñar la demo de las palmadas (sin hablar durante la demo, solo editada rápido) → «este tío» señalado con círculo y flecha.
> **Lo que me ha inspirado:** los recursos de meme de la carpeta `Tony Stark` y la demo de las palmadas.
> **Próxima acción:** revisar con el usuario; sacar las dos versiones (con voz y sin voz).

## Versión V2 — «Tony se entera» (2026-10-20)

> [!tip] Giro de planteamiento (pedido por el usuario)
> V1 era un anuncio con chistes (problema → solución → logo). V2 es **un chiste que no vende nada**: sin logo, sin nombre de la app, sin eslogan ni «ni un clic ni un drama». Si a alguien le interesa, preguntará en comentarios y se le responde (ver [TEXTOS_V2_ES](06_Publicacion/TEXTOS_V2_ES.md)). No se fuerza nada.

**Chiste:** Tony se entera de que un tío abre todo su ordenador con dos palmadas, se hunde (plantilla «Jarvis,») y acaba con «Jarvis, tenemos que hablar». La app solo aparece como lo que el tío hace, nunca como mensaje.

| Tiempo | Qué se ve | Qué se oye | Texto |
| --- | --- | --- | --- |
| 0–1,5 | Tony gritando a pantalla completa | Grito original (se corta seco) | «TONY STARK CUANDO SE ENTERA:» |
| 1,5–7,7 | La franja de texto de la plantilla se mantiene y **la imagen de abajo cambia en cada frase**: Tony hundido («Jarvis, hay un tío») → taller con hologramas («que abre todo su ordenador») → chasquido del guantelete («con solo dos palmadas», «dos palmadas.» subrayado) | Voz con pausas dramáticas, palabra a palabra con el texto + teclitas y un barrido suave en cada cambio de imagen | «Jarvis, hay un tío que abre todo su ordenador con solo dos palmadas.» |
| 7,7–12,9 | **Demo real** (tu mesa, 3 pantallas): círculo en las manos que dan las palmadas + «ESTE TÍO»; palmadas reales; ventanas a ×2,3 con **cámara que se acerca a cada monitor** | Palmadas reales + golpe; **un sonido suave por cada ventana que aparece de verdad** (sincronizado con la grabación). Sin riser ni boom. Sin voz | «ESTE TÍO» · «¡CLAP!» ×2 · «SIN TOCAR NADA» |
| 12,9–15,8 | Primer plano de Tony con el HUD de Jarvis mirando a cámara | *«Jarvis…» (pausa de 1 s) «…tenemos que hablar.»* + boom y corte a negro | «Jarvis, tenemos que hablar.» |

- **Archivos V2:** `05_Exportaciones/VR003_V2_ConVoz_1080x1920_60fps.mp4` · `…V2_SinVoz…` · [fotogramas de revisión](05_Exportaciones/VR003_V2_revision_fotogramas.png). La V1 sigue intacta.
- **Proyecto:** mismo `04_Edicion/Remotion_VR003/` → composiciones `VR003-V2-ConVoz` / `VR003-V2-SinVoz`; tiempos y textos en `edit.v2.json`, montaje en `src/VR003V2.tsx`.
- **Voz (cambiada en la 2ª ronda de retoques):** voz nueva original «Hundido dramático (VR003 V2)» diseñada con VoiceDesign para dar más entonación (tragedia cansada, voz quebrada, pausas largas, cierre frío); no clona a nadie. 4 tomas en `03_Recursos/voz_v2/` (script `voz_v3_expresiva.py`; las de «Genio sarcástico» están en `anterior_genio/`). Whisper reconoció las 4 frases bien; **no he podido escucharlas: dime si la entonación ya es la que buscabas**. Truco: el nombre «Jarvis» suelto lo lee mal («y ahora veis»), pegado a la frase («Jarvis… hay un tío…») sale bien; «palmadas» solo funciona como «con solo dos palmadas».
- **Cambios de la 2ª ronda (feedback del usuario):** (1) voz con más entonación; (2) sonido de las ventanas rehecho (fuera riser, boom y pops agudos; ahora un sonido suave por ventana real y barridos bajitos en los movimientos de cámara); (3) menos repetición de imagen: la foto de Tony hundido ya solo abre 2 s, luego taller, chasquido y HUD, y la demo tiene cámara que viaja por los monitores. La versión anterior queda en `05_Exportaciones/_anteriores/`.
- **Decisiones revisables:** audio ≈ −14 LUFS (V1 salió a −7: demasiado fuerte); «SIN TOCAR NADA» se mantiene como único texto descriptivo (quítalo en `VR003V2.tsx` si lo sientes publicitario); sin música.
- **Tareas V2:** [ ] escuchar voz y pausas · [ ] ¿«SIN TOCAR NADA» fuera? · [ ] portada · [ ] publicar.

---

## Ficha breve (V1)

- Fecha: 2026-10-20 · Plataforma: Shorts / TikTok / Reels · Duración: **16,9 s** · 1080×1920 · 60 fps
- Formato: meme + demo real acelerada + locución sintética propia
- Mensaje único: *abres todo con dos palmadas, sin tocar nada*
- Enlace con el banco de ideas: [01_BANCO_DE_IDEAS](../../01_BANCO_DE_IDEAS.md) (basada en la idea original dictada; ID-04/ID-11 relacionadas)

## Guion y línea de tiempo

| Tiempo | Qué se ve | Qué se oye | Texto en pantalla |
| --- | --- | --- | --- |
| 0–1,5 | Tony gritando a pantalla completa (recortado a su contenido), tembleque | **Grito original** del clip | «TÚ ABRIENDO LAS APPS A MANO:» |
| 1,5–4,0 | Flash + foto «Jarvis,» (Tony pensativo) + viñeta roja pulsante | Boom + **alarma** + voz: *«Jarvis… ¿otra vez abriendo todo a mano?»* | «¿OTRA VEZ A MANO?» |
| 4,0–7,9 | Foto de Tony con brazos abiertos y explosiones; empuje lento; **círculo rojo** en su cara y **flecha** | Whoosh, garabatos, golpe; voz: *«Este tío no. Este tío abre todo… con dos palmadas.»* | «ESTE TÍO» · «ABRE TODO CON 2 PALMADAS» |
| 7,9–12,1 | **Demo real**: palmadas a velocidad normal y ventanas a ×2,3, 16:9 sobre fondo desenfocado | Palmadas reales + golpes en cada una + riser + boom + pops por ventana | «¡CLAP!» ×2 · «SIN TOCAR NADA» |
| 12,1–16,9 | Escritorio montado; sello; cierre con logo | Ding; voz: *«Ni un clic. Ni un drama.»* y *«Workspace Launcher. Tu escritorio, listo.»* | «TODO EN SU SITIO» · logo · «TU ESCRITORIO, LISTO.» |

El círculo, la flecha y los textos funcionan **sin la voz** (para eso existe la versión sin voz).

## Decisiones tomadas (revisables)

- **Voz:** no se clona a Tony/RDJ. Se creó una voz **original** («Genio sarcástico», estilo arquetipo) con Local Voice Studio. Ver [03_VOCES_Y_LOCUCION](../../03_VOCES_Y_LOCUCION.md).
- La foto con texto soez (`images (1).jpg`) **no** se usa.
- Música: ninguna; el ritmo lo llevan los efectos y la voz (los efectos son sintetizados propios). Se puede añadir un tema phonk de [Musica_y_Audio](../../../../00_Centro_de_Ideas/04_Biblioteca_Creativa/Musica_y_Audio.md) a ~20 % si se quiere más energía.
- Se interpretó «la alarma, después otra imagen suya rodeada con un círculo y una flecha» como: alarma en la escena del «Jarvis,» y, a continuación, la imagen de Tony con brazos abiertos señalada con círculo+flecha.

## Archivos

| Qué | Dónde |
| --- | --- |
| Vídeo **con voz** | `05_Exportaciones/VR003_ConVoz_1080x1920_60fps.mp4` |
| Vídeo **sin voz** | `05_Exportaciones/VR003_SinVoz_1080x1920_60fps.mp4` |
| Proyecto Remotion | `04_Edicion/Remotion_VR003/` (README dentro) |
| Voces generadas (WAV recortados + tomas crudas) | `03_Recursos/voz/` |
| Tiempos editables | `04_Edicion/Remotion_VR003/edit.config.json` |

## Cómo cambiar algo

- Tiempos de escenas, de la voz o de la demo → `edit.config.json` y re-renderizar (ver README). Textos → `src/VR003.tsx`.
- Otra frase de voz → generar en Local Voice Studio con la voz `genio-sarcastico-stark-style-original--6c6d75`, guardar como `03_Recursos/voz/voz_0N.wav`, ajustar su `at` en el config.

## Tareas

- [x] Concretar idea y gancho
- [x] Voz, efectos y montaje
- [x] Exportar con y sin voz
- [ ] **Revisión del usuario** (escuchar la voz entera, comprobar «Workspace Launcher» pronunciado)
- [ ] Portada y texto de publicación → [06_Publicacion/TEXTOS_PLATAFORMAS_ES.md](06_Publicacion/TEXTOS_PLATAFORMAS_ES.md)
- [ ] Publicar y guardar enlace

## Publicación

| Plataforma | Título / texto | Fecha | URL publicada |
| --- | --- | --- | --- |
| Por decidir | | | |

## Aprendizajes

- El clip del grito trae barras negras: ampliar al contenido real.
- La voz se midió **antes** de fijar las escenas (las líneas largas tapaban la siguiente escena) y se aceleró un 10 %.
- Whisper detectó «palmadas» mal pronunciado en una toma → regenerar con otra semilla (la 5 salió bien).
- Idea derivada: serie de ganchos de sonido (ID-12) y cuenta atrás de cohete (ID-01).
