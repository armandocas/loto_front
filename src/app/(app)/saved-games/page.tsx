"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  Trash2,
  Copy,
  Inbox,
  Filter,
  Download,
  Share2,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFeatureGate } from "@/hooks/use-feature-gate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOTTERIES, GENERATION_METHODS, LOTTERY_SLUGS } from "@/constants/lotteries";
import { useGameStore } from "@/stores/game.store";
import { ShareGameDialog } from "@/components/games/ShareGameDialog";
import { downloadCSV } from "@/lib/export/game-csv";
import type { LotterySlug } from "@/types/lottery";

export default function SavedGamesPage() {
  const { savedGames, removeSavedGame } = useGameStore();
  const [filterLottery, setFilterLottery] = useState<string>("all");
  const [filterMethod, setFilterMethod] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const filteredGames = useMemo(() => {
    let result = [...savedGames];

    if (filterLottery !== "all") {
      result = result.filter((g) => g.lottery === filterLottery);
    }
    if (filterMethod !== "all") {
      result = result.filter((g) => g.method === filterMethod);
    }

    if (sortBy === "oldest") {
      result.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sortBy === "hits") {
      result.sort((a, b) => {
        const aHits = a.checkedResults?.reduce(
          (max, r) => Math.max(max, r.hitCount),
          0
        ) ?? 0;
        const bHits = b.checkedResults?.reduce(
          (max, r) => Math.max(max, r.hitCount),
          0
        ) ?? 0;
        return bHits - aHits;
      });
    }

    return result;
  }, [savedGames, filterLottery, filterMethod, sortBy]);

  function handleCopy(numbers: number[]) {
    const text = numbers.map((n) => n.toString().padStart(2, "0")).join(", ");
    navigator.clipboard.writeText(text);
    toast.success("Números copiados!");
  }

  function handleRemove(id: string) {
    removeSavedGame(id);
    toast.success("Jogo removido!");
  }

  const { checkFeature } = useFeatureGate();

  function handleExportAll() {
    if (!checkFeature("exportEnabled")) {
      toast.error("Exportação disponível nos planos Premium e Pro.");
      return;
    }
    if (filteredGames.length === 0) return;
    downloadCSV(filteredGames, "lotosmart-jogos-salvos");
    toast.success("Jogos exportados em CSV!");
  }

  const usedMethods = useMemo(() => {
    const methods = new Set(savedGames.map((g) => g.method));
    return GENERATION_METHODS.filter((m) => methods.has(m.id));
  }, [savedGames]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bookmark className="h-8 w-8" />
            Jogos Salvos
          </h1>
          <p className="text-muted-foreground mt-1">
            {filteredGames.length} de {savedGames.length} jogo
            {savedGames.length !== 1 ? "s" : ""}
          </p>
        </div>
        {savedGames.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExportAll}>
            <Download className="mr-1 h-4 w-4" />
            Exportar CSV
          </Button>
        )}
      </div>

      {savedGames.length > 0 && (
        <div className="flex flex-wrap gap-3 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterLottery} onValueChange={setFilterLottery}>
            <SelectTrigger className="w-[160px] h-8 text-xs">
              <SelectValue placeholder="Loteria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas loterias</SelectItem>
              {LOTTERY_SLUGS.map((slug) => (
                <SelectItem key={slug} value={slug}>
                  {LOTTERIES[slug].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterMethod} onValueChange={setFilterMethod}>
            <SelectTrigger className="w-[160px] h-8 text-xs">
              <SelectValue placeholder="Método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos métodos</SelectItem>
              {usedMethods.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais recentes</SelectItem>
              <SelectItem value="oldest">Mais antigos</SelectItem>
              <SelectItem value="hits">Mais acertos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {filteredGames.length === 0 ? (
        <Card className="glass border-white/10">
          <CardContent className="p-12 text-center space-y-4">
            <Inbox className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <div>
              <h3 className="text-lg font-semibold">
                {savedGames.length === 0
                  ? "Nenhum jogo salvo"
                  : "Nenhum jogo encontrado"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {savedGames.length === 0
                  ? "Gere jogos e salve seus favoritos aqui."
                  : "Tente ajustar os filtros."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGames.map((game) => {
              const lotteryConfig = LOTTERIES[game.lottery];
              const bestHit =
                game.checkedResults?.reduce(
                  (max, r) => (r.hitCount > max ? r.hitCount : max),
                  0
                ) ?? 0;
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
                        <div className="flex items-center gap-1">
                          {bestHit > 0 && (
                            <Badge className="text-[10px] bg-green-500/20 text-green-400">
                              <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
                              {bestHit}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-[10px]">
                            {GENERATION_METHODS.find(
                              (m) => m.id === game.method
                            )?.name || game.method}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {game.numbers.map((num, i) => {
                          const hitSet = new Set(
                            game.checkedResults?.flatMap((r) => r.hits) ?? []
                          );
                          return (
                            <span
                              key={`${num}-${i}`}
                              className={`w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center ${
                                hitSet.has(num)
                                  ? "bg-green-500 text-white"
                                  : ""
                              }`}
                              style={
                                !hitSet.has(num)
                                  ? {
                                      backgroundColor: `${lotteryConfig.color}20`,
                                      color: lotteryConfig.color,
                                    }
                                  : undefined
                              }
                            >
                              {num.toString().padStart(2, "0")}
                            </span>
                          );
                        })}
                        {game.extraNumbers?.map((num, i) => (
                          <span
                            key={`extra-${num}-${i}`}
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

                      {game.audit && (
                        <p className="text-[10px] text-muted-foreground/60 font-mono truncate">
                          Seed: {game.audit.seed || game.audit.timestamp}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground">
                        {new Date(game.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(game.numbers)}
                          className="flex-1 text-xs h-8"
                        >
                          <Copy className="mr-1 h-3 w-3" />
                          Copiar
                        </Button>
                        <ShareGameDialog
                          game={game}
                          trigger={
                            <Button variant="ghost" size="sm" className="flex-1 text-xs h-8">
                              <Share2 className="mr-1 h-3 w-3" />
                              Enviar
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(game.id)}
                          className="text-destructive hover:text-destructive h-8"
                        >
                          <Trash2 className="h-3 w-3" />
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
