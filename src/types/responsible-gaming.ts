export interface ResponsibleGamingConfig {
  monthlySpendLimit: number;
  dailyGameLimit: number;
  pauseUntil?: string;
  remindersEnabled: boolean;
}

export interface SpendingEntry {
  date: string;
  lottery: string;
  gamesCount: number;
  estimatedCost: number;
}

export interface ResponsibleGamingStats {
  monthlySpend: number;
  dailyGamesGenerated: number;
  totalGamesThisMonth: number;
  history: SpendingEntry[];
}
