"""Genera (o completa) la Biblioteca de Voces con Local Voice Studio (Qwen3-TTS VoiceDesign).

    C:\\Herramientas\\local-voice-studio\\.venv\\Scripts\\python.exe -I generar_biblioteca.py [--only CLAVE ...] [--force] [--sin-bilingue]

Qué hace (reanuda: lo que ya está hecho se salta):
  1. Diseña todas las voces pendientes de especificaciones.py con el modelo cargado UNA vez (diseno_lote.py).
  2. CONTROL DE CALIDAD de cada toma (analizar_voces.py): texto bien leído (Whisper), género correcto por tono,
     sibilancia («sss») tras el de-esser y claridad. Si falla, reintenta con otra semilla y descripción reforzada
     (hasta --rondas); si ninguna pasa se queda con la mejor y la marca «revisar».
  3. Aplica el acabado (recorte de silencios + de-esser), la registra en el catálogo del estudio (prefijo «VB»)
     y exporta la muestra mp3 (-16 LUFS) + wav.
  4. Prueba de bilingüismo: clona cada arquetipo en el OTRO idioma (ES↔EN) y lo valida con Whisper.
  5. Escribe catalogo_voces.json (fuente de verdad); construir_indices.py genera los índices a partir de él.
Requiere el servidor del estudio SOLO para consultar voces; la síntesis va por el motor Qwen directamente.
No clona ni imita a nadie: todo se diseña por descripción.
"""
import argparse, json, re, shutil, subprocess, sys, unicodedata
from difflib import SequenceMatcher
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import especificaciones as S  # noqa: E402
import analizar_voces as AV  # noqa: E402

STUDIO = Path(r"C:\Herramientas\local-voice-studio")
LIB = HERE.parent
CATALOGO = HERE / "catalogo_voces.json"
TMP = Path(r"C:\Herramientas\_work\voces_tmp")  # fuera de Drive (escrituras rápidas y sin sincronizar)
PY_QWEN = STUDIO / ".venv-qwen" / "Scripts" / "python.exe"
PREFIJO = "VB"
sys.path.insert(0, str(STUDIO))


def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9ñ ]+", "", s).strip()


_whisper = None


def leer(wav, lang):
    global _whisper
    if _whisper is None:
        from faster_whisper import WhisperModel
        from voice_studio.config import model_path
        _whisper = WhisperModel(str(model_path("whisper-small")), device="cpu", compute_type="int8", cpu_threads=8, local_files_only=True)
    segs, _ = _whisper.transcribe(str(wav), language=lang, beam_size=1)
    return " ".join(s.text for s in segs).strip()


def parecido(a, b):
    return round(SequenceMatcher(None, slug(a), slug(b)).ratio(), 2)


def lote(modo, items, nombre):
    """Lanza el motor Qwen una vez para todos los items; devuelve {id: ok}."""
    if not items:
        return {}
    TMP.mkdir(parents=True, exist_ok=True)
    fichero = TMP / f"lote_{nombre}.json"
    fichero.write_text(json.dumps({"modo": modo, "salida": str(TMP / modo), "items": items}, ensure_ascii=False), encoding="utf-8")
    print(f"→ lote {modo}: {len(items)} tomas", flush=True)
    p = subprocess.Popen([str(PY_QWEN), str(HERE / "diseno_lote.py"), str(fichero)], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, encoding="utf-8")
    res = {}
    for linea in p.stdout:
        try:
            r = json.loads(linea)
        except ValueError:
            continue
        res[r["id"]] = r.get("ok", False)
        print(f"   {r['id']}  {'ok' if r.get('ok') else 'FALLO ' + r.get('error', '')}", flush=True)
    p.wait()
    return res


TRIM = "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse"
DEESS = "deesser=i=0.5:m=0.5:f=0.5"  # baja 5-9 dB la sibilancia de las voces diseñadas (medido) sin apagarlas


def acabado(wav, destino):
    """Recorta silencios de los bordes y aplica el de-esser; devuelve el wav final (24 kHz, 16 bit)."""
    destino.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-af", f"{TRIM},{DEESS}", "-ar", "24000", "-ac", "1",
                    "-c:a", "pcm_s16le", str(destino)], check=True)
    return destino


def exportar(wav, mp3):
    """wav ya con acabado -> mp3 normalizado a -16 LUFS."""
    mp3.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-af",
                    f"{TRIM},loudnorm=I=-16:TP=-1.5:LRA=11",
                    "-ar", "44100", "-b:a", "160k", str(mp3)], check=True)
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp3)], capture_output=True, text=True)
    return round(float(out.stdout.strip()), 1)


# ───────────── control de calidad ─────────────
NEUTROS = {"sistema_robot", "robot_simpatico", "asmr", "en_asmr", "meditacion"}  # sin género claro o sin tono medible (susurro)


def genero_esperado(clave, desc):
    if clave in NEUTROS or clave.endswith("_susurro"):
        return None
    d = desc.lower()[:220]
    if re.search(r"\b(mujer|femenin[ao]|chica|abuela|woman|female|girl)\b", d):
        return "M"
    if re.search(r"\b(hombre|chico|masculin[ao]|abuelo|man|male|boy)\b", d):
        return "H"
    return None


def reforzar(clave, lang, desc, genero, ronda):
    """Descripción reforzada: género inequívoco + hablante nativo (sin acento extranjero) + más grave en reintentos."""
    if lang == "es":
        nat = (" Hablante nativo de español latinoamericano (México), pronunciación natural, sin ningún acento extranjero ni inglés."
               if clave.startswith("lat_") else
               " Hablante nativo de español de España, pronunciación castellana natural y fluida, sin ningún acento extranjero ni inglés.")
        g = {"H": "Voz de HOMBRE adulto, claramente masculina, de tono grave a medio (voz de varón).",
             "M": "Voz de MUJER adulta, claramente femenina.", None: ""}[genero]
        extra = " Tono bajo y profundo, de barítono." if ronda >= 2 and genero == "H" else ""
        return f"{g} {desc}{nat}{extra}".strip()
    g = {"H": "Clearly masculine adult male voice, low-to-medium pitch.", "M": "Clearly feminine adult female voice.", None: ""}[genero]
    extra = " Deep, low baritone pitch." if ronda >= 2 and genero == "H" else ""
    return f"{g} {desc}{extra}".strip()


def evaluar(wav_final, lang, texto, genero, tipo):
    """Mide la toma ya con acabado y devuelve (cumple, razones, puntuación, métricas)."""
    m = AV.analizar(wav_final, lang)
    r = parecido(m["texto"], texto)
    razones, f0 = [], m["f0"]
    if r < 0.80:
        razones.append(f"texto {r}")
    lim_h, lim_m = (175, 155) if tipo == "emociones" else (150, 158)
    if genero == "H" and f0 >= lim_h:
        razones.append(f"suena a mujer ({f0} Hz)")
    if genero == "M" and f0 <= lim_m:
        razones.append(f"suena a hombre ({f0} Hz)")
    if m["conf"] < -0.42:
        razones.append(f"poco clara (conf {m['conf']})")
    if m["sib"] > -19:
        razones.append(f"sibilante ({m['sib']} dB)")
    m["texto_ratio"] = r
    return not razones, razones, -len(razones) * 10 + m["conf"] - max(0, m["sib"] + 19) * 0.1, m


def reconstruir():
    """Regenera índices y web con lo que haya en el catálogo (se llama al final de cada ronda)."""
    try:
        subprocess.run([sys.executable, str(HERE / "construir_indices.py")], check=True, capture_output=True)
    except Exception as e:  # no es crítico
        print("   (no se pudo reconstruir la web:", str(e)[:80], ")", flush=True)


def trabajos(args):
    """Todas las voces a diseñar: (tipo, clave, nombre, lang, desc, texto, seed, spec)."""
    t = []
    for a in S.ES + S.EN:
        t.append(("arquetipos", a["clave"], a["nombre"], a["lang"], a["desc"], a["texto"], a["seed"], a))
    for lang in ("es", "en"):
        for tk, (tn, td) in S.TIMBRES[lang].items():
            for e in S.EMOCIONES:
                clave = f"{lang}_{tk}_{e['clave']}"
                nombre = f"{tn} {e['nombre']} ({lang.upper()})"
                seed = 300 + (0 if tk == "H" else 50) + (0 if lang == "es" else 500)
                t.append(("emociones", clave, nombre, lang, f"{td} {e[lang]}", S.FRASE_EMO[lang], seed,
                          dict(e, familia="Emoción", timbre=tk)))
    if args.only:
        t = [x for x in t if x[1] in args.only]
    return t


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--sin-bilingue", action="store_true")
    ap.add_argument("--rondas", type=int, default=5)
    ap.add_argument("--por-ronda", type=int, default=2, help="semillas por voz y ronda en los reintentos")
    args = ap.parse_args()
    from voice_studio.voices import import_voice
    cat = json.loads(CATALOGO.read_text(encoding="utf-8")) if CATALOGO.exists() else {}
    cat.setdefault("arquetipos", {}); cat.setdefault("emociones", {})
    guardar = lambda: CATALOGO.write_text(json.dumps(cat, ensure_ascii=False, indent=1), encoding="utf-8")

    # una entrada del catálogo sin «calidad» viene de la versión anterior (sin control): se rehace
    for sec in ("arquetipos", "emociones"):
        for k in [k for k, v in cat[sec].items() if "calidad" not in v and v.get("seed") is not None]:
            del cat[sec][k]
    pend = [x for x in trabajos(args) if args.force or x[1] not in cat[x[0]] or not (LIB / cat[x[0]][x[1]]["muestra"]).exists()]
    print(f"Pendientes de diseñar: {len(pend)}", flush=True)
    candidatos = {x[1]: [] for x in pend}  # clave -> [(puntuación, ronda, seed, wav_final, razones, métricas)]
    for ronda in range(args.rondas):
        if not pend:
            break
        gen = {x[1]: genero_esperado(x[1], x[4]) for x in pend}
        nsem = 1 if ronda == 0 else args.por_ronda   # ronda 0: la toma ya hecha; reintentos: varias semillas a la vez
        semillas = lambda x: [x[6] + ronda * 1000 + j * 100 for j in range(nsem)]
        items = [dict(id=f"{x[0]}__{x[1]}__{sd}", lang=x[3], seed=sd, texto=x[5], desc=reforzar(x[1], x[3], x[4], gen[x[1]], ronda))
                 for x in pend for sd in semillas(x)]
        lote("design", items, f"design_r{ronda}")
        siguiente = []
        for x in pend:
            tipo, clave, nombre, lang, desc, texto, seed, spec = x
            ok = False
            for s_ in semillas(x):
                crudo = TMP / "design" / f"{tipo}__{clave}__{s_}.wav"
                if not crudo.exists():
                    continue
                final = acabado(crudo, TMP / "final" / f"{tipo}__{clave}__{s_}.wav")
                ok, razones, punt, m = evaluar(final, lang, texto, gen[clave], tipo)
                print(f"   [{clave}#{ronda}] {'OK' if ok else 'FALLA: ' + ', '.join(razones)}  (f0 {m['f0']} · sib {m['sib']} · conf {m['conf']})", flush=True)
                candidatos[clave].append((punt, ronda, s_, final, razones, m))
                if ok:
                    break
            if not candidatos[clave] or (not ok and ronda < args.rondas - 1):
                siguiente.append(x); continue
            punt, rr, ss, final, razones, m = max(candidatos[clave], key=lambda c: c[0])
            carpeta = "arquetipos" if tipo == "arquetipos" else "emociones"
            mp3 = LIB / "muestras" / carpeta / f"{clave}.mp3"
            dur = exportar(final, mp3)
            shutil.copy2(final, LIB / "_wav_originales" / f"{carpeta}__{clave}.wav")
            v = import_voice(final, f"{PREFIJO} {nombre}", lang, S.LAT_ACC if clave.startswith("lat_") else (S.ES_ACC if lang == "es" else "Inglés"),
                             texto, provenance=f"Voz sintética diseñada con qwen-design-1.7b: {reforzar(clave, lang, desc, gen[clave], rr)}")
            cat[tipo][clave] = dict(clave=clave, nombre=nombre, lang=lang, voice_id=v["id"], seed=ss, desc=desc, texto=texto,
                                    duracion=dur, whisper=m["texto_ratio"], familia=spec.get("familia", ""), uso=spec.get("uso", ""),
                                    retencion=spec.get("retencion", ""), muestra=f"muestras/{carpeta}/{clave}.mp3",
                                    timbre=spec.get("timbre"), genero=gen[clave], revisar=bool(razones), motivos=razones,
                                    calidad=dict(f0=m["f0"], sib=m["sib"], conf=m["conf"], ronda=rr))
            guardar()
        pend = siguiente
        reconstruir()

    # voces que ya existían: solo catalogar + muestra
    for ex in S.EXISTENTES:
        if ex["clave"] in cat["arquetipos"] and not args.force:
            continue
        meta = json.loads((STUDIO / "data" / "voices" / ex["voice_id"] / "voice.json").read_text(encoding="utf-8"))
        wav = STUDIO / "data" / "voices" / ex["voice_id"] / "reference.wav"
        mp3 = LIB / "muestras" / "arquetipos" / f"{ex['clave']}.mp3"
        wav = acabado(wav, TMP / "final" / f"existente__{ex['clave']}.wav")
        dur = exportar(wav, mp3)
        shutil.copy2(wav, LIB / "_wav_originales" / f"arquetipos__{ex['clave']}.wav")
        cat["arquetipos"][ex["clave"]] = dict(clave=ex["clave"], nombre=ex["nombre"], lang=ex["lang"], voice_id=ex["voice_id"], seed=None,
                                              desc=meta["provenance"].split(": ", 1)[-1], texto=meta["transcript"], duracion=dur,
                                              whisper=None, familia=ex["familia"], uso=ex["uso"], retencion=ex.get("retencion", ""),
                                              muestra=f"muestras/arquetipos/{ex['clave']}.mp3", timbre=None, revisar=False)
        guardar()

    if not args.sin_bilingue:
        items = []
        for k, v in cat["arquetipos"].items():
            otro = "en" if v["lang"] == "es" else "es"
            if "bilingue" in v and not args.force:
                continue
            items.append(dict(id=f"bi__{k}__{otro}", lang=otro, seed=7, texto=S.PRUEBA_BILINGUE[otro], voice_id=v["voice_id"]))
        lote("clone", items, "bilingue")
        for k, v in cat["arquetipos"].items():
            otro = "en" if v["lang"] == "es" else "es"
            wav = TMP / "clone" / f"bi__{k}__{otro}.wav"
            if not wav.exists():
                continue
            got = leer(wav, otro)
            r = parecido(got, S.PRUEBA_BILINGUE[otro])
            mp3 = LIB / "muestras" / "bilingue" / f"{k}__{otro}.mp3"
            exportar(acabado(wav, TMP / "final" / f"bi__{k}__{otro}.wav"), mp3)
            v["bilingue"] = dict(idioma=otro, whisper=r, ok=r >= 0.75, muestra=f"muestras/bilingue/{k}__{otro}.mp3")
            print(f"   [bilingüe {k}→{otro}] {r}", flush=True)
        guardar()
    reconstruir()
    print("Hecho:", len(cat["arquetipos"]), "arquetipos,", len(cat["emociones"]), "emociones", flush=True)


if __name__ == "__main__":
    main()
