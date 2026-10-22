# Biblioteca de sonidos — entrada para IA

878 recursos en 31 categorías. 733 archivos distintos por SHA-256 y 145 copias adicionales idénticas. Duración acumulada de todos los archivos: 86.1 minutos, contando copias.

## Lectura rápida

1. Abre [BUSCADOR RÁPIDO](01_BUSCADOR_RAPIDO.md) para traducir la necesidad sonora a una categoría.
2. Abre solo el índice de la categoría elegida; cada fila contiene nombre exacto, enlace, duración, descripción y palabras clave.
3. Usa [CATÁLOGO COMPLETO](02_CATALOGO_COMPLETO.md) si necesitas buscar un nombre o concepto en toda la biblioteca.
4. Consulta [DUPLICADOS](03_DUPLICADOS.md) para reconocer copias idénticas. La columna «Copia idéntica» sugiere una ruta preferida; todas las copias se conservan.
5. Para búsquedas con herramientas, [catalogo.json](catalogo.json) contiene una ficha estructurada por recurso, con ruta exacta, descripción, etiquetas y metadatos.

## Resolver rutas

La carpeta raíz de recursos en Drive es:

```text
<RAIZ_REPO>/01_Proyectos/Recursos videos/Efectos sonido
```

Cada recurso usa una `relative_path` que empieza por `PACK SONIDOS 2025 (manuDT)/`. Une esa ruta a la raíz anterior. Los enlaces Markdown son relativos y funcionan si `INDICES_IA` y la carpeta del pack están juntas. La copia local de esta entrega tiene la misma estructura en:

```text
C:/Herramientas/output/catalogo-sonidos-manudt-20261020/extraido
```

Los índices exportados en ZIP contienen documentación; los audios están en el pack extraído de Drive y en la copia local anterior. Si se traslada el pack, cambia la raíz; conserva los nombres y la estructura de carpetas.

## Cómo interpretar las fichas

- `SFX-0001`, etc., son identificadores de esta edición del catálogo. Para abrir un recurso usa su ruta exacta.
- Descripciones inferidas del nombre y de la carpeta original; no proceden de escucha individual. Duraciones, formato, frecuencia y canales leídos del archivo. Las variantes numeradas no se presentan como sonidos distintos cuando el nombre no permite describir esa diferencia.
- `description_basis: nombre` indica identificación por nombre; `carpeta` indica identificación general por la familia. No inventes timbre, contenido hablado ni diferencias entre números. Preescucha las variantes cuando esa diferencia sea relevante.
- Hay 11 MP4 con audio. Un editor que acepte vídeo puede leer su pista; si necesita un archivo exclusivamente sonoro, extrae el audio del MP4. No se han reconvertido archivos.
- El catálogo conserva todas las carpetas del pack, incluida `MEMES`. La familia de cada sonido se describe por su nombre cuando es posible, aunque esté ubicado en `EXTRAS` o `MEMES`.
- El archivo `desktop.ini` no es un recurso multimedia y queda fuera del catálogo. La duración disponible describe el archivo entero; no se ha comprobado si contiene varios efectos o silencios internos.

## Categorías

| Categoría / índice | Archivos | Carpeta original | Contenido |
| --- | ---: | --- | --- |
| [Agua, lluvia y clima](categorias/agua-lluvia.md) | 8 | `AGUA (LLUVIA)` | Lluvia, tormentas, truenos, viento, tornados y gotas de agua. |
| [Alarmas y relojes](categorias/alarma.md) | 10 | `ALARMA` | Avisos, despertadores, tictac, cuenta atrás y campanas. |
| [Animación de logo](categorias/animacion-logo.md) | 5 | `ANIMACION LOGO` | Efectos de animación de logotipo; variantes numeradas sin detalle de timbre en el nombre. |
| [Pitidos](categorias/beeps.md) | 2 | `BEEPS` | Pitidos electrónicos. |
| [Booms e impactos](categorias/boom-impacto.md) | 22 | `BOOM (IMPACTO)` | Golpes, impactos duros, golpes graves y booms. |
| [Cámaras y película](categorias/camara.md) | 7 | `CAMARA` | Obturadores, flash, película antigua y rebobinado. |
| [Efectos cinematográficos](categorias/cinematica.md) | 45 | `CINEMATICA` | Efectos cinematográficos, booms, barridos y subidas con golpe final. |
| [Risers cinematográficos](categorias/cinematica-riser.md) | 41 | `CINEMATICA RISER` | Variantes cinematográficas y secuencias de subida con impacto final. |
| [Clics, ratón y teclado](categorias/click.md) | 15 | `CLICK` | Clics de ratón, teclas y escritura en teclado. |
| [Risers corporativos](categorias/corporate-riser.md) | 5 | `CORPORATE RISER` | Subidas con golpe final etiquetadas como corporate. |
| [Datos e interfaz digital](categorias/data.md) | 8 | `DATA` | Variantes de efectos etiquetados como Data; el nombre no detalla su timbre. |
| [Dinero y caja registradora](categorias/dinero.md) | 4 | `DINERO (MONEY)` | Caja registradora y variantes de sonidos de dinero. |
| [Campanas y tintineos](categorias/ding.md) | 8 | `DING` | Dings, campanas, destellos y señales de acierto. |
| [Electricidad](categorias/electrico.md) | 5 | `ELECTRICO` | Efectos eléctricos numerados. |
| [Errores y censura](categorias/error.md) | 3 | `ERROR` | Efectos etiquetados como error y un sonido de censura. |
| [Explosiones](categorias/explosion.md) | 15 | `EXPLOSION` | Explosiones numeradas; el nombre no especifica intensidad ni material. |
| [Efectos variados](categorias/extras.md) | 85 | `EXTRAS` | Animales, objetos, público, vehículos, interfaces, voces, música y efectos variados. |
| [Fuego](categorias/fuego.md) | 6 | `FUEGO` | Variantes de efectos de fuego. |
| [Efectos cómicos](categorias/funny.md) | 32 | `FUNNY` | Efectos humorísticos, risas, ronquidos, estornudos y animales. |
| [Fallos digitales](categorias/glitch.md) | 68 | `GLITCH` | Variantes de glitch o fallo digital. |
| [Líquidos](categorias/liquido.md) | 5 | `LIQUIDO` | Variantes de efectos de líquido. |
| [Memes, reacciones y otros sonidos](categorias/memes.md) | 184 | `MEMES` | Voces, música y reacciones de memes, junto con efectos convencionales incluidos en esa carpeta. |
| [Cortes e impactos metálicos](categorias/metal-slice.md) | 63 | `METAL SLICE` | Cortes metálicos numerados y un impacto metálico. |
| [Monedas y recompensas](categorias/moneda.md) | 8 | `MONEDA (COIN)` | Moneda de estilo 8 bits, caja registradora y variantes de moneda. |
| [Papel](categorias/papel.md) | 9 | `PAPEL` | Papel arrugado, paso de hojas, rasgado y otros sonidos de la carpeta. |
| [Pops y burbujas](categorias/pop.md) | 17 | `POP` | Pops, burbujas y variantes con rodamiento o desaceleración. |
| [Risers](categorias/riser.md) | 3 | `RISER` | Efectos de subida o acumulación de tensión, numerados. |
| [Barridos swoosh](categorias/swosh.md) | 65 | `SWOSH` | Barridos de aire, variantes metálicas, inversas y de cámara lenta. |
| [Terror y suspense](categorias/terror.md) | 22 | `TERROR` | Golpes de terror, susurros, gritos, risas, latidos y ambientes inquietantes. |
| [Barridos de transición](categorias/transicion.md) | 24 | `TRANSICION` | Barridos rápidos o graves, soplos de aire, látigos y magia. |
| [Barridos whoosh](categorias/whoosh.md) | 84 | `WHOOSH` | Barridos cortos, rápidos, amplios, digitales, lentos y de fuego. |

## Ejemplo de selección para edición

Devuelve siempre una ruta que exista y una duración medida. Formato sugerido:

```json
{
  "id": "SFX-....",
  "ruta_relativa": "PACK SONIDOS 2025 (manuDT)/CARPETA/nombre exacto.ext",
  "duracion_archivo_s": 0.0,
  "motivo": "Coincide con el sonido solicitado según su nombre y categoría"
}
```

Generado el 20 de octubre de 2026 a partir del RAR local `PACK SONIDOS 2025 (manuDT).rar`.
