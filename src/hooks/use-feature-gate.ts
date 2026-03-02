import { useCallback } from "react";
import { useSubscriptionStore } from "@/stores/subscription.store";
import type { GenerationMethod } from "@/types/game";
import type { PlanFeatures } from "@/types/subscription";

export function useFeatureGate() {
  const {
    subscription,
    canUseMethod,
    canSaveMoreGames,
    canSaveMoreStrategies,
    canGenerateToday,
    isFeatureAvailable,
    isPremiumOrAbove,
    isPro,
    getFeatures,
  } = useSubscriptionStore();

  const checkMethod = useCallback(
    (method: GenerationMethod) => canUseMethod(method),
    [canUseMethod]
  );

  const checkFeature = useCallback(
    (feature: keyof PlanFeatures) => isFeatureAvailable(feature),
    [isFeatureAvailable]
  );

  return {
    tier: subscription.tier,
    features: getFeatures(),
    checkMethod,
    checkFeature,
    canSaveMoreGames,
    canSaveMoreStrategies,
    canGenerateToday,
    isPremiumOrAbove: isPremiumOrAbove(),
    isPro: isPro(),
  };
}
