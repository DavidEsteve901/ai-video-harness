# Genera el guion de VR011 (plan_vocal.json) con varias voces de Gemini, un estilo emocional por toma. Muestra el gasto estimado.
import sys, os, json, subprocess, time
voz_dir = os.path.dirname(os.path.abspath(__file__)); plan = json.load(open(os.path.join(voz_dir, "..", "plan_vocal.json"), encoding="utf-8"))["tomas"]
modelo = sys.argv[1]; voces = sys.argv[2].split(",")
ESTILO = {
 "v1": "curioso e intrigado, planteando una posibilidad emocionante, la entonación sube al final",
 "v2": "cercano y sencillo, con media sonrisa",
 "v3": "natural y conversacional, como hablando con un amigo",
 "v4": "claro y entusiasta, dando un ejemplo concreto, con pausas suaves en las comas",
 "v5": "satisfecho e ilusionado, como quien ve cómo todo encaja",
 "v6": "ágil y animado",
 "v7": "ligero, casi con una sonrisa",
 "v8": "tranquilizador y seguro, firme y cálido",
 "v9": "cálido y orgulloso, cerrando la idea",
 "v10": "curioso e ilusionado, invitando al espectador a imaginar",
}
PRECIO = {"gemini-3.8-flash-tts": (0.50, 9.00), "gemini-3.8-flash-lite-tts": (0.50, 6.00)}[modelo]
tin = tout = 0
for v in voces:
    d = os.path.join(voz_dir, modelo.replace("gemini-", "") + "_" + v); os.makedirs(d, exist_ok=True)
    for i, t in enumerate(plan, 1):
        out = os.path.join(d, "%04d.wav" % i)
        r = subprocess.run([sys.executable, os.path.join(voz_dir, "gemini_tts.py"), modelo, v, ESTILO[t["id"]], t["texto"], out], capture_output=True, text=True)
        if r.returncode: print("ERROR", v, i, r.stderr.strip()[:200]); continue
        u = json.loads(r.stdout.strip().splitlines()[-1]); tin += u["tokens_entrada"] or 0; tout += u["tokens_salida"] or 0
        time.sleep(0.5)
    print("voz hecha", v, flush=True)
coste = tin / 1e6 * PRECIO[0] + tout / 1e6 * PRECIO[1]
print("TOKENS entrada=%d salida=%d  coste estimado=%.4f USD" % (tin, tout, coste))