"""Servidor local de la Biblioteca de Voces: sirve la web y GUARDA las voces favoritas para que el agente las lea.

    python servidor_voces.py [--puerto 7861] [--no-abrir]        (lo lanza 00_ABRIR_VOCES.cmd)

- Solo escucha en 127.0.0.1. Solo estándar. Escribe únicamente FAVORITAS.json y FAVORITAS.md en la carpeta de la biblioteca.
- GET /api/favoritas  → {"favoritas": [claves…]};  POST /api/favoritas {"claves": [...]} → guarda (las claves desconocidas se ignoran).
- La web (Escuchar_Voces.html) funciona también abierta como archivo; en ese caso se sincroniza con este servidor si está en marcha.
"""
import argparse, json, os, sys, time, webbrowser
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.request import urlopen

HERE = Path(__file__).resolve().parent
LIB = HERE.parent
CATALOGO = HERE / "catalogo_voces.json"
JSON_FAV, MD_FAV = LIB / "FAVORITAS.json", LIB / "FAVORITAS.md"


def catalogo():
    cat = json.loads(CATALOGO.read_text(encoding="utf-8"))
    voces = {}
    for sec in ("arquetipos", "emociones", "personalizadas"):
        for k, v in cat.get(sec, {}).items():
            voces[k] = dict(v, tipo=sec)
    return voces


def leer_favoritas():
    try:
        return [f["clave"] for f in json.loads(JSON_FAV.read_text(encoding="utf-8")).get("favoritas", [])]
    except (OSError, ValueError):
        return []


def guardar_favoritas(claves):
    voces = catalogo()
    vistas, filas = set(), []
    for k in claves:
        if k in voces and k not in vistas:
            vistas.add(k); v = voces[k]
            filas.append(dict(clave=k, nombre=v["nombre"], idioma=v["lang"], bilingue=bool(v.get("bilingue", {}).get("ok")), tipo=v["tipo"],
                              familia=v.get("familia", ""), uso=v.get("uso", ""), voice_id=v["voice_id"], muestra=v.get("muestra", "")))
    datos = {"actualizado": datetime.now().isoformat(timespec="seconds"), "nota": "Voces marcadas como favoritas por el usuario en la web de la biblioteca.", "favoritas": filas}
    tmp = JSON_FAV.with_suffix(".tmp"); tmp.write_text(json.dumps(datos, ensure_ascii=False, indent=1), encoding="utf-8"); os.replace(tmp, JSON_FAV)
    L = ["---", "title: Voces favoritas del usuario", "status: active", "tags: [project/workspace-launcher, marketing, video, voz]", "---", "",
         "# Voces favoritas", "",
         "> **Agente: léelo antes de elegir una voz.** Son las voces que David ha marcado con ⭐ en la web (`00_ESCUCHAR_VOCES.html`). Si el encargo encaja con alguna, **úsala** (o la que más se parezca) y dilo; si ninguna encaja, elige otra del [INDICE_VOCES.md](INDICE_VOCES.md) y explica por qué. No las cambies ni borres: este archivo lo escribe la web.",
         f"> Actualizado: {datos['actualizado']} · Fuente de verdad: `FAVORITAS.json`.", ""]
    if not filas:
        L.append("_Todavía no hay favoritas._")
    else:
        L += ["| Clave | Voz | Idioma | Para qué | Uso con `locutor.py` |", "| --- | --- | --- | --- | --- |"]
        for f in filas:
            idi = "ES+EN" if f["bilingue"] else f["idioma"].upper()
            L.append(f"| `{f['clave']}` | {f['nombre']} | {idi} | {f['uso']} | `--voz {f['clave']}` |")
    L += ["", "Cómo usarlas: skill `.agents/skills/voces-locucion/SKILL.md` (`locutor.py decir --voz <clave> …`)."]
    tmp = MD_FAV.with_suffix(".tmp"); tmp.write_text("\n".join(L) + "\n", encoding="utf-8"); os.replace(tmp, MD_FAV)
    return [f["clave"] for f in filas]


class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(LIB), **k)

    def _cors(self):
        o = self.headers.get("Origin", "")
        if o == "null" or o.startswith(("http://127.0.0.1", "http://localhost")):
            self.send_header("Access-Control-Allow-Origin", o)
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

    def _json(self, obj, code=200):
        b = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(code); self._cors()
        self.send_header("Content-Type", "application/json; charset=utf-8"); self.send_header("Content-Length", str(len(b))); self.end_headers(); self.wfile.write(b)

    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()

    def do_GET(self):
        if self.path.split("?")[0] == "/api/favoritas":
            return self._json({"favoritas": leer_favoritas()})
        if self.path.split("?")[0] == "/api/ping":
            return self._json({"ok": True, "app": "biblioteca-voces"})
        if self.path in ("", "/"):
            self.path = "/Escuchar_Voces.html"
        return super().do_GET()

    def do_POST(self):
        if self.path.split("?")[0] != "/api/favoritas":
            return self._json({"error": "ruta"}, 404)
        try:
            n = int(self.headers.get("Content-Length", "0"))
            claves = json.loads(self.rfile.read(min(n, 100_000)))["claves"]
            if not isinstance(claves, list):
                raise ValueError
            return self._json({"ok": True, "favoritas": guardar_favoritas([c for c in claves if isinstance(c, str)])})
        except (ValueError, KeyError, OSError) as e:
            return self._json({"error": str(e)[:200]}, 400)

    def log_message(self, *a):  # silencio
        pass


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--puerto", type=int, default=7861); ap.add_argument("--no-abrir", action="store_true")
    a = ap.parse_args()
    url = f"http://127.0.0.1:{a.puerto}/"
    try:
        srv = ThreadingHTTPServer(("127.0.0.1", a.puerto), H)
    except OSError:  # ya hay uno en marcha
        try:
            if json.load(urlopen(url + "api/ping", timeout=2)).get("app") == "biblioteca-voces":
                print("El servidor ya estaba en marcha.");
                if not a.no_abrir: webbrowser.open(url)
                return
        except Exception:
            pass
        sys.exit(f"El puerto {a.puerto} está ocupado por otro programa. Usa --puerto.")
    if not JSON_FAV.exists():
        guardar_favoritas([])
    print(f"Biblioteca de voces en {url}  (cierra esta ventana para parar). Favoritas -> {JSON_FAV.name}")
    if not a.no_abrir:
        webbrowser.open(url)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
