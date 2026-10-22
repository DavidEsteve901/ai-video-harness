# Recorta la cola de cada toma (ultimo word timestamp + margen), remuestrea a 48 kHz y monta la mezcla con pausas.
import sys,json,os,subprocess,numpy as np,soundfile as sf
d=sys.argv[1]; plan=json.load(open(sys.argv[2],encoding="utf-8"))
over={k:float(v) for k,v in (p.split("=") for p in sys.argv[3].split(";") if p)} if len(sys.argv)>3 else {}
pal=json.load(open(d+"/palabras.json",encoding="utf-8"))
os.makedirs(d+"/recortadas",exist_ok=True)
sr=48000; mix=[]; t=0.0; tomas=[]
for i,tm in enumerate(plan["tomas"],1):
    n="%04d.wav"%i; fin=over.get(n, pal[n]["fin"]); src=d+"/"+n; dst=d+"/recortadas/"+n
    subprocess.run(["ffmpeg","-v","error","-y","-i",src,"-af",f"atrim=0:{fin+0.28:.3f},afade=t=out:st={fin+0.28-0.07:.3f}:d=0.07,aresample={sr}","-ac","1","-c:a","pcm_s16le",dst],check=True)
    x,_=sf.read(dst,dtype="float32"); pause=int(tm.get("pausa_ms",250))/1000
    tomas.append({"id":tm["id"],"inicio":round(t,3),"duracion":round(len(x)/sr,3),"texto":tm["texto"]})
    mix.append(x); t+=len(x)/sr
    if i<len(plan["tomas"]): mix.append(np.zeros(int(pause*sr),dtype="float32")); t+=pause
y=np.concatenate(mix); sf.write(d+"/mezcla.wav",y,sr,subtype="PCM_16")
json.dump({"duracion":round(len(y)/sr,3),"tomas":tomas},open(d+"/locucion.json","w",encoding="utf-8"),ensure_ascii=False,indent=1)
print("mezcla %.2fs"%(len(y)/sr))