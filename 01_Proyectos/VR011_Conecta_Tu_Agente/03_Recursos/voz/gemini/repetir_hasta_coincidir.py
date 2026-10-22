# Repite tomas de Gemini hasta que Whisper lea exactamente las palabras del guion (sin tildes ni puntuacion).
import sys,os,json,re,subprocess,unicodedata
from faster_whisper import WhisperModel
carpeta,plan,estilos,voz,h=sys.argv[1:6]; tomas=[int(x) for x in sys.argv[6].split(",")]
P=json.load(open(plan,encoding="utf-8"))["tomas"]; E=json.load(open(estilos,encoding="utf-8"))
norm=lambda s: re.sub(r"[^a-z0-9 ]","",unicodedata.normalize("NFD",s.lower()).encode("ascii","ignore").decode()).split()
m=WhisperModel("small",device="cuda",compute_type="float16")
for i in tomas:
    t=P[i-1]; dst=os.path.join(carpeta,"%04d.wav"%i); ok=False
    for intento in range(1,6):
        tmp=dst+".nuevo.wav"
        subprocess.run([sys.executable,os.path.join(h,"gemini_tts.py"),"decir","--voz",voz,"--estilo",E[t["id"]],"--texto",t["texto"],"--salida",tmp],check=True,capture_output=True)
        segs,_=m.transcribe(tmp,language="es"); leido=" ".join(s.text for s in segs)
        if norm(leido)==norm(t["texto"]):
            os.replace(tmp,dst); ok=True; print("toma",i,"ok en intento",intento,"|",leido.strip()); break
        print("toma",i,"intento",intento,"leyo:",leido.strip(),flush=True)
    if not ok: print("toma",i,"NO coincide tras 5 intentos; se conserva la anterior")
    if os.path.exists(dst+".nuevo.wav"): os.remove(dst+".nuevo.wav")