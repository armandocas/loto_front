"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Repeat, Calendar } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface TeimosinhaConfigProps {
  readonly enabled: boolean;
  readonly repeatCount: number;
  readonly onEnabledChange: (enabled: boolean) => void;
  readonly onRepeatCountChange: (count: number) => void;
}

export function TeimosinhaConfig({
  enabled,
  repeatCount,
  onEnabledChange,
  onRepeatCountChange,
}: TeimosinhaConfigProps) {
  return (
    <div className="space-y-3 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="teimosinha-toggle" className="flex items-center gap-2 cursor-pointer">
          <Repeat className="h-4 w-4" />
          <span className="text-sm font-medium">Teimosinha</span>
        </Label>
        <Switch
          id="teimosinha-toggle"
          checked={enabled}
          onCheckedChange={onEnabledChange}
        />
      </div>

      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            <p className="text-xs text-muted-foreground">
              Seus jogos serão repetidos por{" "}
              <span className="font-semibold text-foreground">{repeatCount}</span>{" "}
              concursos consecutivos
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Concursos</span>
                <Badge variant="outline" className="text-[10px]">
                  {repeatCount}x
                </Badge>
              </div>
              <Slider
                min={2}
                max={12}
                step={1}
                value={[repeatCount]}
                onValueChange={([val]) => onRepeatCountChange(val)}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>2</span>
                <span>12</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
              {Array.from({ length: 12 }, (_, i) => i + 1).map((dot) => (
                <motion.div
                  key={dot}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: dot <= repeatCount ? 1 : 0.6,
                    opacity: dot <= repeatCount ? 1 : 0.25,
                  }}
                  transition={{ delay: dot * 0.03, type: "spring", stiffness: 300 }}
                  className="size-3 rounded-full"
                  style={{
                    backgroundColor:
                      dot <= repeatCount
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted))",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
