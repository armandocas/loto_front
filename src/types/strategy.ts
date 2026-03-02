import type { LotterySlug } from "./lottery";
import type { GenerationMethod, SmartFilterOptions, PersonalData } from "./game";

export interface Strategy {
  id: string;
  name: string;
  lottery: LotterySlug;
  method: GenerationMethod;
  filters?: SmartFilterOptions;
  personalData?: PersonalData;
  fixedNumbers?: number[];
  quantity: number;
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
}

export interface TeimosinhaConfig {
  strategyId: string;
  repeatCount: number;
  active: boolean;
}
