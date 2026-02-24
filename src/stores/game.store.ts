import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GeneratedGame } from "@/types/game";

interface GameStore {
  generatedGames: GeneratedGame[];
  savedGames: GeneratedGame[];
  addGeneratedGames: (games: GeneratedGame[]) => void;
  clearGeneratedGames: () => void;
  saveGame: (game: GeneratedGame) => void;
  removeSavedGame: (id: string) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      generatedGames: [],
      savedGames: [],
      addGeneratedGames: (games) =>
        set((state) => ({
          generatedGames: [...games, ...state.generatedGames],
        })),
      clearGeneratedGames: () => set({ generatedGames: [] }),
      saveGame: (game) =>
        set((state) => ({
          savedGames: [
            { ...game, saved: true },
            ...state.savedGames.filter((g) => g.id !== game.id),
          ],
        })),
      removeSavedGame: (id) =>
        set((state) => ({
          savedGames: state.savedGames.filter((g) => g.id !== id),
        })),
    }),
    { name: "loto-games" }
  )
);
