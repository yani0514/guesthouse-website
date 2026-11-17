"""Reproducible responsive AVIF/WebP/JPEG assets; never upscale or alter colours."""
from pathlib import Path
from PIL import Image, ImageOps
import json

root = Path(__file__).resolve().parents[1]
records = json.loads((root / 'scripts/photo-records.json').read_text(encoding='utf-8'))
manifest = []
for prefix, slug, category, bg, en in records:
    matches = list((root / 'assets-source').glob(prefix + '*.jpg'))
    if len(matches) != 1:
        raise ValueError(f'Expected exactly one source for {prefix}')
    source = matches[0]
    folder = root / 'public/images' / category
    folder.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as original:
        im = ImageOps.exif_transpose(original).convert('RGB')
        widths = sorted(set([w for w in (480, 768, 960, 1600, 2048) if w <= im.width] + [im.width]))
        for width in widths:
            resized = im.resize((width, round(im.height * width / im.width)), Image.Resampling.LANCZOS)
            for ext in ('webp', 'jpg'):
                resized.save(folder / f'{slug}-{width}.{ext}', quality=80 if ext == 'webp' else 84, **({'method': 6} if ext == 'webp' else {'optimize': True, 'progressive': True}))
            resized.save(folder / f'{slug}-{width}.avif', quality=52, speed=6)
        manifest.append({'id': slug, 'source': source.name, 'category': category, 'width': im.width, 'height': im.height, 'alt': {'bg': bg, 'en': en}, 'widths': widths})
        if prefix == '749879147':
            ImageOps.fit(im, (1200,630), method=Image.Resampling.LANCZOS, centering=(0.5,0.42)).save(root / 'public/social.jpg', quality=88, optimize=True)
(root / 'src/data').mkdir(parents=True, exist_ok=True)
(root / 'src/data/images.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
total = sum(p.stat().st_size for p in (root / 'public/images').rglob('*') if p.is_file())
print(f'Processed {len(manifest)} images; {total:,} bytes across all AVIF/WebP/JPEG variants; no upscaling.')
