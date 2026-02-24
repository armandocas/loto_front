import type { LotterySlug } from "./lottery";

export type GenerationMethod =
  | "random"
  | "frequency"
  | "hot-cold"
  | "statistical"
  | "smart-filter"
  | "ai";

export interface GeneratedGame {
  id: string;
  lottery: LotterySlug;
  numbers: number[];
  extraNumbers?: number[];
  method: GenerationMethod;
  createdAt: string;
  saved: boolean;
}

export interface SmartFilterOptions {
  evenOddRatio?: { even: number; odd: number };
  sumRange?: { min: number; max: number };
  includeNumbers?: number[];
  excludeNumbers?: number[];
  consecutiveMax?: number;
  decadeDistribution?: Record<string, number>;
}

export interface GenerationRequest {
  lottery: LotterySlug;
  method: GenerationMethod;
  quantity: number;
  filters?: SmartFilterOptions;
}

export interface SavedGame extends GeneratedGame {
  userId: string;
  contestTarget?: number;
  notes?: string;
}
