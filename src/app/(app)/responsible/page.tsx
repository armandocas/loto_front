"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  DollarSign,
  PauseCircle,
  AlertTriangle,
  Gamepad2,
  BarChart3,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useResponsibleStore } from "@/stores/responsible.store";

export default function ResponsiblePage() {
  const {
    config,
    updateConfig,
    isPaused,
    getMonthlySpend,
    getTodayGamesCount,
  } = useResponsibleStore();

  const paused = isPaused();
  const monthlySpend = getMonthlySpend();
  const todayStr = new Date().toISOString().split("T")[0];
  const todayGames = getTodayGamesCount(todayStr);
  const [pauseDays, setPauseDays] = useState(7);

  function handlePause() {
    const until = new Date();
    until.setDate(until.getDate() + pauseDays);
    updateConfig({ pauseUntil: until.toISOString() });
    toast.success(`Geração pausada por ${pauseDays} dias.`);
  }

  function handleResume() {
    updateConfig({ pauseUntil: undefined });
    toast.success("Pausa removida.");
  }

  const spendPercentage =
    config.monthlySpendLimit > 0
      ? Math.min((monthlySpend / config.monthlySpendLimit) * 100, 100)
      : 0;

  const gamePercentage =
    config.dailyGameLimit > 0
      ? Math.min((todayGames / config.dailyGameLimit) * 100, 100)
      : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-green-500" />
          Jogo Responsável
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure limites e proteja seu bem-estar financeiro
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-300">Lembre-se</p>
            <p className="text-xs text-amber-200/80 mt-1">
              Loterias são jogos de azar. Jogue com responsabilidade e nunca
              comprometa mais do que pode perder. O LotoSmart é uma ferramenta
              de auxílio, não uma garantia de ganho.
            </p>
          </div>
        </div>
      </motion.div>

      {paused && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PauseCircle className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-300">Geração pausada</p>
                <p className="text-xs text-red-200/60">
                  Até{" "}
                  {new Date(config.pauseUntil!).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleResume}>
              Retomar
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass border-white/10 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-5 w-5 text-green-500" />
                Limite Mensal de Gastos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Gasto estimado</span>
                  <span className="font-medium">
                    R$ {monthlySpend.toFixed(2)}
                    {config.monthlySpendLimit > 0 &&
                      ` / R$ ${config.monthlySpendLimit.toFixed(2)}`}
                  </span>
                </div>
                {config.monthlySpendLimit > 0 && (
                  <Progress value={spendPercentage} />
                )}
              </div>
              <div>
                <Label className="text-xs">Limite (R$) — 0 = sem limite</Label>
                <Input
                  type="number"
                  min={0}
                  step={10}
                  value={config.monthlySpendLimit}
                  onChange={(e) =>
                    updateConfig({
                      monthlySpendLimit: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="glass border-white/10 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Gamepad2 className="h-5 w-5 text-blue-500" />
                Limite Diário de Jogos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Jogos hoje</span>
                  <span className="font-medium">
                    {todayGames}
                    {config.dailyGameLimit > 0 && ` / ${config.dailyGameLimit}`}
                  </span>
                </div>
                {config.dailyGameLimit > 0 && (
                  <Progress value={gamePercentage} />
                )}
              </div>
              <div>
                <Label className="text-xs">Limite de jogos/dia — 0 = sem limite</Label>
                <Input
                  type="number"
                  min={0}
                  step={5}
                  value={config.dailyGameLimit}
                  onChange={(e) =>
                    updateConfig({
                      dailyGameLimit: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PauseCircle className="h-5 w-5 text-orange-500" />
              Pausa Voluntária
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Bloqueie a geração de jogos por um período. Você pode retomar a qualquer momento.
            </p>
            <div className="space-y-2">
              <Label className="text-xs">Dias de pausa: {pauseDays}</Label>
              <Slider
                min={1}
                max={90}
                step={1}
                value={[pauseDays]}
                onValueChange={(v) => setPauseDays(v[0])}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>1 dia</span>
                <span>90 dias</span>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handlePause}
              disabled={paused}
            >
              <PauseCircle className="mr-2 h-4 w-4" />
              Pausar por {pauseDays} dia{pauseDays > 1 ? "s" : ""}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-5 w-5 text-purple-500" />
              Lembretes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Lembretes de jogo responsável</Label>
                <p className="text-xs text-muted-foreground">
                  Exibir mensagens de consciência ao gerar jogos
                </p>
              </div>
              <Switch
                checked={config.remindersEnabled}
                onCheckedChange={(checked) =>
                  updateConfig({ remindersEnabled: checked })
                }
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
