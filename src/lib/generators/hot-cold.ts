import type { LotteryConfig, LotteryResult } from "@/types/lottery";

export function generateHotCold(
  config: LotteryConfig,
  recentResults: LotteryResult[],
  strategy: "hot" | "cold" | "mixed" = "mixed"
): number[] {
  const { min, max, pick } = config.numbers;

  const frequency: Record<number, number> = {};
  for (let i = min; i <= max; i++) frequency[i] = 0;

  for (const result of recentResults) {
    for (const num of result.numbers) {
      frequency[num] = (frequency[num] || 0) + 1;
    }
  }

  const allNumbers = Object.entries(frequency)
    .map(([num, freq]) => ({ num: parseInt(num), freq }))
    .sort((a, b) => b.freq - a.freq);

  let pool: number[];

  if (strategy === "hot") {
    pool = allNumbers.slice(0, pick * 3).map((n) => n.num);
  } else if (strategy === "cold") {
    pool = allNumbers.slice(-pick * 3).map((n) => n.num);
  } else {
    const hotCount = Math.ceil(pick * 0.6);
    const coldCount = pick - hotCount;
    const hot = allNumbers.slice(0, hotCount * 2).map((n) => n.num);
    const cold = allNumbers.slice(-coldCount * 2).map((n) => n.num);
    pool = [...hot, ...cold];
  }

  const selected = new Set<number>();
  while (selected.size < pick) {
    const idx = Math.floor(Math.random() * pool.length);
    selected.add(pool[idx]);
  }

  return Array.from(selected).sort((a, b) => a - b);
}
