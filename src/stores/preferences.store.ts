import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LotterySlug } from "@/types/lottery";

type PlayStyle = "casual" | "strategic" | "data-driven";

interface PreferencesStore {
  onboardingCompleted: boolean;
  favoriteLotteries: LotterySlug[];
  playStyle: PlayStyle | null;
  completeOnboarding: () => void;
  setFavoriteLotteries: (slugs: LotterySlug[]) => void;
  toggleFavoriteLottery: (slug: LotterySlug) => void;
  setPlayStyle: (style: PlayStyle) => void;
  isFavorite: (slug: LotterySlug) => boolean;
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set, get) => ({
      onboardingCompleted: false,
      favoriteLotteries: [],
      playStyle: null,

      completeOnboarding: () => set({ onboardingCompleted: true }),

      setFavoriteLotteries: (slugs) => set({ favoriteLotteries: slugs }),

      toggleFavoriteLottery: (slug) => {
        const current = get().favoriteLotteries;
        const next = current.includes(slug)
          ? current.filter((s) => s !== slug)
          : [...current, slug];
        set({ favoriteLotteries: next });
      },

      setPlayStyle: (style) => set({ playStyle: style }),

      isFavorite: (slug) => get().favoriteLotteries.includes(slug),
    }),
    { name: "loto-preferences" }
  )
);
