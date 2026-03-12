"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { LotteryResult } from "@/types/lottery";

interface TrendChartProps {
  results: LotteryResult[];
  selectedNumbers: number[];
  color: string;
}

const LINE_COLORS = ["#6366f1", "#f59e0b", "#22c55e", "#ef4444", "#06b6d4"];

export function TrendChart({ results, selectedNumbers, color }: Readonly<TrendChartProps>) {
  const chartData = useMemo(() => {
    if (selectedNumbers.length === 0 || results.length === 0) return [];

    const sorted = [...results].sort((a, b) => a.contestNumber - b.contestNumber);
    const windowSize = 10;
    const windows: typeof sorted[] = [];

    for (let i = 0; i < sorted.length; i += windowSize) {
      windows.push(sorted.slice(i, i + windowSize));
    }

    return windows.map((window) => {
      const first = window[0].contestNumber;
      const last = window.at(-1)!.contestNumber;
      const label = `${first}-${last}`;

      const entry: Record<string, string | number> = { range: label };

      for (const num of selectedNumbers) {
        const count = window.filter((r) => r.numbers.includes(num)).length;
        entry[`n${num.toString().padStart(2, "0")}`] = count;
      }

      return entry;
    });
  }, [results, selectedNumbers]);

  if (selectedNumbers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Selecione até 5 números abaixo para acompanhar a tendência
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Dados insuficientes para exibir tendência
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ left: 0, right: 16, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis
            dataKey="range"
            tick={{ fontSize: 10 }}
            angle={-30}
            textAnchor="end"
            height={50}
          />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "13px",
            }}
            labelFormatter={(label) => `Concursos ${label}`}
          />
          <Legend
            formatter={(value: string) => {
              const num = value.replace("n", "");
              return `Nº ${num}`;
            }}
          />
          {selectedNumbers.map((num, i) => (
            <Line
              key={num}
              type="monotone"
              dataKey={`n${num.toString().padStart(2, "0")}`}
              stroke={LINE_COLORS[i % LINE_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
