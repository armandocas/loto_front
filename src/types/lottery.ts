export type LotterySlug =
  | "maismilionaria"
  | "megasena"
  | "lotofacil"
  | "quina"
  | "lotomania"
  | "timemania"
  | "duplasena"
  | "federal"
  | "diadesorte"
  | "supersete";

export interface LotteryNumberConfig {
  min: number;
  max: number;
  pick: number;
  pickMax?: number;
}

export interface LotteryConfig {
  name: string;
  slug: LotterySlug;
  numbers: LotteryNumberConfig;
  extraNumbers?: LotteryNumberConfig;
  color: string;
  gradient: string;
  description: string;
  prizeDescription: string;
  drawDays: string[];
  price: number;
}

export interface LotteryResult {
  id: string;
  lottery: LotterySlug;
  contestNumber: number;
  date: string;
  numbers: number[];
  extraNumbers?: number[];
  prizes: Prize[];
  accumulated: boolean;
  accumulatedValue?: number;
  nextEstimate?: number;
}

export interface Prize {
  tier: string;
  winners: number;
  value: number;
}

export interface LotteryStatistics {
  lottery: LotterySlug;
  totalContests: number;
  numberFrequency: Record<number, number>;
  lastUpdated: string;
}
