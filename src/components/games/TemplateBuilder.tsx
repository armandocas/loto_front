"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Lock, Shuffle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LOTTERIES } from "@/constants/lotteries";
import type { LotterySlug } from "@/types/lottery";

interface TemplateBuilderProps {
  readonly lottery: LotterySlug;
  readonly fixedNumbers: number[];
  readonly onFixedNumbersChange: (numbers: number[]) => void;
}

export function TemplateBuilder({
  lottery,
  fixedNumbers,
  onFixedNumbersChange,
}: TemplateBuilderProps) {
  const config = LOTTERIES[lottery];
  const { min, max, pick } = config.numbers;
  const maxFixed = pick - 1;

  const allNumbers = useMemo(() => {
    const nums: number[] = [];
    for (let i = min; i <= max; i++) nums.push(i);
    return nums;
  }, [min, max]);

  function toggle(n: number) {
    if (fixedNumbers.includes(n)) {
      onFixedNumbersChange(fixedNumbers.filter((x) => x !== n));
    } else if (fixedNumbers.length < maxFixed) {
      onFixedNumbersChange([...fixedNumbers, n].sort((a, b) => a - b));
    }
  }

  const wildcardCount = pick - fixedNumbers.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Números Fixos
        </h4>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] gap-1">
            <Lock className="h-3 w-3" />
            {fixedNumbers.length} fixos
          </Badge>
          <Badge variant="secondary" className="text-[10px] gap-1">
            <Shuffle className="h-3 w-3" />
            {wildcardCount} aleatórios
          </Badge>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {fixedNumbers.length} fixos de {pick} necessários — mínimo 1 curinga
      </p>

      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${Math.min(max - min + 1, 10)}, minmax(0, 1fr))`,
        }}
      >
        {allNumbers.map((n) => {
          const isFixed = fixedNumbers.includes(n);
          const isDisabled = !isFixed && fixedNumbers.length >= maxFixed;

          return (
            <motion.button
              key={n}
              type="button"
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: isFixed ? 1.05 : 1,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => !isDisabled && toggle(n)}
              disabled={isDisabled}
              className="relative aspect-square rounded-md text-xs font-semibold transition-colors flex items-center justify-center border disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isFixed ? config.color : "transparent",
                borderColor: isFixed ? config.color : "hsl(var(--border))",
                color: isFixed ? "#fff" : "hsl(var(--foreground))",
              }}
            >
              {n}
              {isFixed && (
                <motion.div
                  layoutId={`lock-${lottery}-${n}`}
                  className="absolute -top-1 -right-1 rounded-full p-0.5"
                  style={{ backgroundColor: config.color }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Lock className="h-2 w-2 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {fixedNumbers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex flex-wrap gap-1.5 pt-1"
        >
          <span className="text-[10px] text-muted-foreground self-center mr-1">
            Fixos:
          </span>
          {fixedNumbers.map((n) => (
            <Badge
              key={n}
              className="text-[10px] cursor-pointer"
              style={{ backgroundColor: config.color }}
              onClick={() => toggle(n)}
            >
              {n}
            </Badge>
          ))}
        </motion.div>
      )}
    </div>
  );
}
