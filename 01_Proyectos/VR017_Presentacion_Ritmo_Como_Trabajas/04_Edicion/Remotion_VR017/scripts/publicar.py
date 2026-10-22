# VR017: versión para subir a redes desde el máster (CRF 20, maxrate 24M; audio copiado del máster).
# El vídeo queda 4:2:0 de 8 bits con el rango completo que da Remotion (yuvj420p), igual que VR012–VR014.
# (Se probó pasarlo a rango limitado bt709: oscurecía las sombras ~2 niveles frente al fotograma de Remotion; descartado.)
# Uso: python scripts/publicar.py <master.mp4> <salida_publicar.mp4>
import subprocess, sys
src, dst = sys.argv[1], sys.argv[2]
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-maxrate", "24M", "-bufsize", "48M",
                "-pix_fmt", "yuv420p", "-profile:v", "high", "-c:a", "copy", "-movflags", "+faststart", dst], check=True)
print(dst)
