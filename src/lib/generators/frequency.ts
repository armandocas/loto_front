import type { LotteryConfig } from "@/types/lottery";

export function generateByFrequency(
  config: LotteryConfig,
  frequencyMap: Record<number, number>
): number[] {
  const { min, max, pick } = config.numbers;

  const allNumbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  const sorted = allNumbers.sort(
    (a, b) => (frequencyMap[b] || 0) - (frequencyMap[a] || 0)
  );

  const topPool = sorted.slice(0, Math.min(pick * 3, sorted.length));

  const selected = new Set<number>();
  while (selected.size < pick) {
    const idx = Math.floor(Math.random() * topPool.length);
    selected.add(topPool[idx]);
  }

  return Array.from(selected).sort((a, b) => a - b);
}
