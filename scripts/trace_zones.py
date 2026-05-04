from PIL import Image
import json

def trace_zone(sil_path, zones, name):
    sil = Image.open(sil_path)
    w, h = sil.size
    result = {}
    for zone_name, (y0, y1, x0, x1) in zones.items():
        pts = []
        # Scan top-to-bottom on left edge
        for y in range(y0, y1 + 1):
            xs = [x for x in range(max(0, x0), min(w, x1 + 1)) if sil.getpixel((x, y)) == 0]
            if xs:
                pts.append((min(xs), y))
        # Scan bottom-to-top on right edge
        for y in range(y1, y0 - 1, -1):
            xs = [x for x in range(max(0, x0), min(w, x1 + 1)) if sil.getpixel((x, y)) == 0]
            if xs:
                pts.append((max(xs), y))
        # Deduplicate and simplify
        if not pts:
            continue
        # RDP simplification
        simplified = rdp(pts, epsilon=3.0)
        # Build path
        d = "M " + " L ".join(f"{x} {y}" for x, y in simplified) + " Z"
        result[zone_name] = d
    with open(f"scripts/output/{name}_zones.json", "w") as f:
        json.dump(result, f, indent=2)
    print(f"Wrote {name}")

def rdp(points, epsilon):
    if len(points) < 3:
        return points
    def perp_dist(p, a, b):
        if a[0] == b[0] and a[1] == b[1]:
            return ((p[0]-a[0])**2 + (p[1]-a[1])**2)**0.5
        num = abs((b[1]-a[1])*p[0] - (b[0]-a[0])*p[1] + b[0]*a[1] - b[1]*a[0])
        den = ((b[1]-a[1])**2 + (b[0]-a[0])**2)**0.5
        return num / den
    start, end = points[0], points[-1]
    dmax = 0
    idx = 0
    for i in range(1, len(points)-1):
        d = perp_dist(points[i], start, end)
        if d > dmax:
            dmax, idx = d, i
    if dmax > epsilon:
        left = rdp(points[:idx+1], epsilon)
        right = rdp(points[idx:], epsilon)
        return left[:-1] + right
    return [start, end]

# Male front: 1972x1076, bbox=(777,118,1196,994)
# Center x ~987
mf_zones = {
    "Head": (60, 260, 777, 1196),
    "Face": (160, 260, 850, 1124),
    "Neck": (260, 340, 850, 1124),
    "Right Shoulder": (300, 380, 777, 987),
    "Left Shoulder": (300, 380, 987, 1196),
    "Chest": (340, 500, 777, 1196),
    "Abdomen": (500, 620, 777, 1196),
    "Pelvis": (620, 720, 777, 1196),
    "Right Arm": (260, 620, 680, 920),
    "Left Arm": (260, 620, 1054, 1294),
    "Right Hand": (620, 720, 680, 850),
    "Left Hand": (620, 720, 1124, 1294),
    "Right Leg": (720, 994, 800, 987),
    "Left Leg": (720, 994, 987, 1196),
    "Right Knee": (880, 994, 800, 987),
    "Left Knee": (880, 994, 987, 1196),
    "Right Foot": (960, 1076, 800, 987),
    "Left Foot": (960, 1076, 987, 1196),
}

# Female front: 2816x1536, bbox=(1128,169,1690,1421)
# Center x ~1409
ff_zones = {
    "Head": (80, 400, 1128, 1690),
    "Face": (200, 400, 1128, 1690),
    "Neck": (400, 540, 1128, 1690),
    "Right Shoulder": (480, 620, 1128, 1409),
    "Left Shoulder": (480, 620, 1409, 1690),
    "Chest": (540, 780, 1128, 1690),
    "Abdomen": (780, 1000, 1128, 1690),
    "Pelvis": (1000, 1100, 1128, 1690),
    "Right Arm": (480, 1200, 850, 1300),
    "Left Arm": (480, 1200, 1518, 1968),
    "Right Hand": (1200, 1300, 850, 1100),
    "Left Hand": (1200, 1300, 1718, 1968),
    "Right Leg": (1100, 1421, 1128, 1409),
    "Left Leg": (1100, 1421, 1409, 1690),
    "Right Knee": (1280, 1421, 1128, 1409),
    "Left Knee": (1280, 1421, 1409, 1690),
    "Right Foot": (1380, 1536, 1128, 1409),
    "Left Foot": (1380, 1536, 1409, 1690),
}

trace_zone("scripts/output/man_front_silhouette.png", mf_zones, "male_front")
trace_zone("scripts/output/woman_front_silhouette.png", ff_zones, "female_front")
print("Done")
