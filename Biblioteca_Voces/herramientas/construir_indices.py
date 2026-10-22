"""Regenera los índices de la Biblioteca de Voces a partir de catalogo_voces.json.

    python construir_indices.py

Genera (en la carpeta Biblioteca_Voces):
  INDICE_VOCES.md              índice compacto para agentes (qué voces hay, clave, idioma, para qué)
  01_CATALOGO_ARQUETIPOS.md    ficha larga: descripción de diseño, frase de ejemplo, uso, por qué engancha
  02_PALETA_EMOCIONES.md       matriz emoción × timbre × idioma, con enlaces a las muestras
  Escuchar_Voces.html          página para escuchar todas las muestras con filtros (abrir con doble clic)
"""
import html, json, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
LIB = HERE.parent
sys.path.insert(0, str(HERE))
import especificaciones as S  # noqa: E402

cat = json.loads((HERE / "catalogo_voces.json").read_text(encoding="utf-8"))
arq, emo, per = cat.get("arquetipos", {}), cat.get("emociones", {}), cat.get("personalizadas", {})
FAMILIAS = ["Narradores", "Energía y marketing", "Humor y personaje", "Íntimas y ambiente", "Español latino", "Inglés", "Personalizada"]
LANG = {"es": "ES", "en": "EN"}


def idiomas(v):
    return "ES+EN" if v.get("bilingue", {}).get("ok") else LANG[v["lang"]]


def por_familia(d):
    out = {}
    for v in d.values():
        out.setdefault(v.get("familia", "Otras"), []).append(v)
    return [(f, out[f]) for f in FAMILIAS if f in out] + [(f, x) for f, x in out.items() if f not in FAMILIAS]


def escribir(nombre, texto):
    (LIB / nombre).write_text(texto, encoding="utf-8")


# ─────────── INDICE_VOCES.md (para agentes) ───────────
L = ["---", "title: Índice de voces (para agentes)", "status: active", "tags: [project/workspace-launcher, marketing, video, voz]", "---", "",
     "# Índice de voces — Biblioteca de Voces", "",
     "> Generado por `herramientas/construir_indices.py` desde `herramientas/catalogo_voces.json` (fuente de verdad: ahí están el `voice_id`, la descripción de diseño y la semilla).",
     "> **Todas son voces sintéticas diseñadas por descripción; no imitan ni clonan a nadie.** Muestras: `muestras/…` (mp3) o abre `Escuchar_Voces.html`.", "",
     "> **Antes de elegir:** lee [FAVORITAS.md](FAVORITAS.md): son las voces que el usuario marcó con ⭐ en la web. Si alguna encaja con el encargo, úsala.", "",
     "## Cómo usarlas (resumen)", "",
     "```powershell", "$py = 'C:\\Herramientas\\local-voice-studio\\.venv\\Scripts\\python.exe'   # vale cualquier Python 3",
     f"$h  = '{HERE}'",
     "& $py \"$h\\locutor.py\" listar --lang es --buscar documental", "& $py \"$h\\locutor.py\" decir --voz doc_naturaleza --texto \"Aquí, en su hábitat natural…\" --salida C:\\ruta\\locucion",
     "& $py \"$h\\locutor.py\" decir --archivo guion.txt --lang es --fx radio --salida C:\\ruta\\locucion   # varias voces con [clave] por línea", "```", "",
     "Salida: `locucion.wav` (mezcla), `locucion_tomas\\0001.wav…` (una por línea) y `locucion.json` (inicio/duración de cada toma para sincronizar en Remotion). Detalle en la skill `.agents/skills/voces-locucion/SKILL.md`.", "",
     f"**{len(arq)} arquetipos · {len(emo)} voces de la paleta de emociones" + (f" · {len(per)} personalizadas" if per else "") + "**.", "",
     "- **Bilingüe (ES+EN)** = el timbre se clonó en el otro idioma y Whisper confirmó que lee bien el texto. «ES» o «EN» = solo verificada en su idioma (puede funcionar en el otro; revisa la toma).",
     "- **Continuidad**: una voz fija por personaje; emoción e intención por toma. La paleta no es un selector de estados de la misma identidad.", "", "- **Emociones**: claves `{es|en}_{H|M}_{emoción}` (H = timbre de hombre, M = mujer). Ver la sección final.", ""]
for fam, voces in por_familia({**arq, **per}):
    L += [f"## {fam}", "", "| Clave | Voz | Idioma | Para qué |", "| --- | --- | --- | --- |"]
    for v in sorted(voces, key=lambda x: (x["lang"], x["nombre"])):
        L.append(f"| `{v['clave']}` | {v['nombre']} | {idiomas(v)} | {v.get('uso', '')} |")
    L.append("")
L += ["## Paleta de emociones — muestras de interpretación", "",
      "Claves: `es_H_alegre`, `es_M_grito`, `en_H_sarcasmo`… Emociones disponibles: " + ", ".join(f"`{e['clave']}`" for e in S.EMOCIONES) + ".", "",
      "| Emoción | Mejor para |", "| --- | --- |"]
L += [f"| `{e['clave']}` — {e['nombre']} | {e['uso']} |" for e in S.EMOCIONES]
L += ["", "Cómo se combinan voz y emoción: ver [04_EXPRESIVIDAD_Y_PERSONALIZACION.md](04_EXPRESIVIDAD_Y_PERSONALIZACION.md). Qué elegir según el vídeo: [03_GUIA_VOZ_SEGUN_VIDEO.md](03_GUIA_VOZ_SEGUN_VIDEO.md)."]
escribir("INDICE_VOCES.md", "\n".join(L) + "\n")

# ─────────── 01_CATALOGO_ARQUETIPOS.md ───────────
L = ["---", "title: Catálogo de arquetipos de voz", "status: active", "tags: [project/workspace-launcher, marketing, video, voz]", "---", "",
     "# Catálogo de arquetipos de voz", "",
     "Cada ficha: cómo se diseñó la voz (la descripción que ve el modelo), la frase de ejemplo de su muestra, para qué sirve y por qué (según hipótesis editorial, no datos medidos) mantiene la atención. Escucha todas en [Escuchar_Voces.html](Escuchar_Voces.html).", ""]
for fam, voces in por_familia({**arq, **per}):
    L += [f"## {fam}", ""]
    for v in sorted(voces, key=lambda x: (x["lang"], x["nombre"])):
        L += [f"### {v['nombre']} — `{v['clave']}` ({idiomas(v)})", "",
              f"- **Muestra:** [{v['muestra']}]({v['muestra']}) · {v.get('duracion', '?')} s" if v.get("muestra") else "- **Muestra:** (aún no generada)",
              f"- **Para qué:** {v.get('uso', '')}",
              f"- **Por qué engancha:** {v.get('retencion', '')}" if v.get("retencion") else "",
              f"- **Frase de ejemplo:** «{v.get('texto', '')}»",
              f"- **Descripción de diseño:** {v.get('desc', '')}",
              f"- **Id en el estudio:** `{v['voice_id']}`" + (f" · semilla {v['seed']}" if v.get("seed") else ""),
              (f"- **Prueba en {LANG['en' if v['lang'] == 'es' else 'es']}:** [{v['bilingue']['muestra']}]({v['bilingue']['muestra']}) (Whisper {v['bilingue']['whisper']})" if v.get("bilingue") else ""), ""]
escribir("01_CATALOGO_ARQUETIPOS.md", "\n".join(x for x in L if x is not None) + "\n")

# ─────────── 02_PALETA_EMOCIONES.md ───────────
L = ["---", "title: Paleta de emociones", "status: active", "tags: [project/workspace-launcher, marketing, video, voz]", "---", "",
     "# Paleta de emociones", "",
     "La paleta contiene muestras de estados interpretativos; sus claves pueden tener referencias e identidades distintas. No cambies de clave para cambiar la emoción de un personaje: conserva su voice_id y usa la dirección por frase. Ver [04_EXPRESIVIDAD_Y_PERSONALIZACION.md](04_EXPRESIVIDAD_Y_PERSONALIZACION.md).", "",
     f"Frases: ES «{S.FRASE_EMO['es']}» · EN «{S.FRASE_EMO['en']}»", ""]
for lang in ("es", "en"):
    L += [f"## {'Español' if lang == 'es' else 'English'}", "", "| Emoción | Hombre | Mujer | Mejor para |", "| --- | --- | --- | --- |"]
    for e in S.EMOCIONES:
        cell = lambda t: (f"[`{lang}_{t}_{e['clave']}`](muestras/emociones/{lang}_{t}_{e['clave']}.mp3)" if f"{lang}_{t}_{e['clave']}" in emo else "—")
        L.append(f"| **{e['nombre']}** | {cell('H')} | {cell('M')} | {e['uso']} |")
    L.append("")
escribir("02_PALETA_EMOCIONES.md", "\n".join(L) + "\n")

# ─────────── Escuchar_Voces.html ───────────
datos = {"arq": [dict(clave=v["clave"], nombre=v["nombre"], lang=v["lang"], idiomas=idiomas(v), familia=v.get("familia", ""), uso=v.get("uso", ""),
                      retencion=v.get("retencion", ""), texto=v.get("texto", ""), desc=v.get("desc", ""), muestra=v.get("muestra", ""),
                      bi=(v.get("bilingue", {}).get("muestra", "") if v.get("bilingue", {}).get("ok") else ""), dur=v.get("duracion"))
                 for v in list(arq.values()) + list(per.values())],
         "emo": [dict(lang=l, emocion=e["clave"], nombre=e["nombre"], uso=e["uso"],
                      H=emo.get(f"{l}_H_{e['clave']}", {}).get("muestra", ""), M=emo.get(f"{l}_M_{e['clave']}", {}).get("muestra", ""))
                 for l in ("es", "en") for e in S.EMOCIONES],
         "familias": [f for f, _ in por_familia({**arq, **per})]}
PAGINA = (HERE / "plantilla_escuchar.html").read_text(encoding="utf-8")
escribir("Escuchar_Voces.html", PAGINA.replace("__DATOS__", json.dumps(datos, ensure_ascii=False).replace("</", "<\\/")))
print(f"Índices regenerados: {len(arq)} arquetipos, {len(emo)} emociones, {len(per)} personalizadas")
