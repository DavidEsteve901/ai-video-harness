"""Lote de síntesis con el modelo cargado UNA sola vez (no usar directamente: lo llama generar_biblioteca.py).

Se ejecuta con el Python del motor Qwen:
    C:\\Herramientas\\local-voice-studio\\.venv-qwen\\Scripts\\python.exe diseno_lote.py trabajos.json

trabajos.json = {"modo": "design"|"clone", "salida": "<carpeta>", "items": [
    {"id": "...", "lang": "es", "seed": 1, "texto": "...",
     "desc": "...(design)", "voice_id": "...(clone)"}]}
Escribe <salida>/<id>.wav y una línea JSON por item en stdout. Si el wav ya existe, lo salta.
"""
import json, sys
from pathlib import Path

STUDIO = Path(r"C:\Herramientas\local-voice-studio")
sys.path.insert(0, str(STUDIO))
from voice_studio.config import DATA, model_path, read_json  # noqa: E402

LANGS = {"es": "Spanish", "en": "English", "zh": "Chinese", "de": "German", "fr": "French",
         "it": "Italian", "pt": "Portuguese", "ja": "Japanese", "ko": "Korean", "ru": "Russian"}


def main():
    spec = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    salida = Path(spec["salida"]); salida.mkdir(parents=True, exist_ok=True)
    import numpy as np, soundfile as sf, torch
    from transformers import set_seed
    from qwen_tts import Qwen3TTSModel
    clave = "qwen-design-1.7b" if spec["modo"] == "design" else "qwen-base-1.7b"
    model = Qwen3TTSModel.from_pretrained(str(model_path(clave)), device_map="cuda", dtype=torch.bfloat16,
                                          attn_implementation="sdpa", local_files_only=True)
    prompts = {}
    for it in spec["items"]:
        destino = salida / f"{it['id']}.wav"
        if destino.exists():
            print(json.dumps({"id": it["id"], "ok": True, "reuse": True}), flush=True)
            continue
        try:
            set_seed(int(it["seed"]))
            lang = LANGS.get(it["lang"], "Auto")
            with torch.inference_mode():
                if spec["modo"] == "design":
                    wavs, sr = model.generate_voice_design(text=it["texto"], language=lang, instruct=it["desc"], max_new_tokens=4096)
                else:
                    v = it["voice_id"]
                    if v not in prompts:
                        meta = read_json(DATA / "voices" / v / "voice.json")
                        rt = meta.get("transcript", "").strip()
                        prompts[v] = model.create_voice_clone_prompt(ref_audio=str(DATA / "voices" / v / "reference.wav"),
                                                                     ref_text=rt or None, x_vector_only_mode=not bool(rt))
                    wavs, sr = model.generate_voice_clone(text=it["texto"], language=lang, voice_clone_prompt=prompts[v],
                                                          max_new_tokens=4096, non_streaming_mode=True)
            audio = np.asarray(wavs[0]).squeeze()
            if not audio.size or not np.isfinite(audio).all():
                raise RuntimeError("audio vacío")
            sf.write(destino, audio, sr, subtype="PCM_16")
            print(json.dumps({"id": it["id"], "ok": True, "seg": round(len(audio) / sr, 1)}), flush=True)
        except Exception as e:  # una toma fallida no tumba el lote
            print(json.dumps({"id": it["id"], "ok": False, "error": str(e)[:200]}), flush=True)


if __name__ == "__main__":
    main()
