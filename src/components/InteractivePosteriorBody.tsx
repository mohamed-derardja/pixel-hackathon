"use client";

import React, { useState } from "react";

/**
 * man_back_side.svg / women_back_side.svg: same 2457×1383 PNG + same scale;
 * only the matrix translate-y differs. Hit paths live in PNG pixel space.
 */

type Gender = "male" | "female";

type ZoneShape = { zone: string; d: string };

const VIEWBOX: Record<Gender, string> = {
  male: "155 600 500 470",
  female: "155 908 500 470",
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
    d: `M ${maleCx} 60 C 1130 60 1050 120 1050 220 C 1050 300 1090 360 1150 390 L 1150 280 L 1308 280 L 1308 390 C 1368 360 1408 300 1408 220 C 1408 120 1328 60 ${maleCx} 60 Z`,
  },
  {
    zone: "Neck",
    d: "M 1150 390 L 1308 390 L 1300 440 L 1158 440 Z",
  },
  {
    zone: "Right Shoulder",
    d: "M 1050 400 L 1120 430 L 1100 480 L 1030 450 Z",
  },
  {
    zone: "Left Shoulder",
    d: "M 1338 430 L 1408 400 L 1428 450 L 1358 480 Z",
  },
  {
    zone: "Upper Back",
    d: "M 1050 440 L 1408 440 L 1390 580 L 1068 580 Z",
  },
  {
    zone: "Lower Back",
    d: "M 1068 580 L 1390 580 L 1372 720 L 1086 720 Z",
  },
  {
    zone: "Buttocks",
    d: "M 1086 720 L 1372 720 L 1350 820 L 1108 820 Z",
  },
  {
    zone: "Right Arm",
    d: "M 860 360 L 1050 420 L 1030 750 L 840 780 Z",
  },
  {
    zone: "Left Arm",
    d: "M 1408 420 L 1598 360 L 1618 780 L 1428 750 Z",
  },
  {
    zone: "Right Hand",
    d: "M 840 780 L 860 800 L 840 840 L 820 820 Z",
  },
  {
    zone: "Left Hand",
    d: "M 1598 780 L 1618 800 L 1638 820 L 1618 840 Z",
  },
  { zone: "Right Leg", d: "M 1080 820 L 1220 820 L 1200 1280 L 1060 1280 Z" },
  { zone: "Left Leg", d: "M 1238 820 L 1378 820 L 1398 1280 L 1258 1280 Z" },
  { zone: "Right Knee", d: "M 1060 1280 L 1200 1280 L 1190 1320 L 1070 1320 Z" },
  { zone: "Left Knee", d: "M 1258 1280 L 1398 1280 L 1388 1320 L 1268 1320 Z" },
  { zone: "Right Foot", d: "M 1070 1320 L 1190 1320 L 1180 1360 L 1080 1360 Z" },
  { zone: "Left Foot", d: "M 1268 1320 L 1388 1320 L 1378 1360 L 1278 1360 Z" },
];

/**
 * Female back zones - PNG 2457x1383.
 * Female body: y-offset 908 in SVG (clipPath shows y=908-1189 visible).
 * Converted to PNG: body spans y=80-1200 approximately.
 */
const femaleZones: ZoneShape[] = [
  {
    zone: "Head",
    d: `M ${femaleCx} 80 C 1130 80 1050 140 1050 240 C 1050 320 1090 380 1150 410 L 1150 300 L 1308 300 L 1308 410 C 1368 380 1408 320 1408 240 C 1408 140 1328 80 ${femaleCx} 80 Z`,
  },
  {
    zone: "Neck",
    d: "M 1150 410 L 1308 410 L 1300 470 L 1158 470 Z",
  },
  {
    zone: "Right Shoulder",
    d: "M 1050 430 L 1120 460 L 1100 510 L 1030 480 Z",
  },
  {
    zone: "Left Shoulder",
    d: "M 1338 460 L 1408 430 L 1428 480 L 1358 510 Z",
  },
  {
    zone: "Upper Back",
    d: "M 1050 470 L 1408 470 L 1390 630 L 1068 630 Z",
  },
  {
    zone: "Lower Back",
    d: "M 1068 630 L 1390 630 L 1372 800 L 1086 800 Z",
  },
  {
    zone: "Buttocks",
    d: "M 1086 800 L 1372 800 L 1350 900 L 1108 900 Z",
  },
  {
    zone: "Right Arm",
    d: "M 860 400 L 1050 470 L 1030 820 L 840 850 Z",
  },
  {
    zone: "Left Arm",
    d: "M 1408 470 L 1598 400 L 1618 850 L 1428 820 Z",
  },
  {
    zone: "Right Hand",
    d: "M 840 850 L 860 870 L 840 910 L 820 890 Z",
  },
  {
    zone: "Left Hand",
    d: "M 1598 850 L 1618 870 L 1638 890 L 1618 910 Z",
  },
  { zone: "Right Leg", d: "M 1080 900 L 1220 900 L 1200 1160 L 1060 1160 Z" },
  { zone: "Left Leg", d: "M 1238 900 L 1378 900 L 1398 1160 L 1258 1160 Z" },
  { zone: "Right Knee", d: "M 1060 1160 L 1200 1160 L 1190 1200 L 1070 1200 Z" },
  { zone: "Left Knee", d: "M 1258 1160 L 1398 1160 L 1388 1200 L 1268 1200 Z" },
  { zone: "Right Foot", d: "M 1070 1200 L 1190 1200 L 1180 1240 L 1080 1240 Z" },
  { zone: "Left Foot", d: "M 1268 1200 L 1388 1200 L 1378 1240 L 1278 1240 Z" },
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
