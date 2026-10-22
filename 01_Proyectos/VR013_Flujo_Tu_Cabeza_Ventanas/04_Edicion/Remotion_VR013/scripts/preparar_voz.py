# VR012: monta la locución a partir de las tomas elegidas en edit.config.json.
# - Whisper large-v3 da el tiempo de cada palabra (para el texto karaoke).
# - Recorta silencios por energía, coloca cada toma con su pausa y procesa la voz con ffmpeg
#   (paso alto, presencia, de-esser, compresión suave, -16 LUFS) -> public/audio/voz.wav
# - Escribe src/voz.json con tomas y palabras en tiempo absoluto del vídeo.
# Ejecutar con el Python de local-voice-studio/.venv (faster_whisper + numpy + soundfile).
import json, os, re, subprocess, sys, unicodedata
import numpy as np, soundfile as sf
from faster_whisper import WhisperModel

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cfg = json.load(open(os.path.join(RAIZ, "edit.config.json"), encoding="utf-8"))
LANG = sys.argv[1] if len(sys.argv) > 1 else "es"  # es | en
SUF = "" if LANG == "es" else "_" + LANG
V = cfg["voz" + SUF]
carpeta = V["carpeta_tomas"]
plan = {t["id"]: t for t in json.load(open(os.path.join(os.path.dirname(carpeta), V.get("plan", "plan_vocal.json")), encoding="utf-8"))["tomas"]}
NUM = {"100": "cien"}  # Whisper escribe cifras donde la voz dice la palabra
_n = lambda s: re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFD", s.lower()).encode("ascii", "ignore").decode())
norm = lambda s: NUM.get(_n(s), _n(s))

m = WhisperModel("large-v3", device="cuda", compute_type="float16")
SR = None
piezas, tomas, cursor = [], [], V["entrada_s"]

def db(x): return 20 * np.log10(np.maximum(x, 1e-9))

for t in V["tomas"]:
    ruta = os.path.join(carpeta, "%s_%s.wav" % (t["id"], t["toma"]))
    audio, sr = sf.read(ruta, dtype="float32")
    if audio.ndim > 1: audio = audio.mean(axis=1)
    SR = SR or sr
    assert sr == SR, "frecuencias distintas entre tomas"
    segs, _ = m.transcribe(ruta, language=LANG, word_timestamps=True, beam_size=5)
    ww = [w for s in segs for w in s.words]
    # energía en ventanas de 10 ms
    hop = int(sr * 0.01); env = np.array([np.sqrt(np.mean(audio[i:i + hop] ** 2)) for i in range(0, len(audio) - hop, hop)])
    voz = np.where(db(env) > db(env.max()) - 38)[0]
    ini = max(0.0, voz[0] * 0.01 - 0.04); fin = min(len(audio) / sr, (voz[-1] + 1) * 0.01 + 0.10)
    ini = min(ini, max(0.0, ww[0].start - 0.03))
    trozo = audio[int(ini * sr):int(fin * sr)].copy()
    f = int(sr * 0.012); trozo[:f] *= np.linspace(0, 1, f); trozo[-f:] *= np.linspace(1, 0, f)
    # alinear palabras del guion (con tildes y signos) con las de Whisper
    guion = plan[t["id"]]["texto"].replace("...", "…").split()
    if [norm(g) for g in guion if norm(g)] != [norm(w.word) for w in ww if norm(w.word)]:
        sys.exit("Las palabras de %s no coinciden con Whisper: %s" % (t["id"], " ".join(w.word for w in ww)))
    wi = iter([w for w in ww if norm(w.word)])
    palabras = []
    for g in guion:
        if not norm(g):
            palabras[-1]["w"] += " " + g; continue
        w = next(wi)
        palabras.append({"w": g, "s": round(cursor + w.start - ini, 3), "e": round(cursor + w.end - ini, 3)})
    dur = len(trozo) / sr
    tomas.append({"id": t["id"], "inicio": round(cursor, 3), "fin": round(cursor + dur, 3), "palabras": palabras})
    piezas.append((cursor, trozo))
    print("%s %s  %.2f s  [%.2f-%.2f]" % (t["id"], t["toma"], dur, cursor, cursor + dur), flush=True)
    cursor += dur + t["pausa_tras"]

total = cursor + V["cola_final_s"]
mezcla = np.zeros(int(total * SR) + SR, dtype="float32")
for c, p in piezas:
    i = int(round(c * SR)); mezcla[i:i + len(p)] += p
cruda = os.path.join(RAIZ, "out", "voz_cruda%s.wav" % SUF)
os.makedirs(os.path.dirname(cruda), exist_ok=True)
sf.write(cruda, mezcla[:int(total * SR)], SR)
dst = os.path.join(RAIZ, "public", "audio", "voz%s.wav" % SUF)
cadena = ("highpass=f=75,equalizer=f=180:t=q:w=1.2:g=-1.5,equalizer=f=3800:t=q:w=1.0:g=2,deesser=i=0.35:f=0.55,"
          "acompressor=threshold=-21dB:ratio=2.6:attack=6:release=140:makeup=2")
# loudnorm en dos pasadas (modo lineal): mide y aplica una ganancia fija, sin bombeo
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", cruda, "-af", cadena + ",loudnorm=I=-16:TP=-2:LRA=11:print_format=json", "-f", "null", "-"],
                   capture_output=True, text=True, encoding="utf-8", errors="replace")
med = json.loads(r.stderr[r.stderr.rfind("{"):r.stderr.rfind("}") + 1])
lin = ("loudnorm=I=-16:TP=-2:LRA=11:linear=true:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s"
       % (med["input_i"], med["input_tp"], med["input_lra"], med["input_thresh"], med["target_offset"]))
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", cruda, "-af", cadena + "," + lin + ",aresample=48000", "-ar", "48000", "-ac", "1", dst], check=True)
json.dump({"duracion": round(total, 3), "tomas": tomas}, open(os.path.join(RAIZ, "src", "voz%s.json" % SUF), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("TOTAL %.2f s -> %s" % (total, dst))
