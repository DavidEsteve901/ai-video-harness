"""Voz de VR003 V2 con Local Voice Studio (servidor en http://127.0.0.1:7860 encendido).
Voz original «Genio sarcástico» (no clona a nadie). Cada frase es una toma: así controlamos las pausas en el montaje.
Uso: C:\Herramientas\local-voice-studio\.venv\Scripts\python.exe generar_voz_v2.py [--seed 11]
"""
import argparse, json, time, urllib.request, zipfile
from pathlib import Path

STUDIO = Path(r"C:\Herramientas\local-voice-studio")
BASE = "http://127.0.0.1:7860"
HERE = Path(__file__).resolve().parent
VOICE = "genio-sarcastico-stark-style-original--6c6d75"
TOKEN = (STUDIO / "data" / "api-token").read_text().strip()
LINES = [
    "Yárvis.",
    "Hay un tío.",
    "Que abre todo su ordenador.",
    "Con solo dos palmadas.",
    "Yárvis.",
    "Tenemos que hablar.",
]

def api(path, payload=None):
    h = {"X-Local-Token": TOKEN, "Content-Type": "application/json"}
    d = json.dumps(payload).encode() if payload is not None else None
    r = urllib.request.Request(BASE + path, data=d, headers=h, method="POST" if d else "GET")
    with urllib.request.urlopen(r, timeout=600) as f:
        return json.load(f)

ap = argparse.ArgumentParser(); ap.add_argument("--seed", type=int, default=11); ap.add_argument("--speed", type=float, default=0.97)
a = ap.parse_args()
project = {"name": f"VR003_V2_seed{a.seed}", "engine": "qwen-base-1.7b", "mode": "segments",
           "voices": {"Voz": VOICE}, "settings": {"seed": a.seed, "max_tokens": 2048, "speed": a.speed},
           "segments": [{"speaker": "Voz", "language": "es", "text": t, "pause_ms": 0} for t in LINES]}
job = api("/api/jobs", {"project": project})
while True:
    j = api("/api/jobs/" + job["id"])
    if j["status"] not in ("queued", "running", "exporting"):
        break
    print("...", j.get("message", j["status"])); time.sleep(3)
if j["status"] != "completed":
    raise SystemExit("Fallo: " + str(j.get("error") or j.get("message")))
out = HERE / f"seed{a.seed}"; out.mkdir(exist_ok=True)
for i in range(1, len(LINES) + 1):
    urllib.request.urlretrieve(f"{BASE}/api/jobs/{job['id']}/files/{i:04d}.wav", out / f"{i:04d}.wav")
(out / "job.txt").write_text(job["id"])
print("OK", out)
