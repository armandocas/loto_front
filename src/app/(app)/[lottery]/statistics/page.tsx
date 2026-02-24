"use client";

import { use, useMemo } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LOTTERIES } from "@/constants/lotteries";
import { getMockFrequency, MOCK_RESULTS } from "@/mocks/results";
import type { LotterySlug } from "@/types/lottery";

interface Props {
  params: Promise<{ lottery: string }>;
}

export default function StatisticsPage({ params }: Props) {
  const { lottery: slug } = use(params);
  const config = LOTTERIES[slug as LotterySlug];

  if (!config) notFound();

  const frequencyMap = getMockFrequency(slug as LotterySlug);
  const results = MOCK_RESULTS[slug as LotterySlug] || [];

  const chartData = useMemo(() => {
    const entries = Object.entries(frequencyMap)
      .map(([num, freq]) => ({
        number: num.padStart(2, "0"),
        frequency: freq,
      }))
      .sort((a, b) => parseInt(a.number) - parseInt(b.number));

    return entries;
  }, [frequencyMap]);

  const topNumbers = useMemo(() => {
    return Object.entries(frequencyMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([num, freq]) => ({ num: parseInt(num), freq }));
  }, [frequencyMap]);

  const coldNumbers = useMemo(() => {
    return Object.entries(frequencyMap)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 10)
      .map(([num, freq]) => ({ num: parseInt(num), freq }));
  }, [frequencyMap]);

  const evenOddStats = useMemo(() => {
    let totalEven = 0;
    let totalOdd = 0;
    for (const result of results) {
      for (const num of result.numbers) {
        if (num % 2 === 0) totalEven++;
        else totalOdd++;
      }
    }
    const total = totalEven + totalOdd || 1;
    return {
      even: totalEven,
      odd: totalOdd,
      evenPct: ((totalEven / total) * 100).toFixed(1),
      oddPct: ((totalOdd / total) * 100).toFixed(1),
    };
  }, [results]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: config.color }}
        >
          {config.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">Estatísticas - {config.name}</h1>
          <p className="text-muted-foreground text-sm">
            Análise baseada nos últimos {results.length} concursos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass border-white/10">
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold">{results.length}</p>
            <p className="text-sm text-muted-foreground">Concursos analisados</p>
          </CardContent>
        </Card>
        <Card className="glass border-white/10">
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold">{evenOddStats.evenPct}%</p>
            <p className="text-sm text-muted-foreground">Números pares</p>
          </CardContent>
        </Card>
        <Card className="glass border-white/10">
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold">{evenOddStats.oddPct}%</p>
            <p className="text-sm text-muted-foreground">Números ímpares</p>
          </CardContent>
        </Card>
      </div>

      {chartData.length <= 50 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Frequência dos Números</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="number"
                      tick={{ fontSize: 10 }}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="frequency" fill={config.color} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass border-white/10 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Números Mais Frequentes
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  Quentes
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topNumbers.map(({ num, freq }) => (
                  <div key={num} className="flex items-center gap-3">
                    <span
                      className="w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: config.color,
                        color: "white",
                      }}
                    >
                      {num.toString().padStart(2, "0")}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(freq / (topNumbers[0]?.freq || 1)) * 100}%`,
                          backgroundColor: config.color,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">
                      {freq}x
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-white/10 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Números Menos Frequentes
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Frios
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {coldNumbers.map(({ num, freq }) => (
                  <div key={num} className="flex items-center gap-3">
                    <span
                      className="w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center shrink-0 border-2"
                      style={{
                        borderColor: config.color,
                        color: config.color,
                      }}
                    >
                      {num.toString().padStart(2, "0")}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-muted-foreground/30"
                        style={{
                          width: `${(freq / (topNumbers[0]?.freq || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">
                      {freq}x
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
