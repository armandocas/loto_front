import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Strategy } from "@/types/strategy";

interface StrategyStore {
  strategies: Strategy[];
  addStrategy: (strategy: Strategy) => void;
  removeStrategy: (id: string) => void;
  updateStrategy: (id: string, updates: Partial<Strategy>) => void;
  markUsed: (id: string) => void;
}

export const useStrategyStore = create<StrategyStore>()(
  persist(
    (set) => ({
      strategies: [],
      addStrategy: (strategy) =>
        set((state) => ({
          strategies: [strategy, ...state.strategies],
        })),
      removeStrategy: (id) =>
        set((state) => ({
          strategies: state.strategies.filter((s) => s.id !== id),
        })),
      updateStrategy: (id, updates) =>
        set((state) => ({
          strategies: state.strategies.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),
      markUsed: (id) =>
        set((state) => ({
          strategies: state.strategies.map((s) =>
            s.id === id
              ? { ...s, lastUsed: new Date().toISOString(), usageCount: s.usageCount + 1 }
              : s
          ),
        })),
    }),
    { name: "loto-strategies" }
  )
);
