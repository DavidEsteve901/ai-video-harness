# VR017: música PROPIA (sin derechos de terceros), sintetizada por código sobre la rejilla de src/ritmo.ts.
# Aire indie-psych de medio tiempo: bajo con groove marcado, piano eléctrico con trémolo, acordes con chorus/flanger,
# batería con bombeo y melodía con portamento en el drop. Progresión Dm9 – G13 – Cmaj9 – Am9.
#   intro (tranquila, bajo marcado, bombo apagado) → subidaA (entra la batería) → subidaB (arpegio, redoble, subida)
#   → corte (todo fuera, silencio de un pulso) → drop (tema completo) → final (sin batería, acorde de Do mayor).
# Uso: python scripts/sintetizar_audio.py   (Python del sistema con numpy + scipy)
import json, os, re
import numpy as np
from scipy import signal
from scipy.io import wavfile

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
src = open(os.path.join(RAIZ, "src", "ritmo.ts"), encoding="utf-8").read()
R = json.loads(re.search(r"RITMO = (\{.*?\}) as const;", src, re.S).group(1))
BPM, OFF, PPC, COLA = R["bpm"], R["offset"], R["pulsosPorCompas"], R["cola"]
P = 60.0 / BPM
SEC = {}
acc = 0
for n, c in R["secciones"]:
    SEC[n] = (acc, acc + c); acc += c
TOTAL = acc
beat = lambda b: OFF + b * P
bar = lambda c, p=0: beat(c * PPC + p)
s16 = lambda c, pos: bar(c) + pos * P / 4   # posición en semicorcheas dentro del compás c
DUR = bar(TOTAL) + COLA
N = int(DUR * SR) + SR
rng = np.random.default_rng(17)
inn = lambda s, c: SEC[s][0] <= c < SEC[s][1]
print("BPM %d, pulso %.3f s, %d compases, %.2f s" % (BPM, P, TOTAL, DUR), {k: v for k, v in SEC.items()})

mf = lambda m: 440.0 * 2 ** ((m - 69) / 12)
db = lambda d: 10 ** (d / 20)
def lp(x, fc, o=2): return signal.sosfilt(signal.butter(o, min(fc, SR / 2 - 100), "low", fs=SR, output="sos"), x)
def hp(x, fc, o=2): return signal.sosfilt(signal.butter(o, fc, "high", fs=SR, output="sos"), x)
def bp(x, lo, hi, o=2): return signal.sosfilt(signal.butter(o, [lo, hi], "band", fs=SR, output="sos"), x)
def env(n, a, d, s, r):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    e = np.ones(n) * s
    if a: e[:a] = np.linspace(0, 1, min(a, n))[: len(e[:a])]
    seg = e[a:a + d]; e[a:a + d] = np.linspace(1, s, len(seg))
    if r and n > 0: e[-r:] *= np.linspace(1, 0, len(e[-r:]))
    return e

class Bus:
    def __init__(self): self.b = np.zeros((N, 2))
    def add(self, x, t0, g=1.0, pan=0.0):
        i = int(round(t0 * SR))
        if x.ndim == 1: x = np.stack([x, x], 1) * [np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414]
        if i >= N: return
        if i < 0: x = x[-i:]; i = 0
        x = x[: N - i]
        self.b[i:i + len(x)] += x * g

def reverb_ir(seg=2.8, dec=2.6, lpf=6500):
    n = int(seg * SR); tt = np.arange(n) / SR
    ir = np.stack([rng.standard_normal(n), rng.standard_normal(n)], 1) * np.exp(-tt * dec)[:, None]
    for c in range(2): ir[:, c] = lp(ir[:, c], lpf)
    ir[: int(0.012 * SR)] = 0  # pre-delay
    return ir / np.abs(ir).sum(0).max() * 7
IR = reverb_ir()
def wet(buf, mix, ir=IR):
    out = np.zeros_like(buf)
    for c in range(2): out[:, c] = signal.fftconvolve(buf[:, c], ir[:, c])[: len(buf)]
    return buf + out * mix
def chorus(buf, depth=0.0025, base=0.006, rate=0.35, mix=0.6):
    """flanger/chorus estéreo por retardo modulado (aire psicodélico)"""
    n = len(buf); tt = np.arange(n) / SR; out = buf.copy()
    for c, ph in ((0, 0.0), (1, 1.9)):
        d = (base + depth * np.sin(2 * np.pi * rate * tt + ph)) * SR
        out[:, c] += mix * np.interp(np.arange(n) - d, np.arange(n), buf[:, c], left=0)
    return out

# ── armonía (una por compás) ──
DM9 = dict(b=38, k=[53, 57, 60, 64], a=[62, 65, 69, 72, 76])
G13 = dict(b=43, k=[53, 59, 64, 69], a=[62, 67, 71, 74, 76])
CM9 = dict(b=36, k=[52, 55, 59, 62], a=[60, 64, 67, 71, 74])
AM9 = dict(b=33, k=[55, 60, 64, 71], a=[57, 60, 64, 67, 71])
CFIN = dict(b=36, k=[48, 55, 59, 62, 64, 67, 71, 74], a=[72, 76, 79, 83, 86])
PROG = [DM9, G13, CM9, AM9]
CH = [PROG[c % 4] for c in range(TOTAL)]
CH[SEC["corte"][0]] = G13
d0 = SEC["drop"][0]
for i in range(d0, SEC["drop"][1]): CH[i] = PROG[(i - d0) % 4]
f0 = SEC["final"][0]
fin_seq = [DM9, G13, CFIN]
for i in range(f0, SEC["final"][1]): CH[i] = fin_seq[min(i - f0, 2)] if i < SEC["final"][1] - 1 else CFIN

# ── instrumentos ──
def epiano(m, dur, vel=1.0, trem=0.0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = mf(m)
    I = 1.6 * np.exp(-tt * 3.0) * vel
    x = np.sin(2 * np.pi * f * tt + I * np.sin(2 * np.pi * f * tt)) * np.exp(-tt * 0.9)
    x += 0.12 * np.sin(2 * np.pi * f * 14 * tt) * np.exp(-tt * 30)  # campanita del ataque
    x *= env(n, 0.004, 0.0, 1, 0.12)
    if trem: x *= 1 - trem * (0.5 + 0.5 * np.sin(2 * np.pi * 4.6 * tt))
    return x * vel
def pad(ms, dur, cutoff=1800, att=0.3, rel=0.6):
    n = int(dur * SR); tt = np.arange(n) / SR; x = np.zeros(n)
    for m in ms:
        for dt in (-0.006, 0.006):
            ph = 2 * np.pi * mf(m) * (1 + dt) * tt + rng.random() * 6.28
            x += np.sin(ph) + 0.45 * np.sin(2 * ph) + 0.22 * np.sin(3 * ph) + 0.1 * np.sin(4 * ph)
    return lp(x / (len(ms) * 2), cutoff) * env(n, att, 0.3, 0.85, rel)
def bassnote(m, dur, cutoff=1400, drive=2.2):
    n = int(dur * SR); tt = np.arange(n) / SR; f = mf(m)
    ph = 2 * np.pi * f * tt
    x = np.sin(ph) + 0.5 * np.sin(2 * ph) * np.exp(-tt * 6) + 0.25 * np.sin(3 * ph) * np.exp(-tt * 9)
    x = np.tanh(drive * x) / np.tanh(drive)
    x = lp(x, cutoff) * env(n, 0.004, 0.08, 0.8, 0.03)
    return x
def pluck(m, dur=0.22, bright=1.0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = mf(m)
    ph = 2 * np.pi * f * tt
    x = (np.sin(ph) + 0.4 * bright * np.sin(2 * ph) + 0.2 * bright * np.sin(3 * ph)) * np.exp(-tt * 14)
    return x * env(n, 0.002, 0, 1, 0.02)
def kick(g=1.0, dec=7.0):
    n = int(0.5 * SR); tt = np.arange(n) / SR
    f = 44 + 110 * np.exp(-tt * 26); ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.tanh(1.6 * np.sin(ph) * np.exp(-tt * dec)) + 0.3 * hp(rng.standard_normal(n), 2500) * np.exp(-tt * 220)
    return x * g
def snare():
    n = int(0.45 * SR); tt = np.arange(n) / SR
    tone = np.sin(2 * np.pi * (185 + 40 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 22)
    nz = bp(rng.standard_normal(n), 1200, 9000) * np.exp(-tt * 13)
    cl = np.zeros(n)
    for d in (0, 0.009, 0.019):
        i = int(d * SR); cl[i:] += rng.standard_normal(n - i) * np.exp(-tt[: n - i] * 38)
    return 0.55 * tone + 0.6 * nz + 0.35 * bp(cl, 900, 3500)
def hat(dec=60, g=0.5):
    n = int(0.18 * SR); tt = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7500) * np.exp(-tt * dec) * g
def tamb():
    n = int(0.16 * SR); tt = np.arange(n) / SR
    x = bp(rng.standard_normal(n), 5500, 12000) * np.exp(-tt * 30) * (1 + 0.6 * np.sin(2 * np.pi * 95 * tt))
    return x * 0.4
def crash(dur=2.4):
    n = int(dur * SR); tt = np.arange(n) / SR
    return hp(rng.standard_normal(n), 4000) * np.exp(-tt * 1.8) * 0.5 + bp(rng.standard_normal(n), 2500, 7000) * np.exp(-tt * 4) * 0.2
def riser(dur, f0=300, f1=7000):
    n = int(dur * SR); x = rng.standard_normal(n); out = np.zeros(n); blk = 1024
    for i in range(0, n, blk):
        k = i / n; fc = f0 * (f1 / f0) ** k
        out[i:i + blk] = bp(x[i:i + blk], fc * 0.7, min(fc * 1.4, 20000))
    return out * np.linspace(0, 1, n) ** 2

drums, bassb, keys, padb, lead, fx = Bus(), Bus(), Bus(), Bus(), Bus(), Bus()
KICKS = []  # instantes para el bombeo

# ── batería ──
for c in range(TOTAL):
    if inn("intro", c):
        # bombo apagado (como tras una pared) en 1 y 3; shaker en la segunda mitad
        for p in (0, 2):
            drums.add(lp(kick(0.9, 9), 260), beat(c * 4 + p), db(-13))
        if c >= SEC["intro"][0] + 2:
            for k in range(8): drums.add(tamb(), s16(c, 2 * k + 1), db(-19 if k % 2 else -23), pan=0.3)
    elif inn("subidaA", c) or inn("subidaB", c) or inn("drop", c):
        drop = inn("drop", c); B = inn("subidaB", c)
        last_b = c == SEC["subidaB"][1] - 1
        kpos = [0, 4, 8, 12] if last_b else ([0, 7, 8, 10] if not drop else [0, 6, 8, 11])
        if drop and c == SEC["drop"][1] - 1: kpos = [0, 2, 4, 6, 8, 10, 12, 14]  # ráfaga final en corcheas
        for pos in kpos:
            g = 1.0 if pos in (0, 8) else 0.8
            drums.add(kick(g), s16(c, pos), db(-4 if drop else -6)); KICKS.append(s16(c, pos))
        if not last_b:
            for pos in (4, 12): drums.add(snare(), s16(c, pos), db(-5 if drop else -8), pan=-0.05)
        else:  # redoble que se acelera y crece
            k = 0; tpos = 0.0
            while tpos < 16:
                drums.add(snare(), s16(c, tpos), db(-22 + 15 * tpos / 16), pan=float(rng.uniform(-0.2, 0.2)))
                tpos += 2 if tpos < 8 else (1 if tpos < 12 else 0.5)
        for k in range(16):  # charles en semicorcheas con acentos y algo de swing
            sw = 0.035 * P if k % 2 else 0
            acc_ = -15 if k % 4 == 2 else (-20 if k % 2 == 0 else -25)
            drums.add(hat(38 if k % 4 != 2 or not (B or drop) else 14, 1.9), s16(c, k) + sw, db(acc_ + 6 - (3 if not drop else 0)), pan=0.25)
        if B or drop:
            for k in range(16): drums.add(tamb(), s16(c, k) + (0.03 * P if k % 2 else 0), db(-16 if k % 2 else -13), pan=-0.35)
    # crash en cambios grandes
for c, g in ((SEC["subidaA"][0], -12), (SEC["drop"][0], -8), (SEC["drop"][0] + 4, -12), (SEC["final"][0], -13)):
    drums.add(crash(), bar(c), db(g), pan=0.15)

# ── bajo ──
PAT = [(0, 0, 3), (3, 0, 1), (6, 12, 1), (7, 7, 2), (10, 0, 2), (12, 7, 1), (13, 12, 1), (15, "ap", 1)]
for c in range(TOTAL):
    ch = CH[c]; r = ch["b"]
    nxt = CH[c + 1]["b"] if c + 1 < TOTAL else r
    if inn("corte", c):
        continue
    if inn("final", c):
        last = c == TOTAL - 1
        bassb.add(bassnote(r if not last else 36, (P * 4 + (COLA if last else 0.05)), cutoff=700, drive=1.4) * (np.exp(-np.arange(int((P * 4 + (COLA if last else 0.05)) * SR)) / SR * (0.6 if last else 0.15))), bar(c), db(-11))
        continue
    intro = inn("intro", c)
    cutoff = 520 + 160 * (c - SEC["intro"][0]) if intro else (1500 if not inn("drop", c) else 2100)
    for pos, iv, ln in PAT:
        if intro and pos in (13,):
            continue
        m = r + (iv if iv != "ap" else (nxt - r - 1 if nxt > r else nxt - r + 1))
        if iv == "ap": m = (nxt - 1) if c + 1 < TOTAL else r
        while m - r > 14: m -= 12
        bassb.add(bassnote(m, ln * P / 4 * 0.92, cutoff=cutoff), s16(c, pos), db((-4 if inn('drop', c) else -7) if not intro else -10))

# ── piano eléctrico y acordes ──
for c in range(TOTAL):
    ch = CH[c]
    if inn("intro", c):
        keys.add(sum(epiano(m, P * 4 + 0.6, 0.8, trem=0.35) for m in ch["k"]), bar(c), db(-13))
        keys.add(sum(epiano(m + 12, P * 1.2, 0.4) for m in ch["k"][1:3]), s16(c, 10), db(-20), pan=0.4)
    elif inn("subidaA", c) or inn("subidaB", c):
        for pos, ln, v in ((0, 5, 0.9), (6, 2, 0.6), (10, 3, 0.7), (14, 2, 0.5)):
            keys.add(sum(epiano(m, ln * P / 4 + 0.15, v) for m in ch["k"]), s16(c, pos), db(-12))
        padb.add(pad(ch["k"], P * 4 + 0.4, cutoff=1300 + 120 * (c - SEC["subidaA"][0]), att=0.4), bar(c), db(-17))
    elif inn("corte", c):
        padb.add(pad(G13["k"] + [74, 76], P * 3 + 0.5, cutoff=900, att=0.05, rel=0.5), bar(c), db(-13))
    elif inn("drop", c):
        padb.add(pad(ch["k"] + [ch["k"][-1] + 12], P * 4 + 0.3, cutoff=3600, att=0.02, rel=0.3), bar(c), db(-11))
        for pos, ln, v in ((0, 3, 1.0), (3, 1, 0.6), (6, 2, 0.8), (10, 2, 0.8), (14, 1, 0.6)):
            keys.add(sum(epiano(m + 12, ln * P / 4 + 0.1, v) for m in ch["k"]), s16(c, pos), db(-17), pan=-0.2)
    elif inn("final", c):
        last = c == TOTAL - 1
        dur = P * 4 + (COLA + 0.6 if last else 0.4)
        keys.add(sum(epiano(m, dur, 0.85, trem=0.25 if not last else 0.12) for m in ch["k"]), bar(c), db(-10 if not last else -9))
        padb.add(pad(ch["k"], dur, cutoff=1900 if not last else 2600, att=0.5 if not last else 0.05, rel=1.4 if last else 0.6), bar(c), db(-16 if not last else -12))
        if last:
            for k, m in enumerate(ch["a"]):
                lead.add(pluck(m, 1.6, 0.6) * np.exp(-np.arange(int(1.6 * SR)) / SR * 1.2), bar(c) + k * P / 4, db(-17), pan=-0.5 + k * 0.25)

# ── arpegio de la subida B (filtro que se abre) ──
for c in range(*SEC["subidaB"]):
    a = CH[c]["a"]; k0 = c - SEC["subidaB"][0]
    for k in range(16):
        m = a[[0, 1, 2, 3, 4, 3, 2, 1][k % 8]] + (12 if k0 >= 2 and k % 4 == 3 else 0)
        x = lp(pluck(m, 0.2, 0.5 + 0.2 * k0), 1500 + 900 * k0 + 60 * k)
        lead.add(x, s16(c, k), db(-19), pan=(-0.4 if k % 2 else 0.4))

# ── melodía del drop (portamento + vibrato, timbre cálido) ──
MEL = [
    [(0, 69, 2), (3, 72, 1), (4, 74, 4), (10, 76, 2), (12, 74, 2), (14, 72, 2)],
    [(0, 71, 4), (6, 74, 2), (8, 76, 4), (12, 79, 4)],
    [(0, 79, 3), (3, 76, 1), (4, 74, 2), (6, 76, 6), (12, 71, 2), (14, 72, 2)],
    [(0, 69, 6), (8, 67, 2), (10, 69, 2), (12, 72, 4)],
    [(0, 69, 2), (3, 72, 1), (4, 74, 4), (10, 76, 2), (12, 79, 2), (14, 81, 2)],
    [(0, 83, 4), (6, 81, 2), (8, 79, 4), (12, 76, 4)],
    [(0, 79, 3), (3, 76, 1), (4, 74, 2), (6, 76, 6), (12, 79, 2), (14, 81, 2)],
    [(0, 76, 2), (2, 76, 2), (4, 79, 2), (6, 79, 2), (8, 81, 2), (10, 81, 2), (12, 84, 2), (14, 84, 2)],  # ráfaga
]
notes = []
for i, c in enumerate(range(*SEC["drop"])):
    for pos, m, ln in MEL[i % len(MEL)]:
        notes.append((s16(c, pos), m, ln * P / 4))
t0, t1 = notes[0][0] - 0.05, notes[-1][0] + notes[-1][2] + 0.4
n = int((t1 - t0) * SR); tt = np.arange(n) / SR + t0
freq = np.full(n, mf(notes[0][1])); gate = np.zeros(n)
for j, (ts, m, ln) in enumerate(notes):
    a, b = int((ts - t0) * SR), int((ts + ln * 0.9 - t0) * SR)
    prev = mf(notes[j - 1][1]) if j else mf(m)
    g = np.arange(len(freq) - a) / SR
    freq[a:] = mf(m) + (prev - mf(m)) * np.exp(-g / 0.028)  # portamento
    gate[a:b] = 1
vib = 1 + 0.006 * np.sin(2 * np.pi * 5.4 * tt) * np.clip((tt - t0) / 1, 0, 1)
ph = 2 * np.pi * np.cumsum(freq * vib) / SR
x = np.tanh(2.2 * np.sin(ph)) + 0.35 * np.sin(2 * ph) + 0.18 * np.sin(3 * ph + 0.5)
ge = signal.lfilter([1 - 0.9965], [1, -0.9965], gate)  # ataque/suelta suaves
x = lp(x * ge, 3400)
lead.add(x, t0, db(-9), pan=0.1)

# ── efectos de transición musicales ──
cB = SEC["subidaB"][1] - 1
fx.add(riser(P * 4, 400, 9000), bar(cB), db(-15))
cc = SEC["corte"][0]
rev_cr = crash(P * 3)[::-1]
fx.add(rev_cr, bar(cc), db(-12))
fx.add(riser(P * 3, 1500, 12000), bar(cc), db(-18))
fx.add(lp(kick(1.3, 4.5), 4000), bar(SEC["drop"][0]), db(-3))  # impacto del drop
fx.add(lp(kick(1.0, 5), 3000), bar(SEC["final"][1] - 1), db(-8))  # acorde final

# ── mezcla ──
dr = wet(drums.b, 0.10)
bs = bassb.b
ky = wet(chorus(keys.b, 0.0018, 0.004, 0.5, 0.45), 0.28)
pd = wet(chorus(padb.b, 0.003, 0.007, 0.22, 0.7), 0.35)
ld = wet(chorus(lead.b, 0.0012, 0.003, 0.8, 0.4), 0.3)
fxx = wet(fx.b, 0.2)
# bombeo (sidechain) del bombo sobre acordes, pad y bajo en subidas/drop
side = np.ones(N)
for k in KICKS:
    i = int(k * SR); L_ = int(0.32 * SR)
    seg = 1 - 0.55 * np.exp(-np.arange(L_) / SR / 0.09)
    side[i:i + L_] = np.minimum(side[i:i + L_], seg[: len(side[i:i + L_])])
mix = dr + bs * side[:, None] ** 0.6 + ky * side[:, None] ** 0.5 + pd * side[:, None] + ld + fxx
# corte: silencio del último pulso del compás de corte (solo cola de reverb)
a = int(beat(SEC["corte"][0] * PPC + 3) * SR); b = int(bar(SEC["drop"][0]) * SR) - int(0.004 * SR)
fade = int(0.025 * SR)
mix[a:a + fade] *= np.linspace(1, 0, fade)[:, None] ** 2; mix[a + fade:b] *= 0.0
for ch_ in range(2): mix[:, ch_] = hp(mix[:, ch_], 28, 2)
mix = mix[: int(DUR * SR)]
fo = int(1.4 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.6
fi = int(0.004 * SR); mix[:fi] *= np.linspace(0, 1, fi)[:, None]
mix = np.tanh(mix / np.abs(mix).max() * 1.15) / np.tanh(1.15)
mix *= db(-3)
os.makedirs(os.path.join(RAIZ, "public", "audio"), exist_ok=True)
wavfile.write(os.path.join(RAIZ, "public", "audio", "musica.wav"), SR, (mix * 32767).astype(np.int16))
print("musica.wav %.2f s" % (len(mix) / SR))
