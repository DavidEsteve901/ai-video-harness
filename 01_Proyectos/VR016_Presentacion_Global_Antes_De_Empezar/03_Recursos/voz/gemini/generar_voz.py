# VR016 (copiado de VR014): genera cada toma con Gemini TTS y comprueba con Whisper (large-v3) que dice el guion.
# Derivado del de VR013. Cambios por el cupo (Tier 1 = 100 peticiones/día por modelo):
#  - MAXINT intentos por toma (3 por defecto) y NVALIDAS tomas válidas (1 por defecto).
#  - Las marcas (Claude, Codex, Antigravity, Omnibar…) se aceptan con parecido ≥ 0,85: Whisper las escribe a su manera.
#  - Si la API devuelve 429 tras sus reintentos (cupo diario), se para todo para no gastar más.
# Uso: python generar_voz.py <carpeta_salida> <ruta_gemini_tts.py> [ids separados por coma]
import sys, os, json, re, subprocess, unicodedata, difflib
from faster_whisper import WhisperModel
AQUI = os.path.dirname(os.path.abspath(__file__))
salida, gemini = sys.argv[1], sys.argv[2]
solo = sys.argv[3].split(",") if len(sys.argv) > 3 else None
plan = json.load(open(os.path.join(AQUI, os.environ.get("PLAN_VOCAL", "plan_vocal.json")), encoding="utf-8"))
plan["modelo"] = os.environ.get("MODELO_TTS", plan["modelo"])
NVAL, MAXINT = int(os.environ.get("NVALIDAS", "1")), int(os.environ.get("MAXINT", "3"))
norm = lambda s: re.sub(r"[^a-z0-9 ]", "", unicodedata.normalize("NFD", s.lower().replace("-", "")).encode("ascii", "ignore").decode()).split()
def parecido(a, b):
    a, b = norm(a), norm(b)
    return 1.0 if a == b else (difflib.SequenceMatcher(None, " ".join(a), " ".join(b)).ratio() if abs(len(a) - len(b)) <= 2 else 0.0)
m = WhisperModel("large-v3", device="cuda", compute_type="float16")
os.makedirs(salida, exist_ok=True)
inf_path = os.path.join(salida, "informe_tomas_%s.json" % plan["modelo"])
informe = json.load(open(inf_path, encoding="utf-8")) if os.path.exists(inf_path) else {}
for t in plan["tomas"]:
    if solo and t["id"] not in solo: continue
    validas = []
    for intento in range(1, MAXINT + 1):
        if len(validas) == NVAL: break
        tmp = os.path.join(salida, "%s_intento%d.wav" % (t["id"], intento))
        r = subprocess.run([sys.executable, gemini, "decir", "--voz", plan["voz"], "--modelo", plan["modelo"], "--estilo", t["estilo"],
                            "--texto", t["texto"], "--salida", tmp], capture_output=True, text=True, encoding="utf-8", errors="replace")
        if r.returncode != 0 or not os.path.exists(tmp):
            err = (r.stderr or r.stdout)[-400:]
            print(t["id"], "fallo de API:", err, flush=True)
            if "HTTP 429" in err:
                json.dump(informe, open(inf_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
                sys.exit("CUPO AGOTADO (429): se para aquí para no gastar más peticiones")
            continue
        segs, _ = m.transcribe(tmp, language=os.environ.get("IDIOMA", "es"), beam_size=5)
        leido = " ".join(s.text for s in segs).strip()
        p = parecido(leido, t["texto"])
        if p >= 0.85:
            letra = "AB"[len(validas)]
            dst = os.path.join(salida, "%s_%s.wav" % (t["id"], letra)); os.replace(tmp, dst); validas.append(dst)
            print(t["id"], letra, "ok (intento %d, parecido %.2f) |" % (intento, p), leido, flush=True)
        else:
            print(t["id"], "intento", intento, "NO coincide (%.2f), leyó:" % p, leido, flush=True); os.remove(tmp)
    informe[t["id"]] = [os.path.basename(v) for v in validas]
    json.dump(informe, open(inf_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("FIN", json.dumps(informe, ensure_ascii=False))
