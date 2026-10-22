# VR012: masteriza el audio de un MP4 renderizado (loudnorm en dos pasadas, -14 LUFS, pico -1,5 dBTP) sin tocar el vídeo.
# Uso: python scripts/masterizar.py out/VR012_H_raw.mp4 out/VR012_H_final.mp4
import json, subprocess, sys

src, dst = sys.argv[1], sys.argv[2]
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", src, "-af", "alimiter=limit=0.75:level=false:attack=3:release=60,loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-vn", "-f", "null", "-"],
                   capture_output=True, text=True, encoding="utf-8", errors="replace")
m = json.loads(r.stderr[r.stderr.rfind("{"):r.stderr.rfind("}") + 1])
af = ("loudnorm=I=-14:TP=-1.5:LRA=11:linear=true:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s"
      % (m["input_i"], m["input_tp"], m["input_lra"], m["input_thresh"], m["target_offset"]))
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-c:v", "copy", "-af", "alimiter=limit=0.75:level=false:attack=3:release=60," + af + ",aresample=48000", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", dst], check=True)
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", dst, "-af", "ebur128=peak=true", "-vn", "-f", "null", "-"], capture_output=True, text=True, encoding="utf-8", errors="replace")
res = r.stderr[r.stderr.rfind("Summary"):]
print(dst, " ".join(l.strip() for l in res.splitlines() if l.strip().startswith(("I:", "Peak:"))))
