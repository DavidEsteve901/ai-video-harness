# VR001 V3 — Junior vs Senior / Noob vs Pro (Remotion)

Vertical 1080×1920, 60 fps, 12,5 s. Arriba el JUNIOR/NOOB monta las ventanas a mano (cámara rápida ×3); abajo el SENIOR/PRO con Workspace Launcher. Durante ~5 s el Senior está quieto en el escritorio; aparece el lanzador, un zoom suave se acerca al botón, la canción cae en silencio y en el **drop** (Kordhell – Scopin) se lanza todo: flash, sacudida y las ventanas se colocan al instante. Sin rótulos de «1 clic» ni «sigue montando» y sin etiquetas de velocidad: la velocidad (Junior ×3, tramo del lanzamiento del Senior ×2) va en la descripción de la publicación.

## Estructura

| Ruta | Qué es |
|---|---|
| `edit.config.json` | **Todos los tiempos**: duración, instante del drop/clic, tramos del bruto, velocidades, zoom al botón |
| `scripts/preparar_cortes.mjs` | Genera `public/clips/junior.mp4` y `senior.mp4` con ffmpeg a partir de `02_Brutos` y sintetiza `audio/click.wav` |
| `src/VR001.tsx` | La composición (diseño, animaciones, audio). Recibe `top`, `bottom` y `fx` (`sync` o `suave`) |
| `src/Root.tsx` | Registra las 4 salidas: `VR001-NoobPro-Sync/Suave` y `VR001-JuniorSenior-Sync/Suave` |
| `public/` | Clips ya preparados, fuentes (Anton + Inter, licencia OFL), música, logo |

## Cómo reproducirlo

`node_modules` no se guarda aquí (carpeta de Drive). Desde esta carpeta:

```bash
npm install            # o enlazar node_modules del workspace "Videos Workspace launcher/video-editor" (Remotion 4.0.448)
npm run dev            # Remotion Studio con las dos composiciones
npm run render         # las 4 salidas (~5 min)
npm run render:noob-sync   |  render:noob-suave   # Noob vs Pro
npm run render:junior-sync |  render:junior-suave # Junior vs Senior
```

## Dos efectos: SYNC y SUAVE

- **SYNC**: el borde del Pro late con los golpes de la canción (ver «Pulso del borde» más abajo). Más energía, más llamativo.
- **SUAVE**: sin latidos por el ritmo. Una ondita sobre el botón Lanzar al hacer clic y, en el drop, una única respuesta del borde (sube en ~60 ms y se apaga despacio, un eco fino, flash y sacudida mínimos). Se ajusta en `edit.config.json` → `suave` (`amp`, `atk`, `tau`). Menos intrusivo, deja el foco en el contenido.

Si cambias los tramos o velocidades de `edit.config.json`, regenera los clips:

```bash
node scripts/preparar_cortes.mjs --raw ../../02_Brutos
```

## Brutos y tiempos clave

- Senior: **`Video Senior.mp4`** (escritorio con wallpaper, igual que el Junior). Lanzador visible a los 13,1 s del bruto, **clic en 15,13 s**, primera ventana 16,33 s, todo colocado ≈17,9 s. Entre clic y primera ventana hay ~1,1 s muertos (toast): el montaje los salta justo en el drop. El resto va ×2.
- Junior: **`Video Junior.mp4`**, desde 2,0 s a ×3 (hasta ≈39 s del bruto: se queda con Chrome abierto, sin terminar; en el bruto acaba hacia los 45 s).
- Canción: silencio de 20,96 a 21,96 s y entrada del drop en 21,98 s. En `edit.config.json` figura `dropInSong: 22,06` porque Remotion decodifica el MP3 ~80 ms tarde y así el drop suena a la vez que el flash.
- `Video Senior Bueno - fondo negro.mp4` ya no se usa en esta versión.

## Pulso del borde del PRO

El borde verde del Senior/Pro reacciona a la música: se carga en el silencio previo, da un impacto grande en el drop (borde más grueso y casi blanco, halo y 3 ecos que salen del contorno) y después late en cada golpe de la canción (~98 BPM, un eco por latido, el rótulo PRO sube un 10 %). Se configura en `edit.config.json` → `pulse` (`beatFirst`, `beatPeriod`, `beatAmp`) y la lógica está en `PULSE_EVENTS` de `src/VR001.tsx`. Si cambias `dropTime` o el punto de inicio de la canción, mueve `beatFirst` (= 22,73 − (`dropInSong` − 0,08 − `dropTime`)).

## Ajustes habituales

- **Más/menos espera antes del drop:** `dropTime`, `clickTime` (clic = drop − 0,08), `duration`, el `start` del primer tramo del Senior (= 15,13 − clickTime) y `senior_zoom.pushStart/pushEnd`. Si cambias `duration`, ajusta el `end` del último tramo para que la suma de tramos coincida.
- **Zoom al botón:** `senior_zoom` (`pre` = nivel, `focusX/Y` en coordenadas 1920×1080, `pushStart/pushEnd`). El lanzador se ve entero sin zoom hasta `pushStart`; sale rápido por sí solo en el drop.
- **Textos:** `Root.tsx` (`defaultProps`) o el panel de props de Studio. Colores: `RED`, `GREEN` al inicio de `VR001.tsx`.
