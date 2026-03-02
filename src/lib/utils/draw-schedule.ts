import { LOTTERIES, LOTTERY_SLUGS } from "@/constants/lotteries";
import type { LotterySlug } from "@/types/lottery";

const DAY_MAP: Record<string, number> = {
  dom: 0, seg: 1, ter: 2, qua: 3, qui: 4, sex: 5, "sáb": 6, sab: 6,
};

const FULL_DAY_MAP: Record<string, number> = {
  "domingo": 0, "segunda": 1, "terça": 2, "terca": 2,
  "quarta": 3, "quinta": 4, "sexta": 5, "sábado": 6, "sabado": 6,
  ...DAY_MAP,
};

export interface UpcomingDraw {
  lottery: LotterySlug;
  lotteryName: string;
  color: string;
  date: Date;
  dayLabel: string;
}

function parseDayToNumbers(drawDays: string[]): number[] {
  const days: number[] = [];
  for (const day of drawDays) {
    const normalized = day.toLowerCase().trim();
    if (normalized.includes(" a ")) {
      const [start, end] = normalized.split(" a ").map((d) => FULL_DAY_MAP[d.trim()]);
      if (start !== undefined && end !== undefined) {
        for (let d = start; d <= end; d++) days.push(d);
        if (end < start) {
          for (let d = start; d <= 6; d++) days.push(d);
          for (let d = 0; d <= end; d++) days.push(d);
        }
      }
    } else {
      const num = FULL_DAY_MAP[normalized];
      if (num !== undefined) days.push(num);
    }
  }
  return [...new Set(days)];
}

const DAY_LABELS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function getUpcomingDraws(daysAhead = 7): UpcomingDraw[] {
  const draws: UpcomingDraw[] = [];
  const now = new Date();

  for (const slug of LOTTERY_SLUGS) {
    const config = LOTTERIES[slug];
    const drawDayNumbers = parseDayToNumbers(config.drawDays);

    for (let offset = 0; offset <= daysAhead; offset++) {
      const date = new Date(now);
      date.setDate(date.getDate() + offset);
      date.setHours(20, 0, 0, 0);

      if (drawDayNumbers.includes(date.getDay())) {
        draws.push({
          lottery: slug,
          lotteryName: config.name,
          color: config.color,
          date,
          dayLabel: DAY_LABELS[date.getDay()],
        });
      }
    }
  }

  return draws.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getNextDraw(slug: LotterySlug): UpcomingDraw | undefined {
  return getUpcomingDraws(14).find((d) => d.lottery === slug);
}

export function getDrawsForDate(date: Date): UpcomingDraw[] {
  return getUpcomingDraws(30).filter(
    (d) => d.date.toDateString() === date.toDateString()
  );
}
