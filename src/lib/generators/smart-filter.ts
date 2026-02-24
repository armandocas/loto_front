import type { LotteryConfig } from "@/types/lottery";
import type { SmartFilterOptions } from "@/types/game";

export function generateWithFilter(
  config: LotteryConfig,
  filters: SmartFilterOptions
): number[] {
  const { min, max, pick } = config.numbers;
  const maxAttempts = 10000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const numbers = generateCandidate(min, max, pick, filters);
    if (validateFilters(numbers, filters)) {
      return numbers.sort((a, b) => a - b);
    }
  }

  return generateCandidate(min, max, pick, filters).sort((a, b) => a - b);
}

function generateCandidate(
  min: number,
  max: number,
  pick: number,
  filters: SmartFilterOptions
): number[] {
  const pool = Array.from({ length: max - min + 1 }, (_, i) => i + min).filter(
    (n) => !filters.excludeNumbers?.includes(n)
  );

  const selected = new Set<number>();

  if (filters.includeNumbers) {
    for (const num of filters.includeNumbers) {
      if (num >= min && num <= max) selected.add(num);
    }
  }

  while (selected.size < pick && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    selected.add(pool[idx]);
  }

  return Array.from(selected);
}

function validateFilters(
  numbers: number[],
  filters: SmartFilterOptions
): boolean {
  if (filters.evenOddRatio) {
    const evenCount = numbers.filter((n) => n % 2 === 0).length;
    const oddCount = numbers.length - evenCount;
    if (
      evenCount !== filters.evenOddRatio.even ||
      oddCount !== filters.evenOddRatio.odd
    ) {
      return false;
    }
  }

  if (filters.sumRange) {
    const sum = numbers.reduce((a, b) => a + b, 0);
    if (sum < filters.sumRange.min || sum > filters.sumRange.max) {
      return false;
    }
  }

  if (filters.consecutiveMax !== undefined) {
    const sorted = [...numbers].sort((a, b) => a - b);
    let maxConsec = 1;
    let current = 1;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] - sorted[i - 1] === 1) {
        current++;
        maxConsec = Math.max(maxConsec, current);
      } else {
        current = 1;
      }
    }
    if (maxConsec > filters.consecutiveMax) return false;
  }

  return true;
}
