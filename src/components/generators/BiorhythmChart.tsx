"use client";

import { useMemo } from "react";
import { getBiorhythmState } from "@/lib/generators/biorhythm";
import { Badge } from "@/components/ui/badge";

interface BiorhythmChartProps {
  birthDate: string;
}

export function BiorhythmChart({ birthDate }: Readonly<BiorhythmChartProps>) {
  const state = useMemo(() => {
    if (!birthDate) return null;
    return getBiorhythmState(birthDate);
  }, [birthDate]);

  if (!state) return null;

  const cycles = [
    { name: "Físico", value: state.physical, color: "#ef4444", period: "23 dias" },
    { name: "Emocional", value: state.emotional, color: "#3b82f6", period: "28 dias" },
    { name: "Intelectual", value: state.intellectual, color: "#22c55e", period: "33 dias" },
  ];

  const width = 300;
  const height = 80;
  const midY = height / 2;
  const amplitude = height / 2 - 8;

  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20 rounded-lg bg-background/30">
        <line x1={0} y1={midY} x2={width} y2={midY} stroke="currentColor" strokeOpacity={0.1} strokeDasharray="4 4" />
        {cycles.map((cycle, idx) => {
          const points: string[] = [];
          for (let x = 0; x <= width; x += 2) {
            const dayOffset = (x / width) * 60 - 30;
            const day = state.days + dayOffset;
            const period = [23, 28, 33][idx];
            const y = midY - Math.sin((2 * Math.PI * day) / period) * amplitude;
            points.push(`${x},${y.toFixed(1)}`);
          }
          const nowX = width / 2;
          const nowY = midY - cycle.value * amplitude;
          return (
            <g key={cycle.name}>
              <polyline fill="none" stroke={cycle.color} strokeWidth={1.5} strokeOpacity={0.7} points={points.join(" ")} />
              <circle cx={nowX} cy={nowY} r={4} fill={cycle.color} />
            </g>
          );
        })}
        <line x1={width / 2} y1={4} x2={width / 2} y2={height - 4} stroke="currentColor" strokeOpacity={0.2} strokeDasharray="2 2" />
        <text x={width / 2 + 4} y={12} fontSize={8} fill="currentColor" fillOpacity={0.4}>hoje</text>
      </svg>

      <div className="grid grid-cols-3 gap-2">
        {cycles.map((cycle) => {
          const pct = Math.round(((cycle.value + 1) / 2) * 100);
          const label = cycle.value > 0.3 ? "Alto" : cycle.value < -0.3 ? "Baixo" : "Neutro";
          return (
            <div key={cycle.name} className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cycle.color }} />
                <span className="text-[10px] font-medium">{cycle.name}</span>
              </div>
              <p className="text-lg font-bold" style={{ color: cycle.color }}>{pct}%</p>
              <Badge variant="outline" className="text-[8px]">{label} - {cycle.period}</Badge>
            </div>
          );
        })}
      </div>

      {state.isGoldenDay && (
        <div className="text-center p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <span className="text-xs font-medium text-yellow-400">Dia de Ouro - Todos os ciclos positivos!</span>
        </div>
      )}
    </div>
  );
}
