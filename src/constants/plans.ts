import type { PlanConfig, PlanTier, PlanFeatures } from "@/types/subscription";
import type { GenerationMethod } from "@/types/game";

export const PLANS: Record<PlanTier, PlanConfig> = {
  free: {
    tier: "free",
    name: "Gratuito",
    description: "Comece a gerar jogos agora",
    priceMonthly: 0,
    priceYearly: 0,
    badge: "FREE",
    color: "#6b7280",
    features: {
      maxDailyGenerations: 3,
      allowedMethods: "random-only",
      maxSavedGames: 10,
      maxStrategies: 0,
      advancedStats: false,
      exportEnabled: false,
      shareEnabled: false,
      calendarAccess: true,
      responsibleGaming: true,
      resultChecker: false,
      prioritySupport: false,
    },
  },
  premium: {
    tier: "premium",
    name: "Premium",
    description: "Todos os métodos, sem limites",
    priceMonthly: 14.9,
    priceYearly: 119.9,
    badge: "PREMIUM",
    color: "#8b5cf6",
    popular: true,
    features: {
      maxDailyGenerations: -1,
      allowedMethods: "all",
      maxSavedGames: -1,
      maxStrategies: 10,
      advancedStats: true,
      exportEnabled: true,
      shareEnabled: true,
      calendarAccess: true,
      responsibleGaming: true,
      resultChecker: true,
      prioritySupport: false,
    },
  },
  pro: {
    tier: "pro",
    name: "Pro",
    description: "O máximo para jogadores sérios",
    priceMonthly: 29.9,
    priceYearly: 249.9,
    badge: "PRO",
    color: "#f59e0b",
    features: {
      maxDailyGenerations: -1,
      allowedMethods: "all",
      maxSavedGames: -1,
      maxStrategies: -1,
      advancedStats: true,
      exportEnabled: true,
      shareEnabled: true,
      calendarAccess: true,
      responsibleGaming: true,
      resultChecker: true,
      prioritySupport: true,
    },
  },
};

const FREE_METHODS: Set<GenerationMethod> = new Set(["random"]);

const CLASSIC_METHODS: Set<GenerationMethod> = new Set([
  "random", "frequency", "hot-cold", "statistical", "smart-filter", "ai",
]);

export function isMethodAllowed(
  method: GenerationMethod,
  allowedMethods: PlanFeatures["allowedMethods"]
): boolean {
  switch (allowedMethods) {
    case "random-only":
      return FREE_METHODS.has(method);
    case "classic":
      return CLASSIC_METHODS.has(method);
    case "all":
      return true;
  }
}

export function getPlanSavings(plan: PlanConfig): number {
  if (plan.priceMonthly === 0) return 0;
  const yearlyIfMonthly = plan.priceMonthly * 12;
  return Math.round(((yearlyIfMonthly - plan.priceYearly) / yearlyIfMonthly) * 100);
}

export const PLAN_TIERS: PlanTier[] = ["free", "premium", "pro"];
