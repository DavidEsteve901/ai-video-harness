# Proxy objetivo de expresividad: variacion de tono (F0, semitonos) y dinamica de energia. No sustituye al oido.
import sys,glob,os,numpy as np,soundfile as sf,librosa
def medir(f):
    x,sr=sf.read(f,dtype="float32"); x=x if x.ndim==1 else x[:,0]
    if sr!=16000: x=librosa.resample(x,orig_sr=sr,target_sr=16000); sr=16000
    f0,vo,_=librosa.pyin(x,fmin=70,fmax=400,sr=sr,frame_length=1024)
    f0=f0[~np.isnan(f0)]
    if len(f0)<10: return None
    st=12*np.log2(f0/np.median(f0)); rango=np.percentile(st,95)-np.percentile(st,5)
    rms=librosa.feature.rms(y=x,frame_length=640,hop_length=160)[0]; db=20*np.log10(rms+1e-6); db=db[db>db.max()-35]
    return float(np.std(st)),float(rango),float(np.percentile(db,90)-np.percentile(db,10)),float(np.median(f0))
rows=[]
for d in sys.argv[1:]:
    r=[medir(f) for f in sorted(glob.glob(d+"/0*.wav"))]; r=[a for a in r if a]
    if r: a=np.mean(r,axis=0); rows.append((os.path.relpath(d).replace("\\","/")[-60:],*a))
print(f"{'conjunto':62s} {'F0 std(st)':>10s} {'rango(st)':>10s} {'dinam(dB)':>10s} {'F0 med(Hz)':>10s}")
for n,a,b_,c,d_ in rows: print(f"{n:62s} {a:10.2f} {b_:10.2f} {c:10.1f} {d_:10.0f}")