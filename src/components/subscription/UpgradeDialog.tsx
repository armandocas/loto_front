"use client";

import { useState } from "react";
import { Crown, Check, Zap, Star } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS, getPlanSavings, PLAN_TIERS } from "@/constants/plans";
import { useSubscriptionStore } from "@/stores/subscription.store";
import type { PlanTier } from "@/types/subscription";

interface UpgradeDialogProps {
  trigger?: React.ReactNode;
  reason?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const FEATURE_LABELS: Record<string, string> = {
  maxDailyGenerations: "Gerações por dia",
  allowedMethods: "Métodos de geração",
  maxSavedGames: "Jogos salvos",
  maxStrategies: "Estratégias salvas",
  advancedStats: "Estatísticas avançadas",
  exportEnabled: "Exportar jogos",
  shareEnabled: "Compartilhar jogos",
  resultChecker: "Conferência automática",
  prioritySupport: "Suporte prioritário",
};

function formatFeatureValue(key: string, value: unknown): string {
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  if (typeof value === "number") return value < 0 ? "Ilimitado" : value.toString();
  if (value === "random-only") return "Apenas aleatório";
  if (value === "classic") return "6 clássicos";
  if (value === "all") return "Todos (18)";
  return String(value);
}

export function UpgradeDialog({ trigger, reason, open, onOpenChange }: UpgradeDialogProps) {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("yearly");
  const { upgradeTo, subscription } = useSubscriptionStore();

  function handleUpgrade(tier: PlanTier) {
    upgradeTo(tier, cycle);
    toast.success(`Plano ${PLANS[tier].name} ativado! (simulação)`);
    onOpenChange?.(false);
  }

  const filteredTiers = PLAN_TIERS.filter((t) => t !== "free");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Crown className="h-6 w-6 text-yellow-500" />
            Desbloqueie todo o potencial
          </DialogTitle>
        </DialogHeader>

        {reason && (
          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
            {reason}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 my-2">
          <Button
            variant={cycle === "monthly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCycle("monthly")}
          >
            Mensal
          </Button>
          <Button
            variant={cycle === "yearly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCycle("yearly")}
            className="relative"
          >
            Anual
            <Badge className="absolute -top-2 -right-4 text-[9px] bg-green-500">
              Economia
            </Badge>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {filteredTiers.map((tier) => {
            const plan = PLANS[tier];
            const price = cycle === "yearly"
              ? (plan.priceYearly / 12).toFixed(2)
              : plan.priceMonthly.toFixed(2);
            const savings = getPlanSavings(plan);
            const isCurrent = subscription.tier === tier;

            return (
              <div
                key={tier}
                className={`relative rounded-xl border p-5 space-y-4 transition-all ${
                  plan.popular
                    ? "border-purple-500/50 bg-purple-500/5 ring-1 ring-purple-500/20"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px]">
                    MAIS POPULAR
                  </Badge>
                )}

                <div className="flex items-center gap-2">
                  {tier === "premium" ? (
                    <Zap className="h-5 w-5 text-purple-500" />
                  ) : (
                    <Star className="h-5 w-5 text-yellow-500" />
                  )}
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">R$ {price}</span>
                    <span className="text-sm text-muted-foreground">/mês</span>
                  </div>
                  {cycle === "yearly" && savings > 0 && (
                    <p className="text-xs text-green-400 mt-1">
                      Economia de {savings}% no plano anual (R$ {plan.priceYearly.toFixed(2)}/ano)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  {Object.entries(FEATURE_LABELS).map(([key, label]) => {
                    const value = plan.features[key as keyof typeof plan.features];
                    const isPositive = typeof value === "boolean" ? value : typeof value === "number" ? value !== 0 : value !== "random-only";

                    return (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        <Check
                          className={`h-3.5 w-3.5 shrink-0 ${
                            isPositive ? "text-green-500" : "text-muted-foreground/30"
                          }`}
                        />
                        <span className={isPositive ? "" : "text-muted-foreground/50"}>
                          {label}: <strong>{formatFeatureValue(key, value)}</strong>
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  disabled={isCurrent}
                  onClick={() => handleUpgrade(tier)}
                >
                  {isCurrent ? "Plano atual" : `Assinar ${plan.name}`}
                </Button>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Pagamento simulado. Integração com Stripe/MercadoPago em breve.
        </p>
      </DialogContent>
    </Dialog>
  );
}
