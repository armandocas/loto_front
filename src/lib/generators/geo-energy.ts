import type { LotteryConfig } from "@/types/lottery";

const PHI = 1.6180339887;

interface GeoData {
  lat: number;
  lng: number;
}

function extractGeoNumbers(coords: GeoData, min: number, max: number): Map<number, number> {
  const pool = new Map<number, number>();
  const range = max - min + 1;

  function add(num: number, weight: number) {
    const clamped = ((Math.abs(Math.round(num)) - min) % range) + min;
    if (clamped >= min && clamped <= max) {
      pool.set(clamped, (pool.get(clamped) || 0) + weight);
    }
  }

  const latDeg = Math.abs(Math.floor(coords.lat));
  const latMin = Math.abs(Math.round((coords.lat % 1) * 60));
  const lngDeg = Math.abs(Math.floor(coords.lng));
  const lngMin = Math.abs(Math.round((coords.lng % 1) * 60));

  add(latDeg, 3);
  add(latMin, 3);
  add(lngDeg, 3);
  add(lngMin, 3);

  add(latDeg + lngMin, 2);
  add(lngDeg + latMin, 2);
  add(Math.abs(latDeg - lngDeg), 2);
  add(Math.abs(latMin - lngMin), 2);

  const phiLat = coords.lat * PHI;
  const phiLng = coords.lng * PHI;
  const phiDigitsLat = Math.abs(phiLat).toString().replace(".", "").split("").map(Number);
  const phiDigitsLng = Math.abs(phiLng).toString().replace(".", "").split("").map(Number);

  for (let i = 0; i < Math.min(phiDigitsLat.length, 6); i++) {
    const d = phiDigitsLat[i];
    if (d > 0) {
      for (let mult = 1; mult * d <= max; mult++) {
        add(mult * d, 1);
      }
    }
  }
  for (let i = 0; i < Math.min(phiDigitsLng.length, 6); i++) {
    const d = phiDigitsLng[i];
    if (d > 0) {
      for (let mult = 1; mult * d <= max; mult++) {
        add(mult * d, 1);
      }
    }
  }

  const timezoneOffset = new Date().getTimezoneOffset();
  add(Math.abs(timezoneOffset / 60), 2);
  add(Math.abs(timezoneOffset % 60), 1);

  const crossProduct = Math.abs(Math.round(coords.lat * coords.lng));
  const crossDigits = crossProduct.toString().split("").map(Number);
  for (const d of crossDigits) {
    if (d >= min && d <= max) add(d, 2);
    add(d * 10 + d, 1);
  }

  return pool;
}

export function generateByGeoEnergy(
  config: LotteryConfig,
  coords: GeoData
): number[] {
  const { min, max, pick } = config.numbers;
  const range = max - min + 1;
  const pool = extractGeoNumbers(coords, min, max);

  const ranked = Array.from(pool.entries())
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

export function getGeoFallback(): GeoData {
  const offset = new Date().getTimezoneOffset();
  const approxLng = -(offset / 60) * 15;
  return { lat: -15.78, lng: approxLng || -47.93 };
}
