"use client";

import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LOTTERIES } from "@/constants/lotteries";
import type { GeneratedGame, CheckedResult } from "@/types/game";

interface GameResultCardProps {
  game: GeneratedGame;
  result: CheckedResult;
}

export function GameResultCard({ game, result }: GameResultCardProps) {
  const config = LOTTERIES[game.lottery];
  const hitSet = new Set(result.hits);

  return (
    <Card className="glass border-white/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            {config.name} - Concurso {result.contestNumber}
          </CardTitle>
          <Badge
            variant={result.hitCount > 0 ? "default" : "secondary"}
            className="text-xs"
          >
            {result.hitCount} acerto{result.hitCount !== 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {game.numbers.map((num, i) => {
            const isHit = hitSet.has(num);
            return (
              <span
                key={`${num}-${i}`}
                className={`w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  isHit
                    ? "bg-green-500 text-white ring-2 ring-green-400 scale-110"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {num.toString().padStart(2, "0")}
              </span>
            );
          })}
        </div>
        {result.prize && (
          <div className="flex items-center gap-1 text-green-400 text-sm font-medium">
            <Check className="h-4 w-4" />
            Faixa: {result.prize}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
