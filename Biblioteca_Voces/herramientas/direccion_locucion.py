"""Plan vocal: identidad fija por personaje y dirección separada del texto hablado.

No carga modelos ni cambia el catálogo. CosyVoice Instruct2 recibe la dirección
en un canal separado; Qwen Base conserva la referencia pero no aplica `style`.
"""
import json
import math
from pathlib import Path


def _texto(value, campo, requerido=True):
    if not isinstance(value, str) or (requerido and not value.strip()):
        raise ValueError(f"{campo}: se esperaba texto{' no vacío' if requerido else ''}.")
    return value.strip()


def _numero(value, campo, bajo, alto):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(f"{campo}: se esperaba un número.")
    if not math.isfinite(value) or not bajo <= value <= alto:
        raise ValueError(f"{campo}: debe estar entre {bajo} y {alto}.")
    return value


def _sin_duplicados(pares):
    resultado = {}
    for clave, valor in pares:
        if clave in resultado:
            raise ValueError(f"Clave duplicada en el plan: {clave}.")
        resultado[clave] = valor
    return resultado


def preparar(args, voces):
    """Validar y construir el proyecto sin red, GPU ni cambios de identidad."""
    plan_path = getattr(args, 'plan', None)
    archivo, texto = getattr(args, 'archivo', None), getattr(args, 'texto', None)
    if sum(x is not None for x in (plan_path, archivo, texto)) != 1:
        raise ValueError('Usa una sola entrada: --plan, --archivo o --texto.')
    _numero(args.pausa, '--pausa', 0, 30000)
    _numero(args.velocidad, '--velocidad', 0.7, 1.3)
    _numero(args.acelerar, '--acelerar', 0.5, 2.0)
    _numero(args.semilla, '--semilla', 0, 2**32-1)
    if not isinstance(args.semilla, int):
        raise ValueError('--semilla debe ser un entero.')

    globales = {k: getattr(args, k, '') or '' for k in ('emocion', 'intencion', 'direccion')}
    asignaciones, tomas = {}, []
    nombre = 'locutor'
    if plan_path:
        if getattr(args, 'voz', None):
            raise ValueError('--plan fija las voces por personaje; no lo combines con --voz.')
        plan = json.loads(Path(plan_path).read_text(encoding='utf-8-sig'), object_pairs_hook=_sin_duplicados)
        if not isinstance(plan, dict):
            raise ValueError('El plan debe ser un objeto JSON.')
        desconocidos = set(plan)-{'nombre', 'personajes', 'tomas'}
        if desconocidos:
            raise ValueError('Campos desconocidos del plan: '+', '.join(sorted(desconocidos)))
        nombre = _texto(plan.get('nombre', 'locutor'), 'nombre')
        personajes = plan.get('personajes')
        if not isinstance(personajes, dict) or not personajes:
            raise ValueError('El plan necesita personajes con una voz fija cada uno.')
        for personaje, datos in personajes.items():
            _texto(personaje, 'personaje')
            if len(personaje) > 60 or not isinstance(datos, dict) or set(datos) != {'voz'}:
                raise ValueError(f'{personaje}: usa un nombre de hasta 60 caracteres y un objeto con "voz".')
            asignaciones[personaje] = _texto(datos['voz'], f'{personaje}.voz')
        entradas = plan.get('tomas')
        if not isinstance(entradas, list) or not 1 <= len(entradas) <= 10000:
            raise ValueError('El plan necesita entre 1 y 10000 tomas.')
        campos = {'id', 'personaje', 'texto', 'emocion', 'intencion', 'intensidad', 'direccion', 'ritmo', 'pausa_ms', 'idioma'}
        for n, entrada in enumerate(entradas, 1):
            if not isinstance(entrada, dict):
                raise ValueError(f'Toma {n}: se esperaba un objeto.')
            if set(entrada)-campos:
                raise ValueError(f'Toma {n}: campos no permitidos; la voz se fija en personajes, no por emoción o por toma.')
            personaje = _texto(entrada.get('personaje'), f'Toma {n}.personaje')
            if personaje not in asignaciones:
                raise ValueError(f'Toma {n}: personaje sin voz asignada: {personaje}.')
            tomas.append(dict(entrada, personaje=personaje, voz=asignaciones[personaje]))
    else:
        entradas = Path(archivo).read_text(encoding='utf-8-sig').splitlines() if archivo else [texto]
        for raw in entradas:
            raw = _texto(raw, 'Texto de la toma', requerido=False)
            if not raw or (archivo and raw.startswith('#')):
                continue
            voz = getattr(args, 'voz', None)
            if archivo and raw.startswith('['):
                voz, cierre, raw = raw[1:].partition(']')
                if not cierre:
                    raise ValueError('Falta ] en la etiqueta de voz del guion.')
                voz, raw = voz.strip(), raw.strip()
            if not voz:
                raise ValueError('Falta --voz o la etiqueta [clave_voz] del guion.')
            asignaciones[voz] = voz
            tomas.append(dict(personaje=voz, voz=voz, texto=raw,
                              emocion=globales['emocion'] or 'neutral',
                              intencion=globales['intencion'], direccion=globales['direccion']))
        if not tomas:
            raise ValueError('El guion no contiene frases para sintetizar.')

    identidades = {}
    for personaje, clave in asignaciones.items():
        if clave not in voces or not voces[clave].get('voice_id'):
            raise ValueError(f'Voz desconocida o sin identificador: {clave}. Usa listar.')
        identidades[personaje] = {'voz': clave, 'voice_id': voces[clave]['voice_id']}

    normalizadas, ids = [], set()
    for n, toma in enumerate(tomas, 1):
        etiqueta = f'Toma {n}'
        txt = _texto(toma.get('texto'), etiqueta+'.texto')
        if len(txt) > 10000:
            raise ValueError(f'{etiqueta}: divide el texto en escenas más cortas.')
        emocion = _texto(toma.get('emocion'), etiqueta+'.emocion')
        intencion = _texto(toma.get('intencion', ''), etiqueta+'.intencion', requerido=bool(plan_path))
        direccion = _texto(toma.get('direccion', ''), etiqueta+'.direccion', requerido=False)
        intensidad = _numero(toma.get('intensidad', 0.5), etiqueta+'.intensidad', 0, 1)
        ritmo = _numero(toma.get('ritmo', 1.0), etiqueta+'.ritmo', 0.7, 1.3)
        pausa = _numero(toma.get('pausa_ms', args.pausa), etiqueta+'.pausa_ms', 0, 30000)
        idioma = _texto(toma.get('idioma', args.lang), etiqueta+'.idioma')
        ident = _texto(toma.get('id', f'{n:04d}'), etiqueta+'.id')
        if ident in ids or len(ident) > 80:
            raise ValueError(f'{etiqueta}: id repetido o demasiado largo.')
        ids.add(ident)
        estilo = ''
        if plan_path or intencion or direccion or emocion != 'neutral':
            estilo = f'Emoción solicitada: {emocion}; intensidad: {intensidad}; intención: {intencion}; dirección: {direccion}'
        if len(estilo) > 2000:
            raise ValueError(f'{etiqueta}: acorta la dirección a menos de 2000 caracteres.')
        personaje, voz = toma['personaje'], toma['voz']
        normalizadas.append({'id':ident, 'n':n, 'personaje':personaje, 'voz':voz,
            'voice_id':identidades[personaje]['voice_id'], 'texto':txt, 'idioma':idioma,
            'emocion':emocion, 'intencion':intencion, 'intensidad':intensidad, 'direccion':direccion,
            'ritmo':ritmo, 'pausa_ms':pausa, 'style':estilo,
            'semilla_sintesis':(args.semilla+n-1) % 2**32})
    usados = {t['personaje'] for t in normalizadas}
    identidades = {k:v for k,v in identidades.items() if k in usados}
    motor = getattr(args, 'motor', 'auto')
    if motor == 'auto':
        motor = 'cosyvoice3-0.5b' if plan_path or any(t['style'] for t in normalizadas) else 'qwen-base-1.7b'
    if motor not in ('cosyvoice3-0.5b', 'qwen-base-1.7b'):
        raise ValueError('Motor no compatible con locutor: '+str(motor))
    proyecto = {'name':nombre, 'engine':motor, 'mode':'segments',
        'voices':{k:v['voice_id'] for k,v in identidades.items()},
        'settings':{'seed':args.semilla, 'max_tokens':4096, 'speed':args.velocidad},
        'segments':[{'id':t['id'], 'speaker':t['personaje'], 'language':t['idioma'],
                     'text':t['texto'], 'start':0, 'pause_ms':t['pausa_ms'], 'style':t['direccion'],
                     'emotion':t['emocion'], 'emotion_intensity':t['intensidad'], 'intention':t['intencion']}
                    for t in normalizadas]}
    return {'version':1, 'estado':'preparado_sin_sintesis', 'identidades':identidades,
        'canal_direccion':'CosyVoice Instruct2' if motor.startswith('cosyvoice') else 'No aplicado por Qwen Base',
        'revision_interpretacion':'pendiente_escucha',
        'limite_motor':'La misma referencia no garantiza identidad perceptiva idéntica ni emoción exacta. CosyVoice recibe instrucciones por frase; Qwen Base no las aplica. Revisar timbre, pronunciación e interpretación antes del montaje.',
        'tomas':normalizadas, 'project':proyecto}
