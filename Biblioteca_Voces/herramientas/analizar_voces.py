"""Control de calidad objetivo de voces (complementa al oído, no lo sustituye).

    C:\\Herramientas\\local-voice-studio\\.venv\\Scripts\\python.exe -I -X utf8 analizar_voces.py <wav|carpeta> [...] [--lang es]

Por cada audio mide:
  f0      tono medio (Hz) → género percibido (hombre < 150 Hz, mujer > 175 Hz; entre medias = ambiguo)
  sib     sibilancia: energía de 5-10 kHz respecto al total, en dB (más alto = «sssss» más marcadas)
  sibpico sibilancia en los frames más agudos (p95)
  conf    confianza media de Whisper-small (avg logprob): más baja = habla menos clara o con acento extranjero
  lang    probabilidad de que Whisper detecte el idioma esperado (baja = suena a otro idioma)
Sirve para comparar contra voces nativas reales (referencia) y detectar valores raros.
"""
import argparse, sys
from pathlib import Path
import numpy as np, soundfile as sf

STUDIO = Path(r"C:\Herramientas\local-voice-studio")
sys.path.insert(0, str(STUDIO))
_wh = None


def whisper():
    global _wh
    if _wh is None:
        from faster_whisper import WhisperModel
        from voice_studio.config import model_path
        _wh = WhisperModel(str(model_path("whisper-small")), device="cpu", compute_type="int8", cpu_threads=8, local_files_only=True)
    return _wh


def f0_medio(x, sr):
    n, hop = 1024, 256
    out = []
    for i in range(0, len(x) - n, hop):
        fr = x[i:i + n] * np.hanning(n)
        if np.sqrt(np.mean(fr ** 2)) < 0.02 * (np.abs(x).max() + 1e-9):
            continue
        ac = np.correlate(fr, fr, "full")[n - 1:]; ac /= ac[0] + 1e-12
        lo, hi = int(sr / 400), int(sr / 60)
        k = lo + int(np.argmax(ac[lo:hi]))
        if ac[k] > 0.35:
            out.append(sr / k)
    return float(np.median(out)) if out else 0.0


def sibilancia(x, sr):
    n, hop = 1024, 512
    w = np.hanning(n); fr = np.fft.rfftfreq(n, 1 / sr)
    hi = (fr >= 5000) & (fr <= min(10000, sr / 2 - 1)); tot = (fr >= 70) & (fr <= min(10000, sr / 2 - 1))
    r = []
    for i in range(0, len(x) - n, hop):
        s = np.abs(np.fft.rfft(x[i:i + n] * w)) ** 2
        if s[tot].sum() > 1e-9 * n and np.sqrt(np.mean((x[i:i + n]) ** 2)) > 0.02 * (np.abs(x).max() + 1e-9):
            r.append(10 * np.log10(s[hi].sum() / s[tot].sum() + 1e-12))
    r = np.array(r) if r else np.array([-60.0])
    allx = np.abs(np.fft.rfft(x)) ** 2; ff = np.fft.rfftfreq(len(x), 1 / sr)
    glob = 10 * np.log10(allx[(ff >= 5000) & (ff <= 10000)].sum() / allx[(ff >= 70) & (ff <= 10000)].sum() + 1e-12)
    return float(glob), float(np.percentile(r, 95))


def analizar(p, lang="es"):
    x, sr = sf.read(str(p)); x = x if x.ndim == 1 else x.mean(1)
    sib, pico = sibilancia(x, sr)
    segs, info = whisper().transcribe(str(p), language=None if lang == "auto" else lang, beam_size=1)
    segs = list(segs)
    conf = float(np.mean([s.avg_logprob for s in segs])) if segs else -9.0
    return dict(archivo=Path(p).name, f0=round(f0_medio(x, sr)), sib=round(sib, 1), sibpico=round(pico, 1), conf=round(conf, 2),
                lang=round(info.language_probability, 2) if info.language == lang else 0.0, dur=round(len(x) / sr, 1),
                texto=" ".join(s.text for s in segs).strip())


def genero(f0):
    return "H" if f0 < 150 else ("M" if f0 > 175 else "?")


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("rutas", nargs="+"); ap.add_argument("--lang", default="es")
    a = ap.parse_args()
    ficheros = []
    for r in a.rutas:
        r = Path(r); ficheros += sorted(r.glob("*.wav")) if r.is_dir() else [r]
    print(f"{'archivo':<52}{'f0':>5} gen{'sib dB':>8}{'pico':>7}{'conf':>7}{'lang':>6}")
    for f in ficheros:
        m = analizar(f, a.lang)
        print(f"{m['archivo'][:51]:<52}{m['f0']:>5} {genero(m['f0']):>3}{m['sib']:>8}{m['sibpico']:>7}{m['conf']:>7}{m['lang']:>6}", flush=True)


if __name__ == "__main__":
    main()
