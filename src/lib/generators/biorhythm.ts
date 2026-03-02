import type { LotteryConfig } from "@/types/lottery";

const CYCLES = {
  physical: 23,
  emotional: 28,
  intellectual: 33,
} as const;

type CycleType = keyof typeof CYCLES;

function daysSinceBirth(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  const diffMs = today.getTime() - birth.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function cycleValue(days: number, period: number): number {
  return Math.sin((2 * Math.PI * days) / period);
}

export function getBiorhythmState(birthDate: string) {
  const days = daysSinceBirth(birthDate);

  const physical = cycleValue(days, CYCLES.physical);
  const emotional = cycleValue(days, CYCLES.emotional);
  const intellectual = cycleValue(days, CYCLES.intellectual);

  const average = (physical + emotional + intellectual) / 3;
  const isGoldenDay = physical > 0.5 && emotional > 0.5 && intellectual > 0.5;

  return { physical, emotional, intellectual, average, days, isGoldenDay };
}

export function generateByBiorhythm(
  config: LotteryConfig,
  birthDate: string
): number[] {
  const { min, max, pick } = config.numbers;
  const range = max - min + 1;
  const state = getBiorhythmState(birthDate);

  const candidatePool = new Map<number, number>();

  function addToPool(num: number, weight: number) {
    if (num >= min && num <= max) {
      candidatePool.set(num, (candidatePool.get(num) || 0) + weight);
    }
  }

  const cycleEntries: [CycleType, number][] = [
    ["physical", state.physical],
    ["emotional", state.emotional],
    ["intellectual", state.intellectual],
  ];

  for (const [, value] of cycleEntries) {
    const normalized = (value + 1) / 2;
    const centerNum = Math.round(min + normalized * (range - 1));
    const spread = Math.ceil(range * 0.15);

    for (let offset = -spread; offset <= spread; offset++) {
      const num = centerNum + offset;
      const weight = spread + 1 - Math.abs(offset);
      addToPool(num, weight);
    }
  }

  const dayMod = state.days % range;
  addToPool(min + dayMod, 3);
  addToPool(min + ((dayMod * 2) % range), 2);
  addToPool(min + ((dayMod * 3) % range), 2);

  for (const period of Object.values(CYCLES)) {
    const phase = state.days % period;
    addToPool(min + (phase % range), 2);
    const complement = period - phase;
    addToPool(min + (complement % range), 1);
  }

  if (state.isGoldenDay) {
    const goldenCenter = Math.round(min + range * 0.618);
    for (let i = -3; i <= 3; i++) {
      addToPool(goldenCenter + i, 4);
    }
  }

  const ranked = Array.from(candidatePool.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([num]) => num);

  const selected = new Set<number>();
  const topCount = Math.ceil(pick * 0.7);
  const topPool = ranked.slice(0, Math.max(topCount * 3, pick * 2));

  while (selected.size < pick) {
    if (topPool.length > 0 && selected.size < topCount) {
      const idx = Math.floor(Math.random() * topPool.length);
      selected.add(topPool[idx]);
    } else {
      selected.add(Math.floor(Math.random() * range) + min);
    }
  }

  return Array.from(selected).sort((a, b) => a - b);
}
