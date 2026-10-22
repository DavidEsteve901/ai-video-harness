# Hojas de fotogramas (revisión FMT-004).
#  - Cada 0,5 s: python scripts/hojas.py out/rev_V.mp4 out/hojas_V 8x3 [ancho_celda]
#  - Una imagen por frase (al final de su última palabra), 6x2 a media escala, como VR013_*_revision_fotogramas.png:
#    python scripts/hojas.py out/VR014_V_final.mp4 out/revision_V.png claves
import json, os, subprocess, sys, tempfile

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src, dst, tile = sys.argv[1], sys.argv[2], (sys.argv[3] if len(sys.argv) > 3 else "6x4")

if tile == "claves":
    voz = json.load(open(os.path.join(RAIZ, "src", "voz.json"), encoding="utf-8"))
    tiempos = [min(t["palabras"][-1]["e"] + 0.1, t["fin"]) for t in voz["tomas"]]
    tmp = tempfile.mkdtemp()
    for i, t in enumerate(tiempos):
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "%.3f" % t, "-i", src, "-frames:v", "1",
                        "-vf", "scale=iw/2:ih/2", os.path.join(tmp, "k_%02d.png" % (i + 1))], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "1", "-i", os.path.join(tmp, "k_%02d.png"),
                    "-vf", "tile=%dx2" % ((len(tiempos) + 1) // 2), "-frames:v", "1", dst], check=True)
    print(dst, ", ".join("%.2f" % t for t in tiempos))
    sys.exit()

ancho = sys.argv[4] if len(sys.argv) > 4 else "iw"
os.makedirs(dst, exist_ok=True)
font = "C\\:/Windows/Fonts/arialbd.ttf"
vf = ("fps=2,scale=%s:-2,drawtext=fontfile='%s':text='%%{pts\\:hms}':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6,"
      "tile=%s:padding=4:color=gray" % (ancho, font, tile))
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-vf", vf, os.path.join(dst, "hoja_%02d.png")], check=True)
print("\n".join(sorted(os.listdir(dst))))
