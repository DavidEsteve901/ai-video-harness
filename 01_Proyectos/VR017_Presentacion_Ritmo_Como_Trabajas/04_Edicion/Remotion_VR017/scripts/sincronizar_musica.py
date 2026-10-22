# VR017: sincroniza el vídeo con una pista externa (p. ej. «Loser» de Tame Impala) que el USUARIO deja en
#   01_Proyectos/VR017_*/03_Recursos/musica/   (mp3, wav, m4a, flac, ogg, opus, webm)
# 1) decodifica la pista con ffmpeg; 2) detecta tempo y golpes (librosa si está instalada; si no, detector propio
#    numpy/scipy: flujo espectral + autocorrelación + programación dinámica de Ellis); 3) elige qué golpe es el 1 del
#    compás (más energía de bombo); 4) busca el tramo de la canción cuyo bloque de más energía cae en el DROP de la rejilla
#    (src/ritmo.ts) y cuya entrada es tranquila; 5) recorta ese tramo -> public/audio/musica_loser.wav y escribe
#    src/ritmo_loser.json con los golpes reales. Las composiciones VR017-*-Loser aparecen solas al existir ese JSON.
# La pista es música comercial con derechos: la variante resultante es solo para el uso que decida el usuario.
# Probado (2026-10-22) con una canción sintética de 118 BPM y silencio inicial de 1,37 s: tempo 117,5, golpes a ±7 ms, drop
#   colocado a 10 ms del real. Con canciones reales, revisa el tramo elegido; --compas-inicio / --bpm / --fase lo fuerzan.
# Uso: python scripts/sincronizar_musica.py [--archivo RUTA] [--compas-inicio N] [--bpm-aprox 110] [--bpm 120] [--fase 0-3]
import argparse, glob, json, os, re, subprocess, sys, tempfile
import numpy as np

for _f in (sys.stdout, sys.stderr):  # la consola de Windows (cp1252) no admite «≈», «·», «→»
    try: _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception: pass
from scipy import signal
from scipy.io import wavfile

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROYECTO = r"<RAIZ_REPO>\01_Proyectos"
EXT = (".mp3", ".wav", ".m4a", ".flac", ".ogg", ".opus", ".webm", ".aac")

ap = argparse.ArgumentParser()
ap.add_argument("--archivo")
ap.add_argument("--compas-inicio", type=int, default=None, help="forzar el compás de la canción donde empieza el vídeo")
ap.add_argument("--bpm-aprox", type=float, default=110.0)
ap.add_argument("--bpm", type=float, default=None, help="tempo conocido de la pista (salta la detección de tempo)")
ap.add_argument("--fase", type=int, default=None, help="forzar qué golpe (0-3) es el 1 del compás")
args = ap.parse_args()

src_ts = open(os.path.join(RAIZ, "src", "ritmo.ts"), encoding="utf-8").read()
R = json.loads(re.search(r"RITMO = (\{.*?\}) as const;", src_ts, re.S).group(1))
SEC = {}; acc = 0
for n, c in R["secciones"]:
    SEC[n] = (acc, acc + c); acc += c
TOTAL = acc; PPC = R["pulsosPorCompas"]; OFF = R["offset"]; COLA = R["cola"]

archivo = args.archivo
if not archivo:
    cands = []
    for d in glob.glob(os.path.join(PROYECTO, "VR017_*", "03_Recursos", "musica")):
        cands += [f for f in glob.glob(os.path.join(d, "*")) if f.lower().endswith(EXT)]
    if not cands:
        print("No hay pista en 01_Proyectos/VR017_*/03_Recursos/musica/. Deja ahí el audio y vuelve a ejecutar este script.")
        sys.exit(0)
    archivo = sorted(cands, key=os.path.getmtime)[-1]
print("pista:", archivo)

tmp = tempfile.mkdtemp()
mono = os.path.join(tmp, "mono.wav"); est = os.path.join(tmp, "est.wav")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", archivo, "-vn", "-ac", "1", "-ar", "22050", "-c:a", "pcm_f32le", mono], check=True)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", archivo, "-vn", "-ac", "2", "-ar", "48000", "-c:a", "pcm_f32le", est], check=True)
sr, y = wavfile.read(mono); y = y.astype(np.float64)
HOP = 512; FR = sr / HOP

def beats_propios(y):
    f, tt, Z = signal.stft(y, sr, nperseg=2048, noverlap=2048 - HOP, boundary=None, padded=False)
    S = np.log1p(100 * np.abs(Z))
    flux = np.maximum(0, np.diff(S, axis=1)).sum(0)
    flux = np.concatenate([[0], flux])
    flux = flux - signal.medfilt(flux, 31)  # quita la tendencia
    onset = np.maximum(flux, 0); onset /= onset.std() + 1e-9
    # tempo: autocorrelación del flujo con peine de múltiplos (k·lag, k=1..4) para no caer en medio tempo
    # (bombo fuerte en 1 y 3 hace que el retardo de 2 pulsos correlacione más que el de 1) y preferencia suave
    # alrededor de --bpm-aprox. Con --bpm se fija el tempo y solo se buscan los golpes.
    ac = np.correlate(onset, onset, "full")[len(onset) - 1:]
    ac = ac / (len(onset) - np.arange(len(ac)))  # sin sesgo: compensa que a más retardo hay menos solape
    def aci(x):
        x = np.asarray(x, float); i = np.floor(x).astype(int); f = x - i
        ok = i + 1 < len(ac)
        return np.where(ok, ac[np.minimum(i, len(ac) - 2)] * (1 - f) + ac[np.minimum(i + 1, len(ac) - 1)] * f, 0)
    if args.bpm:
        lagf = 60 * FR / args.bpm
    else:
        lags = np.arange(60 * FR / 190, 60 * FR / 60, 0.25)
        comb = sum(aci(k * lags) for k in (1, 2, 3, 4)) / 4
        bpm_l = 60 * FR / lags
        w = np.exp(-0.5 * (np.log2(bpm_l / args.bpm_aprox) / 1.0) ** 2)
        score = comb * w
        j = int(np.argmax(score))
        lagf = float(lags[j])
        # refina en el pico de la autocorrelación simple cerca de ese retardo
        fino = np.arange(lagf - 1.5, lagf + 1.5, 0.02)
        lagf = float(fino[int(np.argmax(aci(fino) + aci(2 * fino) / 2))])
    period = lagf
    # programación dinámica (Ellis 2007)
    n = len(onset); sc = onset.copy(); back = -np.ones(n, int)
    prange = np.arange(int(-2 * period), -int(period / 2))
    txw = -100 * (np.log(-prange / period)) ** 2
    for i in range(n):
        lo = i + prange
        v = lo >= 0
        if not v.any(): continue
        cand = sc[lo[v]] + txw[v]
        k = int(np.argmax(cand)); sc[i] = onset[i] + cand[k]; back[i] = lo[v][k]
    i = int(np.argmax(sc[-int(2 * period):])) + n - int(2 * period)
    out = []
    while i >= 0:
        out.append(i); i = back[i]
    # cada valor del flujo pertenece a una ventana de 2048 muestras: se fecha en su centro (sin esto, golpes ~50 ms adelantados)
    return np.array(out[::-1]) / FR + 1024 / sr, onset

try:
    import librosa  # opcional
    tempo, bf = librosa.beat.beat_track(y=y.astype(np.float32), sr=sr, hop_length=HOP, start_bpm=args.bpm_aprox)
    golpes = librosa.frames_to_time(bf, sr=sr, hop_length=HOP)
    metodo = "librosa %s" % librosa.__version__
except Exception:
    golpes, _ = beats_propios(y)
    metodo = "detector propio (numpy/scipy)"
golpes = np.asarray(golpes, float)
iv = np.diff(golpes)
bpm = 60 / np.median(iv)
print("método %s · %d golpes · tempo ≈ %.2f BPM · estabilidad (desv. del intervalo) %.1f ms" % (metodo, len(golpes), bpm, 1000 * iv.std()))

# energía de bombo por golpe → fase del compás (qué golpe es el 1)
sos = signal.butter(4, [40, 160], "band", fs=sr, output="sos")
kick = np.abs(signal.sosfilt(sos, y))
def e_at(t, win=0.07):
    i = int(t * sr); return kick[i:i + int(win * sr)].mean() if i < len(kick) else 0
ke = np.array([e_at(g) for g in golpes])
# los cambios de sección caen en el 1 del compás: novedad de energía por golpe en cada fase posible
be = np.array([np.sqrt(np.mean(y[int(a * sr):int(b * sr)] ** 2)) + 1e-9 for a, b in zip(golpes[:-1], golpes[1:])])
nov = np.abs(np.diff(20 * np.log10(be)))  # nov[i]: salto al entrar en el golpe i+1
nz = lambda v: (np.asarray(v) - np.mean(v)) / (np.std(v) + 1e-9)
kf = nz([ke[p::PPC].mean() for p in range(PPC)])
nf = nz([nov[(p - 1) % PPC::PPC].mean() for p in range(PPC)])
fase = int(np.argmax(kf + 1.5 * nf)) if args.fase is None else args.fase
compases = golpes[fase::PPC]
rms = np.array([np.sqrt(np.mean(y[int(a * sr):int(b * sr)] ** 2)) for a, b in zip(compases[:-1], compases[1:])])
rdb = 20 * np.log10(rms + 1e-9)
print("fase del compás: golpe %d · %d compases completos" % (fase, len(rdb)))

# elegir el tramo: drop con la máxima energía, intro tranquila, salto al entrar el drop
nec = TOTAL + int(np.ceil(COLA / (PPC * 60 / bpm))) + 1
mejor, s_best = -1e9, 0
for s in range(0, max(1, len(rdb) - nec)):
    d = rdb[s + SEC["drop"][0]: s + SEC["drop"][1]].mean()
    i_ = rdb[s + SEC["intro"][0]: s + SEC["intro"][1]].mean()
    salto = rdb[s + SEC["drop"][0]] - rdb[s + SEC["corte"][0]]
    sc = d - 0.5 * i_ + 0.6 * salto
    if sc > mejor: mejor, s_best = sc, s
if args.compas_inicio is not None: s_best = args.compas_inicio
ini = compases[s_best] - OFF
if ini < 0:
    print("el tramo elegido empieza demasiado pronto; se usa el compás siguiente"); s_best += 1; ini = compases[s_best] - OFF
g0 = fase + s_best * PPC
g = golpes[g0:] - ini
need = TOTAL * PPC + 1
if len(g) < need:
    print("la canción no alcanza para %d compases desde ese punto" % TOTAL); sys.exit(1)
dur = g[TOTAL * PPC] + COLA
print("tramo: compás %d de la canción (%.2f s) · drop en %.2f s de la canción · duración %.2f s" % (s_best, ini + OFF, ini + g[SEC["drop"][0] * PPC], dur))

dst = os.path.join(RAIZ, "public", "audio", "musica_loser.wav")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "%.4f" % ini, "-t", "%.4f" % dur, "-i", est,
                "-af", "afade=t=in:d=0.02,afade=t=out:st=%.3f:d=1.6,loudnorm=I=-16:TP=-2:LRA=11" % (dur - 1.6), "-ar", "48000", "-c:a", "pcm_s16le", dst], check=True)
info = {"disponible": True, "bpm": round(float(bpm), 3), "offset": round(float(g[0]), 4), "golpes": [round(float(v), 4) for v in g[: need + 8]],
        "cola": COLA, "audio": "audio/musica_loser.wav", "volumen": 1, "fuente": os.path.basename(archivo), "metodo": metodo,
        "compasInicioCancion": int(s_best), "inicioEnCancion_s": round(float(ini), 3),
        "nota": "Pista comercial con derechos (no incluida en el proyecto): variante solo para el uso que decida el usuario."}
json.dump(info, open(os.path.join(RAIZ, "src", "ritmo_loser.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("listo: public/audio/musica_loser.wav + src/ritmo_loser.json → composiciones VR017-Vertical-Loser / VR017-Horizontal-Loser")
print("render: npx remotion render src/index.ts VR017-Vertical-Loser out/VR017_V_loser_raw.mp4 --crf=16 --pixel-format=yuv420p --concurrency=4")
print("máster: python scripts/masterizar.py out/VR017_V_loser_raw.mp4 out/VR017_V1_1080x1920_60fps_loser.mp4 --ref public/audio/musica_loser.wav")
print("para volver a la música propia sola: deja src/ritmo_loser.json como {\"disponible\": false}")
