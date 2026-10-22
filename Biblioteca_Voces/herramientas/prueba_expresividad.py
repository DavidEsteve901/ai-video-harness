"""Mide si una referencia emocional se transfiere al clonar (para respaldar 04_EXPRESIVIDAD_Y_PERSONALIZACION.md).

    C:\\Herramientas\\local-voice-studio\\.venv\\Scripts\\python.exe -I -X utf8 prueba_expresividad.py

Dice la MISMA frase neutra con distintas referencias y con distintos trucos de texto/velocidad, y mide:
tono medio (Hz), variación de tono (semitonos, desviación típica y rango p10–p90), nivel (dB) y duración.
Más variación de tono y más rango = voz menos monótona. Es una medida objetiva, no sustituye al oído.
"""
import json, sys
from pathlib import Path
import numpy as np, soundfile as sf

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import generar_biblioteca as G  # noqa: E402

cat = json.loads((HERE / "catalogo_voces.json").read_text(encoding="utf-8"))
vid = lambda k: (cat["emociones"].get(k) or cat["arquetipos"].get(k))["voice_id"]
FRASE = "Hoy he abierto mi escritorio y todo estaba en su sitio."
PRUEBAS = [  # id, voz, texto
    ("ref_calma", "es_H_calma", FRASE), ("ref_deadpan", "es_H_deadpan", FRASE), ("ref_alegre", "es_H_alegre", FRASE),
    ("ref_euforia", "es_H_euforia", FRASE), ("ref_enfado", "es_H_enfado", FRASE), ("ref_grito", "es_H_grito", FRASE),
    ("ref_susurro", "es_H_susurro", FRASE), ("ref_tristeza", "es_H_tristeza", FRASE), ("ref_urgente", "es_H_urgente", FRASE),
    ("ref_epico", "es_H_epico", FRASE),
    # mismo timbre/emoción base (calma) con trucos de texto
    ("txt_exclam", "es_H_calma", "¡Hoy he abierto mi escritorio y todo estaba en su sitio!"),
    ("txt_dramatico", "es_H_calma", "Hoy... he abierto mi escritorio... y todo. Estaba. En su sitio."),
    ("txt_interj", "es_H_calma", "¡Madre mía! Hoy he abierto mi escritorio y... ¡todo estaba en su sitio! ¡No me lo puedo creer!"),
]


def medir(wav):
    x, sr = sf.read(wav)
    x = x if x.ndim == 1 else x.mean(1)
    n, hop = 1024, 256
    f0s, rms = [], []
    for i in range(0, len(x) - n, hop):
        fr = x[i:i + n] * np.hanning(n)
        r = np.sqrt(np.mean(fr ** 2)); rms.append(r)
        if r < 0.02 * (np.abs(x).max() + 1e-9):
            continue
        ac = np.correlate(fr, fr, "full")[n - 1:]; ac /= ac[0] + 1e-12
        lo, hi = int(sr / 400), int(sr / 60)
        k = lo + int(np.argmax(ac[lo:hi]))
        if ac[k] > 0.35:
            f0s.append(sr / k)
    f0 = np.array(f0s)
    st = 12 * np.log2(f0 / np.median(f0)) if len(f0) else np.array([0.0])
    act = np.array(rms)[np.array(rms) > 0.02 * np.max(rms)]
    return dict(dur=round(len(x) / sr, 2), f0_med=round(float(np.median(f0)), 0) if len(f0) else 0, f0_sd_st=round(float(st.std()), 2),
                f0_rango_st=round(float(np.percentile(st, 90) - np.percentile(st, 10)), 2),
                nivel_db=round(float(20 * np.log10(np.mean(act) + 1e-9)), 1), pico_db=round(float(20 * np.log10(np.abs(x).max() + 1e-9)), 1))


def main():
    items = [dict(id=i, lang="es", seed=21, texto=t, voice_id=vid(v)) for i, v, t in PRUEBAS]
    G.lote("clone", items, "expresividad")
    filas = []
    for i, v, t in PRUEBAS:
        w = G.TMP / "clone" / f"{i}.wav"
        if w.exists():
            m = medir(w); m.update(id=i, voz=v, whisper=G.parecido(G.leer(w, "es"), t)); filas.append(m)
    # velocidad del motor (misma referencia y texto)
    out = HERE.parent / "_pruebas_expresividad.json"
    out.write_text(json.dumps(filas, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{'prueba':<14}{'voz':<16}{'dur':>5}{'f0 Hz':>7}{'sd st':>7}{'rango':>7}{'dB':>7}{'pico':>7}{'txt':>6}")
    for m in filas:
        print(f"{m['id']:<14}{m['voz']:<16}{m['dur']:>5}{m['f0_med']:>7}{m['f0_sd_st']:>7}{m['f0_rango_st']:>7}{m['nivel_db']:>7}{m['pico_db']:>7}{m['whisper']:>6}")


if __name__ == "__main__":
    main()
