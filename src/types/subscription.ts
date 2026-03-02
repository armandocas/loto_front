export type PlanTier = "free" | "premium" | "pro";

export interface PlanFeatures {
  maxDailyGenerations: number;
  allowedMethods: "random-only" | "classic" | "all";
  maxSavedGames: number;
  maxStrategies: number;
  advancedStats: boolean;
  exportEnabled: boolean;
  shareEnabled: boolean;
  calendarAccess: boolean;
  responsibleGaming: boolean;
  resultChecker: boolean;
  prioritySupport: boolean;
}

export interface PlanConfig {
  tier: PlanTier;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: PlanFeatures;
  badge: string;
  color: string;
  popular?: boolean;
}

export interface UserSubscription {
  tier: PlanTier;
  startedAt: string;
  expiresAt?: string;
  billingCycle: "monthly" | "yearly";
}
