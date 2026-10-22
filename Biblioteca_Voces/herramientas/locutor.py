#!/usr/bin/env python3
"""Locutor: herramienta para que un agente (o tú) ponga voz a un vídeo con la Biblioteca de Voces.

Solo usa la librería estándar (vale cualquier Python 3). Necesita ffmpeg en el PATH y Local Voice Studio en
C:\\Herramientas\\local-voice-studio (si el servidor no está en marcha, lo arranca solo).

  python locutor.py listar [--lang es|en] [--familia TXT] [--buscar TXT] [--bilingue] [--emociones]
  python locutor.py decir --voz CLAVE (--texto "..." | --archivo guion.txt) [--lang es|en]
                          [--velocidad 1.0] [--acelerar 1.1] [--fx radio] [--semilla 11] [--pausa 250]
                          [--salida C:\\ruta\\locucion] [--revisar] [--mp3]
  python locutor.py nueva-voz --nombre "Mi voz" --desc "Hombre de..." --texto "frase de 30+ caracteres" [--lang es]
  python locutor.py nueva-voz --nombre "Genio enfadado" --base genio_sarcastico --emocion enfado
  python locutor.py favoritas            (las voces que el usuario marcó con ⭐ en la web: úsalas primero)
  python locutor.py fx-lista

Plan contextual: decir --plan plan_vocal.json; --preparar valida y guarda sin síntesis.
Voz fija por personaje; emoción, intención, intensidad, ritmo y pausa por toma.
CosyVoice aplica instrucciones; Qwen Base no tiene control emocional directo.

Guion (--archivo): una frase por línea. Cambia de voz en una línea con  [clave_voz] texto.  # = comentario.
  # ejemplo
  [genio_sarcastico] Jarvis, hazme un favor.
  [genio_sarcastico] ¡No me lo puedo creer!  <- misma voz, otra interpretación en el plan
Salida: <salida>.wav (mezcla), <salida>_tomas/0001.wav… (una por línea, para sincronizar en Remotion)
y <salida>.json con inicio/duración de cada toma. Todas las tomas pasan por: recorte de silencios de los
bordes, aceleración opcional, efecto opcional y normalización a -16 LUFS (limitador a -1,5 dBTP).
"""
import argparse, json, subprocess, sys, time, urllib.request, urllib.error
from pathlib import Path

for _f in (sys.stdout, sys.stderr):
    try: _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception: pass
HERE = Path(__file__).resolve().parent
STUDIO = Path(r"C:\Herramientas\local-voice-studio")
BASE = "http://127.0.0.1:7860"
CATALOGO = HERE / "catalogo_voces.json"
sys.path.insert(0, str(HERE))

# Efectos de voz (cadenas de filtros ffmpeg). Se aplican DESPUÉS de sintetizar; no cambian lo que dice, solo cómo suena.
FX = {
    "limpio":    "highpass=f=70,acompressor=threshold=-18dB:ratio=3:attack=5:release=80",
    "radio":     "highpass=f=300,lowpass=f=3400,acompressor=threshold=-20dB:ratio=6,volume=1.2",
    "telefono":  "highpass=f=400,lowpass=f=3000,acompressor=threshold=-22dB:ratio=8,volume=1.3",
    "megafono":  "highpass=f=500,lowpass=f=4200,acompressor=threshold=-25dB:ratio=10,aecho=0.7:0.5:30:0.25,volume=1.4",
    "robot":     "highpass=f=120,tremolo=f=45:d=0.6,aecho=0.8:0.7:12:0.3",
    "trailer":   "highpass=f=60,bass=g=6:f=110,acompressor=threshold=-16dB:ratio=4,aecho=0.8:0.6:70:0.25",
    "eco":       "aecho=0.8:0.8:45|90:0.35|0.2",
    "cueva":     "aecho=0.8:0.9:200|400:0.4|0.25",
    "susurro":   "highpass=f=120,treble=g=4:f=5000,acompressor=threshold=-24dB:ratio=5,volume=1.5",
    "grave":     "asetrate=24000*0.88,aresample=24000,atempo=1/0.88",
    "agudo":     "asetrate=24000*1.15,aresample=24000,atempo=1/1.15",
    "calido":    "equalizer=f=200:t=q:w=1:g=3,equalizer=f=6500:t=q:w=1:g=-3",
    "brillante": "equalizer=f=3500:t=q:w=1:g=3,treble=g=2:f=8000",
}


def die(msg):
    print("ERROR:", msg, file=sys.stderr); sys.exit(1)


def cargar():
    if not CATALOGO.exists():
        die(f"No existe {CATALOGO}. Ejecuta generar_biblioteca.py.")
    return json.loads(CATALOGO.read_text(encoding="utf-8"))


def todas(cat):
    d = {}
    for sec in ("arquetipos", "emociones", "personalizadas"):
        d.update(cat.get(sec, {}))
    return d


FAVORITAS = HERE.parent / "FAVORITAS.json"


def favoritas():
    try:
        return [f["clave"] for f in json.loads(FAVORITAS.read_text(encoding="utf-8")).get("favoritas", [])]
    except (OSError, ValueError):
        return []


def token():
    return (STUDIO / "data" / "api-token").read_text().strip()


def api(path, payload=None, raw=False, timeout=180):
    req = urllib.request.Request(BASE + path, data=json.dumps(payload).encode() if payload is not None else None,
                                 headers={"X-Local-Token": token(), "Content-Type": "application/json"},
                                 method="POST" if payload is not None else "GET")
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = r.read()
    return data if raw else json.loads(data)


def servidor():
    try:
        api("/api/status", timeout=3); return
    except Exception:
        pass
    print("Arrancando Local Voice Studio…")
    subprocess.run(["powershell", "-NoProfile", "-File", str(STUDIO / "scripts" / "start.ps1"), "-NoBrowser"], check=True)


def esperar(job_id, etiqueta="trabajo"):
    t0 = time.time()
    while True:
        j = api("/api/jobs/" + job_id)
        if j["status"] not in ("queued", "running", "exporting"):
            break
        print(f"  {etiqueta}: {j['status']} {j.get('message', '')} ({int(time.time() - t0)} s)", end="\r", flush=True)
        time.sleep(3)
    print()
    if j["status"] != "completed":
        die(j.get("error") or j.get("message") or j["status"])
    return j


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *map(str, args)], check=True)


def duracion(p):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)], capture_output=True, text=True)
    return float(out.stdout.strip())


# ───────────────────────── listar ─────────────────────────
def cmd_favoritas(a):
    cat = cargar(); voces = todas(cat); fav = favoritas()
    if not fav:
        print("El usuario aún no ha marcado favoritas (web: 00_ABRIR_VOCES.cmd). Elige del índice según el tipo de vídeo."); return
    print("Favoritas del usuario (priorízalas si encajan con el encargo):")
    for k in fav:
        v = voces.get(k)
        if v: print(f"  ★ {k:<24} {v['nombre']:<34} {'ES+EN' if v.get('bilingue', {}).get('ok') else v['lang'].upper():<6} {v.get('uso', '')[:60]}")


def cmd_listar(a):
    cat = cargar(); fav = set(favoritas())
    secs = ["emociones"] if a.emociones else ["arquetipos", "personalizadas"]
    filas = []
    for sec in secs:
        for k, v in cat.get(sec, {}).items():
            if a.lang and v["lang"] != a.lang: continue
            if a.familia and a.familia.lower() not in v.get("familia", "").lower(): continue
            if a.bilingue and not v.get("bilingue", {}).get("ok"): continue
            texto = " ".join([k, v["nombre"], v.get("uso", ""), v.get("desc", "")]).lower()
            if a.buscar and a.buscar.lower() not in texto: continue
            if a.solo_favoritas and k not in fav: continue
            bi = "ES+EN" if v.get("bilingue", {}).get("ok") else v["lang"].upper()
            filas.append((v.get("familia", sec), ("★ " if k in fav else "  ") + k, v["nombre"], bi, v.get("uso", v.get("desc", ""))[:70]))
    for f in sorted(filas):
        print(f"{f[0]:<22} {f[1]:<26} {f[2]:<34} {f[3]:<6} {f[4]}")
    print(f"\n{len(filas)} voces ({len(fav)} favoritas del usuario, marcadas con ★). Detalle: catalogo_voces.json · INDICE_VOCES.md · FAVORITAS.md")


# ───────────────────────── decir ─────────────────────────

def parsear_guion(a, voces):
    from direccion_locucion import preparar
    try:
        plan = preparar(a, voces)
    except (ValueError, OSError) as exc:
        die(str(exc))
    return [(t['voz'], t['texto']) for t in plan['tomas']]


def cmd_decir(a):
    from direccion_locucion import preparar
    cat = cargar(); voces = todas(cat)
    try:
        plan = preparar(a, voces)
    except (ValueError, OSError) as exc:
        die(str(exc))
    if a.fx and a.fx not in FX:
        die(f"Efecto desconocido. Disponibles: {', '.join(FX)}")
    salida = Path(a.salida or (Path.cwd() / 'locucion')).resolve()
    salida.parent.mkdir(parents=True, exist_ok=True)
    plan_path = salida.with_suffix('.plan.json')
    parametros = {'seed':a.semilla,'velocidad':a.velocidad,'acelerar':a.acelerar,'fx':a.fx,'engine':plan['project']['engine']}
    plan['parametros'] = parametros
    plan_path.write_text(json.dumps(plan,ensure_ascii=False,indent=2),encoding='utf-8')
    print('Identidades fijas: '+', '.join(f"{p} = {v['voz']}" for p,v in plan['identidades'].items()))
    if a.preparar:
        print('Plan preparado, sin generar audio: '+str(plan_path))
        print(plan['limite_motor']); return
    fav = favoritas()
    claves = {t['voz'] for t in plan['tomas']}
    if fav and claves.difference(fav):
        print('NOTA: hay voces favoritas; conserva la elección del usuario si ya definió el reparto.')
    for t in plan['tomas']:
        v=voces[t['voz']]
        if v['lang'] != t['idioma'] and not v.get('bilingue',{}).get('ok'):
            print(f"AVISO: revisa el idioma de {t['personaje']} ({t['idioma']}).")
    servidor()
    job = esperar(api('/api/jobs', {'project':plan['project']})['id'], 'síntesis')
    plan['estado']='generado_pendiente_escucha';plan['job']=job['id']
    plan_path.write_text(json.dumps(plan,ensure_ascii=False,indent=2),encoding='utf-8')
    tomas=salida.parent/(salida.name+'_tomas');tomas.mkdir(parents=True,exist_ok=True)
    crudos=tomas/'originales';crudos.mkdir(exist_ok=True)
    info, cursor, rutas=[],0.0,[]
    for i,toma in enumerate(plan['tomas'],1):
        crudo=crudos/f'{i:04d}.wav'
        crudo.write_bytes(api(f"/api/jobs/{job['id']}/files/{i:04d}.wav",raw=True))
        destino=tomas/f'{i:04d}.wav'
        filtro=['silenceremove=start_periods=1:start_threshold=-48dB,areverse,silenceremove=start_periods=1:start_threshold=-48dB,areverse']
        factor=a.acelerar*toma['ritmo']
        if factor != 1: filtro.append(f'atempo={factor}')
        if a.fx: filtro.append(FX[a.fx])
        filtro.append('loudnorm=I=-16:TP=-1.5:LRA=11')
        ffmpeg('-i',crudo,'-af',','.join(filtro),'-ar',44100,'-ac',1,destino)
        d=duracion(destino)
        info.append({**toma,'archivo':str(destino),'archivo_original':str(crudo),'inicio':round(cursor,3),'duracion':round(d,3)})
        rutas.append((destino,toma['pausa_ms']))
        cursor += d+toma['pausa_ms']/1000
    lista=tomas/'_lista.txt';silencios={}
    def entrada(path): return "file '"+path.as_posix().replace("'", "'\\''")+"'\n"
    contenido=''
    for path,pausa in rutas:
        contenido+=entrada(path)
        if pausa>0:
            if pausa not in silencios:
                sil=tomas/f'_pausa_{len(silencios):04d}.wav'
                ffmpeg('-f','lavfi','-i','anullsrc=r=44100:cl=mono','-t',pausa/1000,sil)
                silencios[pausa]=sil
            contenido+=entrada(silencios[pausa])
    lista.write_text(contenido,encoding='utf-8')
    mezcla=salida.with_suffix('.wav')
    ffmpeg('-f','concat','-safe',0,'-i',lista,'-c','copy',mezcla)
    lista.unlink()
    for path in silencios.values(): path.unlink()
    if a.mp3: ffmpeg('-i',mezcla,'-b:a','192k',salida.with_suffix('.mp3'))
    parametros.update(job=job['id'],lang=a.lang)
    salida.with_suffix('.json').write_text(json.dumps({'mezcla':str(mezcla),'duracion':round(duracion(mezcla),3),
        'tomas':info,'identidades':plan['identidades'],'parametros':parametros,'plan':str(plan_path),
        'revision_interpretacion':'pendiente_escucha'},ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'OK · {len(info)} tomas · {duracion(mezcla):.1f} s · {mezcla}')
    if a.revisar:
        api(f"/api/jobs/{job['id']}/review",{})
        for _ in range(60):
            reviewed=api('/api/jobs/'+job['id'])
            if reviewed.get('review_status') in ('completed','failed'): break
            time.sleep(3)
        try: print(api(f"/api/jobs/{job['id']}/files/review.json",raw=True).decode('utf-8')[:3000])
        except Exception as exc: print('Revisión no disponible:',exc)
    print('Revisa de oído identidad, emoción y pronunciación. Whisper comprueba palabras, no la actuación.')


# ───────────────────────── nueva-voz ─────────────────────────
def cmd_nueva(a):
    import especificaciones as S
    cat = cargar(); voces = todas(cat)
    desc, texto, lang = a.desc, a.texto, a.lang
    if a.base:
        if a.base not in voces: die("Base desconocida.")
        b = voces[a.base]; lang = b["lang"]
        desc = b["desc"]
        if a.emocion:
            e = next((x for x in S.EMOCIONES if x["clave"] == a.emocion), None)
            if not e: die("Emoción desconocida: " + ", ".join(x["clave"] for x in S.EMOCIONES))
            desc = f"{desc} {e[lang]}"
        if a.extra: desc += " " + a.extra
        texto = texto or b["texto"]
    if not desc or not texto or len(texto) < 30: die("Hacen falta --desc (o --base) y --texto de al menos 30 caracteres.")
    servidor()
    j = api("/api/voices/design", {"name": f"VB {a.nombre}", "language": lang, "accent": a.acento, "description": desc, "text": texto, "seed": a.semilla})
    j = esperar(j["id"], "diseño de voz")
    v = j["new_voice"]
    clave = a.clave or "".join(c if c.isalnum() else "_" for c in a.nombre.lower()).strip("_")
    cat.setdefault("personalizadas", {})[clave] = dict(clave=clave, nombre=a.nombre, lang=lang, voice_id=v["id"], seed=a.semilla, desc=desc, texto=texto,
                                                      familia="Personalizada", uso=a.uso or "Creada a medida", muestra="", duracion=v.get("duration"))
    CATALOGO.write_text(json.dumps(cat, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Voz creada: clave «{clave}» · id {v['id']} · {v.get('duration')} s. Pruébala con:  python locutor.py decir --voz {clave} --texto \"...\"")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    s = p.add_subparsers(dest="cmd", required=True)
    l = s.add_parser("listar"); l.add_argument("--lang"); l.add_argument("--familia"); l.add_argument("--buscar")
    l.add_argument("--bilingue", action="store_true"); l.add_argument("--emociones", action="store_true"); l.add_argument("--solo-favoritas", action="store_true"); l.set_defaults(f=cmd_listar)
    d = s.add_parser("decir"); d.add_argument("--voz"); d.add_argument("--lang", default="es")
    entrada = d.add_mutually_exclusive_group(required=True)
    entrada.add_argument("--texto"); entrada.add_argument("--archivo"); entrada.add_argument("--plan")
    d.add_argument("--motor", choices=["auto","qwen-base-1.7b","cosyvoice3-0.5b"], default="auto")
    d.add_argument("--emocion"); d.add_argument("--intencion"); d.add_argument("--direccion")
    d.add_argument("--preparar", action="store_true", help="Guardar el plan sin contactar con el estudio ni sintetizar")
    d.add_argument("--velocidad", type=float, default=1.0); d.add_argument("--acelerar", type=float, default=1.0)
    d.add_argument("--fx"); d.add_argument("--semilla", type=int, default=11); d.add_argument("--pausa", type=int, default=250)
    d.add_argument("--salida"); d.add_argument("--revisar", action="store_true"); d.add_argument("--mp3", action="store_true"); d.set_defaults(f=cmd_decir)
    n = s.add_parser("nueva-voz"); n.add_argument("--nombre", required=True); n.add_argument("--desc"); n.add_argument("--texto")
    n.add_argument("--lang", default="es"); n.add_argument("--acento", default="España, neutro"); n.add_argument("--semilla", type=int, default=7)
    n.add_argument("--base"); n.add_argument("--emocion"); n.add_argument("--extra"); n.add_argument("--clave"); n.add_argument("--uso"); n.set_defaults(f=cmd_nueva)
    s.add_parser("favoritas").set_defaults(f=cmd_favoritas)
    f = s.add_parser("fx-lista"); f.set_defaults(f=lambda a: print("\n".join(f"{k:<10} {v}" for k, v in FX.items())))
    a = p.parse_args(); a.f(a)


if __name__ == "__main__":
    main()
