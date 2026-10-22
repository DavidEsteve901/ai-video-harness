# VR015/VR017: versión para subir a redes desde el máster (CRF 20, maxrate 24M; audio copiado del máster).
# Uso: python scripts/publicar.py <master.mp4> <salida_publicar.mp4>
import subprocess, sys
src, dst = sys.argv[1], sys.argv[2]
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-maxrate", "24M", "-bufsize", "48M",
                "-pix_fmt", "yuv420p", "-profile:v", "high", "-c:a", "copy", "-movflags", "+faststart", dst], check=True)
print(dst)
