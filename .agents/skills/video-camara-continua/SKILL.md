---
name: video-camara-continua
description: Mejorar el reencuadre y la continuidad de cámara en demos reales y montajes Remotion de Videos_Rapidos. Usar para cámara vertical, zoom, seguimiento de interfaz o transiciones con un elemento común; no depende del software onetake.
---

# Cámara continua y legible

Lee el encargo, la ficha vigente y [la receta de cámara](../../../Biblioteca_Estilos_IA/02_RECETAS_ESTILOS.md). Esta es una técnica propia implementada con el proyecto existente, no una instalación de onetake. No copiar código, presets ni su oráculo: su licencia restringe el uso comercial.

1. Revisa el bruto o la composición y mide los eventos que se tienen que ver: orden, clic, transición y resultado. Mantén separados tiempo de origen y tiempo de composición.
2. Define estados editables de centro, escala y reposo. Un estado lleva la mirada hacia la acción; otro deja leerla. Mantén visibles la relación causa/resultado y las zonas reservadas a captions.
3. Implementa el movimiento desde los frames de Remotion con APIs compatibles con su versión; evita temporizadores o azar por fotograma. Separa transformación y contenedor de recorte para evitar saltos.
4. Cuando sirva a la escena, conserva un elemento visual entre estados. No impongas un plano secuencia a un chiste que necesita un corte ni fuerces una cámara incesante.
5. Comprueba inicio, desplazamiento, máxima escala, asentamiento y salida. Revisa interfaz y rótulos al tamaño final. Un cursor animado no puede simular una acción del producto que no ocurrió en el bruto.

Continúa con [remotion-produccion](../remotion-produccion/SKILL.md) para assets, audio y exportación. Conserva voz y decisiones del resto de la pieza. En VR010 comprueba qué versión se está editando: V1 y V2 tienen duraciones y configuración diferentes. Registra los parámetros en la configuración existente o una revisión clara para que el usuario pueda retocarlos.
