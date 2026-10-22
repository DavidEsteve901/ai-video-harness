# VR012: música propia y efectos de encendido/apagado, sintetizados (sin derechos de terceros).
# Lee los tiempos de src/voz.json para que cada sección caiga en su palabra:
#   problema (La menor, oscuro y filtrado) → corte en «amnesia» → tensión en «todos los días» → silencio
#   → floración en «memoria» → tema en Do mayor (ligero) → drop en «vuelve todo» → pausa suave → acorde final.
# Ducking: la música baja ~7 dB cuando suena la voz (envolvente de public/audio/voz.wav).
# Uso: python scripts/sintetizar_audio.py   (Python del sistema con numpy + scipy)
import json, os, re, unicodedata
import numpy as np
from scipy import signal
from scipy.io import wavfile

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
import sys
LANG = sys.argv[1] if len(sys.argv) > 1 else "es"  # es | en
SUF = "" if LANG == "es" else "_" + LANG
V = json.load(open(os.path.join(RAIZ, "src", "voz%s.json" % SUF), encoding="utf-8"))
# anclas españolas -> palabra equivalente en inglés (mismo mapa que src/theme.ts)
ANCLAS_EN = {("t01", "abiertas"): "open", ("t04", "cien"): "hundreds", ("t05", "sola"): "own", ("t07", "el"): "your",
             ("t07", "avanza"): "forward", ("t11", "en"): "into", ("t11", "flujo"): "flow"}
DUR = V["duracion"]
N = int(DUR * SR) + SR
rng = np.random.default_rng(12)
norm = lambda s: re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFD", s.lower()).encode("ascii", "ignore").decode())

def at(tid, w, nth=0):
    if LANG == "en": w = ANCLAS_EN.get((tid, w), w)
    ps = [p for p in next(t for t in V["tomas"] if t["id"] == tid)["palabras"] if norm(p["w"]) == norm(w)]
    return ps[nth]["s"]
def toma(tid): return next(t for t in V["tomas"] if t["id"] == tid)

# VR013: secciones de la música ancladas a palabras de este guion
T_AMN = at("t01", "abiertas") + 0.35            # fin del gancho (la cabeza se satura)
T02 = toma("t02")["inicio"]
T_TODOS = at("t04", "cien")                     # «cien pequeñas decisiones»: acumulación
T04_FIN = toma("t04")["fin"]                    # corte seco
T_MEM = at("t05", "sola")                       # floración del giro
T06 = toma("t06")["inicio"]
T_CLIC = at("t07", "el")                        # hueco de tensión antes del drop
T_VUELVE = at("t07", "avanza")                  # drop: «el pulgar avanza»
T10 = toma("t10")["inicio"]                     # beneficio: sin bombo
T_AHORA = at("t11", "en")                       # silencio breve antes de «flujo»
T_ORD = at("t11", "flujo")                      # acorde final
print("amnesia %.2f todos %.2f memoria %.2f clic %.2f vuelve %.2f t10 %.2f ahora %.2f ordenador %.2f" % (T_AMN, T_TODOS, T_MEM, T_CLIC, T_VUELVE, T10, T_AHORA, T_ORD))

mf = lambda m: 440.0 * 2 ** ((m - 69) / 12)
def env_adsr(n, a, d, s, r, sr=SR):
    a, d, r = int(a * sr), int(d * sr), int(r * sr)
    e = np.ones(n) * s
    e[:a] = np.linspace(0, 1, a) if a else e[:a]
    e[a:a + d] = np.linspace(1, s, len(e[a:a + d]))
    if r: e[-r:] *= np.linspace(1, 0, len(e[-r:]))
    return e
def lp(x, fc, o=2): return signal.sosfilt(signal.butter(o, min(fc, SR / 2 - 100), "low", fs=SR, output="sos"), x)
def hp(x, fc, o=2): return signal.sosfilt(signal.butter(o, fc, "high", fs=SR, output="sos"), x)
def bp(x, lo, hi, o=2): return signal.sosfilt(signal.butter(o, [lo, hi], "band", fs=SR, output="sos"), x)

def saw(f, n, harm_max=6000, detune=0.0):
    tt = np.arange(n) / SR; out = np.zeros(n)
    for ff in (f * (1 - detune), f * (1 + detune)) if detune else (f,):
        k = 1
        while k * ff < harm_max:
            out += np.sin(2 * np.pi * k * ff * tt + rng.random() * 6.28) / k; k += 1
    return out / (2 if detune else 1)

def add(buf, x, t0, g=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= len(buf) or i + len(x) <= 0: return
    if i < 0: x = x[-i:]; i = 0
    x = x[: len(buf) - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:i + len(x), 0] += x * g * l * 1.414; buf[i:i + len(x), 1] += x * g * r * 1.414

def reverb_ir(seg=2.4):
    n = int(seg * SR); tt = np.arange(n) / SR
    ir = np.stack([rng.standard_normal(n), rng.standard_normal(n)], 1) * np.exp(-tt * 3.2)[:, None]
    ir[:, 0] = lp(ir[:, 0], 7000); ir[:, 1] = lp(ir[:, 1], 7000)
    return ir / np.abs(ir).sum(0).max() * 6
IR = reverb_ir()
def wet(buf, mix):
    out = np.zeros_like(buf)
    for c in range(2): out[:, c] = signal.fftconvolve(buf[:, c], IR[:, c])[: len(buf)]
    return buf + out * mix

# ── instrumentos ──
def pad(midis, dur, cutoff=1800, att=0.6, rel=1.2):
    n = int(dur * SR); x = sum(saw(mf(m), n, harm_max=cutoff * 2.5, detune=0.004) for m in midis) / len(midis)
    return lp(x, cutoff, 2) * env_adsr(n, att, 0.5, 0.8, rel)
def pluck(m, dur=0.5):
    n = int(dur * SR); tt = np.arange(n) / SR; f = mf(m)
    x = np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * 2 * f * tt) + 0.12 * np.sin(2 * np.pi * 3 * f * tt)
    return x * np.exp(-tt * 7) * env_adsr(n, 0.003, 0.0, 1, 0.05)
def kick(g=1.0):
    n = int(0.45 * SR); tt = np.arange(n) / SR
    f = 45 + 95 * np.exp(-tt * 28); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-tt * 7) + 0.25 * rng.standard_normal(n) * np.exp(-tt * 180)) * g
def clap():
    n = int(0.3 * SR); tt = np.arange(n) / SR; x = np.zeros(n)
    for d in (0, 0.011, 0.022):
        i = int(d * SR); x[i:] += rng.standard_normal(n - i) * np.exp(-(tt[: n - i]) * 30)
    return bp(x, 900, 3200) * 0.7
def hat(dec=55):
    n = int(0.12 * SR); tt = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7000) * np.exp(-tt * dec) * 0.5
def sub(m, dur):
    n = int(dur * SR); tt = np.arange(n) / SR
    return np.sin(2 * np.pi * mf(m) * tt) * env_adsr(n, 0.01, 0.1, 0.9, 0.08)
def noise_riser(dur, f0=300, f1=6000):
    n = int(dur * SR); x = rng.standard_normal(n); out = np.zeros(n); blk = 2048
    for i in range(0, n, blk):
        k = i / n; fc = f0 * (f1 / f0) ** k
        out[i:i + blk] = bp(x[i:i + blk], fc * 0.7, min(fc * 1.4, 20000))
    return out * np.linspace(0, 1, n) ** 2.2

db = lambda d: 10 ** (d / 20)
mus = np.zeros((N, 2))

# ── 1. problema: La menor, oscuro, pulso de latido ──
BEAT_P = 0.625
prog_p = [([57, 60, 64], 33), ([53, 57, 60], 29), ([50, 53, 57], 26), ([52, 56, 59], 28)]
def problem_block(t0, t1, cutoff=900, gain=-14):
    t = t0; i = 0
    while t < t1:
        ch, root = prog_p[i % 4]; d = min(BEAT_P * 8, t1 - t)
        add(mus, pad(ch, d + 0.8, cutoff=cutoff, att=0.4, rel=0.8), t, db(gain))
        add(mus, sub(root + 12, d), t, db(gain - 2))
        t += BEAT_P * 8; i += 1
# gancho: arranca con todo (0 → corte en «amnesia»)
problem_block(0, T_AMN + 0.25, cutoff=1400, gain=-13)
for b in np.arange(0, T_AMN + 0.2, BEAT_P):
    add(mus, kick(0.8), b, db(-12))
    add(mus, hat(), b + BEAT_P / 2, db(-24), pan=0.3)
# problema (tras el encendido) hasta «todos los días»
problem_block(T02 - 0.3, T04_FIN + 0.05, cutoff=750, gain=-16)
b = T02 - 0.3
while b < T04_FIN:
    add(mus, kick(0.6), b, db(-15)); add(mus, kick(0.4), b + 0.22, db(-21))  # latido
    b += BEAT_P * 2
# «todos los días»: hats que se aceleran + subida que se corta en seco
t = T_TODOS; step = 0.25
while t < T04_FIN:
    add(mus, hat(80), t, db(-20), pan=float(rng.uniform(-0.4, 0.4))); t += step; step = max(0.045, step * 0.86)
r = noise_riser(T04_FIN - T_TODOS + 0.1, 400, 9000)
add(mus, r, T_TODOS, db(-17))
# corte duro al final del problema
cut = int((T04_FIN + 0.08) * SR); fade = int(0.04 * SR)
mus[cut - fade:cut] *= np.linspace(1, 0, fade)[:, None]
mus[cut:int((T_MEM - 1.4) * SR)] = 0

# ── 2. giro: brillo que crece hasta «memoria» ──
sw = int((T_MEM - (T04_FIN + 0.3)) * SR); tt = np.arange(sw) / SR
shim = sum(np.sin(2 * np.pi * mf(m) * tt + rng.random() * 6) for m in (84, 88, 91, 95)) / 4
shim *= (np.linspace(0, 1, sw) ** 3) * (1 + 0.3 * np.sin(2 * np.pi * 6 * tt))
add(mus, shim, T04_FIN + 0.3, db(-24))
add(mus, noise_riser(1.3, 1500, 12000), T_MEM - 1.3, db(-22))
# floración en «memoria»: acorde mayor abierto con cola larga
bloom = pad([48, 55, 60, 64, 67, 71, 76], T06 - T_MEM + 1.6, cutoff=3200, att=0.05, rel=1.4)
add(mus, bloom, T_MEM, db(-12))
add(mus, sub(36, 1.6) * np.exp(-np.arange(int(1.6 * SR)) / SR * 2), T_MEM, db(-10))

# ── 3. tema en Do mayor, con rejilla anclada en «vuelve» ──
BEAT = 0.625; BAR = BEAT * 4
prog_t = [([60, 64, 67, 71], 36, [72, 76, 79, 83]), ([55, 59, 62, 67], 31, [71, 74, 79, 83]), ([57, 60, 64, 67], 33, [72, 76, 81, 84]), ([53, 57, 60, 64], 29, [72, 77, 81, 84])]
anchor = T_VUELVE
first_bar = anchor - np.ceil((anchor - (T06 - 0.4)) / BAR) * BAR
end_theme = T_AHORA + 0.05
bar_i = 0; tb = first_bar
while tb < end_theme:
    ch, root, arp = prog_t[bar_i % 4]
    drop = tb >= anchor - 0.01
    calm = tb >= T10 - 0.3  # beneficio: sin bombo
    d = min(BAR, end_theme - tb)
    add(mus, pad(ch, d + 0.5, cutoff=2600 if drop else 1500, att=0.25, rel=0.5), tb, db(-15 if drop else -16))
    # arpegio en corcheas
    for k in range(8):
        tk = tb + k * BEAT / 2
        if tk >= end_theme: break
        if not drop and tb + k * BEAT / 2 > T_CLIC - 0.05 and tb + k * BEAT / 2 < anchor: continue  # hueco tras «un clic»
        add(mus, pluck(arp[k % 4] if k < 4 else arp[(k * 3) % 4] + (12 if k == 7 else 0)), tk, db(-21 if drop else -23), pan=(-0.35 if k % 2 else 0.35))
    if drop:
        add(mus, sub(root, d), tb, db(-13))
        for k in range(4):
            tk = tb + k * BEAT
            if tk >= end_theme: break
            if not calm: add(mus, kick(), tk, db(-10))
            add(mus, hat(), tk + BEAT / 2, db(-23 if not calm else -27), pan=0.25)
            if k in (1, 3) and not calm: add(mus, clap(), tk, db(-18), pan=-0.1)
    tb += BAR; bar_i += 1
# tensión entre «un clic» y «vuelve»: subida + bajón de filtro
add(mus, noise_riser(anchor - T_CLIC, 600, 10000), T_CLIC, db(-16))
add(mus, kick(1.2), anchor, db(-6))  # impacto del drop
add(mus, noise_riser(0.9, 8000, 300)[::-1] * 0.8, anchor, db(-20))
# corte en «ahora» (la pantalla se apaga) y acorde final al encender
c0 = int((T_AHORA + 0.05) * SR); mus[c0:c0 + int(0.03 * SR)] *= np.linspace(1, 0, int(0.03 * SR))[:, None]; mus[c0 + int(0.03 * SR):] = 0
fin = pad([48, 55, 60, 64, 67, 74, 79], DUR - T_ORD + 0.2, cutoff=3500, att=0.08, rel=2.2)
add(mus, fin, T_ORD - 0.1, db(-11))
add(mus, sub(36, 2.5) * np.exp(-np.arange(int(2.5 * SR)) / SR * 1.5), T_ORD - 0.1, db(-9))
for k, m in enumerate([72, 76, 79, 83, 84]):
    add(mus, pluck(m, 1.2), T_ORD - 0.1 + k * 0.11, db(-19), pan=-0.4 + k * 0.2)

mus = wet(mus, 0.22)
mus = mus[: int(DUR * SR)]
# fundido final
fo = int(1.2 * SR); mus[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5

# ── ducking con la envolvente real de la voz ──
sr_v, voz = wavfile.read(os.path.join(RAIZ, "public", "audio", "voz%s.wav" % SUF))
voz = voz.astype(np.float32) / (32768 if voz.dtype == np.int16 else 1)
if voz.ndim > 1: voz = voz.mean(1)
hop = 480; e = np.array([np.sqrt(np.mean(voz[i:i + hop] ** 2)) for i in range(0, len(voz), hop)])
on = (20 * np.log10(e + 1e-9) > -42).astype(float)
g = np.zeros_like(on); s = 0.0
for i, v in enumerate(on):
    s = s + (v - s) * (0.35 if v > s else 0.05)  # ataque rápido, suelta lenta
    g[i] = s
duck = db(-10) ** g
duck = np.interp(np.arange(len(mus)), np.arange(len(duck)) * hop, duck)
mus *= duck[:, None]
mus /= np.abs(mus).max() / db(-3)
wavfile.write(os.path.join(RAIZ, "public", "audio", "musica%s.wav" % SUF), SR, (mus * 32767).astype(np.int16))

# ── efectos propios ──
def write(name, x):
    x = x / np.abs(x).max() * db(-3)
    wavfile.write(os.path.join(RAIZ, "public", "audio", "sfx", name), SR, (np.stack([x, x], 1) * 32767).astype(np.int16))
n = int(0.55 * SR); tt = np.arange(n) / SR
f = 1100 * np.exp(-tt * 7) + 50; ph = 2 * np.pi * np.cumsum(f) / SR
fit = lambda x, n: np.pad(x, (0, max(0, n - len(x))))[:n]
write("apagar.wav", np.sin(ph) * np.exp(-tt * 4) * 0.8 + hp(rng.standard_normal(n), 3000) * np.exp(-tt * 30) * 0.3 + fit(kick(0.8), n) * 0.5)
n = int(0.6 * SR); tt = np.arange(n) / SR
f = 90 + 1400 * (1 - np.exp(-tt * 6)); ph = 2 * np.pi * np.cumsum(f) / SR
write("encender.wav", np.sin(ph) * (1 - np.exp(-tt * 30)) * np.exp(-tt * 3.5) * 0.6 + fit(kick(0.7), n) * 0.6 + hp(rng.standard_normal(n), 6000) * np.exp(-tt * 12) * 0.15)
print("música %.2f s, efectos propios listos" % (len(mus) / SR))
