import type { LotteryResult } from "@/types/lottery";

export interface NumberDelay {
  number: number;
  delay: number;
  lastSeen: number;
}

export function calculateDelays(
  results: LotteryResult[],
  maxNumber: number
): NumberDelay[] {
  const sorted = [...results].sort((a, b) => b.contestNumber - a.contestNumber);
  const latestContest = sorted[0]?.contestNumber ?? 0;
  const delays: NumberDelay[] = [];

  for (let num = 1; num <= maxNumber; num++) {
    const lastIndex = sorted.findIndex((r) => r.numbers.includes(num));
    const lastSeen = lastIndex >= 0 ? sorted[lastIndex].contestNumber : 0;
    const delay = lastSeen > 0 ? latestContest - lastSeen : latestContest;

    delays.push({ number: num, delay, lastSeen });
  }

  return delays.sort((a, b) => b.delay - a.delay);
}

export function getOverdueNumbers(
  results: LotteryResult[],
  maxNumber: number,
  threshold: number
): NumberDelay[] {
  return calculateDelays(results, maxNumber).filter((d) => d.delay >= threshold);
}
