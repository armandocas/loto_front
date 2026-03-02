"use client";

import { useMemo } from "react";
import { getLunarState } from "@/lib/generators/lunar";
import { Badge } from "@/components/ui/badge";

export function LunarPhaseDisplay() {
  const lunar = useMemo(() => getLunarState(), []);

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-background/30 border border-white/5">
      <div className="text-5xl">{lunar.phaseEmoji}</div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{lunar.phaseName}</p>
        <p className="text-xs text-muted-foreground">
          Dia {lunar.dayOfCycle + 1} do ciclo lunar
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">
            Iluminação: {Math.round(lunar.illumination * 100)}%
          </Badge>
        </div>
      </div>
      <div className="ml-auto">
        <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden relative">
          <div
            className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-100"
            style={{ opacity: lunar.illumination }}
          />
          <div
            className="absolute inset-0 bg-slate-900"
            style={{
              clipPath: `inset(0 ${lunar.illumination * 100}% 0 0)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
