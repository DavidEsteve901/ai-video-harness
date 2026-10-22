---
title: De una idea al vídeo y al formato reutilizable
status: active
created: 2026-10-21
tags: [project/workspace-launcher, video, flujo, claude, formatos]
---

# Tú das la idea; el sistema prepara el trabajo

**Preferencia expresa del usuario, 21-10-2026:** Codex prepara la idea, el guion y el plan. **Claude se encarga de animar, montar y producir.** Pedir un guion o desarrollar una idea no autoriza a generar imágenes, animatics, voces o renders. Una instrucción posterior del usuario puede cambiar el reparto o ampliar el alcance.

La entrada es [video-orquestacion](.agents/skills/video-orquestacion/SKILL.md). Su trabajo es localizar el contexto y coordinar las skills y recursos pertinentes. No hace falta que el usuario conozca sus nombres ni que prepare un brief técnico.

## Tres encargos sencillos

| Lo que dice el usuario | Qué debe ocurrir |
|---|---|
| «Tengo esta idea…» / «Hazme el guion y el plan» | Guardar o desarrollar la idea, proponer el gancho, escribir el guion y dejar recursos, dudas concretas y encargo para Claude. Entrega documental |
| «Claude, produce este vídeo» | Claude retoma la ficha y ejecuta las fases de producción que cubra el encargo, con las skills locales. La documentación no sustituye sus comprobaciones |
| «Me gusta este formato; guárdalo para los siguientes» | Documentar la receta reutilizable, su vídeo/versión de origen y qué le gustó al usuario. Actualizar la biblioteca de formatos |

Si el usuario solo captura una ocurrencia, una frase basta. Si pide guion, no convertir el trabajo en un interrogatorio: deducir lo opcional, anotar los supuestos y preguntar solo por un dato imprescindible. No abrir un VR por cada nota.

## Preparación del guion

1. **Recuperar contexto:** buscar la idea en [el catálogo](00_Ideas/00_INDICE.md), leer el [perfil editorial](Biblioteca_Planificacion/PERFIL_EDITORIAL.md) y comprobar si hay una versión o formato que se quiera reutilizar.
2. **Concretar una promesa:** destinatario, qué va a entender/ver y qué prueba o recurso lo sostiene. Para funciones del producto distinguir código local, función publicada y propuesta futura.
3. **Elegir la forma:** consulta [formatos](Biblioteca_Formatos/00_INDICE.md), propone un tratamiento que sirva a esa idea y algunas aperturas distintas cuando el concepto sea nuevo. No copiar una plantilla por inercia.
4. **Escribir:** apertura, progresión, demostración/explicación y cierre. Tabla con tiempo estimado, visual, voz/texto y función narrativa. Los tiempos se ajustarán al audio, no al revés.
5. **Planificar recursos:** reutilizar lo adecuado de las bibliotecas y asignar cada recurso a una escena. Registrar qué existe, qué se ha revisado y qué tendrá que conseguir/crear Claude. No generar medios para una petición de guion.
6. **Dejar el encargo listo:** ficha, guion, decisiones, recursos con rutas, skills pertinentes, salida esperada y límites. Usa [la plantilla de traspaso](Biblioteca_Planificacion/Plantillas/ENCARGO_PARA_CLAUDE.md) cuando el encargo lo necesite.

## Cómo encontrar y elegir recursos sin cargarlo todo

| Necesidad | Punto de entrada / skill | Decisión útil |
|---|---|---|
| Ideas o antecedentes | `00_Ideas/00_INDICE.md` y ficha | Reutilizar o ampliar antes de duplicar |
| Formato que ya gusta | [Biblioteca_Formatos](Biblioteca_Formatos/00_INDICE.md) | Conservar lo aprobado, adaptar lo variable |
| Gancho, guion y ritmo | `video-planificacion-retencion` | Promesa, estructura y escenas comprensibles |
| Material disponible | `04_INVENTARIO_RECURSOS.md` y `01_Proyectos/Recursos videos/README_RECURSOS.md` | Selección por función narrativa; verificar contenido al producir |
| Fotos, GIFs o clips externos | `video-recursos-visuales` | Para el plan identificar necesidades/fuentes; Claude prepara seleccionados cuando se produzca |
| Estética y movimiento | `video-estilos-creativos` y su skill específica | Cámara, collage, dibujos, motion o cine según la idea |
| Voz | `voces-locucion`, `Biblioteca_Voces/FAVORITAS.md` e índice | En el guion dirigir tono; al producir elegir identidad y medir tomas |
| Sonido | `02_SONIDOS_Y_GANCHOS.md`, catálogo de efectos y `Biblioteca_Sonidos` | Evento al que sirve cada efecto; no llenar por llenar |
| Ejecución del montaje | `remotion-produccion` + referencias oficiales necesarias | Claude reutiliza el editor, mantiene editables y comprueba resultado |
| Analítica tras publicar | Referencias de medición de planificación | Separar observación, hipótesis y siguiente prueba |

**Usar bien lo que hay significa elegir lo pertinente**, no meter todas las herramientas o todos los efectos en cada pieza. Cargar primero el índice y luego solo la referencia necesaria. Los originales externos son documentación; no prueban que haya un motor instalado o un servicio conectado.

## Qué recibe Claude y cómo se autogestiona

Claude lee `CLAUDE.md`, la ficha y el encargo. Revisa los recursos reales, resuelve huecos dentro del alcance autorizado y elige las skills que necesite sin exigir al usuario nombrarlas. Si se pide producir, puede seguir de principio a fin: preparar medios, fijar voz, montar, revisar y exportar. Respeta los límites de gasto, publicación y las condiciones del entorno.

Al terminar deja proyecto editable, rutas de recursos, versión de salida y qué ha revisado. La revisión visual/audio no se da por hecha por haber renderizado. Una pieza no se marca publicada sin evidencia.

## Guardar un formato que quieras repetir

La receta vive en [Biblioteca_Formatos](Biblioteca_Formatos/00_INDICE.md), no dispersa entre chats. Se guarda:

- Vídeo y versión de origen, con ruta al proyecto editable y exportación.
- Qué le gustó al usuario y cuándo lo dijo; diferenciarlo de una inferencia de la IA.
- Estructura, gancho, reglas visuales, voz, ritmo, texto, cámara y sonido que definen el formato.
- Herramientas/skills y versiones realmente utilizadas; recursos y scripts que conviene reutilizar.
- Parámetros que cambian en cada vídeo y decisiones que se conservan.
- Problemas resueltos y comprobaciones que ayudan a repetirlo sin arrastrar errores.

Una aprobación estética no es un dato de retención ni una autorización de publicación. Una referencia existente tampoco es un formato aprobado: el estado queda visible. Al pedir «otro como este», leer la receta y el vídeo origen; mantener el lenguaje y adaptar el contenido.

## Cuando entren herramientas nuevas

Documentar qué aporta la nueva capacidad, cuándo compensa usarla, su estado real, requisitos/versión y un enlace al recurso correcto. Añadirla al índice del dominio correspondiente. Ajustar un formato solo si la incorporación mejora algo concreto; conservar la versión anterior y señalar la diferencia. No actualizar todas las skills ni migrar todos los proyectos por añadir una herramienta.

## Calidad y aprendizaje

Antes de pasar el guion: una idea clara, apertura que corresponde al contenido, progresión sin escenas de relleno y recursos posibles. En producción: legibilidad en el destino, continuidad, voz inteligible, mezcla y prueba de las funciones mostradas. Después: registrar correcciones del usuario y lecciones reutilizables junto al formato o vídeo. Sin datos, hablar de decisiones editoriales y preferencias, no de «viralidad demostrada».

El caso actual está en [IDEA-041](00_Ideas/Conceptos/IDEA-041_tu-agente-prepara-tu-entorno.md): se entrega **solo guion, plan de escenas y encargo para Claude**.
