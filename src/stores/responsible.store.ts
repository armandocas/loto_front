import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResponsibleGamingConfig, SpendingEntry } from "@/types/responsible-gaming";

interface ResponsibleStore {
  config: ResponsibleGamingConfig;
  spending: SpendingEntry[];
  updateConfig: (updates: Partial<ResponsibleGamingConfig>) => void;
  addSpending: (entry: SpendingEntry) => void;
  clearSpending: () => void;
  isPaused: () => boolean;
  isDailyLimitReached: (today: string) => boolean;
  isMonthlyLimitReached: () => boolean;
  getMonthlySpend: () => number;
  getTodayGamesCount: (today: string) => number;
}

export const useResponsibleStore = create<ResponsibleStore>()(
  persist(
    (set, get) => ({
      config: {
        monthlySpendLimit: 0,
        dailyGameLimit: 0,
        remindersEnabled: true,
      },
      spending: [],
      updateConfig: (updates) =>
        set((state) => ({
          config: { ...state.config, ...updates },
        })),
      addSpending: (entry) =>
        set((state) => ({
          spending: [entry, ...state.spending],
        })),
      clearSpending: () => set({ spending: [] }),
      isPaused: () => {
        const { config } = get();
        if (!config.pauseUntil) return false;
        return new Date(config.pauseUntil) > new Date();
      },
      isDailyLimitReached: (today) => {
        const { config, spending } = get();
        if (config.dailyGameLimit <= 0) return false;
        const todayCount = spending
          .filter((s) => s.date === today)
          .reduce((acc, s) => acc + s.gamesCount, 0);
        return todayCount >= config.dailyGameLimit;
      },
      isMonthlyLimitReached: () => {
        const { config } = get();
        if (config.monthlySpendLimit <= 0) return false;
        return get().getMonthlySpend() >= config.monthlySpendLimit;
      },
      getMonthlySpend: () => {
        const { spending } = get();
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        return spending
          .filter((s) => {
            const d = new Date(s.date);
            return d.getMonth() === month && d.getFullYear() === year;
          })
          .reduce((acc, s) => acc + s.estimatedCost, 0);
      },
      getTodayGamesCount: (today) => {
        const { spending } = get();
        return spending
          .filter((s) => s.date === today)
          .reduce((acc, s) => acc + s.gamesCount, 0);
      },
    }),
    { name: "loto-responsible" }
  )
);
