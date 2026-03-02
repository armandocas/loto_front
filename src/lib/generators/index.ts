import type { LotteryConfig, LotteryResult } from "@/types/lottery";
import type {
  GenerationMethod,
  SmartFilterOptions,
  GeneratedGame,
  PersonalData,
} from "@/types/game";
import { generateRandom, generateRandomExtra } from "./random";
import { generateByFrequency } from "./frequency";
import { generateHotCold } from "./hot-cold";
import { generateStatistical } from "./statistical";
import { generateWithFilter } from "./smart-filter";
import { generateByZodiac, getZodiacFromDate } from "./zodiac";
import { generateByNumerology } from "./numerology";
import { generateByBirthday } from "./birthday";
import { generateByPersonalProfile } from "./personal-profile";
import { generateByBiorhythm } from "./biorhythm";
import { generateByDream } from "./dream";
import { generateByLunar } from "./lunar";
import { generateByColorSynesthesia } from "./color-synesthesia";
import { generateByEntropy } from "./moment-entropy";
import { generateByGeoEnergy, getGeoFallback } from "./geo-energy";
import { generateByTemporal } from "./temporal-intelligence";
import { generateByQuantumResonance } from "./quantum-resonance";

interface GenerateOptions {
  config: LotteryConfig;
  method: GenerationMethod;
  quantity: number;
  results?: LotteryResult[];
  frequencyMap?: Record<number, number>;
  filters?: SmartFilterOptions;
  personalData?: PersonalData;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateNumbers(opts: Omit<GenerateOptions, "quantity">): number[] {
  const { config, method, results = [], frequencyMap = {}, personalData } = opts;

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

    case "zodiac": {
      const sign =
        personalData?.zodiacSign ||
        (personalData?.birthDate
          ? getZodiacFromDate(personalData.birthDate)
          : "aries");
      return generateByZodiac(config, sign);
    }
    case "numerology":
      return generateByNumerology(config, personalData?.fullName || "Sorte");
    case "birthday": {
      const dates: string[] = [];
      if (personalData?.birthDate) dates.push(personalData.birthDate);
      if (personalData?.specialDates) dates.push(...personalData.specialDates);
      return dates.length > 0
        ? generateByBirthday(config, dates)
        : generateRandom(config);
    }
    case "personal-profile":
      return personalData
        ? generateByPersonalProfile(config, personalData)
        : generateRandom(config);

    case "biorhythm":
      return personalData?.birthDate
        ? generateByBiorhythm(config, personalData.birthDate)
        : generateRandom(config);
    case "dream":
      return personalData?.dreamText?.trim()
        ? generateByDream(config, personalData.dreamText)
        : generateRandom(config);
    case "lunar":
      return generateByLunar(config);
    case "color-synesthesia":
      return personalData?.selectedColors && personalData.selectedColors.length > 0
        ? generateByColorSynesthesia(config, personalData.selectedColors)
        : generateRandom(config);
    case "moment-entropy":
      return personalData?.entropyData && personalData.entropyData.length >= 20
        ? generateByEntropy(config, personalData.entropyData)
        : generateRandom(config);
    case "geo-energy": {
      const coords = personalData?.geoCoords || getGeoFallback();
      return generateByGeoEnergy(config, coords);
    }
    case "temporal":
      return generateByTemporal(config);
    case "quantum-resonance":
      return generateByQuantumResonance(
        config,
        personalData?.quantumSeed || "sorte",
        personalData?.chaosIntensity || 5
      );

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
