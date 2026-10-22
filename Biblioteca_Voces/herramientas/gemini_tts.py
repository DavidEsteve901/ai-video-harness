#!/usr/bin/env python3
"""Voces de Gemini (API de Google) para Videos_Rapidos.

La clave se lee SOLO de la variable de entorno de usuario GEMINI_API_KEY (nunca se imprime ni se guarda).
Cada llamada se anota en Biblioteca_Voces/gemini_uso.jsonl (modelo, voz, tokens, coste estimado).

  decir     python gemini_tts.py decir --voz Puck --estilo "curioso e ilusionado" --texto "..." --salida x.wav [--modelo gemini-3.8-flash-tts]
  plan      python gemini_tts.py plan --plan plan_vocal.json --estilos estilos.json --voz Puck --salida carpeta
  voces     python gemini_tts.py voces [--idioma es] [--genero female]       (biblioteca ampliada de Google)
  crear     python gemini_tts.py crear --nombre "Narrador cálido" --genero male --idioma es-ES --descripcion "..."   (voz propia guardada)
  gasto     python gemini_tts.py gasto                                         (resumen de lo gastado)
"""
import argparse, base64, json, os, sys, time, urllib.error, urllib.parse, urllib.request
from datetime import datetime

BASE = "https://generativelanguage.googleapis.com/v1beta"
AQUI = os.path.dirname(os.path.abspath(__file__))
USO = os.path.join(AQUI, "..", "gemini_uso.jsonl")
# USD por millón de tokens (entrada texto, salida audio). Vigente hasta 31-12-2026; desde 1-1-2027 se duplican los 3.8 (página de precios de Google).
PRECIOS = {"gemini-3.8-flash-tts": (0.50, 9.00), "gemini-3.8-flash-lite-tts": (0.50, 6.00),
           "gemini-3.1-flash-tts-preview": (1.00, 20.00), "gemini-2.5-flash-preview-tts": (0.50, 10.00)}
TOKENS_POR_SEGUNDO = 25

def clave():
    k = os.environ.get("GEMINI_API_KEY") or sys.exit("Falta la variable de entorno GEMINI_API_KEY (ver 06_GEMINI_VOCES.md)")
    return k

def llamar(ruta, cuerpo=None, metodo="POST", reintentos=5):
    url = BASE + ruta
    datos = json.dumps(cuerpo).encode() if cuerpo is not None else None
    for intento in range(reintentos):
        req = urllib.request.Request(url, data=datos, method=metodo, headers={"Content-Type": "application/json", "x-goog-api-key": clave()})
        try:
            return json.load(urllib.request.urlopen(req, timeout=180))
        except urllib.error.HTTPError as e:
            txt = e.read().decode()
            if e.code in (429, 500, 503) and intento < reintentos - 1:
                espera = 15 * (intento + 1)
                print("  [%s] reintento en %ds" % (e.code, espera), file=sys.stderr, flush=True); time.sleep(espera); continue
            sys.exit("HTTP %s: %s" % (e.code, txt[:500]))

def buscar_audio(o):
    """Recorre la respuesta y devuelve (bytes del audio, mime)."""
    if isinstance(o, dict):
        if isinstance(o.get("data"), str) and len(o["data"]) > 200 and "audio" in str(o.get("mime_type", o.get("mimeType", "audio"))):
            return base64.b64decode(o["data"]), o.get("mime_type", o.get("mimeType"))
        for v in o.values():
            r = buscar_audio(v)
            if r: return r
    elif isinstance(o, list):
        for v in o:
            r = buscar_audio(v)
            if r: return r
    return None

def buscar_uso(o):
    if isinstance(o, dict):
        for k in ("usage", "usageMetadata", "usage_metadata"):
            if isinstance(o.get(k), dict): return o[k]
        for v in o.values():
            r = buscar_uso(v)
            if r: return r
    elif isinstance(o, list):
        for v in o:
            r = buscar_uso(v)
            if r: return r
    return None

def sintetizar(texto, voz, estilo, modelo, salida):
    contenido = {"type": "text", "text": texto}
    if estilo: contenido["annotations"] = [{"type": "speech_metadata", "style": estilo}]
    cuerpo = {"model": modelo, "input": [{"type": "user_input", "content": [contenido]}],
              "response_format": {"type": "audio"}, "generation_config": {"speech_config": [{"voice": voz}]}}
    r = llamar("/interactions", cuerpo)
    a = buscar_audio(r)
    if not a: sys.exit("La respuesta no trae audio: " + json.dumps(r)[:400])
    datos, mime = a
    if datos[:4] == b"RIFF":
        open(salida, "wb").write(datos); seg = (len(datos) - 44) / 48000
    else:
        import wave
        with wave.open(salida, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(datos)
        seg = len(datos) / 48000
    u = buscar_uso(r) or {}
    tin = u.get("total_input_tokens") or u.get("input_tokens") or u.get("promptTokenCount") or 0
    tout = u.get("total_output_tokens") or u.get("output_tokens") or u.get("candidatesTokenCount") or int(seg * TOKENS_POR_SEGUNDO)
    pin, pout = PRECIOS.get(modelo, (0, 0))
    coste = tin / 1e6 * pin + tout / 1e6 * pout
    with open(USO, "a", encoding="utf-8") as f:
        f.write(json.dumps({"fecha": datetime.now().isoformat(timespec="seconds"), "modelo": modelo, "voz": voz, "seg": round(seg, 2),
                            "tokens_entrada": tin, "tokens_salida": tout, "usd": round(coste, 6), "salida": os.path.basename(salida)}, ensure_ascii=False) + "\n")
    return seg, tin, tout, coste

def cmd_decir(a):
    seg, tin, tout, c = sintetizar(a.texto, a.voz, a.estilo, a.modelo, a.salida)
    print(json.dumps({"seg": round(seg, 2), "tokens_entrada": tin, "tokens_salida": tout, "usd": round(c, 5)}))

def cmd_plan(a):
    plan = json.load(open(a.plan, encoding="utf-8"))["tomas"]
    estilos = json.load(open(a.estilos, encoding="utf-8")) if a.estilos else {}
    os.makedirs(a.salida, exist_ok=True); total = 0
    for i, t in enumerate(plan, 1):
        dst = os.path.join(a.salida, "%04d.wav" % i)
        if os.path.exists(dst) and not a.rehacer: continue
        seg, tin, tout, c = sintetizar(t["texto"], a.voz, estilos.get(t["id"], ""), a.modelo, dst); total += c
        print("toma %d: %.1fs  $%.5f" % (i, seg, c), flush=True); time.sleep(a.pausa)
    print("coste de esta tanda: $%.4f" % total)

def cmd_voces(a):
    """Lista (y guarda en gemini_voces_<idioma>.json) la biblioteca ampliada de Google. --idioma es -> es-ES (castellano)."""
    mapa = {"es": "es-ES", "es-es": "es-ES", "latino": "es-419", "es-419": "es-419", "en": "en-US"}
    idi = mapa.get((a.idioma or "").lower(), a.idioma)
    todas, tok = [], None
    while True:
        q = {"page_size": 1000}
        if idi: q["language_code"] = idi
        if a.genero: q["gender"] = a.genero
        if a.buscar: q["search"] = a.buscar
        if tok: q["page_token"] = tok
        r = llamar("/voices?" + urllib.parse.urlencode(q), metodo="GET")
        todas += r.get("voices", []); tok = r.get("next_page_token")
        if not tok: break
    out = os.path.join(AQUI, "..", "gemini_voces_%s.json" % (idi or "todas"))
    json.dump(todas, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    if not a.callar:
        for v in todas[:a.max]:
            print("%-26s %-7s %-8s %s" % (v.get("id", "")[:26], v.get("gender", ""), v.get("language_code", ""), (v.get("description") or "")[:95]))
    print(len(todas), "voces. Catálogo guardado en", os.path.normpath(out))
def cmd_crear(a):
    cuerpo = {"store": True, "voice": {"model": a.modelo, "type": "prompted", "display_name": a.nombre, "gender": a.genero,
              "language_code": a.idioma, "prompted": {"input": a.descripcion}}}
    r = llamar("/voices", cuerpo)
    audio = buscar_audio(r)
    if audio and a.muestra:
        open(a.muestra, "wb").write(audio[0])
    print(json.dumps({"id": r.get("id"), "nombre": a.nombre, "muestra": a.muestra}, ensure_ascii=False))

def cmd_gasto(a):
    if not os.path.exists(USO): return print("Aún no hay registro de gasto.")
    filas = [json.loads(l) for l in open(USO, encoding="utf-8") if l.strip()]
    tot = sum(f["usd"] for f in filas); seg = sum(f["seg"] for f in filas)
    print("%d llamadas, %.0f s de audio, gasto estimado %.4f USD" % (len(filas), seg, tot))
    por = {}
    for f in filas: por.setdefault(f["voz"], [0, 0.0]); por[f["voz"]][0] += 1; por[f["voz"]][1] += f["usd"]
    for v, (n, c) in sorted(por.items(), key=lambda x: -x[1][1]): print("  %-14s %3d llamadas  %.4f USD" % (v, n, c))

if __name__ == "__main__":
    p = argparse.ArgumentParser(); s = p.add_subparsers(dest="cmd", required=True)
    d = s.add_parser("decir"); d.add_argument("--voz", required=True); d.add_argument("--estilo", default=""); d.add_argument("--texto", required=True)
    d.add_argument("--salida", required=True); d.add_argument("--modelo", default="gemini-3.8-flash-tts"); d.set_defaults(f=cmd_decir)
    l = s.add_parser("plan"); l.add_argument("--plan", required=True); l.add_argument("--estilos"); l.add_argument("--voz", required=True)
    l.add_argument("--salida", required=True); l.add_argument("--modelo", default="gemini-3.8-flash-tts"); l.add_argument("--pausa", type=float, default=3.0)
    l.add_argument("--rehacer", action="store_true"); l.set_defaults(f=cmd_plan)
    v = s.add_parser("voces"); v.add_argument("--idioma"); v.add_argument("--genero"); v.add_argument("--buscar"); v.add_argument("--max", type=int, default=40); v.add_argument("--callar", action="store_true"); v.set_defaults(f=cmd_voces)
    c = s.add_parser("crear"); c.add_argument("--nombre", required=True); c.add_argument("--genero", default="male"); c.add_argument("--idioma", default="es-ES")
    c.add_argument("--descripcion", required=True); c.add_argument("--modelo", default="gemini-3.8-flash-tts"); c.add_argument("--muestra"); c.set_defaults(f=cmd_crear)
    g = s.add_parser("gasto"); g.set_defaults(f=cmd_gasto)
    a = p.parse_args(); a.f(a)