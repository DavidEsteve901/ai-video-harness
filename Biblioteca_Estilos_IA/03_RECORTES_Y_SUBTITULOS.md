# Recortes de tutoriales, captions y edición por transcripción

Combinar la [skill de planificación](../.agents/skills/video-planificacion-retencion/SKILL.md), `remotion-produccion` y los módulos de [YouTube Agent Skill](Fuentes_Comunidad/youtube-agent-skill/README.md) solo cuando aporten algo al encargo.

## Del largo a un momento autónomo

Transcribe o reutiliza una transcripción con tiempos; revisa el contenido visual del tramo. Selecciona por promesa resuelta: situación, acción y resultado que se entienden sin haber visto el tutorial. No cortar únicamente por frases llamativas ni por una puntuación automática.

Por candidato anota: timecode original, premisa, primer plano, frase de apertura, prueba visual, final y material que necesita. El reencuadre de una demo debe seguir controles y ventanas; la detección de caras de SupoClip no resuelve por sí sola una grabación de escritorio.

Módulos útiles: [yt-shorts](Fuentes_Comunidad/youtube-agent-skill/skills/yt-shorts/SKILL.md), [yt-edit](Fuentes_Comunidad/youtube-agent-skill/skills/yt-edit/SKILL.md), [yt-script](Fuentes_Comunidad/youtube-agent-skill/skills/yt-script/SKILL.md). No se activa una segunda planificación del canal si ya existe el brief. Usa `Biblioteca_Planificacion/PERFIL_EDITORIAL.md` como perfil local; los originales mencionan archivos globales que no se han creado aquí.

## Lista de cortes asistida

El ayudante `deadair.py` acepta SRT, VTT y ciertos JSON de transcripción. Revisar su formato antes de usarlo: en el commit archivado el manejo de JSON como lista presenta una incompatibilidad; preferir SRT/VTT o JSON con `segments`. Ejecutarlo sobre una copia o lectura del archivo:

```powershell
& '<python-disponible>' '<biblioteca>\Fuentes_Comunidad\youtube-agent-skill\skills\yt-edit\deadair.py' '<transcripcion.srt>' --json
```

Produce una **lista candidata**, no corta medios. Sus listas de muletillas y varios criterios del pack están orientados al inglés. No eliminar automáticamente silencios de actuación, respiraciones, palabras españolas ni gestos importantes. Conserva un margen para entradas y finales de palabras; las tomas de VR010 ya mostraron que recortar unos fotogramas puede comerse una sílaba.

Se han ejecutado dos comprobaciones del código original en esta entrega: detección de un hueco en un SRT de prueba y ejecución del panel de gancho con una frase inglesa. Estos ejemplos no evalúan un vídeo del canal ni demuestran calidad editorial.

## Subtítulos

Medir palabras sobre el audio final montado, no sobre el tutorial anterior si se han reordenado frases. Mantener dos tiempos: origen del clip y composición. Al acelerar vídeo sin acelerar la voz, los captions siguen la voz.

Usar [remotion-captions](../.agents/skills/remotion-captions/SKILL.md) y comprobar su compatibilidad con la versión del proyecto. Elegir pocas palabras visibles, contraste suficiente y posición que no tape botones o el remate. La palabra activa es un recurso opcional; no añadir un segundo titular que compita con la lectura. Revisar inicio/final de frases, tildes, puntuación y nombres de producto.

## Retención y packaging

Los once módulos archivados son `yt-script`, `yt-package`, `yt-edit`, `yt-comment`, `yt-plan`, `yt-viral`, `yt-retention`, `yt-shorts`, `yt-seo`, `yt-chapters` y `yt-audit`. Sus seis scripts analizan datos de entrada; no se han conectado a YouTube ni publican.

`hookscore.py` es una heurística lingüística inglesa. En español no sirve para ordenar de forma fiable los ganchos. Valorar claridad, situación, promesa y correspondencia con el primer plano; no presentar el número como probabilidad de visitas. `yt-retention` requiere datos del canal; sin ellos se formula una hipótesis editorial. Los comentarios y respuestas que prepare `yt-comment` quedan como borradores, sin envío.

## SupoClip como alternativa futura

El [README original](Fuentes_Comunidad/supoclip/README.md) documenta una aplicación, no una skill. Puede ayudar con entrevistas o podcasts; necesita su instalación y revisar servicios de transcripción/modelos. No se ha instalado Docker ni introducido claves. Para nuestros tutoriales de software, el pipeline Remotion existente mantiene un control más directo del encuadre. No migrar un vídeo por incorporar esta referencia.
