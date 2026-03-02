"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getLorenzTrajectory } from "@/lib/generators/quantum-resonance";

interface QuantumControlsProps {
  seed: string;
  onSeedChange: (seed: string) => void;
  intensity: number;
  onIntensityChange: (intensity: number) => void;
}

export function QuantumControls({
  seed,
  onSeedChange,
  intensity,
  onIntensityChange,
}: Readonly<QuantumControlsProps>) {
  const trajectory = useMemo(() => {
    return getLorenzTrajectory(seed || "sorte", intensity, 150);
  }, [seed, intensity]);

  const width = 300;
  const height = 120;

  const xVals = trajectory.map((p) => p.x);
  const zVals = trajectory.map((p) => p.z);
  const xMin = Math.min(...xVals);
  const xMax = Math.max(...xVals);
  const zMin = Math.min(...zVals);
  const zMax = Math.max(...zVals);
  const xRange = xMax - xMin || 1;
  const zRange = zMax - zMin || 1;

  const points = trajectory
    .map((p) => {
      const px = ((p.x - xMin) / xRange) * (width - 20) + 10;
      const py = height - (((p.z - zMin) / zRange) * (height - 20) + 10);
      return `${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="space-y-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 rounded-xl bg-background/30 border border-white/5">
        <polyline
          fill="none"
          stroke="url(#quantumGrad)"
          strokeWidth={1}
          strokeOpacity={0.8}
          points={points}
        />
        <defs>
          <linearGradient id="quantumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        {trajectory.length > 0 && (() => {
          const last = trajectory[trajectory.length - 1];
          const cx = ((last.x - xMin) / xRange) * (width - 20) + 10;
          const cy = height - (((last.z - zMin) / zRange) * (height - 20) + 10);
          return <circle cx={cx} cy={cy} r={3} fill="#06b6d4" />;
        })()}
      </svg>

      <div className="space-y-2">
        <Label htmlFor="quantumSeed">Frase Semente</Label>
        <Input
          id="quantumSeed"
          placeholder="Ex: minha sorte, universo, energia..."
          value={seed}
          onChange={(e) => onSeedChange(e.target.value)}
          className="bg-background/50 border-white/10"
        />
        <p className="text-[10px] text-muted-foreground">
          A frase define as condições iniciais do sistema caótico
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Intensidade do Caos</Label>
          <span className="text-xs font-mono text-cyan-400">{intensity}/10</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={intensity}
          onChange={(e) => onIntensityChange(Number.parseInt(e.target.value))}
          className="w-full accent-cyan-500"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Suave</span>
          <span>Caótico</span>
        </div>
      </div>
    </div>
  );
}
