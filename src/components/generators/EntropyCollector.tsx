"use client";

import { useCallback, useRef } from "react";
import { Zap } from "lucide-react";
import { collectMouseEntropy, getEntropyProgress, isEntropyReady } from "@/lib/generators/moment-entropy";

interface EntropyCollectorProps {
  entropyData: number[];
  onChange: (data: number[]) => void;
}

export function EntropyCollector({ entropyData, onChange }: Readonly<EntropyCollectorProps>) {
  const lastCollect = useRef(0);
  const progress = getEntropyProgress(entropyData);
  const ready = isEntropyReady(entropyData);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const now = performance.now();
      if (now - lastCollect.current < 50) return;
      lastCollect.current = now;

      const rect = e.currentTarget.getBoundingClientRect();
      const updated = collectMouseEntropy(
        { clientX: e.clientX - rect.left, clientY: e.clientY - rect.top },
        entropyData
      );
      onChange(updated);
    },
    [entropyData, onChange]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const updated = collectMouseEntropy(
        { clientX: e.clientX - rect.left, clientY: e.clientY - rect.top },
        entropyData
      );
      onChange([...updated, performance.now() * 31337]);
    },
    [entropyData, onChange]
  );

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(e as unknown as React.MouseEvent); }}
        className={`relative h-36 rounded-xl border cursor-crosshair overflow-hidden transition-all ${
          ready
            ? "border-cyan-500/30 bg-cyan-500/5"
            : "border-white/10 bg-background/30"
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {ready ? (
            <div className="text-center space-y-2">
              <Zap className="h-8 w-8 mx-auto text-cyan-400" />
              <p className="text-xs text-cyan-400 font-medium">
                Energia coletada! Pronto para gerar
              </p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <Zap className="h-8 w-8 mx-auto text-muted-foreground animate-pulse" />
              <p className="text-xs text-muted-foreground">
                Mova o mouse e clique aqui para coletar energia
              </p>
            </div>
          )}
        </div>

        {entropyData.map((val, i) => {
          const x = (Math.abs(val * 7919) % 100);
          const y = (Math.abs(val * 104729) % 100);
          const size = 2 + (Math.abs(val) % 3);
          const opacity = 0.2 + (i / entropyData.length) * 0.6;
          return (
            <div
              key={`${i}-${val}`}
              className="absolute rounded-full bg-cyan-400"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                opacity,
              }}
            />
          );
        })}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Energia coletada</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground">
          {entropyData.length} amostras de {20} necessárias
        </p>
      </div>
    </div>
  );
}
