import re
cx = 1229

def widen(d, factor=1.45):
    out = ''
    i = 0
    while i < len(d):
        m = re.match(r'([MLC])\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)', d[i:])
        if m:
            cmd, x, y = m.group(1), float(m.group(2)), float(m.group(3))
            nx = cx + (x - cx) * factor
            out += f'{cmd} {int(nx)} {int(y)} '
            i += len(m.group(0))
        else:
            out += d[i]
            i += 1
    return out.strip()

paths = [
('Head', f'M {cx} 60 C 1130 60 1050 120 1050 220 C 1050 300 1090 360 1150 390 L 1150 280 L 1308 280 L 1308 390 C 1368 360 1408 300 1408 220 C 1408 120 1328 60 {cx} 60 Z'),
('Neck','M 1150 390 L 1308 390 L 1300 440 L 1158 440 Z'),
('Right Shoulder','M 1050 400 L 1120 430 L 1100 480 L 1030 450 Z'),
('Left Shoulder','M 1338 430 L 1408 400 L 1428 450 L 1358 480 Z'),
('Upper Back','M 1050 440 L 1408 440 L 1390 580 L 1068 580 Z'),
('Lower Back','M 1068 580 L 1390 580 L 1372 720 L 1086 720 Z'),
('Buttocks','M 1086 720 L 1372 720 L 1350 820 L 1108 820 Z'),
('Right Arm','M 860 360 L 1050 420 L 1030 750 L 840 780 Z'),
('Left Arm','M 1408 420 L 1598 360 L 1618 780 L 1428 750 Z'),
('Right Hand','M 840 780 L 860 800 L 840 840 L 820 820 Z'),
('Left Hand','M 1598 780 L 1618 800 L 1638 820 L 1618 840 Z'),
('Right Leg','M 1080 820 L 1220 820 L 1200 1280 L 1060 1280 Z'),
('Left Leg','M 1238 820 L 1378 820 L 1398 1280 L 1258 1280 Z'),
('Right Knee','M 1060 1280 L 1200 1280 L 1190 1320 L 1070 1320 Z'),
('Left Knee','M 1258 1280 L 1398 1280 L 1388 1320 L 1268 1320 Z'),
('Right Foot','M 1070 1320 L 1190 1320 L 1180 1360 L 1080 1360 Z'),
('Left Foot','M 1268 1320 L 1388 1320 L 1378 1360 L 1278 1360 Z'),
]

limbs = {'Right Arm','Left Arm','Right Hand','Left Hand','Right Leg','Left Leg','Right Knee','Left Knee','Right Foot','Left Foot'}

print('// Male back')
for name,d in paths:
    f = 1.3 if name in limbs else 1.45
    print(f'  {{ zone: "{name}", d: "{widen(d, f)}" }},')

print()
print('// Female back')
for name,d in paths:
    f = 1.3 if name in limbs else 1.45
    print(f'  {{ zone: "{name}", d: "{widen(d, f)}" }},')
