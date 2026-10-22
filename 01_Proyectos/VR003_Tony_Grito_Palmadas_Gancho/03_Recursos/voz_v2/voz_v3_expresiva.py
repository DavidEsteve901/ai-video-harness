"""VR003 V2 · voz más expresiva (mejor entonación).
1) Diseña (si no existen) voces ORIGINALES con VoiceDesign: la entonación de la referencia es la que luego se reproduce.
2) Genera las 6 frases con cada voz, comprueba con Whisper y reintenta por frase con otras semillas.
Uso: C:\\Herramientas\\local-voice-studio\\.venv\\Scripts\\python.exe voz_v3_expresiva.py [--solo A] [--semillas 5 3 8 12]
Salida: voz_v3/<clave>/0001..0006.wav + informe.json. No clona a nadie.
"""
import argparse, json, re, time, unicodedata, urllib.request
from pathlib import Path

STUDIO = Path(r"C:\Herramientas\local-voice-studio")
BASE = "http://127.0.0.1:7860"
HERE = Path(__file__).resolve().parent
TOKEN = (STUDIO / "data" / "api-token").read_text().strip()

# Frases (el TTS lee «Yárvis»; en pantalla se escribe «Jarvis»). Los puntos suspensivos marcan las pausas dramáticas.
# El nombre va pegado a la frase siguiente: suelto («Jarvis.») la voz lo lee «y ahora veis»; con contexto sale «Yarvis».
LINES = ["Jarvis... hay un tío...", "Que abre todo su ordenador...", "Con solo dos palmadas.", "Jarvis... tenemos que hablar."]
EXPECT = ["hay un tio", "que abre todo su ordenador", "con solo dos palmadas", "tenemos que hablar"]
NAME = re.compile(r"^(y|j|ch|g|h)a?r?b?v?i?s?")  # «yarvis», «jarvis», «garvis»… vale cualquiera que empiece como el nombre

VOICES = {
    "A": {
        "name": "Hundido dramatico (VR003 V2)",
        "description": "Adult male voice, late thirties, warm deep slightly raspy timbre. A man utterly shattered by devastating news, telling it to his assistant in a slow, weary, trembling voice that cracks on key words, with audible sighs and long heavy pauses between phrases, pitch sinking at the end of every phrase as if giving up on life. Theatrical and heartfelt, but at the very end he turns cold, flat and dead serious. Natural human delivery, not robotic, not an announcer, not monotone.",
        "text": "Yárvis… hay un tío… que abre todo su ordenador… con solo dos palmadas… y yo… he gastado millones. Yárvis. Tenemos que hablar.",
    },
    "B": {
        "name": "Melodrama teatral (VR003 V2)",
        "description": "Adult male voice, late thirties, rich expressive baritone. A theatre actor performing an exaggerated, mock-tragic parody of heartbreak: pitch rising with disbelief on key words then collapsing downward, breathy and quivering, wounded pride, dramatic hushed pauses, as if the world just ended over something absurdly small. Very expressive pitch movement, comedic because it is so sincere. Then the last sentence is delivered cold, quiet and flat. Natural, human, not robotic, not an announcer.",
        "text": "Yárvis… hay un tío… ¿sabes qué hace? Abre todo su ordenador… ¡con solo dos palmadas! Yárvis. Tenemos que hablar.",
    },
}


def api(path, payload=None):
    h = {"X-Local-Token": TOKEN, "Content-Type": "application/json"}
    d = json.dumps(payload).encode() if payload is not None else None
    r = urllib.request.Request(BASE + path, data=d, headers=h, method="POST" if d is not None else "GET")
    with urllib.request.urlopen(r, timeout=900) as f:
        return json.load(f)


def wait(job_id, key="status", done=("completed", "failed", "cancelled")):
    while True:
        j = api("/api/jobs/" + job_id)
        if j[key] in done or (key == "status" and j["status"] not in ("queued", "running", "exporting")):
            return j
        time.sleep(3)


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z ]", "", s).strip()


def design(key):
    cfg = VOICES[key]
    for v in api("/api/voices"):
        if v["name"] == cfg["name"]:
            return v["id"]
    job = api("/api/voices/design", {"name": cfg["name"], "language": "es", "accent": "España / neutral", "description": cfg["description"], "text": cfg["text"]})
    j = wait(job["id"])
    if j["status"] != "completed":
        raise SystemExit("Fallo diseñando: " + str(j.get("error") or j.get("message")))
    nv = j["new_voice"]
    return nv["id"] if isinstance(nv, dict) else nv


def generate(voice_id, seed, name):
    project = {"name": name, "engine": "qwen-base-1.7b", "mode": "segments", "voices": {"V": voice_id},
               "settings": {"seed": seed, "max_tokens": 2048, "speed": 1.0},
               "segments": [{"speaker": "V", "language": "es", "text": t, "pause_ms": 0} for t in LINES]}
    job = api("/api/jobs", {"project": project})
    j = wait(job["id"])
    if j["status"] != "completed":
        raise SystemExit("Fallo generando: " + str(j.get("error") or j.get("message")))
    api("/api/jobs/" + job["id"] + "/review", {})
    while api("/api/jobs/" + job["id"]).get("review_status") not in ("completed", "failed"):
        time.sleep(4)
    r = urllib.request.Request(BASE + "/api/jobs/" + job["id"] + "/files/review.json", headers={"X-Local-Token": TOKEN})
    rv = json.load(urllib.request.urlopen(r))
    heard = [norm(s["text"]) for s in rv["segments"]]
    return job["id"], heard


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--solo")
    ap.add_argument("--semillas", type=int, nargs="+", default=[5, 3, 8, 12])
    a = ap.parse_args()
    out_root = HERE / "voz_v3"
    out_root.mkdir(exist_ok=True)
    for key in [k for k in VOICES if not a.solo or k == a.solo]:
        vid = design(key)
        print("voz", key, vid, flush=True)
        out = out_root / key
        out.mkdir(exist_ok=True)
        best = {}  # índice de frase -> (semilla, job)
        report = []
        for seed in a.semillas:
            try:
                jid, heard = generate(vid, seed, f"VR003_V3_{key}_s{seed}")
            except BaseException as e:  # el estudio lo comparte otra sesión: si falla una tanda, seguimos con otra semilla
                print(" semilla", seed, "falló:", str(e)[:120], flush=True)
                continue
            ok = [i for i in range(len(LINES)) if i < len(heard) and EXPECT[i] in heard[i] and (not LINES[i].startswith("Jarvis") or re.match(r"^(y|j|ch|g|h)\w{0,3}[ab]\w{0,3}(v|b)", heard[i]))]
            report.append({"seed": seed, "job": jid, "heard": heard, "ok": ok})
            print(" semilla", seed, "ok:", [i + 1 for i in ok], heard, flush=True)
            for i in ok:
                if i not in best:
                    best[i] = (seed, jid)
            if len(best) == len(LINES):
                break
        if not report:
            raise SystemExit("ninguna tanda generada")
        for i in range(len(LINES)):
            seed, jid = best.get(i, (report[0]["seed"], report[0]["job"]))
            urllib.request.urlretrieve(f"{BASE}/api/jobs/{jid}/files/{i + 1:04d}.wav", out / f"{i + 1:04d}.wav")
        (out / "informe.json").write_text(json.dumps({"voz": vid, "mejor": {str(i + 1): v[0] for i, v in best.items()}, "intentos": report}, ensure_ascii=False, indent=1), encoding="utf-8")
        print("OK", key, "frases válidas:", sorted(i + 1 for i in best), flush=True)


main()
