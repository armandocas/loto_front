"use client";

import { useMemo } from "react";
import { use } from "react";
import { motion } from "framer-motion";
import { Search, Trophy, Frown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LOTTERIES } from "@/constants/lotteries";
import { MOCK_RESULTS } from "@/mocks/results";
import { useGameStore } from "@/stores/game.store";
import { checkGameAgainstResult } from "@/lib/checkers/result-checker";
import { GameResultCard } from "@/components/games/GameResultCard";
import type { LotterySlug } from "@/types/lottery";

export default function CheckPage({
  params,
}: {
  params: Promise<{ lottery: string }>;
}) {
  const { lottery } = use(params);
  const slug = lottery as LotterySlug;
  const config = LOTTERIES[slug];
  const { savedGames, addCheckedResult } = useGameStore();

  const lotteryGames = useMemo(
    () => savedGames.filter((g) => g.lottery === slug),
    [savedGames, slug]
  );

  const latestResult = MOCK_RESULTS[slug]?.[0];

  const checkedGames = useMemo(() => {
    if (!latestResult || lotteryGames.length === 0) return [];
    return lotteryGames.map((game) => {
      const result = checkGameAgainstResult(game, latestResult);
      addCheckedResult(game.id, result);
      return { game, result };
    });
  }, [latestResult, lotteryGames]);

  const bestHit = useMemo(() => {
    if (checkedGames.length === 0) return 0;
    return Math.max(...checkedGames.map((c) => c.result.hitCount));
  }, [checkedGames]);

  if (!config) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Search className="h-8 w-8" />
          Conferir Jogos - {config.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Confira seus jogos contra o último resultado
        </p>
      </div>

      {latestResult && (
        <Card className="glass border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Último resultado - Concurso {latestResult.contestNumber}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(latestResult.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              {latestResult.accumulated && (
                <Badge className="bg-yellow-500/20 text-yellow-400">
                  ACUMULOU
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {latestResult.numbers.map((num, i) => (
                <span
                  key={`${num}-${i}`}
                  className="w-11 h-11 rounded-full text-sm font-bold flex items-center justify-center"
                  style={{
                    backgroundColor: config.color,
                    color: "white",
                  }}
                >
                  {num.toString().padStart(2, "0")}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {lotteryGames.length === 0 ? (
        <Card className="glass border-white/10">
          <CardContent className="p-12 text-center space-y-4">
            <Frown className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <div>
              <h3 className="text-lg font-semibold">Nenhum jogo salvo</h3>
              <p className="text-muted-foreground text-sm">
                Salve jogos de {config.name} para conferir automaticamente.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-3">
            {bestHit > 0 ? (
              <div className="flex items-center gap-2 text-green-400">
                <Trophy className="h-5 w-5" />
                <span className="font-medium">
                  Melhor resultado: {bestHit} acerto{bestHit !== 1 ? "s" : ""}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">
                  {checkedGames.length} jogo{checkedGames.length !== 1 ? "s" : ""}{" "}
                  conferido{checkedGames.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checkedGames
              .sort((a, b) => b.result.hitCount - a.result.hitCount)
              .map(({ game, result }) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GameResultCard game={game} result={result} />
                </motion.div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
