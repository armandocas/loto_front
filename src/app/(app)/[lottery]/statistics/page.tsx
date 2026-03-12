"use client";

import { use, useMemo, useState } from "react";
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
  PieChart,
  Pie,
  Sector,
} from "recharts";
import type { PieSectorShapeProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOTTERIES } from "@/constants/lotteries";
import { MOCK_RESULTS } from "@/mocks/results";
import { calculateDelays } from "@/lib/analysis/delay-analysis";
import { analyzeSequences } from "@/lib/analysis/sequence-analysis";
import { analyzePairs } from "@/lib/analysis/pair-analysis";
import { analyzeSums, getDecadeDistribution } from "@/lib/analysis/sum-analysis";
import { DelayChart } from "@/components/statistics/DelayChart";
import { PairHeatmap } from "@/components/statistics/PairHeatmap";
import { TrendChart } from "@/components/statistics/TrendChart";
import type { LotterySlug } from "@/types/lottery";

const PIE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const PieSectorShape = (props: PieSectorShapeProps) => (
  <Sector {...props} fill={PIE_COLORS[(props.index ?? 0) % PIE_COLORS.length]} />
);

interface Props {
  params: Promise<{ lottery: string }>;
}

export default function StatisticsPage({ params }: Readonly<Props>) {
  const { lottery: slug } = use(params);
  const config = LOTTERIES[slug as LotterySlug];
  const [tab, setTab] = useState("frequency");
  const [period, setPeriod] = useState<"all" | "30" | "100" | "500">("all");
  const [trendNumbers, setTrendNumbers] = useState<number[]>([]);

  if (!config) notFound();

  const results = useMemo(() => {
    const allResults = MOCK_RESULTS[slug as LotterySlug] || [];
    if (period === "all") return allResults;
    const count = Number(period);
    return allResults.slice(0, count);
  }, [slug, period]);

  const frequencyMap = useMemo(() => {
    const freq: Record<number, number> = {};
    for (const result of results) {
      for (const num of result.numbers) {
        freq[num] = (freq[num] || 0) + 1;
      }
    }
    return freq;
  }, [results]);

  const chartData = useMemo(() => {
    return Object.entries(frequencyMap)
      .map(([num, freq]) => ({
        number: num.padStart(2, "0"),
        frequency: freq,
      }))
      .sort((a, b) => Number.parseInt(a.number) - Number.parseInt(b.number));
  }, [frequencyMap]);

  const topNumbers = useMemo(() => {
    return Object.entries(frequencyMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([num, freq]) => ({ num: Number.parseInt(num), freq }));
  }, [frequencyMap]);

  const coldNumbers = useMemo(() => {
    return Object.entries(frequencyMap)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 10)
      .map(([num, freq]) => ({ num: Number.parseInt(num), freq }));
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

  const delays = useMemo(
    () => calculateDelays(results, config.numbers.max),
    [results, config.numbers.max]
  );

  const sequences = useMemo(() => analyzeSequences(results), [results]);

  const topPairs = useMemo(() => analyzePairs(results, 30), [results]);

  const sumStats = useMemo(() => analyzeSums(results), [results]);

  const decadeData = useMemo(
    () => getDecadeDistribution(results, config.numbers.max),
    [results, config.numbers.max]
  );

  const availableNumbers = useMemo(() => {
    const nums: number[] = [];
    for (let i = config.numbers.min; i <= Math.min(config.numbers.max, 80); i++) {
      nums.push(i);
    }
    return nums;
  }, [config.numbers.min, config.numbers.max]);

  function toggleTrendNumber(num: number) {
    setTrendNumbers((prev) => {
      if (prev.includes(num)) return prev.filter((n) => n !== num);
      if (prev.length >= 5) return prev;
      return [...prev, num];
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
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

        <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="30">Últimos 30</SelectItem>
            <SelectItem value="100">Últimos 100</SelectItem>
            <SelectItem value="500">Últimos 500</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass border-white/10">
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold">{results.length}</p>
            <p className="text-xs text-muted-foreground">Concursos</p>
          </CardContent>
        </Card>
        <Card className="glass border-white/10">
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold">{evenOddStats.evenPct}%</p>
            <p className="text-xs text-muted-foreground">Pares</p>
          </CardContent>
        </Card>
        <Card className="glass border-white/10">
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold">{Math.round(sumStats.average)}</p>
            <p className="text-xs text-muted-foreground">Soma Média</p>
          </CardContent>
        </Card>
        <Card className="glass border-white/10">
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold">{delays[0]?.delay ?? 0}</p>
            <p className="text-xs text-muted-foreground">Maior Atraso</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="frequency">Frequência</TabsTrigger>
          <TabsTrigger value="delay">Atraso</TabsTrigger>
          <TabsTrigger value="pairs">Pares</TabsTrigger>
          <TabsTrigger value="sums">Soma</TabsTrigger>
          <TabsTrigger value="decades">Décadas</TabsTrigger>
          <TabsTrigger value="trends">Tendência</TabsTrigger>
        </TabsList>

        <TabsContent value="frequency" className="space-y-6 mt-6">
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
                        <XAxis dataKey="number" tick={{ fontSize: 10 }} interval={0} />
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
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Mais Frequentes
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Quentes</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topNumbers.map(({ num, freq }) => (
                    <div key={num} className="flex items-center gap-3">
                      <span
                        className="w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center shrink-0"
                        style={{ backgroundColor: config.color, color: "white" }}
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
                      <span className="text-sm font-medium w-8 text-right">{freq}x</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Menos Frequentes
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Frios</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {coldNumbers.map(({ num, freq }) => (
                    <div key={num} className="flex items-center gap-3">
                      <span
                        className="w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center shrink-0 border-2"
                        style={{ borderColor: config.color, color: config.color }}
                      >
                        {num.toString().padStart(2, "0")}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-muted-foreground/30"
                          style={{ width: `${(freq / (topNumbers[0]?.freq || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{freq}x</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="delay" className="mt-6">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Números com Maior Atraso</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Quantos concursos cada número não é sorteado
              </p>
              <DelayChart
                data={delays}
                color={config.color}
                maxItems={20}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pairs" className="mt-6">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Pares Mais Frequentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Números que mais saem juntos no mesmo sorteio
              </p>
              <PairHeatmap
                data={topPairs}
                color={config.color}
                maxDisplay={30}
              />
            </CardContent>
          </Card>

          {sequences.length > 0 && (
            <Card className="glass border-white/10 mt-6">
              <CardHeader>
                <CardTitle>Sequências Consecutivas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Frequência de números consecutivos nos sorteios
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {sequences.map((s) => (
                    <Card key={s.length} className="glass border-white/5">
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold">{s.count}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.length} consecutivo{s.length > 1 ? "s" : ""}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {s.percentage.toFixed(1)}%
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sums" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="glass border-white/10">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{Math.round(sumStats.average)}</p>
                <p className="text-xs text-muted-foreground">Média</p>
              </CardContent>
            </Card>
            <Card className="glass border-white/10">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{sumStats.median}</p>
                <p className="text-xs text-muted-foreground">Mediana</p>
              </CardContent>
            </Card>
            <Card className="glass border-white/10">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{sumStats.min}</p>
                <p className="text-xs text-muted-foreground">Mínimo</p>
              </CardContent>
            </Card>
            <Card className="glass border-white/10">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{sumStats.max}</p>
                <p className="text-xs text-muted-foreground">Máximo</p>
              </CardContent>
            </Card>
          </div>

          {sumStats.distribution.length > 0 && (
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>Distribuição das Somas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sumStats.distribution}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="decades" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>Distribuição por Década</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {decadeData.map((item, i) => (
                    <div key={item.decade} className="flex items-center gap-3">
                      <span className="text-xs font-mono w-14 shrink-0">
                        {item.decade}
                      </span>
                      <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium w-12 text-right">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {decadeData.length > 0 && (
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle>Distribuição Visual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={decadeData}
                          dataKey="count"
                          nameKey="decade"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name }) => name}
                          shape={PieSectorShape}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="mt-6 space-y-6">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Tendência de Frequência</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Acompanhe a frequência dos números ao longo dos concursos
              </p>
              <TrendChart
                results={results}
                selectedNumbers={trendNumbers}
                color={config.color}
              />
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Selecione os Números
                <Badge variant="outline" className="text-xs font-normal">
                  {trendNumbers.length}/5
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Clique para selecionar até 5 números para acompanhar
              </p>
              <div className="flex flex-wrap gap-1.5">
                {availableNumbers.map((num) => {
                  const isSelected = trendNumbers.includes(num);
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => toggleTrendNumber(num)}
                      className="w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: isSelected ? config.color : "transparent",
                        color: isSelected ? "white" : "hsl(var(--muted-foreground))",
                        border: isSelected
                          ? `2px solid ${config.color}`
                          : "2px solid hsl(var(--border))",
                        opacity: !isSelected && trendNumbers.length >= 5 ? 0.4 : 1,
                        cursor:
                          !isSelected && trendNumbers.length >= 5
                            ? "not-allowed"
                            : "pointer",
                      }}
                      disabled={!isSelected && trendNumbers.length >= 5}
                    >
                      {num.toString().padStart(2, "0")}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
