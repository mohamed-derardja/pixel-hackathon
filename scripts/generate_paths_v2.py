from PIL import Image
import math

def rdp(points, epsilon):
    if len(points) < 3:
        return points
    start, end = points[0], points[-1]
    dmax, idx = 0, 0
    for i in range(1, len(points) - 1):
        px, py = points[i]
        # perpendicular distance from point to line start-end
        num = abs((end[1]-start[1])*px - (end[0]-start[0])*py + end[0]*start[1] - end[1]*start[0])
        den = math.hypot(end[1]-start[1], end[0]-start[0])
        d = num / den if den else 0
        if d > dmax:
            dmax, idx = d, i
    if dmax > epsilon:
        left = rdp(points[:idx+1], epsilon)
        right = rdp(points[idx:], epsilon)
        return left[:-1] + right
    return [start, end]

def build_zone_path(sil_path, y0, y1, x0, x1, center_x=None, side=None):
    sil = Image.open(sil_path)
    w, h = sil.size
    px = sil.load()
    left_pts = []
    right_pts = []
    for y in range(y0, y1 + 1):
        xs = []
        for x in range(max(0, x0), min(w, x1 + 1)):
            if px[x, y] == 255:
                xs.append(x)
        if not xs:
            continue
        mn, mx = min(xs), max(xs)
        if center_x is not None and side is not None:
            if side == "left":
                mx = min(mx, center_x)
            elif side == "right":
                mn = max(mn, center_x)
        left_pts.append((mn, y))
        right_pts.insert(0, (mx, y))
    pts = left_pts + right_pts
    if len(pts) < 3:
        return None
    # Simplify
    simplified = rdp(pts, epsilon=5.0)
    if len(simplified) < 3:
        return None
    d = "M " + " L ".join(f"{x} {y}" for x, y in simplified) + " Z"
    return d

def generate_all(sil_path, zones, center_x):
    results = {}
    for name, (y0, y1, side) in zones.items():
        if side == "full":
            d = build_zone_path(sil_path, y0, y1, 0, 99999)
        elif side == "left":
            d = build_zone_path(sil_path, y0, y1, 0, center_x, center_x, "left")
        elif side == "right":
            d = build_zone_path(sil_path, y0, y1, center_x, 99999, center_x, "right")
        if d:
            results[name] = d
    return results

# Male front: center=986, body y=118..993
mf_zones = {
    "Head": (118, 260, "full"),
    "Face": (160, 260, "full"),
    "Neck": (260, 320, "full"),
    "Right Shoulder": (280, 360, "left"),
    "Left Shoulder": (280, 360, "right"),
    "Chest": (320, 460, "full"),
    "Abdomen": (460, 580, "full"),
    "Pelvis": (580, 680, "full"),
    "Right Arm": (260, 620, "left"),
    "Left Arm": (260, 620, "right"),
    "Right Hand": (600, 700, "left"),
    "Left Hand": (600, 700, "right"),
    "Right Leg": (660, 993, "left"),
    "Left Leg": (660, 993, "right"),
    "Right Knee": (880, 993, "left"),
    "Left Knee": (880, 993, "right"),
    "Right Foot": (940, 993, "left"),
    "Left Foot": (940, 993, "right"),
}

# Female front: center=1409, body y=169..1420
ff_zones = {
    "Head": (169, 360, "full"),
    "Face": (220, 360, "full"),
    "Neck": (360, 520, "full"),
    "Right Shoulder": (480, 620, "left"),
    "Left Shoulder": (480, 620, "right"),
    "Chest": (520, 760, "full"),
    "Abdomen": (760, 980, "full"),
    "Pelvis": (980, 1100, "full"),
    "Right Arm": (480, 1200, "left"),
    "Left Arm": (480, 1200, "right"),
    "Right Hand": (1180, 1300, "left"),
    "Left Hand": (1180, 1300, "right"),
    "Right Leg": (1100, 1420, "left"),
    "Left Leg": (1100, 1420, "right"),
    "Right Knee": (1280, 1420, "left"),
    "Left Knee": (1280, 1420, "right"),
    "Right Foot": (1360, 1420, "left"),
    "Left Foot": (1360, 1420, "right"),
}

print("// Male Front")
mf = generate_all("scripts/output/man_front_silhouette.png", mf_zones, 986)
for name, d in mf.items():
    print(f'  {{ zone: "{name}", d: "{d}" }},')

print("\n// Female Front")
ff = generate_all("scripts/output/woman_front_silhouette.png", ff_zones, 1409)
for name, d in ff.items():
    print(f'  {{ zone: "{name}", d: "{d}" }},')
