from PIL import Image

def measure(sil_path):
    sil = Image.open(sil_path)
    w, h = sil.size
    rows = {}
    for y in range(h):
        xs = [x for x in range(w) if sil.getpixel((x, y)) == 0]
        if xs:
            rows[y] = (min(xs), max(xs))
    return rows

def report(name, sil_path, check_ys):
    rows = measure(sil_path)
    print(f"\n=== {name} ===")
    for y in check_ys:
        if y in rows:
            mn, mx = rows[y]
            print(f"y={y}: x={mn}-{mx}  width={mx-mn+1}  center={(mn+mx)/2:.1f}")
        else:
            print(f"y={y}: no body")
    # Also find top and bottom of body
    ys = sorted(rows.keys())
    if ys:
        print(f"body top y={ys[0]}, bottom y={ys[-1]}")
        print(f"body x-range at top: {rows[ys[0]]}")
        print(f"body x-range at bottom: {rows[ys[-1]]}")

report("man_front", "scripts/output/man_front_silhouette.png", [60,100,120,160,200,260,300,340,400,460,500,560,620,700,800,900,980,1020,1060])
report("woman_front", "scripts/output/woman_front_silhouette.png", [80,120,160,200,280,340,400,480,540,560,620,720,780,900,980,1100,1200,1280,1380,1420,1500,1535])
report("man_back", "scripts/output/man_back_silhouette.png", [60,120,200,260,300,340,390,440,500,580,620,720,780,820,900,980,1100,1200,1280,1320,1360])
report("woman_back", "scripts/output/woman_back_silhouette.png", [80,120,200,260,300,340,410,470,510,580,630,720,800,900,1000,1100,1160,1200,1240])
