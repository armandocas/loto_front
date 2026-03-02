import type { GeneratedGame, CheckedResult } from "@/types/game";
import type { LotteryResult } from "@/types/lottery";

export function checkGameAgainstResult(
  game: GeneratedGame,
  result: LotteryResult
): CheckedResult {
  const hits = game.numbers.filter((n) => result.numbers.includes(n));

  let prize: string | undefined;
  const hitCount = hits.length;

  const prizeThresholds: Record<string, number> = {
    megasena: 4,
    lotofacil: 11,
    quina: 2,
    lotomania: 0,
    timemania: 3,
    duplasena: 3,
    federal: 1,
    diadesorte: 4,
    supersete: 3,
    maismilionaria: 2,
  };

  const minForPrize = prizeThresholds[game.lottery] ?? 4;

  if (hitCount >= minForPrize) {
    const matched = result.prizes?.find(
      (p) => p.winners > 0 || p.tier.includes(hitCount.toString())
    );
    prize = matched?.tier || `${hitCount} acertos`;
  }

  return {
    gameId: game.id,
    contestNumber: result.contestNumber,
    hits,
    hitCount,
    prize,
  };
}

export function checkAllGamesAgainstResult(
  games: GeneratedGame[],
  result: LotteryResult
): CheckedResult[] {
  return games
    .filter((g) => g.lottery === result.lottery)
    .map((g) => checkGameAgainstResult(g, result));
}

export function getBestResult(results: CheckedResult[]): CheckedResult | null {
  if (results.length === 0) return null;
  return results.reduce((best, r) => (r.hitCount > best.hitCount ? r : best));
}
