# Gemini TTS (API de Google). La clave se lee de la variable de entorno GEMINI_API_KEY; nunca se imprime ni se guarda.
# uso: python gemini_tts.py <modelo> <voz> "<estilo>" "<texto>" <salida.wav>
import sys, os, json, base64, wave, urllib.request, urllib.error
modelo, voz, estilo, texto, salida = sys.argv[1:6]
key = os.environ.get("GEMINI_API_KEY") or sys.exit("falta GEMINI_API_KEY")
if estilo:
    prompt = "# AUDIO PROFILE\n## DIRECTOR'S NOTES\nStyle: " + estilo + "\n\n#### TRANSCRIPT\n" + texto
else:
    prompt = texto
body = {"contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["AUDIO"],
        "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voz}}}}}
req = urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent" % modelo,
    data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": key})
try:
    r = json.load(urllib.request.urlopen(req, timeout=120))
except urllib.error.HTTPError as e:
    sys.exit("HTTP %s: %s" % (e.code, e.read().decode()[:300]))
part = r["candidates"][0]["content"]["parts"][0]["inlineData"]
pcm = base64.b64decode(part["data"])
riff = pcm[:4] == b"RIFF"
if riff:
    open(salida, "wb").write(pcm)
else:
    with wave.open(salida, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
u = r.get("usageMetadata", {})
print(json.dumps({"seg": round((len(pcm) - (44 if riff else 0)) / 48000, 2), "tokens_entrada": u.get("promptTokenCount"), "tokens_salida": u.get("candidatesTokenCount")}))