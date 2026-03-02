import type { LotteryConfig } from "@/types/lottery";

interface LorenzState {
  x: number;
  y: number;
  z: number;
}

const SIGMA = 10;
const RHO = 28;
const BETA = 8 / 3;

function lorenzStep(state: LorenzState, dt: number): LorenzState {
  const dx = SIGMA * (state.y - state.x);
  const dy = state.x * (RHO - state.z) - state.y;
  const dz = state.x * state.y - BETA * state.z;

  return {
    x: state.x + dx * dt,
    y: state.y + dy * dt,
    z: state.z + dz * dt,
  };
}

function hashSeed(seed: string): LorenzState {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  let h3 = 0xdeadbeef;

  for (let i = 0; i < seed.length; i++) {
    const c = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193);
    h2 = Math.imul(h2 ^ c, 0x5bd1e995);
    h3 = Math.imul(h3 ^ c, 0x1b873593);
  }

  const normalize = (h: number) => ((h >>> 0) % 2000) / 100 - 10;

  return {
    x: normalize(h1) || 0.1,
    y: normalize(h2) || 0.1,
    z: normalize(h3) + 25,
  };
}

function logisticMap(r: number, x0: number, iterations: number): number[] {
  const values: number[] = [];
  let x = x0;
  for (let i = 0; i < iterations; i++) {
    x = r * x * (1 - x);
    values.push(x);
  }
  return values;
}

export function generateByQuantumResonance(
  config: LotteryConfig,
  seed: string = "sorte",
  intensity: number = 5
): number[] {
  const { min, max, pick } = config.numbers;
  const range = max - min + 1;

  const iterations = Math.floor(100 + intensity * 990);
  const dt = 0.001 + (10 - intensity) * 0.0009;

  let state = hashSeed(seed);
  const trajectory: LorenzState[] = [];

  for (let i = 0; i < iterations; i++) {
    state = lorenzStep(state, dt);
    if (i > iterations * 0.3) {
      trajectory.push({ ...state });
    }
  }

  const candidatePool = new Map<number, number>();

  function addToPool(num: number, weight: number) {
    const val = ((Math.abs(Math.round(num)) - min + range) % range) + min;
    if (val >= min && val <= max) {
      candidatePool.set(val, (candidatePool.get(val) || 0) + weight);
    }
  }

  const sampleStep = Math.max(1, Math.floor(trajectory.length / (pick * 5)));
  for (let i = 0; i < trajectory.length; i += sampleStep) {
    const p = trajectory[i];
    addToPool(Math.round(p.x), 2);
    addToPool(Math.round(p.y), 2);
    addToPool(Math.round(p.z), 2);
    addToPool(Math.round(Math.sqrt(p.x * p.x + p.y * p.y)), 1);
  }

  const lastState = trajectory[trajectory.length - 1] || state;
  const logX0 = Math.abs(lastState.x % 1) || 0.5;
  const r = 3.57 + (intensity / 10) * 0.43;
  const logisticValues = logisticMap(r, logX0, pick * 10);

  for (const v of logisticValues) {
    const num = Math.floor(v * range) + min;
    addToPool(num, 3);
  }

  const ranked = Array.from(candidatePool.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([num]) => num);

  const selected = new Set<number>();
  const topCount = Math.ceil(pick * 0.75);
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

export function getLorenzTrajectory(
  seed: string,
  intensity: number,
  points: number = 200
): { x: number; y: number; z: number }[] {
  const iterations = Math.floor(100 + intensity * 990);
  const dt = 0.001 + (10 - intensity) * 0.0009;

  let state = hashSeed(seed);
  const result: { x: number; y: number; z: number }[] = [];
  const step = Math.max(1, Math.floor(iterations / points));

  for (let i = 0; i < iterations; i++) {
    state = lorenzStep(state, dt);
    if (i % step === 0) {
      result.push({ x: state.x, y: state.y, z: state.z });
    }
  }

  return result;
}
