"use client";

import { useState, useCallback } from "react";
import { generateGames } from "@/lib/generators";
import { useGameStore } from "@/stores/game.store";
import { MOCK_RESULTS, getMockFrequency } from "@/mocks/results";
import type { LotteryConfig } from "@/types/lottery";
import type { GenerationMethod, GeneratedGame, SmartFilterOptions } from "@/types/game";

interface UseGameGeneratorOptions {
  config: LotteryConfig;
}

export function useGameGenerator({ config }: UseGameGeneratorOptions) {
  const [games, setGames] = useState<GeneratedGame[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { addGeneratedGames, saveGame } = useGameStore();

  const generate = useCallback(
    (method: GenerationMethod, quantity: number, filters?: SmartFilterOptions) => {
      setIsGenerating(true);
      try {
        const results = MOCK_RESULTS[config.slug] || [];
        const frequencyMap = getMockFrequency(config.slug);

        const newGames = generateGames({
          config,
          method,
          quantity,
          results,
          frequencyMap,
          filters,
        });

        setGames(newGames);
        addGeneratedGames(newGames);
        return newGames;
      } finally {
        setIsGenerating(false);
      }
    },
    [config, addGeneratedGames]
  );

  const save = useCallback(
    (game: GeneratedGame) => {
      saveGame(game);
      setGames((prev) =>
        prev.map((g) => (g.id === game.id ? { ...g, saved: true } : g))
      );
    },
    [saveGame]
  );

  const clear = useCallback(() => {
    setGames([]);
  }, []);

  return {
    games,
    isGenerating,
    generate,
    save,
    clear,
  };
}
