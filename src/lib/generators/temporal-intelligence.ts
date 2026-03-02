import type { LotteryConfig } from "@/types/lottery";

const BRAZILIAN_HOLIDAYS: Array<{ month: number; day: number; name: string }> = [
  { month: 1, day: 1, name: "Confraternização Universal" },
  { month: 4, day: 21, name: "Tiradentes" },
  { month: 5, day: 1, name: "Dia do Trabalho" },
  { month: 9, day: 7, name: "Independência" },
  { month: 10, day: 12, name: "Nossa Senhora Aparecida" },
  { month: 11, day: 2, name: "Finados" },
  { month: 11, day: 15, name: "Proclamação da República" },
  { month: 12, day: 25, name: "Natal" },
];

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function reduceToSingle(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = n.toString().split("").reduce((s, d) => s + Number.parseInt(d), 0);
  }
  return n;
}

function isMirrorTime(h: number, m: number): boolean {
  const hStr = h.toString().padStart(2, "0");
  const mStr = m.toString().padStart(2, "0");
  return hStr === mStr || hStr === mStr.split("").reverse().join("");
}

export interface TemporalState {
  dayOfWeek: number;
  hour: number;
  minute: number;
  second: number;
  dayOfMonth: number;
  month: number;
  year: number;
  dayOfYear: number;
  isoWeek: number;
  isHoliday: boolean;
  holidayName?: string;
  isMasterDate: boolean;
  masterNumber?: number;
  isMirrorTime: boolean;
  dateNumerology: number;
}

export function getTemporalState(date: Date = new Date()): TemporalState {
  const dayOfWeek = date.getDay() || 7;
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const dayOfYear = getDayOfYear(date);
  const isoWeek = getISOWeek(date);

  const holiday = BRAZILIAN_HOLIDAYS.find(
    (h) => h.month === month && h.day === dayOfMonth
  );

  const dateSum = reduceToSingle(dayOfMonth + month + year);
  const isMasterDate = dateSum === 11 || dateSum === 22 || dateSum === 33;

  return {
    dayOfWeek,
    hour,
    minute,
    second,
    dayOfMonth,
    month,
    year,
    dayOfYear,
    isoWeek,
    isHoliday: !!holiday,
    holidayName: holiday?.name,
    isMasterDate,
    masterNumber: isMasterDate ? dateSum : undefined,
    isMirrorTime: isMirrorTime(hour, minute),
    dateNumerology: dateSum,
  };
}

export function generateByTemporal(config: LotteryConfig): number[] {
  const { min, max, pick } = config.numbers;
  const range = max - min + 1;
  const state = getTemporalState();

  const candidatePool = new Map<number, number>();

  function addToPool(num: number, weight: number) {
    const val = ((num - min + range) % range) + min;
    if (val >= min && val <= max) {
      candidatePool.set(val, (candidatePool.get(val) || 0) + weight);
    }
  }

  addToPool(state.dayOfWeek, 3);
  addToPool(state.hour, 3);
  addToPool(state.minute, 3);
  addToPool(state.second, 2);
  addToPool(state.dayOfMonth, 4);
  addToPool(state.month, 3);
  addToPool(state.dayOfYear % range + min, 3);
  addToPool(state.isoWeek, 2);
  addToPool(state.dateNumerology, 4);

  addToPool(state.dayOfMonth + state.month, 3);
  addToPool(Math.abs(state.dayOfMonth - state.month), 2);
  addToPool(state.hour + state.minute, 2);
  addToPool(state.dayOfWeek * state.month, 2);

  const yearDigits = state.year.toString().split("").map(Number);
  for (const d of yearDigits) {
    for (let mult = 1; mult * d <= max && d > 0; mult++) {
      addToPool(mult * d, 1);
    }
  }

  const timestamp = Date.now();
  const tsMod = (timestamp % range) + min;
  addToPool(tsMod, 2);
  addToPool(((timestamp >> 8) % range) + min, 1);
  addToPool(((timestamp >> 16) % range) + min, 1);

  if (state.isHoliday) {
    addToPool(state.dayOfMonth, 5);
    addToPool(state.month, 5);
    addToPool(state.dayOfMonth + state.month, 4);
    const holidayLen = (state.holidayName?.length || 0) % range + min;
    addToPool(holidayLen, 3);
  }

  if (state.isMasterDate && state.masterNumber) {
    for (let mult = 1; mult * state.masterNumber <= max; mult++) {
      addToPool(mult * state.masterNumber, 4);
    }
  }

  if (state.isMirrorTime) {
    addToPool(state.hour, 5);
    addToPool(state.minute, 5);
    addToPool(Number.parseInt(`${state.hour}${state.minute}`.slice(0, 2)), 3);
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
