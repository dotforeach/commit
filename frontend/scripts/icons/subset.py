"""
Recorta Material Symbols Outlined a los íconos de scripts/icons/icons.json (conserva los ejes variables).

La fuente funciona por ligaduras ("home" → ícono). Un recorte normal que conserve las letras
conservaría TODAS las ligaduras; por eso primero se quitan de GSUB las ligaduras de íconos que no
se usan y después se recortan los glifos.

Requisitos: pip install fonttools brotli
Uso (desde frontend/):
  python scripts/icons/subset.py --available   → available.json: todos los nombres que dibuja la fuente completa
  python scripts/icons/subset.py               → recorta a icons.json
"""
import json
import string
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "node_modules/material-symbols/material-symbols-outlined.woff2"
TARGET = ROOT / "public/fonts/material-symbols-outlined-subset.woff2"
font = TTFont(SOURCE)


def ligature_names(f: TTFont) -> set[str]:
    """Textos que activan una ligadura (la fuente es la fuente de verdad: incluye alias)."""
    glyph_to_char = {glyph: chr(code) for code, glyph in f.getBestCmap().items()}
    names = set()
    for lookup in f["GSUB"].table.LookupList.Lookup:
        for st in lookup.SubTable:
            st = getattr(st, "ExtSubTable", st)
            for first, ligs in (getattr(st, "ligatures", None) or {}).items():
                for lig in ligs:
                    names.add("".join(glyph_to_char.get(g, "?") for g in [first, *lig.Component]))
    return names


if "--available" in sys.argv:
    names = sorted(n for n in ligature_names(font) if "?" not in n)
    (ROOT / "scripts/icons/available.json").write_text(json.dumps(names) + "\n")
    print(f"available.json: {len(names)} nombres")
    raise SystemExit(0)

# Nombre → glifo del ícono (un alias como "access_time" dibuja el glifo de "schedule")
glyph_to_char = {glyph: chr(code) for code, glyph in font.getBestCmap().items()}
name_to_glyph = {}
for lookup in font["GSUB"].table.LookupList.Lookup:
    for st in lookup.SubTable:
        st = getattr(st, "ExtSubTable", st)
        for first, ligs in (getattr(st, "ligatures", None) or {}).items():
            for lig in ligs:
                name_to_glyph["".join(glyph_to_char.get(g, "?") for g in [first, *lig.Component])] = lig.LigGlyph

names = set(json.loads((ROOT / "scripts/icons/icons.json").read_text()))
unknown = names - set(name_to_glyph)
if unknown:
    raise SystemExit(f"No existen en la fuente: {sorted(unknown)}")
wanted = {name_to_glyph[n] for n in names}
# 1) Quitar las ligaduras de los íconos que no se usan
for lookup in font["GSUB"].table.LookupList.Lookup:
    for st in lookup.SubTable:
        st = getattr(st, "ExtSubTable", st)
        ligatures = getattr(st, "ligatures", None)
        if ligatures is None:
            continue
        for first in list(ligatures):
            ligatures[first] = [lig for lig in ligatures[first] if lig.LigGlyph in wanted]
            if not ligatures[first]:
                del ligatures[first]

# 2) Recortar: los íconos + los caracteres que forman sus nombres
chars = string.ascii_lowercase + string.digits + "_"
options = subset.Options()
options.flavor = "woff2"
options.layout_features = ["*"]
options.notdef_outline = True
options.name_IDs = ["*"]
subsetter = subset.Subsetter(options)
subsetter.populate(glyphs=sorted(wanted), text=chars)
subsetter.subset(font)
TARGET.parent.mkdir(parents=True, exist_ok=True)
font.flavor = "woff2"
font.save(TARGET)
print(f"{len(names)} íconos ({len(wanted)} glifos) → {TARGET.relative_to(ROOT)} ({TARGET.stat().st_size / 1024:.0f} kB)")
