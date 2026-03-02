import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlanTier, UserSubscription, PlanFeatures } from "@/types/subscription";
import type { GenerationMethod } from "@/types/game";
import { PLANS, isMethodAllowed } from "@/constants/plans";

interface SubscriptionStore {
  subscription: UserSubscription;
  setSubscription: (sub: UserSubscription) => void;
  upgradeTo: (tier: PlanTier, cycle: "monthly" | "yearly") => void;
  getFeatures: () => PlanFeatures;
  canUseMethod: (method: GenerationMethod) => boolean;
  canSaveMoreGames: (currentCount: number) => boolean;
  canSaveMoreStrategies: (currentCount: number) => boolean;
  canGenerateToday: (todayCount: number) => boolean;
  isFeatureAvailable: (feature: keyof PlanFeatures) => boolean;
  isPremiumOrAbove: () => boolean;
  isPro: () => boolean;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      subscription: {
        tier: "free" as PlanTier,
        startedAt: new Date().toISOString(),
        billingCycle: "monthly" as const,
      },

      setSubscription: (sub) => set({ subscription: sub }),

      upgradeTo: (tier, cycle) =>
        set({
          subscription: {
            tier,
            startedAt: new Date().toISOString(),
            billingCycle: cycle,
            expiresAt: new Date(
              Date.now() + (cycle === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        }),

      getFeatures: () => PLANS[get().subscription.tier].features,

      canUseMethod: (method) => {
        const features = get().getFeatures();
        return isMethodAllowed(method, features.allowedMethods);
      },

      canSaveMoreGames: (currentCount) => {
        const { maxSavedGames } = get().getFeatures();
        return maxSavedGames < 0 || currentCount < maxSavedGames;
      },

      canSaveMoreStrategies: (currentCount) => {
        const { maxStrategies } = get().getFeatures();
        return maxStrategies < 0 || currentCount < maxStrategies;
      },

      canGenerateToday: (todayCount) => {
        const { maxDailyGenerations } = get().getFeatures();
        return maxDailyGenerations < 0 || todayCount < maxDailyGenerations;
      },

      isFeatureAvailable: (feature) => {
        const features = get().getFeatures();
        const val = features[feature];
        if (typeof val === "boolean") return val;
        if (typeof val === "number") return val !== 0;
        return val !== "random-only";
      },

      isPremiumOrAbove: () => {
        const { tier } = get().subscription;
        return tier === "premium" || tier === "pro";
      },

      isPro: () => get().subscription.tier === "pro",
    }),
    { name: "loto-subscription" }
  )
);
