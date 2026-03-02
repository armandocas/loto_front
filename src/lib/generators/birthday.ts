import type { LotteryConfig } from "@/types/lottery";

function extractDateNumbers(dateStr: string): number[] {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return [];

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const yearDigits = year
    .toString()
    .split("")
    .map(Number);
  const yearSum = yearDigits.reduce((a, b) => a + b, 0);

  let reduced = yearSum;
  while (reduced > 9) {
    reduced = reduced
      .toString()
      .split("")
      .reduce((a, b) => a + parseInt(b), 0);
  }

  return [
    day,
    month,
    day + month,
    Math.abs(day - month),
    yearSum,
    reduced,
    ...yearDigits,
    parseInt(year.toString().slice(-2)),
  ];
}

function deriveNumbersFromDates(
  dates: string[],
  min: number,
  max: number
): number[] {
  const allNumbers = new Set<number>();

  for (const dateStr of dates) {
    const nums = extractDateNumbers(dateStr);
    for (const n of nums) {
      if (n >= min && n <= max) allNumbers.add(n);
    }

    const baseNums = nums.filter((n) => n > 0);
    for (const base of baseNums) {
      for (let mult = 1; mult * base <= max; mult++) {
        const val = mult * base;
        if (val >= min && val <= max) allNumbers.add(val);
      }
    }

    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        const sum = nums[i] + nums[j];
        if (sum >= min && sum <= max) allNumbers.add(sum);
        const diff = Math.abs(nums[i] - nums[j]);
        if (diff >= min && diff <= max) allNumbers.add(diff);
      }
    }
  }

  return Array.from(allNumbers);
}

export function generateByBirthday(
  config: LotteryConfig,
  dates: string[]
): number[] {
  const { min, max, pick } = config.numbers;
  const pool = deriveNumbersFromDates(dates, min, max);
  const selected = new Set<number>();

  while (selected.size < pick) {
    if (pool.length > 0 && selected.size < Math.ceil(pick * 0.7)) {
      const idx = Math.floor(Math.random() * pool.length);
      selected.add(pool[idx]);
    } else {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      selected.add(num);
    }
  }

  return Array.from(selected).sort((a, b) => a - b);
}
