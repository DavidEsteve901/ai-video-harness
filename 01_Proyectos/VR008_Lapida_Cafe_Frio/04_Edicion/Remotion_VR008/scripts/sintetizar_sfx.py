"""Sintetiza los efectos de sonido y la música de VR008 (propios, sin derechos).
Uso:  python sintetizar_sfx.py <carpeta_salida>      (necesita numpy + scipy)
Genera WAV 48 kHz mono en <carpeta_salida>/sfx_*.wav y mus_*.wav
"""
import sys
from pathlib import Path
import numpy as np
from scipy.io import wavfile
from scipy import signal

SR = 48000
rng = np.random.default_rng(8)
out = Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)


def T(d): return np.arange(int(SR * d)) / SR
def noise(d): return rng.uniform(-1, 1, int(SR * d))
def env_exp(t, tau): return np.exp(-t / tau)
def fade(x, a=0.004, b=0.02):
    n = len(x); na, nb = int(SR * a), int(SR * b)
    if na: x[:na] *= np.linspace(0, 1, na)
    if nb: x[-nb:] *= np.linspace(1, 0, nb)
    return x
def lp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, "low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, "high", fs=SR, output="sos"), x)
def bp(x, f1, f2, o=2): return signal.sosfilt(signal.butter(o, [f1, f2], "band", fs=SR, output="sos"), x)
def save(name, x, peak=0.89):
    x = np.asarray(x, dtype=np.float64)
    m = np.max(np.abs(x)) or 1
    wavfile.write(out / f"{name}.wav", SR, (x / m * peak * 32767).astype(np.int16))
def tone(f, d, shape="sin"):
    t = T(d); ph = 2 * np.pi * np.cumsum(np.broadcast_to(f, t.shape)) / SR
    if shape == "saw": return 2 * ((ph / (2 * np.pi)) % 1) - 1
    return np.sin(ph)


# ── golpe de la lápida: sub grave + polvo
t = T(1.6)
thud = 0.95 * tone(60 * np.exp(-t * 3) + 38, 1.6) * env_exp(t, 0.45) + 0.5 * lp(noise(1.6), 900) * env_exp(t, 0.12)
save("sfx_thud", fade(thud, 0.001, 0.05))

# ── viento
t = T(5)
w = bp(noise(5), 180, 900) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.35 * t + 1.1)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.13 * t))
save("sfx_wind", fade(w, 0.4, 0.5), 0.5)

# ── rebobinado de cinta
t = T(0.9)
f = 700 + 2600 * (t / 0.9) ** 1.6
rew = 0.4 * tone(f, 0.9, "saw") * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 38 * t))) + 0.7 * hp(noise(0.9), 1500) * (0.6 + 0.4 * np.sin(2 * np.pi * 61 * t))
rew = bp(rew, 500, 7000) * np.minimum(1, t / 0.05) * np.minimum(1, (0.9 - t) / 0.12)
save("sfx_rewind", rew)

# ── reloj: tic y toc
t = T(0.12)
save("sfx_tic", fade(0.9 * bp(noise(0.12), 1800, 5200) * env_exp(t, 0.012) + 0.4 * tone(1500, 0.12) * env_exp(t, 0.01)), 0.89)
save("sfx_toc", fade(0.9 * bp(noise(0.12), 1100, 3800) * env_exp(t, 0.014) + 0.4 * tone(980, 0.12) * env_exp(t, 0.012)), 0.89)

# ── plops de ventana (tres alturas) y clic
for i, f0 in enumerate((520, 680, 860)):
    t = T(0.28)
    save(f"sfx_plop{i+1}", fade(0.9 * tone(f0 * (1 + 1.6 * np.exp(-t * 55)), 0.28) * env_exp(t, 0.06) + 0.25 * hp(noise(0.28), 2500) * env_exp(t, 0.01)))
t = T(0.09)
save("sfx_click", fade(0.8 * hp(noise(0.09), 1200) * env_exp(t, 0.006) + 0.5 * tone(2100, 0.09) * env_exp(t, 0.01)))

# ── whoosh corto
t = T(0.55)
save("sfx_whoosh", fade(bp(noise(0.55), 300, 6000) * np.sin(np.pi * t / 0.55) ** 2))

# ── trombón triste (wah wah wah wahhh) para el café frío
notes = [(392, 0.38), (370, 0.38), (349, 0.38), (311, 1.0)]
parts = []
for f0, d in notes:
    t = T(d)
    vib = 1 + 0.012 * np.sin(2 * np.pi * 5.5 * t) * (t > 0.5)
    x = tone(f0 * vib * (1 - 0.06 * (t / d)), d, "saw")
    y = lp(x, 1500, 2) * np.minimum(1, t / 0.03) * np.minimum(1, (d - t) / 0.06)
    parts.append(np.concatenate([y, np.zeros(int(SR * 0.04))]))
save("sfx_womp", np.concatenate(parts), 0.7)

# ── hielo / crujido
t = T(0.5)
crack = sum(np.roll(hp(noise(0.5), 4500) * env_exp(t, 0.01), int(SR * s)) for s in (0.0, 0.07, 0.15, 0.22, 0.34))
save("sfx_ice", fade(crack * 0.8))

# ── pasar página de calendario
t = T(0.14)
save("sfx_page", fade(bp(noise(0.14), 900, 7000) * env_exp(t, 0.035)))

# ── riser (tensión)
t = T(2.0)
ris = 0.45 * tone(150 + 1100 * (t / 2) ** 2, 2.0, "saw") * (t / 2) ** 1.5 + 0.5 * hp(noise(2.0), 1800) * (t / 2) ** 2
save("sfx_riser", fade(lp(ris, 5000), 0.05, 0.01))

# ── impacto grande (el «drop» del clic)
t = T(1.8)
drop = 1.0 * tone(55 * np.exp(-t * 2.2) + 32, 1.8) * env_exp(t, 0.55) + 0.55 * lp(noise(1.8), 1800) * env_exp(t, 0.09) + 0.4 * tone(110, 1.8) * env_exp(t, 0.2)
save("sfx_drop", fade(drop, 0.001, 0.08))

# ── ding / campanilla y clink de taza
t = T(1.2)
save("sfx_ding", fade(0.6 * (tone(1318.5, 1.2) + 0.5 * tone(1760, 1.2) + 0.25 * tone(2637, 1.2)) * env_exp(t, 0.35)))
t = T(0.5)
save("sfx_clink", fade(0.7 * (tone(2900, 0.5) + 0.6 * tone(4350, 0.5) + 0.3 * tone(5800, 0.5)) * env_exp(t, 0.09)))

# ── pasos suaves / puerta: golpe seco amortiguado
t = T(0.25)
save("sfx_step", fade(lp(noise(0.25), 500) * env_exp(t, 0.045) + 0.6 * tone(90, 0.25) * env_exp(t, 0.05)))

# ── pájaros del amanecer
chirps = np.zeros(int(SR * 1.6))
for s, f0 in ((0.05, 3300), (0.2, 3700), (0.33, 3500), (0.75, 3900), (0.9, 3400), (1.05, 3800)):
    t = T(0.11); ch = tone(f0 + 900 * np.sin(np.pi * t / 0.11), 0.11) * np.sin(np.pi * t / 0.11) ** 2
    i = int(SR * s); chirps[i:i + len(ch)] += ch
save("sfx_birds", fade(chirps * 0.6), 0.5)

# ── zumbido grave (lápida de noche)
t = T(6)
dr = (tone(55, 6) + 0.6 * tone(82.4, 6) + 0.4 * tone(110.5, 6)) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.2 * t))
save("mus_drone", fade(lp(dr, 600), 0.6, 0.8), 0.6)

# ── cama cálida (amanecer / final): pad + arpegio suave  Do–Sol–Lam–Fa
bpm = 92; beat = 60 / bpm; bar = 4 * beat
chords = [(261.63, 329.63, 392.0), (196.0, 246.94, 392.0), (220.0, 261.63, 329.63), (174.61, 220.0, 349.23)]
n = int(SR * bar * len(chords)); pad = np.zeros(n); pl = np.zeros(n)
for ci, ch in enumerate(chords):
    t0 = int(SR * bar * ci); tt = T(bar)
    for f in ch:
        pad[t0:t0 + len(tt)] += 0.22 * tone(f, bar) * np.sin(np.pi * tt / bar) ** 0.7
    for k in range(8):
        f = ch[k % 3] * (2 if k % 4 == 3 else 1)
        tp = T(0.5); note = (tone(f, 0.5) + 0.35 * tone(2 * f, 0.5)) * env_exp(tp, 0.16)
        i = t0 + int(SR * k * beat / 2)
        if i + len(note) <= n: pl[i:i + len(note)] += 0.34 * note
mus = lp(pad + pl, 3800)
save("mus_warm", fade(mus, 0.3, 0.4), 0.6)

print("OK ->", out)
