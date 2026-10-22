# Mide la voz frente al fondo (mezcla − voz) por segundo, en el audio del render ANTES de masterizar.
# FMT-004: mediana ≥ 10 dB. Uso: python scripts/medir_mezcla.py out/VR014_V_raw.mp4
import subprocess, sys, os
import numpy as np
from scipy.io import wavfile

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tmp = os.path.join(RAIZ, "out", "_mezcla.wav")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", sys.argv[1], "-vn", "-ac", "1", "-ar", "48000", tmp], check=True)
_, mez = wavfile.read(tmp)
_, voz = wavfile.read(os.path.join(RAIZ, "public", "audio", "voz.wav"))
f = lambda x: x.astype(np.float64) / (32768 if x.dtype == np.int16 else 1)
mez, voz = f(mez), f(voz)
if voz.ndim > 1: voz = voz.mean(1)
n = min(len(mez), len(voz))
# alinear por correlación completa (FFT, ±1 s): el contenedor añade un desfase (VR014: 2048 muestras,
# fuera de la antigua ventana de ±2000, que daba una alineación falsa y 0 segundos con voz)
from scipy.signal import fftconvolve
mez, voz = mez[:n], voz[:n]
c = fftconvolve(mez, voz[::-1], "full")[n - 1 - 48000:n - 1 + 48001]
lag = int(np.argmax(c)) - 48000
voz = np.roll(voz, lag)
g = np.dot(mez[:n], voz) / np.dot(voz, voz)  # ganancia de la voz dentro de la mezcla
fondo = mez[:n] - g * voz
rms = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
d = []
for i in range(0, n - 48000, 48000):
    v, b = rms(g * voz[i:i + 48000]), rms(fondo[i:i + 48000])
    if v > -40: d.append(v - b)
print("desfase %d muestras, ganancia voz %.2f, segundos con voz %d, mediana voz-fondo %.1f dB (mín %.1f)" % (lag, g, len(d), np.median(d), np.min(d)))
os.remove(tmp)
