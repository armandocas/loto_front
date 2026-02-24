import type { LotteryConfig, LotteryResult } from "@/types/lottery";
import type { GenerationMethod, SmartFilterOptions, GeneratedGame } from "@/types/game";
import { generateRandom, generateRandomExtra } from "./random";
import { generateByFrequency } from "./frequency";
import { generateHotCold } from "./hot-cold";
import { generateStatistical } from "./statistical";
import { generateWithFilter } from "./smart-filter";

interface GenerateOptions {
  config: LotteryConfig;
  method: GenerationMethod;
  quantity: number;
  results?: LotteryResult[];
  frequencyMap?: Record<number, number>;
  filters?: SmartFilterOptions;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateNumbers(opts: Omit<GenerateOptions, "quantity">): number[] {
  const { config, method, results = [], frequencyMap = {} } = opts;

  switch (method) {
    case "random":
      return generateRandom(config);
    case "frequency":
      return generateByFrequency(config, frequencyMap);
    case "hot-cold":
      return generateHotCold(config, results, "mixed");
    case "statistical":
      return generateStatistical(config, results);
    case "smart-filter":
      return generateWithFilter(config, opts.filters || {});
    case "ai":
      return generateRandom(config);
    default:
      return generateRandom(config);
  }
}

export function generateGames(opts: GenerateOptions): GeneratedGame[] {
  const games: GeneratedGame[] = [];

  for (let i = 0; i < opts.quantity; i++) {
    games.push({
      id: generateId(),
      lottery: opts.config.slug,
      numbers: generateNumbers(opts),
      extraNumbers: generateRandomExtra(opts.config),
      method: opts.method,
      createdAt: new Date().toISOString(),
      saved: false,
    });
  }

  return games;
}
