# Conexión de recursos — cómo la IA encuentra tus archivos

El repositorio contiene el **método** (skills, guías, formatos, herramientas). Los **archivos pesados** (vídeos, música, fotos, brutos) no caben en git: viven en carpetas de tu equipo —otro disco, un NAS, Drive o Dropbox sincronizado— y el repo solo guarda **cómo encontrarlos y qué son**.

```
repo (git)                         tu equipo (fuera de git)
──────────                         ─────────────────────────
conexion_recursos/                 D:\Recursos_Video\
  recursos.config.local.json  ───►   Visuales\   catalogo.json  ← índice con descripciones
  (rutas de ESTE pc)                 Sonidos\    catalogo.json
herramientas/recursos.py             Voces\      catalogo.json
```

## Puesta en marcha (una vez por ordenador)

1. `python herramientas/recursos.py init` → crea `recursos.config.local.json` (ignorado por git).
2. Edita `rutas` de cada biblioteca con dónde está en **este** ordenador. Puedes poner varias rutas candidatas (por ejemplo `D:/…` en el PC y `/mnt/nas/…` en el portátil): se usa la primera que exista.
3. `python herramientas/recursos.py list` → comprueba que las encuentra.
4. `python herramientas/recursos.py scan visuales` → recorre la carpeta y crea/actualiza `catalogo.json` **dentro de la biblioteca** (tipo, duración y resolución si hay `ffprobe`). No toca ni mueve tus archivos.
5. Pide a la IA: «describe los recursos pendientes de `visuales`». Verá `pending`, abrirá cada recurso (o su fotograma/nombre) y rellenará `descripcion`, `etiquetas`, `licencia` y `notas` en el catálogo. Las descripciones escritas a mano **se conservan** al volver a escanear.

## Cómo lo usa la IA al montar un vídeo

La skill [`video-recursos-conectados`](../.agents/skills/video-recursos-conectados/SKILL.md) hace:

1. `list` y `check` → qué bibliotecas hay y cuáles están disponibles aquí.
2. `search "<necesidad>" [--tipo audio]` o lectura del `catalogo.json` → candidatos con descripción, licencia y duración.
3. Elige por escena, tono y licencia; **copia** el recurso al `03_Recursos/` del proyecto del vídeo (no se edita sobre la biblioteca).
4. Anota en la ficha del vídeo qué recurso usó (`id` + ruta relativa) y su procedencia.

## Formato del catálogo (`catalogo.json`)

```json
{
  "schema_version": 1,
  "biblioteca": "visuales",
  "recursos": [
    {
      "id": "R00001",
      "ruta": "stock/oficina/teclado_cerca.mp4",
      "tipo": "video",
      "duracion_s": 8.4,
      "resolucion": "1920x1080",
      "descripcion": "Manos tecleando en un teclado mecánico, luz cálida, plano cercano.",
      "etiquetas": ["teclado", "trabajo", "cálido", "plano-cercano"],
      "licencia": "Pexels (uso libre, sin atribución)",
      "notas": "Sin audio útil. Bueno para B-roll de productividad."
    }
  ]
}
```

`ruta` siempre es **relativa a la raíz de la biblioteca**; así el mismo catálogo funciona en cualquier ordenador o disco. Hay un ejemplo real con ~880 efectos de sonido en [`01_Proyectos/Recursos videos/Efectos sonido/INDICES_IA/`](../01_Proyectos/Recursos%20videos/Efectos%20sonido/INDICES_IA/00_LEEME.md) (índice por categorías + buscador rápido + `catalogo.json`); es el estilo de índice más completo y puedes imitarlo para bibliotecas grandes.

## Mover los recursos a otro disco

Copia la carpeta de la biblioteca entera (con su `catalogo.json`) y cambia **solo** `rutas` en `recursos.config.local.json`. Nada más depende de la ubicación.

## Qué NO subir al repositorio

Todo lo que cuelga de las rutas de recursos, brutos, renders, música y clips con derechos de terceros. El `.gitignore` ya lo excluye (`*.mp4`, `*.wav`…, `recursos.config.local.json`). Si quieres compartir un catálogo, comparte el `catalogo.json` (texto), no los archivos.
