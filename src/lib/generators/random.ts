import type { LotteryConfig } from "@/types/lottery";

export function generateRandom(config: LotteryConfig): number[] {
  const { min, max, pick } = config.numbers;
  const numbers = new Set<number>();

  while (numbers.size < pick) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(randomNum);
  }

  return Array.from(numbers).sort((a, b) => a - b);
}

export function generateRandomExtra(config: LotteryConfig): number[] | undefined {
  if (!config.extraNumbers) return undefined;

  const { min, max, pick } = config.extraNumbers;
  const numbers = new Set<number>();

  while (numbers.size < pick) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(randomNum);
  }

  return Array.from(numbers).sort((a, b) => a - b);
}
