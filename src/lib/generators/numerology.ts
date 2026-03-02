import type { LotteryConfig } from "@/types/lottery";

const LETTER_VALUES: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
  á: 1, é: 5, í: 9, ó: 6, ú: 3, ã: 1, õ: 6, â: 1, ê: 5,
  î: 9, ô: 6, û: 3, à: 1, ç: 3,
};

function reduceToSingle(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num
      .toString()
      .split("")
      .reduce((sum, d) => sum + parseInt(d), 0);
  }
  return num;
}

function nameToNumbers(name: string): number[] {
  const clean = name.toLowerCase().trim();
  const digits: number[] = [];

  for (const char of clean) {
    const val = LETTER_VALUES[char];
    if (val) digits.push(val);
  }

  return digits;
}

export function getNameNumerology(name: string) {
  const digits = nameToNumbers(name);
  const totalSum = digits.reduce((a, b) => a + b, 0);
  const destinyNumber = reduceToSingle(totalSum);

  const vowels = "aeiouáéíóúãõâêîôû";
  const vowelSum = name
    .toLowerCase()
    .split("")
    .filter((c) => vowels.includes(c))
    .reduce((sum, c) => sum + (LETTER_VALUES[c] || 0), 0);
  const soulNumber = reduceToSingle(vowelSum);

  const consonantSum = name
    .toLowerCase()
    .split("")
    .filter((c) => !vowels.includes(c) && LETTER_VALUES[c])
    .reduce((sum, c) => sum + (LETTER_VALUES[c] || 0), 0);
  const personalityNumber = reduceToSingle(consonantSum);

  return { destinyNumber, soulNumber, personalityNumber, digits };
}

export function generateByNumerology(
  config: LotteryConfig,
  fullName: string
): number[] {
  const { min, max, pick } = config.numbers;
  const { destinyNumber, soulNumber, personalityNumber, digits } =
    getNameNumerology(fullName);

  const seedNumbers = new Set<number>();

  for (const base of [destinyNumber, soulNumber, personalityNumber]) {
    for (let mult = 1; mult * base <= max; mult++) {
      const val = mult * base;
      if (val >= min && val <= max) seedNumbers.add(val);
    }
  }

  const uniqueDigits = [...new Set(digits)];
  for (const d of uniqueDigits) {
    for (let mult = 1; mult * d <= max; mult++) {
      const val = mult * d;
      if (val >= min && val <= max) seedNumbers.add(val);
    }
  }

  const nameParts = fullName.trim().split(/\s+/);
  for (const part of nameParts) {
    const partSum = nameToNumbers(part).reduce((a, b) => a + b, 0);
    const reduced = reduceToSingle(partSum);
    if (reduced >= min && reduced <= max) seedNumbers.add(reduced);
    if (partSum >= min && partSum <= max) seedNumbers.add(partSum);
  }

  const pool = Array.from(seedNumbers);
  const selected = new Set<number>();

  while (selected.size < pick) {
    if (pool.length > 0 && selected.size < Math.ceil(pick * 0.6)) {
      const idx = Math.floor(Math.random() * pool.length);
      selected.add(pool[idx]);
    } else {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      selected.add(num);
    }
  }

  return Array.from(selected).sort((a, b) => a - b);
}
