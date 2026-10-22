# VR017: recortes de la interfaz REAL (pack de capturas de la Store, es-ES, 3840x2160) -> public/img/ui/*.jpg
# Solo se recorta el panel de la app: fuera titulares, logo, nombre de la app, insignias de plan y cuenta.
# En el Omnibar, el título de la ventana de VS Code mostraba el nombre de la app: se tapa con «proyecto-web».
# Uso: python scripts/preparar_ui.py
import os, subprocess
from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = r"<RAIZ_IMAGENES>\Microsoft Store\PACK STORE 10 capturas (ES-EN) 2026-10\es-ES"
DST = os.path.join(RAIZ, "public", "img", "ui")
os.makedirs(DST, exist_ok=True)

# nombre: (captura, w, h, x, y)
RECORTES = {
    "ws": ("05_Workspaces.png", 1689, 1470, 1275, 603),          # lista del workspace «Focus» + Lanzar
    "omnibar": ("02_Omnibar_IA.png", 2367, 1386, 738, 618),      # píldora + tarjeta de ideas
    "voz": ("04_Asistente_de_voz.png", 2400, 966, 744, 858),     # orbe + tarjeta «Prepara mi workspace»
    "chat": ("03_IA_crea_workspace.png", 1947, 1092, 1158, 744), # borrador creado por la IA en el chat
    "gestos": ("08_Gestos_raton.png", 2094, 1530, 873, 552),     # rueda de acciones del ratón
    "layouts": ("06_Layouts_multimonitor.png", 1533, 1041, 1155, 795),  # gestor de layouts
}
for n, (f, w, h, x, y) in RECORTES.items():
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(SRC, f), "-vf", f"crop={w}:{h}:{x}:{y}",
                    "-q:v", "2", os.path.join(DST, n + ".jpg")], check=True)

# Omnibar: tapar «Workspace Launcher» (título de la ventana de VS Code en la ficha seleccionada)
p = os.path.join(DST, "omnibar.jpg")
im = Image.open(p).convert("RGB")
d = ImageDraw.Draw(im)
bg = im.getpixel((815, 522))
d.rectangle([434, 508, 806, 574], fill=bg)
font = ImageFont.truetype(os.path.join(RAIZ, "public", "fonts", "PlusJakartaSans.ttf"), 34)
try:
    font.set_variation_by_axes([700])
except Exception:
    pass
d.text((441, 543), "proyecto-web", font=font, fill=(240, 240, 240), anchor="lm")
im.save(p, quality=95)
print("recortes listos:", ", ".join(RECORTES))
