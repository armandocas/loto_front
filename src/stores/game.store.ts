import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GeneratedGame, CheckedResult } from "@/types/game";

interface GameStore {
  generatedGames: GeneratedGame[];
  savedGames: GeneratedGame[];
  addGeneratedGames: (games: GeneratedGame[]) => void;
  clearGeneratedGames: () => void;
  saveGame: (game: GeneratedGame) => void;
  removeSavedGame: (id: string) => void;
  addCheckedResult: (gameId: string, result: CheckedResult) => void;
  getCheckedResults: (gameId: string) => CheckedResult[];
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
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
      addCheckedResult: (gameId, result) =>
        set((state) => ({
          savedGames: state.savedGames.map((g) =>
            g.id === gameId
              ? {
                  ...g,
                  checkedResults: [
                    ...(g.checkedResults || []).filter(
                      (r) => r.contestNumber !== result.contestNumber
                    ),
                    result,
                  ],
                }
              : g
          ),
        })),
      getCheckedResults: (gameId) => {
        const game = get().savedGames.find((g) => g.id === gameId);
        return game?.checkedResults || [];
      },
    }),
    { name: "loto-games" }
  )
);
