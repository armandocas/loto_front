"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Rectangle,
} from "recharts";
import type { BarShapeProps } from "recharts";

interface DelayChartProps {
  data: Array<{ number: number; delay: number; lastSeen: number }>;
  color: string;
  maxItems?: number;
}

function getDelayColor(delay: number, maxDelay: number): string {
  const ratio = maxDelay > 0 ? delay / maxDelay : 0;
  const r = Math.round(34 + ratio * (239 - 34));
  const g = Math.round(197 - ratio * (197 - 68));
  const b = Math.round(94 - ratio * (94 - 68));
  return `rgb(${r},${g},${b})`;
}

interface ChartEntry {
  name: string;
  delay: number;
  lastSeen: number;
}

function createDelayBarShape(chartData: ChartEntry[], maxDelay: number) {
  return function DelayBarShape(props: BarShapeProps) {
    const entry = chartData[props.index];
    const fill = entry ? getDelayColor(entry.delay, maxDelay) : "hsl(var(--muted))";
    return <Rectangle {...props} fill={fill} />;
  };
}

export function DelayChart({ data, color, maxItems = 20 }: Readonly<DelayChartProps>) {
  const chartData = useMemo(() => {
    return data.slice(0, maxItems).map((d) => ({
      name: d.number.toString().padStart(2, "0"),
      delay: d.delay,
      lastSeen: d.lastSeen,
    }));
  }, [data, maxItems]);

  const maxDelay = chartData[0]?.delay ?? 1;
  const BarShape = useMemo(() => createDelayBarShape(chartData, maxDelay), [chartData, maxDelay]);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fontWeight: 600 }}
            width={32}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "13px",
            }}
            formatter={(value) => [`${value} concursos`, "Atraso"]}
            labelFormatter={(label) => `Número ${label}`}
          />
          <Bar dataKey="delay" radius={[0, 4, 4, 0]} barSize={16} shape={BarShape} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
