# VR016: recorta las capturas REALES de la Store (3840x2160, es-ES) para usarlas como pantallas dentro del vídeo.
# Se quita todo lo que identifica la app o el plan (barra de título con el nombre, cabecera «Launcher Pro · ULTIMATE»,
# cuenta, «Plan: ULTIMATE», «14 días gratis»): sin logo ni nombre ni precio en el vídeo.
# Uso: python recortar_capturas.py <carpeta_pack_es-ES> <carpeta_salida> [<carpeta_salida_2> ...]
import os, sys
from PIL import Image, ImageDraw

src, outs = sys.argv[1], sys.argv[2:]

def tapar(im, caja, muestra):
    """rellena `caja` (x0,y0,x1,y1, coordenadas de la captura) con el color del fondo leído en `muestra`"""
    d = ImageDraw.Draw(im)
    d.rectangle(caja, fill=im.getpixel(muestra))

def guardar(im, nombre):
    for o in outs:
        os.makedirs(o, exist_ok=True)
        im.save(os.path.join(o, nombre), optimize=True)
    print(nombre, im.size)

# 1 · Lista del workspace «Focus»: sin la barra de título; se tapan la cabecera del plan y la cuenta
im = Image.open(os.path.join(src, "05_Workspaces.png")).convert("RGB")
tapar(im, (880, 600, 1276, 688), (900, 760))     # «Launcher Pro · ULTIMATE» (logo + plan)
tapar(im, (893, 1836, 1256, 1920), (900, 1800))  # cuenta de Google + «ULTIMATE»
tapar(im, (1160, 2010, 1260, 2050), (1150, 2030))  # número de versión
guardar(im.crop((876, 600, 2962, 2077)), "ws_lista.png")
# tarjeta «Workspace desde una captura» (barra lateral real)
guardar(im.crop((888, 766, 1260, 874)), "captura_tarjeta.png")
# botón «Lanzar» y barra de acciones
guardar(im.crop((2090, 640, 2940, 696)), "ws_acciones.png")

# 2 · Omnibar (pill + tarjeta de inicio con ventanas seleccionadas)
im = Image.open(os.path.join(src, "02_Omnibar_IA.png")).convert("RGB")
guardar(im.crop((741, 624, 3099, 1998)), "omnibar.png")

# 3 · Chat del asistente (desde el collage, español)
im = Image.open(os.path.join(src, "01_Collage.png")).convert("RGB")
tapar(im, (1330, 1940, 1440, 1972), (1340, 1925))  # «Plan: ULTIMATE»
guardar(im.crop((1316, 1246, 2344, 1984)), "chat.png")

# 4 · Gestos del ratón (panel de ajustes, español)
im = Image.open(os.path.join(src, "08_Gestos_raton.png")).convert("RGB")
guardar(im.crop((873, 549, 2964, 2076)), "gestos.png")

# 5 · Gestor de layouts (ventana interior)
im = Image.open(os.path.join(src, "06_Layouts_multimonitor.png")).convert("RGB")
guardar(im.crop((1155, 795, 2685, 1830)), "layouts.png")
