# VR012/VR017: masteriza el audio de un MP4 renderizado (loudnorm en dos pasadas, -14 LUFS, pico -1,5 dBTP) sin tocar el vídeo.
# VR017: el AAC que sale del render llega ~2048 muestras (≈ 43 ms) tarde respecto a la imagen (relleno inicial del
# codificador sin lista de edición). Con --ref <wav de la música> se mide ese retraso por correlación y se recorta,
# para que los golpes de la música caigan en el fotograma exacto de la rejilla.
# Tras loudnorm, un limitador final a −2 dBFS: con −14 LUFS la ganancia de loudnorm podía dejar picos por encima de 0 dBFS.
# Uso: python scripts/masterizar.py out/VR017_H_raw.mp4 out/VR017_H1_1920x1080_60fps.mp4 [--ref public/audio/musica.wav]
import json, os, subprocess, sys, tempfile
import numpy as np
for _f in (sys.stdout, sys.stderr):
    try: _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception: pass
from scipy import signal
from scipy.io import wavfile

args = [a for a in sys.argv[1:]]
ref = None
if "--ref" in args:
    i = args.index("--ref"); ref = args[i + 1]; del args[i:i + 2]
src, dst = args[0], args[1]

def retraso_ms(video, wav):
    tmp = tempfile.mkdtemp(); a_ = os.path.join(tmp, "a.wav"); b_ = os.path.join(tmp, "b.wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", video, "-vn", "-ac", "1", "-ar", "22050", a_], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-ac", "1", "-ar", "22050", b_], check=True)
    sr, a = wavfile.read(a_); _, b = wavfile.read(b_)
    a = a.astype(float); b = b.astype(float)
    n = min(len(a), len(b)); i0, i1 = int(n * 0.3), int(n * 0.75)  # tramo central con la música llena
    x, y = a[i0:i1], b[i0:i1]
    c = signal.fftconvolve(x, y[::-1], "full"); lag = (np.argmax(c) - (len(y) - 1)) / sr
    return 1000 * lag

ss = ["-ss", "0"]  # el audio se lee desde una segunda entrada adelantada (búsqueda exacta al decodificar; un atrim dejaba un pico suelto)
if ref:
    ms = retraso_ms(src, ref)
    print("retraso del audio respecto a la música: %.1f ms" % ms)
    if 5 < ms < 200:
        ss = ["-ss", "%.5f" % (ms / 1000)]
r = subprocess.run(["ffmpeg", "-hide_banner", *ss, "-i", src, "-af", "alimiter=limit=0.75:level=false:attack=3:release=60,loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-vn", "-f", "null", "-"],
                   capture_output=True, text=True, encoding="utf-8", errors="replace")
m = json.loads(r.stderr[r.stderr.rfind("{"):r.stderr.rfind("}") + 1])
af = ("loudnorm=I=-14:TP=-1.5:LRA=11:linear=true:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s"
      % (m["input_i"], m["input_tp"], m["input_lra"], m["input_thresh"], m["target_offset"]))
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, *ss, "-i", src, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-af", "alimiter=limit=0.75:level=false:attack=3:release=60," + af + ",alimiter=limit=0.79:level=false:attack=2:release=50,aresample=48000",
                "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart", dst], check=True)
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", dst, "-af", "ebur128=peak=true", "-vn", "-f", "null", "-"], capture_output=True, text=True, encoding="utf-8", errors="replace")
res = r.stderr[r.stderr.rfind("Summary"):]
print(dst, " ".join(l.strip() for l in res.splitlines() if l.strip().startswith(("I:", "Peak:"))))
if ref:
    print("retraso tras masterizar: %.1f ms" % retraso_ms(dst, ref))
