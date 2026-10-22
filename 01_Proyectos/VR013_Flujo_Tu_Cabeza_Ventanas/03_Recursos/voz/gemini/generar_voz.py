# VR012: genera cada toma con Gemini TTS y la repite hasta que Whisper (large-v3) lea exactamente el guion.
# Guarda 2 candidatas válidas por toma (A y B) para que el usuario pueda elegir de oído; por defecto se usa A.
# Uso: python generar_vr012.py <carpeta_salida> <ruta_gemini_tts.py> [ids separados por coma]
import sys, os, json, re, subprocess, unicodedata
from faster_whisper import WhisperModel
AQUI = os.path.dirname(os.path.abspath(__file__))
salida, gemini = sys.argv[1], sys.argv[2]
solo = sys.argv[3].split(",") if len(sys.argv) > 3 else None
plan = json.load(open(os.path.join(AQUI, os.environ.get("PLAN_VOCAL", "plan_vocal.json")), encoding="utf-8"))  # PLAN_VOCAL=plan_vocal_en.json para inglés
plan["modelo"] = os.environ.get("MODELO_TTS", plan["modelo"])  # p. ej. gemini-3.8-flash-lite-tts si se agota el cupo diario
NUM = {"100": "cien", "1": "uno", "2": "dos", "3": "tres"}  # Whisper escribe cifras donde la voz dice la palabra
norm = lambda s: [NUM.get(w, w) for w in re.sub(r"[^a-z0-9 ]", "", unicodedata.normalize("NFD", s.lower()).encode("ascii", "ignore").decode()).split()]
m = WhisperModel("large-v3", device="cuda", compute_type="float16")
os.makedirs(salida, exist_ok=True)
informe = {}
for t in plan["tomas"]:
    if solo and t["id"] not in solo: continue
    validas = []
    for intento in range(1, 9):
        if len(validas) == int(os.environ.get("NVALIDAS", "2")): break  # NVALIDAS=1 ahorra cupo
        tmp = os.path.join(salida, "%s_intento%d.wav" % (t["id"], intento))
        r = subprocess.run([sys.executable, gemini, "decir", "--voz", plan["voz"], "--modelo", plan["modelo"], "--estilo", t["estilo"],
                            "--texto", t["texto"], "--salida", tmp], capture_output=True, text=True, encoding="utf-8", errors="replace")
        if r.returncode != 0 or not os.path.exists(tmp):
            print(t["id"], "fallo de API:", (r.stderr or r.stdout)[-300:], flush=True); continue
        segs, _ = m.transcribe(tmp, language=os.environ.get("IDIOMA", "es"), beam_size=5)
        leido = " ".join(s.text for s in segs).strip()
        if norm(leido) == norm(t["texto"]):
            letra = "AB"[len(validas)]
            dst = os.path.join(salida, "%s_%s.wav" % (t["id"], letra)); os.replace(tmp, dst); validas.append(dst)
            print(t["id"], letra, "ok (intento %d) |" % intento, leido, flush=True)
        else:
            print(t["id"], "intento", intento, "NO coincide, leyó:", leido, flush=True); os.remove(tmp)
    informe[t["id"]] = [os.path.basename(v) for v in validas]
json.dump(informe, open(os.path.join(salida, "informe_tomas_%s.json" % plan["modelo"]), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("FIN", json.dumps(informe, ensure_ascii=False))
