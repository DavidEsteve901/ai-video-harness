#!/usr/bin/env python3
"""Conexión de bibliotecas de recursos (vídeo, imagen, audio…) a este harness.

Los recursos pesados NO viven en el repositorio: viven en una o varias carpetas de
tu equipo (otro disco, un NAS, Drive sincronizado…). Este script lee
`conexion_recursos/recursos.config.local.json` (no se sube a git), resuelve las
rutas de cada biblioteca en ESTE ordenador y mantiene un `catalogo.json` por
biblioteca para que una IA entienda qué hay y dónde.

Uso (desde la raíz del repo):
  python herramientas/recursos.py init                 # crea la config local desde el ejemplo
  python herramientas/recursos.py list                 # bibliotecas, ruta y si existe en este equipo
  python herramientas/recursos.py check                # avisa de rutas rotas o catálogos desfasados
  python herramientas/recursos.py resolve <id> [rel]   # ruta absoluta de una biblioteca o recurso
  python herramientas/recursos.py scan <id>            # (re)genera/actualiza el catalogo.json
  python herramientas/recursos.py search <texto> [--id <id>] [--tipo video|audio|imagen]
  python herramientas/recursos.py pending <id>         # recursos aún sin descripción

Solo usa la librería estándar. Si `ffprobe` está en el PATH, rellena la duración y
la resolución de forma automática.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
from datetime import date
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
CONF_DIR = REPO / "conexion_recursos"
CONF_LOCAL = CONF_DIR / "recursos.config.local.json"
CONF_EXAMPLE = CONF_DIR / "recursos.config.example.json"
CATALOGO = "catalogo.json"  # vive DENTRO de cada biblioteca, junto a los archivos

TIPOS = {
    "video": {".mp4", ".mov", ".mkv", ".webm", ".avi", ".m4v"},
    "audio": {".mp3", ".wav", ".flac", ".ogg", ".m4a", ".aac"},
    "imagen": {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".bmp"},
    "fuente": {".ttf", ".otf", ".woff", ".woff2"},
    "proyecto": {".kdenlive", ".prproj", ".drp", ".aep", ".psd"},
}
IGNORAR = {"desktop.ini", "thumbs.db", ".ds_store", CATALOGO}
IGNORAR_DIRS = {".git", "node_modules", "__pycache__", "$recycle.bin"}


def tipo_de(path: Path) -> str | None:
    ext = path.suffix.lower()
    for t, exts in TIPOS.items():
        if ext in exts:
            return t
    return None


def load_config() -> dict:
    if not CONF_LOCAL.exists():
        sys.exit(
            f"No existe {CONF_LOCAL.relative_to(REPO)}.\n"
            "Ejecuta: python herramientas/recursos.py init  y edita las rutas."
        )
    return json.loads(CONF_LOCAL.read_text(encoding="utf-8"))


def expand(p: str) -> Path:
    return Path(os.path.expandvars(os.path.expanduser(p)))


def lib_root(lib: dict) -> Path | None:
    """Primera ruta candidata que exista en este equipo (permite varios PCs/discos)."""
    rutas = lib.get("rutas") or ([lib["ruta"]] if lib.get("ruta") else [])
    for r in rutas:
        p = expand(r)
        if p.exists():
            return p
    return None


def get_lib(cfg: dict, lib_id: str) -> dict:
    for lib in cfg.get("bibliotecas", []):
        if lib["id"] == lib_id:
            return lib
    sys.exit(f"Biblioteca desconocida: {lib_id}. Disponibles: "
             + ", ".join(l["id"] for l in cfg.get("bibliotecas", [])))


# ---------------------------------------------------------------- comandos
def cmd_init(_a) -> None:
    if CONF_LOCAL.exists():
        print(f"Ya existe {CONF_LOCAL}. No se sobrescribe.")
        return
    shutil.copyfile(CONF_EXAMPLE, CONF_LOCAL)
    print(f"Creado {CONF_LOCAL}\nEdítalo: pon en `rutas` dónde está cada biblioteca en este equipo.")


def cmd_list(_a) -> None:
    cfg = load_config()
    for lib in cfg["bibliotecas"]:
        root = lib_root(lib)
        estado = f"OK  {root}" if root else "NO ENCONTRADA en este equipo"
        cat = (root / CATALOGO) if root else None
        ind = "catálogo sí" if cat and cat.exists() else "sin catálogo (usa scan)"
        print(f"[{lib['id']}] {lib.get('nombre', '')}\n    {estado}  ·  {ind}\n    {lib.get('descripcion', '')}")


def cmd_check(_a) -> None:
    cfg = load_config()
    problemas = 0
    for lib in cfg["bibliotecas"]:
        root = lib_root(lib)
        if not root:
            print(f"✗ {lib['id']}: ninguna de sus rutas existe aquí → {lib.get('rutas') or lib.get('ruta')}")
            problemas += 1
            continue
        cat = root / CATALOGO
        if not cat.exists():
            print(f"! {lib['id']}: sin {CATALOGO}. Ejecuta: scan {lib['id']}")
            problemas += 1
            continue
        data = json.loads(cat.read_text(encoding="utf-8"))
        faltan = [r["ruta"] for r in data["recursos"] if not (root / r["ruta"]).exists()]
        nuevos = len(_walk(root)) - (len(data["recursos"]) - len(faltan))
        sin_desc = sum(1 for r in data["recursos"] if not r.get("descripcion"))
        msg = f"✓ {lib['id']}: {len(data['recursos'])} recursos"
        if faltan:
            msg += f", {len(faltan)} ya no existen"
            problemas += 1
        if nuevos > 0:
            msg += f", ~{nuevos} nuevos sin catalogar"
            problemas += 1
        if sin_desc:
            msg += f", {sin_desc} sin descripción"
        print(msg)
    sys.exit(1 if problemas else 0)


def cmd_resolve(a) -> None:
    cfg = load_config()
    root = lib_root(get_lib(cfg, a.id))
    if not root:
        sys.exit("La biblioteca no está disponible en este equipo (revisa `rutas`).")
    print(root / a.rel if a.rel else root)


def _walk(root: Path) -> list[Path]:
    out = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d.lower() not in IGNORAR_DIRS]
        for f in filenames:
            p = Path(dirpath) / f
            if f.lower() in IGNORAR or tipo_de(p) is None:
                continue
            out.append(p)
    return out


def _probe(p: Path) -> dict:
    if not shutil.which("ffprobe"):
        return {}
    try:
        r = subprocess.run(
            ["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", str(p)],
            capture_output=True, text=True, timeout=30,
        )
        j = json.loads(r.stdout or "{}")
    except Exception:
        return {}
    meta: dict = {}
    dur = j.get("format", {}).get("duration")
    if dur:
        meta["duracion_s"] = round(float(dur), 2)
    for s in j.get("streams", []):
        if s.get("codec_type") == "video" and s.get("width"):
            meta["resolucion"] = f"{s['width']}x{s['height']}"
            break
    return meta


def cmd_scan(a) -> None:
    cfg = load_config()
    lib = get_lib(cfg, a.id)
    root = lib_root(lib)
    if not root:
        sys.exit("La biblioteca no está disponible en este equipo.")
    cat_path = root / CATALOGO
    previo = {}
    if cat_path.exists():
        previo = {r["ruta"]: r for r in json.loads(cat_path.read_text(encoding="utf-8"))["recursos"]}
    recursos = []
    for p in sorted(_walk(root)):
        rel = p.relative_to(root).as_posix()
        ficha = previo.get(rel, {})  # conserva descripciones escritas a mano
        ficha.update({
            "id": ficha.get("id") or f"R{len(recursos) + 1:05d}",
            "ruta": rel,
            "tipo": tipo_de(p),
            "carpeta": Path(rel).parent.as_posix(),
            "bytes": p.stat().st_size,
        })
        if a.probe or "duracion_s" not in ficha:
            ficha.update(_probe(p) if tipo_de(p) in ("video", "audio") else {})
        ficha.setdefault("descripcion", "")
        ficha.setdefault("etiquetas", [])
        ficha.setdefault("licencia", lib.get("licencia_por_defecto", ""))
        ficha.setdefault("notas", "")
        recursos.append(ficha)
    data = {
        "schema_version": 1,
        "biblioteca": lib["id"],
        "generado": date.today().isoformat(),
        "raiz": "(se resuelve con herramientas/recursos.py resolve <id>; las rutas son relativas a la raíz)",
        "total": len(recursos),
        "recursos": recursos,
    }
    cat_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    pend = sum(1 for r in recursos if not r["descripcion"])
    print(f"{cat_path}\n{len(recursos)} recursos, {pend} sin descripción (pide a la IA que los describa).")


def cmd_pending(a) -> None:
    cfg = load_config()
    root = lib_root(get_lib(cfg, a.id))
    data = json.loads((root / CATALOGO).read_text(encoding="utf-8"))
    for r in data["recursos"]:
        if not r.get("descripcion"):
            print(f"{r['id']}\t{r['tipo']}\t{r['ruta']}")


def cmd_search(a) -> None:
    cfg = load_config()
    q = [w.lower() for w in a.texto.split()]
    for lib in cfg["bibliotecas"]:
        if a.id and lib["id"] != a.id:
            continue
        root = lib_root(lib)
        if not root or not (root / CATALOGO).exists():
            continue
        for r in json.loads((root / CATALOGO).read_text(encoding="utf-8"))["recursos"]:
            if a.tipo and r["tipo"] != a.tipo:
                continue
            hay = " ".join([r["ruta"], r.get("descripcion", ""), " ".join(r.get("etiquetas", [])), r.get("notas", "")]).lower()
            if all(w in hay for w in q):
                dur = f" {r['duracion_s']}s" if "duracion_s" in r else ""
                print(f"[{lib['id']}] {r['tipo']}{dur}  {root / r['ruta']}\n    {r.get('descripcion', '')}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest="cmd", required=True)
    sp.add_parser("init").set_defaults(f=cmd_init)
    sp.add_parser("list").set_defaults(f=cmd_list)
    sp.add_parser("check").set_defaults(f=cmd_check)
    s = sp.add_parser("resolve"); s.add_argument("id"); s.add_argument("rel", nargs="?"); s.set_defaults(f=cmd_resolve)
    s = sp.add_parser("scan"); s.add_argument("id"); s.add_argument("--probe", action="store_true", help="re-medir duración/resolución de todo"); s.set_defaults(f=cmd_scan)
    s = sp.add_parser("pending"); s.add_argument("id"); s.set_defaults(f=cmd_pending)
    s = sp.add_parser("search"); s.add_argument("texto"); s.add_argument("--id"); s.add_argument("--tipo", choices=list(TIPOS)); s.set_defaults(f=cmd_search)
    a = ap.parse_args()
    a.f(a)


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    main()
