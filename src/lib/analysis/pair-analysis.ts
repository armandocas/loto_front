import type { LotteryResult } from "@/types/lottery";

export interface PairFrequency {
  pair: [number, number];
  count: number;
  percentage: number;
}

export function analyzePairs(
  results: LotteryResult[],
  topN = 20
): PairFrequency[] {
  const pairCounts = new Map<string, number>();
  const total = results.length;

  for (const result of results) {
    const nums = result.numbers;
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        const key = `${Math.min(nums[i], nums[j])}-${Math.max(nums[i], nums[j])}`;
        pairCounts.set(key, (pairCounts.get(key) || 0) + 1);
      }
    }
  }

  return Array.from(pairCounts.entries())
    .map(([key, count]) => {
      const [a, b] = key.split("-").map(Number);
      return {
        pair: [a, b] as [number, number],
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

export function buildPairMatrix(
  results: LotteryResult[],
  maxNumber: number
): number[][] {
  const matrix: number[][] = Array.from({ length: maxNumber + 1 }, () =>
    Array(maxNumber + 1).fill(0)
  );

  for (const result of results) {
    const nums = result.numbers;
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        matrix[nums[i]][nums[j]]++;
        matrix[nums[j]][nums[i]]++;
      }
    }
  }

  return matrix;
}
