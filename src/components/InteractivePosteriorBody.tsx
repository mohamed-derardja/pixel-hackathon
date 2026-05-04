"use client";

import React, { useState } from "react";

/**
 * man_back_side.svg / women_back_side.svg: same 2457×1383 PNG + same scale;
 * only the matrix translate-y differs. Hit paths live in PNG pixel space.
 */

type Gender = "male" | "female";

type ZoneShape = { zone: string; d: string };

const VIEWBOX: Record<Gender, string> = {
  male: "320 590 168 266",
  female: "310 910 190 270",
};

const RASTER_TRANSFORM: Record<Gender, string> = {
  male: "matrix(0.203602, 0, 0, 0.203362, 154.726058, 579.220826)",
  female: "matrix(0.203602, 0, 0, 0.203362, 154.726058, 907.813845)",
};

const POSTERIOR_HREF: Record<Gender, string> = {
  male: "/man_back_side.svg",
  female: "/women_back_side.svg",
};

const maleCx = 1229;
const femaleCx = 1229;

/**
 * Male back zones - PNG 2457x1383.
 * Male body figure: y-offset 579 in SVG, body spans y=60-1320 in PNG.
 */
const maleZones: ZoneShape[] = [
  {
    zone: "Head",
    d: `M ${maleCx} 60 C 1085 60 1050 120 1050 220 C 969 300 1090 360 1150 390 L 1114 280 L 1343 280 L 1343 390 C 1430 360 1408 300 1408 220 C 1488 120 1328 60 ${maleCx} 60 Z`,
  },
  {
    zone: "Neck",
    d: "M 1114 390 L 1343 390 L 1331 440 L 1126 440 Z",
  },
  {
    zone: "Right Shoulder",
    d: "M 969 400 L 1070 430 L 1041 480 L 940 450 Z",
  },
  {
    zone: "Left Shoulder",
    d: "M 1387 430 L 1488 400 L 1517 450 L 1416 480 Z",
  },
  {
    zone: "Upper Back",
    d: "M 969 440 L 1488 440 L 1462 580 L 995 580 Z",
  },
  {
    zone: "Lower Back",
    d: "M 995 580 L 1462 580 L 1436 720 L 1021 720 Z",
  },
  {
    zone: "Buttocks",
    d: "M 1021 720 L 1436 720 L 1404 820 L 1053 820 Z",
  },
  {
    zone: "Right Arm",
    d: "M 749 360 L 996 420 L 970 750 L 723 780 Z",
  },
  {
    zone: "Left Arm",
    d: "M 1461 420 L 1708 360 L 1734 780 L 1487 750 Z",
  },
  {
    zone: "Right Hand",
    d: "M 723 780 L 749 800 L 723 840 L 697 820 Z",
  },
  {
    zone: "Left Hand",
    d: "M 1708 780 L 1734 800 L 1760 820 L 1734 840 Z",
  },
  { zone: "Right Leg", d: "M 1035 820 L 1217 820 L 1191 1280 L 1009 1280 Z" },
  { zone: "Left Leg", d: "M 1240 820 L 1422 820 L 1448 1280 L 1266 1280 Z" },
  { zone: "Right Knee", d: "M 1009 1280 L 1191 1280 L 1178 1320 L 1022 1320 Z" },
  { zone: "Left Knee", d: "M 1266 1280 L 1448 1280 L 1435 1320 L 1279 1320 Z" },
  { zone: "Right Foot", d: "M 1022 1320 L 1178 1320 L 1165 1360 L 1035 1360 Z" },
  { zone: "Left Foot", d: "M 1279 1320 L 1435 1320 L 1422 1360 L 1292 1360 Z" },
];

/**
 * Female back zones - PNG 2457x1383.
 * Female body: y-offset 908 in SVG (clipPath shows y=908-1189 visible).
 * Converted to PNG: body spans y=80-1200 approximately.
 */
const femaleZones: ZoneShape[] = [
  {
    zone: "Head",
    d: `M ${femaleCx} 60 C 1085 60 1050 120 1050 220 C 969 300 1090 360 1150 390 L 1114 280 L 1343 280 L 1343 390 C 1430 360 1408 300 1408 220 C 1488 120 1328 60 ${femaleCx} 60 Z`,
  },
  {
    zone: "Neck",
    d: "M 1114 390 L 1343 390 L 1331 440 L 1126 440 Z",
  },
  {
    zone: "Right Shoulder",
    d: "M 969 400 L 1070 430 L 1041 480 L 940 450 Z",
  },
  {
    zone: "Left Shoulder",
    d: "M 1387 430 L 1488 400 L 1517 450 L 1416 480 Z",
  },
  {
    zone: "Upper Back",
    d: "M 969 440 L 1488 440 L 1462 580 L 995 580 Z",
  },
  {
    zone: "Lower Back",
    d: "M 995 580 L 1462 580 L 1436 720 L 1021 720 Z",
  },
  {
    zone: "Buttocks",
    d: "M 1021 720 L 1436 720 L 1404 820 L 1053 820 Z",
  },
  {
    zone: "Right Arm",
    d: "M 749 360 L 996 420 L 970 750 L 723 780 Z",
  },
  {
    zone: "Left Arm",
    d: "M 1461 420 L 1708 360 L 1734 780 L 1487 750 Z",
  },
  {
    zone: "Right Hand",
    d: "M 723 780 L 749 800 L 723 840 L 697 820 Z",
  },
  {
    zone: "Left Hand",
    d: "M 1708 780 L 1734 800 L 1760 820 L 1734 840 Z",
  },
  { zone: "Right Leg", d: "M 1035 820 L 1217 820 L 1191 1280 L 1009 1280 Z" },
  { zone: "Left Leg", d: "M 1240 820 L 1422 820 L 1448 1280 L 1266 1280 Z" },
  { zone: "Right Knee", d: "M 1009 1280 L 1191 1280 L 1178 1320 L 1022 1320 Z" },
  { zone: "Left Knee", d: "M 1266 1280 L 1448 1280 L 1435 1320 L 1279 1320 Z" },
  { zone: "Right Foot", d: "M 1022 1320 L 1178 1320 L 1165 1360 L 1035 1360 Z" },
  { zone: "Left Foot", d: "M 1279 1320 L 1435 1320 L 1422 1360 L 1292 1360 Z" },
];

type Props = {
  gender: Gender;
  selectedZones: string[];
  onToggleZone: (zone: string) => void;
  className?: string;
};

const ZONES: Record<Gender, ZoneShape[]> = {
  male: maleZones,
  female: femaleZones,
};

export function InteractivePosteriorBody({
  gender,
  selectedZones,
  onToggleZone,
  className,
}: Props) {
  const [hoverZone, setHoverZone] = useState<string | null>(null);
  const href = POSTERIOR_HREF[gender];
  const rasterTransform = RASTER_TRANSFORM[gender];
  const zones = ZONES[gender];

  return (
    <svg
      viewBox={VIEWBOX[gender]}
      className={className}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Posterior body map — tap a region to mark injury"
    >
      <title>Posterior body map</title>
      <image
        href={href}
        x={0}
        y={0}
        width={810}
        height={1440}
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
