"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Dices, BarChart3, History, ArrowRight, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LOTTERIES } from "@/constants/lotteries";
import { ROUTES } from "@/constants/routes";
import { MOCK_RESULTS } from "@/mocks/results";
import type { LotterySlug } from "@/types/lottery";

interface Props {
  params: Promise<{ lottery: string }>;
}

export default function LotteryPage({ params }: Props) {
  const { lottery: slug } = use(params);
  const config = LOTTERIES[slug as LotterySlug];

  if (!config) notFound();

  const latestResult = MOCK_RESULTS[slug as LotterySlug]?.[0];

  const actions = [
    {
      href: ROUTES.lotteryGenerate(slug),
      icon: Dices,
      title: "Gerar Jogos",
      description: "Crie novas combinações usando múltiplos métodos",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      href: ROUTES.lotteryResults(slug),
      icon: History,
      title: "Resultados",
      description: "Veja os últimos resultados e confira seus jogos",
      gradient: "from-purple-500 to-fuchsia-600",
    },
    {
      href: ROUTES.lotteryStatistics(slug),
      icon: BarChart3,
      title: "Estatísticas",
      description: "Análise de frequência e padrões dos números",
      gradient: "from-cyan-500 to-teal-600",
    },
    {
      href: ROUTES.lotteryCheck(slug),
      icon: Search,
      title: "Conferir Jogos",
      description: "Confira seus jogos salvos contra os resultados",
      gradient: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
          style={{ backgroundColor: config.color }}
        >
          {config.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{config.name}</h1>
          <p className="text-muted-foreground">{config.description}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, i) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={action.href}>
              <Card className="group glass border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center`}
                    >
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {latestResult && (
        <Card className="glass border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Último Resultado</CardTitle>
              <Badge variant="outline">
                Concurso {latestResult.contestNumber}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {latestResult.numbers.map((num, i) => (
                <span
                  key={i}
                  className="w-11 h-11 rounded-full text-sm font-bold flex items-center justify-center"
                  style={{
                    backgroundColor: config.color,
                    color: "white",
                  }}
                >
                  {num.toString().padStart(2, "0")}
                </span>
              ))}
              {latestResult.extraNumbers?.map((num, i) => (
                <span
                  key={`extra-${i}`}
                  className="w-11 h-11 rounded-full text-sm font-bold flex items-center justify-center border-2"
                  style={{
                    borderColor: config.color,
                    color: config.color,
                  }}
                >
                  {num.toString().padStart(2, "0")}
                </span>
              ))}
            </div>

            {latestResult.accumulated && latestResult.accumulatedValue && (
              <p className="text-sm text-muted-foreground">
                Acumulado:{" "}
                <span className="font-semibold text-foreground">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(latestResult.accumulatedValue)}
                </span>
              </p>
            )}

            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.lotteryResults(slug)}>
                Ver todos os resultados
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Números</p>
              <p className="font-semibold">
                {config.numbers.pick} de {config.numbers.min} a{" "}
                {config.numbers.max}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Sorteios</p>
              <p className="font-semibold capitalize">
                {config.drawDays.join(", ")}
              </p>
            </div>
            {config.extraNumbers && (
              <div>
                <p className="text-muted-foreground">Extra</p>
                <p className="font-semibold">
                  {config.extraNumbers.pick} de {config.extraNumbers.min} a{" "}
                  {config.extraNumbers.max}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
