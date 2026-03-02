"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUpcomingDraws } from "@/lib/utils/draw-schedule";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

const DAYS_OF_WEEK = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });

  const allDraws = useMemo(() => getUpcomingDraws(60), []);

  const calendarDays = useMemo(() => {
    const first = new Date(currentMonth.year, currentMonth.month, 1);
    const last = new Date(currentMonth.year, currentMonth.month + 1, 0);
    const startDay = first.getDay();
    const totalDays = last.getDate();
    const days: { date: Date | null; day: number }[] = [];

    for (let i = 0; i < startDay; i++) days.push({ date: null, day: 0 });
    for (let d = 1; d <= totalDays; d++) {
      days.push({
        date: new Date(currentMonth.year, currentMonth.month, d),
        day: d,
      });
    }
    return days;
  }, [currentMonth]);

  function prevMonth() {
    setCurrentMonth((prev) => {
      if (prev.month === 0) return { month: 11, year: prev.year - 1 };
      return { ...prev, month: prev.month - 1 };
    });
  }

  function nextMonth() {
    setCurrentMonth((prev) => {
      if (prev.month === 11) return { month: 0, year: prev.year + 1 };
      return { ...prev, month: prev.month + 1 };
    });
  }

  function getDrawsForDay(date: Date | null) {
    if (!date) return [];
    return allDraws.filter(
      (d) => d.date.toDateString() === date.toDateString()
    );
  }

  const today = new Date();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CalendarDays className="h-8 w-8" />
          Calendário de Sorteios
        </h1>
        <p className="text-muted-foreground mt-1">
          Veja todos os sorteios do mês
        </p>
      </div>

      <Card className="glass border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              {MONTH_NAMES[currentMonth.month]} {currentMonth.year}
            </h2>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
            {calendarDays.map((item, i) => {
              const draws = getDrawsForDay(item.date);
              const isToday = item.date?.toDateString() === today.toDateString();

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.005 }}
                  className={`min-h-[80px] rounded-lg p-1.5 border transition-colors ${
                    item.date
                      ? isToday
                        ? "border-primary/50 bg-primary/5"
                        : "border-white/5 hover:border-white/10"
                      : "border-transparent"
                  }`}
                >
                  {item.date && (
                    <>
                      <p
                        className={`text-xs font-medium mb-1 ${
                          isToday ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {item.day}
                      </p>
                      <div className="space-y-0.5">
                        {draws.slice(0, 3).map((draw) => (
                          <Link
                            key={`${draw.lottery}-${item.day}`}
                            href={ROUTES.lottery(draw.lottery)}
                          >
                            <div
                              className="text-[9px] leading-tight rounded px-1 py-0.5 truncate cursor-pointer hover:opacity-80"
                              style={{
                                backgroundColor: `${draw.color}20`,
                                color: draw.color,
                              }}
                            >
                              {draw.lotteryName}
                            </div>
                          </Link>
                        ))}
                        {draws.length > 3 && (
                          <p className="text-[9px] text-muted-foreground">
                            +{draws.length - 3}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Próximos Sorteios</h2>
        <div className="space-y-2">
          {allDraws.slice(0, 15).map((draw, i) => {
            const isToday = draw.date.toDateString() === today.toDateString();
            return (
              <Link key={`${draw.lottery}-${i}`} href={ROUTES.lottery(draw.lottery)}>
                <Card className="glass border-white/10 hover:border-white/20 transition-all cursor-pointer">
                  <CardContent className="p-3 flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: draw.color }}
                    >
                      {draw.lotteryName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{draw.lotteryName}</p>
                      <p className="text-xs text-muted-foreground">
                        {draw.dayLabel},{" "}
                        {draw.date.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                        })}
                      </p>
                    </div>
                    {isToday && (
                      <Badge className="bg-yellow-500/20 text-yellow-400">HOJE</Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
