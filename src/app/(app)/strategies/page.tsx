"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Plus,
  Trash2,
  Play,
  Inbox,
  Clock,
  Hash,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFeatureGate } from "@/hooks/use-feature-gate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOTTERIES, GENERATION_METHODS, LOTTERY_SLUGS } from "@/constants/lotteries";
import { ROUTES } from "@/constants/routes";
import { useStrategyStore } from "@/stores/strategy.store";
import { useGameStore } from "@/stores/game.store";
import { generateGames } from "@/lib/generators";
import type { LotterySlug } from "@/types/lottery";
import type { GenerationMethod } from "@/types/game";

export default function StrategiesPage() {
  const { strategies, addStrategy, removeStrategy, markUsed } = useStrategyStore();
  const { addGeneratedGames, saveGame } = useGameStore();
  const router = useRouter();

  const [newName, setNewName] = useState("");
  const [newLottery, setNewLottery] = useState<string>("");
  const [newMethod, setNewMethod] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState(1);

  const { canSaveMoreStrategies } = useFeatureGate();

  function handleCreate() {
    if (!canSaveMoreStrategies(strategies.length)) {
      toast.error("Você atingiu o limite de estratégias do seu plano. Faça upgrade para criar mais.");
      return;
    }
    if (!newName.trim() || !newLottery || !newMethod) {
      toast.error("Preencha todos os campos.");
      return;
    }
    addStrategy({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: newName.trim(),
      lottery: newLottery as LotterySlug,
      method: newMethod as GenerationMethod,
      quantity: newQuantity,
      createdAt: new Date().toISOString(),
      usageCount: 0,
    });
    toast.success("Estratégia criada!");
    setNewName("");
    setNewLottery("");
    setNewMethod("");
    setNewQuantity(1);
  }

  function handleRun(strategyId: string) {
    const strategy = strategies.find((s) => s.id === strategyId);
    if (!strategy) return;

    const config = LOTTERIES[strategy.lottery];
    const games = generateGames({
      config,
      method: strategy.method,
      quantity: strategy.quantity,
      personalData: strategy.personalData,
      filters: strategy.filters,
    });
    addGeneratedGames(games);
    games.forEach((g) => saveGame(g));
    markUsed(strategyId);
    toast.success(
      `${games.length} jogo${games.length > 1 ? "s" : ""} gerado${games.length > 1 ? "s" : ""} com "${strategy.name}"!`
    );
    router.push(`/${strategy.lottery}/generate`);
  }

  function handleRemove(id: string) {
    removeStrategy(id);
    toast.success("Estratégia removida!");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Target className="h-8 w-8" />
            Minhas Estratégias
          </h1>
          <p className="text-muted-foreground mt-1">
            Salve e reutilize suas configurações favoritas de geração
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Estratégia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Estratégia</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Nome</Label>
                <Input
                  placeholder="Ex: Minha Mega da Sorte"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <Label>Loteria</Label>
                <Select value={newLottery} onValueChange={setNewLottery}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOTTERY_SLUGS.map((slug) => (
                      <SelectItem key={slug} value={slug}>
                        {LOTTERIES[slug].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Método de Geração</Label>
                <Select value={newMethod} onValueChange={setNewMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENERATION_METHODS.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantidade de jogos</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Number.parseInt(e.target.value) || 1)}
                />
              </div>
              <DialogClose asChild>
                <Button className="w-full" onClick={handleCreate}>
                  Criar Estratégia
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {strategies.length === 0 ? (
        <Card className="glass border-white/10">
          <CardContent className="p-12 text-center space-y-4">
            <Inbox className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <div>
              <h3 className="text-lg font-semibold">Nenhuma estratégia</h3>
              <p className="text-muted-foreground text-sm">
                Crie estratégias para gerar jogos rapidamente com suas configurações favoritas.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.map((strategy) => {
              const config = LOTTERIES[strategy.lottery];
              const methodInfo = GENERATION_METHODS.find(
                (m) => m.id === strategy.method
              );
              return (
                <motion.div
                  key={strategy.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="glass border-white/10 h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{strategy.name}</CardTitle>
                        <Badge variant="outline" className="text-[10px]">
                          {methodInfo?.name || strategy.method}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: config?.color }}
                        />
                        <span className="text-sm">{config?.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          {strategy.quantity} jogo{strategy.quantity > 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          {strategy.usageCount}x usado
                        </span>
                        {strategy.lastUsed && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(strategy.lastUsed).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleRun(strategy.id)}
                        >
                          <Play className="mr-1 h-3 w-3" />
                          Executar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(strategy.id)}
                          className="text-destructive hover:text-destructive"
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
