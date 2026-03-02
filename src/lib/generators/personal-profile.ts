import type { LotteryConfig } from "@/types/lottery";
import type { PersonalData } from "@/types/game";
import { generateByZodiac, getZodiacFromDate } from "./zodiac";
import { getNameNumerology } from "./numerology";

export function generateByPersonalProfile(
  config: LotteryConfig,
  personalData: PersonalData
): number[] {
  const { min, max, pick } = config.numbers;
  const candidatePool = new Map<number, number>();

  function addToPool(num: number, weight: number) {
    if (num >= min && num <= max) {
      candidatePool.set(num, (candidatePool.get(num) || 0) + weight);
    }
  }

  if (personalData.zodiacSign || personalData.birthDate) {
    const sign =
      personalData.zodiacSign ||
      (personalData.birthDate
        ? getZodiacFromDate(personalData.birthDate)
        : "aries");

    const zodiacNums = generateByZodiac(config, sign);
    for (const n of zodiacNums) addToPool(n, 3);
  }

  if (personalData.fullName) {
    const { destinyNumber, soulNumber, personalityNumber, digits } =
      getNameNumerology(personalData.fullName);

    for (const base of [destinyNumber, soulNumber, personalityNumber]) {
      for (let mult = 1; mult * base <= max; mult++) {
        addToPool(mult * base, 2);
      }
    }

    const uniqueDigits = [...new Set(digits)];
    for (const d of uniqueDigits) {
      for (let mult = 1; mult * d <= max; mult++) {
        addToPool(mult * d, 1);
      }
    }
  }

  if (personalData.birthDate) {
    const date = new Date(personalData.birthDate);
    if (!isNaN(date.getTime())) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      addToPool(day, 3);
      addToPool(month, 3);
      addToPool(day + month, 2);
      const yearStr = date.getFullYear().toString();
      addToPool(parseInt(yearStr.slice(-2)), 2);
    }
  }

  if (personalData.specialDates) {
    for (const dateStr of personalData.specialDates) {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) continue;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      addToPool(day, 2);
      addToPool(month, 2);
      addToPool(day + month, 1);
    }
  }

  if (personalData.luckyPhrase) {
    const { destinyNumber, digits } = getNameNumerology(
      personalData.luckyPhrase
    );
    for (let mult = 1; mult * destinyNumber <= max; mult++) {
      addToPool(mult * destinyNumber, 2);
    }
    for (const d of [...new Set(digits)]) {
      for (let mult = 1; mult * d <= max; mult++) {
        addToPool(mult * d, 1);
      }
    }
  }

  const ranked = Array.from(candidatePool.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([num]) => num);

  const selected = new Set<number>();

  const topPick = Math.ceil(pick * 0.7);
  const topPool = ranked.slice(0, Math.max(topPick * 3, pick * 2));

  while (selected.size < pick) {
    if (topPool.length > 0 && selected.size < topPick) {
      const idx = Math.floor(Math.random() * topPool.length);
      selected.add(topPool[idx]);
    } else {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      selected.add(num);
    }
  }

  return Array.from(selected).sort((a, b) => a - b);
}
