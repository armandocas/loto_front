import type { LotteryConfig } from "@/types/lottery";
import type { ZodiacSign } from "@/types/game";

const ZODIAC_NUMBERS: Record<ZodiacSign, number[]> = {
  aries: [1, 9, 17, 21, 27, 31, 36, 41, 45, 53, 58, 60],
  touro: [2, 6, 11, 15, 20, 24, 33, 38, 42, 47, 51, 56],
  gemeos: [3, 7, 12, 18, 23, 28, 32, 37, 43, 48, 52, 57],
  cancer: [4, 8, 13, 16, 22, 29, 34, 39, 44, 49, 54, 59],
  leao: [5, 10, 14, 19, 25, 30, 35, 40, 46, 50, 55, 60],
  virgem: [2, 8, 14, 20, 26, 32, 38, 44, 50, 56, 16, 22],
  libra: [3, 9, 15, 21, 27, 33, 39, 45, 51, 57, 11, 17],
  escorpiao: [4, 10, 16, 22, 28, 34, 40, 46, 52, 58, 7, 13],
  sagitario: [5, 11, 17, 23, 29, 35, 41, 47, 53, 59, 3, 9],
  capricornio: [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 1, 8],
  aquario: [1, 7, 13, 19, 25, 31, 37, 43, 49, 55, 4, 10],
  peixes: [2, 8, 14, 20, 26, 32, 38, 44, 50, 56, 5, 11],
};

const ZODIAC_PLANET_NUMBERS: Record<ZodiacSign, number[]> = {
  aries: [9, 1],
  touro: [6, 2],
  gemeos: [5, 3],
  cancer: [2, 7],
  leao: [1, 4],
  virgem: [5, 8],
  libra: [6, 9],
  escorpiao: [8, 4],
  sagitario: [3, 7],
  capricornio: [8, 6],
  aquario: [4, 1],
  peixes: [7, 3],
};

export function getZodiacFromDate(dateStr: string): ZodiacSign {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "touro";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "gemeos";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leao";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "virgem";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "escorpiao";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "sagitario";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "capricornio";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "aquario";
  return "peixes";
}

export function generateByZodiac(
  config: LotteryConfig,
  sign: ZodiacSign
): number[] {
  const { min, max, pick } = config.numbers;

  const zodiacNums = ZODIAC_NUMBERS[sign].filter((n) => n >= min && n <= max);
  const planetNums = ZODIAC_PLANET_NUMBERS[sign];

  const pool = new Set<number>();

  for (const n of zodiacNums) pool.add(n);

  for (const base of planetNums) {
    for (let mult = 1; mult * base <= max; mult++) {
      const val = mult * base;
      if (val >= min && val <= max) pool.add(val);
    }
  }

  const poolArr = Array.from(pool);
  const selected = new Set<number>();

  while (selected.size < pick) {
    if (poolArr.length > 0 && selected.size < Math.ceil(pick * 0.7)) {
      const idx = Math.floor(Math.random() * poolArr.length);
      selected.add(poolArr[idx]);
    } else {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      selected.add(num);
    }
  }

  return Array.from(selected).sort((a, b) => a - b);
}

export const ZODIAC_INFO: Record<ZodiacSign, { name: string; symbol: string; period: string }> = {
  aries: { name: "Áries", symbol: "♈", period: "21/03 - 19/04" },
  touro: { name: "Touro", symbol: "♉", period: "20/04 - 20/05" },
  gemeos: { name: "Gêmeos", symbol: "♊", period: "21/05 - 20/06" },
  cancer: { name: "Câncer", symbol: "♋", period: "21/06 - 22/07" },
  leao: { name: "Leão", symbol: "♌", period: "23/07 - 22/08" },
  virgem: { name: "Virgem", symbol: "♍", period: "23/08 - 22/09" },
  libra: { name: "Libra", symbol: "♎", period: "23/09 - 22/10" },
  escorpiao: { name: "Escorpião", symbol: "♏", period: "23/10 - 21/11" },
  sagitario: { name: "Sagitário", symbol: "♐", period: "22/11 - 21/12" },
  capricornio: { name: "Capricórnio", symbol: "♑", period: "22/12 - 19/01" },
  aquario: { name: "Aquário", symbol: "♒", period: "20/01 - 18/02" },
  peixes: { name: "Peixes", symbol: "♓", period: "19/02 - 20/03" },
};
