"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LOTTERIES } from "@/constants/lotteries";
import { MOCK_RESULTS } from "@/mocks/results";
import type { LotterySlug } from "@/types/lottery";

interface Props {
  params: Promise<{ lottery: string }>;
}

export default function ResultsPage({ params }: Props) {
  const { lottery: slug } = use(params);
  const config = LOTTERIES[slug as LotterySlug];

  if (!config) notFound();

  const results = MOCK_RESULTS[slug as LotterySlug] || [];

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
          <h1 className="text-2xl font-bold">Resultados - {config.name}</h1>
          <p className="text-muted-foreground text-sm">
            Últimos concursos realizados
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {results.map((result, i) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="glass border-white/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base flex items-center gap-3">
                    <Badge variant="outline">
                      Concurso {result.contestNumber}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(result.date).toLocaleDateString("pt-BR")}
                    </span>
                  </CardTitle>
                  {result.accumulated && (
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                      Acumulado
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2.5">
                  {result.numbers.map((num, j) => (
                    <span
                      key={j}
                      className="w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center"
                      style={{
                        backgroundColor: config.color,
                        color: "white",
                      }}
                    >
                      {num.toString().padStart(2, "0")}
                    </span>
                  ))}
                  {result.extraNumbers?.map((num, j) => (
                    <span
                      key={`extra-${j}`}
                      className="w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center border-2"
                      style={{
                        borderColor: config.color,
                        color: config.color,
                      }}
                    >
                      {num.toString().padStart(2, "0")}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  {result.prizes.map((prize) => (
                    <div
                      key={prize.tier}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <span className="font-medium text-foreground">
                        {prize.tier}:
                      </span>
                      <span>
                        {prize.winners} ganhador{prize.winners !== 1 ? "es" : ""}
                      </span>
                      {prize.value > 0 && (
                        <span className="text-foreground">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(prize.value)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {result.accumulated && result.accumulatedValue && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">
                      Prêmio acumulado:{" "}
                    </span>
                    <span className="font-semibold text-foreground">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(result.accumulatedValue)}
                    </span>
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
