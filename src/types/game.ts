import type { LotterySlug } from "./lottery";

export type GenerationMethod =
  | "random"
  | "frequency"
  | "hot-cold"
  | "statistical"
  | "smart-filter"
  | "ai"
  | "zodiac"
  | "numerology"
  | "birthday"
  | "personal-profile"
  | "biorhythm"
  | "dream"
  | "lunar"
  | "color-synesthesia"
  | "moment-entropy"
  | "geo-energy"
  | "temporal"
  | "quantum-resonance";

export interface GenerationAudit {
  seed?: string;
  timestamp: string;
  entropy?: string;
  method: GenerationMethod;
}

export interface CheckedResult {
  gameId: string;
  contestNumber: number;
  hits: number[];
  hitCount: number;
  prize?: string;
}

export interface GeneratedGame {
  id: string;
  lottery: LotterySlug;
  numbers: number[];
  extraNumbers?: number[];
  method: GenerationMethod;
  createdAt: string;
  saved: boolean;
  audit?: GenerationAudit;
  checkedResults?: CheckedResult[];
}

export interface SmartFilterOptions {
  evenOddRatio?: { even: number; odd: number };
  sumRange?: { min: number; max: number };
  includeNumbers?: number[];
  excludeNumbers?: number[];
  consecutiveMax?: number;
  decadeDistribution?: Record<string, number>;
}

export type ZodiacSign =
  | "aries"
  | "touro"
  | "gemeos"
  | "cancer"
  | "leao"
  | "virgem"
  | "libra"
  | "escorpiao"
  | "sagitario"
  | "capricornio"
  | "aquario"
  | "peixes";

export interface PersonalData {
  fullName?: string;
  birthDate?: string;
  zodiacSign?: ZodiacSign;
  specialDates?: string[];
  luckyPhrase?: string;
  dreamText?: string;
  selectedColors?: string[];
  quantumSeed?: string;
  chaosIntensity?: number;
  geoCoords?: { lat: number; lng: number };
  entropyData?: number[];
}

export interface GenerationRequest {
  lottery: LotterySlug;
  method: GenerationMethod;
  quantity: number;
  filters?: SmartFilterOptions;
  personalData?: PersonalData;
}

export interface SavedGame extends GeneratedGame {
  userId: string;
  contestTarget?: number;
  notes?: string;
}
