"""Safely preserve all JPEG sources and generate numbered contact sheets."""
from pathlib import Path
import hashlib, json, zipfile
from PIL import Image, ImageOps, ImageDraw

root = Path(__file__).resolve().parents[1]
archive = root.parent / '484869484_625542066980375_4221876088234509443_n.zip'
items = []
with zipfile.ZipFile(archive) as z:
    for entry in z.infolist():
        if entry.is_dir():
            continue
        p = Path(entry.filename)
        if p.is_absolute() or '..' in p.parts or p.suffix.lower() not in ('.jpg', '.jpeg'):
            raise ValueError(f'Unexpected archive entry: {entry.filename}')
        destination = root / 'assets-source' / p.name
        if destination.exists() and destination.read_bytes() != z.read(entry):
            raise ValueError(f'Conflicting source: {p.name}')
        destination.write_bytes(z.read(entry))
        with Image.open(destination) as source:
            oriented = ImageOps.exif_transpose(source)
            items.append({'file': p.name, 'width': oriented.width, 'height': oriented.height,
                          'bytes': destination.stat().st_size, 'sha256': hashlib.sha256(destination.read_bytes()).hexdigest()})
items.sort(key=lambda x: x['file'])
(root / 'docs' / 'image-inventory.json').write_text(json.dumps(items, indent=2), encoding='utf-8')
for start in range(0, len(items), 6):
    sheet = Image.new('RGB', (1500, 1080), '#f4f0e5')
    draw = ImageDraw.Draw(sheet)
    for idx, item in enumerate(items[start:start+6]):
        with Image.open(root / 'assets-source' / item['file']) as im:
            thumb = ImageOps.contain(ImageOps.exif_transpose(im), (480, 470))
            x, y = (idx % 3) * 500 + 10, (idx // 3) * 540 + 10
            sheet.paste(thumb, (x + (480-thumb.width)//2, y))
            draw.text((x, y+475), f"{start+idx+1:02} | {item['file'].split('_')[0]} | {item['width']}x{item['height']}", fill='#252a26')
    sheet.save(root / 'docs' / f'contact-sheet-{start//6+1}.jpg', quality=90)
print(json.dumps(items, indent=2))
