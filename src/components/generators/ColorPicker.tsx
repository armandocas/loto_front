"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ColorPickerProps {
  selectedColors: string[];
  onChange: (colors: string[]) => void;
  maxColors?: number;
}

const PRESET_COLORS = [
  { hex: "#ef4444", name: "Vermelho" },
  { hex: "#f97316", name: "Laranja" },
  { hex: "#eab308", name: "Amarelo" },
  { hex: "#22c55e", name: "Verde" },
  { hex: "#06b6d4", name: "Ciano" },
  { hex: "#3b82f6", name: "Azul" },
  { hex: "#6366f1", name: "Índigo" },
  { hex: "#8b5cf6", name: "Violeta" },
  { hex: "#d946ef", name: "Magenta" },
  { hex: "#ec4899", name: "Rosa" },
  { hex: "#f5f5f5", name: "Branco" },
  { hex: "#171717", name: "Preto" },
  { hex: "#78716c", name: "Cinza" },
  { hex: "#92400e", name: "Marrom" },
  { hex: "#fbbf24", name: "Dourado" },
  { hex: "#94a3b8", name: "Prata" },
];

export function ColorPicker({ selectedColors, onChange, maxColors = 5 }: Readonly<ColorPickerProps>) {
  function toggleColor(hex: string) {
    if (selectedColors.includes(hex)) {
      onChange(selectedColors.filter((c) => c !== hex));
    } else if (selectedColors.length < maxColors) {
      onChange([...selectedColors, hex]);
    }
  }

  function removeColor(hex: string) {
    onChange(selectedColors.filter((c) => c !== hex));
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-8 gap-2">
        {PRESET_COLORS.map((color) => {
          const isSelected = selectedColors.includes(color.hex);
          const isDisabled = !isSelected && selectedColors.length >= maxColors;
          return (
            <button
              key={color.hex}
              onClick={() => toggleColor(color.hex)}
              disabled={isDisabled}
              title={color.name}
              className={`w-full aspect-square rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-cyan-400 scale-110 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                  : isDisabled
                    ? "border-white/5 opacity-30 cursor-not-allowed"
                    : "border-white/10 hover:border-white/30 hover:scale-105"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          );
        })}
      </div>

      {selectedColors.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Selecionadas:</span>
          <div className="flex gap-1.5 flex-wrap">
            {selectedColors.map((hex) => {
              const info = PRESET_COLORS.find((c) => c.hex === hex);
              return (
                <Badge
                  key={hex}
                  variant="secondary"
                  className="gap-1 pr-1 text-[10px]"
                >
                  <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: hex }} />
                  {info?.name || hex}
                  <button onClick={() => removeColor(hex)} className="ml-0.5 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground">
        Selecione {maxColors - selectedColors.length > 0 ? `até mais ${maxColors - selectedColors.length}` : "máximo atingido"} cor{maxColors - selectedColors.length !== 1 ? "es" : ""}
      </p>
    </div>
  );
}
