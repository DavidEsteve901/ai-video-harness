"""Prepara la locución de VR008 (bloques continuos) y guarda los tiempos por palabra.
- Recorta con holgura (sin morder respiraciones ni colas), con fundidos suaves.
- NO normaliza cada toma por separado (eso cambiaba el nivel entre bloques y sonaba a cortes):
  mide el conjunto y aplica UNA sola ganancia a todos.
Uso (python del Local Voice Studio, con faster-whisper):
  python -I -X utf8 preparar_voz.py <carpeta_tomas> <carpeta_public_audio> <salida_voz.json>
"""
import json, re, subprocess, sys, glob, tempfile
from pathlib import Path
from faster_whisper import WhisperModel

src, pub, outjson = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
pub.mkdir(parents=True, exist_ok=True)
tmp = Path(tempfile.mkdtemp(prefix="vr008_"))
model = WhisperModel("small", device="cpu", compute_type="int8")


def ff(*a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *map(str, a)], check=True)


def dur(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)], capture_output=True, text=True)
    return float(r.stdout.strip())


res, trimmed = [], []
for f in sorted(glob.glob(str(src / "0*.wav"))):
    n = int(Path(f).stem)
    seg, _ = model.transcribe(f, language="es", word_timestamps=True)
    words = [w for s in seg for w in s.words]
    total = dur(f)
    a = max(0.0, words[0].start - 0.12)
    b = min(total, words[-1].end + 0.28)
    t = tmp / f"{n:02d}.wav"
    ff("-ss", f"{a:.3f}", "-t", f"{b - a:.3f}", "-i", f, "-af", f"highpass=f=70,afade=t=in:d=0.03,afade=t=out:st={max(0, b - a - 0.14):.3f}:d=0.14", "-ac", "1", "-ar", "48000", t)
    trimmed.append(t)
    res.append({"n": n, "text": " ".join(w.word.strip() for w in words), "dur": round(b - a, 3),
                "words": [{"w": w.word.strip(), "s": round(w.start - a, 3), "e": round(w.end - a, 3)} for w in words]})
    print(n, f"{b - a:.2f}s", res[-1]["text"])

# ganancia única para todo el conjunto (−16 LUFS integrados)
lst = tmp / "lista.txt"
lst.write_text("".join(f"file '{p.as_posix()}'\n" for p in trimmed), encoding="utf-8")
cat = tmp / "todo.wav"
ff("-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", cat)
m = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(cat), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
lufs = float(re.findall(r"I:\s+(-?\d+\.?\d*) LUFS", m)[-1])
gain = -16.0 - lufs
print(f"integrado {lufs:.1f} LUFS -> ganancia {gain:+.1f} dB (igual para todas las tomas)")
for p in trimmed:
    ff("-i", p, "-af", f"volume={gain:.2f}dB,acompressor=threshold=-20dB:ratio=2:attack=15:release=250:makeup=1", pub / f"vo{int(p.stem):02d}.wav")
outjson.write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
