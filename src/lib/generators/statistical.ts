import type { LotteryConfig, LotteryResult } from "@/types/lottery";

export function generateStatistical(
  config: LotteryConfig,
  results: LotteryResult[]
): number[] {
  const { min, max, pick } = config.numbers;
  const totalNumbers = max - min + 1;

  const frequency: Record<number, number> = {};
  const gaps: Record<number, number> = {};
  for (let i = min; i <= max; i++) {
    frequency[i] = 0;
    gaps[i] = results.length;
  }

  results.forEach((result, idx) => {
    for (const num of result.numbers) {
      frequency[num] = (frequency[num] || 0) + 1;
      if (gaps[num] === results.length) {
        gaps[num] = idx;
      }
    }
  });

  const totalDraws = results.length || 1;
  const expectedFreq = (totalDraws * pick) / totalNumbers;

  const scores: Record<number, number> = {};
  for (let i = min; i <= max; i++) {
    const freqScore = frequency[i] / expectedFreq;
    const gapScore = gaps[i] / totalDraws;
    scores[i] = freqScore * 0.4 + gapScore * 0.6;
  }

  const ranked = Object.entries(scores)
    .map(([num, score]) => ({
      num: parseInt(num),
      score: score + Math.random() * 0.3,
    }))
    .sort((a, b) => b.score - a.score);

  return ranked
    .slice(0, pick)
    .map((n) => n.num)
    .sort((a, b) => a - b);
}
