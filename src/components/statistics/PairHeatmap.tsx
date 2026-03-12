"use client";

import { useMemo, useState } from "react";

interface PairHeatmapProps {
  data: Array<{ pair: [number, number]; count: number; percentage: number }>;
  color: string;
  maxDisplay?: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: Number.parseInt(clean.substring(0, 2), 16),
    g: Number.parseInt(clean.substring(2, 4), 16),
    b: Number.parseInt(clean.substring(4, 6), 16),
  };
}

export function PairHeatmap({ data, color, maxDisplay = 30 }: Readonly<PairHeatmapProps>) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const rgb = useMemo(() => hexToRgb(color), [color]);

  const displayData = useMemo(() => data.slice(0, maxDisplay), [data, maxDisplay]);
  const maxCount = displayData[0]?.count ?? 1;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {displayData.map((item, i) => {
          const intensity = 0.15 + (item.count / maxCount) * 0.85;
          const isHovered = hoveredIndex === i;

          return (
            <button
              type="button"
              key={`${item.pair[0]}-${item.pair[1]}`}
              className="relative rounded-lg p-3 text-center cursor-default transition-transform hover:scale-105"
              style={{
                backgroundColor: `rgba(${rgb.r},${rgb.g},${rgb.b},${intensity})`,
                border: isHovered
                  ? `2px solid ${color}`
                  : "2px solid transparent",
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex(null)}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-sm font-bold text-white">
                  {item.pair[0].toString().padStart(2, "0")}
                </span>
                <span className="text-xs text-white/60">-</span>
                <span className="text-sm font-bold text-white">
                  {item.pair[1].toString().padStart(2, "0")}
                </span>
              </div>
              <div className="text-[11px] text-white/80 font-medium">
                {item.count}x
              </div>

              {isHovered && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium shadow-lg bg-popover text-popover-foreground border border-border">
                  {item.count} vezes ({item.percentage.toFixed(1)}%)
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>Menor frequência</span>
        <div className="flex gap-0.5">
          {[0.15, 0.3, 0.5, 0.7, 0.85, 1].map((opacity) => (
            <div
              key={opacity}
              className="w-5 h-3 rounded-sm"
              style={{ backgroundColor: `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})` }}
            />
          ))}
        </div>
        <span>Maior frequência</span>
      </div>
    </div>
  );
}
