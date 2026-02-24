"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shuffle,
  BarChart3,
  Flame,
  TrendingUp,
  SlidersHorizontal,
  Brain,
  Bookmark,
  Copy,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOTTERIES, GENERATION_METHODS } from "@/constants/lotteries";
import { generateGames } from "@/lib/generators";
import { useGameStore } from "@/stores/game.store";
import { MOCK_RESULTS, getMockFrequency } from "@/mocks/results";
import type { LotterySlug } from "@/types/lottery";
import type { GenerationMethod, GeneratedGame } from "@/types/game";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shuffle,
  BarChart3,
  Flame,
  TrendingUp,
  SlidersHorizontal,
  Brain,
};

interface Props {
  params: Promise<{ lottery: string }>;
}

export default function GeneratePage({ params }: Props) {
  const { lottery: slug } = use(params);
  const config = LOTTERIES[slug as LotterySlug];

  if (!config) notFound();

  const [method, setMethod] = useState<GenerationMethod>("random");
  const [quantity, setQuantity] = useState("1");
  const [games, setGames] = useState<GeneratedGame[]>([]);
  const { addGeneratedGames, saveGame } = useGameStore();

  function handleGenerate() {
    const results = MOCK_RESULTS[slug as LotterySlug] || [];
    const frequencyMap = getMockFrequency(slug as LotterySlug);

    const newGames = generateGames({
      config,
      method,
      quantity: parseInt(quantity),
      results,
      frequencyMap,
    });

    setGames(newGames);
    addGeneratedGames(newGames);
    toast.success(
      `${newGames.length} jogo${newGames.length > 1 ? "s" : ""} gerado${newGames.length > 1 ? "s" : ""}!`
    );
  }

  function handleSave(game: GeneratedGame) {
    saveGame(game);
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, saved: true } : g))
    );
    toast.success("Jogo salvo!");
  }

  function handleCopy(game: GeneratedGame) {
    const text = game.numbers.map((n) => n.toString().padStart(2, "0")).join(", ");
    navigator.clipboard.writeText(text);
    toast.success("Números copiados!");
  }

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
          <h1 className="text-2xl font-bold">Gerar Jogos - {config.name}</h1>
          <p className="text-muted-foreground text-sm">{config.description}</p>
        </div>
      </div>

      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle>Método de Geração</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {GENERATION_METHODS.map((m) => {
              const Icon = iconMap[m.icon];
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`p-4 rounded-xl border text-center space-y-2 transition-all ${
                    method === m.id
                      ? "border-primary bg-primary/10 neon-glow"
                      : "border-white/10 hover:border-white/20 glass"
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`h-6 w-6 mx-auto ${method === m.id ? "text-primary" : "text-muted-foreground"}`}
                    />
                  )}
                  <p className="text-xs font-medium">{m.name}</p>
                </button>
              );
            })}
          </div>

          <p className="text-sm text-muted-foreground">
            {GENERATION_METHODS.find((m) => m.id === method)?.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 w-full sm:w-48">
              <label className="text-sm font-medium">Quantidade</label>
              <Select value={quantity} onValueChange={setQuantity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 3, 5, 10, 20].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} jogo{n > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              size="lg"
              className="neon-glow w-full sm:w-auto"
            >
              <Shuffle className="mr-2 h-5 w-5" />
              Gerar Jogos
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="popLayout">
        {games.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Jogos Gerados ({games.length})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGames([])}
                className="text-muted-foreground"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((game, idx) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="glass border-white/10">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px]">
                          {GENERATION_METHODS.find((m) => m.id === game.method)
                            ?.name || game.method}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          #{idx + 1}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {game.numbers.map((num, i) => (
                          <span
                            key={i}
                            className="w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center"
                            style={{
                              backgroundColor: config.color,
                              color: "white",
                            }}
                          >
                            {num.toString().padStart(2, "0")}
                          </span>
                        ))}
                        {game.extraNumbers?.map((num, i) => (
                          <span
                            key={`extra-${i}`}
                            className="w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center border-2"
                            style={{
                              borderColor: config.color,
                              color: config.color,
                            }}
                          >
                            {num.toString().padStart(2, "0")}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(game)}
                          className="flex-1"
                        >
                          <Copy className="mr-1 h-3 w-3" />
                          Copiar
                        </Button>
                        <Button
                          variant={game.saved ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => handleSave(game)}
                          disabled={game.saved}
                          className="flex-1"
                        >
                          <Bookmark className="mr-1 h-3 w-3" />
                          {game.saved ? "Salvo" : "Salvar"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
