---
title: Junior vs Senior — Montar el escritorio a mano o con Workspace Launcher
id: VR001
status: preparacion
created: 2026-10-05
tags: [project/workspace-launcher, marketing, video-corto]
---

# VR001 — Junior vs Senior

Idea: arriba, JUNIOR abriendo y colocando aplicaciones a mano; abajo, SENIOR lanzando el mismo entorno con Workspace Launcher. Logo arriba y dominio abajo. Referencia aportada por el usuario en `01_Referencias/Referencia_Junior_Senior.png`.

## Proyecto preparado

[Proyecto de Kdenlive](04_Edicion/VR001_Junior_vs_Senior_VERTICAL.kdenlive) · [Vista previa](05_Exportaciones/PREVIEW_PLANTILLA.png)

- Vertical 1080 × 1920, 60 fps, duración inicial 20 segundos (ampliable).
- JUNIOR: zona x=72, y=400, ancho=936, alto=527.
- SENIOR: zona x=72, y=1110, ancho=936, alto=527.
- Pistas de vídeo separadas, transformación preparada y pista de audio vacía.
- Marco, rótulos, logo y dominio en la pista superior. Fuente editable SVG en Recursos.
- Brutos todavía pendientes. La vista previa contiene marcadores de posición.

## Cuando tengas las grabaciones

1. Guarda ambas grabaciones en `02_Brutos/`. Graba el mismo conjunto de aplicaciones en ambos casos, idealmente en horizontal 16:9.
2. Abre el proyecto. En la bandeja del proyecto, haz clic derecho en **SUSTITUIR JUNIOR** → **Reemplazar clip** y elige la grabación manual. Repite con **SUSTITUIR SENIOR** y el lanzamiento de la app. El efecto Transformar está en los clips de la línea de tiempo para conservar las zonas.
3. Si Kdenlive propone cambiar el perfil al importar, conserva el vertical 1080 × 1920.
4. Ajusta los puntos de entrada y duración de los dos clips; amplía también el marco si pasas de 20 segundos. Si el vídeo inferior termina antes, puedes congelar su resultado mientras arriba continúa la preparación manual.
5. Revisa el efecto Transformar de cada clip tras sustituirlo: las coordenadas están arriba. Para grabaciones de otra proporción, ajusta encuadre sin deformarlas.
6. Añade voz, sonido o música en la pista de audio cuando corresponda.

## Grabación pendiente

- [ ] Grabar JUNIOR: abrir y colocar las aplicaciones a mano.
- [ ] Grabar SENIOR: lanzar el workspace equivalente y dejar visible el resultado.
- [ ] Sustituir marcadores, ajustar tiempos y revisar.
- [ ] Preparar texto/portada y publicar cuando el montaje esté listo.

Muestra el tiempo real del lanzamiento. Si aceleras una parte, indícalo en el montaje.

## Editar la marca

La capa `MARCO_MARCA.png` tiene huecos transparentes para los vídeos. Conserva `MARCO_MARCA_EDITABLE.svg` como fuente para modificar textos/colores en un editor vectorial y exporta de nuevo a PNG 1080 × 1920. El dominio utilizado es `workspacelauncher.meltvest.com`, localizado en el paquete de YouTube del proyecto.

## Verificación de la plantilla
2026-10-05: recursos disponibles y perfil XML comprobados. Fotograma renderizado con el motor MLT de Kdenlive y revisado visualmente: dos zonas, transformaciones, rótulos, logo y dominio correctos. Queda pendiente comprobar los vídeos reales después de sustituir los marcadores.


## Montaje actual — 19 segundos
Proyecto actualizado: [VR001_Junior_vs_Senior_19s_AJUSTADO.kdenlive](04_Edicion/VR001_Junior_vs_Senior_19s_AJUSTADO.kdenlive). JUNIOR usa una copia acelerada 2,34649× del tramo seleccionado (3,9167–48,5 s), con duración exacta de 19 s. SENIOR conserva el inicio de tu corte y termina a los 19 s; marco y música alineados al mismo final. Transformar coloca JUNIOR en 72/400/936/527 y SENIOR en 72/1110/936/527. Perfil 1080×1920, progresivo, 60 fps. Copia anterior en 04_Edicion/VR001_ANTES_AJUSTE_19s.kdenlive. Encuadres comprobados mediante fotogramas del motor MLT; vista del final en 05_Exportaciones/PREVIEW_19s_ENCUADRES.png.


## Exportación final aprobada
[MP4 final V1](05_Exportaciones/VR001_Junior_vs_Senior_FINAL_1080x1920_60fps_V1.mp4), exportado el 2026-10-05 tras aprobación del montaje. H.264/AAC, 1080×1920 progresivo, 60 fps, 1140 fotogramas, vídeo 19 s (contenedor 19,008 s por audio AAC). Decodificación completa sin errores; fotogramas de inicio, mitad y final revisados; audio presente, pico −8,6 dB. No publicado todavía.

## V3 — 12,5 s con espera y drop (2026-10-20)
Edición hecha con **Remotion** (no Kdenlive): proyecto en [04_Edicion/Remotion_VR001](04_Edicion/Remotion_VR001/README.md). Dos versiones del mismo montaje, solo cambian los rótulos:
- [Junior vs Senior V3](05_Exportaciones/VR001_Junior_vs_Senior_V3_SYNC_1080x1920_60fps.mp4) (público programador)
- [Noob vs Pro V3](05_Exportaciones/VR001_Noob_vs_Pro_V3_SYNC_1080x1920_60fps.mp4) (público general)

1080×1920, 60 fps, 12,5 s, H.264/AAC. Las V2 (10 s, con el bruto de fondo negro y con rótulos) se conservan en `05_Exportaciones/_anteriores`.
- Brutos: `Video Junior.mp4` (desde 2 s, ×3) y **`Video Senior.mp4`** (escritorio con wallpaper, igual que el Junior).
- 0–7 s: arriba el Junior/Noob monta ventanas a mano; abajo el Senior/Pro está quieto en el escritorio unos 5 s. Aparece el lanzador (se ve entero, sin zoom), después un zoom suave se acerca al botón Lanzar.
- Silencio de la canción (≈0,9 s) y el clic suena dentro de ese silencio.
- 7,0 s (drop de Kordhell – Scopin): flash, sacudida, el zoom vuelve al escritorio completo y las ventanas se colocan al instante.
- Borde del Senior/Pro con pulso musical: se carga en el silencio, impacto grande en el drop (borde grueso y casi blanco, halo y 3 ecos) y un latido con eco en cada golpe de la canción (~98 BPM) hasta el final.
- 7–12,5 s: el Senior/Pro lo tiene todo montado; el Junior/Noob sigue y el vídeo acaba con él sin terminar (Chrome abierto).
- Sin rótulos de «LISTO EN 1 CLIC», «SIGUE MONTANDO» ni etiquetas de velocidad: lo pidió así el usuario. Solo quedan los cronómetros reales de cada panel (Junior 37,4 s al final, Senior 2,8 s).
- **Velocidades para la descripción** (no aparecen en el vídeo): Junior/Noob ×3; el lanzamiento del Senior/Pro, ×2 desde que salen las ventanas (se salta ~1,1 s muerto justo en el drop; el lanzamiento real dura 2,8 s desde el clic).
- Tipografía: Anton (rótulos, color plano, sin sombras) + Inter ExtraBold (cronómetros y dominio). Logo y texto `workspacelauncher.meltvest.com` arriba, sin cajita, fuera de la zona tapada por la interfaz de TikTok.
- Todos los tiempos y el zoom están en `edit.config.json`; se regenera con `npm run render`.
- No se ha publicado. Los textos de `06_Publicacion` son de la V1 (dicen «2,35×»); hay que actualizarlos a ×3 antes de publicar.

### V3 — dos efectos: SYNC y SUAVE
Cada versión de rótulos (Junior/Senior y Noob/Pro) se entrega en dos efectos en [05_Exportaciones](05_Exportaciones):
- **SYNC** (`..._V3_SYNC_...mp4`): el borde del Senior/Pro late con los golpes de la canción (~98 BPM) además del impacto del drop.
- **SUAVE** (`..._V3_SUAVE_...mp4`): sin latidos por el ritmo, para no robar foco al contenido. Ondita sobre el botón Lanzar en el clic y una única respuesta del borde en el drop (subida rápida, caída lenta, un eco fino, flash y sacudida mínimos).

Cambio común: el clic ocurre 0,15 s antes del drop y se ve el estado «Lanzando…» antes del corte. Versiones anteriores en `05_Exportaciones/_anteriores`.
