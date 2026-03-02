"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Check, Zap, Star, X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS, getPlanSavings, PLAN_TIERS } from "@/constants/plans";
import { useSubscriptionStore } from "@/stores/subscription.store";
import type { PlanTier } from "@/types/subscription";

const FEATURE_LIST = [
  { key: "maxDailyGenerations", label: "Gerações por dia", format: (v: number) => v < 0 ? "Ilimitadas" : `${v} por dia` },
  { key: "allowedMethods", label: "Métodos de geração", format: (v: string) => v === "random-only" ? "Apenas aleatório" : v === "classic" ? "6 clássicos" : "Todos os 18" },
  { key: "maxSavedGames", label: "Jogos salvos", format: (v: number) => v < 0 ? "Ilimitados" : `Até ${v}` },
  { key: "maxStrategies", label: "Estratégias salvas", format: (v: number) => v < 0 ? "Ilimitadas" : v === 0 ? "Não disponível" : `Até ${v}` },
  { key: "advancedStats", label: "Estatísticas avançadas" },
  { key: "exportEnabled", label: "Exportar jogos (CSV/Imagem)" },
  { key: "shareEnabled", label: "Compartilhar (WhatsApp)" },
  { key: "resultChecker", label: "Conferência automática" },
  { key: "calendarAccess", label: "Calendário de sorteios" },
  { key: "responsibleGaming", label: "Jogo responsável" },
  { key: "prioritySupport", label: "Suporte prioritário" },
] as const;

export default function PricingPage() {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("yearly");
  const { upgradeTo, subscription } = useSubscriptionStore();

  function handleUpgrade(tier: PlanTier) {
    if (tier === "free") return;
    upgradeTo(tier, cycle);
    toast.success(`Plano ${PLANS[tier].name} ativado com sucesso! (simulação)`);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Crown className="h-10 w-10 text-yellow-500" />
          Escolha seu Plano
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Desbloqueie todo o potencial do LotoSmart
        </p>
      </motion.div>

      <div className="flex items-center justify-center gap-3">
        <Button
          variant={cycle === "monthly" ? "default" : "ghost"}
          onClick={() => setCycle("monthly")}
        >
          Mensal
        </Button>
        <Button
          variant={cycle === "yearly" ? "default" : "ghost"}
          onClick={() => setCycle("yearly")}
          className="relative"
        >
          Anual
          <Badge className="absolute -top-2 -right-6 text-[9px] bg-green-500 text-white">
            ECONOMIZE
          </Badge>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {PLAN_TIERS.map((tier, i) => {
          const plan = PLANS[tier];
          const price = cycle === "yearly" && plan.priceYearly > 0
            ? (plan.priceYearly / 12).toFixed(2)
            : plan.priceMonthly.toFixed(2);
          const savings = getPlanSavings(plan);
          const isCurrent = subscription.tier === tier;

          return (
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
            >
              <Card
                className={`relative glass h-full transition-all ${
                  plan.popular
                    ? "border-purple-500/50 ring-2 ring-purple-500/20 scale-[1.02]"
                    : "border-white/10"
                } ${isCurrent ? "ring-2 ring-green-500/30" : ""}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-3">
                    <Sparkles className="h-3 w-3 mr-1" />
                    MAIS POPULAR
                  </Badge>
                )}
                {isCurrent && (
                  <Badge className="absolute -top-3 right-4 bg-green-500 text-white px-3">
                    SEU PLANO
                  </Badge>
                )}

                <CardHeader className="text-center pb-2">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {tier === "free" && <Crown className="h-6 w-6 text-gray-400" />}
                    {tier === "premium" && <Zap className="h-6 w-6 text-purple-500" />}
                    {tier === "pro" && <Star className="h-6 w-6 text-yellow-500" />}
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      {plan.priceMonthly === 0 ? (
                        <span className="text-4xl font-bold">Grátis</span>
                      ) : (
                        <>
                          <span className="text-sm text-muted-foreground">R$</span>
                          <span className="text-4xl font-bold">{price}</span>
                          <span className="text-sm text-muted-foreground">/mês</span>
                        </>
                      )}
                    </div>
                    {cycle === "yearly" && savings > 0 && (
                      <p className="text-xs text-green-400 mt-1">
                        Economia de {savings}% — R$ {plan.priceYearly.toFixed(2)}/ano
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    {FEATURE_LIST.map((feat) => {
                      const value = plan.features[feat.key as keyof typeof plan.features];
                      const isAvailable = typeof value === "boolean"
                        ? value
                        : typeof value === "number"
                          ? value !== 0
                          : value !== "random-only";

                      const displayValue = "format" in feat && typeof feat.format === "function"
                        ? feat.format(value as never)
                        : undefined;

                      return (
                        <div key={feat.key} className="flex items-center gap-2.5 text-sm">
                          {isAvailable ? (
                            <Check className="h-4 w-4 text-green-500 shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground/30 shrink-0" />
                          )}
                          <span className={isAvailable ? "" : "text-muted-foreground/50"}>
                            {feat.label}
                            {displayValue && (
                              <span className="text-muted-foreground ml-1 text-xs">
                                ({displayValue})
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    variant={plan.popular ? "default" : tier === "pro" ? "default" : "outline"}
                    disabled={isCurrent}
                    onClick={() => handleUpgrade(tier)}
                    style={
                      tier === "pro"
                        ? { background: "linear-gradient(135deg, #f59e0b, #d97706)" }
                        : undefined
                    }
                  >
                    {isCurrent
                      ? "Plano atual"
                      : tier === "free"
                        ? "Plano atual"
                        : `Assinar ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center space-y-2"
      >
        <p className="text-sm text-muted-foreground">
          Cancele a qualquer momento. Sem compromisso.
        </p>
        <p className="text-[10px] text-muted-foreground/60">
          Pagamento simulado nesta versão. Integração com gateway em breve.
        </p>
      </motion.div>
    </div>
  );
}
