import type { LotteryResult } from "@/types/lottery";

export interface SumStats {
  average: number;
  min: number;
  max: number;
  median: number;
  distribution: { range: string; count: number }[];
}

export function analyzeSums(results: LotteryResult[], bucketSize = 20): SumStats {
  if (results.length === 0) {
    return { average: 0, min: 0, max: 0, median: 0, distribution: [] };
  }

  const sums = results.map((r) => r.numbers.reduce((a, b) => a + b, 0));
  const sorted = [...sums].sort((a, b) => a - b);

  const average = sums.reduce((a, b) => a + b, 0) / sums.length;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

  const buckets = new Map<string, number>();
  for (const sum of sums) {
    const bucketStart = Math.floor(sum / bucketSize) * bucketSize;
    const key = `${bucketStart}-${bucketStart + bucketSize - 1}`;
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  const distribution = Array.from(buckets.entries())
    .map(([range, count]) => ({ range, count }))
    .sort((a, b) => {
      const aStart = Number.parseInt(a.range.split("-")[0]);
      const bStart = Number.parseInt(b.range.split("-")[0]);
      return aStart - bStart;
    });

  return { average, min, max, median, distribution };
}

export function getDecadeDistribution(
  results: LotteryResult[],
  maxNumber: number
): { decade: string; count: number; percentage: number }[] {
  const decades = new Map<string, number>();
  let total = 0;

  for (const result of results) {
    for (const num of result.numbers) {
      const dec = Math.floor((num - 1) / 10) * 10 + 1;
      const end = Math.min(dec + 9, maxNumber);
      const key = `${dec}-${end}`;
      decades.set(key, (decades.get(key) || 0) + 1);
      total++;
    }
  }

  return Array.from(decades.entries())
    .map(([decade, count]) => ({
      decade,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => {
      const aStart = Number.parseInt(a.decade.split("-")[0]);
      const bStart = Number.parseInt(b.decade.split("-")[0]);
      return aStart - bStart;
    });
}
