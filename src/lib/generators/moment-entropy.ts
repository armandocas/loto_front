import type { LotteryConfig } from "@/types/lottery";

class Xorshift128 {
  private s0: number;
  private s1: number;
  private s2: number;
  private s3: number;

  constructor(seed: number[]) {
    this.s0 = seed[0] || 1;
    this.s1 = seed[1] || 2;
    this.s2 = seed[2] || 3;
    this.s3 = seed[3] || 4;

    for (let i = 0; i < 20; i++) this.next();
  }

  next(): number {
    const t = this.s3;
    let s = this.s0;
    this.s3 = this.s2;
    this.s2 = this.s1;
    this.s1 = s;
    s ^= s << 11;
    s ^= s >>> 8;
    this.s0 = s ^ t ^ (t >>> 19);
    return (this.s0 >>> 0) / 4294967296;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

function hashEntropyData(data: number[]): number[] {
  const seeds: number[] = [0, 0, 0, 0];
  for (let i = 0; i < data.length; i++) {
    const val = Math.abs(Math.round(data[i] * 1000));
    seeds[i % 4] = (seeds[i % 4] ^ val) >>> 0;
    seeds[i % 4] = ((seeds[i % 4] * 2654435761) >>> 0);
  }

  const timestamp = Date.now();
  seeds[0] ^= (timestamp & 0xFFFF) >>> 0;
  seeds[1] ^= ((timestamp >> 16) & 0xFFFF) >>> 0;
  seeds[2] ^= (performance.now() * 1000) >>> 0;
  seeds[3] ^= (seeds[0] ^ seeds[1] ^ seeds[2]) >>> 0;

  return seeds.map((s) => (s === 0 ? 1 : s));
}

export function generateByEntropy(
  config: LotteryConfig,
  entropyData: number[]
): number[] {
  const { min, max, pick } = config.numbers;
  const seeds = hashEntropyData(entropyData);
  const rng = new Xorshift128(seeds);

  const selected = new Set<number>();
  let attempts = 0;

  while (selected.size < pick && attempts < pick * 100) {
    selected.add(rng.nextInt(min, max));
    attempts++;
  }

  while (selected.size < pick) {
    selected.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  return Array.from(selected).sort((a, b) => a - b);
}

export function collectMouseEntropy(
  event: { clientX: number; clientY: number },
  existing: number[]
): number[] {
  const timestamp = performance.now();
  return [
    ...existing,
    event.clientX * 7919 + event.clientY * 104729 + timestamp,
  ];
}

export function getEntropyProgress(entropyData: number[]): number {
  const MIN_SAMPLES = 20;
  return Math.min(entropyData.length / MIN_SAMPLES, 1);
}

export function isEntropyReady(entropyData: number[]): boolean {
  return entropyData.length >= 20;
}
