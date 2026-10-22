# VR018 (de VR015): música propia y efectos de puerta, sintetizados (sin derechos de terceros).
# Secciones ancladas a palabras de src/voz.json:
#   misterio (La menor, tic-tac) con golpe al cruzar la «puerta» → silencio al congelar la cara
#   → pulso ligero en la explicación, golpe en «archiva» → ritmo a 120 BPM desde «ordenador» → aceleración en «por el camino»
#   y corte seco en «pierdes» → brillo del giro → floración en «habitación» → drop en «Entras» → acorde final en «venías».
# Ducking: la música baja ~10 dB cuando suena la voz (envolvente de public/audio/voz.wav).
# Uso: python scripts/sintetizar_audio.py   (Python del sistema con numpy + scipy)
import json, os, re, unicodedata
import numpy as np
from scipy import signal
from scipy.io import wavfile

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
V = json.load(open(os.path.join(RAIZ, "src", "voz.json"), encoding="utf-8"))
DUR = V["duracion"]
N = int(DUR * SR) + SR
rng = np.random.default_rng(18)
norm = lambda s: re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFD", s.lower()).encode("ascii", "ignore").decode())
def toma(tid): return next(t for t in V["tomas"] if t["id"] == tid)
def at(tid, w, nth=0): return [p for p in toma(tid)["palabras"] if norm(p["w"]) == norm(w)][nth]["s"]

T_PUERTA = at("t01", "puerta")
T_FREEZE = toma("t02")["inicio"] - 0.12        # el vídeo se congela en la cara
T_ARCH = at("t02", "archiva")
T03 = toma("t03")["inicio"] - 0.12
T_ORD = at("t03", "ordenador")
T_CAMINO = at("t04", "camino")
T_PIER = at("t04", "pierdes")                  # el hilo se rompe
T05 = toma("t05")["inicio"] - 0.12             # ¿y si…?
T_HAB = at("t05", "habitacion")
T06 = toma("t06")["inicio"] - 0.12             # entras
T07 = toma("t07")["inicio"] - 0.12
T_VEN = at("t07", "venias")
print("puerta %.2f congela %.2f archiva %.2f ordenador %.2f rotura %.2f giro %.2f habitación %.2f entras %.2f venías %.2f" % (T_PUERTA, T_FREEZE, T_ARCH, T_ORD, T_PIER, T05, T_HAB, T06, T_VEN))

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
BEAT = 0.5; BAR = BEAT * 4
F = int(0.03 * SR)

# ── 1. misterio: pad de La menor filtrado + tic-tac + golpe al cruzar la puerta ──
add(mus, pad([45, 52, 57, 60], T_FREEZE + 0.4, cutoff=700, att=0.05, rel=0.3), 0, db(-14))
add(mus, sub(33, T_FREEZE), 0, db(-15))
for k, b in enumerate(np.arange(0.0, T_FREEZE - 0.05, BEAT / 2)):
    add(mus, hat(120) * (1.0 if k % 2 == 0 else 0.6), b, db(-22), pan=(0.3 if k % 2 else -0.3))
add(mus, kick(1.3), T_PUERTA - 0.02, db(-6))
add(mus, noise_riser(1.0, 8000, 300)[::-1], T_PUERTA - 0.02, db(-22))
add(mus, noise_riser(T_FREEZE - T_PUERTA - 0.1, 300, 7000), T_PUERTA + 0.1, db(-21))
c0 = int(T_FREEZE * SR)
mus[c0 - F:c0] *= np.linspace(1, 0, F)[:, None]; mus[c0:int((T_FREEZE + 0.45) * SR)] = 0

# ── 2. explicación: pulso ligero de plucks en La menor ──
arp = [69, 72, 76, 72, 69, 74, 77, 74]
t = T_FREEZE + 0.45; k = 0
while t < T03 - 0.1:
    add(mus, pluck(arp[k % 8], 0.4), t, db(-24), pan=(-0.3 if k % 2 else 0.3)); t += BEAT / 2; k += 1
add(mus, pad([45, 52, 57, 60, 64], T03 - T_FREEZE, cutoff=1100, att=0.6, rel=0.4), T_FREEZE + 0.45, db(-19))
add(mus, kick(1.0), T_ARCH + 0.05, db(-9))

# ── 3. ritmo desde «ordenador» (rejilla anclada a la palabra) hasta que se rompe el hilo ──
prog = [([57, 60, 64], 33), ([53, 57, 60], 29), ([55, 59, 62], 31), ([52, 56, 59], 28)]
T_CUT = T_PIER + 0.05
tb = T_ORD - 0.06; i = 0
while tb < T_CUT - 0.01:
    ch, root = prog[i % 4]; d = min(BAR, T_CUT - tb)
    add(mus, pad(ch, d + 0.2, cutoff=1500, att=0.05, rel=0.2), tb, db(-18))
    add(mus, sub(root, d), tb, db(-14))
    for q in range(4):
        tk = tb + q * BEAT
        if tk >= T_CUT: break
        add(mus, kick(), tk, db(-10)); add(mus, hat(), tk + BEAT / 2, db(-21), pan=0.25)
        if q in (1, 3): add(mus, clap(), tk, db(-18))
    tb += BAR; i += 1
# «por el camino»: hats que se aceleran + subida que se corta en seco
t = T_CAMINO - 0.4; step = 0.16
while t < T_CUT:
    add(mus, hat(80), t, db(-19), pan=float(rng.uniform(-0.4, 0.4))); t += step; step = max(0.04, step * 0.85)
add(mus, noise_riser(T_CUT - T_CAMINO + 0.4, 400, 9000), T_CAMINO - 0.4, db(-16))
c0 = int(T_CUT * SR); mus[c0 - F:c0] *= np.linspace(1, 0, F)[:, None]; mus[c0:int(T05 * SR)] = 0
add(mus, kick(1.0), T_CUT, db(-10))  # golpe de la rotura (con su cola)

# ── 4. giro: brillo que crece hasta «habitación» ──
sw = int((T_HAB - T05) * SR); tt = np.arange(sw) / SR
shim = sum(np.sin(2 * np.pi * mf(m) * tt + rng.random() * 6) for m in (81, 84, 88, 91)) / 4
shim *= (np.linspace(0, 1, sw) ** 2.5) * (1 + 0.3 * np.sin(2 * np.pi * 6 * tt))
add(mus, shim, T05, db(-24))
add(mus, pad([57, 60, 64, 67], T_HAB - T05, cutoff=1300, att=1.2, rel=0.2), T05, db(-21))
add(mus, pad([48, 55, 60, 64, 67, 71, 76], T06 - T_HAB + 1.0, cutoff=3000, att=0.05, rel=0.9), T_HAB, db(-14))
add(mus, sub(36, 1.4) * np.exp(-np.arange(int(1.4 * SR)) / SR * 2), T_HAB, db(-11))

# ── 5. entras: drop cálido en Do mayor; en la última frase, sin bombo, y acorde final en «venías» ──
add(mus, kick(1.3), T06, db(-6))
add(mus, noise_riser(0.9, 9000, 300)[::-1] * 0.8, T06, db(-20))
prog_t = [([60, 64, 67, 71], 36, [72, 76, 79, 83]), ([53, 57, 60, 64], 29, [72, 77, 81, 84]), ([57, 60, 64, 67], 33, [72, 76, 81, 84]), ([55, 59, 62, 67], 31, [71, 74, 79, 83])]
END = T_VEN - 0.05
tb = T06; i = 0
while tb < END:
    ch, root, ar = prog_t[i % 4]; d = min(BAR, END - tb)
    calm = tb >= T07 - 0.3
    add(mus, pad(ch, d + 0.4, cutoff=2600, att=0.08, rel=0.4), tb, db(-15))
    add(mus, sub(root, d), tb, db(-13))
    for q in range(8):
        tk = tb + q * BEAT / 2
        if tk >= END: break
        add(mus, pluck(ar[q % 4] + (12 if q == 7 else 0)), tk, db(-21), pan=(-0.35 if q % 2 else 0.35))
    for q in range(4):
        tk = tb + q * BEAT
        if tk >= END: break
        if tk < T07 - 0.1:
            add(mus, kick(), tk, db(-11))
            if q in (1, 3): add(mus, clap(), tk, db(-19))
        add(mus, hat(), tk + BEAT / 2, db(-23 if tk < T07 else -27), pan=0.25)
    tb += BAR; i += 1
add(mus, pad([48, 55, 60, 64, 67, 74, 79], DUR - END + 0.2, cutoff=3500, att=0.05, rel=1.5), END, db(-11))
add(mus, sub(36, 2.0) * np.exp(-np.arange(int(2.0 * SR)) / SR * 1.5), END, db(-10))
for k, m in enumerate([72, 76, 79, 84]):
    add(mus, pluck(m, 1.0), END + k * 0.09, db(-20), pan=-0.4 + k * 0.25)

mus = wet(mus, 0.2)
mus = mus[: int(DUR * SR)]
fo = int(0.5 * SR); mus[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5

# ── ducking con la envolvente real de la voz ──
sr_v, voz = wavfile.read(os.path.join(RAIZ, "public", "audio", "voz.wav"))
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
wavfile.write(os.path.join(RAIZ, "public", "audio", "musica.wav"), SR, (mus * 32767).astype(np.int16))

# ── efectos propios (puertas, claqueta, sello, cajón, tecla) ──
def write(name, x):
    x = x / np.abs(x).max() * db(-3)
    wavfile.write(os.path.join(RAIZ, "public", "audio", "sfx", name), SR, (np.stack([x, x], 1) * 32767).astype(np.int16))
fit = lambda x, n: np.pad(x, (0, max(0, n - len(x))))[:n]
def thump(f0=70, dec=9, dur=0.5):
    n = int(dur * SR); tt = np.arange(n) / SR; fq = f0 + 60 * np.exp(-tt * 30)
    return np.sin(2 * np.pi * np.cumsum(fq) / SR) * np.exp(-tt * dec)
# portazo: golpe grave + crujido de madera + cola de sala
n = int(0.8 * SR); tt = np.arange(n) / SR
write("portazo.wav", thump(62, 8, 0.8) + lp(rng.standard_normal(n), 1800) * np.exp(-tt * 22) * 0.9 + bp(rng.standard_normal(n), 300, 900) * np.exp(-tt * 6) * 0.25)
# bisagra: diente de sierra con vibrato, filtrado
n = int(0.55 * SR); tt = np.arange(n) / SR
fq = 520 + 180 * np.sin(2 * np.pi * 2.3 * tt)
cr = signal.sawtooth(2 * np.pi * np.cumsum(fq) / SR) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 23 * tt)))
write("bisagra.wav", bp(cr, 700, 3200) * env_adsr(n, 0.05, 0.1, 0.8, 0.15))
# claqueta: dos chasquidos secos
n = int(0.25 * SR); tt = np.arange(n) / SR; cl = np.zeros(n)
for d, gg in ((0, 1.0), (0.018, 0.6)):
    i0 = int(d * SR); cl[i0:] += gg * bp(rng.standard_normal(n - i0), 1800, 6500) * np.exp(-tt[: n - i0] * 120)
write("claqueta.wav", cl + fit(thump(180, 40, 0.2), n) * 0.3)
# sello: golpe sordo + papel
n = int(0.4 * SR); tt = np.arange(n) / SR
write("sello.wav", thump(90, 18, 0.4) + bp(rng.standard_normal(n), 2000, 8000) * np.exp(-tt * 45) * 0.4)
# cajón: deslizamiento + golpe
n = int(0.6 * SR); tt = np.arange(n) / SR
slide = bp(rng.standard_normal(n), 500, 2500) * np.clip(tt / 0.3, 0, 1) * (tt < 0.38) * 0.35
write("cajon.wav", slide + np.roll(fit(thump(80, 14, 0.6), n), int(0.38 * SR)) * 0.9)
# tecla: clic mecánico
n = int(0.12 * SR); tt = np.arange(n) / SR
write("tecla.wav", bp(rng.standard_normal(n), 2500, 9000) * np.exp(-tt * 140) + thump(300, 60, 0.12) * 0.4)
print("música %.2f s, efectos propios listos" % (len(mus) / SR))
