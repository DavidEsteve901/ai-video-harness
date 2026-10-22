import json, subprocess, sys, os
A = "<RAIZ_GRABACIONES>/02_Audio/"
# (id, clip, ss, to, gap_before)
P = [
 ("p1", "T01_Introduccion_ES/Introduccion_ES_01.wav", 0.0, 5.55, 0.10),
 ("p2", "T01_Introduccion_ES/Introduccion_ES_02.wav", 0.0, 7.10, 0.30),
 ("p3", "T01_Introduccion_ES/Introduccion_ES_03.wav", 0.0, 4.38, 0.30),
 ("p4", "T01_Creacion_ES/Creacion_ES_17.wav",        0.0, 7.10, 0.45),
 ("p5", "T01_Creacion_ES/Creacion_ES_18.wav",        0.0, 1.63, 0.30),
 ("p6", "T01_Creacion_ES/Creacion_ES_19.wav",        0.0, 3.56, 2.60),
 ("p7", "T01_Creacion_ES/Creacion_ES_19.wav",        3.88, 7.87, 0.40),
]
t = 0.0; out = []; ins = []; filt = []
for i,(pid,clip,ss,to,gap) in enumerate(P):
    t += gap; d = to-ss
    out.append(dict(id=pid, start=round(t,3), end=round(t+d,3), clip=clip, ss=ss, to=to))
    ins += ["-ss", str(ss), "-t", str(d), "-i", A+clip]
    ms = int(t*1000)
    filt.append(f"[{i}:a]afade=t=in:d=0.008,afade=t=out:st={d-0.04:.3f}:d=0.04,aresample=48000,pan=mono|c0=c0,adelay={ms}[a{i}]")
    t += d
total = t + 1.0
mix = "".join(f"[a{i}]" for i in range(len(P))) + f"amix=inputs={len(P)}:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=7,apad=whole_dur={total:.3f}[o]"
cmd = ["ffmpeg","-v","error","-y"] + ins + ["-filter_complex", ";".join(filt)+";"+mix, "-map","[o]","-t",f"{total:.3f}","narracion.wav"]
subprocess.run(cmd, check=True)
json.dump(dict(total=round(total,3), pieces=out), open("voz.json","w"), indent=1)
print(json.dumps(out, indent=1)); print("total", total)
