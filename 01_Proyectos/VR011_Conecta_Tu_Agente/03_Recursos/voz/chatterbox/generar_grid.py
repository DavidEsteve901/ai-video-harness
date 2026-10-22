import sys, json, time, os, itertools, torch, torchaudio as ta
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
cb=sys.argv[1]; plan=json.load(open(sys.argv[2],encoding="utf-8"))["tomas"]
refs=sys.argv[3].split(","); exags=[float(x) for x in sys.argv[4].split(",")]; idx=[int(x) for x in sys.argv[5].split(",")]
m=ChatterboxMultilingualTTS.from_pretrained(device="cuda"); print("modelo listo",flush=True)
for r,e in itertools.product(refs,exags):
    d=f"{cb}/grid/{r}_e{e}"; os.makedirs(d,exist_ok=True)
    for i in idx:
        torch.manual_seed(2000+i)
        w=m.generate(plan[i-1]["texto"],language_id="es",audio_prompt_path=f"{cb}/ref/{r}.wav",exaggeration=e,cfg_weight=0.25,temperature=0.8)
        ta.save(f"{d}/{i:04d}.wav",w.cpu(),m.sr)
    print("hecho",r,e,flush=True)
print("FIN",flush=True)