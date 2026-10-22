# Tus proyectos, a un comando — guion conceptual del Omnibar

**IDEA-042 · 21-10-2026.** Guion y storyboard escritos. Claude producirá la animación cuando se le encargue. [IDEA-041](../IDEA-041_tu-agente-prepara-tu-entorno.md) explica la conexión general de agentes; esta pieza explica el acceso a proyectos y herramientas propias.

## Una sola promesa

Convertir una capacidad de tu proyecto en una acción accesible desde el Omnibar, con ayuda del agente para preparar su conexión. Workspace Launcher proporciona el acceso; el proyecto externo conserva la lógica y realiza el trabajo.

**Título creativo propuesto:** Tus herramientas, a un comando.

**Gancho:** «¿Y si tus propias herramientas estuvieran a un comando?»

Lenguaje para el público: «acceso rápido» o «punto de acceso a tus herramientas». «Pasarela» puede orientar la documentación, pero no hace falta pronunciar «gateway» ni explicar arquitectura técnica en el vídeo.

## Metáfora elegida como propuesta

Una caja de proyecto con engranajes dentro representa su lógica. Varias cajas pueden existir, pero seguimos una sola. El agente recibe el proyecto y una instrucción del usuario y construye un conector hacia una barra abstracta. Después cambia la fase: el usuario selecciona una acción, añade datos y los envía por ese enlace. La caja trabaja y devuelve un resultado reconocible.

El conector se configura una vez para ese caso; el acceso queda disponible para usos posteriores. No representar una automatización universal sin inspección, permisos ni condiciones. La secuencia separa **preparar la conexión** de **utilizar la acción**.

## Guion / storyboard escrito

| Tiempo estimado | Voz propuesta | Imagen conceptual | Función |
|---|---|---|---|
| 0–4 s | ¿Y si tus propias herramientas estuvieran a un comando? | Herramientas propias dispersas convergen en un acceso visible | Promesa y utilidad |
| 4–9 s | Conecta tus proyectos al Omnibar de Workspace Launcher. | Se elige una caja de proyecto; aparece una barra abstracta como punto de acceso | Establece la relación |
| 9–15 s | Tu agente puede revisarlos y preparar las acciones que necesitas. | El agente observa una ficha del proyecto y construye el conector; la persona señala la acción deseada | Configuración asistida, sin mostrar JSON ni menús |
| 15–20 s | Tú eliges la acción y le pasas los datos. | Una etiqueta de acción recibe pequeñas fichas: proyecto, fecha o tema | Entrada de datos/parámetros |
| 20–26 s | Tu proyecto hace el trabajo. El Omnibar te da el acceso. | Datos viajan a la caja externa, su lógica se activa y sale un resultado | Aclara quién ejecuta la lógica |
| 26–32 s | Consultar, preparar, lanzar… tus herramientas, desde el mismo lugar. | La misma barra conecta con distintas herramientas, una por vez; gesto de invocación rápido | Amplitud de posibilidades, según cada herramienta |
| 32–36 s | ¿Cuál conectarías primero? | Quedan las cajas y un acceso libre para la próxima herramienta | Cierre con pregunta |

## Locución seguida

¿Y si tus propias herramientas estuvieran a un comando?

Conecta tus proyectos al Omnibar de Workspace Launcher.

Tu agente puede revisarlos y preparar las acciones que necesitas.

Tú eliges la acción y le pasas los datos.

Tu proyecto hace el trabajo. El Omnibar te da el acceso.

Consultar, preparar, lanzar… tus herramientas, desde el mismo lugar.

¿Cuál conectarías primero?

## Ejemplo que puede apoyar sin dominar

Propuesta: una herramienta propia prepara un informe a partir del nombre de un proyecto. El Omnibar aporta la entrada y el acceso; el proyecto posee la función de generar el informe. Un comando como `/informe Atlas` es **ilustrativo**, no una función de informes nativa de Workspace Launcher ni una conexión creada en esta tarea.

Otra posibilidad es abrir una utilidad propia con datos o consultar un servicio documentado. Claude elegirá un único caso comprobable si la producción necesita concreción; no convertir la pieza en una lista de casos desconectados.

## Datos y formularios

Los campos, tarjetas o fichas dibujadas representan los datos que necesita una acción. Pueden mostrar nombre, fecha o contenido sin imitar una ventana existente. **No presentan un constructor de formularios nativo del Omnibar.** Si un proyecto tiene su propio formulario, puede representarse dentro de la caja externa y documentarse como capacidad de ese proyecto.

En la documentación local consultada, la acción admite entrada y sugerencias de parámetros según el contrato. Un formulario dinámico propio del Omnibar necesitaría verificarse antes de anunciarlo. Este detalle pertenece al contexto de producción; el vídeo puede decir sencillamente «le pasas los datos».

## Dirección artística y sonido para Claude

Mismo lenguaje de dibujos e iconos de la serie conceptual, con libertad para crear una metáfora mejor. Una pieza representa la acción, otra los datos y otra el resultado; mantener su identidad durante el trayecto. El movimiento explica el viaje y la transformación. Evitar terminales simulados, pantallas falsas, tutoriales de clics y un resultado que parezca una prueba real.

Una sola voz cercana. Curiosidad al abrir, claridad en la configuración y satisfacción contenida al reutilizar el acceso. El sonido diferencia conexión, invocación y devolución del resultado. Elegir recursos de las bibliotecas por función; no se genera nada durante esta preparación.

Horizontal: proyecto a un lado y acceso al otro. Vertical: construir la conexión y después enfocar entrada → trabajo externo → resultado. Ajustar el guion a la voz medida; los 36 s son una referencia. [FMT-003](../../../Biblioteca_Formatos/FMT-003_Explicador_Conceptual_Animado.md) conserva la intención de formato, no un motor obligatorio.

## Copy y ubicación propuestos

Título: **Tus propias herramientas, a un comando del Omnibar.**

Descripción: **Conecta las acciones de tus proyectos al Omnibar. Tu agente puede ayudarte a preparar la integración y tu herramienta conserva su propia lógica. ¿Cuál conectarías primero?**

Destino candidato: sección Omnibar de la web, además de redes. No se ha decidido ubicación final, publicado ni editado la web.
