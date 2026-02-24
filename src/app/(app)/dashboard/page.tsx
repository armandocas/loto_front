"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Dices,
  Bookmark,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LOTTERIES } from "@/constants/lotteries";
import { ROUTES } from "@/constants/routes";
import { useGameStore } from "@/stores/game.store";
import { useAuthContext } from "@/lib/firebase/providers";

const stats = [
  {
    label: "Jogos Gerados",
    icon: Dices,
    getValue: (count: number) => count.toString(),
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    label: "Jogos Salvos",
    icon: Bookmark,
    getValue: (count: number) => count.toString(),
    gradient: "from-purple-500 to-fuchsia-600",
  },
  {
    label: "Loterias",
    icon: Trophy,
    getValue: () => "10",
    gradient: "from-cyan-500 to-teal-600",
  },
  {
    label: "Métodos de Geração",
    icon: TrendingUp,
    getValue: () => "6",
    gradient: "from-orange-500 to-amber-600",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function DashboardPage() {
  const { user } = useAuthContext();
  const { generatedGames, savedGames } = useGameStore();
  const lotteries = Object.values(LOTTERIES);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Olá, {user?.displayName?.split(" ")[0] || "Jogador"}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Escolha uma loteria e comece a gerar seus jogos.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className="glass border-white/10">
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shrink-0`}
                >
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {stat.getValue(
                      i === 0 ? generatedGames.length : savedGames.length
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Loterias</h2>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {lotteries.map((lottery) => (
            <motion.div key={lottery.slug} variants={itemVariants}>
              <Link href={ROUTES.lottery(lottery.slug)}>
                <Card className="group glass border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: lottery.color }}
                      >
                        {lottery.name.slice(0, 2).toUpperCase()}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{lottery.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {lottery.description}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">
                        R$ {lottery.price.toFixed(2)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {generatedGames.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Jogos Recentes</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.savedGames}>Ver todos</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedGames.slice(0, 6).map((game) => {
              const lotteryConfig = LOTTERIES[game.lottery];
              return (
                <Card key={game.id} className="glass border-white/10">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: lotteryConfig.color }}
                        />
                        {lotteryConfig.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px]">
                        {game.method}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {game.numbers.map((num, i) => (
                        <span
                          key={i}
                          className="w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center"
                          style={{
                            backgroundColor: `${lotteryConfig.color}20`,
                            color: lotteryConfig.color,
                          }}
                        >
                          {num.toString().padStart(2, "0")}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
