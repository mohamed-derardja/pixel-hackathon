from PIL import Image
import io, base64, re, os, sys

def extract_png_from_svg(svg_path):
    with open(svg_path, 'r', encoding='utf-8') as f:
        content = f.read()
    m = re.search(r'xlink:href="data:image/png;base64,([^"]+)"', content)
    if not m:
        m = re.search(r'href="data:image/png;base64,([^"]+)"', content)
    if not m:
        print(f'No PNG found in {svg_path}')
        return None
    data = base64.b64decode(m.group(1))
    img = Image.open(io.BytesIO(data))
    return img

os.makedirs('scripts/output', exist_ok=True)

files = [
    ('man_front', 'public/man_front_side_v2.svg'),
    ('woman_front', 'public/women_front_side_correct.svg'),
    ('man_back', 'public/man_back_side.svg'),
    ('woman_back', 'public/women_back_side.svg'),
]

for name, path in files:
    img = extract_png_from_svg(path)
    if img:
        print(f'{name}: {img.size}, mode={img.mode}')
        img.save(f'scripts/output/{name}_extracted.png')
        gray = img.convert('L')
        pixels = list(gray.getdata())
        minv, maxv = min(pixels), max(pixels)
        print(f'  min={minv}, max={maxv}')
        # Invert if needed - body should be dark
        threshold = (minv + maxv) // 2
        sil = gray.point(lambda p: 0 if p < threshold else 255)
        sil.save(f'scripts/output/{name}_silhouette.png')
        bbox = sil.getbbox()
        print(f'  bbox={bbox}')
        # Find center of mass for x-separation (left/right)
        width, height = sil.size
        left_count = 0
        right_count = 0
        for y in range(height):
            for x in range(width // 2):
                if sil.getpixel((x, y)) == 0:
                    left_count += 1
            for x in range(width // 2, width):
                if sil.getpixel((x, y)) == 0:
                    right_count += 1
        print(f'  left_pixels={left_count}, right_pixels={right_count}')
