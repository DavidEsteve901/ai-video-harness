# Prueba de Chatterbox Multilingual con el guion de VR011 (una toma por linea del plan_vocal.json)
import sys, json, time, os, torch, torchaudio as ta
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
plan = json.load(open(sys.argv[1], encoding="utf-8"))
ref, out = sys.argv[2], sys.argv[3]
exag = float(sys.argv[4]) if len(sys.argv) > 4 else 0.5
cfg = float(sys.argv[5]) if len(sys.argv) > 5 else 0.3
os.makedirs(out, exist_ok=True)
t0 = time.time()
m = ChatterboxMultilingualTTS.from_pretrained(device="cuda")
print("modelo cargado en %.1fs" % (time.time() - t0), flush=True)
for i, t in enumerate(plan["tomas"], 1):
    torch.manual_seed(1000 + i)
    s = time.time()
    w = m.generate(t["texto"], language_id="es", audio_prompt_path=ref, exaggeration=exag, cfg_weight=cfg, temperature=0.7)
    ta.save(os.path.join(out, "%04d.wav" % i), w.cpu(), m.sr)
    print("toma %d: %.2fs audio en %.1fs" % (i, w.shape[-1] / m.sr, time.time() - s), flush=True)
print("FIN")