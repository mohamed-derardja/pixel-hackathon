"use client";

import React, { useState } from "react";

/**
 * Front SVGs paint the figure via an embedded PNG + transform (see public files).
 * Hit zones live in the PNG’s pixel space inside the same matrix() as that image,
 * so they track the body exactly when the outer viewBox scales.
 */

type Gender = "male" | "female";

type ZoneShape = { zone: string; d: string };

const MALE_VIEWBOX = "542 308 356 194";
const FEMALE_VIEWBOX = "0 200 810 848";

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
    d: "M 986 60 C 920 60 880 100 880 180 C 880 240 910 280 960 300 L 960 220 L 1012 220 L 1012 300 C 1062 280 1092 240 1092 180 C 1092 100 1052 60 986 60 Z",
  },
  {
    zone: "Face",
    d: "M 960 160 L 1012 160 L 1008 260 L 964 260 Z",
  },
  {
    zone: "Neck",
    d: "M 960 300 L 1012 300 L 1008 340 L 964 340 Z",
  },
  {
    zone: "Right Shoulder",
    d: "M 880 300 L 960 320 L 950 360 L 870 340 Z",
  },
  {
    zone: "Left Shoulder",
    d: "M 1012 320 L 1092 300 L 1102 340 L 1022 360 Z",
  },
  {
    zone: "Chest",
    d: "M 880 340 L 1092 340 L 1076 460 L 896 460 Z",
  },
  {
    zone: "Abdomen",
    d: "M 896 460 L 1076 460 L 1060 560 L 912 560 Z",
  },
  {
    zone: "Pelvis",
    d: "M 912 560 L 1056 560 L 1040 620 L 928 620 Z",
  },
  {
    zone: "Right Arm",
    d: "M 700 280 L 880 320 L 860 580 L 680 600 Z",
  },
  {
    zone: "Left Arm",
    d: "M 1092 320 L 1272 280 L 1292 600 L 1112 580 Z",
  },
  {
    zone: "Right Hand",
    d: "M 680 600 L 700 620 L 680 660 L 660 640 Z",
  },
  {
    zone: "Left Hand",
    d: "M 1272 600 L 1292 620 L 1312 640 L 1292 660 Z",
  },
  {
    zone: "Right Leg",
    d: "M 880 620 L 1000 620 L 985 980 L 875 980 Z",
  },
  {
    zone: "Left Leg",
    d: "M 972 620 L 1092 620 L 1097 980 L 987 980 Z",
  },
  {
    zone: "Right Knee",
    d: "M 875 980 L 985 980 L 980 1020 L 880 1020 Z",
  },
  {
    zone: "Left Knee",
    d: "M 987 980 L 1097 980 L 1092 1020 L 992 1020 Z",
  },
  {
    zone: "Right Foot",
    d: "M 880 1020 L 980 1020 L 975 1060 L 885 1060 Z",
  },
  {
    zone: "Left Foot",
    d: "M 992 1020 L 1092 1020 L 1087 1060 L 997 1060 Z",
  },
];

/**
 * Paths in PNG pixel coords. Woman front PNG is 2816x1536.
 * Based on clipPath: body visible in SVG x=0-810, y=166-1048
 * Body spans PNG x=664-2071 (center 1368), y=0-1534
 */
const femaleZones: ZoneShape[] = [
  {
    zone: "Head",
    d: "M 1368 80 C 1280 80 1200 160 1200 280 C 1200 380 1260 440 1340 480 L 1340 340 L 1396 340 L 1396 480 C 1476 440 1536 380 1536 280 C 1536 160 1456 80 1368 80 Z",
  },
  {
    zone: "Face",
    d: "M 1320 200 L 1416 200 L 1410 340 L 1326 340 Z",
  },
  {
    zone: "Neck",
    d: "M 1340 480 L 1396 480 L 1390 560 L 1346 560 Z",
  },
  {
    zone: "Right Shoulder",
    d: "M 1200 500 L 1280 530 L 1260 580 L 1180 560 Z",
  },
  {
    zone: "Left Shoulder",
    d: "M 1456 530 L 1536 500 L 1556 560 L 1476 580 Z",
  },
  {
    zone: "Chest",
    d: "M 1200 560 L 1536 560 L 1510 720 L 1226 720 Z",
  },
  {
    zone: "Abdomen",
    d: "M 1226 720 L 1510 720 L 1480 900 L 1256 900 Z",
  },
  {
    zone: "Pelvis",
    d: "M 1256 900 L 1480 900 L 1450 980 L 1286 980 Z",
  },
  {
    zone: "Right Arm",
    d: "M 880 480 L 1180 560 L 1150 1100 L 850 1160 Z",
  },
  {
    zone: "Left Arm",
    d: "M 1556 560 L 1856 480 L 1886 1160 L 1586 1100 Z",
  },
  {
    zone: "Right Hand",
    d: "M 850 1160 L 880 1180 L 860 1240 L 830 1220 Z",
  },
  {
    zone: "Left Hand",
    d: "M 1856 1180 L 1886 1160 L 1906 1220 L 1876 1240 Z",
  },
  {
    zone: "Right Leg",
    d: "M 1226 980 L 1368 980 L 1340 1450 L 1200 1450 Z",
  },
  {
    zone: "Left Leg",
    d: "M 1368 980 L 1510 980 L 1536 1450 L 1396 1450 Z",
  },
  {
    zone: "Right Knee",
    d: "M 1200 1450 L 1340 1450 L 1330 1500 L 1210 1500 Z",
  },
  {
    zone: "Left Knee",
    d: "M 1396 1450 L 1536 1450 L 1526 1500 L 1406 1500 Z",
  },
  {
    zone: "Right Foot",
    d: "M 1210 1500 L 1330 1500 L 1320 1540 L 1220 1540 Z",
  },
  {
    zone: "Left Foot",
    d: "M 1406 1500 L 1526 1500 L 1516 1540 L 1416 1540 Z",
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
              stroke={on ? "rgba(153, 27, 27, 0.95)" : "rgba(0, 0, 0, 0)"}
              strokeWidth={on ? 2.5 : 0}
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
