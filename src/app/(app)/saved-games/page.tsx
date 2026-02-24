"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Trash2, Copy, Inbox } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LOTTERIES, GENERATION_METHODS } from "@/constants/lotteries";
import { useGameStore } from "@/stores/game.store";

export default function SavedGamesPage() {
  const { savedGames, removeSavedGame } = useGameStore();

  function handleCopy(numbers: number[]) {
    const text = numbers.map((n) => n.toString().padStart(2, "0")).join(", ");
    navigator.clipboard.writeText(text);
    toast.success("Números copiados!");
  }

  function handleRemove(id: string) {
    removeSavedGame(id);
    toast.success("Jogo removido!");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Bookmark className="h-8 w-8" />
          Jogos Salvos
        </h1>
        <p className="text-muted-foreground mt-1">
          {savedGames.length} jogo{savedGames.length !== 1 ? "s" : ""} salvo
          {savedGames.length !== 1 ? "s" : ""}
        </p>
      </div>

      {savedGames.length === 0 ? (
        <Card className="glass border-white/10">
          <CardContent className="p-12 text-center space-y-4">
            <Inbox className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <div>
              <h3 className="text-lg font-semibold">Nenhum jogo salvo</h3>
              <p className="text-muted-foreground text-sm">
                Gere jogos e salve seus favoritos aqui.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedGames.map((game) => {
              const lotteryConfig = LOTTERIES[game.lottery];
              return (
                <motion.div
                  key={game.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="glass border-white/10 h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: lotteryConfig.color,
                            }}
                          />
                          {lotteryConfig.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-[10px]">
                          {GENERATION_METHODS.find(
                            (m) => m.id === game.method
                          )?.name || game.method}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {game.numbers.map((num, i) => (
                          <span
                            key={i}
                            className="w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center"
                            style={{
                              backgroundColor: `${lotteryConfig.color}20`,
                              color: lotteryConfig.color,
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
                              borderColor: lotteryConfig.color,
                              color: lotteryConfig.color,
                            }}
                          >
                            {num.toString().padStart(2, "0")}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {new Date(game.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(game.numbers)}
                          className="flex-1"
                        >
                          <Copy className="mr-1 h-3 w-3" />
                          Copiar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(game.id)}
                          className="flex-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Remover
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
