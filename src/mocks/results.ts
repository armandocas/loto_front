import type { LotteryResult, LotteryStatistics, LotterySlug } from "@/types/lottery";

export const MOCK_RESULTS: Record<LotterySlug, LotteryResult[]> = {
  megasena: Array.from({ length: 10 }, (_, i) => ({
    id: `ms-${2800 - i}`,
    lottery: "megasena" as const,
    contestNumber: 2800 - i,
    date: new Date(2026, 1, 20 - i * 3).toISOString(),
    numbers: generateMockNumbers(1, 60, 6, i),
    prizes: [
      { tier: "Sena", winners: i % 3 === 0 ? 1 : 0, value: i % 3 === 0 ? 45000000 : 0 },
      { tier: "Quina", winners: 45 + i, value: 35000 + i * 1000 },
      { tier: "Quadra", winners: 3200 + i * 100, value: 800 + i * 50 },
    ],
    accumulated: i % 3 !== 0,
    accumulatedValue: i % 3 !== 0 ? 52000000 + i * 3000000 : undefined,
    nextEstimate: 55000000 + i * 2000000,
  })),
  lotofacil: Array.from({ length: 10 }, (_, i) => ({
    id: `lf-${3200 - i}`,
    lottery: "lotofacil" as const,
    contestNumber: 3200 - i,
    date: new Date(2026, 1, 20 - i).toISOString(),
    numbers: generateMockNumbers(1, 25, 15, i + 100),
    prizes: [
      { tier: "15 acertos", winners: 2 + i, value: 1500000 },
      { tier: "14 acertos", winners: 250 + i * 10, value: 1200 },
      { tier: "13 acertos", winners: 8500 + i * 100, value: 30 },
    ],
    accumulated: false,
    nextEstimate: 1700000,
  })),
  quina: Array.from({ length: 10 }, (_, i) => ({
    id: `qn-${6400 - i}`,
    lottery: "quina" as const,
    contestNumber: 6400 - i,
    date: new Date(2026, 1, 20 - i).toISOString(),
    numbers: generateMockNumbers(1, 80, 5, i + 200),
    prizes: [
      { tier: "Quina", winners: i % 4 === 0 ? 1 : 0, value: 8000000 },
      { tier: "Quadra", winners: 80 + i * 5, value: 6000 },
    ],
    accumulated: i % 4 !== 0,
    nextEstimate: 12000000,
  })),
  lotomania: Array.from({ length: 10 }, (_, i) => ({
    id: `lm-${2700 - i}`,
    lottery: "lotomania" as const,
    contestNumber: 2700 - i,
    date: new Date(2026, 1, 20 - i * 2).toISOString(),
    numbers: generateMockNumbers(0, 99, 20, i + 300),
    prizes: [
      { tier: "20 acertos", winners: 0, value: 0 },
      { tier: "19 acertos", winners: 3 + i, value: 50000 },
    ],
    accumulated: true,
    accumulatedValue: 5500000,
    nextEstimate: 6000000,
  })),
  timemania: Array.from({ length: 10 }, (_, i) => ({
    id: `tm-${2100 - i}`,
    lottery: "timemania" as const,
    contestNumber: 2100 - i,
    date: new Date(2026, 1, 20 - i * 2).toISOString(),
    numbers: generateMockNumbers(1, 80, 7, i + 400),
    prizes: [
      { tier: "7 acertos", winners: 0, value: 0 },
      { tier: "6 acertos", winners: 5 + i, value: 25000 },
    ],
    accumulated: true,
    nextEstimate: 9000000,
  })),
  duplasena: Array.from({ length: 10 }, (_, i) => ({
    id: `ds-${2600 - i}`,
    lottery: "duplasena" as const,
    contestNumber: 2600 - i,
    date: new Date(2026, 1, 20 - i * 2).toISOString(),
    numbers: generateMockNumbers(1, 50, 6, i + 500),
    prizes: [
      { tier: "Sena 1º sorteio", winners: 0, value: 0 },
      { tier: "Sena 2º sorteio", winners: 0, value: 0 },
    ],
    accumulated: true,
    accumulatedValue: 3500000,
    nextEstimate: 4000000,
  })),
  federal: Array.from({ length: 10 }, (_, i) => ({
    id: `fd-${5900 - i}`,
    lottery: "federal" as const,
    contestNumber: 5900 - i,
    date: new Date(2026, 1, 20 - i * 3).toISOString(),
    numbers: [10000 + i * 11111],
    prizes: [
      { tier: "1º Prêmio", winners: 1, value: 500000 },
      { tier: "2º Prêmio", winners: 1, value: 27000 },
    ],
    accumulated: false,
  })),
  diadesorte: Array.from({ length: 10 }, (_, i) => ({
    id: `dds-${950 - i}`,
    lottery: "diadesorte" as const,
    contestNumber: 950 - i,
    date: new Date(2026, 1, 20 - i * 2).toISOString(),
    numbers: generateMockNumbers(1, 31, 7, i + 600),
    extraNumbers: [(i % 12) + 1],
    prizes: [
      { tier: "7 acertos", winners: i % 5 === 0 ? 1 : 0, value: 1500000 },
    ],
    accumulated: i % 5 !== 0,
    nextEstimate: 2000000,
  })),
  supersete: Array.from({ length: 10 }, (_, i) => ({
    id: `ss-${600 - i}`,
    lottery: "supersete" as const,
    contestNumber: 600 - i,
    date: new Date(2026, 1, 20 - i * 2).toISOString(),
    numbers: Array.from({ length: 7 }, (_, j) => ((i + j) * 3) % 10),
    prizes: [
      { tier: "7 acertos", winners: 0, value: 0 },
      { tier: "6 acertos", winners: 2, value: 30000 },
    ],
    accumulated: true,
    accumulatedValue: 2000000,
    nextEstimate: 2500000,
  })),
  maismilionaria: Array.from({ length: 10 }, (_, i) => ({
    id: `mm-${200 - i}`,
    lottery: "maismilionaria" as const,
    contestNumber: 200 - i,
    date: new Date(2026, 1, 20 - i * 3).toISOString(),
    numbers: generateMockNumbers(1, 50, 6, i + 700),
    extraNumbers: generateMockNumbers(1, 6, 2, i + 800),
    prizes: [
      { tier: "6+2", winners: 0, value: 0 },
      { tier: "6+1", winners: 0, value: 0 },
      { tier: "5+2", winners: 3 + i, value: 50000 },
    ],
    accumulated: true,
    accumulatedValue: 150000000 + i * 10000000,
    nextEstimate: 160000000,
  })),
};

function generateMockNumbers(
  min: number,
  max: number,
  count: number,
  seed: number
): number[] {
  const numbers = new Set<number>();
  let s = seed;
  while (numbers.size < count) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const num = min + (s % (max - min + 1));
    numbers.add(num);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

export function getMockFrequency(
  slug: LotterySlug
): Record<number, number> {
  const results = MOCK_RESULTS[slug] || [];
  const freq: Record<number, number> = {};
  for (const result of results) {
    for (const num of result.numbers) {
      freq[num] = (freq[num] || 0) + 1;
    }
  }
  return freq;
}

export function getMockStatistics(slug: LotterySlug): LotteryStatistics {
  return {
    lottery: slug,
    totalContests: MOCK_RESULTS[slug]?.length || 0,
    numberFrequency: getMockFrequency(slug),
    lastUpdated: new Date().toISOString(),
  };
}
