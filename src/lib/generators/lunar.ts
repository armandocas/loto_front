import type { LotteryConfig } from "@/types/lottery";

export type LunarPhase =
  | "new"
  | "waxing-crescent"
  | "first-quarter"
  | "waxing-gibbous"
  | "full"
  | "waning-gibbous"
  | "last-quarter"
  | "waning-crescent";

export interface LunarState {
  phase: LunarPhase;
  phaseName: string;
  phaseEmoji: string;
  dayOfCycle: number;
  illumination: number;
}

const SYNODIC_MONTH = 29.53059;
const KNOWN_NEW_MOON = new Date("2000-01-06T18:14:00Z").getTime();

const PHASE_INFO: Record<LunarPhase, { name: string; emoji: string }> = {
  "new": { name: "Lua Nova", emoji: "🌑" },
  "waxing-crescent": { name: "Crescente Inicial", emoji: "🌒" },
  "first-quarter": { name: "Quarto Crescente", emoji: "🌓" },
  "waxing-gibbous": { name: "Crescente Gibosa", emoji: "🌔" },
  "full": { name: "Lua Cheia", emoji: "🌕" },
  "waning-gibbous": { name: "Minguante Gibosa", emoji: "🌖" },
  "last-quarter": { name: "Quarto Minguante", emoji: "🌗" },
  "waning-crescent": { name: "Minguante", emoji: "🌘" },
};

export function getLunarState(date: Date = new Date()): LunarState {
  const diffMs = date.getTime() - KNOWN_NEW_MOON;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const dayOfCycle = ((diffDays % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;

  const phaseIndex = Math.floor((dayOfCycle / SYNODIC_MONTH) * 8) % 8;
  const phases: LunarPhase[] = [
    "new", "waxing-crescent", "first-quarter", "waxing-gibbous",
    "full", "waning-gibbous", "last-quarter", "waning-crescent",
  ];
  const phase = phases[phaseIndex];

  const illumination = (1 - Math.cos((2 * Math.PI * dayOfCycle) / SYNODIC_MONTH)) / 2;

  return {
    phase,
    phaseName: PHASE_INFO[phase].name,
    phaseEmoji: PHASE_INFO[phase].emoji,
    dayOfCycle: Math.floor(dayOfCycle),
    illumination: Math.round(illumination * 100) / 100,
  };
}

const PHASE_RANGES: Record<LunarPhase, { bias: "low" | "mid" | "high" | "spread"; weight: number }> = {
  "new": { bias: "low", weight: 4 },
  "waxing-crescent": { bias: "low", weight: 3 },
  "first-quarter": { bias: "mid", weight: 3 },
  "waxing-gibbous": { bias: "mid", weight: 3 },
  "full": { bias: "high", weight: 4 },
  "waning-gibbous": { bias: "high", weight: 3 },
  "last-quarter": { bias: "mid", weight: 3 },
  "waning-crescent": { bias: "spread", weight: 2 },
};

export function generateByLunar(config: LotteryConfig): number[] {
  const { min, max, pick } = config.numbers;
  const range = max - min + 1;
  const lunar = getLunarState();
  const phaseConfig = PHASE_RANGES[lunar.phase];

  const candidatePool = new Map<number, number>();

  function addToPool(num: number, weight: number) {
    if (num >= min && num <= max) {
      candidatePool.set(num, (candidatePool.get(num) || 0) + weight);
    }
  }

  const third = Math.floor(range / 3);
  let rangeStart: number;
  let rangeEnd: number;

  switch (phaseConfig.bias) {
    case "low":
      rangeStart = min;
      rangeEnd = min + third;
      break;
    case "mid":
      rangeStart = min + third;
      rangeEnd = min + third * 2;
      break;
    case "high":
      rangeStart = min + third * 2;
      rangeEnd = max;
      break;
    case "spread":
      rangeStart = min;
      rangeEnd = max;
      break;
  }

  for (let n = rangeStart; n <= rangeEnd; n++) {
    addToPool(n, phaseConfig.weight);
  }

  const lunarDay = lunar.dayOfCycle + 1;
  addToPool(min + (lunarDay % range), 5);
  addToPool(min + ((lunarDay * 2) % range), 3);
  addToPool(min + ((lunarDay * 3) % range), 2);

  const illuminationNum = Math.round(lunar.illumination * (max - min)) + min;
  addToPool(illuminationNum, 4);
  addToPool(min + (Math.round(SYNODIC_MONTH) % range), 2);

  const cyclePhase = (lunar.dayOfCycle / SYNODIC_MONTH) * 2 * Math.PI;
  const sinVal = Math.sin(cyclePhase);
  const cosVal = Math.cos(cyclePhase);
  addToPool(Math.round(min + ((sinVal + 1) / 2) * (range - 1)), 3);
  addToPool(Math.round(min + ((cosVal + 1) / 2) * (range - 1)), 3);

  const ranked = Array.from(candidatePool.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([num]) => num);

  const selected = new Set<number>();
  const topCount = Math.ceil(pick * 0.7);
  const topPool = ranked.slice(0, Math.max(topCount * 3, pick * 2));

  while (selected.size < pick) {
    if (topPool.length > 0 && selected.size < topCount) {
      selected.add(topPool[Math.floor(Math.random() * topPool.length)]);
    } else {
      selected.add(Math.floor(Math.random() * range) + min);
    }
  }

  return Array.from(selected).sort((a, b) => a - b);
}
