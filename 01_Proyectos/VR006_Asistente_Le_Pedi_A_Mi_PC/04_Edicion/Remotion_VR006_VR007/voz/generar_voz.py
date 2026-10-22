"""Genera la locución del vídeo con Local Voice Studio (servidor en http://127.0.0.1:7860).

Uso (con el servidor encendido, Iniciar.cmd o scripts/start.ps1):
    C:\\Herramientas\\local-voice-studio\\.venv\\Scripts\\python.exe voz\\generar_voz.py [--rediseñar] [--voz ID]

1. Diseña (una sola vez) la voz sintética original definida en voz.json con VoiceDesign.
   NO clona a ningún actor: es una voz inventada por descripción (estilo "listillo millonario").
2. Renderiza cada línea de locucion.json como una toma y descarga los WAV a public/audio/vo/.
El token local se lee de data/api-token; no se imprime ni se guarda.
"""
import argparse
import json
import sys
import time
import urllib.request
import zipfile
from pathlib import Path

STUDIO = Path(r"C:\Herramientas\local-voice-studio")
BASE = "http://127.0.0.1:7860"
HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "public" / "vo"
TOKEN = (STUDIO / "data" / "api-token").read_text().strip()


def api(path, payload=None, method=None):
    headers = {"X-Local-Token": TOKEN, "Content-Type": "application/json"}
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(BASE + path, data=data, headers=headers, method=method or ("POST" if data else "GET"))
    with urllib.request.urlopen(req, timeout=600) as r:
        return json.load(r)


def wait(job_id):
    while True:
        job = api("/api/jobs/" + job_id)
        if job["status"] not in ("queued", "running", "exporting"):
            if job["status"] != "completed":
                raise SystemExit("Fallo: " + str(job.get("error") or job.get("message")))
            return job
        print("  ...", job.get("message", job["status"]))
        time.sleep(3)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--rediseñar", action="store_true", help="crear de nuevo la voz aunque exista")
    ap.add_argument("--voz", help="usar una voz ya existente de la biblioteca (id) en vez de la diseñada")
    args = ap.parse_args()

    cfg = json.loads((HERE / "voz.json").read_text(encoding="utf-8"))
    script = json.loads((HERE / "locucion.json").read_text(encoding="utf-8"))

    voice_id = args.voz
    if not voice_id:
        voices = api("/api/voices")
        found = [v for v in voices if v["name"] == cfg["name"]]
        if found and not args.rediseñar:
            voice_id = found[0]["id"]
            print("Voz existente:", voice_id)
        else:
            print("Diseñando voz:", cfg["name"])
            job = wait(api("/api/voices/design", cfg)["id"])
            voice_id = job["new_voice"]["id"] if isinstance(job.get("new_voice"), dict) else job["new_voice"]
            print("Voz creada:", voice_id)

    project = {
        "name": script["name"],
        "engine": "qwen-base-1.7b",
        "mode": "segments",
        "voices": {"Voz": voice_id},
        "settings": {"seed": script.get("seed", 7), "max_tokens": 2048, "speed": script.get("speed", 1.0)},
        "segments": [{"speaker": "Voz", "language": s.get("lang", "es"), "text": s["text"], "pause_ms": 0} for s in script["lines"]],
    }
    job = wait(api("/api/jobs", {"project": project})["id"])
    OUT.mkdir(parents=True, exist_ok=True)
    zpath = OUT / "locucion.zip"
    urllib.request.urlretrieve(BASE + "/api/jobs/" + job["id"] + "/download", zpath)
    with zipfile.ZipFile(zpath) as z:
        z.extractall(OUT / "zip")
    print("Tomas en", OUT / "zip")


if __name__ == "__main__":
    sys.exit(main())
