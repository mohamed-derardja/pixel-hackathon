from PIL import Image

def build_path(sil_path, zones):
    sil = Image.open(sil_path)
    w, h = sil.size
    px = sil.load()
    result = {}
    for name, (y0, y1, x0, x1) in zones.items():
        pts = []
        # left edge: top to bottom
        for y in range(y0, y1 + 1):
            xs = [x for x in range(max(0, x0), min(w, x1 + 1)) if px[x, y] == 255]
            if xs:
                pts.append((min(xs), y))
        # right edge: bottom to top
        for y in range(y1, y0 - 1, -1):
            xs = [x for x in range(max(0, x0), min(w, x1 + 1)) if px[x, y] == 255]
            if xs:
                pts.append((max(xs), y))
        if not pts:
            continue
        # Deduplicate consecutive duplicate points
        clean = [pts[0]]
        for p in pts[1:]:
            if p != clean[-1]:
                clean.append(p)
        # Simplify: keep only points where direction changes
        if len(clean) < 3:
            continue
        simplified = [clean[0]]
        for i in range(1, len(clean) - 1):
            a, b, c = clean[i-1], clean[i], clean[i+1]
            if not (a[0] == b[0] == c[0] or a[1] == b[1] == c[1] or (b[0]-a[0])*(c[1]-b[1]) == (c[0]-b[0])*(b[1]-a[1])):
                simplified.append(b)
        simplified.append(clean[-1])
        d = "M " + " L ".join(f"{x} {y}" for x, y in simplified) + " Z"
        result[name] = d
    return result

def output_ts(name, paths):
    print(f"\n// {name}")
    for zone, d in paths.items():
        print(f'  {{ zone: "{zone}", d: "{d}" }},')

# Male front: center=986, body y=118..993
mf = {
    "Head": (120, 240, 0, 1972),
    "Face": (180, 260, 0, 1972),
    "Neck": (260, 320, 0, 1972),
    "Right Shoulder": (320, 380, 0, 986),
    "Left Shoulder": (320, 380, 986, 1972),
    "Chest": (340, 460, 0, 1972),
    "Abdomen": (460, 580, 0, 1972),
    "Pelvis": (580, 660, 0, 1972),
    "Right Arm": (280, 600, 0, 986),
    "Left Arm": (280, 600, 986, 1972),
    "Right Hand": (600, 680, 0, 986),
    "Left Hand": (600, 680, 986, 1972),
    "Right Leg": (660, 993, 0, 986),
    "Left Leg": (660, 993, 986, 1972),
    "Right Knee": (880, 993, 0, 986),
    "Left Knee": (880, 993, 986, 1972),
    "Right Foot": (940, 993, 0, 986),
    "Left Foot": (940, 993, 986, 1972),
}

# Female front: center=1409, body y=169..1420
ff = {
    "Head": (170, 360, 0, 2816),
    "Face": (220, 360, 0, 2816),
    "Neck": (360, 520, 0, 2816),
    "Right Shoulder": (520, 620, 0, 1409),
    "Left Shoulder": (520, 620, 1409, 2816),
    "Chest": (520, 760, 0, 2816),
    "Abdomen": (760, 980, 0, 2816),
    "Pelvis": (980, 1100, 0, 2816),
    "Right Arm": (480, 1200, 0, 1409),
    "Left Arm": (480, 1200, 1409, 2816),
    "Right Hand": (1200, 1300, 0, 1409),
    "Left Hand": (1200, 1300, 1409, 2816),
    "Right Leg": (1100, 1420, 0, 1409),
    "Left Leg": (1100, 1420, 1409, 2816),
    "Right Knee": (1280, 1420, 0, 1409),
    "Left Knee": (1280, 1420, 1409, 2816),
    "Right Foot": (1360, 1420, 0, 1409),
    "Left Foot": (1360, 1420, 1409, 2816),
}

mf_paths = build_path("scripts/output/man_front_silhouette.png", mf)
output_ts("Male Front", mf_paths)

ff_paths = build_path("scripts/output/woman_front_silhouette.png", ff)
output_ts("Female Front", ff_paths)
