"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { extractDreamKeywords } from "@/lib/generators/dream";

interface DreamInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function DreamInput({ value, onChange }: Readonly<DreamInputProps>) {
  const matches = useMemo(() => {
    if (!value || value.length < 3) return [];
    return extractDreamKeywords(value);
  }, [value]);

  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Descreva seu sonho em detalhes... Ex: 'Sonhei que estava voando sobre o mar, vi uma cobra dourada e uma casa branca na montanha'"
        rows={4}
        className="w-full rounded-xl bg-background/50 border border-white/10 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/30 placeholder:text-muted-foreground/50"
      />

      {matches.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {matches.length} símbolo{matches.length > 1 ? "s" : ""} detectado{matches.length > 1 ? "s" : ""}:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {matches.map(({ matchedWord }, i) => (
              <Badge
                key={`${matchedWord}-${i}`}
                variant="secondary"
                className="text-[10px] bg-cyan-500/10 border-cyan-500/20 text-cyan-300"
              >
                {matchedWord}
              </Badge>
            ))}
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-500"
              style={{ width: `${Math.min(matches.length / 5, 1) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            Confiança: {Math.round(Math.min(matches.length / 5, 1) * 100)}% - {matches.length >= 5 ? "Excelente" : matches.length >= 3 ? "Bom" : "Adicione mais detalhes"}
          </p>
        </div>
      )}
    </div>
  );
}
