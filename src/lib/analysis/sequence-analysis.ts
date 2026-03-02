import type { LotteryResult } from "@/types/lottery";

export interface SequenceFrequency {
  length: number;
  count: number;
  percentage: number;
}

export function analyzeSequences(results: LotteryResult[]): SequenceFrequency[] {
  const sequenceCounts: Record<number, number> = {};
  const total = results.length;

  for (const result of results) {
    const sorted = [...result.numbers].sort((a, b) => a - b);
    let maxSeq = 1;
    let currentSeq = 1;

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === sorted[i - 1] + 1) {
        currentSeq++;
        maxSeq = Math.max(maxSeq, currentSeq);
      } else {
        currentSeq = 1;
      }
    }

    sequenceCounts[maxSeq] = (sequenceCounts[maxSeq] || 0) + 1;
  }

  return Object.entries(sequenceCounts)
    .map(([length, count]) => ({
      length: Number(length),
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => a.length - b.length);
}

export function getConsecutivePairs(results: LotteryResult[]): Record<string, number> {
  const pairCounts: Record<string, number> = {};

  for (const result of results) {
    const sorted = [...result.numbers].sort((a, b) => a - b);
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i + 1] === sorted[i] + 1) {
        const key = `${sorted[i]}-${sorted[i + 1]}`;
        pairCounts[key] = (pairCounts[key] || 0) + 1;
      }
    }
  }

  return pairCounts;
}
