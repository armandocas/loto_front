import type { LotteryConfig } from "@/types/lottery";

interface HslColor {
  h: number;
  s: number;
  l: number;
}

function hexToHsl(hex: string): HslColor {
  const clean = hex.replace("#", "");
  const r = Number.parseInt(clean.substring(0, 2), 16) / 255;
  const g = Number.parseInt(clean.substring(2, 4), 16) / 255;
  const b = Number.parseInt(clean.substring(4, 6), 16) / 255;

  const cmax = Math.max(r, g, b);
  const cmin = Math.min(r, g, b);
  const delta = cmax - cmin;

  let h = 0;
  if (delta !== 0) {
    if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const l = (cmax + cmin) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

const HUE_ZONES: { rangeStart: number; rangeEnd: number; baseNumbers: number[]; name: string }[] = [
  { rangeStart: 0, rangeEnd: 30, baseNumbers: [1, 7, 13, 19, 37, 43], name: "Vermelho" },
  { rangeStart: 30, rangeEnd: 60, baseNumbers: [2, 8, 14, 20, 38, 44], name: "Laranja" },
  { rangeStart: 60, rangeEnd: 90, baseNumbers: [3, 9, 15, 21, 39, 45], name: "Amarelo" },
  { rangeStart: 90, rangeEnd: 120, baseNumbers: [4, 10, 16, 22, 40, 46], name: "Verde-Limão" },
  { rangeStart: 120, rangeEnd: 150, baseNumbers: [5, 11, 17, 23, 41, 47], name: "Verde" },
  { rangeStart: 150, rangeEnd: 180, baseNumbers: [6, 12, 18, 24, 42, 48], name: "Ciano" },
  { rangeStart: 180, rangeEnd: 210, baseNumbers: [25, 31, 37, 43, 49, 55], name: "Azul-Claro" },
  { rangeStart: 210, rangeEnd: 240, baseNumbers: [26, 32, 38, 44, 50, 56], name: "Azul" },
  { rangeStart: 240, rangeEnd: 270, baseNumbers: [27, 33, 39, 45, 51, 57], name: "Índigo" },
  { rangeStart: 270, rangeEnd: 300, baseNumbers: [28, 34, 40, 46, 52, 58], name: "Violeta" },
  { rangeStart: 300, rangeEnd: 330, baseNumbers: [29, 35, 41, 47, 53, 59], name: "Magenta" },
  { rangeStart: 330, rangeEnd: 360, baseNumbers: [30, 36, 42, 48, 54, 60], name: "Rosa" },
];

function getComplementaryHue(hue: number): number {
  return (hue + 180) % 360;
}

function getHueZoneNumbers(hue: number): number[] {
  const zone = HUE_ZONES.find((z) => hue >= z.rangeStart && hue < z.rangeEnd);
  return zone?.baseNumbers || HUE_ZONES[0].baseNumbers;
}

export function generateByColorSynesthesia(
  config: LotteryConfig,
  selectedColors: string[]
): number[] {
  const { min, max, pick } = config.numbers;
  const range = max - min + 1;
  const candidatePool = new Map<number, number>();

  function addToPool(num: number, weight: number) {
    if (num >= min && num <= max) {
      candidatePool.set(num, (candidatePool.get(num) || 0) + weight);
    }
  }

  for (const hex of selectedColors) {
    const hsl = hexToHsl(hex);

    const zoneNums = getHueZoneNumbers(hsl.h);
    for (const n of zoneNums) addToPool(n, 3);

    const compNums = getHueZoneNumbers(getComplementaryHue(hsl.h));
    for (const n of compNums) addToPool(n, 1);

    if (hsl.s > 50) {
      for (let n = min; n <= max; n += 2) addToPool(n + 1, 1);
    } else {
      for (let n = min; n <= max; n += 2) addToPool(n, 1);
    }

    if (hsl.l < 40) {
      const highStart = min + Math.floor(range * 0.6);
      for (let n = highStart; n <= max; n++) addToPool(n, 2);
    } else if (hsl.l > 60) {
      const lowEnd = min + Math.floor(range * 0.4);
      for (let n = min; n <= lowEnd; n++) addToPool(n, 2);
    }

    const hueNum = Math.round((hsl.h / 360) * (range - 1)) + min;
    addToPool(hueNum, 4);
    const satNum = Math.round((hsl.s / 100) * (range - 1)) + min;
    addToPool(satNum, 2);
    const lightNum = Math.round((hsl.l / 100) * (range - 1)) + min;
    addToPool(lightNum, 2);
  }

  if (selectedColors.length >= 2) {
    const hsls = selectedColors.map(hexToHsl);
    const avgHue = hsls.reduce((sum, c) => sum + c.h, 0) / hsls.length;
    const harmonyNum = Math.round((avgHue / 360) * (range - 1)) + min;
    addToPool(harmonyNum, 5);
  }

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

export { hexToHsl };
