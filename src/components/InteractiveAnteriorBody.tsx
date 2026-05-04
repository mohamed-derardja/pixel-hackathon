"use client";

import React, { useState } from "react";

/**
 * Front SVGs paint the figure via an embedded PNG + transform (see public files).
 * Hit zones live in the PNG’s pixel space inside the same matrix() as that image,
 * so they track the body exactly when the outer viewBox scales.
 */

type Gender = "male" | "female";

type ZoneShape = { zone: string; d: string };

const MALE_VIEWBOX = "640 308 160 194";
const FEMALE_VIEWBOX = "80 180 650 868";

/** Same transform as `<g … transform="matrix(…)">` wrapping the body `<image>` in man_front_side_v2.svg */
const MALE_RASTER_TRANSFORM =
  "matrix(0.180654, 0, 0, 0.18053, 542.027451, 308.00495)";
/** Same transform as in women_front_side_correct.svg (first body image) */
const FEMALE_RASTER_TRANSFORM =
  "matrix(0.575284, 0, 0, 0.574707, -381.630066, 165.774638)";

/**
 * Paths in PNG pixel coords. Man front PNG is 1972x1076.
 * Body figure spans approx x=680-1292, y=60-1020.
 * Patient's right = smaller x (viewer's left).
 */
const maleZones: ZoneShape[] = [
  {
    zone: "Head",
    d: "M 979 118 L 952 135 L 947 171 L 938 175 L 955 220 L 954 241 L 925 260 L 1046 260 L 1017 238 L 1021 204 L 1034 179 L 1026 171 L 1023 141 L 992 118 Z",
  },
  {
    zone: "Face",
    d: "M 946 160 L 938 182 L 951 205 L 954 241 L 925 260 L 1046 260 L 1017 238 L 1021 204 L 1034 179 L 1026 160 Z",
  },
  {
    zone: "Neck",
    d: "M 925 260 L 876 280 L 855 320 L 1117 320 L 1098 282 L 1046 260 Z",
  },
  {
    zone: "Right Shoulder",
    d: "M 900 280 L 960 300 L 950 360 L 860 340 Z",
  },
  {
    zone: "Left Shoulder",
    d: "M 1012 300 L 1072 280 L 1102 340 L 1012 360 Z",
  },
  {
    zone: "Chest",
    d: "M 855 320 L 857 356 L 827 460 L 1145 460 L 1126 412 L 1115 357 L 1117 320 Z",
  },
  {
    zone: "Abdomen",
    d: "M 827 460 L 812 545 L 783 580 L 1190 580 L 1160 545 L 1145 460 Z",
  },
  {
    zone: "Pelvis",
    d: "M 783 580 L 777 590 L 794 592 L 787 630 L 798 631 L 800 639 L 896 640 L 902 680 L 1070 680 L 1075 640 L 1173 639 L 1173 631 L 1186 630 L 1178 592 L 1195 590 L 1190 580 Z",
  },
  {
    zone: "Right Arm",
    d: "M 700 300 L 855 340 L 783 620 L 660 640 Z",
  },
  {
    zone: "Left Arm",
    d: "M 1272 300 L 1117 340 L 1189 620 L 1312 640 Z",
  },
  {
    zone: "Right Hand",
    d: "M 660 640 L 783 620 L 750 700 L 640 700 Z",
  },
  {
    zone: "Left Hand",
    d: "M 1312 640 L 1189 620 L 1220 700 L 1330 700 Z",
  },
  {
    zone: "Right Leg",
    d: "M 898 660 L 911 718 L 905 825 L 924 913 L 923 955 L 904 987 L 924 993 L 947 991 L 958 967 L 953 907 L 966 834 L 960 776 L 976 660 Z",
  },
  {
    zone: "Left Leg",
    d: "M 994 660 L 1012 777 L 1006 833 L 1018 897 L 1014 968 L 1029 993 L 1068 986 L 1048 952 L 1047 921 L 1067 825 L 1060 741 L 1073 660 Z",
  },
  {
    zone: "Right Knee",
    d: "M 917 880 L 924 951 L 904 987 L 924 993 L 947 991 L 958 967 L 957 880 Z",
  },
  {
    zone: "Left Knee",
    d: "M 1016 880 L 1014 968 L 1029 993 L 1068 986 L 1048 952 L 1055 880 Z",
  },
  {
    zone: "Right Foot",
    d: "M 922 940 L 923 955 L 904 987 L 924 993 L 943 993 L 952 985 L 957 940 Z",
  },
  {
    zone: "Left Foot",
    d: "M 1014 940 L 1014 968 L 1029 993 L 1068 986 L 1050 958 L 1049 940 Z",
  },
];

/**
 * Paths in PNG pixel coords. Woman front PNG is 2816x1536.
 * Based on clipPath: body visible in SVG x=0-810, y=166-1048
 * Body spans PNG x=664-2071 (center 1409), y=169-1420
 */
const femaleZones: ZoneShape[] = [
  {
    zone: "Head",
    d: "M 1400 169 L 1376 177 L 1359 193 L 1348 222 L 1349 249 L 1340 254 L 1347 285 L 1372 325 L 1367 360 L 1449 360 L 1444 326 L 1475 269 L 1460 198 L 1440 177 L 1416 169 Z",
  },
  {
    zone: "Face",
    d: "M 1349 220 L 1349 249 L 1341 251 L 1340 264 L 1372 325 L 1367 360 L 1449 360 L 1444 326 L 1476 263 L 1474 250 L 1467 249 L 1467 220 Z",
  },
  {
    zone: "Neck",
    d: "M 1367 360 L 1350 376 L 1284 397 L 1261 413 L 1247 445 L 1242 520 L 1574 520 L 1568 442 L 1554 412 L 1532 397 L 1480 383 L 1449 360 Z",
  },
  {
    zone: "Right Shoulder",
    d: "M 1245 480 L 1320 500 L 1300 560 L 1225 540 Z",
  },
  {
    zone: "Left Shoulder",
    d: "M 1490 500 L 1571 480 L 1591 540 L 1510 560 Z",
  },
  {
    zone: "Chest",
    d: "M 1242 520 L 1231 594 L 1206 657 L 1185 760 L 1631 760 L 1609 653 L 1585 594 L 1574 520 Z",
  },
  {
    zone: "Abdomen",
    d: "M 1185 760 L 1177 785 L 1148 808 L 1128 840 L 1150 844 L 1138 892 L 1156 893 L 1158 907 L 1275 908 L 1291 980 L 1525 980 L 1542 907 L 1660 906 L 1660 894 L 1679 891 L 1666 843 L 1689 840 L 1669 809 L 1639 785 L 1631 760 Z",
  },
  {
    zone: "Pelvis",
    d: "M 1291 980 L 1310 1049 L 1310 1100 L 1507 1100 L 1507 1049 L 1525 980 Z",
  },
  {
    zone: "Right Arm",
    d: "M 1245 480 L 1310 520 L 1260 920 L 1155 920 Z",
  },
  {
    zone: "Left Arm",
    d: "M 1490 520 L 1571 480 L 1661 920 L 1550 920 Z",
  },
  {
    zone: "Right Hand",
    d: "M 1155 920 L 1260 920 L 1240 1000 L 1130 1000 Z",
  },
  {
    zone: "Left Hand",
    d: "M 1550 920 L 1661 920 L 1640 1000 L 1530 1000 Z",
  },
  {
    zone: "Right Leg",
    d: "M 1310 1100 L 1301 1180 L 1331 1308 L 1332 1361 L 1305 1409 L 1348 1420 L 1369 1409 L 1375 1383 L 1369 1279 L 1383 1194 L 1376 1120 L 1381 1100 Z",
  },
  {
    zone: "Left Leg",
    d: "M 1436 1100 L 1441 1121 L 1434 1192 L 1448 1284 L 1442 1380 L 1447 1408 L 1461 1420 L 1512 1409 L 1485 1362 L 1488 1295 L 1516 1177 L 1507 1100 Z",
  },
  {
    zone: "Right Knee",
    d: "M 1325 1280 L 1332 1361 L 1305 1409 L 1348 1420 L 1369 1409 L 1375 1383 L 1369 1280 Z",
  },
  {
    zone: "Left Knee",
    d: "M 1447 1280 L 1442 1380 L 1447 1408 L 1461 1420 L 1512 1409 L 1485 1362 L 1492 1280 Z",
  },
  {
    zone: "Right Foot",
    d: "M 1332 1360 L 1305 1409 L 1348 1420 L 1370 1407 L 1372 1360 Z",
  },
  {
    zone: "Left Foot",
    d: "M 1446 1360 L 1446 1405 L 1461 1420 L 1512 1409 L 1485 1360 Z",
  },
];

type Props = {
  gender: Gender;
  selectedZones: string[];
  onToggleZone: (zone: string) => void;
  className?: string;
};

export function InteractiveAnteriorBody({
  gender,
  selectedZones,
  onToggleZone,
  className,
}: Props) {
  const [hoverZone, setHoverZone] = useState<string | null>(null);
  const male = gender === "male";
  const viewBox = male ? MALE_VIEWBOX : FEMALE_VIEWBOX;
  const w = male ? 1440 : 810;
  const h = male ? 810 : 1440;
  const href = male ? "/man_front_side_v2.svg" : "/women_front_side_correct.svg";
  const rasterTransform = male ? MALE_RASTER_TRANSFORM : FEMALE_RASTER_TRANSFORM;
  const zones = male ? maleZones : femaleZones;

  return (
    <svg
      viewBox={viewBox}
      className={className}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Anterior body map — tap a region to mark injury"
    >
      <title>Anterior body map</title>
      <image
        href={href}
        x={0}
        y={0}
        width={w}
        height={h}
        preserveAspectRatio="xMidYMid meet"
        pointerEvents="none"
      />
      <g transform={rasterTransform} pointerEvents="auto">
        {zones.map(({ zone, d }) => {
          const on = selectedZones.includes(zone);
          const hover = hoverZone === zone;
          const fill = on
            ? "rgba(220, 38, 38, 0.42)"
            : hover
              ? "rgba(248, 113, 113, 0.22)"
              : "transparent";
          return (
            <path
              key={zone}
              d={d}
              fill={fill}
              stroke={on ? "rgba(153, 27, 27, 0.95)" : "rgba(255, 0, 0, 0.35)"}
              strokeWidth={on ? 2.5 : 1}
              vectorEffect="nonScalingStroke"
              className="cursor-pointer outline-none transition-[fill,stroke] duration-150"
              onMouseEnter={() => setHoverZone(zone)}
              onMouseLeave={() => setHoverZone(null)}
              onClick={(e) => {
                e.stopPropagation();
                onToggleZone(zone);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggleZone(zone);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={on}
              aria-label={zone}
            />
          );
        })}
      </g>
    </svg>
  );
}
